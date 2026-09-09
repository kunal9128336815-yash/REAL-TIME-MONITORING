import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTelemetryContext } from '../context/TelemetryContext';
import { VehicleDigitalTwin } from '../components/dashboard/VehicleDigitalTwin';
import { GpsTrackingMap } from '../components/dashboard/GpsTrackingMap';
import {
  Truck,
  ArrowLeft,
  AlertTriangle,
  Eye,
  Activity,
  Layers,
  MapPin,
  Radio,
  User,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { telemetry, alerts } = useTelemetryContext();

  const id = vehicleId || 'D-001';
  const isPrimary = id === 'D-001';

  // For D-001 we use the real-time simulation state; for others we provide simulated contextual data
  const vehicleData = isPrimary ? {
    id: 'D-001',
    name: 'CAT 777E Mining Haul Truck (Unit D-001)',
    driver: 'Ramesh Kumar (Lic #MIN-7819)',
    status: 'ACTIVE ON HAUL ROAD',
    speed: telemetry.gps.speed_kmh,
    heading: telemetry.gps.heading_deg,
    lat: telemetry.gps.lat,
    lon: telemetry.gps.lon,
    visibility: telemetry.visibility.index_percent,
    riskLevel: telemetry.risk.risk_level,
    riskScore: telemetry.risk.risk_score,
    ttc: telemetry.risk.ttc_seconds,
    action: telemetry.risk.action,
    ultrasonic: telemetry.ultrasonic,
    imu: telemetry.imu,
    opticalFlow: { status: 'ONLINE', vx: 0.12, vy: 0.04, trackingQuality: 92 },
    driverSafety: telemetry.risk.driver_safety,
    detections: telemetry.vision.detections,
    sector: 'Pit Ramp Incline Bench 3',
  } : {
    id: id,
    name: `CAT 777E Dumper ${id}`,
    driver: id === 'D-002' ? 'Vikram Singh' : (id === 'D-003' ? 'Anil Sharma' : 'Mohd. Salim'),
    status: 'ACTIVE RUNNING',
    speed: id === 'D-002' ? 9.8 : (id === 'D-003' ? 14.2 : 6.2),
    heading: 142.5,
    lat: 22.7214,
    lon: 75.8601,
    visibility: id === 'D-002' ? 34 : (id === 'D-003' ? 71 : 28),
    riskLevel: id === 'D-002' ? 'WARNING' : (id === 'D-003' ? 'SAFE' : 'CRITICAL'),
    riskScore: id === 'D-002' ? 68 : (id === 'D-003' ? 18 : 89),
    ttc: id === 'D-002' ? 3.2 : (id === 'D-003' ? 9.4 : 1.4),
    action: id === 'D-004' ? 'STOP VEHICLE IMMEDIATELY' : (id === 'D-002' ? 'APPLY BRAKES — REDUCE SPEED' : 'ALL CLEAR'),
    ultrasonic: { front: id === 'D-004' ? 2.8 : 5.8, rear: 14.2, left: 4.1, right: 5.6 },
    imu: { acceleration_g: 0.38, tilt_deg: 2.4, motion_status: 'FORWARD_MOTION' },
    opticalFlow: { status: 'ONLINE', vx: 0.08, vy: 0.02, trackingQuality: 88 },
    driverSafety: { status: 'SAFE', distraction_detected: false, earphone_confidence: 0, message: 'Driver attentive' },
    detections: [],
    sector: 'Pit Access Haul Road',
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/70 border-red-500/60 shadow-lg shadow-red-950/60';
      case 'WARNING':
        return 'text-amber-400 bg-amber-950/70 border-amber-500/60 shadow-lg shadow-amber-950/60';
      case 'CAUTION':
        return 'text-yellow-400 bg-yellow-950/70 border-yellow-500/60 shadow-lg shadow-yellow-950/60';
      default:
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-500/60 shadow-lg shadow-emerald-950/60';
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/fleet')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-100 uppercase tracking-wider">
                {vehicleData.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                {vehicleData.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Operator: <strong className="text-slate-200">{vehicleData.driver}</strong> • Sector: {vehicleData.sector}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {/* Vehicle Switcher */}
          <span className="text-slate-500 text-[10px]">SELECT UNIT:</span>
          {['D-001', 'D-002', 'D-003', 'D-004'].map((vid) => (
            <button
              key={vid}
              onClick={() => navigate(`/fleet/${vid}`)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                vid === id
                  ? 'bg-cyan-600 text-white font-bold border border-cyan-400'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {vid}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Digital Twin (Left) & Real-time Sensors (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 6 cols: Engineering Digital Twin */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                TOP-DOWN ACOUSTIC DIGITAL TWIN
              </h2>
            </div>
            <span className="text-[10px] text-slate-500">
              ANIMATED PROXIMITY WAVEFRONT
            </span>
          </div>

          <div className="py-2">
            <VehicleDigitalTwin
              ultrasonic={vehicleData.ultrasonic}
              imu={vehicleData.imu}
              speed={vehicleData.speed}
            />
          </div>

          {/* 4 Ultrasonic Clearance Displays */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">FRONT PROXIMITY</span>
              <span className="text-base font-black text-cyan-300">
                {vehicleData.ultrasonic.front.toFixed(1)} m
              </span>
              <span className="text-[9px] text-slate-500 block">Pulse: 18ms</span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">REAR PROXIMITY</span>
              <span className="text-base font-black text-slate-200">
                {vehicleData.ultrasonic.rear.toFixed(1)} m
              </span>
              <span className="text-[9px] text-slate-500 block">Clear</span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">LEFT FLANK</span>
              <span className="text-base font-black text-slate-200">
                {vehicleData.ultrasonic.left.toFixed(1)} m
              </span>
              <span className="text-[9px] text-slate-500 block">Nominal</span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">RIGHT FLANK</span>
              <span className="text-base font-black text-slate-200">
                {vehicleData.ultrasonic.right.toFixed(1)} m
              </span>
              <span className="text-[9px] text-slate-500 block">Nominal</span>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Kinematics, Collision Risk, and Sensors */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Risk Card */}
          <div className="p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">COLLISION SAFETY STATUS</span>
              <Link to="/collision-safety" className="text-xs text-cyan-400 hover:underline">
                View Risk Model →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`p-3 rounded-lg border ${getRiskColor(vehicleData.riskLevel)}`}>
                <span className="text-[9px] uppercase font-bold opacity-80 block">RISK LEVEL</span>
                <span className="text-2xl font-black">{vehicleData.riskLevel}</span>
                <span className="text-[10px] block opacity-90">{vehicleData.riskScore} / 100</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">TIME TO COLLISION</span>
                <span className="text-2xl font-black text-cyan-300">
                  {vehicleData.ttc !== null ? `${vehicleData.ttc.toFixed(1)}s` : '> 8.0s'}
                </span>
                <span className="text-[10px] text-slate-500 block">Kinematic TTC</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">ACTION MANDATE</span>
                <span className="text-xs font-black text-slate-100 mt-1 block leading-tight">
                  {vehicleData.action}
                </span>
              </div>
            </div>
          </div>

          {/* Kinematics & IMU Matrix */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 border-b border-slate-800/80 pb-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>GNSS LOCALIZATION</span>
              </div>
              <div className="text-xs space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className="text-slate-200 font-bold">{vehicleData.speed.toFixed(1)} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Heading:</span>
                  <span className="text-slate-200">{vehicleData.heading.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Latitude:</span>
                  <span className="text-slate-300">{vehicleData.lat.toFixed(6)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span>Longitude:</span>
                  <span className="text-slate-300">{vehicleData.lon.toFixed(6)}° E</span>
                </div>
              </div>
              <div className="pt-1 text-[10px] text-slate-500">
                GNSS NEO-6M 8-sat 3D lock
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 border-b border-slate-800/80 pb-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>IMU & OPTICAL FLOW</span>
              </div>
              <div className="text-xs space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Acceleration:</span>
                  <span className="text-slate-200 font-bold">{vehicleData.imu.acceleration_g.toFixed(2)} g</span>
                </div>
                <div className="flex justify-between">
                  <span>Pit Incline/Tilt:</span>
                  <span className="text-slate-200">{vehicleData.imu.tilt_deg.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Optical Flow:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (92%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Motion Mode:</span>
                  <span className="text-cyan-300">{vehicleData.imu.motion_status}</span>
                </div>
              </div>
              <div className="pt-1 text-[10px] text-slate-500">
                MPU6050 6-DOF sensor fusion
              </div>
            </div>
          </div>

          {/* AI Vision & Forward Classifier Card */}
          <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2 font-black text-slate-100 text-sm">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>AI VISION FORWARD SCANNER</span>
              </div>
              <Link to="/ai-vision" className="text-cyan-400 hover:underline font-bold text-xs">
                Inspect AI Vision →
              </Link>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-slate-200 font-bold text-xs">
                  {telemetry.vision.detections.length > 0 
                    ? `TARGET: ${telemetry.vision.detections[0].class_name.toUpperCase()} (${Math.round(telemetry.vision.detections[0].confidence * 100)}% CONF)`
                    : 'NO FORWARD OBSTACLES IN PATH'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-black text-xs">
                YOLOv8s ACTIVE
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Embedded Route Tracker */}
      <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-xs font-bold text-slate-300 uppercase">
            ACTIVE HAUL ROAD ROUTE TRACKER ({vehicleData.id})
          </span>
          <Link to="/tracking" className="text-xs text-cyan-400 hover:underline">
            Launch GIS Map →
          </Link>
        </div>
        <div className="h-[280px] rounded-lg overflow-hidden border border-slate-800">
          <GpsTrackingMap
            gps={{ lat: vehicleData.lat, lon: vehicleData.lon, speed_kmh: vehicleData.speed, heading_deg: vehicleData.heading, fix_status: '3D_FIX' }}
            ultrasonic={vehicleData.ultrasonic}
            hazardDetected={vehicleData.riskLevel === 'CRITICAL'}
          />
        </div>
      </div>
    </div>
  );
};
