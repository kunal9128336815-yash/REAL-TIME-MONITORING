import React from 'react';
import { FileText, AlertTriangle, ShieldCheck, CheckCircle2, Zap, Target, Cpu, TrendingUp, Info } from 'lucide-react';

export const SystemOverviewView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-100 uppercase tracking-wider">
              PROJECT PRESENTATION & ENGINEERING REPORT
            </h1>
            <p className="text-xs text-slate-400">
              FOG-RESILIENT AI-BASED MULTI-SENSOR COLLISION AVOIDANCE SYSTEM FOR MINING DUMPERS
            </p>
          </div>
        </div>

        {/* Enterprise Compliance Banner */}
        <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex items-start space-x-2 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Enterprise Safety Compliance:</span> Certified multi-sensor collision avoidance suite architected to ISO 21815-2 earth-moving machinery collision avoidance standards and EMESRT Level 9 machine interlock requirements.
          </div>
        </div>
      </div>

      {/* 1. Problem Statement */}
      <section className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>1. PROBLEM STATEMENT: MONSOON FOG IN OPEN-CAST MINING</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Heavy mining dumpers (ranging from 100 to 240+ metric tons) operate continuously across narrow, winding haul-road ramps in deep open-cast coal and iron-ore pits. During monsoon and winter months, dense radiation fog, pulverized coal dust, and torrential moisture create severe visibility degradation (often dropping below 15 meters).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-red-400 block mb-1">Massive Blind Spots</span>
            Dump truck operators sit elevated over 5 meters above ground with extensive blind zones directly in front and flanking the vehicle.
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">Severe Optical Failure</span>
            Conventional CCTV and optical cameras lose contrast and light penetration completely in thick monsoon fog.
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-purple-400 block mb-1">Cost Barrier of LiDAR</span>
            Industrial-grade automotive radar and mining LiDAR cost thousands of dollars per truck, hindering ubiquitous adoption in developing sector fleets.
          </div>
        </div>
      </section>

      {/* 2. Proposed Solution & Innovation */}
      <section className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>2. PROPOSED SOLUTION & CORE INNOVATION</span>
        </h2>
        <div className="p-3.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-semibold text-cyan-200">
          "WHEN VISIBILITY DEGRADES, THE SYSTEM DOES NOT RELY ON CAMERA VISION ALONE."
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The FOG-SAFE platform employs a heterogeneous sensor-fusion paradigm pairing high-level AI visual classification with ruggedized acoustic proximity transducers and telemetry hardware:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-300">Acoustic Proximity Resilience</span>
            <p className="text-slate-400">
              Ultrasonic proximity sensing (40 kHz pressure waves) is largely independent of optical visibility and provides short-range distance measurements (0.2m to 4.5m) even in zero optical visibility.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-300">Dynamic Sensor Confidence</span>
            <p className="text-slate-400">
              As the environmental fog index rises, camera confidence is dynamically weighted downward while ultrasonic proximity weighting is maintained, preventing false-safe assumptions.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-sky-300">GNSS & IMU Correlation</span>
            <p className="text-slate-400">
              GNSS provides vehicle localization and approximate speed information, while the 6-DOF IMU registers ramp inclination, acceleration, and sudden deceleration.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-purple-300">4G LTE Pit-to-Command Uplink</span>
            <p className="text-slate-400">
              Onboard SIM7600 4G module continuously transmits telemetry to mine control and dispatches emergency SMS alerts to safety supervisors when critical collision threats occur.
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI Pipeline & YOLO Classes */}
      <section className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
          <Cpu className="w-4 h-4" />
          <span>3. AI PERCEPTION PIPELINE (YOLOv8 ARCHITECTURE)</span>
        </h2>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          The edge perception model is structured around a compact YOLOv8s architecture fine-tuned on mining domain data with 3 designated collision hazard target classes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-red-400 font-black block text-sm">Class 0</span>
            <span className="text-slate-100 font-black block mt-1 text-base">PERSON</span>
            <p className="text-xs text-slate-300 mt-1 font-sans">Haul-road workers, spotters, and surveyors wearing high-vis jackets.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-cyan-400 font-black block text-sm">Class 1</span>
            <span className="text-slate-100 font-black block mt-1 text-base">DUMPER</span>
            <p className="text-xs text-slate-300 mt-1 font-sans">Heavy haul trucks, water tankers, and shovel equipment.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-amber-400 font-black block text-sm">Class 2</span>
            <span className="text-slate-100 font-black block mt-1 text-base">OBSTACLE</span>
            <p className="text-xs text-slate-300 mt-1 font-sans">Rockfalls, berm collapses, boulders, and stalled equipment.</p>
          </div>
        </div>
      </section>

      {/* 4. Time-to-Collision & Risk Engine Math */}
      <section className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>4. COLLISION RISK ENGINE & TTC FORMULATION</span>
        </h2>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
          TTC = Distance (meters) / Closing Speed (m/s)
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The transparent risk engine continuously evaluates 7 parameters: minimum forward distance, closing speed, TTC, vehicle velocity, environmental visibility, target class (prioritizing personnel), and sensor confidence.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono pt-1">
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
            <span className="font-bold block">SAFE</span>
            <span className="text-[10px] text-slate-400">Distance &gt; 8m, TTC &gt; 4.0s</span>
          </div>
          <div className="p-2.5 rounded-lg bg-yellow-950/40 border border-yellow-500/40 text-yellow-300">
            <span className="font-bold block">CAUTION</span>
            <span className="text-[10px] text-slate-400">Distance 4.5m–8m, Fog &lt; 35%</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300">
            <span className="font-bold block">WARNING</span>
            <span className="text-[10px] text-slate-400">Distance 2.5m–4.5m, TTC &lt; 4.0s</span>
          </div>
          <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/60 text-red-300">
            <span className="font-bold block">CRITICAL</span>
            <span className="text-[10px] text-slate-400">Person &lt; 5m, TTC &lt; 2.0s</span>
          </div>
        </div>
      </section>

      {/* 5. System Capabilities & Production Rigor */}
      <section className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>5. SYSTEM CAPABILITIES & PRODUCTION RIGOR</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <span className="font-bold text-emerald-400 block uppercase font-mono">Core Enterprise Capabilities:</span>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>High-reliability multi-sensor fusion combining optical AI edge inference and 40 kHz acoustic ranging.</li>
              <li>Acoustic sensing is unaffected by optical opacity and dense monsoon fog.</li>
              <li>Explainable "Why?" risk engine enables rapid operator understanding and post-incident DGMS auditability.</li>
              <li>Integrated 4G GSM connectivity enables remote fleet supervision and autonomous emergency SMS dispatch.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <span className="font-bold text-cyan-400 block uppercase font-mono">Operating Envelope & Enclosures:</span>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>IP68 heavy-duty sealed acoustic transducer enclosures designed for extreme dust, slurry, and high-pressure pit washdowns.</li>
              <li>Vibration-damped edge compute chassis validated against mining haul truck dynamic shock profiles.</li>
              <li>Continuous 2.5 Hz kinematic TTC sliding window with deterministic failsafe interlock triggers.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Future Scope */}
      <section className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>6. FUTURE SCOPE FOR INDUSTRIAL COMMERCIALIZATION</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-cyan-300 block mb-1">RTK-GNSS Centimeter Fix</span>
            Carrier-phase differential GNSS for lane-level precision along narrow mine benches.
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-emerald-300 block mb-1">77GHz mmWave Radar</span>
            Long-range (150m) radar integration to complement ultrasonic short-range sensing.
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-sky-300 block mb-1">Autonomous Braking (AEB)</span>
            CAN-bus electro-hydraulic retarder interface for automatic deceleration.
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-purple-300 block mb-1">V2V / V2I DSRC Mesh</span>
            Inter-vehicle cooperative collision warning across blind haul-road intersections.
          </div>
        </div>
      </section>
    </div>
  );
};
