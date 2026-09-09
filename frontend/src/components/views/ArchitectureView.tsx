import React from 'react';
import { Cpu, Camera, Radio, Navigation, Compass, Zap, ShieldAlert, ArrowDown, Send, CheckCircle2 } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
              HARDWARE INTEGRATION & SENSOR FUSION ARCHITECTURE
            </h2>
            <p className="text-xs text-slate-400">
              Complete edge-to-cloud signal flow from physical transducers to central command center
            </p>
          </div>
        </div>
      </div>

      {/* Interactive System Flow Diagram */}
      <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono mb-6">
          1. END-TO-END DATAFLOW PIPELINE
        </h3>

        {/* LAYER 1: SENSORS */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-center">
            <Camera className="w-5 h-5 text-cyan-400 mx-auto" />
            <span className="text-xs font-bold block mt-1 text-slate-200">PI CAMERA V2</span>
            <span className="text-[10px] text-slate-400 font-mono">1080p CSI Ribbon</span>
            <div className="mt-2 p-1 bg-slate-950 rounded text-[9px] font-mono text-cyan-300">
              YOLOv8 Inference (Person/Dumper/Rock/Ear)
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-center">
            <Radio className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-xs font-bold block mt-1 text-slate-200">4x ULTRASONIC</span>
            <span className="text-[10px] text-slate-400 font-mono">HC/JSN-SR04T (GPIO)</span>
            <div className="mt-2 p-1 bg-slate-950 rounded text-[9px] font-mono text-emerald-300">
              Acoustic 40kHz Proximity (Fog-Resilient)
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-center">
            <Navigation className="w-5 h-5 text-sky-400 mx-auto" />
            <span className="text-xs font-bold block mt-1 text-slate-200">NEO-6M GNSS</span>
            <span className="text-[10px] text-slate-400 font-mono">UART (9600 Baud)</span>
            <div className="mt-2 p-1 bg-slate-950 rounded text-[9px] font-mono text-sky-300">
              Haul Road Geofence & Ground Speed
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-center">
            <Compass className="w-5 h-5 text-purple-400 mx-auto" />
            <span className="text-xs font-bold block mt-1 text-slate-200">MPU-6050 IMU</span>
            <span className="text-[10px] text-slate-400 font-mono">I2C (0x68 Bus)</span>
            <div className="mt-2 p-1 bg-slate-950 rounded text-[9px] font-mono text-purple-300">
              6-DOF Pitch/Roll & Vehicle Tilt
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-center">
            <Zap className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="text-xs font-bold block mt-1 text-slate-200">OPTICAL FLOW</span>
            <span className="text-[10px] text-slate-400 font-mono">Lucas-Kanade Py</span>
            <div className="mt-2 p-1 bg-slate-950 rounded text-[9px] font-mono text-amber-300">
              Local Surface Motion & Slip Detection
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-center">
            <Send className="w-5 h-5 text-blue-400 mx-auto" />
            <span className="text-xs font-bold block mt-1 text-slate-200">SIM7600 4G LTE</span>
            <span className="text-[10px] text-slate-400 font-mono">USB / UART AT Cmd</span>
            <div className="mt-2 p-1 bg-slate-950 rounded text-[9px] font-mono text-blue-300">
              Pit-to-Command Link & Emergency SMS
            </div>
          </div>
        </div>

        {/* DOWN ARROW CONNECTOR */}
        <div className="flex justify-center my-3">
          <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />
        </div>

        {/* LAYER 2: EDGE COMPUTATION */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-2 border-cyan-500/60 text-center shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-300" />
            <span className="text-sm font-black uppercase tracking-wider text-cyan-200">
              RASPBERRY PI 4 MODEL B (8GB) — ONBOARD EDGE CONTROLLER
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Runs lightweight YOLO inference, 4-node ultrasonic time-of-flight polling, Kalman filter velocity estimation, and edge collision risk matrix.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] font-mono">
            <span className="p-1 bg-slate-950/80 rounded border border-slate-800 text-cyan-300">
              Input: 5 Heterogeneous Streams
            </span>
            <span className="p-1 bg-slate-950/80 rounded border border-slate-800 text-emerald-300">
              Risk Engine: TTC = Distance / Closing Speed
            </span>
            <span className="p-1 bg-slate-950/80 rounded border border-slate-800 text-purple-300">
              In-Cab Warnings: Audio Chimes & Visual HUD
            </span>
          </div>
        </div>

        {/* DOWN ARROW CONNECTOR */}
        <div className="flex justify-center my-3">
          <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />
        </div>

        {/* LAYER 3: CENTRAL COMMAND SERVER & DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block font-mono">
              CENTRAL MINE COMMAND BACKEND
            </span>
            <p className="text-xs text-slate-300 mt-1">
              Python FastAPI Gateway with WebSocket broadcast, SQLite persistence, and multi-vehicle fleet telemetry ingestion via <code className="text-cyan-300">POST /api/sensors</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block font-mono">
              FOG-SAFE COMMAND CENTER (REACT + TS)
            </span>
            <p className="text-xs text-slate-300 mt-1">
              Real-time situational awareness console featuring live vehicle digital twin, AI vision feed with dynamic fog overlay, GPS map, and SMS audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono mb-4">
          2. SUBSYSTEM SPECIFICATIONS & INTERFACES
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Subsystem</th>
                <th className="py-2.5 px-3">Hardware Transducer</th>
                <th className="py-2.5 px-3">Interface / Pinout</th>
                <th className="py-2.5 px-3">Sampling Rate</th>
                <th className="py-2.5 px-3">Role in Monsoon Fog</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-bold text-cyan-300">Forward Vision</td>
                <td className="py-2.5 px-3">Pi Camera V2 (Sony IMX219)</td>
                <td className="py-2.5 px-3">MIPI CSI-2 (15-pin ribbon)</td>
                <td className="py-2.5 px-3">28 FPS</td>
                <td className="py-2.5 px-3 text-amber-300">Subject to optical degradation; confidence drops below 35%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-300">Proximity Array</td>
                <td className="py-2.5 px-3">4x HC-SR04 / JSN-SR04T</td>
                <td className="py-2.5 px-3">GPIO (Trig/Echo with 1k/2k divider)</td>
                <td className="py-2.5 px-3">10 Hz</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100% Fog-Resilient (Acoustic 40kHz sound waves)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-sky-300">Localization</td>
                <td className="py-2.5 px-3">u-blox NEO-6M GNSS</td>
                <td className="py-2.5 px-3">UART (GPIO 14 TXD / 15 RXD)</td>
                <td className="py-2.5 px-3">5 Hz</td>
                <td className="py-2.5 px-3">Haul road corridor geofencing & ground speed</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-purple-300">Chassis Attitude</td>
                <td className="py-2.5 px-3">InvenSense MPU-6050</td>
                <td className="py-2.5 px-3">I2C (GPIO 2 SDA / 3 SCL)</td>
                <td className="py-2.5 px-3">50 Hz</td>
                <td className="py-2.5 px-3">Pitch/tilt calculation on steep haul-road ramps</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-blue-300">Cellular Uplink</td>
                <td className="py-2.5 px-3">SIMCom SIM7600G-H 4G LTE</td>
                <td className="py-2.5 px-3">USB 2.0 / UART AT Cmds</td>
                <td className="py-2.5 px-3">Real-time</td>
                <td className="py-2.5 px-3">Pit-to-command data telemetry and SMS emergency alerts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
