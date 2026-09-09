import React from 'react';
import { ScenarioType, GuidedDemoState } from '../../types';
import { GUIDED_DEMO_PHASES } from '../../services/simulator';
import { Play, Pause, RotateCcw, FastForward, Award, Layers, Sparkles } from 'lucide-react';

interface ScenarioControlProps {
  currentScenario: ScenarioType | string;
  guidedDemo: GuidedDemoState;
  onSelectScenario: (scenario: ScenarioType) => void;
  onStartGuidedDemo: () => void;
  onControl: (action: 'start' | 'pause' | 'reset', speed?: number) => void;
}

export const ScenarioControl: React.FC<ScenarioControlProps> = ({
  currentScenario,
  guidedDemo,
  onSelectScenario,
  onStartGuidedDemo,
  onControl,
}) => {
  const scenarios: { id: ScenarioType; label: string; desc: string; badge: string }[] = [
    {
      id: 'NORMAL_OPERATION',
      label: 'NORMAL OPERATION',
      desc: 'Clear corridor, high visibility, safe speed',
      badge: 'SAFE',
    },
    {
      id: 'DENSE_FOG',
      label: 'DENSE FOG',
      desc: 'Monsoon fog (24% vis), camera degrades, ultrasonic active',
      badge: 'INNOVATION',
    },
    {
      id: 'PERSON_ON_ROAD',
      label: 'PERSON ON ROAD',
      desc: 'Worker detected at 2.1m, TTC 1.4s, STOP VEHICLE',
      badge: 'CRITICAL',
    },
    {
      id: 'DUMPER_APPROACHING',
      label: 'DUMPER APPROACHING',
      desc: 'Oncoming dumper closing distance 14m -> 5m',
      badge: 'WARNING',
    },
    {
      id: 'OBSTACLE_AHEAD',
      label: 'OBSTACLE AHEAD',
      desc: 'Fallen boulder on haul road at 3.4m',
      badge: 'CAUTION',
    },
    {
      id: 'MULTI_HAZARD',
      label: 'MULTI-HAZARD',
      desc: 'Dense fog + oncoming dumper + pedestrian on road',
      badge: 'COMPLEX',
    },
  ];

  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
      {/* Top Bar: Playback Controls & Guided Demo Button */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
        
        {/* Left Title */}
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-black uppercase tracking-wider text-cyan-400">
            SCENARIO & DEMO CONTROL CENTER
          </span>
        </div>

        {/* Center: Transport controls (Start, Pause, Reset, Speed) */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-950 p-1.5 rounded-lg border border-slate-800 space-x-1">
            <button
              onClick={() => onControl('start')}
              className="p-1.5 rounded hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Start Simulation"
            >
              <Play className="w-4 h-4" />
            </button>
            <button
              onClick={() => onControl('pause')}
              className="p-1.5 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors"
              title="Pause Simulation"
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              onClick={() => onControl('reset')}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs font-mono font-bold space-x-1">
            <span className="text-slate-400 px-1 text-xs">SPEED:</span>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => onControl('start', spd)}
                className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                {spd}×
              </button>
            ))}
          </div>

          {/* SAFETY DRILL SIMULATION BUTTON */}
          <button
            onClick={onStartGuidedDemo}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all shadow-lg ${
              guidedDemo.active
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-orange-500/30 animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/30'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{guidedDemo.active ? 'SAFETY DRILL RUNNING' : '▶ RUN SAFETY VERIFICATION DRILL'}</span>
          </button>
        </div>

      </div>

      {/* Guided Demo Progress Bar (When Active) */}
      {guidedDemo.active && (
        <div className="mt-3 p-3 rounded-lg bg-cyan-950/50 border border-cyan-500/40">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-cyan-300">
              {guidedDemo.phase_title || `PHASE ${guidedDemo.phase} / ${guidedDemo.total_phases}`}
            </span>
            <span className="text-slate-400">
              Phase {guidedDemo.phase} of 6 (~72s Presentation Sequence)
            </span>
          </div>

          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mt-2 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
              style={{ width: `${(guidedDemo.phase / guidedDemo.total_phases) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 6 Scenario Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
        {scenarios.map((sc) => {
          const isActive = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                    isActive ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {sc.badge}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
                </div>

                <div className={`text-xs sm:text-sm font-black mt-2 leading-tight ${
                  isActive ? 'text-cyan-300' : 'text-slate-100'
                }`}>
                  {sc.label}
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-tight">
                {sc.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
