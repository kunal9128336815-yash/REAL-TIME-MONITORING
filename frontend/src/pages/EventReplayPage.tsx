import React, { useState, useEffect } from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { History, Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, ArrowRight, Clock, Truck, Eye, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReplayStep {
  time: string;
  distance: number;
  speed: number;
  ttc: number;
  risk: 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL';
  riskScore: number;
  event: string;
  action: string;
  yoloConf: number;
}

const REPLAY_SEQUENCE: ReplayStep[] = [
  {
    time: '10:42:30',
    distance: 12.5,
    speed: 16.5,
    ttc: 8.2,
    risk: 'SAFE',
    riskScore: 14,
    event: 'Normal haul operation; clear corridor',
    action: 'PROCEED SAFELY',
    yoloConf: 0,
  },
  {
    time: '10:42:31',
    distance: 8.4,
    speed: 15.2,
    ttc: 5.1,
    risk: 'CAUTION',
    riskScore: 42,
    event: 'Person detected by YOLO in blind corridor edge',
    action: 'MONITOR CORRIDOR',
    yoloConf: 82,
  },
  {
    time: '10:42:32',
    distance: 5.8,
    speed: 13.8,
    ttc: 3.4,
    risk: 'WARNING',
    riskScore: 68,
    event: 'Acoustic proximity confirms closing distance: 5.8m',
    action: 'APPLY BRAKES — REDUCE SPEED',
    yoloConf: 89,
  },
  {
    time: '10:42:33',
    distance: 3.9,
    speed: 11.2,
    ttc: 2.3,
    risk: 'WARNING',
    riskScore: 74,
    event: 'Pedestrian steps into direct haul trajectory',
    action: 'HEAVY BRAKING MANDATE',
    yoloConf: 93,
  },
  {
    time: '10:42:34',
    distance: 2.4,
    speed: 8.0,
    ttc: 1.7,
    risk: 'CRITICAL',
    riskScore: 91,
    event: 'Front ultrasonic drops below 2.5m; TTC critical 1.7s',
    action: '🛑 STOP VEHICLE IMMEDIATELY',
    yoloConf: 94,
  },
  {
    time: '10:42:35',
    distance: 2.1,
    speed: 0.0,
    ttc: 0.0,
    risk: 'CRITICAL',
    riskScore: 88,
    event: 'Emergency stop executed; vehicle stationary; 4G SMS dispatched',
    action: 'HOLD STATIONARY — CORRIDOR BLOCKED',
    yoloConf: 94,
  },
];

export const EventReplayPage: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(4); // Default to critical moment
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= REPLAY_SEQUENCE.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const step = REPLAY_SEQUENCE[currentStepIdx];

  const handleStartReplay = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const getRiskColor = (r: string) => {
    switch (r) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/70 border-red-500';
      case 'WARNING':
        return 'text-amber-400 bg-amber-950/70 border-amber-500';
      case 'CAUTION':
        return 'text-yellow-400 bg-yellow-950/70 border-yellow-500';
      default:
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-500';
    }
  };

  return (
    <div className="space-y-4 font-mono pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>INCIDENT EVENT REPLAY TIMELINE</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Post-incident synchronized forensic playback of kinematics, vision, and collision decision
          </p>
        </div>

        {/* Replay Action Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleStartReplay}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-900/40 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>▶ REPLAY COMPLETE INCIDENT</span>
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => { setIsPlaying(false); setCurrentStepIdx(0); }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset to start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Replay Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 cols: Interactive Playback Stage */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">FRAME TIME:</span>
              <span className="text-sm font-black text-cyan-300">{step.time} IST</span>
            </div>
            <span className="text-xs text-slate-500">
              FRAME {currentStepIdx + 1} OF {REPLAY_SEQUENCE.length}
            </span>
          </div>

          {/* Visual Kinematic Reconstruction */}
          <div className="relative h-60 rounded-xl bg-[#070b14] border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">VEHICLE D-001 (CAT 777E)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskColor(step.risk)}`}>
                {step.risk} ({step.riskScore}/100)
              </span>
            </div>

            {/* Simulated trajectory track */}
            <div className="relative flex items-center justify-between px-8 py-6">
              {/* Dumper */}
              <div className="flex flex-col items-center space-y-1 z-10">
                <div className="w-16 h-12 rounded-lg bg-slate-800 border-2 border-cyan-500 flex items-center justify-center text-lg">
                  🚛
                </div>
                <span className="text-[10px] text-cyan-300 font-bold">{step.speed.toFixed(1)} km/h</span>
              </div>

              {/* Distance Arrow & Wavefront */}
              <div className="flex-1 mx-4 flex flex-col items-center relative">
                <div className="w-full h-0.5 bg-slate-700 border-t border-dashed border-cyan-400/60" />
                <div className="my-1 text-center">
                  <span className="text-xl font-black text-cyan-300">{step.distance.toFixed(1)} m</span>
                  <span className="text-[10px] text-slate-400 block">TTC: {step.ttc > 0 ? `${step.ttc.toFixed(1)}s` : 'STOPPED'}</span>
                </div>
              </div>

              {/* Hazard Target (Person) */}
              <div className="flex flex-col items-center space-y-1 z-10">
                <div className="w-12 h-12 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-lg animate-pulse">
                  👤
                </div>
                <span className="text-[10px] text-red-400 font-bold">
                  {step.yoloConf > 0 ? `${step.yoloConf}% YOLO` : 'UNDETECTED'}
                </span>
              </div>
            </div>

            <div className="text-center font-bold text-sm text-slate-100 bg-slate-900/80 py-1.5 rounded-lg border border-slate-800">
              {step.action}
            </div>
          </div>

          {/* Scrubber Timeline */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>SCRUBBER:</span>
              <span className="text-cyan-400">{step.time}</span>
            </div>
            <input
              type="range"
              min="0"
              max={REPLAY_SEQUENCE.length - 1}
              value={currentStepIdx}
              onChange={(e) => { setIsPlaying(false); setCurrentStepIdx(parseInt(e.target.value, 10)); }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Right 5 cols: Chronological Event Log */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              CHRONOLOGICAL INCIDENT LOG
            </h2>
            <span className="text-[10px] text-cyan-400">CLICK TO JUMP</span>
          </div>

          <div className="space-y-2">
            {REPLAY_SEQUENCE.map((s, idx) => (
              <div
                key={idx}
                onClick={() => { setIsPlaying(false); setCurrentStepIdx(idx); }}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer text-xs ${
                  idx === currentStepIdx
                    ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 font-bold scale-[1.01]'
                    : 'bg-[#070b14] border-slate-800 text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-cyan-400">{s.time}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${getRiskColor(s.risk)}`}>
                    {s.risk}
                  </span>
                </div>
                <p className="mt-1 text-slate-200 leading-snug">
                  {s.event}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                  <span>Dist: {s.distance.toFixed(1)}m</span>
                  <span>Speed: {s.speed.toFixed(1)} km/h</span>
                  <span>TTC: {s.ttc > 0 ? `${s.ttc.toFixed(1)}s` : '0s'}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
