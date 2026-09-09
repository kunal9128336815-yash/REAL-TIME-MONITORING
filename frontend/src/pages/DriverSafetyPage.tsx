import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { UserCheck, Headphones, AlertTriangle, ShieldCheck, HelpCircle, Eye, Volume2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DriverSafetyPage: React.FC = () => {
  const { telemetry, triggerScenario } = useTelemetryContext();

  const isDistracted = telemetry.risk.driver_safety.status === 'WARNING';
  const earphoneConf = telemetry.risk.driver_safety.earphone_confidence;

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-purple-400" />
            <span>DRIVER SAFETY & CABIN ATTENTION MONITORING</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Secondary cabin vision module for detecting wearable audio devices and potential auditory distraction
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => triggerScenario('NORMAL_OPERATION')}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-bold flex items-center space-x-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Reset to Nominal Safety</span>
          </button>
        </div>
      </div>

      {/* Main Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Status Card */}
        <div className={`p-5 rounded-xl border flex flex-col justify-center items-center text-center shadow-xl ${
          isDistracted
            ? 'bg-amber-950/70 border-amber-500/70 text-amber-300 shadow-amber-950/50 animate-pulse'
            : 'bg-emerald-950/70 border-emerald-500/70 text-emerald-300 shadow-emerald-950/50'
        }`}>
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
            CABIN OPERATOR ATTENTION POSTURE
          </span>
          <span className="text-3xl font-black tracking-tight mt-1">
            {telemetry.risk.driver_safety.status}
          </span>
          <span className="text-xs mt-1 font-bold">
            {isDistracted ? '⚠️ POTENTIAL DRIVER DISTRACTION' : 'NOMINAL CABIN OBSERVATION'}
          </span>
        </div>

        {/* Earphone Class Confidence */}
        <div className="p-5 rounded-xl bg-[#0a1020] border border-slate-800 flex flex-col justify-center items-center text-center shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            YOLO EARPHONE CLASSIFICATION
          </span>
          <span className="text-3xl font-black text-purple-300 mt-1">
            {isDistracted ? `${Math.round(earphoneConf * 100)}%` : '0%'}
          </span>
          <span className="text-xs text-slate-400 mt-1">
            Class ID: 3 [earphone / headset]
          </span>
        </div>

        {/* Alert Mandate */}
        <div className="p-5 rounded-xl bg-[#0a1020] border border-slate-800 flex flex-col justify-center items-center text-center shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            SUPERVISORY ACTION
          </span>
          <span className="text-lg font-black text-slate-100 mt-1">
            {isDistracted ? 'IN-CABIN AUDIO CHIME' : 'MONITORING NOMINAL'}
          </span>
          <span className="text-xs text-slate-400 mt-1">
            Logged to dispatch safety audit
          </span>
        </div>

      </div>

      {/* Deep Dive: Camera Inspection & Explainability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 cols: Cabin Camera Simulation */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                IN-CABIN SECONDARY CAMERA (OPERATOR PROFILE)
              </h2>
            </div>
            <span className="text-[10px] text-slate-500">
              FRAME RESOLUTION: 640 × 480
            </span>
          </div>

          <div className="relative h-64 rounded-lg overflow-hidden bg-[#060a14] border border-slate-800 flex items-center justify-center">
            {/* Cabin silhouette mockup */}
            <div className="text-center space-y-3 p-4">
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 mx-auto flex items-center justify-center relative">
                <span className="text-2xl">👷</span>
                {isDistracted && (
                  <div className="absolute -top-1 -right-1 p-1 rounded-full bg-purple-500 text-white animate-bounce">
                    <Headphones className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-bold text-slate-200">
                  Dumper D-001 Operator: Ramesh Kumar
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Shift: 08:00 - 16:00 IST • Pit Sector 3
                </div>
              </div>

              {isDistracted ? (
                <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/60 text-amber-300 text-xs font-bold">
                  ⚠️ POTENTIAL DRIVER DISTRACTION DETECTED (EARPHONE / HEADSET IDENTIFIED)
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  ✓ NO AUDIO WEARABLE OBSERVED — ATTENTIVE
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Inference: YOLOv8-Mining Class 3</span>
            <span>Auditory Isolation Risk: {isDistracted ? 'ELEVATED' : 'MINIMAL'}</span>
          </div>
        </div>

        {/* Right 5 cols: Technical Wording & Separation of Duties */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* MANDATORY TECHNICAL WORDING GUIDELINE */}
          <div className="p-4 rounded-xl bg-[#0a1020] border-2 border-purple-500/40 shadow-xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-purple-300 font-bold uppercase">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>STRICT TERMINOLOGY HONESTY</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong className="text-red-400">DO NOT CLAIM:</strong> "The driver is definitely distracted or asleep."
            </p>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong className="text-emerald-400">CORRECT SPECIFICATION:</strong>{' '}
              <span className="text-cyan-300">"Potential driver distraction detected."</span>
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px] pt-1">
              YOLO identifies the presence of an in-ear audio earphone or headset on the operator. In heavy open-cast mining, wearing personal earphones compromises the operator's ability to hear external horn warnings, reverse alarms, or radio dispatches.
            </p>
          </div>

          {/* Separation from Collision Engine */}
          <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/80 pb-2">
              SEPARATION OF SAFETY RESPONSIBILITIES
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Driver distraction monitoring is an <strong className="text-slate-200">independent subsystem</strong>. It logs advisories to the dispatch audit and generates an in-cabin alert, but does NOT trigger emergency collision braking unless a physical obstacle is measured in the vehicle's trajectory.
            </p>
            <div className="pt-2">
              <Link
                to="/collision-safety"
                className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold text-xs"
              >
                <span>Return to Collision Safety Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
