import React, { useEffect, useRef, useState } from 'react';
import { DetailModalWrapper } from './DetailModalWrapper';
import { GpsData } from '../../types';
import { HAUL_ROAD_WAYPOINTS } from '../../services/simulator';
import { MapPin, Navigation, Compass, Globe, ShieldCheck, Crosshair, Plus, Minus, Layers } from 'lucide-react';
import L from 'leaflet';

interface GpsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gps: GpsData;
}

export const GpsDetailModal: React.FC<GpsDetailModalProps> = ({
  isOpen,
  onClose,
  gps,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const trailPolylineRef = useRef<L.Polyline | null>(null);
  const pathHistoryRef = useRef<L.LatLngExpression[]>([]);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  const [autoFollow, setAutoFollow] = useState<boolean>(true);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [activeWpIdx, setActiveWpIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = [gps.lat, gps.lon];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const tileLayer = L.tileLayer(darkTiles, { maxZoom: 19, subdomains: 'abcd' }).addTo(map);
    baseTileLayerRef.current = tileLayer;

    // Haul road corridor polyline
    const haulRoadCoords: [number, number][] = HAUL_ROAD_WAYPOINTS.map(w => [w.lat, w.lon]);
    L.polyline(haulRoadCoords, {
      color: '#00e5ff',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 6',
    }).addTo(map);

    // Numbered Waypoint Markers
    HAUL_ROAD_WAYPOINTS.forEach((wp, idx) => {
      const wpIcon = L.divIcon({
        className: `modal-wp-${idx}`,
        html: `<div style="
          background: #090e17;
          color: #38bdf8;
          border: 2px solid #00e5ff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-family: monospace;
          font-weight: bold;
          box-shadow: 0 0 8px rgba(0,229,255,0.5);
          cursor: pointer;
        ">${idx + 1}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([wp.lat, wp.lon], { icon: wpIcon })
        .bindPopup(`<b>Waypoint #${idx + 1}</b><br/>Elevation: ${wp.elevation.toFixed(1)}m RL<br/>Speed Limit: 30 km/h`)
        .addTo(map);
    });

    // Geofence polygon
    const geofencePolygon: [number, number][] = [
      [22.7185, 75.8565],
      [22.7240, 75.8600],
      [22.7235, 75.8635],
      [22.7190, 75.8610],
    ];
    L.polygon(geofencePolygon, {
      color: '#3b82f6',
      weight: 1.5,
      opacity: 0.4,
      fillColor: '#1d4ed8',
      fillOpacity: 0.08,
    }).addTo(map);

    // Dumper #01 Vehicle Marker
    const vehicleIcon = L.divIcon({
      className: 'modal-dumper-icon',
      html: `
        <div id="modal-dumper-container" style="position:relative; width:48px; height:48px; display:flex; align-items:center; justify-content:center; transform: rotate(${gps.heading_deg}deg);">
          <div style="position:absolute; top:-24px; width:0; height:0; border-left:14px solid transparent; border-right:14px solid transparent; border-bottom:28px solid rgba(0,229,255,0.25); filter:drop-shadow(0 0 8px #00e5ff); pointer-events:none;"></div>
          <div style="
            background: #00e5ff;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 0 18px #00e5ff;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
          ">
            <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 9px solid #000; margin-bottom: 2px;"></div>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const vMarker = L.marker(initialCenter, { icon: vehicleIcon }).addTo(map);
    vehicleMarkerRef.current = vMarker;

    const trail = L.polyline([], {
      color: '#00e5ff',
      weight: 3,
      opacity: 0.9,
    }).addTo(map);
    trailPolylineRef.current = trail;

    mapInstanceRef.current = map;

    // Small delay to trigger map resize when modal mounts
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isOpen]);

    // Style change
  const handleStyleChange = (style: 'dark' | 'satellite' | 'street') => {
    setMapStyle(style);
    if (!mapInstanceRef.current) return;
    if (baseTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseTileLayerRef.current);
    }

    let newLayer: L.TileLayer;
    if (style === 'dark') {
      newLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      });
    } else if (style === 'satellite') {
      newLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Earth Imagery &mdash; OpenStreetMap Data',
      });
    } else {
      newLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
    }

    newLayer.addTo(mapInstanceRef.current);
    baseTileLayerRef.current = newLayer;
  };

  // Pan to waypoint
  const handleSelectWaypoint = (idx: number) => {
    setActiveWpIdx(idx);
    const wp = HAUL_ROAD_WAYPOINTS[idx];
    if (mapInstanceRef.current && wp) {
      mapInstanceRef.current.panTo([wp.lat, wp.lon], { animate: true, duration: 0.6 });
    }
  };

  // Re-center on dumper
  const handleReCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([gps.lat, gps.lon], { animate: true, duration: 0.6 });
    }
  };

  // Update position
  useEffect(() => {
    if (!vehicleMarkerRef.current || !mapInstanceRef.current) return;

    const newLatLng = new L.LatLng(gps.lat, gps.lon);
    vehicleMarkerRef.current.setLatLng(newLatLng);

    if (autoFollow) {
      mapInstanceRef.current.panTo(newLatLng, { animate: true, duration: 0.3 });
    }

    const container = document.getElementById('modal-dumper-container');
    if (container) {
      container.style.transform = `rotate(${gps.heading_deg}deg)`;
    }

    pathHistoryRef.current.push(newLatLng);
    if (pathHistoryRef.current.length > 35) {
      pathHistoryRef.current.shift();
    }
    if (trailPolylineRef.current) {
      trailPolylineRef.current.setLatLngs(pathHistoryRef.current);
    }
  }, [gps.lat, gps.lon, gps.heading_deg, autoFollow]);

  return (
    <DetailModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="HAUL-ROAD GEODETIC & GNSS TELEMETRY INSPECTOR"
      subtitle="Interactive satellite navigation, bench waypoint elevation sequence and haul road geofence"
      badge="u-blox NEO-6M GNSS"
      badgeColor="bg-sky-500 text-black"
    >
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">LATITUDE</span>
          <span className="text-sm font-black font-mono text-cyan-300 mt-0.5 block">{gps.lat.toFixed(6)}° N</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">LONGITUDE</span>
          <span className="text-sm font-black font-mono text-cyan-300 mt-0.5 block">{gps.lon.toFixed(6)}° E</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">GROUND HEADING</span>
          <span className="text-sm font-black font-mono text-emerald-300 mt-0.5 block">{gps.heading_deg.toFixed(1)}° True</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">FIX QUALITY</span>
          <span className="text-sm font-black font-mono text-purple-300 mt-0.5 block">{gps.fix_status}</span>
        </div>
      </div>

      {/* Expanded Interactive Map */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono flex items-center space-x-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>INTERACTIVE HIGH-RESOLUTION MINE MAP</span>
          </h4>

          {/* Map Controls */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setAutoFollow(!autoFollow)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
                autoFollow ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-700'
              }`}
            >
              <Crosshair className={`w-3 h-3 ${autoFollow ? 'animate-spin' : ''}`} />
              <span>{autoFollow ? 'AUTO-FOLLOW ON' : 'AUTO-FOLLOW OFF'}</span>
            </button>

            <button
              onClick={handleReCenter}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300"
            >
              RE-CENTER
            </button>

            <div className="bg-slate-950 p-1 rounded border border-slate-700 flex items-center space-x-1 text-[9px] font-mono">
              <button
                onClick={() => handleStyleChange('dark')}
                className={`px-1.5 py-0.5 rounded ${mapStyle === 'dark' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Dark
              </button>
              <button
                onClick={() => handleStyleChange('satellite')}
                className={`px-1.5 py-0.5 rounded ${mapStyle === 'satellite' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Satellite
              </button>
              <button
                onClick={() => handleStyleChange('street')}
                className={`px-1.5 py-0.5 rounded ${mapStyle === 'street' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Street
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-[320px] rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>

      {/* Haul Road Bench Waypoints Table (Click to Pan) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>KORBA OPEN-CAST COAL PIT — WAYPOINT SEQUENCE (CLICK ROW TO PAN)</span>
          </h4>
          <span className="text-[10px] font-mono text-slate-400">10 Surveyed Bench Markers</span>
        </div>

        <div className="overflow-x-auto max-h-52">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase sticky top-0 bg-slate-900">
                <th className="py-2 px-3">WP #</th>
                <th className="py-2 px-3">Latitude</th>
                <th className="py-2 px-3">Longitude</th>
                <th className="py-2 px-3">Bench Elevation</th>
                <th className="py-2 px-3">Ramp Description</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {HAUL_ROAD_WAYPOINTS.map((wp, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleSelectWaypoint(idx)}
                  className={`cursor-pointer transition-colors ${
                    activeWpIdx === idx ? 'bg-cyan-950/60 text-cyan-200' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-cyan-400">WP-0{idx + 1}</td>
                  <td className="py-2 px-3">{wp.lat.toFixed(5)}</td>
                  <td className="py-2 px-3">{wp.lon.toFixed(5)}</td>
                  <td className="py-2 px-3 text-emerald-300 font-bold">{wp.elevation.toFixed(1)} m RL</td>
                  <td className="py-2 px-3 text-slate-400">
                    {idx < 3 ? 'Surface Incline Ramp North' : (idx < 6 ? 'Deep Pit Bench Loading Bay 4' : 'Overburden Return Loop')}
                  </td>
                  <td className="py-2 px-3 text-[10px] text-cyan-400 font-bold">
                    PAN TO WP &gt;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DetailModalWrapper>
  );
};
