import React from 'react';
import { DetailModalWrapper } from './DetailModalWrapper';
import { RiskData, GpsData, UltrasonicData, VisibilityData, GsmData } from '../../types';
import { AlertOctagon, AlertTriangle, ShieldCheck, Send, CheckCircle2, Activity, Zap } from 'lucide-react';

interface RiskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk: RiskData;
  gps: GpsData;
  ultrasonic: UltrasonicData;
  visibility: VisibilityData;
  gsm: GsmData;
}

export const RiskDetailModal: React.FC<RiskDetailModalProps> = ({
  isOpen,
  onClose,
  risk,
  gps,
  ultrasonic,
  visibility,
  gsm,
}) => {
  const speedMs = gps.speed_kmh * (1000 / 3600);
  const frictionMu = 0.35; // Wet monsoon haul road friction coefficient
  const g = 9.81;
  const stoppingDist = (speedMs * speedMs) / (2 * frictionMu * g);
  const safetyMargin = ultrasonic.front - stoppingDist;

  return (
    <DetailModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="COLLISION RISK & KINEMATICS DEEP INSPECTION"
      subtitle="Transparent algorithmic breakdown of Time-to-Collision (TTC), stopping distance and sensor fusion"
      badge={risk.risk_level}
      badgeColor={
        risk.risk_level === 'CRITICAL' ? 'bg-red-500 text-white' :
        risk.risk_level === 'WARNING' ? 'bg-amber-500 text-black' :
        risk.risk_level === 'CAUTION' ? 'bg-yellow-500 text-black' : 'bg-emerald-500 text-black'
      }
    >
      {/* Top Directive Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        risk.risk_level === 'CRITICAL' ? 'bg-red-950/70 border-red-500 text-red-200' :
        risk.risk_level === 'WARNING' ? 'bg-amber-950/60 border-amber-500 text-amber-200' :
        risk.risk_level === 'CAUTION' ? 'bg-yellow-950/50 border-yellow-500 text-yellow-200' :
        'bg-emerald-950/50 border-emerald-500 text-emerald-200'
      }`}>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300 block">
            RECOMMENDED AUTOMATED SAFETY ACTION:
          </span>
          <span className="text-lg font-black tracking-wide uppercase mt-0.5 block">
            {risk.action}
          </span>
        </div>
        <div className="text-right font-mono">
          <span className="text-xs text-slate-300 block">HAZARD SUMMARY:</span>
          <span className="text-sm font-bold text-white">{risk.hazard_summary}</span>
        </div>
      </div>

      {/* Kinematics Formula & Calculation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
            1. TIME TO COLLISION (TTC)
          </span>
          <div className="text-2xl font-black font-mono text-white">
            {risk.ttc_seconds !== null ? `${risk.ttc_seconds.toFixed(1)} s` : 'N/A'}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            TTC = Distance ({ultrasonic.front.toFixed(1)}m) ÷ Closing Speed ({speedMs.toFixed(1)}m/s)
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
            2. THEORETICAL STOPPING DISTANCE
          </span>
          <div className="text-2xl font-black font-mono text-white">
            {stoppingDist.toFixed(1)} m
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            d_stop = v² ÷ (2·μ·g) with wet haul road μ=0.35
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
            3. SAFETY CLEARANCE MARGIN
          </span>
          <div className={`text-2xl font-black font-mono ${safetyMargin < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {safetyMargin.toFixed(1)} m
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {safetyMargin < 0 ? 'CRITICAL: Stopping distance exceeds clearance!' : 'Clearance margin within safe bounds'}
          </p>
        </div>
      </div>

      {/* Primary Contributing Factors */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
          PRIMARY CONTRIBUTING FACTORS ("WHY?")
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {risk.reasons.map((r, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4G Emergency SMS Dispatch Payload */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
              CELLULAR EMERGENCY BROADCAST PAYLOAD (SIM7600 4G LTE)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            Carrier: {gsm.carrier} ({gsm.signal_dbm} dBm)
          </span>
        </div>

        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{JSON.stringify({
  event: risk.emergency_sms_required ? "EMERGENCY_COLLISION_ALERT" : "TELEMETRY_HEARTBEAT",
  vehicle_id: "DUMPER_01",
  severity: risk.risk_level,
  gps: { lat: gps.lat, lon: gps.lon, speed_kmh: gps.speed_kmh },
  proximity_front_meters: ultrasonic.front,
  time_to_collision_sec: risk.ttc_seconds,
  recommended_action: risk.action,
  dispatch_target: "+91-98765-43210 (Mine Safety Control)"
}, null, 2)}
        </pre>
      </div>

      {/* Mine Safety Protocol Checklist */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
          DGMS STANDARD MINE OPERATING PROCEDURES (SOP)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sound continuous 3-blast horn in blind bends</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Maintain minimum 30m trailing distance in fog</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Switch headlights and amber fog lamps to ON</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Emergency retarder braking ready on steep ramps</span>
          </div>
        </div>
      </div>
    </DetailModalWrapper>
  );
};
