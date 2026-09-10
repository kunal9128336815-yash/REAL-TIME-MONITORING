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
  Layers,
  MapPin,
  Radio,
  User,
  ShieldCheck,
  ChevronRight,
  Activity,
  Compass,
  Gauge
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { telemetry, alerts } = useTelemetryContext();

  const id = vehicleId || 'D-001';
  const isPrimary = id === 'D-001';

  const isLive = telemetry.mode === 'LIVE_HARDWARE';

  // For D-001 we use the real-time hardware state; for others contextual parked data
  const vehicleData = isPrimary
    ? {
        id: 'D-001',
        name: 'CAT 777E Mining Haul Truck (Unit D-001 - Active Hardware Rig)',
        driver: 'Ramesh Kumar (Lic #MIN-7819)',
        status: isLive ? 'ACTIVE ON HAUL ROAD' : 'OFFLINE (WAITING FOR PI FEED)',
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
        opticalFlow: isLive
          ? { status: 'ONLINE', vx: 0.05, vy: 0.02, trackingQuality: 92 }
          : { status: 'OFFLINE', vx: null, vy: null, trackingQuality: 0 },
        driverSafety: telemetry.risk.driver_safety,
        detections: telemetry.vision.detections,
        sector: isLive ? 'Pit Ramp Incline Bench 3' : 'Test Rig (Bench)',
      }
    : {
        id: id,
        name: `CAT 777E Dumper ${id}`,
        driver: id === 'D-002' ? 'Vikram Singh' : id === 'D-003' ? 'Anil Sharma' : 'Mohd. Salim',
        status: 'OFFLINE (PARKED IN DEPOT)',
        speed: null,
        heading: null,
        lat: null,
        lon: null,
        visibility: null,
        riskLevel: 'OFFLINE' as const,
        riskScore: null,
        ttc: null,
        action: 'STANDBY -- PARKED IN DEPOT',
        ultrasonic: { front: 0, rear: 0, left: 0, right: 0 },
        imu: { acceleration_g: 0, tilt_deg: 0, motion_status: 'STATIONARY' },
        opticalFlow: { status: 'OFFLINE', vx: null, vy: null, trackingQuality: 0 },
        driverSafety: { status: 'OFFLINE', distraction_detected: false, earphone_confidence: 0, message: 'Vehicle offline in depot' },
        detections: [],
        sector: id === 'D-002' ? 'Maintenance Bay 3' : id === 'D-003' ? 'South Fueling Station' : 'Workshop Bay 1',
      };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-700 bg-red-50 border-red-300';
      case 'WARNING':
        return 'text-amber-800 bg-amber-50 border-amber-300';
      case 'CAUTION':
        return 'text-yellow-800 bg-yellow-50 border-yellow-300';
      case 'OFFLINE':
        return 'text-slate-500 bg-slate-100 border-slate-300';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    }
  };

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Top Navigation & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/fleet')}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Fleet Monitoring"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {vehicleData.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
                {vehicleData.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Operator: <strong className="text-slate-800">{vehicleData.driver}</strong> &bull; Sector: {vehicleData.sector}
            </p>
          </div>
        </div>

        {/* Vehicle Switcher Tabs */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 text-[11px] font-medium">SELECT UNIT:</span>
          {['D-001', 'D-002', 'D-003', 'D-004'].map((vid) => (
            <button
              key={vid}
              onClick={() => navigate(`/fleet/${vid}`)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                vid === id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
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
        <div className="lg:col-span-6 p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                TOP-DOWN ACOUSTIC DIGITAL TWIN
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Acoustic Proximity Field
            </span>
          </div>

          <div className="py-2">
            <VehicleDigitalTwin
              ultrasonic={vehicleData.ultrasonic}
              imu={vehicleData.imu}
              speed={vehicleData.speed}
            />
          </div>

          {/* 4 Ultrasonic Clearance Metric Cards */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">FRONT</span>
              <span className={`text-base font-bold font-mono ${
                vehicleData.ultrasonic.front !== null && vehicleData.ultrasonic.front <= 2.5 ? 'text-red-600' :
                vehicleData.ultrasonic.front !== null && vehicleData.ultrasonic.front <= 4.5 ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {vehicleData.ultrasonic.front !== null && vehicleData.ultrasonic.front > 0 ? `${vehicleData.ultrasonic.front.toFixed(2)} m` : '---'}
              </span>
              <span className="text-[10px] text-slate-400 block">{vehicleData.ultrasonic.front !== null && vehicleData.ultrasonic.front > 0 ? 'HC-SR04 Active' : '---'}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">REAR</span>
              <span className="text-base font-bold font-mono text-slate-700">
                {vehicleData.ultrasonic.rear !== null && vehicleData.ultrasonic.rear > 0 ? `${vehicleData.ultrasonic.rear.toFixed(1)} m` : '---'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">{vehicleData.ultrasonic.rear !== null && vehicleData.ultrasonic.rear > 0 ? 'Clear' : '--- (Unused)'}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">LEFT</span>
              <span className="text-base font-bold font-mono text-slate-700">
                {vehicleData.ultrasonic.left !== null && vehicleData.ultrasonic.left > 0 ? `${vehicleData.ultrasonic.left.toFixed(1)} m` : '---'}
              </span>
              <span className="text-[10px] text-slate-400 block">{vehicleData.ultrasonic.left !== null && vehicleData.ultrasonic.left > 0 ? 'Nominal' : '--- (Unused)'}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">RIGHT</span>
              <span className="text-base font-bold font-mono text-slate-700">
                {vehicleData.ultrasonic.right !== null && vehicleData.ultrasonic.right > 0 ? `${vehicleData.ultrasonic.right.toFixed(1)} m` : '---'}
              </span>
              <span className="text-[10px] text-slate-400 block">{vehicleData.ultrasonic.right !== null && vehicleData.ultrasonic.right > 0 ? 'Nominal' : '--- (Unused)'}</span>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Kinematics, Collision Risk, and Sensors */}
        <div className="lg:col-span-6 space-y-4">
          {/* Collision Safety Status Card */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  COLLISION SAFETY STATUS
                </span>
              </div>
              <Link to="/collision-safety" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                View Risk Model &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`p-3 rounded-lg border ${getRiskColor(vehicleData.riskLevel)}`}>
                <span className="text-[10px] uppercase font-bold opacity-80 block">RISK LEVEL</span>
                <span className="text-xl sm:text-2xl font-black">{vehicleData.riskLevel}</span>
                <span className="text-xs font-mono block opacity-90 font-semibold">{vehicleData.riskScore !== null ? `${vehicleData.riskScore} / 100` : '--'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">TIME TO COLLISION</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                  {vehicleData.ttc !== null ? `${vehicleData.ttc.toFixed(1)}s` : (isLive ? '> 8.0s' : 'N/A')}
                </span>
                <span className="text-[10px] text-slate-500 block">Kinematic TTC</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">ACTION MANDATE</span>
                <span className="text-xs font-bold text-slate-900 mt-1 block leading-tight">
                  {vehicleData.action}
                </span>
              </div>
            </div>
          </div>

          {/* Kinematics & IMU Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>GNSS LOCALIZATION</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className="text-slate-900 font-bold font-mono">
                    {vehicleData.speed !== null ? `${vehicleData.speed.toFixed(1)} km/h` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Heading:</span>
                  <span className="text-slate-900 font-mono">
                    {vehicleData.heading !== null ? `${vehicleData.heading.toFixed(1)}°` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Latitude:</span>
                  <span className="text-slate-800 font-mono">
                    {vehicleData.lat !== null ? `${vehicleData.lat.toFixed(6)}° N` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Longitude:</span>
                  <span className="text-slate-800 font-mono">
                    {vehicleData.lon !== null ? `${vehicleData.lon.toFixed(6)}° E` : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="pt-1 text-[11px] text-slate-400 font-medium">
                {isLive && vehicleData.lat !== null ? 'GNSS NEO-6M 8-sat 3D lock' : 'GNSS Standby (No Fix)'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>IMU & OPTICAL FLOW</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Acceleration:</span>
                  <span className="text-slate-900 font-bold font-mono">
                    {vehicleData.imu.acceleration_g !== null ? `${vehicleData.imu.acceleration_g.toFixed(2)} g` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pit Incline/Tilt:</span>
                  <span className="text-slate-900 font-mono">
                    {vehicleData.imu.tilt_deg !== null ? `${vehicleData.imu.tilt_deg.toFixed(1)}°` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Optical Flow:</span>
                  <span className={vehicleData.opticalFlow.status === 'ONLINE' ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                    {vehicleData.opticalFlow.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Motion Mode:</span>
                  <span className="text-blue-700 font-semibold">{vehicleData.imu.motion_status}</span>
                </div>
              </div>
              <div className="pt-1 text-[11px] text-slate-400 font-medium">
                {isLive ? 'Kinematic motion fusion active' : 'Motion sensors standby'}
              </div>
            </div>
          </div>

          {/* AI Vision & Forward Classifier Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>AI VISION FORWARD SCANNER</span>
              </div>
              <Link to="/ai-vision" className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                Inspect AI Vision &rarr;
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-800 font-semibold text-xs">
                  {telemetry.vision.detections.length > 0
                    ? `TARGET: ${telemetry.vision.detections[0].class_name.toUpperCase()} (${Math.round(
                        telemetry.vision.detections[0].confidence * 100
                      )}% CONF)`
                    : 'NO FORWARD OBSTACLES IN PATH'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs self-start sm:self-auto">
                YOLOv8s ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Route Tracker */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              ACTIVE HAUL ROAD ROUTE TRACKER ({vehicleData.id})
            </span>
          </div>
          <Link to="/tracking" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Launch GIS Map &rarr;
          </Link>
        </div>
        <div className="h-[280px] rounded-lg overflow-hidden border border-slate-200">
          <GpsTrackingMap
            gps={{
              lat: vehicleData.lat ?? 0,
              lon: vehicleData.lon ?? 0,
              speed_kmh: vehicleData.speed ?? 0,
              heading: vehicleData.heading ?? 0,
              fix_status: vehicleData.lat !== null ? '3D_FIX' : 'OFFLINE',
            } as any}
            ultrasonic={vehicleData.ultrasonic}
            hazardDetected={vehicleData.riskLevel === 'CRITICAL'}
          />
        </div>
      </div>
    </div>
  );
};
