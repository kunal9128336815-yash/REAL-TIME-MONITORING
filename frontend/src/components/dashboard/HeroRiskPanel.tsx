import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon, Info, Radio, Send } from 'lucide-react';
import { RiskLevel, RiskData, GsmData } from '../../types';

interface HeroRiskPanelProps {
  risk: RiskData;
  gsm: GsmData;
}

export const HeroRiskPanel: React.FC<HeroRiskPanelProps> = ({ risk, gsm }) => {
  const getTheme = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/70',
          border: 'border-red-500 glow-critical',
          text: 'text-red-400',
          badgeBg: 'bg-red-600',
          badgeText: 'text-white',
          icon: AlertOctagon,
          actionColor: 'bg-red-600 text-white animate-pulse',
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-950/60',
          border: 'border-amber-500 glow-warning',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-500',
          badgeText: 'text-black',
          icon: AlertTriangle,
          actionColor: 'bg-amber-500 text-black',
        };
      case 'CAUTION':
        return {
          bg: 'bg-yellow-950/40',
          border: 'border-yellow-500/80 glow-caution',
          text: 'text-yellow-400',
          badgeBg: 'bg-yellow-500',
          badgeText: 'text-black',
          icon: AlertTriangle,
          actionColor: 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50',
        };
      case 'OFFLINE':
        return {
          bg: 'bg-slate-900/60',
          border: 'border-slate-700',
          text: 'text-slate-400',
          badgeBg: 'bg-slate-700',
          badgeText: 'text-white',
          icon: ShieldCheck,
          actionColor: 'bg-slate-800 text-slate-300 border border-slate-700',
        };
      case 'SAFE':
      default:
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/60 glow-safe',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500',
          badgeText: 'text-black',
          icon: ShieldCheck,
          actionColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
        };
    }
  };

  const theme = getTheme(risk.risk_level);
  const Icon = theme.icon;

  return (
    <div className={`relative rounded-xl border-2 ${theme.border} ${theme.bg} p-4 lg:p-6 transition-all duration-300 overflow-hidden shadow-2xl`}>
      {/* Background hazard watermark effect */}
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <Icon className="w-56 h-56 text-white" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Main Risk Identity */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className={`p-4 rounded-xl ${theme.badgeBg} ${theme.badgeText} shadow-lg flex items-center justify-center shrink-0`}>
            <Icon className="w-10 h-10" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                SYSTEM SAFETY STATE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                {risk.hazard_summary}
              </span>
            </div>

            <h2 className={`text-3xl lg:text-5xl font-black tracking-tight ${theme.text} mt-0.5`}>
              {risk.risk_level}
            </h2>

            {/* Action Command Banner */}
            <div className={`mt-2.5 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-black text-sm lg:text-base tracking-wider uppercase shadow-md ${theme.actionColor}`}>
              <span>{risk.action}</span>
            </div>
          </div>
        </div>

        {/* Center: Time to Collision (TTC) & Stopping Metrics */}
        <div className="flex items-center justify-center bg-slate-950/80 rounded-xl border border-slate-800/80 px-6 py-3.5 shadow-inner w-full md:w-auto">
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              TIME TO COLLISION (TTC)
            </span>
            <div className="mt-0.5 flex items-baseline justify-center space-x-1">
              <span className={`text-4xl lg:text-5xl font-black font-mono tracking-tight ${
                risk.ttc_seconds !== null && risk.ttc_seconds <= 2.0
                  ? 'text-red-400 animate-pulse'
                  : (risk.ttc_seconds !== null && risk.ttc_seconds <= 4.0 ? 'text-amber-400' : 'text-cyan-400')
              }`}>
                {risk.ttc_seconds !== null ? `${risk.ttc_seconds.toFixed(1)}` : '--'}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                {risk.ttc_seconds !== null ? 'sec' : ''}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight block mt-0.5">
              {risk.ttc_seconds !== null ? 'TTC = Distance / Closing Speed' : 'NO IMMEDIATE FORWARD COLLISION'}
            </span>
          </div>
        </div>

        {/* Right: Cellular Emergency Dispatch Status */}
        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">
              4G Pit-to-Command Uplink
            </span>
          </div>

          <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span>{gsm.carrier}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">{gsm.ip}</span>
          </div>

          {risk.emergency_sms_required && (
            <div className="mt-2.5 flex items-center space-x-2 px-3 py-1 rounded bg-red-900/60 border border-red-500/60 text-red-200 text-xs font-semibold animate-pulse">
              <Send className="w-3.5 h-3.5 text-red-300" />
              <span>EMERGENCY SMS DISPATCHED TO MINE SUPERVISOR</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
