import React, { useState } from 'react';
import {
  X,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Wifi,
  ExternalLink,
  Laptop,
  Check,
  Radio,
  Sliders
} from 'lucide-react';
import { PiConnectionStatus, DEFAULT_PI_URL } from '../../services/piHardwareClient';

interface PiConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: PiConnectionStatus;
  onUpdateUrl: (url: string) => void;
  onCheckConnection: () => Promise<boolean>;
}

export const PiConnectionModal: React.FC<PiConnectionModalProps> = ({
  isOpen,
  onClose,
  status,
  onUpdateUrl,
  onCheckConnection,
}) => {
  const [urlInput, setUrlInput] = useState(status.url || DEFAULT_PI_URL);
  const [isChecking, setIsChecking] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsChecking(true);
    setTestResult(null);
    try {
      const ok = await onCheckConnection();
      if (ok) {
        setTestResult({
          success: true,
          message: 'Connection successful! Streaming live telemetry packets from Raspberry Pi.',
        });
      } else {
        setTestResult({
          success: false,
          message:
            status.lastError ||
            'Could not reach Pi at this address. Check if Pi is powered ON and on the same hotspot.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection attempt timed out.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onUpdateUrl(trimmed);
      handleTest();
    }
  };

  const handlePreset = (presetUrl: string) => {
    setUrlInput(presetUrl);
    onUpdateUrl(presetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Raspberry Pi 4 Hardware Bridge
              </h2>
              <p className="text-xs text-slate-500">
                Direct sensor telemetry connection at <span className="font-mono text-slate-700 font-semibold">{status.url}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Real-time Status Card */}
          <div
            className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
              status.connected
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    status.connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className="font-bold text-sm">
                  {status.connected ? 'PI IS ON (ONLINE & STREAMING)' : 'PI IS OFF (STANDBY / SIMULATION)'}
                </span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                {status.connected ? `${status.lastPingMs || '<30'}ms latency` : 'Standby Engine'}
              </span>
            </div>

            <div className="text-xs text-slate-600 grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active URL</span>
                <span className="font-mono text-[11px] truncate block" title={status.url}>
                  {status.url}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Packets Polled</span>
                <span className="font-mono font-bold text-slate-800">{status.sampleCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cadence</span>
                <span className="font-mono text-slate-800">~3 Hz (350ms)</span>
              </div>
            </div>

            {status.lastError && !status.connected && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg mt-1 flex items-start space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{status.lastError}</span>
              </div>
            )}
          </div>

          {/* URL Configuration Form */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Raspberry Pi Telemetry Endpoint
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://192.168.137.30:5000/data"
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
              />
              <button
                onClick={handleSave}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                Save
              </button>
              <button
                onClick={handleTest}
                disabled={isChecking}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-blue-600' : ''}`} />
                <span>{isChecking ? 'Testing...' : 'Test Ping'}</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
              <button
                onClick={() => handlePreset(DEFAULT_PI_URL)}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-mono transition-colors"
              >
                192.168.137.30:5000/data
              </button>
              <button
                onClick={() => handlePreset('/pi-proxy')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-mono transition-colors"
              >
                /pi-proxy (Vite Proxy)
              </button>
              <button
                onClick={() => handlePreset('http://localhost:5000/data')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-mono transition-colors"
              >
                localhost:5000/data
              </button>
            </div>
          </div>

          {/* Test Feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-semibold block">
                  {testResult.success ? 'Success' : 'Connection Notice'}
                </span>
                <span>{testResult.message}</span>
              </div>
            </div>
          )}

          {/* Setup / Hotspot Guide */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-blue-900">
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>How to connect your Raspberry Pi to this Dashboard:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
              <li>
                Turn <strong>ON</strong> <em>Mobile Hotspot</em> on your Windows laptop.
              </li>
              <li>
                Connect your Raspberry Pi to this laptop hotspot (it will receive an IP like <code className="bg-white px-1 py-0.5 rounded border border-blue-200 font-mono text-blue-800">192.168.137.30</code>).
              </li>
              <li>
                Start your Python script on the Pi (e.g. <code className="bg-white px-1 py-0.5 rounded border border-blue-200 font-mono text-blue-800">python3 app.py</code>) serving JSON at port <code className="bg-white px-1 py-0.5 rounded border border-blue-200 font-mono text-blue-800">5000/data</code>.
              </li>
              <li>
                Click <strong>Test Ping</strong> above. The dashboard will automatically switch from simulated data to live hardware readings!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-sans">
            Auto-normalizes Ultrasonic, GPS, IMU, Fog & AI Vision telemetry
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
