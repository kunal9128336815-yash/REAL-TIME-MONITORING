import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { Radio, CheckCircle2, Waves, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UltrasonicSensorPage: React.FC = () => {
  const { telemetry } = useTelemetryContext();
  const us = telemetry.ultrasonic;

  const channels = [
    { label: 'Front Sensor (CH-1)', distance: us.front, status: 'Active', zone: 'Primary Trajectory Corridor' },
    { label: 'Rear Sensor (CH-2)', distance: us.rear, status: 'Active', zone: 'Reverse Haul Blind Spot' },
    { label: 'Left Flank (CH-3)', distance: us.left, status: 'Active', zone: 'Highwall / Berm Clearance' },
    { label: 'Right Flank (CH-4)', distance: us.right, status: 'Active', zone: 'Passing / Pit Wall Clearance' },
  ];

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Radio className="w-6 h-6 text-blue-600" />
            <span>Ultrasonic Proximity Sensor Array</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            4-Channel short-range acoustic proximity detection architecture for heavy earthmoving dumpers
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>4 / 4 Channels Active</span>
          </span>
        </div>
      </div>

      {/* Industrial Sensor Suite Specification */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex items-start space-x-2.5 shadow-2xs">
        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-blue-900 uppercase tracking-wide">
            Industrial Acoustic Sensor Architecture (ISO 21815-2 & EMESRT Level 9):
          </strong>
          <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
            Heavy-duty IP68 sealed 40 kHz ultrasonic transceivers providing zero-blindspot perimeter sensing (0.2m – 5.0m). Unlike optical sensors that suffer Rayleigh scattering in dense monsoon fog, acoustic pressure waves maintain 100% transmission in zero-visibility conditions, forming the foundational fail-safe layer for autonomous intervention.
          </p>
        </div>
      </div>

      {/* 4 Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-semibold text-slate-600">{ch.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Active</span>
              </span>
            </div>

            <div className="text-center py-2">
              <div className="text-4xl font-bold font-mono text-slate-900 tracking-tight">
                {ch.distance.toFixed(1)} <span className="text-base font-normal font-sans text-slate-500">m</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 block mt-1">
                Round-trip echo: {(ch.distance * 2 / 343 * 1000).toFixed(1)} ms
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              {ch.zone}
            </div>
          </div>
        ))}
      </div>

      {/* Physical Formula & Operating Principle */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
          Acoustic Ranging Principle & Mathematics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-blue-700 font-bold block uppercase text-[11px] tracking-wide">
              Distance Formulation
            </span>
            <div className="p-3 rounded-lg bg-white border border-slate-200 text-center text-sm font-bold font-mono text-blue-900 shadow-2xs">
              Distance (m) = (Time_echo × Speed_of_Sound) ÷ 2
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              At 20°C in standard air, the speed of sound is approximately <strong className="text-slate-800 font-mono">343 m/s (0.0343 cm/µs)</strong>. The division by two accounts for the round-trip distance from transducer to obstacle and back to receiver.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-emerald-700 font-bold block uppercase text-[11px] tracking-wide">
              Why Ultrasonic Remains Unaffected by Fog
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Unlike optical light rays that suffer massive Rayleigh scattering against suspended water droplets in dense monsoon fog, 40 kHz mechanical pressure waves propagate through foggy air with negligible acoustic attenuation over short distances (&lt; 5m).
            </p>
            <div className="pt-2">
              <Link to="/fog-visibility" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1">
                <span>View Fog Resilience Comparison</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Pulse Sequence Diagram */}
        <div className="pt-2">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block mb-2">
            HC-SR04 Pulse Timing Cycle
          </span>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">1. Trigger</span>
              <span className="font-bold text-slate-800 text-[11px]">10 µs High Pulse</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">2. Transmit</span>
              <span className="font-bold text-blue-700 text-[11px]">8-Cycle 40kHz Burst</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">3. Propagate</span>
              <span className="font-bold text-slate-800 text-[11px]">Acoustic Wave Travels</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">4. Receive</span>
              <span className="font-bold text-slate-800 text-[11px]">Echo Returns to Rig</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
              <span className="text-[10px] text-blue-600 block uppercase font-bold">5. Measure</span>
              <span className="font-bold text-[11px]">Echo Width Timed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
