import React from 'react';
import { RiskData, GpsData, VisibilityData, UltrasonicData } from '../../types';
import { HelpCircle, CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight } from 'lucide-react';

interface ExplainableRiskCardProps {
  risk: RiskData;
  gps: GpsData;
  visibility: VisibilityData;
  ultrasonic: UltrasonicData;
}

export const ExplainableRiskCard: React.FC<ExplainableRiskCardProps> = ({
  risk,
  gps,
  visibility,
  ultrasonic,
}) => {
  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            RISK EXPLAINABILITY ("WHY?")
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-cyan-300 font-bold">
          DETERMINISTIC AUDIT TRAIL
        </span>
      </div>

      {/* Main Reason Stream */}
      <div className="my-3 space-y-2 flex-1">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Primary Contributing Factors:
        </div>

        <ul className="space-y-1.5">
          {risk.reasons.map((reason, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200"
            >
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span className="font-mono">{reason}</span>
            </li>
          ))}
        </ul>

        {/* Dynamic Metric Snapshot */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">VEHICLE SPEED</span>
            <span className="text-slate-200 font-bold">{gps.speed_kmh.toFixed(1)} km/h</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">FORWARD DISTANCE</span>
            <span className="text-slate-200 font-bold">{ultrasonic.front.toFixed(1)} m</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">VISIBILITY INDEX</span>
            <span className="text-slate-200 font-bold">{visibility.index_percent.toFixed(0)}%</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">CLOSING TIME (TTC)</span>
            <span className="text-slate-200 font-bold">
              {risk.ttc_seconds !== null ? `${risk.ttc_seconds.toFixed(1)} s` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Action Footer */}
      <div className="pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Recommended Action:</span>
          <span className="font-black uppercase tracking-wider text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
            {risk.action}
          </span>
        </div>
      </div>
    </div>
  );
};
