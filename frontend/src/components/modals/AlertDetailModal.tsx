import React from 'react';
import { DetailModalWrapper } from './DetailModalWrapper';
import { AlertRecord, GpsData } from '../../types';
import { Bell, Send, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface AlertDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertRecord[];
  gps: GpsData;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  isOpen,
  onClose,
  alerts,
  gps,
}) => {
  return (
    <DetailModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="SAFETY ALERT LOG & 4G EMERGENCY DISPATCH AUDIT"
      subtitle="Complete chronological audit trail of collision hazards, proximity events and cellular SMS alerts"
      badge={`${alerts.length} LOGGED EVENTS`}
      badgeColor="bg-amber-500 text-black"
    >
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
          CHRONOLOGICAL INCIDENT & DISPATCH AUDIT FEED
        </h4>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-3 rounded-lg border flex flex-col space-y-1 ${
                alt.severity === 'CRITICAL' ? 'bg-red-950/40 border-red-500/50' :
                alt.severity === 'WARNING' ? 'bg-amber-950/40 border-amber-500/50' :
                alt.severity === 'CAUTION' ? 'bg-yellow-950/30 border-yellow-500/40' :
                'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    alt.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                    alt.severity === 'WARNING' ? 'bg-amber-500 text-black' :
                    alt.severity === 'CAUTION' ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'
                  }`}>
                    {alt.severity}
                  </span>
                  <span className="text-slate-300">{alt.timestamp}</span>
                  <span className="text-slate-500">• Sector 4 Haul Road</span>
                </div>
                <span className="text-slate-400 font-bold">{alt.category}</span>
              </div>

              <p className="text-xs text-slate-200 font-sans mt-1">
                {alt.message}
              </p>

              {alt.sms_sent && (
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-cyan-300 pt-1">
                  <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{alt.sms_details || 'SMS dispatched via 4G SIM to Mine Safety Control (+91-98765-43210)'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DetailModalWrapper>
  );
};
