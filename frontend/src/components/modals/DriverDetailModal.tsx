import React from 'react';
import { DetailModalWrapper } from './DetailModalWrapper';
import { DriverSafetyData } from '../../types';
import { Headphones, User, AlertTriangle, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface DriverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverSafety: DriverSafetyData;
}

export const DriverDetailModal: React.FC<DriverDetailModalProps> = ({
  isOpen,
  onClose,
  driverSafety,
}) => {
  return (
    <DetailModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="DRIVER ATTENTION & CABIN SAFETY MONITORING"
      subtitle="In-cab near-infrared (NIR) computer vision monitoring and operator vigilance tracking"
      badge="OPERATIONAL"
      badgeColor="bg-emerald-500 text-black"
    >
      {/* Current State Banner */}
      <div className="p-4 rounded-xl border flex items-center justify-between bg-emerald-950/60 border-emerald-500 text-emerald-200">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-lg bg-emerald-500 text-black">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300 block">
              CABIN SAFETY TELEMETRY STATUS:
            </span>
            <span className="text-lg font-black tracking-wide uppercase mt-0.5 block text-emerald-300">
              OPERATOR ATTENTIVE — CABIN CLEAR
            </span>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-xs text-slate-300 block font-bold">VIGILANCE:</span>
          <span className="text-xl font-black text-emerald-300">98% OPTIMAL</span>
        </div>
      </div>

      {/* Advisory Message */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300 font-mono">
          SAFETY ADVISORY & OPERATIONAL TELEMETRY
        </h4>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 font-medium">
          "Operator vigilance verified. Continuous in-cabin monitoring confirms full driver awareness and readiness for collision warning signals."
        </div>
        <p className="text-xs text-slate-300 font-sans">
          <strong>Technical Responsibility Note:</strong> In accordance with ISO 21815-2, cabin safety monitoring works concurrently with autonomous machine interlock stopping to maximize operator survival in zero-visibility conditions.
        </p>
      </div>

      {/* Cabin Perception Pipeline Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
            IN-CABIN SENSOR SPECIFICATIONS
          </h4>
          <ul className="space-y-1 text-slate-300 font-medium">
            <li>• Sensor: 850nm Near-Infrared (NIR) Operator Cam</li>
            <li>• Illumination: 4x Diffused 850nm IR LEDs (Non-glare)</li>
            <li>• Status: In-Cab Attention Engine Nominal</li>
            <li>• Interlock: EMESRT Level 9 Machine Stopping Protocol Active</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
            MINE SAFETY CABIN REGULATIONS
          </h4>
          <ul className="space-y-1 text-slate-300 font-medium">
            <li>• Auditory distractions strictly prohibited in haul operations</li>
            <li>• 2-way VHF radio permitted only on designated dispatch channel</li>
            <li>• Shift duration limit: Maximum 8 hours per rotation</li>
            <li>• Mandatory 30-minute rest intervals after 4 hours</li>
          </ul>
        </div>
      </div>
    </DetailModalWrapper>
  );
};
