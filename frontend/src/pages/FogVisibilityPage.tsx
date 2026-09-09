import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { CloudFog, Eye, Radio, ShieldCheck, RotateCcw } from 'lucide-react';

export const FogVisibilityPage: React.FC = () => {
  const { telemetry, setManualVisibility, clearManualVisibility } = useTelemetryContext();

  const currentVis = Math.round(telemetry.visibility.index_percent);
  const cameraConf = telemetry.risk.sensor_confidence.camera;
  const isOpticalDegraded = telemetry.visibility.optical_degraded;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setManualVisibility(val);
  };

  const getVisibilityBadge = (vis: number) => {
    if (vis > 75) return { label: 'CLEAR', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (vis > 50) return { label: 'LIGHT FOG', color: 'text-sky-800 bg-sky-50 border-sky-200' };
    if (vis > 35) return { label: 'MODERATE FOG', color: 'text-yellow-800 bg-yellow-50 border-yellow-200' };
    if (vis > 20) return { label: 'DENSE FOG', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    return { label: 'CRITICAL VISIBILITY', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const badge = getVisibilityBadge(currentVis);

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <CloudFog className="w-6 h-6 text-sky-600" />
            <span>Environmental Visibility & Fog Resilience</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Demonstration of optical degradation vs acoustic proximity invariance in dense monsoon fog
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={clearManualVisibility}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 border border-slate-300 transition-colors shadow-2xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Auto Scenario</span>
          </button>
        </div>
      </div>

      {/* Hero Visibility Index Display */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
              Monsoon Haul Road Visibility Index
            </span>
            <div className="flex items-baseline space-x-3 mt-1">
              <span className="text-5xl font-bold font-mono text-slate-900">
                {currentVis}%
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-sans">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Optical Camera</span>
              <span className={`font-bold ${isOpticalDegraded ? 'text-amber-700' : 'text-emerald-700'}`}>
                {isOpticalDegraded ? 'Vision Degraded' : 'Nominal Clarity'}
              </span>
            </div>
            <div className="text-left md:text-right border-l border-slate-200 pl-4">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Ultrasonic Array</span>
              <span className="font-bold text-emerald-700">
                Active & Available
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Fog Slider */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-800 font-semibold">Interactive Monsoon Fog Slider:</span>
            <span className="text-blue-700 font-medium">Drag to observe real-time system reaction</span>
          </div>

          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={currentVis}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-[10px] text-slate-500 uppercase pt-1">
            <span>Critical Fog (&lt;20%)</span>
            <span>Dense Fog (30%)</span>
            <span>Moderate (50%)</span>
            <span>Light Fog (70%)</span>
            <span>Clear Sky (95%)</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side: Camera View Simulation in Fog vs Ultrasonic Acoustic Beam */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Optical Camera View Degradation Canvas */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Optical Camera View (Simulated Fog Degradation)
              </h2>
            </div>
            <span className={`text-xs font-bold font-mono ${isOpticalDegraded ? 'text-amber-700' : 'text-emerald-700'}`}>
              Confidence: {cameraConf}%
            </span>
          </div>

          {/* Visual Canvas simulating fog overlay */}
          <div className="relative h-64 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            {/* Simulated background haul road */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                filter: `blur(${Math.max(0, (100 - currentVis) * 0.08)}px) contrast(${Math.max(0.4, currentVis / 100)})`,
                backgroundImage: `radial-gradient(ellipse at center, #94a3b8 0%, #475569 100%)`
              }}
            >
              {/* Haul road perspective guides */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-full border-x-2 border-dashed border-slate-300/80 transform perspective-500 rotateX-45" />
              </div>
            </div>

            {/* Fog Overlay Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                backgroundColor: '#f1f5f9',
                opacity: Math.max(0.05, (100 - currentVis) / 105),
              }}
            />

            {/* Center Status Callout */}
            <div className="relative z-10 p-4 rounded-xl bg-white/95 border border-slate-200 text-center shadow-md backdrop-blur-sm max-w-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Optical Clarity Index
              </span>
              <div className="text-base font-bold text-slate-900 mt-1">
                {currentVis > 50 ? 'Clear Corridor Sightline' : 'Dense Monsoon Obscuration'}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {currentVis > 50
                  ? 'Optical camera bounding boxes robust & high-contrast.'
                  : 'Severe optical Rayleigh scattering reduces YOLO confidence.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Camera Sensor: Pi Camera V2</span>
            <span>Rayleigh Scattering: {isOpticalDegraded ? 'High' : 'Minimal'}</span>
          </div>
        </div>

        {/* Ultrasonic Acoustic View (Unaffected by Fog) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Ultrasonic Proximity Array (Acoustic Wavefront)
              </h2>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-700">
              Confidence: 98% (Steady)
            </span>
          </div>

          {/* Acoustic Graphic Container */}
          <div className="relative h-64 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Frequency: 40 kHz Mechanical Wave</span>
              <span className="text-emerald-700 font-semibold">Fog Resilient: 100%</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <div className="w-28 h-10 rounded-lg bg-white border border-blue-300 shadow-xs flex items-center justify-center text-xs font-bold text-blue-800">
                Dumper Front
              </div>

              {/* Animated Wavefronts */}
              <div className="space-y-1.5 w-full flex flex-col items-center">
                <div className="w-36 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                <div className="w-48 h-2 rounded-full bg-emerald-500/50" />
                <div className="w-60 h-2 rounded-full bg-emerald-500/30" />
              </div>

              <div className="text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Front Echo Reflection</span>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {telemetry.ultrasonic.front.toFixed(1)} Meters
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center font-mono">
              Speed of Sound: 343 m/s &bull; Round-trip: {(telemetry.ultrasonic.front * 2 / 343 * 1000).toFixed(1)} ms
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Transducer: Industrial 40 kHz IP68 Array</span>
            <span>Acoustic Attenuation: &lt; 0.05 dB/m in fog</span>
          </div>
        </div>

      </div>

      {/* KEY MESSAGE SECTION: "WHAT HAPPENS WHEN FOG BLOCKS VISION?" */}
      <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wide">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>What Happens When Dense Monsoon Fog Blocks Vision?</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-amber-800 font-bold block mb-1">1. Camera Reliability Drops:</span>
            Optical Rayleigh scattering reduces image contrast. YOLO detection confidence decreases as visibility worsens.
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-emerald-800 font-bold block mb-1">2. Ultrasonic Remains Active:</span>
            40 kHz acoustic pressure pulses are mechanically unaffected by airborne water droplets at short proximity ranges.
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-blue-800 font-bold block mb-1">3. Sensor Fusion Compensates:</span>
            The fusion engine dynamically discounts optical certainty and elevates ultrasonic proximity weighting.
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-purple-800 font-bold block mb-1">4. Safety Stop Guaranteed:</span>
            Even if the camera fails to see a human, ultrasonic proximity triggers the autonomous emergency stop request.
          </div>
        </div>
      </div>
    </div>
  );
};
