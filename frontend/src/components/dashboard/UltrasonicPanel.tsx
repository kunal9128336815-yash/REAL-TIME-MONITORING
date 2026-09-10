import React from 'react';
import { UltrasonicData } from '../../types';
import { Radio, Activity, CheckCircle2 } from 'lucide-react';

interface UltrasonicPanelProps {
  ultrasonic: UltrasonicData;
}

export const UltrasonicPanel: React.FC<UltrasonicPanelProps> = ({ ultrasonic }) => {
  const sensors = [
    { id: 'front', label: 'US-FRONT', name: 'Forward Collision Radar', dist: ultrasonic.front, maxDist: 15.0 },
    { id: 'rear', label: 'US-REAR', name: 'Reversing Proximity', dist: ultrasonic.rear, maxDist: 20.0 },
    { id: 'left', label: 'US-LEFT', name: 'Port Blind-Spot', dist: ultrasonic.left, maxDist: 10.0 },
    { id: 'right', label: 'US-RIGHT', name: 'Starboard Blind-Spot', dist: ultrasonic.right, maxDist: 10.0 },
  ];

  const getStatus = (dist: number | null) => {
    if (dist === null) return { text: 'OFFLINE', color: 'text-slate-400', bg: 'bg-slate-900/60 border-slate-700', dot: 'bg-slate-600' };
    if (dist <= 2.5) return { text: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-950/60 border-red-500/80', dot: 'bg-red-400' };
    if (dist <= 4.5) return { text: 'WARNING', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-500/80', dot: 'bg-amber-400' };
    if (dist <= 8.0) return { text: 'CAUTION', color: 'text-yellow-400', bg: 'bg-yellow-950/40 border-yellow-500/60', dot: 'bg-yellow-400' };
    return { text: 'CLEAR', color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-500/40', dot: 'bg-emerald-400' };
  };

  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            ULTRASONIC PROXIMITY ARRAY
          </span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-mono flex items-center space-x-1 border ${
          ultrasonic.front !== null
            ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400'
            : 'bg-slate-900 border-slate-700 text-slate-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            ultrasonic.front !== null ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
          }`}></span>
          <span>{ultrasonic.front !== null ? 'TRANSDUCER ONLINE' : 'ARRAY OFFLINE'}</span>
        </span>
      </div>

      {/* 4 Sensor Channels Grid */}
      <div className="grid grid-cols-2 gap-3 my-3">
        {sensors.map((s) => {
          const status = getStatus(s.dist);
          const percent = s.dist !== null ? Math.min(100, (s.dist / s.maxDist) * 100) : 0;

          return (
            <div
              key={s.id}
              className={`p-3 rounded-lg border ${status.bg} transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200">
                  {s.label}
                </span>
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${status.color}`}>
                  ● {status.text}
                </span>
              </div>

              <div className="my-2 flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-slate-100">
                  {s.dist !== null ? s.dist.toFixed(1) : '--'} <span className="text-xs font-normal text-slate-400">{s.dist !== null ? 'm' : ''}</span>
                </span>
                {/* Wave indicator */}
                <div className="flex items-end space-x-0.5 h-4">
                  <span className={`w-1 bg-current ${status.color} animate-pulse h-2`}></span>
                  <span className={`w-1 bg-current ${status.color} animate-pulse h-3.5`}></span>
                  <span className={`w-1 bg-current ${status.color} animate-pulse h-2.5`}></span>
                </div>
              </div>

              {/* Distance bar */}
              <div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${status.dot} transition-all duration-300`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">
                  {s.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span>Transducer Freq: 40 kHz</span>
        <span>Beam Angle: 15° Conical</span>
      </div>
    </div>
  );
};
