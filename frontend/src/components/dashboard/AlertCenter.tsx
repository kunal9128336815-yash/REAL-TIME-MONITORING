import React from 'react';
import { AlertRecord } from '../../types';
import { Bell, Send, AlertTriangle, AlertOctagon, Info, ShieldCheck } from 'lucide-react';

interface AlertCenterProps {
  alerts: AlertRecord[];
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ alerts }) => {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return { text: 'CRITICAL', bg: 'bg-red-500 text-white', icon: AlertOctagon, border: 'border-red-500/40 bg-red-950/20' };
      case 'WARNING':
        return { text: 'WARNING', bg: 'bg-amber-500 text-black', icon: AlertTriangle, border: 'border-amber-500/40 bg-amber-950/20' };
      case 'CAUTION':
        return { text: 'CAUTION', bg: 'bg-yellow-500 text-black', icon: AlertTriangle, border: 'border-yellow-500/30 bg-yellow-950/10' };
      case 'INFO':
      default:
        return { text: 'INFO', bg: 'bg-blue-600 text-white', icon: Info, border: 'border-slate-800 bg-slate-900/60' };
    }
  };

  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            LIVE ALERTS & 4G SMS AUDIT LOG
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
          {alerts.length} Records
        </span>
      </div>

      {/* Alerts Feed */}
      <div className="my-3 space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-mono">
            No active hazard alerts
          </div>
        ) : (
          alerts.map((alt) => {
            const badge = getSeverityBadge(alt.severity);
            const Icon = badge.icon;
            return (
              <div
                key={alt.id}
                className={`p-2.5 rounded-lg border ${badge.border} flex flex-col space-y-1 transition-all`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider font-mono px-1.5 py-0.5 rounded ${badge.bg}`}>
                      {badge.text}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {alt.timestamp}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    {alt.category}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-200 leading-snug">
                  {alt.message}
                </p>

                {/* 4G SMS Broadcast notification */}
                {alt.sms_sent && (
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-cyan-300 pt-0.5">
                    <Send className="w-3 h-3 text-cyan-400" />
                    <span>{alt.sms_details || 'SMS dispatched via 4G SIM to Mine Safety Control'}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span>SMS Gateway: SIM7600G-H</span>
        <span>Storage: SQLite Audit DB</span>
      </div>
    </div>
  );
};
