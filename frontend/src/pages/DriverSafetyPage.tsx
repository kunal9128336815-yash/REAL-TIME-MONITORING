import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { UserCheck, Headphones, AlertTriangle, ShieldCheck, HelpCircle, Eye, Volume2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DriverSafetyPage: React.FC = () => {
  const { telemetry, triggerScenario } = useTelemetryContext();

  const isDistracted = telemetry.risk.driver_safety.status === 'WARNING';
  const earphoneConf = telemetry.risk.driver_safety.earphone_confidence;

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-purple-600" />
            <span>Driver Safety & Cabin Attention Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secondary cabin vision module for detecting wearable audio devices and potential auditory distraction
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => triggerScenario('NORMAL_OPERATION')}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Reset to Nominal Safety</span>
          </button>
        </div>
      </div>

      {/* Main Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Card */}
        <div
          className={`p-5 rounded-xl border flex flex-col justify-center items-center text-center shadow-xs ${
            isDistracted
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
            CABIN OPERATOR ATTENTION POSTURE
          </span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {telemetry.risk.driver_safety.status}
          </span>
          <span className="text-xs mt-1 font-semibold">
            {isDistracted ? '⚠️ Potential Driver Distraction' : 'Nominal Cabin Observation'}
          </span>
        </div>

        {/* Earphone Class Confidence */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col justify-center items-center text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            YOLO EARPHONE CLASSIFICATION
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-purple-600 mt-1">
            {isDistracted ? `${Math.round(earphoneConf * 100)}%` : '0%'}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Class ID: 3 (earphone / headset)
          </span>
        </div>

        {/* Alert Mandate */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col justify-center items-center text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            SUPERVISORY ACTION
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {isDistracted ? 'IN-CABIN AUDIO CHIME' : 'MONITORING NOMINAL'}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Logged to dispatch safety audit
          </span>
        </div>
      </div>

      {/* Deep Dive: Camera Inspection & Explainability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 cols: Cabin Camera Simulation */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                IN-CABIN SECONDARY CAMERA (OPERATOR PROFILE)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              640 × 480 @ 30 FPS
            </span>
          </div>

          <div className="relative h-64 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center">
            {/* Cabin silhouette mockup */}
            <div className="text-center space-y-3 p-4">
              <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-slate-300 mx-auto flex items-center justify-center relative">
                <span className="text-2xl">👷</span>
                {isDistracted && (
                  <div className="absolute -top-1 -right-1 p-1 rounded-full bg-purple-600 text-white animate-bounce">
                    <Headphones className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-bold text-slate-900">
                  Dumper D-001 Operator: Ramesh Kumar
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Shift: 08:00 - 16:00 IST &bull; Pit Sector 3
                </div>
              </div>

              {isDistracted ? (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
                  ⚠️ Potential driver distraction detected (audio wearable identified)
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                  ✓ No audio wearable observed — driver attentive
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Inference: YOLOv8-Mining Class 3</span>
            <span>Auditory Isolation: <strong className={isDistracted ? 'text-amber-700' : 'text-emerald-700'}>{isDistracted ? 'ELEVATED' : 'MINIMAL'}</strong></span>
          </div>
        </div>

        {/* Right 5 cols: Technical Wording & Separation of Duties */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-purple-700 font-bold uppercase">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Operational Advisory</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              <strong className="text-red-700">DO NOT ASSUME:</strong> "The driver is definitely distracted or asleep."
            </p>
            <p className="text-slate-700 leading-relaxed text-xs">
              <strong className="text-emerald-700">SPECIFICATION:</strong>{' '}
              <span className="text-blue-700 font-medium">"Potential driver distraction detected."</span>
            </p>
            <p className="text-slate-500 leading-relaxed text-xs pt-1">
              YOLO identifies the presence of an in-ear audio earphone or headset on the operator. In heavy open-cast mining, wearing personal earphones compromises the operator's ability to hear external horn warnings or reverse alarms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
              SEPARATION OF SAFETY RESPONSIBILITIES
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Driver distraction monitoring is an <strong className="text-slate-800">independent supervisory subsystem</strong>. It logs advisories to the dispatch audit and generates an in-cabin alert, but does NOT trigger emergency collision braking unless a physical obstacle is measured in the vehicle's trajectory.
            </p>
            <div className="pt-2">
              <Link
                to="/collision-safety"
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 font-semibold text-xs"
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
