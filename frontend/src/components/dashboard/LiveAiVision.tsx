import React, { useRef, useEffect } from 'react';
import { VisionData, VisibilityData } from '../../types';
import { Camera, Eye, Activity, Sliders, User } from 'lucide-react';

interface LiveAiVisionProps {
  vision: VisionData;
  visibility: VisibilityData;
}

export const LiveAiVision: React.FC<LiveAiVisionProps> = ({ vision, visibility }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fog calculation for rendering
  const fogOpacity = Math.max(0, (100 - visibility.index_percent) / 100);
  const fogBlurPx = Math.max(0, (80 - visibility.index_percent) * 0.08);

  const getBoundingBoxColor = (className: string) => {
    switch (className) {
      case 'person': return { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5' };
      case 'dumper': return { stroke: '#00e5ff', fill: 'rgba(0, 229, 255, 0.2)', text: '#7dd3fc' };
      case 'obstacle': return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.2)', text: '#fde68a' };
      default: return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.2)', text: '#a7f3d0' };
    }
  };

  // Draw simulated mining road scene on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw mining road backdrop
    // Sky / Pit wall gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
    skyGrad.addColorStop(0, '#1c253b');
    skyGrad.addColorStop(1, '#3b2d22');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.45);

    // Terraced Open-Cast Mine benches
    ctx.fillStyle = '#2d2218';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.35);
    ctx.lineTo(width * 0.3, height * 0.3);
    ctx.lineTo(width * 0.6, height * 0.38);
    ctx.lineTo(width, height * 0.32);
    ctx.lineTo(width, height * 0.45);
    ctx.lineTo(0, height * 0.45);
    ctx.fill();

    // Haul road surface (gravel / red soil)
    const roadGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
    roadGrad.addColorStop(0, '#423326');
    roadGrad.addColorStop(1, '#1e1711');
    ctx.fillStyle = roadGrad;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.45);
    ctx.lineTo(width * 0.85, height * 0.45);
    ctx.lineTo(width * 1.1, height);
    ctx.lineTo(-width * 0.1, height);
    ctx.fill();

    // Haul road guide berms (safety bunds)
    ctx.fillStyle = '#5c4533';
    ctx.fillRect(0, height * 0.45, width * 0.15, height * 0.55);
    ctx.fillRect(width * 0.85, height * 0.45, width * 0.15, height * 0.55);

    // Center divider / tire tracks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 18]);
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.45);
    ctx.lineTo(width * 0.5, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw forward simulated entities based on detections
    vision.detections.forEach((det) => {
      const x = det.bbox[0] * width;
      const y = det.bbox[1] * height;
      const w = det.bbox[2] * width;
      const h = det.bbox[3] * height;

      if (det.class_name === 'person') {
        // High-vis mining worker figure
        ctx.fillStyle = '#ff7700';
        ctx.fillRect(x + w * 0.3, y + h * 0.25, w * 0.4, h * 0.45); // vest
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(x + w * 0.5, y + h * 0.18, w * 0.18, 0, Math.PI * 2); // hard hat
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + w * 0.3, y + h * 0.7, w * 0.18, h * 0.3); // pants
        ctx.fillRect(x + w * 0.52, y + h * 0.7, w * 0.18, h * 0.3);
      } else if (det.class_name === 'dumper') {
        // Oncoming heavy dumper silhouette
        ctx.fillStyle = '#eab308';
        ctx.fillRect(x, y + h * 0.2, w, h * 0.6); // body
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x - w * 0.1, y + h * 0.5, w * 0.2, h * 0.5); // tires
        ctx.fillRect(x + w * 0.9, y + h * 0.5, w * 0.2, h * 0.5);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); // headlights
        ctx.arc(x + w * 0.2, y + h * 0.7, 4, 0, Math.PI * 2);
        ctx.arc(x + w * 0.8, y + h * 0.7, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (det.class_name === 'obstacle') {
        // Fallen boulder on haul road
        ctx.fillStyle = '#78716c';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w * 0.2, y + h * 0.2);
        ctx.lineTo(x + w * 0.8, y + h * 0.1);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
      }
    });

  }, [vision.detections, visibility.index_percent]);

  const activeRoadDetections = vision.detections;

  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <Camera className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-black uppercase tracking-wider text-cyan-300">
            LIVE AI VISION FEED
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>YOLOv8s INFERENCE</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono font-bold text-slate-200">
          <span>{vision.fps.toFixed(1)} FPS</span>
          <span className="text-slate-600">|</span>
          <span>{vision.inference_time_ms.toFixed(1)} ms</span>
        </div>
      </div>

      {/* Main Camera Viewport Area */}
      <div className="relative my-3 rounded-lg overflow-hidden border border-slate-700/80 bg-black aspect-video flex items-center justify-center">
        
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-cover transition-all"
          style={{ filter: `blur(${fogBlurPx}px)` }}
        />

        {/* Dynamic Fog Overlay (reacts directly to environmental visibility) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundColor: `rgba(215, 225, 235, ${fogOpacity * 0.88})`,
            backdropFilter: `blur(${fogBlurPx * 1.4}px)`,
          }}
        >
          {/* Animated drifting fog particles */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-200/20 via-transparent to-slate-200/10 mix-blend-overlay"></div>
        </div>

        {/* CRT Scanline effect */}
        <div className="absolute inset-0 scanlines opacity-40"></div>

        {/* YOLO Bounding Boxes Overlay */}
        {activeRoadDetections.map((det, idx) => {
          const color = getBoundingBoxColor(det.class_name);
          return (
            <div
              key={idx}
              className="absolute transition-all duration-300 pointer-events-none"
              style={{
                left: `${det.bbox[0] * 100}%`,
                top: `${det.bbox[1] * 100}%`,
                width: `${det.bbox[2] * 100}%`,
                height: `${det.bbox[3] * 100}%`,
                border: `2px solid ${color.stroke}`,
                backgroundColor: color.fill,
                boxShadow: `0 0 14px ${color.stroke}`,
              }}
            >
              {/* Box Tag */}
              <div
                className="absolute -top-7 left-0 px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider font-mono flex items-center space-x-1.5 whitespace-nowrap shadow-lg"
                style={{ backgroundColor: color.stroke, color: '#000' }}
              >
                <span>{det.class_name}</span>
                <span>{(det.confidence * 100).toFixed(0)}%</span>
                <span>• {det.distance_est.toFixed(1)}m</span>
              </div>
            </div>
          );
        })}

        {/* HUD Overlay HUD Crosshair & Cam Telemetry */}
        <div className="absolute top-2.5 left-2.5 text-xs font-mono font-bold text-cyan-300 bg-black/75 px-3 py-1.5 rounded backdrop-blur-sm border border-cyan-500/30 shadow-lg">
          CAM 01 [FORWARD HAUL ROAD] • 1080p 60FPS
        </div>

        {/* Vision Degradation Warning when fog > 50% */}
        {visibility.optical_degraded && (
          <div className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded bg-amber-950/90 border border-amber-500 text-amber-300 text-xs font-mono font-black flex items-center space-x-2 backdrop-blur-sm animate-pulse shadow-lg">
            <Sliders className="w-4 h-4" />
            <span>OPTICAL VISION DEGRADED</span>
          </div>
        )}

      </div>

      {/* Footer Detections summary */}
      <div className="pt-2 border-t border-slate-800 text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-mono">
          <span>HAZARD DETECTIONS:</span>
          <span className="text-cyan-300 font-black text-sm">{activeRoadDetections.length} TARGETS</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Confidence threshold: &gt;0.40 • 3 Core Mining Classes
        </span>
      </div>
    </div>
  );
};
