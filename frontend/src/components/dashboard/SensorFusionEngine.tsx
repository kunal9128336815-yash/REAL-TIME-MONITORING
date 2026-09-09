import React from 'react';
import { SensorConfidence } from '../../types';
import { Camera, Radio, Compass, Navigation, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SensorFusionEngineProps {
  confidence: SensorConfidence;
  opticalDegraded: boolean;
  visibilityPercent: number;
}

export const SensorFusionEngine: React.FC<SensorFusionEngineProps> = ({
  confidence,
  opticalDegraded,
  visibilityPercent,
}) => {
  const sensors = [
    {
      id: 'camera',
      name: 'CAMERA / YOLO',
      question: 'What is it?',
      role: 'Classification & Spatial Heading',
      icon: Camera,
      conf: confidence.camera,
      degraded: opticalDegraded,
      color: opticalDegraded ? 'text-amber-400' : 'text-cyan-400',
      barColor: opticalDegraded ? 'bg-amber-500' : 'bg-cyan-500',
    },
    {
      id: 'ultrasonic',
      name: 'ULTRASONIC ARRAY',
      question: 'How far is it?',
      role: 'Acoustic Proximity (Fog-Resilient)',
      icon: Radio,
      conf: confidence.ultrasonic,
      degraded: false,
      color: 'text-emerald-400',
      barColor: 'bg-emerald-500',
    },
    {
      id: 'gps',
      name: 'NEO-6M GNSS',
      question: 'Where is the vehicle?',
      role: 'Haul Road Geofence & Speed',
      icon: Navigation,
      conf: confidence.gps,
      degraded: false,
      color: 'text-sky-400',
      barColor: 'bg-sky-500',
    },
    {
      id: 'imu',
      name: 'MPU6050 IMU',
      question: 'How is it moving?',
      role: 'Chassis Incline & Acceleration',
      icon: Compass,
      conf: confidence.imu,
      degraded: false,
      color: 'text-purple-400',
      barColor: 'bg-purple-500',
    },
    {
      id: 'gsm',
      name: 'SIM7600 4G LTE',
      question: 'How to notify command?',
      role: 'Pit Uplink & Emergency SMS',
      icon: Zap,
      conf: confidence.gsm,
      degraded: false,
      color: 'text-blue-400',
      barColor: 'bg-blue-500',
    },
  ];

  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              MULTI-SENSOR FUSION ENGINE
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            KALMAN/RULE FUSION
          </span>
        </div>

        {/* Central Innovation Banner */}
        <div className="mt-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
          <p className="text-xs font-bold text-cyan-200 tracking-wide">
            "WHEN VISIBILITY DEGRADES, THE SYSTEM DOES NOT RELY ON CAMERA VISION ALONE."
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Ultrasonic acoustic pulses penetrate monsoon fog to maintain short-range collision defense.
          </p>
        </div>
      </div>

      {/* Sensor Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-4">
        {sensors.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`p-3 rounded-lg border transition-all ${
                s.degraded
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[10px] font-mono font-bold text-slate-300">
                  {s.conf}%
                </span>
              </div>

              <span className="text-xs font-bold text-slate-200 mt-1.5 block tracking-tight">
                {s.name}
              </span>

              {/* Fundamental Question */}
              <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono font-semibold text-cyan-300">
                "{s.question}"
              </div>

              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                {s.role}
              </p>

              {/* Confidence Progress Bar */}
              <div className="mt-2.5">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.barColor} transition-all duration-500`}
                    style={{ width: `${s.conf}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                  Signal Quality / Confidence
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthesis Verdict */}
      <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          {opticalDegraded ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span className="font-semibold text-slate-300">
            {opticalDegraded
              ? 'Multi-Sensor Fallback Active — Proximity Sensing Maintained'
              : 'All Sensor Channels Synchronized & Confident'}
          </span>
        </div>

        <div className="text-[11px] font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
          Fusion Output: "IS IT DANGEROUS?" → REAL-TIME COLLISION RISK
        </div>
      </div>
    </div>
  );
};
