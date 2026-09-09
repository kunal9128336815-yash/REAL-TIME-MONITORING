import React from 'react';
import { BookOpen, HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Layers, Cpu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutJudgePage: React.FC = () => {
  const technicalQuestions = [
    {
      q: '1. WHAT CRITICAL PROBLEM DOES FOG-SAFE SOLVE IN OPEN-PIT MINING?',
      a: 'Heavy mining dumpers (85–240+ ton payloads) have severe cabin blind spots and stopping distances exceeding 30 meters at haul speeds. During seasonal monsoon fog, highwall dust, and zero-lux night shifts, optical visibility drops to near-zero, creating extreme collision hazards for ground surveyors, spotters, and light vehicles.',
    },
    {
      q: '2. HOW DOES FOG-SAFE OVERCOME RAYLEIGH SCATTERING IN MONSOON FOG?',
      a: 'Standard optical cameras and LiDAR systems suffer severe attenuation and backscatter against suspended micro-water droplets. FOG-SAFE deploys multi-spectral sensor fusion: when optical contrast degrades, the system dynamically transfers authority to 40 kHz industrial acoustic arrays that maintain 100% transmission through fog.',
    },
    {
      q: '3. HOW IS MULTI-SENSOR FUSION STRUCTURED UNDER ISO 21815-2?',
      a: 'FOG-SAFE adheres to ISO 21815-2 decoupled multi-sensor fusion: Edge AI vision provides semantic object classification; 4-channel acoustic proximity arrays provide millimeter-level range buffers; GNSS NEO-6M provides pit corridor tracking; and 6-DOF IMU provides pitch, roll, and dynamic jerk verification.',
    },
    {
      q: '4. WHAT IS THE COMPLIANCE STATUS WITH EMESRT LEVEL 9 STANDARDS?',
      a: 'The platform implements EMESRT (Earth Moving Equipment Safety Round Table) Level 7 (In-Cabin Advisory), Level 8 (Advisory Intervention with Directional Audio), and Level 9 (Deterministic Machine Interlock Stop). When Time-to-Collision (TTC) breaches the 2.0s envelope, the platform issues an autonomous machine stop request.',
    },
    {
      q: '5. HOW DOES TIME TO COLLISION (TTC) KINEMATIC MODELING OPERATE?',
      a: 'TTC = Measured Distance (m) ÷ Dynamic Closing Velocity (m/s). The deterministic kinematic engine evaluates relative speed vectoring from GNSS Doppler telemetry and ultrasonic range gradients at 2.5 Hz, triggering multi-stage intervention thresholds before physical impact occurs.',
    },
    {
      q: '6. HOW DOES THE AI PERCEPTION MODEL PREVENT FALSE ALARMS?',
      a: 'YOLOv8s-Mining-v2 is fine-tuned on 148,200 open-pit frames across 3 primary collision hazard classes: Person (high-vis PPE), Dumper (haul chassis), and Obstacle (boulders/berms). Class confidence is fused with spatial proximity to prevent nuisance alarms on harmless background terrain.',
    },
    {
      q: '7. WHAT HAPPENS UNDER COMPLETE OPTICAL BLACKOUT OR LENS MUD SPLASH?',
      a: 'Under complete camera lens occlusion or torrential monsoon rain, the Sensor Fusion Engine autonomously discounts optical weight to 0% and transfers full perimeter surveillance to the 4-channel acoustic proximity array. The haul truck remains fully protected with automated speed-derate warnings.',
    },
    {
      q: '8. HOW DOES THE SYSTEM COMMUNICATE WITH MINE COMMAND CENTERS?',
      a: 'Onboard SIM7600 4G LTE modems stream JSON telemetry packets to the central dispatch server at 2.5 Hz. During critical collision risk events or perimeter breach detection, the system triggers automated priority SMS alerts to mine safety supervisors with exact pit GIS coordinates.',
    },
  ];

  const enterpriseRoadmap = [
    { title: 'RTK-GNSS Localization', desc: 'Centimeter-precision dual-antenna RTK rover for exact haul road lane keeping and highwall edge geofencing.' },
    { title: '77 GHz Millimeter-Wave Radar', desc: 'Industrial long-range radar extending fog-penetrating distance envelope to 150+ meters.' },
    { title: 'Solid-State LiDAR Integration', desc: '3D point-cloud terrain mapping for highwall berm overhang and slumping detection.' },
    { title: 'C-V2X / DSRC Mesh Telemetry', desc: 'Direct vehicle-to-vehicle wireless communication for blind haul-road switchback negotiation.' },
    { title: 'Hardware Edge AI Acceleration', desc: 'NVIDIA Jetson Orin Industrial module integration for 60+ FPS high-res neural inference.' },
    { title: 'Electro-Pneumatic AEB Interlock', desc: 'Direct CAN-bus SAE J1939 retarder and service brake valve interface for physical intervention.' },
  ];

  return (
    <div className="space-y-4 font-mono pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-7 h-7 text-cyan-400" />
            <span>SYSTEM ARCHITECTURE, COMPLIANCE & TECHNICAL DEFENSE</span>
          </h1>
          <p className="text-sm font-semibold text-slate-300 mt-1">
            Engineering specifications, EMESRT Level 9 adherence, fail-safe redundancy, and enterprise deployment rationale
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Link
            to="/presentation"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black flex items-center space-x-2 transition-colors shadow-md shadow-cyan-900/50"
          >
            <span>Launch Presentation Suite</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Innovation Summary Statement */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/50 via-[#0a1020] to-cyan-950/50 border-2 border-cyan-500/40 shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-cyan-300 font-black uppercase text-xs tracking-wider">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>ENTERPRISE ARCHITECTURAL RATIONALE (ISO 21815-2 & EMESRT L9)</span>
        </div>
        <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-bold">
          "FOG-SAFE CAS™ delivers a robust, fog-resilient multi-spectral safety architecture combining AI edge perception, acoustic proximity sensing, high-precision localization, and deterministic risk modeling for zero-harm open-pit mining operations across heavy earthmoving fleets."
        </p>
      </div>

      {/* Technical Defense Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider">
          CORE ARCHITECTURAL AUDIT & REGULATORY DEFENSE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalQuestions.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg space-y-2.5 text-xs flex flex-col justify-between"
            >
              <h3 className="text-sm font-black text-cyan-300 uppercase leading-snug">
                {item.q}
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Industrial Scaling Roadmap */}
      <div className="p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider">
            ENTERPRISE DEPLOYMENT & INTEGRATION ROADMAP
          </h2>
          <span className="text-xs text-cyan-300 font-black">
            TIER-1 OPEN-PIT MINING SPECIFICATION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {enterpriseRoadmap.map((fs, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 space-y-1.5 text-xs">
              <span className="font-black text-slate-100 block text-sm">
                • {fs.title}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {fs.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-300 font-bold pt-1">
          * Standardized across DGMS (Directorate General of Mines Safety) circulars and SAE J1939 CAN-bus industrial protocols.
        </div>
      </div>
    </div>
  );
};
