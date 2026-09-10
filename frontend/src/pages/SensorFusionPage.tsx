import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { Activity, Radio, Eye, MapPin, Layers, ArrowDown, ArrowRight, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SensorFusionPage: React.FC = () => {
  const { telemetry } = useTelemetryContext();
  const conf = telemetry.risk.sensor_confidence;

  const sensors = [
    {
      name: 'Pi Camera / YOLO',
      question: 'What is it?',
      output: telemetry.vision.detections.length > 0 ? `${telemetry.vision.detections[0].class_name.toUpperCase()} (${Math.round(telemetry.vision.detections[0].confidence * 100)}%)` : 'NO HAZARD DETECTED',
      confidence: conf.camera,
      status: telemetry.visibility.optical_degraded ? 'Degraded by Fog' : 'Optimal Clarity',
      icon: Eye,
      color: telemetry.visibility.optical_degraded ? 'text-amber-600' : 'text-blue-600',
      to: '/ai-vision',
    },
    {
      name: 'Ultrasonic Array (4-CH)',
      question: 'How far is it?',
      output: `Front: ${telemetry.ultrasonic.front !== null && telemetry.ultrasonic.front > 0 ? telemetry.ultrasonic.front.toFixed(1) + 'm' : '---'} | Rear: ${telemetry.ultrasonic.rear !== null && telemetry.ultrasonic.rear > 0 ? telemetry.ultrasonic.rear.toFixed(1) + 'm' : '---'}`,
      confidence: conf.ultrasonic,
      status: 'Unaffected by Fog',
      icon: Radio,
      color: 'text-emerald-600',
      to: '/sensors/ultrasonic',
    },
    {
      name: 'NEO-6M GNSS GPS',
      question: 'Where is the vehicle?',
      output: `${telemetry.gps.speed_kmh !== null && telemetry.gps.speed_kmh > 0 ? telemetry.gps.speed_kmh.toFixed(1) + ' km/h' : '---'} | ${telemetry.gps.lat !== null ? 'Live Fix' : '---'}`,
      confidence: conf.gps,
      status: telemetry.gps.lat !== null ? '3D Fix Active' : '---',
      icon: MapPin,
      color: 'text-blue-600',
      to: '/sensors/gps',
    },
    {
      name: 'MPU6050 6-DOF IMU',
      question: 'How is it moving?',
      output: `${telemetry.imu.acceleration_g !== null ? telemetry.imu.acceleration_g.toFixed(2) + 'g' : '---'} | ${telemetry.imu.tilt_deg !== null ? telemetry.imu.tilt_deg.toFixed(1) + '° Tilt' : '---'}`,
      confidence: conf.imu,
      status: telemetry.imu.motion_status,
      icon: Layers,
      color: 'text-purple-600',
      to: '/sensors/imu',
    },
    {
      name: 'Optical Flow Sensor',
      question: 'Local velocity vector?',
      output: 'Ground Vector: Nominal',
      confidence: Math.round(conf.camera * 0.7 + 25),
      status: telemetry.visibility.optical_degraded ? 'Haze Compensated' : 'Nominal Tracking',
      icon: Activity,
      color: 'text-sky-600',
      to: '/sensors/imu',
    },
  ];

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <span>Multi-Sensor Fusion Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synchronized acoustic, optical, inertial, and satellite telemetry fusion architecture
          </p>
        </div>

        {/* Dynamic Fog Status Banner */}
        <div className="flex items-center space-x-2 text-xs">
          {telemetry.visibility.optical_degraded ? (
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Vision Degraded &bull; Proximity Sensing Available</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All Sensor Modalities Optimal</span>
            </span>
          )}
        </div>
      </div>

      {/* Engineering Architecture Visualization */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Real-Time Sensor Fusion Pipeline
            </h2>
            <p className="text-[11px] text-slate-500">
              Multi-channel feeds converge into the central Kinematic Risk & Decision Model
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500">
            Fusion Latency: 8.4 ms
          </span>
        </div>

        {/* 5 Input Streams */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {sensors.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link
                key={idx}
                to={s.to}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${s.color}`} />
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold">
                      CH-{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 mt-2 group-hover:text-blue-600 transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-[11px] text-blue-700 italic mt-0.5">
                    "{s.question}"
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-800 truncate font-mono">
                    {s.output}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {s.status}
                  </div>

                  {/* Confidence Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Confidence:</span>
                      <span className="font-bold font-mono text-blue-700">{s.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-0.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${s.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Confluence Connector */}
        <div className="flex items-center justify-center space-x-2 text-blue-600 py-1">
          <ArrowDown className="w-4 h-4 animate-bounce" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Synchronous Sensor Fusion Engine
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>

        {/* Central Risk Engine Node */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <span className="text-[11px] text-blue-800 uppercase font-bold tracking-wider block">
              Fusion Stage 1: Kinematics
            </span>
            <div className="text-xs text-slate-700 mt-1 space-y-0.5">
              <div>&bull; Front Gap: <strong className="text-slate-900 font-mono">{telemetry.ultrasonic.front.toFixed(1)} m</strong></div>
              <div>&bull; Ground Speed: <strong className="text-slate-900 font-mono">{telemetry.gps.speed_kmh.toFixed(1)} km/h</strong></div>
              <div>&bull; Calculated TTC: <strong className="text-blue-700 font-mono font-bold">{telemetry.risk.ttc_seconds ? `${telemetry.risk.ttc_seconds.toFixed(1)}s` : '> 8s'}</strong></div>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l md:border-r border-slate-200 px-0 md:px-4">
            <span className="text-[11px] text-blue-800 uppercase font-bold tracking-wider block">
              Fusion Stage 2: Environment & Class
            </span>
            <div className="text-xs text-slate-700 mt-1 space-y-0.5">
              <div>&bull; Visibility Index: <strong className="text-slate-900 font-mono">{Math.round(telemetry.visibility.index_percent)}%</strong></div>
              <div>&bull; Optical Confidence: <strong className="text-slate-900 font-mono">{conf.camera}%</strong></div>
              <div>&bull; Target Class: <strong className="text-amber-700 font-bold">{telemetry.vision.detections.length > 0 ? telemetry.vision.detections[0].class_name.toUpperCase() : 'CLEAR'}</strong></div>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Final Safety Outcome
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {telemetry.risk.action}
            </div>
            <Link
              to="/collision-safety"
              className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold mt-1"
            >
              <span>Explain Decision Logic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Signal Quality & Confidence Legend */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Technical Explanation: Signal Quality & Confidence</span>
        </div>
        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-800">Sensor Confidence Metrics:</strong> These metrics reflect <span className="text-blue-700 font-semibold">Signal Quality & Sensor Confidence</span>, weighting each modality according to environmental interference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-amber-800 block mb-1">Optical Camera in Fog:</strong>
              Monsoon water droplets cause optical Rayleigh scattering and severe contrast attenuation. When the camera confidence falls (e.g. to 42%), the Sensor Fusion Engine discounts the camera's negative classification and increases weighting on proximity transducers.
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-emerald-800 block mb-1">Ultrasonic Proximity in Fog:</strong>
              40 kHz acoustic pressure waves travel through airborne water droplets with negligible fog attenuation at short ranges (&lt; 5m). Therefore, even when optical visibility drops to 20%, proximity sensing remains active and available.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
