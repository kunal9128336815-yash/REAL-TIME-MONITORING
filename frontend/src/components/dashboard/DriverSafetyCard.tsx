import React from 'react';
import { DriverSafetyData } from '../../types';
import { ShieldCheck, UserCheck } from 'lucide-react';

interface DriverSafetyCardProps {
  driverSafety: DriverSafetyData;
}

export const DriverSafetyCard: React.FC<DriverSafetyCardProps> = () => {
  return (
    <div className="rounded-xl border p-4 shadow-xl transition-all duration-300 flex flex-col justify-between h-full bg-[#0b1324] border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-black uppercase tracking-wider text-cyan-300">
            CABIN SAFETY & OPERATOR ALERTNESS
          </span>
        </div>

        <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded border font-mono bg-emerald-950/80 border-emerald-500/50 text-emerald-300">
          OPERATIONAL
        </span>
      </div>

      {/* Main Status Display */}
      <div className="my-3">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-xl border flex items-center justify-center bg-emerald-900/50 border-emerald-500/50 text-emerald-300">
            <UserCheck className="w-7 h-7" />
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">
              Cabin Telemetry:
            </div>
            <div className="text-base font-black tracking-tight text-emerald-300 mt-0.5">
              OPERATOR ATTENTIVE — CABIN CLEAR
            </div>
            <div className="text-xs font-mono text-cyan-300 mt-1 font-bold">
              EMESRT Level 9 Interlock: READY
            </div>
          </div>
        </div>

        {/* Responsible Technical Advisory Message */}
        <div className="mt-3 p-3 rounded-lg border text-xs leading-relaxed bg-slate-900/80 border-slate-800 text-slate-200 font-medium">
          "Operator vigilance verified. Continuous cabin telemetry indicates full driver attention and nominal cabin posture."
        </div>
      </div>

      {/* Footer Technical Note */}
      <div className="pt-2.5 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono font-bold">
        <span>In-Cab Safety Telemetry</span>
        <span className="text-emerald-400">NOMINAL VIGILANCE</span>
      </div>
    </div>
  );
};
