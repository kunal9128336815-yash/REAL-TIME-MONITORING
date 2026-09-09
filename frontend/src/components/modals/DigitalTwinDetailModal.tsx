import React from 'react';
import { DetailModalWrapper } from './DetailModalWrapper';
import { UltrasonicData, ImuData, GpsData } from '../../types';
import { Truck, Radio, Compass, Gauge, ShieldAlert } from 'lucide-react';

interface DigitalTwinDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ultrasonic: UltrasonicData;
  imu: ImuData;
  gps: GpsData;
}

export const DigitalTwinDetailModal: React.FC<DigitalTwinDetailModalProps> = ({
  isOpen,
  onClose,
  ultrasonic,
  imu,
  gps,
}) => {
  return (
    <DetailModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="VEHICLE DIGITAL TWIN & TRANSDUCER ARRAY INSPECTOR"
      subtitle="Heavy mining dumper CAD kinematics, 4-node ultrasonic time-of-flight telemetry and IMU attitude"
      badge="CAT 777E CHASSIS"
      badgeColor="bg-cyan-500 text-black"
    >
      {/* Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">CHASSIS CLASS</span>
          <span className="text-sm font-black font-mono text-cyan-300 mt-0.5 block">CAT 777E (240T)</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">GROUND SPEED</span>
          <span className="text-sm font-black font-mono text-emerald-300 mt-0.5 block">{gps.speed_kmh.toFixed(1)} km/h</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">RAMP INCLINE (TILT)</span>
          <span className="text-sm font-black font-mono text-purple-300 mt-0.5 block">{imu.tilt_deg.toFixed(1)}° Grade</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">LONGITUDINAL ACCEL</span>
          <span className="text-sm font-black font-mono text-amber-300 mt-0.5 block">{imu.acceleration_g.toFixed(2)} g</span>
        </div>
      </div>

      {/* 4 Ultrasonic Nodes Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>360° ULTRASONIC TRANSDUCER NODES (ACOUSTIC 40 KHZ)</span>
          </h4>
          <span className="text-[10px] font-mono text-emerald-400">All 4 Transducers Healthy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <th className="py-2 px-3">Node Position</th>
                <th className="py-2 px-3">Hardware Model</th>
                <th className="py-2 px-3">GPIO Trig / Echo</th>
                <th className="py-2 px-3">Beam Angle</th>
                <th className="py-2 px-3">Measured Distance</th>
                <th className="py-2 px-3">Time-of-Flight (ToF)</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2 px-3 font-bold text-cyan-400">US-FRONT</td>
                <td className="py-2 px-3">JSN-SR04T Waterproof</td>
                <td className="py-2 px-3 text-slate-400">GPIO 23 / 24</td>
                <td className="py-2 px-3">15° Conical</td>
                <td className="py-2 px-3 font-bold text-white">{ultrasonic.front.toFixed(1)} m</td>
                <td className="py-2 px-3 text-slate-400">{((ultrasonic.front * 2 / 343) * 1000).toFixed(1)} ms</td>
                <td className="py-2 px-3"><span className="text-[10px] font-bold text-emerald-400">ACTIVE</span></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-cyan-400">US-REAR</td>
                <td className="py-2 px-3">JSN-SR04T Waterproof</td>
                <td className="py-2 px-3 text-slate-400">GPIO 17 / 27</td>
                <td className="py-2 px-3">15° Conical</td>
                <td className="py-2 px-3 font-bold text-white">{ultrasonic.rear.toFixed(1)} m</td>
                <td className="py-2 px-3 text-slate-400">{((ultrasonic.rear * 2 / 343) * 1000).toFixed(1)} ms</td>
                <td className="py-2 px-3"><span className="text-[10px] font-bold text-emerald-400">ACTIVE</span></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-cyan-400">US-LEFT</td>
                <td className="py-2 px-3">HC-SR04 Transducer</td>
                <td className="py-2 px-3 text-slate-400">GPIO 5 / 6</td>
                <td className="py-2 px-3">15° Conical</td>
                <td className="py-2 px-3 font-bold text-white">{ultrasonic.left.toFixed(1)} m</td>
                <td className="py-2 px-3 text-slate-400">{((ultrasonic.left * 2 / 343) * 1000).toFixed(1)} ms</td>
                <td className="py-2 px-3"><span className="text-[10px] font-bold text-emerald-400">ACTIVE</span></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-cyan-400">US-RIGHT</td>
                <td className="py-2 px-3">HC-SR04 Transducer</td>
                <td className="py-2 px-3 text-slate-400">GPIO 19 / 26</td>
                <td className="py-2 px-3">15° Conical</td>
                <td className="py-2 px-3 font-bold text-white">{ultrasonic.right.toFixed(1)} m</td>
                <td className="py-2 px-3 text-slate-400">{((ultrasonic.right * 2 / 343) * 1000).toFixed(1)} ms</td>
                <td className="py-2 px-3"><span className="text-[10px] font-bold text-emerald-400">ACTIVE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Heavy Machine Dimensions Reference */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
          CATERPILLAR 777E CHASSIS SPECIFICATIONS
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono text-slate-300">
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block">OVERALL LENGTH</span>
            <span className="font-bold text-slate-200">10.53 meters</span>
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block">OVERALL WIDTH</span>
            <span className="font-bold text-slate-200">6.13 meters</span>
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block">CABIN HEIGHT</span>
            <span className="font-bold text-slate-200">5.18 meters</span>
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block">PAYLOAD CAPACITY</span>
            <span className="font-bold text-cyan-300">96.4 Metric Tons</span>
          </div>
        </div>
      </div>
    </DetailModalWrapper>
  );
};
