import React from 'react';
import { SystemHealthData, GsmData } from '../../types';
import { Cpu, CheckCircle2, Wifi, Zap, Activity } from 'lucide-react';

interface SystemHealthPanelProps {
  health: SystemHealthData;
  gsm: GsmData;
}

export const SystemHealthPanel: React.FC<SystemHealthPanelProps> = ({ health, gsm }) => {
  const items = [
    { label: 'Edge SBC', name: 'Raspberry Pi 4 (8GB)', status: health.raspberry_pi, ok: true },
    { label: 'Vision Sensor', name: 'Pi Camera V2 (CSI)', status: health.pi_camera, ok: true },
    { label: 'Neural Engine', name: 'YOLOv8s NPU Core', status: health.yolo_engine, ok: true },
    { label: 'Proximity Array', name: '4x HC/JSN-SR04T', status: health.ultrasonic_array, ok: true },
    { label: 'GNSS Receiver', name: 'NEO-6M GPS (UART)', status: health.neo6m_gps, ok: true },
    { label: 'Attitude Sensor', name: 'MPU-6050 IMU (I2C)', status: health.mpu6050_imu, ok: true },
    { label: 'Cellular Modem', name: 'SIM7600 4G LTE HAT', status: `${gsm.carrier} (${gsm.signal_dbm} dBm)`, ok: gsm.online },
    { label: 'Command Server', name: 'FastAPI + WebSocket', status: health.backend, ok: true },
    { label: 'Telemetry DB', name: 'SQLite Audit Store', status: health.database, ok: true },
  ];

  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            SYSTEM HEALTH & HARDWARE DIAGNOSTICS
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>EDGE LATENCY: {health.latency_ms} ms</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2.5 my-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between"
          >
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
                {item.label}
              </span>
              <span className="text-xs font-semibold text-slate-200 block truncate mt-0.5" title={item.name}>
                {item.name}
              </span>
            </div>

            <div className="mt-2 flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span>Fault Tolerant Architecture — Isolated Sensor Buses</span>
        <span>Watchdog Timer: ACTIVE</span>
      </div>
    </div>
  );
};
