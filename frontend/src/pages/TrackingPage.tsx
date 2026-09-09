import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelemetryContext } from '../context/TelemetryContext';
import { GpsTrackingMap } from '../components/dashboard/GpsTrackingMap';
import { MapPin, Satellite, Compass, ShieldAlert, ArrowLeft, Radio } from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { telemetry } = useTelemetryContext();

  const fleetRoster = [
    { id: 'D-001', name: 'CAT 777E (Focus)', driver: 'R. Kumar', speed: `${telemetry.gps.speed_kmh.toFixed(1)} km/h`, risk: telemetry.risk.risk_level, color: 'text-blue-700' },
    { id: 'D-002', name: 'Komatsu HD785', driver: 'M. Soren', speed: '10.4 km/h', risk: 'WARNING', color: 'text-amber-700' },
    { id: 'D-003', name: 'CAT 777E', driver: 'A. Tirkey', speed: '16.8 km/h', risk: 'SAFE', color: 'text-emerald-700' },
    { id: 'D-004', name: 'Terex TR100', driver: 'Mohd. Salim', speed: '7.2 km/h', risk: 'CAUTION', color: 'text-yellow-800' },
    { id: 'PATROL-01', name: 'Safety Patrol Truck', driver: 'S. Verma', speed: '24.2 km/h', risk: 'SAFE', color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors mr-1 shadow-2xs"
              title="Return to previous view"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span>Full Fleet GIS Tracking Map</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-vehicle GNSS tracking &bull; Defaulted to your live location &bull; 5 active dumpers and patrol units
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>5 / 5 Vehicles Online</span>
          </span>
        </div>
      </div>

      {/* Live Fleet Quick Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {fleetRoster.map((v) => (
          <div
            key={v.id}
            className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs shadow-xs"
          >
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`font-mono font-bold ${v.color}`}>{v.id}</span>
                <span className="text-[11px] text-slate-500 truncate max-w-[90px]">{v.name}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                <span className="font-mono font-semibold text-slate-700">{v.speed}</span> &bull; {v.driver}
              </div>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              v.risk === 'CRITICAL' ? 'bg-red-50 border-red-200 text-red-700' :
              v.risk === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-700' :
              v.risk === 'CAUTION' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              {v.risk}
            </span>
          </div>
        ))}
      </div>

      {/* Main Map Canvas - Full Page Height */}
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs relative bg-white">
        <GpsTrackingMap
          gps={telemetry.gps}
          ultrasonic={telemetry.ultrasonic}
          visibility={telemetry.visibility}
          hazardDetected={telemetry.risk.risk_level === 'CRITICAL'}
          isFullPage={true}
        />
      </div>

      {/* GNSS Telemetry & Kinematics Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
        {/* GNSS Fix */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-500 text-[10px] uppercase font-semibold">
            <Satellite className="w-3.5 h-3.5 text-blue-600" />
            <span>Satellite Constellation</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900">
            {telemetry.gps.fix_status}
          </div>
          <p className="text-[11px] text-slate-500">
            NEO-6M GNSS &bull; 8 SVs in solution &bull; HDOP: 1.18
          </p>
        </div>

        {/* Speed & Direction */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-500 text-[10px] uppercase font-semibold">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Ground Velocity & Heading</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900">
            {telemetry.gps.speed_kmh.toFixed(1)} km/h &bull; {telemetry.gps.heading_deg.toFixed(1)}°
          </div>
          <p className="text-[11px] text-slate-500">
            Haul corridor bearing &bull; Grade: +2.1°
          </p>
        </div>

        {/* Geofence Alert */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-500 text-[10px] uppercase font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Geofence Perimeter</span>
          </div>
          <div className="text-base font-bold text-emerald-700">
            WITHIN SAFE CORRIDOR
          </div>
          <p className="text-[11px] text-slate-500">
            Berm buffer: 14.5m &bull; Dump boundary: 85m clear
          </p>
        </div>

        {/* Coordinates */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-500 text-[10px] uppercase font-semibold">
            <Radio className="w-3.5 h-3.5 text-purple-600" />
            <span>Focus Vehicle Coordinates</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-800">
            {telemetry.gps.lat.toFixed(5)}°, {telemetry.gps.lon.toFixed(5)}°
          </div>
          <p className="text-[11px] text-slate-500">
            WGS84 Datum &bull; Elevation: 314m MSL
          </p>
        </div>
      </div>
    </div>
  );
};
