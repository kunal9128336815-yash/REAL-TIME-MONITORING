import React from 'react';
import { UltrasonicData, ImuData } from '../../types';
import { Compass, Gauge } from 'lucide-react';

interface VehicleDigitalTwinProps {
  ultrasonic: UltrasonicData;
  imu: ImuData;
  speed: number;
}

export const VehicleDigitalTwin: React.FC<VehicleDigitalTwinProps> = ({
  ultrasonic,
  imu,
  speed,
}) => {
  const getZoneColor = (dist: number) => {
    if (dist <= 2.5) return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', wave: 'text-red-600' };
    if (dist <= 4.5) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300', wave: 'text-amber-600' };
    if (dist <= 8.0) return { text: 'text-yellow-800', bg: 'bg-yellow-50', border: 'border-yellow-300', wave: 'text-yellow-600' };
    return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', wave: 'text-emerald-600' };
  };

  const frontZone = getZoneColor(ultrasonic.front);
  const rearZone = getZoneColor(ultrasonic.rear);
  const leftZone = getZoneColor(ultrasonic.left);
  const rightZone = getZoneColor(ultrasonic.right);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between h-full font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Vehicle Digital Twin
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold font-sans">
              CAT 777E Chassis
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            360° Ultrasonic Proximity Field & IMU Attitude
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1 text-slate-700">
            <Gauge className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{speed.toFixed(1)} km/h</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-700">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">Tilt: {imu.tilt_deg}°</span>
          </div>
        </div>
      </div>

      {/* Main Visualizer Area with light engineering canvas */}
      <div className="relative flex-1 flex items-center justify-center py-6 min-h-[350px] overflow-hidden bg-slate-50/70 rounded-lg my-2 border border-slate-100">
        
        {/* FRONT SENSOR RADAR CONE */}
        <div className="absolute top-2 flex flex-col items-center z-20">
          <div className={`px-3 py-1 rounded-md border ${frontZone.border} ${frontZone.bg} shadow-xs flex items-center space-x-2 transition-colors`}>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">Front:</span>
            <span className={`text-sm font-bold font-mono ${frontZone.text}`}>
              {ultrasonic.front.toFixed(1)} m
            </span>
            {ultrasonic.front <= 3.5 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          {/* Animated sensing arc */}
          <div className="mt-1 relative w-32 h-7 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 40" className={`w-full h-full ${frontZone.wave} transition-colors`}>
              <path d="M 10 38 Q 50 5 90 38" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" className="animate-pulse" />
              <path d="M 25 38 Q 50 18 75 38" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
          </div>
        </div>

        {/* LEFT SENSOR RADAR ZONE */}
        <div className="absolute left-2 flex items-center z-20">
          <div className={`px-2.5 py-1 rounded-md border ${leftZone.border} ${leftZone.bg} shadow-xs flex flex-col items-center transition-colors`}>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-600">Left</span>
            <span className={`text-xs font-bold font-mono ${leftZone.text}`}>
              {ultrasonic.left.toFixed(1)} m
            </span>
          </div>
        </div>

        {/* RIGHT SENSOR RADAR ZONE */}
        <div className="absolute right-2 flex items-center z-20">
          <div className={`px-2.5 py-1 rounded-md border ${rightZone.border} ${rightZone.bg} shadow-xs flex flex-col items-center transition-colors`}>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-600">Right</span>
            <span className={`text-xs font-bold font-mono ${rightZone.text}`}>
              {ultrasonic.right.toFixed(1)} m
            </span>
          </div>
        </div>

        {/* REAR SENSOR RADAR ZONE */}
        <div className="absolute bottom-2 flex flex-col items-center z-20">
          <div className="mb-1 relative w-32 h-5 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 30" className={`w-full h-full ${rearZone.wave} transition-colors`}>
              <path d="M 15 2 Q 50 28 85 2" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
            </svg>
          </div>
          <div className={`px-3 py-1 rounded-md border ${rearZone.border} ${rearZone.bg} shadow-xs flex items-center space-x-2 transition-colors`}>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">Rear:</span>
            <span className={`text-sm font-bold font-mono ${rearZone.text}`}>
              {ultrasonic.rear.toFixed(1)} m
            </span>
          </div>
        </div>

        {/* CAD DUMPER SCHEMATIC (Realistic Industrial Hauler Graphic) */}
        <div className="relative w-44 h-72 z-10">
          <svg viewBox="0 0 160 260" className="w-full h-full drop-shadow-sm">
            {/* Engineering Grid Lines */}
            <defs>
              <pattern id="twin-grid-light" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="160" height="260" fill="url(#twin-grid-light)" opacity="0.7" />

            {/* Wheels - Front Left / Front Right */}
            <rect x="8" y="45" width="22" height="42" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="130" y="45" width="22" height="42" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />

            {/* Wheels - Dual Rear Left / Dual Rear Right */}
            <rect x="4" y="175" width="26" height="52" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="130" y="175" width="26" height="52" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />

            {/* Dumper Chassis Base - Mining CAT Industrial Styling */}
            <rect x="32" y="35" width="96" height="200" rx="8" fill="#f8fafc" stroke="#2563eb" strokeWidth="2" />

            {/* Front Bumper & Radiator Grille */}
            <rect x="36" y="24" width="88" height="15" rx="3" fill="#e2e8f0" stroke="#2563eb" strokeWidth="1.5" />
            <line x1="45" y1="31" x2="115" y2="31" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Driver Cabin (Positioned Left as in mining dump trucks) */}
            <rect x="40" y="44" width="34" height="38" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <text x="46" y="66" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">CAB</text>

            {/* Dump Bed Body */}
            <polygon points="38,90 122,90 126,225 34,225" fill="#f1f5f9" stroke="#2563eb" strokeWidth="1.8" />
            <line x1="40" y1="135" x2="120" y2="135" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="40" y1="180" x2="120" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Canopy over cab */}
            <polygon points="32,24 128,24 122,44 38,44" fill="#cbd5e1" stroke="#2563eb" strokeWidth="1.5" />

            {/* Center IMU & Pi 4 Core Marker */}
            <circle cx="80" cy="120" r="10" fill="#ffffff" stroke="#2563eb" strokeWidth="1.8" />
            <circle cx="80" cy="120" r="4" fill="#10b981" className="animate-pulse" />
            <text x="73" y="142" fill="#475569" fontSize="7" fontWeight="bold" fontFamily="sans-serif">IMU/PI</text>

            {/* Forward Camera Lens Indicator */}
            <polygon points="76,20 84,20 88,26 72,26" fill="#2563eb" />
            <circle cx="80" cy="22" r="2" fill="#fff" />
          </svg>
        </div>

      </div>

      {/* Footer Notes */}
      <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Acoustic Wave Proximity (Independent of Fog)</span>
        <span className="font-semibold text-blue-700">4 Active Nodes</span>
      </div>
    </div>
  );
};
