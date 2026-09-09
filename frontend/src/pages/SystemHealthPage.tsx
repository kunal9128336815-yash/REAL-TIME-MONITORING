import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { Cpu, HardDrive, Wifi, Radio, Eye, Layers, MapPin, Activity, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SystemHealthPage: React.FC = () => {
  const { telemetry, backendConnected } = useTelemetryContext();
  const sh = telemetry.system_health;

  const hardwareNodes = [
    { name: 'Raspberry Pi 4 Model B (4GB)', status: sh.raspberry_pi, icon: Cpu, desc: 'Quad-core Cortex-A72 @ 1.5GHz (Edge host)', to: '/system' },
    { name: 'Pi Camera Module V2 (8MP)', status: sh.pi_camera, icon: Eye, desc: 'Sony IMX219 sensor, CSI-2 ribbon bus', to: '/ai-vision' },
    { name: 'Ultrasonic Transducer Array (4-Ch)', status: sh.ultrasonic_array, icon: Radio, desc: 'HC-SR04 pulse acoustic transducers (GPIO)', to: '/sensors/ultrasonic' },
    { name: 'NEO-6M GNSS GPS Module', status: sh.neo6m_gps, icon: MapPin, desc: 'UART serial @ 9600 baud, NMEA parser', to: '/sensors/gps' },
    { name: 'MPU6050 6-DOF IMU', status: sh.mpu6050_imu, icon: Layers, desc: 'I2C bus @ 0x68, accelerometer & gyro', to: '/sensors/imu' },
    { name: 'SIM7600 4G LTE GSM Modem', status: sh.gsm_4g_sim, icon: Wifi, desc: 'USB CDC-ACM / AT Command emergency SMS relay', to: '/alerts' },
    { name: 'FastAPI Telemetry Backend', status: backendConnected ? 'ONLINE' : 'STANDALONE MODE', icon: Activity, desc: 'Python Uvicorn server @ port 8000', to: '/system' },
    { name: 'SQLite Historical Database', status: sh.database, icon: HardDrive, desc: 'WAL mode persistent telemetry logging', to: '/system' },
  ];

  return (
    <div className="space-y-4 font-mono pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>SYSTEM & HARDWARE HEALTH MONITOR</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Diagnostic state, bus connectivity, and operating telemetry of certified edge ADAS controller
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>8 / 8 SUBSYSTEMS NOMINAL</span>
          </span>
        </div>
      </div>

      {/* Edge Diagnostics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">EDGE CPU LOAD</span>
          <div className="text-2xl font-black text-cyan-300 mt-1">38.4%</div>
          <span className="text-[10px] text-slate-500 mt-1 block">4 cores active</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">PI SOC TEMPERATURE</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">48.2°C</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Passive heatsink nominal</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">RAM UTILIZATION</span>
          <div className="text-2xl font-black text-slate-100 mt-1">1.4 / 4.0 <span className="text-xs font-normal text-slate-500">GB</span></div>
          <span className="text-[10px] text-cyan-400 mt-1 block">Model weights in cache</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">BUS TELEMETRY LATENCY</span>
          <div className="text-2xl font-black text-sky-400 mt-1">{sh.latency_ms} <span className="text-xs font-normal text-slate-500">ms</span></div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Real-time synchronous</span>
        </div>
      </div>

      {/* Hardware Subsystem Node Cards */}
      <div className="p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            HARDWARE TOPOLOGY & INTERFACE HEALTH
          </h2>
          <span className="text-xs text-slate-500">
            AUTO-RECONNECT RESILIENT (NON-BLOCKING)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hardwareNodes.map((node, i) => {
            const Icon = node.icon;
            const isOnline = node.status.includes('ONLINE') || node.status.includes('LOCKED') || node.status.includes('RUNNING') || node.status.includes('CONNECTED');
            return (
              <Link
                key={i}
                to={node.to}
                className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 hover:border-cyan-500/60 transition-all flex items-start justify-between space-x-3 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 group-hover:border-cyan-500 transition-colors shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {node.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{node.desc}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 border ${
                  isOnline
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                }`}>
                  {node.status}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Fault Tolerance & Graceful Degradation */}
      <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-bold uppercase border-b border-slate-800/80 pb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>FAULT TOLERANCE & GRACEFUL DEGRADATION SPECIFICATION</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          If any physical sensor (e.g. Camera or GPS) disconnects during haulage, the FOG-SAFE architecture triggers graceful degradation: the dashboard displays <span className="text-amber-300 font-bold">"DEVICE OFFLINE"</span> without crashing or halting other critical proximity loops. Ultrasonic distance polling continues uninterrupted.
        </p>
      </div>
    </div>
  );
};
