import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, Eye, Radio, MapPin, Activity, Cpu, AlertTriangle, ShieldCheck, ArrowRight, ArrowDown, ChevronRight } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 font-mono pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>SYSTEM & HARDWARE ARCHITECTURE</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive block diagram — Click ANY block to inspect dedicated telemetry and algorithms
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
            EVERY BLOCK IS CLICKABLE
          </span>
        </div>
      </div>

      {/* Interactive System Flow Diagram */}
      <div className="p-6 rounded-xl bg-[#0a1020] border border-slate-800 shadow-2xl space-y-6">
        
        {/* Tier 1: Mining Environment */}
        <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">PHYSICAL STAGE</span>
          <div className="text-sm font-black text-slate-100 uppercase mt-0.5">
            HAZARDOUS MINING PIT & MONSOON FOG ENVIRONMENT
          </div>
        </div>

        <div className="flex justify-center text-cyan-400">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 2: Edge Transducers (All Clickable) */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-2 text-center">
            STAGE 1: HARDWARE TRANSDUCER LAYER (CLICK TO INSPECT SENSOR)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Link
              to="/ai-vision"
              className="p-4 rounded-xl bg-[#070b14] border border-slate-800 hover:border-cyan-500/80 transition-all flex flex-col justify-between group text-center"
            >
              <Eye className="w-6 h-6 text-cyan-400 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                  PI CAMERA
                </h3>
                <span className="text-[10px] text-slate-500 block">Sony IMX219 CSI-2</span>
              </div>
              <span className="text-[10px] text-cyan-400 mt-2 block group-hover:underline">Inspect Vision →</span>
            </Link>

            <Link
              to="/sensors/ultrasonic"
              className="p-4 rounded-xl bg-[#070b14] border border-slate-800 hover:border-cyan-500/80 transition-all flex flex-col justify-between group text-center"
            >
              <Radio className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                  ULTRASONIC ARRAY
                </h3>
                <span className="text-[10px] text-slate-500 block">4-Ch 40kHz Proximity</span>
              </div>
              <span className="text-[10px] text-emerald-400 mt-2 block group-hover:underline">Inspect Acoustic →</span>
            </Link>

            <Link
              to="/sensors/gps"
              className="p-4 rounded-xl bg-[#070b14] border border-slate-800 hover:border-cyan-500/80 transition-all flex flex-col justify-between group text-center"
            >
              <MapPin className="w-6 h-6 text-blue-400 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-200 group-hover:text-blue-300">
                  NEO-6M GNSS
                </h3>
                <span className="text-[10px] text-slate-500 block">Position & Speed</span>
              </div>
              <span className="text-[10px] text-blue-400 mt-2 block group-hover:underline">Inspect GPS →</span>
            </Link>

            <Link
              to="/sensors/imu"
              className="p-4 rounded-xl bg-[#070b14] border border-slate-800 hover:border-cyan-500/80 transition-all flex flex-col justify-between group text-center"
            >
              <Layers className="w-6 h-6 text-purple-400 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-200 group-hover:text-purple-300">
                  MPU6050 IMU
                </h3>
                <span className="text-[10px] text-slate-500 block">Motion, Incline & Tilt</span>
              </div>
              <span className="text-[10px] text-purple-400 mt-2 block group-hover:underline">Inspect IMU →</span>
            </Link>

            <Link
              to="/sensor-fusion"
              className="p-4 rounded-xl bg-[#070b14] border border-slate-800 hover:border-cyan-500/80 transition-all flex flex-col justify-between group text-center"
            >
              <Activity className="w-6 h-6 text-sky-400 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-200 group-hover:text-sky-300">
                  OPTICAL FLOW
                </h3>
                <span className="text-[10px] text-slate-500 block">Local Ground Motion</span>
              </div>
              <span className="text-[10px] text-sky-400 mt-2 block group-hover:underline">Inspect Flow →</span>
            </Link>
          </div>
        </div>

        <div className="flex justify-center text-cyan-400">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 3: Raspberry Pi 4 Edge Compute */}
        <Link
          to="/system"
          className="p-4 rounded-xl bg-[#070b14] border-2 border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center justify-between group block"
        >
          <div className="flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">STAGE 2: EDGE PROCESSOR</span>
              <div className="text-sm font-black text-slate-100 group-hover:text-cyan-200">
                RASPBERRY PI 4 MODEL B (QUAD-CORE CORTEX-A72 @ 1.5 GHz)
              </div>
              <p className="text-[11px] text-slate-400">
                Executes multi-threaded data acquisition, NCNN YOLO inference, and I2C/UART/GPIO polling.
              </p>
            </div>
          </div>
          <span className="text-xs text-cyan-400 font-bold group-hover:underline flex items-center space-x-1 shrink-0">
            <span>Inspect Hardware</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>

        <div className="flex justify-center text-cyan-400">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 4: Sensor Fusion & Risk Engine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/sensor-fusion"
            className="p-5 rounded-xl bg-[#070b14] border border-slate-800 hover:border-cyan-500 transition-all group space-y-2"
          >
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">STAGE 3: FUSION</span>
            <div className="text-base font-black text-slate-100 group-hover:text-cyan-300">
              SYNCHRONOUS SENSOR FUSION ENGINE
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dynamically modulates optical weights based on measured fog opacity while elevating acoustic proximity priority.
            </p>
            <span className="text-[10px] text-cyan-400 block pt-1 group-hover:underline">Explore Fusion Pipeline →</span>
          </Link>

          <Link
            to="/collision-safety"
            className="p-5 rounded-xl bg-[#070b14] border border-slate-800 hover:border-red-500 transition-all group space-y-2"
          >
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">STAGE 4: KINEMATICS</span>
            <div className="text-base font-black text-slate-100 group-hover:text-red-300">
              COLLISION RISK & TTC DECISION ENGINE
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Computes Time to Collision (TTC = Distance / V_close) and evaluates 0–100 multi-hazard risk score.
            </p>
            <span className="text-[10px] text-red-400 block pt-1 group-hover:underline">Explore Risk Engine →</span>
          </Link>
        </div>

        <div className="flex justify-center text-cyan-400">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 5: Outputs (Driver Alert & Command Center) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/driver-safety"
            className="p-4 rounded-xl bg-[#070b14] border border-slate-800 hover:border-purple-500 transition-all group"
          >
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">OUTPUT 1: IN-CABIN</span>
            <div className="text-sm font-black text-slate-100 group-hover:text-purple-300 mt-1">
              DRIVER AUDIO SIREN & EMERGENCY CABIN WARNING
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Piezo buzzer + warning LED + in-cabin distraction chime.
            </p>
          </Link>

          <Link
            to="/"
            className="p-4 rounded-xl bg-[#070b14] border border-slate-800 hover:border-emerald-500 transition-all group"
          >
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">OUTPUT 2: FLEET DISPATCH</span>
            <div className="text-sm font-black text-slate-100 group-hover:text-emerald-300 mt-1">
              FOG-SAFE MINING COMMAND CENTER & 4G SMS DISPATCH
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Centralized GIS live map, fleet telemetry, and automated supervisory alerting.
            </p>
          </Link>
        </div>

      </div>
    </div>
  );
};
