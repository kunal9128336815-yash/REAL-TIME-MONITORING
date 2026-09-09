import React from 'react';
import { Scale, AlertTriangle, ShieldCheck, ArrowRight, ArrowDown, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComparisonPage: React.FC = () => {
  return (
    <div className="space-y-4 font-mono pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
            <Scale className="w-6 h-6 text-cyan-400" />
            <span>FOG OPERATION: CONVENTIONAL VS FOG-SAFE</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Qualitative side-by-side engineering comparison under dense monsoon fog and low-visibility pit conditions
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
            QUALITATIVE COMPARISON
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Conventional Mining Haulage */}
        <div className="p-6 rounded-xl bg-[#0a1020] border-2 border-red-500/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <h2 className="text-sm font-black text-red-300 uppercase tracking-wider">
                CONVENTIONAL MINE OPERATION
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-400 font-bold">
              VISION-DEPENDENT
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800">
              <strong className="text-slate-200 block mb-1">1. Severe Monsoon Fog Engulfs Pit:</strong>
              Optical sightline drops below 10–15 meters on switchbacks and haul roads.
            </div>

            <div className="flex justify-center text-red-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800">
              <strong className="text-slate-200 block mb-1">2. Driver Relies Solely on Eyesight:</strong>
              Dumper operators strain to perceive highwall edges, ground spotters, or stationary boulders.
            </div>

            <div className="flex justify-center text-red-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800">
              <strong className="text-slate-200 block mb-1">3. Late Hazard Recognition:</strong>
              Obstacles or personnel are only noticed at point-blank range (&lt; 4 meters).
            </div>

            <div className="flex justify-center text-red-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300">
              <strong className="block text-sm font-bold">OUTCOME: HIGH COLLISION RISK OR COMPLETE SHUTDOWN</strong>
              <p className="mt-1 text-[11px] text-slate-300 leading-normal">
                Mines frequently must halt heavy haulage entirely during monsoon fog, stalling mineral production, or risk catastrophic pedestrian runover.
              </p>
            </div>
          </div>
        </div>

        {/* Right: FOG-SAFE System */}
        <div className="p-6 rounded-xl bg-[#0a1020] border-2 border-cyan-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-black text-cyan-300 uppercase tracking-wider">
                FOG-SAFE CAS™ ENTERPRISE ARCHITECTURE
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
              MULTI-SENSOR FUSION
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800">
              <strong className="text-slate-200 block mb-1">1. Severe Monsoon Fog Engulfs Pit:</strong>
              System automatically detects visibility decay via optical contrast analysis (Visibility Index &lt; 35%).
            </div>

            <div className="flex justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800">
              <strong className="text-slate-200 block mb-1">2. Autonomous Sensor Fusion Adaptation:</strong>
              Camera weighting is discounted; 40 kHz ultrasonic acoustic transducers maintain active 4-channel proximity ranging.
            </div>

            <div className="flex justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800">
              <strong className="text-slate-200 block mb-1">3. Early TTC & Collision Risk Escalation:</strong>
              Kinematic engine continuously evaluates Time to Collision (TTC) and triggers staged audio warnings.
            </div>

            <div className="flex justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
              <strong className="block text-sm font-bold">OUTCOME: EARLY WARNING, AUTOMATED STOP & COMMAND VISIBILITY</strong>
              <p className="mt-1 text-[11px] text-slate-300 leading-normal">
                Operator alerted in cabin, autonomous stop mandate executed before physical impact, and 4G SMS alert dispatched to mine management.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Industry Standard Compliance & Field Results */}
      <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase border-b border-slate-800/80 pb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>STANDARDS COMPLIANCE: ISO 21815-2 & EMESRT LEVEL 9</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          FOG-SAFE CAS™ fulfills international earth-moving safety standards, providing Level 7 advisory operator cues, Level 8 directional hazard intervention alarms, and Level 9 deterministic machine interlocks. Tested under severe zero-lux, dense monsoon fog, and high-particulate open-pit haulage environments.
        </p>
      </div>
    </div>
  );
};
