import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, Eye, Radio, MapPin, Activity, Cpu, AlertTriangle, ShieldCheck, ArrowRight, ArrowDown, ChevronRight } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <span>System & Hardware Architecture</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Interactive system architecture &bull; Click any block to inspect live telemetry and algorithms
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
            EVERY BLOCK INTERACTIVE
          </span>
        </div>
      </div>

      {/* Interactive System Flow Diagram */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
        {/* Tier 1: Mining Environment */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">PHYSICAL STAGE</span>
          <div className="text-sm font-bold text-slate-900 uppercase mt-0.5">
            HAZARDOUS MINING PIT & MONSOON FOG ENVIRONMENT
          </div>
        </div>

        <div className="flex justify-center text-blue-600">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 2: Edge Transducers */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2 text-center">
            STAGE 1: HARDWARE TRANSDUCER LAYER (CLICK TO INSPECT SENSOR)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Link
              to="/ai-vision"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all flex flex-col justify-between group text-center shadow-2xs"
            >
              <Eye className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                  PI CAMERA
                </h3>
                <span className="text-[10px] text-slate-500 block">Sony IMX219 CSI-2</span>
              </div>
              <span className="text-[11px] text-blue-600 font-semibold mt-2 block group-hover:underline">Inspect Vision &rarr;</span>
            </Link>

            <Link
              to="/sensors/ultrasonic"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-white transition-all flex flex-col justify-between group text-center shadow-2xs"
            >
              <Radio className="w-6 h-6 text-emerald-600 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">
                  ULTRASONIC ARRAY
                </h3>
                <span className="text-[10px] text-slate-500 block">4-Ch 40kHz Proximity</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-2 block group-hover:underline">Inspect Acoustic &rarr;</span>
            </Link>

            <Link
              to="/sensors/gps"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all flex flex-col justify-between group text-center shadow-2xs"
            >
              <MapPin className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                  NEO-6M GNSS
                </h3>
                <span className="text-[10px] text-slate-500 block">Position & Speed</span>
              </div>
              <span className="text-[11px] text-blue-600 font-semibold mt-2 block group-hover:underline">Inspect GPS &rarr;</span>
            </Link>

            <Link
              to="/sensors/imu"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-white transition-all flex flex-col justify-between group text-center shadow-2xs"
            >
              <Layers className="w-6 h-6 text-purple-600 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-purple-600">
                  MPU6050 IMU
                </h3>
                <span className="text-[10px] text-slate-500 block">Motion & Tilt</span>
              </div>
              <span className="text-[11px] text-purple-600 font-semibold mt-2 block group-hover:underline">Inspect IMU &rarr;</span>
            </Link>

            <Link
              to="/sensor-fusion"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-white transition-all flex flex-col justify-between group text-center shadow-2xs"
            >
              <Activity className="w-6 h-6 text-sky-600 mx-auto" />
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-sky-600">
                  OPTICAL FLOW
                </h3>
                <span className="text-[10px] text-slate-500 block">Ground Motion</span>
              </div>
              <span className="text-[11px] text-sky-600 font-semibold mt-2 block group-hover:underline">Inspect Flow &rarr;</span>
            </Link>
          </div>
        </div>

        <div className="flex justify-center text-blue-600">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 3: Raspberry Pi 4 Edge Compute */}
        <Link
          to="/system"
          className="p-4 rounded-xl bg-slate-50 border-2 border-blue-300 hover:border-blue-500 hover:bg-white transition-all flex items-center justify-between group block shadow-2xs"
        >
          <div className="flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-blue-600" />
            <div>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">STAGE 2: EDGE PROCESSOR</span>
              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                RASPBERRY PI 4 MODEL B (QUAD-CORE CORTEX-A72 @ 1.5 GHz)
              </div>
              <p className="text-xs text-slate-500">
                Multi-threaded data acquisition, hardware polling, and live telemetry streaming.
              </p>
            </div>
          </div>
          <span className="text-xs text-blue-600 font-semibold group-hover:underline flex items-center space-x-1 shrink-0">
            <span>Inspect Hardware</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>

        <div className="flex justify-center text-blue-600">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 4: Sensor Fusion & Risk Engine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/sensor-fusion"
            className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all group space-y-2 shadow-2xs"
          >
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">STAGE 3: FUSION</span>
            <div className="text-base font-bold text-slate-900 group-hover:text-blue-600">
              SYNCHRONOUS SENSOR FUSION ENGINE
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dynamically modulates optical weights based on measured fog opacity while elevating acoustic proximity priority.
            </p>
            <span className="text-xs text-blue-600 font-semibold block pt-1 group-hover:underline">Explore Fusion Pipeline &rarr;</span>
          </Link>

          <Link
            to="/collision-safety"
            className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-400 hover:bg-white transition-all group space-y-2 shadow-2xs"
          >
            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block">STAGE 4: KINEMATICS</span>
            <div className="text-base font-bold text-slate-900 group-hover:text-red-600">
              COLLISION RISK & TTC DECISION ENGINE
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computes Time to Collision (TTC = Distance / V_close) and evaluates 0–100 multi-hazard risk score.
            </p>
            <span className="text-xs text-red-600 font-semibold block pt-1 group-hover:underline">Explore Risk Engine &rarr;</span>
          </Link>
        </div>

        <div className="flex justify-center text-blue-600">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 5: Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/driver-safety"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-white transition-all group shadow-2xs"
          >
            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider block">OUTPUT 1: IN-CABIN</span>
            <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600 mt-1">
              DRIVER AUDIO SIREN & EMERGENCY CABIN WARNING
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Piezo buzzer + warning horn + in-cabin distraction chime.
            </p>
          </Link>

          <Link
            to="/"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-white transition-all group shadow-2xs"
          >
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">OUTPUT 2: FLEET DISPATCH</span>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 mt-1">
              FOG-SAFE MINING COMMAND CENTER & 4G SMS DISPATCH
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Centralized GIS live map, fleet telemetry, and automated supervisory alerting.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
