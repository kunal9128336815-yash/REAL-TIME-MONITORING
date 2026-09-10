import React from 'react';
import { VisibilityData } from '../../types';
import { CloudFog, Eye, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VisibilityPanelProps {
  visibility: VisibilityData;
}

export const VisibilityPanel: React.FC<VisibilityPanelProps> = ({ visibility }) => {
  const getBadgeColor = (label: string) => {
    switch (label) {
      case 'CRITICAL VISIBILITY':
        return 'bg-red-950/80 border-red-500 text-red-300';
      case 'DENSE FOG':
        return 'bg-amber-950/80 border-amber-500 text-amber-300';
      case 'MODERATE FOG':
        return 'bg-yellow-950/80 border-yellow-500 text-yellow-300';
      case 'LIGHT FOG':
        return 'bg-blue-950/60 border-blue-500/60 text-blue-300';
      case 'OFFLINE':
        return 'bg-slate-900 border-slate-700 text-slate-400';
      case 'CLEAR':
      default:
        return 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300';
    }
  };

  const getGaugeColor = (pct: number | null) => {
    if (pct === null) return 'bg-slate-700';
    if (pct <= 25) return 'bg-gradient-to-r from-red-600 to-amber-600';
    if (pct <= 50) return 'bg-gradient-to-r from-amber-500 to-yellow-500';
    if (pct <= 75) return 'bg-gradient-to-r from-yellow-500 to-emerald-500';
    return 'bg-gradient-to-r from-cyan-500 to-emerald-500';
  };

  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <CloudFog className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            ENVIRONMENTAL VISIBILITY
          </span>
        </div>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border font-mono ${getBadgeColor(visibility.label)}`}>
          {visibility.label}
        </span>
      </div>

      {/* Numerical Index & Gauge */}
      <div className="my-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-300">
            Monsoon Visibility Index:
          </span>
          <span className="text-2xl font-black font-mono text-cyan-300">
            {visibility.index_percent !== null ? `${visibility.index_percent.toFixed(0)}%` : 'N/A'}
          </span>
        </div>

        {/* Horizontal gauge bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${getGaugeColor(visibility.index_percent)}`}
            style={{ width: `${visibility.index_percent ?? 0}%` }}
          ></div>
        </div>

        {/* Gauge Scale Labels */}
        <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
          <span>0% (Zero Vis)</span>
          <span>35% (Dense Fog)</span>
          <span>100% (Clear)</span>
        </div>
      </div>

      {/* Explanatory Fallback Message */}
      <div className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
        visibility.optical_degraded
          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
      }`}>
        {visibility.optical_degraded ? (
          <AlertTriangle className="w-4 h-4 shrink-0" />
        ) : (
          <ShieldCheck className="w-4 h-4 shrink-0" />
        )}
        <span className="text-[11px] font-medium tracking-tight leading-tight">
          {visibility.advisory}
        </span>
      </div>
    </div>
  );
};
