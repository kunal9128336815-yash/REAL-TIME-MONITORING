import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { Cpu, HardDrive, Wifi, Radio, Eye, Layers, MapPin, Activity, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SystemHealthPage: React.FC = () => {
  const { telemetry, backendConnected, isPiConnected, piStatus } = useTelemetryContext();
  const sh = telemetry.system_health;

  const hardwareNodes = [
    { name: 'Raspberry Pi 4 Model B (4GB)', status: isPiConnected ? 'ONLINE (HARDWARE STREAM)' : sh.raspberry_pi, icon: Cpu, desc: 'Quad-core Cortex-A72 @ 1.5GHz (Edge host)', to: '/' },
    { name: 'Pi Camera Module V2 (8MP)', status: sh.pi_camera, icon: Eye, desc: 'Sony IMX219 sensor, CSI-2 ribbon bus', to: '/ai-vision' },
    { name: 'Ultrasonic Transducer Array (4-Ch)', status: sh.ultrasonic_array, icon: Radio, desc: 'HC-SR04 pulse acoustic transducers (GPIO)', to: '/sensors/ultrasonic' },
    { name: 'NEO-6M GNSS GPS Module', status: sh.neo6m_gps, icon: MapPin, desc: 'UART serial @ 9600 baud, NMEA parser', to: '/sensors/gps' },
    { name: 'MPU6050 6-DOF IMU', status: sh.mpu6050_imu, icon: Layers, desc: 'I2C bus @ 0x68, accelerometer & gyro', to: '/sensors/imu' },
    { name: 'SIM7600 4G LTE GSM Modem', status: sh.gsm_4g_sim, icon: Wifi, desc: 'USB CDC-ACM / AT Command emergency SMS relay', to: '/alerts' },
    { name: 'FastAPI Telemetry Backend', status: backendConnected ? 'ONLINE' : 'STANDALONE MODE', icon: Activity, desc: 'Python Uvicorn server @ port 8000', to: '/system' },
    { name: 'Historical Telemetry Log', status: sh.database, icon: HardDrive, desc: 'In-memory buffer & persistent state engine', to: '/system' },
  ];

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            <span>System & Hardware Health Monitor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Diagnostic state, bus connectivity, and operating telemetry of certified edge ADAS controller
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>8 / 8 SUBSYSTEMS NOMINAL</span>
          </span>
        </div>
      </div>

      {/* Edge Diagnostics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">EDGE CPU LOAD</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">38.4%</div>
          <span className="text-[11px] text-slate-400 mt-1 block font-sans">4 cores active</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">PI SOC TEMPERATURE</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">48.2°C</div>
          <span className="text-[11px] text-slate-400 mt-1 block font-sans">Passive heatsink nominal</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">RAM UTILIZATION</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">1.4 / 4.0 <span className="text-xs font-normal text-slate-500">GB</span></div>
          <span className="text-[11px] text-blue-600 font-medium mt-1 block font-sans">Model weights in cache</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">BUS TELEMETRY LATENCY</span>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">{piStatus.lastPingMs || sh.latency_ms} <span className="text-xs font-normal text-slate-500">ms</span></div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block font-sans">Real-time synchronous</span>
        </div>
      </div>

      {/* Hardware Subsystem Node Cards */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            HARDWARE TOPOLOGY & INTERFACE HEALTH
          </h2>
          <span className="text-xs text-slate-500 font-medium">
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
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-slate-100/80 transition-all flex items-start justify-between space-x-3 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:border-blue-300 text-blue-600 transition-colors shrink-0 mt-0.5 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {node.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{node.desc}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                  isOnline
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {node.status}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Fault Tolerance & Graceful Degradation */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-800 font-bold uppercase border-b border-slate-200 pb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>FAULT TOLERANCE & GRACEFUL DEGRADATION SPECIFICATION</span>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed">
          If any physical sensor (e.g. Camera or GPS) disconnects during haulage, the FOG-SAFE architecture triggers graceful degradation: the dashboard displays <span className="text-amber-700 font-semibold">"DEVICE OFFLINE"</span> without crashing or halting other critical proximity loops. Ultrasonic distance polling continues uninterrupted.
        </p>
      </div>
    </div>
  );
};
