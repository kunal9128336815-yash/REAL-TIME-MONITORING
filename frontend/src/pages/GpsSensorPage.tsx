import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { MapPin, Satellite, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GpsSensorPage: React.FC = () => {
  const { telemetry } = useTelemetryContext();
  const gps = telemetry.gps;

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span>GNSS / GPS Vehicle Localization</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            u-blox NEO-6M satellite receiver telemetry and global coordinates in open-pit mine coordinate space
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{gps.fix_status}</span>
          </span>
        </div>
      </div>

      {/* Enterprise GNSS Specifications Notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex items-start space-x-2.5 shadow-2xs">
        <Satellite className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-blue-900 uppercase tracking-wide">
            Precision GNSS Haul Road Localization & Kinematics:
          </strong>
          <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
            GNSS telemetry delivers multi-constellation positional awareness and Doppler velocity estimation for situational corridor management, zone geofencing, and secondary speed-envelope validation. Sub-meter correction pipelines interface with on-vehicle IMU dead-reckoning during pit satellite shadow.
          </p>
        </div>
      </div>

      {/* GNSS Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Latitude</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{gps.lat.toFixed(6)}° N</div>
          <span className="text-[11px] text-slate-500 mt-1 block">WGS84 datum</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Longitude</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{gps.lon.toFixed(6)}° E</div>
          <span className="text-[11px] text-slate-500 mt-1 block">WGS84 datum</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Ground Speed</span>
          <div className="text-xl font-bold font-mono text-blue-700 mt-1">
            {gps.speed_kmh.toFixed(1)} <span className="text-xs font-normal font-sans text-slate-500">km/h</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Doppler velocity calculation</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Compass Bearing</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{gps.heading_deg.toFixed(1)}°</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Azimuth from true north</span>
        </div>
      </div>

      {/* Deep Dive: Role in FOG-SAFE */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
          Role of GNSS in Fog-Safe Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-blue-700 font-bold block text-[11px] uppercase tracking-wide">1. Fleet Localization</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Allows the central command center to monitor dumper positions along haul roads, switchbacks, and waste dump dumpsites.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-blue-700 font-bold block text-[11px] uppercase tracking-wide">2. Kinematic TTC Baseline</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Provides approximate ground velocity (km/h) which is converted into m/s for kinematic time-to-collision calculations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-blue-700 font-bold block text-[11px] uppercase tracking-wide">3. Geofence Enforcement</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Alerts operators if a heavy dumper veers off the designated haul corridor into hazardous pit blast zones or highwall edges.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Receiver Model: u-blox NEO-6M &bull; Interface: UART @ 9600 Baud &bull; Protocol: NMEA-0183 (RMC / GGA)
          </span>
          <Link
            to="/tracking"
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1 transition-colors shadow-xs"
          >
            <span>View on GIS Tracking Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
