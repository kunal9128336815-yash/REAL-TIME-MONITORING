import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Send, ShieldAlert, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [warningDist, setWarningDist] = useState<number>(8.0);
  const [criticalDist, setCriticalDist] = useState<number>(3.5);
  const [ttcWarning, setTtcWarning] = useState<number>(4.0);
  const [ttcCritical, setTtcCritical] = useState<number>(2.0);
  const [fogThreshold, setFogThreshold] = useState<number>(35.0);
  const [maxSpeed, setMaxSpeed] = useState<number>(30.0);
  const [carrierApn, setCarrierApn] = useState<string>('MineLink 4G Private APN');
  const [smsRecipient, setSmsRecipient] = useState<string>('+91-98765-43210 (Mine Safety Control)');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              SAFETY ENVELOPE THRESHOLDS & 4G TELEMETRY CONFIGURATION
            </h1>
            <p className="text-xs text-slate-400">
              "ISO 21815-2 & EMESRT Level 9 safety parameters — calibrated for open-pit haul fleet operations."
            </p>
          </div>
        </div>

        {saved && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold animate-bounce">
            <Check className="w-4 h-4" />
            <span>THRESHOLDS SAVED</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Safety Thresholds */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            1. COLLISION & PROXIMITY THRESHOLDS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">
                WARNING DISTANCE THRESHOLD (METERS):
              </label>
              <input
                type="number"
                step="0.5"
                value={warningDist}
                onChange={(e) => setWarningDist(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-cyan-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 8.0 m (Triggers Caution/Warning)</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">
                CRITICAL STOP DISTANCE THRESHOLD (METERS):
              </label>
              <input
                type="number"
                step="0.5"
                value={criticalDist}
                onChange={(e) => setCriticalDist(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-cyan-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 3.5 m (Triggers Emergency Stop)</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">
                TTC WARNING THRESHOLD (SECONDS):
              </label>
              <input
                type="number"
                step="0.5"
                value={ttcWarning}
                onChange={(e) => setTtcWarning(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-cyan-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 4.0 s</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">
                TTC CRITICAL THRESHOLD (SECONDS):
              </label>
              <input
                type="number"
                step="0.5"
                value={ttcCritical}
                onChange={(e) => setTtcCritical(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-cyan-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 2.0 s</span>
            </div>
          </div>
        </div>

        {/* Environmental & Haul Road Parameters */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            2. ENVIRONMENTAL & HAUL-ROAD PARAMETERS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">
                DENSE FOG CUTOFF THRESHOLD (%):
              </label>
              <input
                type="number"
                value={fogThreshold}
                onChange={(e) => setFogThreshold(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-cyan-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Below this, multi-sensor ultrasonic fallback is forced</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">
                MAXIMUM HAUL-ROAD SPEED LIMIT (KM/H):
              </label>
              <input
                type="number"
                value={maxSpeed}
                onChange={(e) => setMaxSpeed(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-cyan-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default open-cast pit ramp limit: 30 km/h</span>
            </div>
          </div>
        </div>

        {/* 4G GSM Cellular & Emergency SMS */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            3. SIM7600 4G LTE MODEM & EMERGENCY SMS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">
                CELLULAR NETWORK / PRIVATE APN:
              </label>
              <input
                type="text"
                value={carrierApn}
                onChange={(e) => setCarrierApn(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-cyan-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">SIMCom SIM7600G-H WWAN Interface</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">
                EMERGENCY SMS DISPATCH RECIPIENT:
              </label>
              <input
                type="text"
                value={smsRecipient}
                onChange={(e) => setSmsRecipient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-cyan-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Receives automatic critical collision & distraction alerts</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-600/30"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
};
