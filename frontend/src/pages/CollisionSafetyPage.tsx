import React, { useState } from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { AlertTriangle, ArrowRight, CheckCircle2, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CollisionSafetyPage: React.FC = () => {
  const { telemetry } = useTelemetryContext();

  // Configurable autonomous risk thresholds
  const [criticalTtcThreshold, setCriticalTtcThreshold] = useState<number>(2.0);
  const [warningTtcThreshold, setWarningTtcThreshold] = useState<number>(4.0);
  const [criticalDistThreshold, setCriticalDistThreshold] = useState<number>(3.0);

  const speedMs = (telemetry.gps.speed_kmh * 1000) / 3600;
  const isMoving = speedMs > 0.3;
  const frontDist = telemetry.ultrasonic.front;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'WARNING':
        return 'bg-amber-50 border-amber-300 text-amber-800';
      case 'CAUTION':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default:
        return 'bg-emerald-50 border-emerald-300 text-emerald-800';
    }
  };

  const detectedObject = telemetry.vision.detections.length > 0
    ? telemetry.vision.detections[0].class_name.toUpperCase()
    : (frontDist < 5.0 ? 'RADIAL PROXIMITY TARGET' : 'NONE DETECTED');

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span>Collision Safety & Risk Decision Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kinematic time-to-collision calculation and autonomous safety stop mandate
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Critical Risk Threshold: &lt; 2.0s</span>
          </span>
        </div>
      </div>

      {/* Hero 4-Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Risk Level */}
        <div className={`p-5 rounded-xl border flex flex-col justify-center items-center text-center shadow-xs ${getRiskBadge(telemetry.risk.risk_level)}`}>
          <span className="text-xs uppercase font-bold tracking-wider opacity-80">
            Collision Risk
          </span>
          <span className="text-3xl font-extrabold font-mono mt-1.5">
            {telemetry.risk.risk_level}
          </span>
          <span className="text-xs mt-1.5 font-semibold">
            Risk Score: <strong className="font-mono">{telemetry.risk.risk_score} / 100</strong>
          </span>
        </div>

        {/* TTC */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col justify-center items-center text-center shadow-xs">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
            Time to Collision (TTC)
          </span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1.5">
            {telemetry.risk.ttc_seconds !== null ? `${telemetry.risk.ttc_seconds.toFixed(1)}s` : '> 8.0s'}
          </span>
          <span className="text-xs text-slate-500 mt-1.5">
            Formula: Distance / V_close
          </span>
        </div>

        {/* Proximity Distance */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col justify-center items-center text-center shadow-xs">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
            Minimum Distance
          </span>
          <span className="text-3xl font-extrabold font-mono text-blue-700 mt-1.5">
            {frontDist !== null ? `${frontDist.toFixed(1)} m` : '---'}
          </span>
          <span className="text-xs text-slate-500 mt-1.5 font-medium">
            Ultrasonic Channel 1
          </span>
        </div>

        {/* Action Mandate */}
        <div className={`p-5 rounded-xl border flex flex-col justify-center items-center text-center shadow-xs ${
          telemetry.risk.risk_level === 'CRITICAL'
            ? 'bg-red-50 border-red-300 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <span className="text-xs uppercase font-bold tracking-wider opacity-80">
            Autonomous Mandate
          </span>
          <span className="text-xl font-bold mt-1.5 leading-snug">
            {telemetry.risk.risk_level === 'CRITICAL' ? '🛑 STOP VEHICLE' : telemetry.risk.action}
          </span>
          <span className="text-xs mt-1.5 font-medium opacity-80">
            Buzzer & SMS Relay Active
          </span>
        </div>

      </div>

      {/* "WHY DID THE SYSTEM STOP?" EXPLAINABILITY SECTION */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
              Why did the system recommend "{telemetry.risk.action}"?
            </h2>
          </div>
          <span className="text-xs text-blue-700 font-semibold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 self-start sm:self-auto">
            AI Explainability Report
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">1. Classification</span>
            <div className="text-base font-bold text-slate-900">
              {detectedObject}
            </div>
            <span className="text-xs text-blue-700 font-medium block">
              {telemetry.vision.detections.length > 0 ? `${Math.round(telemetry.vision.detections[0].confidence * 100)}% Conf (YOLO)` : 'Acoustic Profile'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">2. Proximity Zone</span>
            <div className="text-base font-bold font-mono text-blue-700">
              {frontDist !== null ? `${frontDist.toFixed(1)} m` : '---'}
            </div>
            <span className="text-xs text-slate-600 font-medium block">
              Limit: &lt; {criticalDistThreshold.toFixed(1)}m
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">3. Time to Collision</span>
            <div className="text-base font-bold font-mono text-red-700">
              {telemetry.risk.ttc_seconds !== null ? `${telemetry.risk.ttc_seconds.toFixed(1)} sec` : '> 8.0 sec'}
            </div>
            <span className="text-xs text-slate-600 font-medium block">
              Limit: &lt; {criticalTtcThreshold.toFixed(1)}s
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">4. Vehicle Motion</span>
            <div className="text-base font-bold font-mono text-slate-900">
              {(telemetry.gps.speed_kmh ?? 0).toFixed(1)} km/h
            </div>
            <span className="text-xs text-slate-600 font-medium block">
              {isMoving ? 'Forward Motion' : 'Stationary'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">5. Visibility Index</span>
            <div className="text-base font-bold font-mono text-slate-900">
              {Math.round(telemetry.visibility.index_percent)}%
            </div>
            <span className="text-xs text-slate-600 font-medium block">
              {telemetry.visibility.label}
            </span>
          </div>
        </div>

        {/* Contributing Factors Breakdown */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Verified Contributing Factors:
          </span>
          <div className="space-y-1.5 text-slate-700">
            {telemetry.risk.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-slate-700 text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="text-slate-600">
              <strong className="text-slate-800">Final Decision:</strong>{' '}
              <span className="text-red-700 font-bold">{telemetry.risk.action}</span>
            </div>
            <Link
              to="/events"
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium flex items-center space-x-1.5 self-start sm:self-auto shadow-2xs"
            >
              <span>View Replay in Event Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Risk Score Calculation Model & Configurable Thresholds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Risk Score Model */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="font-bold text-slate-800 uppercase tracking-wider">
              Risk Score Formulation (0–100)
            </span>
            <span className="text-blue-700 font-bold font-mono">
              Current: {telemetry.risk.risk_score}
            </span>
          </div>

          <p className="text-slate-600 text-xs">
            The unified risk score synthesizes 5 independent weighted collision parameters:
          </p>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span>Distance Risk (Front Clearance &lt; 3m):</span>
              <span className="font-semibold text-blue-700">Weight: 35%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span>TTC Kinematic Closure (TTC &lt; 2s):</span>
              <span className="font-semibold text-blue-700">Weight: 30%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span>Object Classification (Person / Dumper / Obstacle):</span>
              <span className="font-semibold text-blue-700">Weight: 15%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span>Visibility Degradation (Monsoon Fog Penalty):</span>
              <span className="font-semibold text-blue-700">Weight: 10%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span>Vehicle Speed & Dynamic Inertia:</span>
              <span className="font-semibold text-blue-700">Weight: 10%</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span className="block font-bold">0–30</span>
              <span>SAFE</span>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
              <span className="block font-bold">31–55</span>
              <span>CAUTION</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <span className="block font-bold">56–75</span>
              <span>WARNING</span>
            </div>
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-800">
              <span className="block font-bold">76–100</span>
              <span>CRITICAL</span>
            </div>
          </div>
        </div>

        {/* Configurable Thresholds */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Kinematic TTC Thresholds</span>
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="text-slate-800 font-semibold text-xs">
              Time to Collision (TTC) Equation:
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-center font-mono font-bold text-blue-900 shadow-2xs">
              TTC = Distance (m) ÷ Closing Speed (m/s)
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-slate-700 text-xs font-semibold mb-1">
                <span>Critical TTC Threshold:</span>
                <span className="font-mono text-red-700 font-bold">{criticalTtcThreshold.toFixed(1)} seconds</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={criticalTtcThreshold}
                onChange={(e) => setCriticalTtcThreshold(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 text-xs font-semibold mb-1">
                <span>Warning TTC Threshold:</span>
                <span className="font-mono text-amber-700 font-bold">{warningTtcThreshold.toFixed(1)} seconds</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="6.0"
                step="0.2"
                value={warningTtcThreshold}
                onChange={(e) => setWarningTtcThreshold(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 text-xs font-semibold mb-1">
                <span>Critical Proximity Threshold:</span>
                <span className="font-mono text-blue-700 font-bold">{criticalDistThreshold.toFixed(1)} meters</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="5.0"
                step="0.2"
                value={criticalDistThreshold}
                onChange={(e) => setCriticalDistThreshold(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
