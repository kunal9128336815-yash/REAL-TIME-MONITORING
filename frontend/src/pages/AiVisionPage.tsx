import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { LiveAiVision } from '../components/dashboard/LiveAiVision';
import { Eye, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AiVisionPage: React.FC = () => {
  const { telemetry } = useTelemetryContext();

  const classDescriptions = [
    {
      id: 0,
      name: 'Person',
      desc: 'Ground personnel, pit spotters, maintenance crew on haul road corridor.',
      priority: 'Critical Hazard',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      id: 1,
      name: 'Dumper',
      desc: 'Oncoming or queued heavy mining dump trucks & haulers in blind turns.',
      priority: 'Collision Risk',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 2,
      name: 'Obstacle',
      desc: 'Fallen boulders, berm slumps, stationary pit equipment & road debris.',
      priority: 'Caution Hazard',
      badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    },
  ];

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Eye className="w-6 h-6 text-blue-600" />
            <span>AI Vision & Object Detection</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Custom YOLOv8s object detection inference pipeline for heavy mining dumpers
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Inference Active</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold">
            {telemetry.vision.fps} FPS
          </span>
        </div>
      </div>

      {/* Main Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 8 cols: Live Camera Canvas with Bounding Boxes */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
                Live Camera Inference Feed (Pi Camera V2)
              </h2>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Inference Latency: <strong className="text-slate-900 font-mono font-bold">{telemetry.vision.inference_time_ms} ms</strong>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-slate-200 shadow-xs">
            <LiveAiVision
              vision={telemetry.vision}
              visibility={telemetry.visibility}
            />
          </div>

          {/* Detections List */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wide">Active In-Frame Detections:</span>
              <span className="text-blue-700 font-semibold">{telemetry.vision.detections.length} objects detected</span>
            </div>

            {telemetry.vision.detections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {telemetry.vision.detections.map((d, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="font-bold uppercase text-xs text-slate-800">{d.class_name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="text-blue-700 font-bold">{Math.round(d.confidence * 100)}% Conf</span>
                      <span className="text-slate-500">~{d.distance_est.toFixed(1)}m</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 italic py-2 text-xs">
                No foreground hazards currently identified in optical corridor.
              </div>
            )}
          </div>
        </div>

        {/* Right 4 cols: Classes & Pipeline Architecture */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Core Concept */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs space-y-2">
            <div className="text-xs font-bold text-blue-900 uppercase flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Core Architectural Concept</span>
            </div>
            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              YOLO answers: <span className="text-blue-700">"What is it?"</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optical cameras provide semantic classification (Person vs Dumper vs Rock), but become degraded in dense monsoon fog. In FOG-SAFE, YOLO informs the Risk Engine of hazard vulnerability, while ultrasonic sensors provide raw physical proximity.
            </p>
            <div className="pt-1">
              <Link
                to="/sensor-fusion"
                className="text-xs text-blue-700 hover:text-blue-900 flex items-center space-x-1 font-semibold"
              >
                <span>Inspect Sensor Fusion Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3 Supported Mining Classes */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              YOLO Object Classes (3 Core Mining Classes)
            </div>

            <div className="space-y-2.5">
              {classDescriptions.map((cls) => (
                <div
                  key={cls.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                      <span className="text-slate-400 font-mono">[{cls.id}]</span>
                      <span>{cls.name}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls.badgeColor}`}>
                      {cls.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {cls.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Model Specification Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="text-xs font-bold text-slate-800 uppercase border-b border-slate-200 pb-2">
              Edge Inference Metrics
            </div>
            <div className="space-y-1.5 text-slate-600 font-medium">
              <div className="flex justify-between items-center">
                <span>Model Architecture:</span>
                <span className="text-slate-900 font-bold font-mono">{telemetry.vision.model}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Target Hardware:</span>
                <span className="text-slate-900 font-semibold">Raspberry Pi 4 / NCNN</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Frame Resolution:</span>
                <span className="text-slate-900 font-mono">640 × 480 px</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Inference Latency:</span>
                <span className="text-blue-700 font-bold font-mono">{telemetry.vision.inference_time_ms} ms</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* AI Pipeline Flow Diagram */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          AI Vision Data Pipeline Flow
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-medium block">Step 1</span>
            <span className="font-semibold text-slate-800">Pi Camera</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-medium block">Step 2</span>
            <span className="font-semibold text-slate-800">Frame Grabbing</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-[10px] text-blue-600 uppercase font-bold block">Step 3</span>
            <span className="font-bold text-blue-800">YOLO Inference</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-medium block">Step 4</span>
            <span className="font-semibold text-slate-800">Bounding Box</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-medium block">Step 5</span>
            <span className="font-semibold text-slate-800">Confidence</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
            <span className="text-[10px] text-emerald-600 uppercase font-bold block">Step 6</span>
            <span className="font-bold">Risk Decision</span>
          </div>
        </div>
      </div>
    </div>
  );
};
