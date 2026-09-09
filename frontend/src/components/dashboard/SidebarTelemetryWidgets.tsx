import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Activity, CloudFog, Bell, User, Truck, AlertTriangle, ChevronRight } from 'lucide-react';
import { TelemetryState } from '../../types';

interface SidebarTelemetryWidgetsProps {
  telemetry: TelemetryState;
  onNavigate?: () => void;
}

export const SidebarTelemetryWidgets: React.FC<SidebarTelemetryWidgetsProps> = ({
  telemetry,
  onNavigate,
}) => {
  return (
    <div className="space-y-3 font-sans text-xs">
      
      {/* 1. AI Vision Summary */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-800">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">AI Vision (YOLO)</span>
          </div>
          <Link
            to="/ai-vision"
            onClick={onNavigate}
            className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            Details <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 flex items-center space-x-1.5">
              <User className="w-3 h-3 text-blue-500" />
              <span>Person</span>
            </span>
            <span className="font-mono font-bold text-blue-700">
              {telemetry.vision.detections.find(d => d.class_name === 'person')?.confidence
                ? `${Math.round((telemetry.vision.detections.find(d => d.class_name === 'person')?.confidence || 0) * 100)}%`
                : '94% CONF'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 flex items-center space-x-1.5">
              <Truck className="w-3 h-3 text-amber-600" />
              <span>Dumper</span>
            </span>
            <span className="font-mono font-bold text-amber-700">
              {telemetry.vision.detections.find(d => d.class_name === 'dumper')?.confidence
                ? `${Math.round((telemetry.vision.detections.find(d => d.class_name === 'dumper')?.confidence || 0) * 100)}%`
                : '91% CONF'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 flex items-center space-x-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>Obstacle</span>
            </span>
            <span className="font-mono font-bold text-amber-600">
              {telemetry.vision.detections.find(d => d.class_name === 'obstacle')?.confidence
                ? `${Math.round((telemetry.vision.detections.find(d => d.class_name === 'obstacle')?.confidence || 0) * 100)}%`
                : '87% CONF'}
            </span>
          </div>
        </div>

        <div className="pt-1.5 border-t border-slate-200 flex justify-between text-[10px] text-slate-500">
          <span>Model: YOLOv8s</span>
          <span className="text-emerald-600 font-mono font-semibold">28.5 FPS</span>
        </div>
      </div>

      {/* 2. Sensor Array Status */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Sensor Array</span>
          </div>
          <Link
            to="/sensor-fusion"
            onClick={onNavigate}
            className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            Fusion <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-1 pt-0.5 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Camera (Pi Cam)</span>
            <span className="text-emerald-700 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Ultrasonic Array</span>
            <span className="text-emerald-700 font-mono font-semibold">4/4 ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">NEO-6M GNSS</span>
            <span className="text-emerald-700 font-semibold">LOCKED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">MPU6050 IMU</span>
            <span className="text-emerald-700 font-semibold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">4G Telemetry</span>
            <span className="text-blue-700 font-mono font-semibold">0% LOSS</span>
          </div>
        </div>
      </div>

      {/* 3. Fog & Visibility */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-800">
            <CloudFog className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Fog & Visibility</span>
          </div>
          <Link
            to="/fog-visibility"
            onClick={onNavigate}
            className="text-[10px] text-sky-600 hover:text-sky-800 font-medium flex items-center"
          >
            Simulate <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-600">Visibility Index</span>
            <span className="font-mono font-bold text-slate-900 text-xs">
              {Math.round(telemetry.visibility.index_percent)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.round(telemetry.visibility.index_percent)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
          <span>Camera: <strong className="text-slate-800 font-mono font-semibold">{telemetry.risk.sensor_confidence.camera}%</strong></span>
          <span>Ultrasonic: <strong className="text-emerald-600 font-mono font-semibold">98%</strong></span>
        </div>
      </div>

      {/* 4. Latest Critical Alert */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-800">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Latest Alert</span>
          </div>
          <Link
            to="/alerts"
            onClick={onNavigate}
            className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-2 rounded-md bg-red-50 border border-red-200 text-red-800 space-y-1">
          <div className="flex items-center justify-between text-[9px] font-bold">
            <span className="bg-red-200 text-red-800 px-1.5 py-0.5 rounded">
              {telemetry.risk.risk_level} EVENT
            </span>
            <span className="font-mono text-red-600">{telemetry.timestamp}</span>
          </div>
          <p className="text-[11px] font-semibold text-red-950 leading-tight">
            {telemetry.risk.hazard_summary}
          </p>
          <div className="flex items-center justify-between text-[10px] text-red-800 pt-0.5 font-mono">
            <span>Front: {telemetry.ultrasonic.front.toFixed(1)}m</span>
            <span>TTC: {telemetry.risk.ttc_seconds ? `${telemetry.risk.ttc_seconds.toFixed(1)}s` : 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5">
          <span>Dispatch: 4G SMS</span>
          <span className="text-emerald-600 font-semibold">TRANSMITTED</span>
        </div>
      </div>

    </div>
  );
};
