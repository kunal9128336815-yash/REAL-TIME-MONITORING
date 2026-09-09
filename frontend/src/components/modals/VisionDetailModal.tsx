import React from 'react';
import { DetailModalWrapper } from './DetailModalWrapper';
import { VisionData, VisibilityData } from '../../types';
import { Camera, Layers, Cpu, Sliders, Activity } from 'lucide-react';

interface VisionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vision: VisionData;
  visibility: VisibilityData;
}

export const VisionDetailModal: React.FC<VisionDetailModalProps> = ({
  isOpen,
  onClose,
  vision,
  visibility,
}) => {
  return (
    <DetailModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="AI VISION & YOLOv8 INFERENCE ENGINE INSPECTOR"
      subtitle="Forward Pi Camera optical perception stream, object detection matrix and fog degradation metrics"
      badge="YOLOv8s-Mining-v2"
      badgeColor="bg-cyan-500 text-black"
    >
      {/* Inference Telemetry Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">FRAME RATE</span>
          <span className="text-xl font-black font-mono text-cyan-300 mt-0.5 block">{vision.fps.toFixed(1)} FPS</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">INFERENCE TIME</span>
          <span className="text-xl font-black font-mono text-emerald-300 mt-0.5 block">{vision.inference_time_ms.toFixed(1)} ms</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">OBJECTS DETECTED</span>
          <span className="text-xl font-black font-mono text-purple-300 mt-0.5 block">{vision.detections.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">OPTICAL VISIBILITY</span>
          <span className="text-xl font-black font-mono text-amber-300 mt-0.5 block">{visibility.index_percent.toFixed(0)}%</span>
        </div>
      </div>

      {/* Detections Data Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
            RAW YOLO BOUNDING BOX & CLASSIFICATION TELEMETRY
          </h4>
          <span className="text-[10px] font-mono text-slate-400">IoU Threshold: 0.45 • Conf: &gt;0.40</span>
        </div>

        {vision.detections.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 font-mono">
            No objects detected in camera field of view. Haul corridor is optically clear.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                  <th className="py-2 px-3">Class ID</th>
                  <th className="py-2 px-3">Label</th>
                  <th className="py-2 px-3">Confidence</th>
                  <th className="py-2 px-3">Bounding Box [X, Y, W, H]</th>
                  <th className="py-2 px-3">Estimated Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {vision.detections.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-bold text-cyan-400">{d.class_id}</td>
                    <td className="py-2 px-3 font-bold uppercase text-slate-100">{d.class_name}</td>
                    <td className="py-2 px-3 font-bold text-emerald-400">{(d.confidence * 100).toFixed(1)}%</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">
                      [{d.bbox.map(n => n.toFixed(2)).join(', ')}]
                    </td>
                    <td className="py-2 px-3 font-bold text-amber-300">{d.distance_est.toFixed(1)} m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Model Architecture & Latency Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>NEURAL NETWORK ARCHITECTURE</span>
          </h4>
          <ul className="space-y-1 text-xs text-slate-300 font-mono">
            <li>• Model: Ultralytics YOLOv8s PyTorch FP16</li>
            <li>• Input Tensor: 640 × 640 × 3 (RGB)</li>
            <li>• Backbone: CSPDarknet with C2f Modules</li>
            <li>• Neck: Path Aggregation Network (PANet)</li>
            <li>• Head: Anchor-free Decoupled Head</li>
            <li>• Quantization: INT8 / FP16 on Raspberry Pi 4</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>PIPELINE LATENCY BUDGET</span>
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>Preprocessing (Resize/Normalize):</span>
                <span className="text-cyan-400">2.4 ms</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="w-[7%] bg-cyan-400 h-full rounded-full"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>NPU / CPU Forward Pass:</span>
                <span className="text-emerald-400">28.2 ms</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="w-[82%] bg-emerald-400 h-full rounded-full"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>NMS Filtering & Bounding Boxes:</span>
                <span className="text-purple-400">3.6 ms</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="w-[11%] bg-purple-400 h-full rounded-full"></div></div>
            </div>
          </div>
        </div>
      </div>
    </DetailModalWrapper>
  );
};
