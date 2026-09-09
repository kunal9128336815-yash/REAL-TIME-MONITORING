import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTelemetryContext } from '../context/TelemetryContext';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldAlert,
  CloudFog,
  Eye,
  Activity,
  Radio,
  AlertTriangle,
  Truck,
  BarChart3,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const PresentationModePage: React.FC = () => {
  const navigate = useNavigate();
  const { telemetry } = useTelemetryContext();
  const [slideIdx, setSlideIdx] = useState<number>(0);

  const slides = [
    {
      title: '1. THE MINING PROBLEM',
      subtitle: 'Heavy Haulage Blind Spots in Monsoon Fog',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-lg leading-relaxed">
            Open-cast mining dumpers weigh over <strong className="text-cyan-300">100 tons</strong> with massive blind spots and long stopping distances. During seasonal monsoon fog, visibility on pit haul roads drops below 15 meters, creating severe collision danger between heavy dumpers and ground personnel.
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300">
              <span className="text-3xl font-black block">100+ Tons</span>
              <span className="text-xs uppercase mt-1 block">Chassis Inertia</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300">
              <span className="text-3xl font-black block">&lt; 15 Meters</span>
              <span className="text-xs uppercase mt-1 block">Monsoon Visibility</span>
            </div>
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300">
              <span className="text-3xl font-black block">High Collision Risk</span>
              <span className="text-xs uppercase mt-1 block">Personnel & Equipment</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2. THE FOG DILEMMA',
      subtitle: 'Why Standard Cameras and Human Vision Fail',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-lg leading-relaxed">
            Dense fog consists of suspended micro-water droplets that cause intense <strong className="text-cyan-300">Rayleigh optical scattering</strong>. Light contrasts diminish exponentially, causing human drivers and AI cameras to miss obstacles until they are at point-blank range.
          </div>
          <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 text-center text-cyan-300 font-bold text-lg">
            Koschmieder Law: Contrast drops exponentially with distance d • I(x) = J(x)e^(-β·d)
          </div>
        </div>
      ),
    },
    {
      title: '3. AI OBJECT DETECTION (YOLO)',
      subtitle: '"What is it?" — Edge Classification on Raspberry Pi',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-lg leading-relaxed">
            FOG-SAFE deploys a custom-trained <strong className="text-cyan-300">YOLOv8s model</strong> to identify 3 core mining collision hazard classes: Person, Dumper, and Obstacle. Class semantics allow the risk engine to prioritize human vulnerability over stationary boulders.
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold text-base">
              [0] PERSON (Vulnerable Personnel)
            </div>
            <div className="p-3.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold text-base">
              [1] DUMPER (Oncoming Haulers)
            </div>
            <div className="p-3.5 rounded-lg bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 font-bold text-base">
              [2] OBSTACLE (Boulders & Berms)
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '4. MULTI-SENSOR FUSION',
      subtitle: 'Combining Acoustic, Optical, GNSS, and Inertial Streams',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-lg leading-relaxed">
            When fog impairs camera vision, the system does <strong className="text-red-400">NOT</strong> fail. The Sensor Fusion Engine shifts confidence weights from optical classifiers to 40 kHz ultrasonic acoustic transducers, maintaining continuous situational awareness.
          </div>
          <div className="grid grid-cols-4 gap-3 text-center text-sm">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-xs">CAMERA</span>
              <strong className="text-amber-400">Degrades in Fog</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-xs">ULTRASONIC</span>
              <strong className="text-emerald-400">Unimpaired in Fog</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-xs">GNSS</span>
              <strong className="text-blue-400">Haul Road Position</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-xs">IMU</span>
              <strong className="text-purple-400">Tilt & Inertia</strong>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '5. ULTRASONIC PROXIMITY',
      subtitle: '"How far is it?" — Acoustic Echo Ranging',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-lg leading-relaxed">
            40 kHz mechanical pressure waves travel through airborne water droplets with negligible acoustic loss at short distances (&lt; 5m). Distance is measured precisely via round-trip time of flight:
          </div>
          <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-center text-2xl font-black text-cyan-300">
            Distance = (Time_echo × Speed_of_Sound) ÷ 2
          </div>
        </div>
      ),
    },
    {
      title: '6. KINEMATIC TIME TO COLLISION (TTC)',
      subtitle: 'Dynamic Closing Velocity & Safety Buffer',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-lg leading-relaxed">
            Distance alone is insufficient. A vehicle 4 meters away moving at 15 km/h has less than 1.0 second to impact. FOG-SAFE continuously calculates dynamic TTC:
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-2xl font-black text-slate-100">
            TTC = Measured Distance ÷ Closing Speed (m/s)
          </div>
          <p className="text-center text-sm text-cyan-400 font-bold">
            Threshold: TTC &lt; 2.0s triggers automatic CRITICAL safety escalation.
          </p>
        </div>
      ),
    },
    {
      title: '7. MULTI-FACTOR RISK SCORE (0–100)',
      subtitle: 'Unified Safety Envelope Assessment',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-lg leading-relaxed">
            A comprehensive 0–100 risk score is synthesized from distance, TTC, visibility, object class, speed, and multi-hazard conditions.
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold">
              0–30: SAFE
            </div>
            <div className="p-3 rounded-lg bg-yellow-950/70 border border-yellow-500/40 text-yellow-300 font-bold">
              31–55: CAUTION
            </div>
            <div className="p-3 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold">
              56–75: WARNING
            </div>
            <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 font-bold">
              76–100: CRITICAL
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '8. CRITICAL ALERT & STOP VEHICLE MANDATE',
      subtitle: 'Autonomous Protective Action & 4G Dispatch',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-red-950/40 border-2 border-red-500 text-center space-y-2">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
            <div className="text-3xl font-black text-red-200">
              🛑 STOP VEHICLE IMMEDIATELY
            </div>
            <p className="text-sm text-red-300 max-w-lg mx-auto">
              Pedestrian detected in forward haul corridor at 2.4m • TTC = 1.7 seconds • Cabin buzzer activated • 4G emergency SMS transmitted to Mine Dispatch
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '9. FLEET MONITORING & GIS TRACKING',
      subtitle: 'Pit-Wide Real-Time Operational Awareness',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-lg leading-relaxed">
            Centralized command center displays all haul dumpers across the pit, monitoring geofences, haul speeds, individual collision risks, and driver alertness.
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-xs">HAUL FLEET</span>
              <strong className="text-slate-200">4 Active Dumpers</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-xs">GEOFENCE STATUS</span>
              <strong className="text-emerald-400">Within Buffer</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-xs">TELEMETRY BUS</span>
              <strong className="text-cyan-400">4G LTE Cellular</strong>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '10. FUTURE INDUSTRIAL ROADMAP',
      subtitle: 'Path to Commercial Mine Certification',
      content: (
        <div className="space-y-4 text-slate-200">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-1">1. 77 GHz Automotive Radar:</strong>
              Extends fog-penetrating range up to 150 meters for highway haul speeds.
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-1">2. Dual-Antenna RTK-GNSS:</strong>
              Centimeter-level pit localization and highwall edge geofencing.
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-1">3. C-V2X Mesh Network:</strong>
              Direct vehicle-to-vehicle communication around blind switchback curves.
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-1">4. Electro-Pneumatic AEB:</strong>
              Fail-safe autonomous emergency brake valve actuation.
            </div>
          </div>
          <div className="text-center text-xs text-slate-400 font-bold pt-2">
            FOG-SAFE CAS™ Enterprise Suite — Industrial Compliance: ISO 21815-2 & EMESRT Level 9 Machine Interlock
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[slideIdx];

  return (
    <div className="fixed inset-0 z-50 bg-[#060a14] text-slate-100 flex flex-col justify-between p-6 sm:p-10 font-mono select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase tracking-widest">
              FOG-SAFE PRESENTATION MODE
            </span>
            <span className="text-base font-black text-cyan-300">
              Slide {slideIdx + 1} of {slides.length}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>EXIT TO COMMAND CENTER</span>
          </button>
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="max-w-4xl mx-auto w-full my-auto space-y-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
            {slide.subtitle}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight mt-1">
            {slide.title}
          </h1>
        </div>

        <div className="py-2">
          {slide.content}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
        <button
          disabled={slideIdx === 0}
          onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
            slideIdx === 0 ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS SLIDE</span>
        </button>

        {/* Slide Dots */}
        <div className="flex items-center space-x-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === slideIdx ? 'bg-cyan-400 w-6' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          disabled={slideIdx === slides.length - 1}
          onClick={() => setSlideIdx(Math.min(slides.length - 1, slideIdx + 1))}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
            slideIdx === slides.length - 1
              ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
              : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/40'
          }`}
        >
          <span>NEXT SLIDE</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
