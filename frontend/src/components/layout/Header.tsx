import React, { useState, useEffect } from 'react';
import { ShieldAlert, Signal, Wifi, Cpu, Volume2, VolumeX, Clock, HardDrive } from 'lucide-react';
import { TelemetryState } from '../../types';
import { audioAlerts } from '../../services/audioAlerts';

interface HeaderProps {
  telemetry: TelemetryState;
  backendConnected: boolean;
  operatingMode: 'DEMO_MODE' | 'LIVE_HARDWARE';
  onToggleMode: (mode: 'DEMO_MODE' | 'LIVE_HARDWARE') => void;
}

export const Header: React.FC<HeaderProps> = ({
  telemetry,
  backendConnected,
  operatingMode,
  onToggleMode,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(audioAlerts.getMuted());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMute = () => {
    const nextMuted = audioAlerts.toggleMute();
    setIsMuted(nextMuted);
  };

  const getGsmSignalBars = (csq: number) => {
    if (csq >= 22) return '●●●●';
    if (csq >= 15) return '●●●○';
    if (csq >= 8) return '●●○○';
    return '●○○○';
  };

  return (
    <header className="bg-[#080d19] border-b border-slate-800 text-slate-100 px-4 py-2.5 shadow-lg sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/40">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  FOG-SAFE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                  v3.4 ENTERPRISE CAS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                AI Multi-Sensor Collision Avoidance System for Mining Dumpers
              </p>
            </div>
          </div>

          {/* System status pill */}
          <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Center / Right Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto text-xs">
          
          {/* 4G GSM SIM Module Status */}
          <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 shadow-inner">
            <Signal className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-300">4G LTE</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {getGsmSignalBars(telemetry.gsm.csq)}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {telemetry.gsm.signal_dbm} dBm
              </span>
            </div>
          </div>

          {/* Backend / Edge Link indicator */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
            <Wifi className={`w-3.5 h-3.5 ${backendConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-slate-300 font-medium">
              {backendConnected ? 'Command Server Linked' : 'Edge Simulator Active'}
            </span>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => onToggleMode('DEMO_MODE')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                operatingMode === 'DEMO_MODE'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SIM BENCH
            </button>
            <button
              onClick={() => onToggleMode('LIVE_HARDWARE')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                operatingMode === 'LIVE_HARDWARE'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LIVE FLEET
            </button>
          </div>

          {/* Audio Alert Mute Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio Alerts' : 'Mute Audio Alerts'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-red-950/40 border-red-500/40 text-red-400 hover:bg-red-900/40'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Live Clock */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeStr}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
