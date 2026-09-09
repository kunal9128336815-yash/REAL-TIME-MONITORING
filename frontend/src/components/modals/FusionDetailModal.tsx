import React from 'react';
import { DetailModalWrapper } from './DetailModalWrapper';
import { SensorConfidence, VisibilityData } from '../../types';
import { Zap, Camera, Radio, Navigation, Compass, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface FusionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  confidence: SensorConfidence;
  visibility: VisibilityData;
}

export const FusionDetailModal: React.FC<FusionDetailModalProps> = ({
  isOpen,
  onClose,
  confidence,
  visibility,
}) => {
  return (
    <DetailModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="MULTI-SENSOR FUSION ARCHITECTURE & FOG RESILIENCE"
      subtitle="Heterogeneous Bayesian weighting and Kalman state estimation under optical visibility degradation"
      badge="CORE INNOVATION"
      badgeColor="bg-cyan-500 text-black"
    >
      {/* Central Thesis Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/50 space-y-1">
        <span className="text-xs font-black uppercase tracking-wider text-cyan-300 font-mono">
          THE CENTRAL DESIGN THESIS:
        </span>
        <p className="text-sm font-bold text-white leading-snug">
          "WHEN MONSOON FOG BLINDS THE OPTICAL CAMERA, THE PLATFORM DOES NOT RELY ON COMPUTER VISION ALONE."
        </p>
        <p className="text-xs text-slate-300">
          Acoustic ultrasonic transducers operate on 40 kHz sound waves that easily penetrate water vapor particles and dust, preserving short-range proximity protection even in 0% optical visibility.
        </p>
      </div>

      {/* Sensor Channel Matrix Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
          HETEROGENEOUS SENSOR CHANNELS & DYNAMIC CONFIDENCE WEIGHTING
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <th className="py-2 px-3">Sensor Channel</th>
                <th className="py-2 px-3">Role / Core Question</th>
                <th className="py-2 px-3">Signal Quality</th>
                <th className="py-2 px-3">Behavior in Dense Monsoon Fog</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-bold text-cyan-300 flex items-center space-x-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>CAMERA (YOLOv8)</span>
                </td>
                <td className="py-2.5 px-3">"What is it?" (Target classification)</td>
                <td className="py-2.5 px-3 font-bold text-amber-400">{confidence.camera}%</td>
                <td className="py-2.5 px-3 text-amber-300">
                  Contrast drops, confidence decays linearly with optical visibility
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>ULTRASONIC ARRAY</span>
                </td>
                <td className="py-2.5 px-3">"How far is it?" (Physical distance)</td>
                <td className="py-2.5 px-3 font-bold text-emerald-400">{confidence.ultrasonic}%</td>
                <td className="py-2.5 px-3 text-emerald-300 font-bold">
                  Completely unaffected by fog; maintains solid 40kHz acoustic echo ToF
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-sky-400 flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>NEO-6M GNSS</span>
                </td>
                <td className="py-2.5 px-3">"Where is the vehicle?" (Position/Speed)</td>
                <td className="py-2.5 px-3 font-bold text-sky-400">{confidence.gps}%</td>
                <td className="py-2.5 px-3 text-slate-300">
                  Microwave GPS signals (1.5 GHz) penetrate ground fog without loss
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-purple-400 flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>MPU-6050 IMU</span>
                </td>
                <td className="py-2.5 px-3">"How is it moving?" (Incline/Tilt)</td>
                <td className="py-2.5 px-3 font-bold text-purple-400">{confidence.imu}%</td>
                <td className="py-2.5 px-3 text-slate-300">
                  Internal MEMS mechanical sensor; 100% environmental immunity
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-blue-400 flex items-center space-x-1.5">
                  <Send className="w-3.5 h-3.5" />
                  <span>SIM7600 4G LTE</span>
                </td>
                <td className="py-2.5 px-3">"How to notify command?" (Uplink/SMS)</td>
                <td className="py-2.5 px-3 font-bold text-blue-400">{confidence.gsm}%</td>
                <td className="py-2.5 px-3 text-slate-300">
                  Cellular LTE band operates reliably across pit haul road networks
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fusion Engine Mathematical Description */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>FUSION STATE SYNTHESIS ALGORITHM</span>
        </h4>
        <p className="text-xs text-slate-300 font-mono leading-relaxed">
          The edge engine runs a dual-layer risk filter:
          <br />
          1. <strong>Spatial Layer:</strong> Ultrasonic time-of-flight measurements provide ground truth physical distance d_front.
          <br />
          2. <strong>Semantic Layer:</strong> YOLO object classification tags the obstacle type (person, dumper, obstacle boulder) and scales closing speed v_closing.
          <br />
          3. <strong>Dynamic Weighting:</strong> When fog drops below 35%, the fusion engine elevates proximity acoustic alerts to primary priority while downgrading vision false-negatives.
        </p>
      </div>
    </DetailModalWrapper>
  );
};
