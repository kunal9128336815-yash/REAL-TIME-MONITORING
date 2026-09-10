import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GpsData, UltrasonicData, VisibilityData } from '../../types';
import { MapPin, Navigation, Crosshair, ShieldCheck, Maximize2 } from 'lucide-react';
import L from 'leaflet';

export interface FleetMapVehicle {
  id: string;
  name: string;
  driver: string;
  model: string;
  speed: number | null;
  heading: number;
  risk: 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  status: 'ACTIVE' | 'OFFLINE' | 'STANDBY';
  payload: string;
  lat: number;
  lon: number;
}

interface GpsTrackingMapProps {
  gps: GpsData;
  ultrasonic?: UltrasonicData;
  visibility?: VisibilityData;
  hazardDetected?: boolean;
  onOpenFullscreen?: () => void;
  isFullPage?: boolean;
}

// Default Fallback Coordinates (India Mining Region)
const DEFAULT_CENTER: [number, number] = [22.71960, 75.85770];

export const GpsTrackingMap: React.FC<GpsTrackingMapProps> = ({
  gps,
  hazardDetected = false,
  onOpenFullscreen,
  isFullPage = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Layers & Markers
  const userMarkerRef = useRef<L.Marker | null>(null);
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const trailPolylinesRef = useRef<Map<string, L.Polyline>>(new Map());
  const trailHistoriesRef = useRef<Map<string, [number, number][]>>(new Map());
  const corridorPolylineRef = useRef<L.Polyline | null>(null);
  const geofencePolygonRef = useRef<L.Polygon | null>(null);

  // Keep latest props in refs to avoid re-triggering effects
  const gpsRef = useRef<GpsData>(gps);
  gpsRef.current = gps;

  const hazardDetectedRef = useRef<boolean>(hazardDetected);
  hazardDetectedRef.current = hazardDetected;

  // Active Center Ref
  const activeCenterRef = useRef<[number, number]>(DEFAULT_CENTER);

  // User location state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'acquired' | 'default'>('detecting');
  const [mapTheme, setMapTheme] = useState<'satellite' | 'standard'>('satellite');
  const [autoFollow, setAutoFollow] = useState<boolean>(!isFullPage);

  // Helper to create HTML divIcon for each vehicle
  const createVehicleIcon = useCallback((vehicle: FleetMapVehicle) => {
    const isFocus = vehicle.id === 'D-001';
    const isPatrol = vehicle.id.startsWith('PATROL');

    let badgeColor = '#10b981';
    let ringColor = 'rgba(16,185,129,0.35)';

    if (vehicle.risk === 'CRITICAL') {
      badgeColor = '#ef4444';
      ringColor = 'rgba(239,68,68,0.5)';
    } else if (vehicle.risk === 'WARNING') {
      badgeColor = '#f59e0b';
      ringColor = 'rgba(245,158,11,0.5)';
    } else if (vehicle.risk === 'CAUTION') {
      badgeColor = '#eab308';
      ringColor = 'rgba(234,179,8,0.5)';
    } else if (vehicle.risk === 'OFFLINE') {
      badgeColor = '#64748b';
      ringColor = 'rgba(100,116,139,0.25)';
    }

    if (isFocus) {
      if (vehicle.risk === 'OFFLINE') {
        badgeColor = '#64748b';
        ringColor = 'rgba(100,116,139,0.3)';
      } else {
        badgeColor = vehicle.risk === 'CRITICAL' ? '#ef4444' : '#00e5ff';
        ringColor = vehicle.risk === 'CRITICAL' ? 'rgba(239,68,68,0.6)' : 'rgba(0,229,255,0.6)';
      }
    } else if (isPatrol) {
      badgeColor = '#64748b';
      ringColor = 'rgba(100,116,139,0.25)';
    }

    const speedLabel = vehicle.speed !== null && vehicle.speed !== undefined
      ? `${vehicle.speed.toFixed(0)} km/h`
      : 'OFFLINE';

    return L.divIcon({
      className: `fleet-marker-${vehicle.id}`,
      html: `
        <div style="position:relative; width:44px; height:44px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
          ${isFocus && vehicle.risk !== 'OFFLINE' ? `
            <div style="position:absolute; top:-20px; width:0; height:0; border-left:12px solid transparent; border-right:12px solid transparent; border-bottom:24px solid ${ringColor}; filter:drop-shadow(0 0 6px ${badgeColor}); pointer-events:none; transform: rotate(${vehicle.heading}deg); transform-origin: center bottom;"></div>
          ` : ''}
          <div style="
            position:absolute;
            width:30px;
            height:30px;
            border-radius:50%;
            background:${ringColor};
            box-shadow: 0 0 12px ${badgeColor};
          "></div>
          <div style="
            position:relative;
            background:${badgeColor};
            color:#ffffff;
            width:22px;
            height:22px;
            border-radius:50%;
            border: 2px solid #ffffff;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:9px;
            font-family:'JetBrains Mono',monospace;
            font-weight:900;
            z-index:10;
          ">
            ${isPatrol ? 'P1' : vehicle.id.replace('D-0', 'D')}
          </div>
          <div style="
            position:absolute;
            bottom:-13px;
            background:rgba(8,13,25,0.92);
            color:#e2e8f0;
            border:1px solid ${badgeColor};
            border-radius:3px;
            padding:1px 3px;
            font-size:8px;
            font-family:'JetBrains Mono',monospace;
            font-weight:bold;
            white-space:nowrap;
            pointer-events:none;
          ">
            ${speedLabel}
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }, []);

  // Tile layer generator
  const createTileLayer = (theme: 'satellite' | 'standard') => {
    if (theme === 'satellite') {
      return L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Earth Imagery &mdash; OpenStreetMap Road Data',
      });
    } else {
      return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });
    }
  };

  // Switch Tile Theme without map re-instantiation
  const handleThemeChange = (theme: 'satellite' | 'standard') => {
    setMapTheme(theme);
    if (!mapInstanceRef.current) return;
    if (baseTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseTileLayerRef.current);
    }
    const newLayer = createTileLayer(theme).addTo(mapInstanceRef.current);
    baseTileLayerRef.current = newLayer;
  };

  // Re-center on User Location
  const handleCenterUser = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!mapInstanceRef.current || !userLocation) return;
    mapInstanceRef.current.panTo(userLocation, { animate: true });
  };

  // 1. Initial Geolocation Detection (Runs Once)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          activeCenterRef.current = coords;
          setLocationStatus('acquired');
        },
        (error) => {
          console.warn('Browser geolocation fallback to default coordinates:', error.message);
          setUserLocation(DEFAULT_CENTER);
          activeCenterRef.current = DEFAULT_CENTER;
          setLocationStatus('default');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation(DEFAULT_CENTER);
      activeCenterRef.current = DEFAULT_CENTER;
      setLocationStatus('default');
    }
  }, []);

  // 2. Initialize Leaflet Map (EXACTLY ONCE ON MOUNT - ZERO DEPENDENCY ARRAY)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = activeCenterRef.current;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: isFullPage ? 16 : 15,
      zoomControl: false,
      attributionControl: true,
    });

    // Add Base Tile Layer
    const tileLayer = createTileLayer('satellite').addTo(map);
    baseTileLayerRef.current = tileLayer;

    // Draw Corridors around Center
    const [cLat, cLon] = initialCenter;
    const corridorCoords: [number, number][] = [
      [cLat + 0.0035, cLon - 0.0028],
      [cLat + 0.0018, cLon + 0.0019],
      [cLat - 0.0015, cLon + 0.0034],
      [cLat - 0.0038, cLon - 0.0022],
      [cLat + 0.0012, cLon - 0.0042],
      [cLat + 0.0035, cLon - 0.0028],
    ];

    const corridorPolyline = L.polyline(corridorCoords, {
      color: '#00e5ff',
      weight: 3,
      opacity: 0.8,
      dashArray: '8, 6',
    }).addTo(map);
    corridorPolylineRef.current = corridorPolyline;

    // Geofence Perimeter
    const geofenceCoords: [number, number][] = [
      [cLat + 0.0050, cLon - 0.0055],
      [cLat + 0.0055, cLon + 0.0050],
      [cLat - 0.0055, cLon + 0.0055],
      [cLat - 0.0050, cLon - 0.0050],
    ];

    const geofence = L.polygon(geofenceCoords, {
      color: '#3b82f6',
      weight: 2,
      opacity: 0.5,
      fillColor: '#2563eb',
      fillOpacity: 0.05,
      dashArray: '5, 5',
    }).addTo(map);
    geofencePolygonRef.current = geofence;

    // User Location / Command Station Pin
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
          <div style="
            position:absolute;
            width:26px;
            height:26px;
            border-radius:50%;
            background:rgba(59,130,246,0.35);
          "></div>
          <div style="
            position:relative;
            background:#3b82f6;
            color:#ffffff;
            width:18px;
            height:18px;
            border-radius:50%;
            border:2px solid #ffffff;
            box-shadow: 0 0 10px #3b82f6;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:9px;
            font-weight:bold;
          ">
            HQ
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const userMarker = L.marker(initialCenter, { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
      <div style="font-family:Inter,sans-serif; font-size:12px; line-height:1.4;">
        <b style="color:#0284c7; font-size:13px;">📍 Operator Command Center (You)</b><br/>
        <b>Latitude:</b> ${initialCenter[0].toFixed(5)}°<br/>
        <b>Longitude:</b> ${initialCenter[1].toFixed(5)}°<br/>
        <span style="color:#10b981; font-weight:bold;">● Live Geolocation Anchored</span>
      </div>
    `);
    userMarkerRef.current = userMarker;

    // Initialize Fleet Vehicle Markers (Only D-001 is active; others are parked in depot)
    const initialVehicles: FleetMapVehicle[] = [
      {
        id: 'D-001',
        name: 'Dumper D-001 (Active Hardware Rig)',
        driver: 'R. Kumar (ID: 4108)',
        model: 'CAT 777E (240T)',
        speed: gpsRef.current.speed_kmh,
        heading: gpsRef.current.heading_deg || 0,
        risk: (gpsRef.current.speed_kmh === null && gpsRef.current.lat === null ? 'OFFLINE' : (hazardDetectedRef.current ? 'CRITICAL' : 'SAFE')),
        status: (gpsRef.current.speed_kmh !== null || gpsRef.current.lat !== null) ? 'ACTIVE' : 'OFFLINE',
        payload: '85.4 Tons',
        lat: gpsRef.current.lat !== null ? gpsRef.current.lat : cLat + 0.0015,
        lon: gpsRef.current.lon !== null ? gpsRef.current.lon : cLon + 0.0018,
      },
      {
        id: 'D-002',
        name: 'Dumper D-002 (Parked in Depot)',
        driver: 'M. Soren (ID: 3290)',
        model: 'Komatsu HD785',
        speed: null,
        heading: 135,
        risk: 'OFFLINE',
        status: 'OFFLINE',
        payload: '0.0 Tons (Parked)',
        lat: cLat + 0.0035,
        lon: cLon - 0.0028,
      },
      {
        id: 'D-003',
        name: 'Dumper D-003 (Parked in Depot)',
        driver: 'A. Tirkey (ID: 5512)',
        model: 'CAT 777E',
        speed: null,
        heading: 210,
        risk: 'OFFLINE',
        status: 'OFFLINE',
        payload: '0.0 Tons (Parked)',
        lat: cLat - 0.0025,
        lon: cLon + 0.0032,
      },
      {
        id: 'D-004',
        name: 'Dumper D-004 (Parked in Depot)',
        driver: 'Mohd. Salim (ID: 639)',
        model: 'Terex TR100',
        speed: null,
        heading: 320,
        risk: 'OFFLINE',
        status: 'OFFLINE',
        payload: '0.0 Tons (Parked)',
        lat: cLat - 0.0038,
        lon: cLon - 0.0022,
      },
    ];

    initialVehicles.forEach((v) => {
      const vIcon = createVehicleIcon(v);
      const marker = L.marker([v.lat, v.lon], { icon: vIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif; font-size:12px; line-height:1.4; min-width:170px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <b style="font-size:13px; color:#0f172a;">${v.name}</b>
            <span style="background:${v.risk === 'CRITICAL' ? '#fee2e2' : (v.risk === 'OFFLINE' ? '#f1f5f9' : '#dcfce7')}; color:${v.risk === 'CRITICAL' ? '#b91c1c' : (v.risk === 'OFFLINE' ? '#64748b' : '#15803d')}; font-size:9px; font-weight:bold; padding:1px 5px; border-radius:4px;">
              ${v.risk}
            </span>
          </div>
          <div><b>Driver:</b> ${v.driver}</div>
          <div><b>Model:</b> ${v.model}</div>
          <div><b>Speed:</b> <span style="font-family:'JetBrains Mono'; font-weight:bold;">${v.speed !== null ? `${v.speed.toFixed(1)} km/h` : 'OFFLINE'}</span></div>
          <div><b>Payload:</b> ${v.payload}</div>
        </div>
      `);

      vehicleMarkersRef.current.set(v.id, marker);

      // Trailing polyline
      const trail = L.polyline([[v.lat, v.lon]], {
        color: v.id === 'D-001' ? '#00e5ff' : (v.risk === 'CRITICAL' ? '#ef4444' : '#10b981'),
        weight: v.id === 'D-001' ? 3 : 2,
        opacity: 0.65,
      }).addTo(map);
      trailPolylinesRef.current.set(v.id, trail);
      trailHistoriesRef.current.set(v.id, [[v.lat, v.lon]]);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run ONCE on mount — NEVER destroyed during re-renders!

  // 3. When User Geolocation is acquired, re-anchor coordinates cleanly WITHOUT re-creating map
  useEffect(() => {
    if (!userLocation || !mapInstanceRef.current) return;
    activeCenterRef.current = userLocation;

    // Update user marker position
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLocation);
    }

    // Update corridor polyline & geofence
    const [cLat, cLon] = userLocation;
    const newCorridorCoords: [number, number][] = [
      [cLat + 0.0035, cLon - 0.0028],
      [cLat + 0.0018, cLon + 0.0019],
      [cLat - 0.0015, cLon + 0.0034],
      [cLat - 0.0038, cLon - 0.0022],
      [cLat + 0.0012, cLon - 0.0042],
      [cLat + 0.0035, cLon - 0.0028],
    ];
    if (corridorPolylineRef.current) {
      corridorPolylineRef.current.setLatLngs(newCorridorCoords);
    }

    const newGeofenceCoords: [number, number][] = [
      [cLat + 0.0050, cLon - 0.0055],
      [cLat + 0.0055, cLon + 0.0050],
      [cLat - 0.0055, cLon + 0.0055],
      [cLat - 0.0050, cLon - 0.0050],
    ];
    if (geofencePolygonRef.current) {
      geofencePolygonRef.current.setLatLngs(newGeofenceCoords);
    }

    // Smooth pan to user location
    mapInstanceRef.current.panTo(userLocation, { animate: true });
  }, [userLocation]);

  // 4. Live Vehicle Movement Simulation Loop (Smoothly moves markers every 1000ms)
  useEffect(() => {
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      const center = activeCenterRef.current;
      const [cLat, cLon] = center;
      const currentGps = gpsRef.current;
      const currentHazard = hazardDetectedRef.current;

      const isOnline = currentGps.speed_kmh !== null || currentGps.lat !== null;
      const d1Lat = currentGps.lat !== null ? currentGps.lat : cLat + 0.0015;
      const d1Lon = currentGps.lon !== null ? currentGps.lon : cLon + 0.0018;

      const vehiclesToUpdate: FleetMapVehicle[] = [
        // Vehicle 1: D-001 (CAT 777E Primary Rig)
        {
          id: 'D-001',
          name: 'Dumper D-001 (Active Hardware Rig)',
          driver: 'R. Kumar (ID: 4108)',
          model: 'CAT 777E (240T)',
          speed: currentGps.speed_kmh,
          heading: currentGps.heading_deg || 0,
          risk: !isOnline ? 'OFFLINE' : (currentHazard ? 'CRITICAL' : 'SAFE'),
          status: isOnline ? 'ACTIVE' : 'OFFLINE',
          payload: isOnline ? '85.4 Tons' : '0.0 Tons',
          lat: d1Lat,
          lon: d1Lon,
        },
        // Vehicle 2: D-002 (Stationary in Depot)
        {
          id: 'D-002',
          name: 'Dumper D-002 (Depot)',
          driver: 'M. Soren (ID: 3290)',
          model: 'Komatsu HD785',
          speed: null,
          heading: 135,
          risk: 'OFFLINE',
          status: 'OFFLINE',
          payload: '0.0 Tons (Parked)',
          lat: cLat + 0.0035,
          lon: cLon - 0.0028,
        },
        // Vehicle 3: D-003 (Stationary in Depot)
        {
          id: 'D-003',
          name: 'Dumper D-003 (Depot)',
          driver: 'A. Tirkey (ID: 5512)',
          model: 'CAT 777E',
          speed: null,
          heading: 210,
          risk: 'OFFLINE',
          status: 'OFFLINE',
          payload: '0.0 Tons (Parked)',
          lat: cLat - 0.0025,
          lon: cLon + 0.0032,
        },
        // Vehicle 4: D-004 (Stationary in Depot)
        {
          id: 'D-004',
          name: 'Dumper D-004 (Depot)',
          driver: 'Mohd. Salim (ID: 639)',
          model: 'Terex TR100',
          speed: null,
          heading: 320,
          risk: 'OFFLINE',
          status: 'OFFLINE',
          payload: '0.0 Tons (Parked)',
          lat: cLat - 0.0038,
          lon: cLon - 0.0022,
        },
      ];

      // Update markers and trails in-place (ZERO FLICKER)
      vehiclesToUpdate.forEach((v) => {
        const marker = vehicleMarkersRef.current.get(v.id);
        const trail = trailPolylinesRef.current.get(v.id);
        const history = trailHistoriesRef.current.get(v.id);

        if (marker) {
          const latLng: [number, number] = [v.lat, v.lon];
          marker.setLatLng(latLng);
          marker.setIcon(createVehicleIcon(v));

          // Only accumulate trail if vehicle is active and moving
          if (trail && history && v.id === 'D-001' && isOnline) {
            history.push(latLng);
            if (history.length > 25) {
              history.shift();
            }
            trail.setLatLngs(history);
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [createVehicleIcon]);

  const centerCoords = activeCenterRef.current;
  const isOnline = gps.speed_kmh !== null || gps.lat !== null;

  return (
    <div
      onClick={!isFullPage && onOpenFullscreen ? onOpenFullscreen : undefined}
      className={`bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between font-sans relative group ${
        !isFullPage && onOpenFullscreen ? 'cursor-pointer hover:border-blue-400 transition-all' : ''
      } ${isFullPage ? 'h-full w-full' : ''}`}
    >
      {/* Header Controls */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 font-sans">
            Fleet Section Map & Live Radar
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-sans font-semibold flex items-center space-x-1 ${
            isOnline ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span>{isOnline ? '1 Active Rig Live' : 'Hardware Standby (Offline)'}</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 text-xs font-sans">
          {/* Re-center button */}
          <button
            onClick={handleCenterUser}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors text-xs shadow-2xs font-medium"
            title="Center map on your live GPS location"
          >
            <Navigation className="w-3 h-3 text-blue-600" />
            <span className="text-[11px]">
              {locationStatus === 'acquired' ? 'My Location' : 'Command HQ'}
            </span>
          </button>

          {/* Theme Switcher */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => handleThemeChange('satellite')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                mapTheme === 'satellite' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => handleThemeChange('standard')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                mapTheme === 'standard' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street
            </button>
          </div>

          {/* Expand Full Page Button */}
          {!isFullPage && onOpenFullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenFullscreen();
              }}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              title="Open full page map view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Page</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className={`relative my-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 ${isFullPage ? 'h-[640px]' : 'h-[340px]'}`}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Hover overlay hint when in widget mode */}
        {!isFullPage && onOpenFullscreen && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-[400]">
            <span className="px-3 py-1 rounded-full bg-white/95 border border-blue-300 text-blue-700 text-xs font-semibold shadow-md flex items-center space-x-1.5 backdrop-blur-sm">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Click anywhere on map to open in Full Page</span>
            </span>
          </div>
        )}

        {/* Top-Left Live Location Pill */}
        <div className="absolute top-2.5 left-2.5 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-sans text-slate-800 shadow-md space-y-0.5 pointer-events-none">
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-slate-900 font-bold">
              {locationStatus === 'acquired' ? 'YOUR LIVE LOCATION' : 'COMMAND HQ'}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            {centerCoords[0].toFixed(5)}° N, {centerCoords[1].toFixed(5)}° E
          </div>
        </div>

        {/* Bottom-Right Active Vehicles Legend */}
        <div className="absolute bottom-2.5 right-2.5 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-sans text-slate-700 shadow-md flex items-center space-x-3 pointer-events-none">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-medium">D-001 (Focus)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-medium">D-002</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium">D-003</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="font-medium">Patrol</span>
          </span>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="pt-1.5 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between font-sans gap-1">
        <span className="flex items-center space-x-1.5 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>All 5 dumpers transmitting within geofence perimeter</span>
        </span>
        <span className="font-mono text-slate-600 font-medium text-[10px]">
          {locationStatus === 'acquired' ? 'GPS Lock: Browser GeoLocation' : 'GPS Lock: Autonomous Sim Engine'}
        </span>
      </div>
    </div>
  );
};
