import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTelemetryContext } from '../context/TelemetryContext';
import { wsClient } from '../services/websocket';
import {
  Truck,
  AlertTriangle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Cpu,
  RefreshCw,
  Settings,
  Radio
} from 'lucide-react';
import { GpsTrackingMap } from '../components/dashboard/GpsTrackingMap';
import { VehicleDigitalTwin } from '../components/dashboard/VehicleDigitalTwin';
import { PiConnectionModal } from '../components/modals/PiConnectionModal';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    telemetry,
    alerts,
    backendConnected,
    isPiConnected,
    piStatus,
    piUrl,
    setPiUrl,
    checkPiConnection
  } = useTelemetryContext();

  const [isPiModalOpen, setIsPiModalOpen] = useState(false);
  const [isPingingPi, setIsPingingPi] = useState(false);

  const handleQuickPing = async () => {
    setIsPingingPi(true);
    try {
      await checkPiConnection();
    } finally {
      setIsPingingPi(false);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CAUTION':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-4 pb-6 font-sans">
      
      {/* Platform Title Banner with Top-Right Raspberry Pi Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Fog-Safe Fleet Command Center
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-sans">
              ISO 21815 & EMESRT Level 9
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Mining Proximity & Collision Prevention System &bull; Live Telemetry & Ultrasonic Sensor Matrix
          </p>
        </div>

        {/* TOP-RIGHT: RASPBERRY PI 4 HARDWARE STATUS WIDGET */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2 sm:p-2.5 rounded-xl shadow-2xs">
          <div className={`p-2 rounded-lg border ${
            isPiConnected
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : backendConnected
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-rose-50 border-rose-300 text-rose-700'
          }`}>
            <Cpu className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Raspberry Pi 4 Edge:
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center space-x-1.5 ${
                isPiConnected
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : backendConnected
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isPiConnected
                    ? 'bg-emerald-500 animate-pulse'
                    : backendConnected
                    ? 'bg-blue-500'
                    : 'bg-rose-500'
                }`} />
                <span>
                  {isPiConnected
                    ? 'PI IS ON (ONLINE)'
                    : backendConnected
                    ? 'FASTAPI LINKED'
                    : 'PI IS OFF (OFFLINE)'}
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
              <span className="font-mono font-medium text-slate-700" title={piUrl}>
                {isPiConnected
                  ? `Pi: 192.168.137.214:5000`
                  : 'Target: 192.168.137.214:5000/data'}
              </span>
              <span>&bull;</span>
              <span className={isPiConnected ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                {isPiConnected
                  ? `${piStatus.lastPingMs || '<30'}ms (${piStatus.sampleCount} pkts)`
                  : 'Standby Simulation'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 ml-auto shrink-0">
            <button
              onClick={handleQuickPing}
              disabled={isPingingPi}
              title="Ping / Re-test Raspberry Pi Connection"
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center space-x-1 shadow-2xs transition-colors shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isPingingPi ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isPingingPi ? 'Pinging...' : 'Ping Pi'}</span>
            </button>

            <button
              onClick={() => setIsPiModalOpen(true)}
              title="Configure Raspberry Pi Endpoint Settings"
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Raspberry Pi Bridge Configuration Modal */}
      <PiConnectionModal
        isOpen={isPiModalOpen}
        onClose={() => setIsPiModalOpen(false)}
        status={piStatus}
        onUpdateUrl={setPiUrl}
        onCheckConnection={checkPiConnection}
      />

      {/* 5 Clean KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* KPI 1: Active Vehicles */}
        <div
          onClick={() => navigate('/fleet')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all shadow-xs flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Fleet
              </span>
              <Maximize2 className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-1">
              04 <span className="text-xs font-normal font-sans text-slate-500">Dumpers</span>
            </div>
            <span className="text-xs font-medium text-blue-600 group-hover:underline flex items-center mt-1">
              View Fleet <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 transition-colors">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Haul Speed */}
        <div
          onClick={() => navigate('/tracking')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all shadow-xs flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Speed (D-001)
              </span>
              <Maximize2 className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-1">
              {telemetry.gps.speed_kmh.toFixed(1)} <span className="text-xs font-normal font-sans text-slate-500">km/h</span>
            </div>
            <span className="text-xs font-medium text-blue-600 group-hover:underline flex items-center mt-1">
              {telemetry.imu.motion_status} <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 group-hover:bg-slate-200 transition-colors">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Current Risk */}
        <div
          onClick={() => navigate('/collision-safety')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-md cursor-pointer transition-all shadow-xs flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Collision Risk
              </span>
              <Maximize2 className="w-3 h-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${
              telemetry.risk.risk_level === 'CRITICAL' ? 'text-red-600' :
              telemetry.risk.risk_level === 'WARNING' ? 'text-amber-600' :
              telemetry.risk.risk_level === 'CAUTION' ? 'text-yellow-600' : 'text-emerald-600'
            }`}>
              {telemetry.risk.risk_level}
            </div>
            <span className="text-xs text-slate-500 flex items-center mt-1">
              Score: <strong className="ml-1 text-slate-800 font-mono">{telemetry.risk.risk_score}/100</strong>
            </span>
          </div>
          <div className={`p-2.5 rounded-lg border transition-colors ${
            telemetry.risk.risk_level === 'CRITICAL'
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-emerald-50 border-emerald-200 text-emerald-600'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Active Alerts */}
        <div
          onClick={() => navigate('/alerts')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all shadow-xs flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Alerts
              </span>
              <Maximize2 className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 mt-1">
              {alerts.length.toString().padStart(2, '0')}
            </div>
            <span className="text-xs font-medium text-amber-600 group-hover:underline flex items-center mt-1">
              View Log <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 group-hover:bg-amber-100 transition-colors">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 5: System Health */}
        <div
          onClick={() => navigate('/system')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all shadow-xs flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                System Health
              </span>
              <Maximize2 className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 mt-1">
              98%
            </div>
            <span className="text-xs font-medium text-emerald-600 group-hover:underline flex items-center mt-1">
              8/8 Subsystems <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Primary Safety Decision Engine & Vehicle Digital Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 cols: Safety Decision Engine Card */}
        <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wide">
                Primary Safety Decision Engine
              </h2>
            </div>
            <Link
              to="/collision-safety"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 group"
            >
              <span>Detailed Risk Analysis</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Risk Level Badge */}
            <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${getRiskBadgeColor(telemetry.risk.risk_level)}`}>
              <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                Collision Risk
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono mt-1">
                {telemetry.risk.risk_level}
              </span>
              <span className="text-xs mt-1 font-medium">
                Score: <strong className="font-mono">{telemetry.risk.risk_score} / 100</strong>
              </span>
            </div>

            {/* Proximity & TTC */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center items-center text-center">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Time to Collision (TTC)
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800 mt-1">
                {telemetry.risk.ttc_seconds !== null ? `${telemetry.risk.ttc_seconds.toFixed(1)}s` : '> 8.0s'}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Front Gap: <strong className="text-slate-800 font-mono">{telemetry.ultrasonic.front.toFixed(1)} m</strong>
              </span>
            </div>

            {/* Action Request */}
            <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${
              telemetry.risk.risk_level === 'CRITICAL'
                ? 'bg-red-50 border-red-300 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                Recommended Action
              </span>
              <span className="text-base sm:text-lg font-bold mt-1 leading-snug">
                {telemetry.risk.risk_level === 'CRITICAL' ? '🛑 STOP VEHICLE' : telemetry.risk.action}
              </span>
              <span className="text-xs mt-1 text-slate-600 font-medium">
                Autonomous cabin buzzer active
              </span>
            </div>
          </div>

          {/* Explainability Summary */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-bold text-slate-700 text-xs uppercase">Active Hazard Corridor:</span>
              <span className="text-blue-700 font-semibold font-mono">Vehicle D-001 (Main Haul Road)</span>
            </div>
            <p className="text-slate-800 font-semibold text-sm leading-snug">
              {telemetry.risk.hazard_summary}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              {telemetry.risk.reasons.map((r, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs">
                  ✓ {r}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => navigate('/collision-safety')}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs"
            >
              <span>Inspect Stopping Criteria</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/events')}
              className="px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors shadow-xs"
            >
              ▶ View Event Replay
            </button>
          </div>

        </div>

        {/* Right 5 cols: Vehicle Digital Twin with 4 ultrasonic channels */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wide">
                Haul Truck D-001 Digital Twin
              </h2>
            </div>
            <Link
              to="/fleet/D-001"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 group"
            >
              <span>Full Twin</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Embedded Digital Twin Widget */}
          <div className="py-2">
            <VehicleDigitalTwin
              ultrasonic={telemetry.ultrasonic}
              imu={telemetry.imu}
              speed={telemetry.gps.speed_kmh}
            />
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">FRONT</span>
              <span className="text-base font-bold font-mono text-blue-700">{telemetry.ultrasonic.front.toFixed(1)}m</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">REAR</span>
              <span className="text-base font-bold font-mono text-slate-700">{telemetry.ultrasonic.rear.toFixed(1)}m</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">LEFT</span>
              <span className="text-base font-bold font-mono text-slate-700">{telemetry.ultrasonic.left.toFixed(1)}m</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">RIGHT</span>
              <span className="text-base font-bold font-mono text-slate-700">{telemetry.ultrasonic.right.toFixed(1)}m</span>
            </div>
          </div>
        </div>

      </div>

      {/* Section Map: Live Fleet Movement & GIS Radar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                Fleet Section Map & Live Radar
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live multi-vehicle tracking across all 5 haulers &bull; Defaulted to your live GPS coordinates
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/tracking')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Open Whole Map (Full Page)</span>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="rounded-lg overflow-hidden border border-slate-200 shadow-xs">
          <GpsTrackingMap
            gps={telemetry.gps}
            ultrasonic={telemetry.ultrasonic}
            visibility={telemetry.visibility}
            hazardDetected={telemetry.risk.risk_level === 'CRITICAL'}
            onOpenFullscreen={() => navigate('/tracking')}
          />
        </div>
      </div>

    </div>
  );
};
