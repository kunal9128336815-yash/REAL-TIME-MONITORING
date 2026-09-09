import React, { useState } from 'react';
import { TelemetryState, ScenarioType, AlertRecord, DetailModalType } from '../../types';
import { HeroRiskPanel } from '../dashboard/HeroRiskPanel';
import { VehicleDigitalTwin } from '../dashboard/VehicleDigitalTwin';
import { LiveAiVision } from '../dashboard/LiveAiVision';
import { SensorFusionEngine } from '../dashboard/SensorFusionEngine';
import { ExplainableRiskCard } from '../dashboard/ExplainableRiskCard';
import { VisibilityPanel } from '../dashboard/VisibilityPanel';
import { UltrasonicPanel } from '../dashboard/UltrasonicPanel';
import { DriverSafetyCard } from '../dashboard/DriverSafetyCard';
import { GpsTrackingMap } from '../dashboard/GpsTrackingMap';
import { ScenarioControl } from '../dashboard/ScenarioControl';
import { AlertCenter } from '../dashboard/AlertCenter';
import { FleetOverview } from '../dashboard/FleetOverview';
import { SystemHealthPanel } from '../dashboard/SystemHealthPanel';

// Modals
import { RiskDetailModal } from '../modals/RiskDetailModal';
import { VisionDetailModal } from '../modals/VisionDetailModal';
import { DigitalTwinDetailModal } from '../modals/DigitalTwinDetailModal';
import { GpsDetailModal } from '../modals/GpsDetailModal';
import { FusionDetailModal } from '../modals/FusionDetailModal';
import { DriverDetailModal } from '../modals/DriverDetailModal';
import { AlertDetailModal } from '../modals/AlertDetailModal';
import { FleetDetailModal } from '../modals/FleetDetailModal';

import { Truck, AlertTriangle, Eye, Bell, Activity, Maximize2, ExternalLink } from 'lucide-react';

interface CommandCenterViewProps {
  telemetry: TelemetryState;
  alerts: AlertRecord[];
  onSelectScenario: (scenario: ScenarioType) => void;
  onStartGuidedDemo: () => void;
  onControl: (action: 'start' | 'pause' | 'reset', speed?: number) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  telemetry,
  alerts,
  onSelectScenario,
  onStartGuidedDemo,
  onControl,
}) => {
  const [activeModal, setActiveModal] = useState<DetailModalType>(null);

  return (
    <div className="space-y-4 pb-12">
      {/* Click-to-inspect helper hint */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
        <span className="flex items-center space-x-2 font-mono">
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <strong className="font-bold uppercase">INTERACTIVE COMMAND CONSOLE:</strong>
          <span>Click on ANY card or telemetry panel to inspect full engineering telemetry, math, and dataflow!</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          MODAL INSPECTOR ENABLED
        </span>
      </div>

      {/* KPI Top Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setActiveModal('fleet')}
          className="p-3 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
          title="Click to inspect fleet telemetry"
        >
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                ACTIVE VEHICLES
              </span>
              <Maximize2 className="w-2.5 h-2.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-black font-mono text-slate-100 block mt-0.5">
              4 Units
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveModal('risk')}
          className="p-3 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-red-500/60 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
          title="Click to inspect collision risk kinematics"
        >
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                CURRENT RISK
              </span>
              <Maximize2 className="w-2.5 h-2.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className={`text-xl font-black font-mono block mt-0.5 ${
              telemetry.risk.risk_level === 'CRITICAL' ? 'text-red-400' :
              telemetry.risk.risk_level === 'WARNING' ? 'text-amber-400' :
              telemetry.risk.risk_level === 'CAUTION' ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              {telemetry.risk.risk_level}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveModal('fusion')}
          className="p-3 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
          title="Click to inspect visibility fusion"
        >
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                VISIBILITY INDEX
              </span>
              <Maximize2 className="w-2.5 h-2.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-black font-mono text-cyan-300 block mt-0.5">
              {telemetry.visibility.index_percent.toFixed(0)}%
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 group-hover:scale-105 transition-transform">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveModal('alert')}
          className="p-3 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
          title="Click to inspect safety alerts"
        >
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                ACTIVE ALERTS
              </span>
              <Maximize2 className="w-2.5 h-2.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-black font-mono text-amber-400 block mt-0.5">
              {alerts.length}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 group-hover:scale-105 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveModal('digital_twin')}
          className="p-3 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition-all shadow-lg col-span-2 sm:col-span-1 flex items-center justify-between group"
          title="Click to inspect digital twin diagnostics"
        >
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                SYSTEM UPTIME
              </span>
              <Maximize2 className="w-2.5 h-2.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-black font-mono text-emerald-400 block mt-0.5">
              99.8%
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Hero Safety Panel (Clickable) */}
      <div
        onClick={() => setActiveModal('risk')}
        className="cursor-pointer group relative"
        title="Click to inspect collision risk kinematics"
      >
        <div className="absolute top-3 right-3 z-30 opacity-70 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2.5 py-1 rounded bg-black/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
          <Maximize2 className="w-3 h-3" />
          <span>INSPECT RISK MATH</span>
        </div>
        <HeroRiskPanel risk={telemetry.risk} gsm={telemetry.gsm} />
      </div>

      {/* Scenario Control & Guided Demo Bar */}
      <ScenarioControl
        currentScenario={telemetry.scenario}
        guidedDemo={telemetry.guided_demo}
        onSelectScenario={onSelectScenario}
        onStartGuidedDemo={onStartGuidedDemo}
        onControl={onControl}
      />

      {/* Core Grid: Left (Vision & Explainability) | Right (Digital Twin & Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column */}
        <div className="space-y-4">
          {/* AI Vision Panel (Clickable) */}
          <div
            onClick={() => setActiveModal('vision')}
            className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
            title="Click to inspect YOLOv8 inference telemetry"
          >
            <div className="absolute top-3 right-3 z-30 opacity-70 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2.5 py-1 rounded bg-black/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
              <Maximize2 className="w-3 h-3" />
              <span>EXPAND VISION</span>
            </div>
            <LiveAiVision vision={telemetry.vision} visibility={telemetry.visibility} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveModal('risk')}
              className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
              title="Click to inspect explainable factors"
            >
              <ExplainableRiskCard
                risk={telemetry.risk}
                gps={telemetry.gps}
                visibility={telemetry.visibility}
                ultrasonic={telemetry.ultrasonic}
              />
            </div>

            <div
              onClick={() => setActiveModal('driver')}
              className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
              title="Click to inspect driver safety monitoring"
            >
              <DriverSafetyCard driverSafety={telemetry.risk.driver_safety} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Vehicle Digital Twin (Clickable) */}
          <div
            onClick={() => setActiveModal('digital_twin')}
            className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
            title="Click to inspect vehicle digital twin transducers"
          >
            <div className="absolute top-3 right-3 z-30 opacity-70 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2.5 py-1 rounded bg-black/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
              <Maximize2 className="w-3 h-3" />
              <span>EXPAND TWIN</span>
            </div>
            <VehicleDigitalTwin
              ultrasonic={telemetry.ultrasonic}
              imu={telemetry.imu}
              speed={telemetry.gps.speed_kmh}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveModal('map')}
              className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
              title="Click to inspect GPS map waypoints and geofence"
            >
              <div className="absolute top-3 right-3 z-30 opacity-70 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2 py-0.5 rounded bg-black/70 border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
                <Maximize2 className="w-2.5 h-2.5" />
                <span>EXPAND MAP</span>
              </div>
              <GpsTrackingMap
                gps={telemetry.gps}
                hazardDetected={telemetry.risk.risk_level === 'CRITICAL'}
              />
            </div>

            <div className="space-y-4">
              <div
                onClick={() => setActiveModal('fusion')}
                className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
                title="Click to inspect visibility degradation"
              >
                <VisibilityPanel visibility={telemetry.visibility} />
              </div>

              <div
                onClick={() => setActiveModal('digital_twin')}
                className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
                title="Click to inspect ultrasonic array"
              >
                <UltrasonicPanel ultrasonic={telemetry.ultrasonic} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Full Width: Multi-Sensor Fusion Engine (Clickable) */}
      <div
        onClick={() => setActiveModal('fusion')}
        className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
        title="Click to inspect multi-sensor fusion algorithms"
      >
        <div className="absolute top-3 right-3 z-30 opacity-70 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2.5 py-1 rounded bg-black/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
          <Maximize2 className="w-3 h-3" />
          <span>INSPECT FUSION MODEL</span>
        </div>
        <SensorFusionEngine
          confidence={telemetry.risk.sensor_confidence}
          opticalDegraded={telemetry.visibility.optical_degraded}
          visibilityPercent={telemetry.visibility.index_percent}
        />
      </div>

      {/* Bottom Grid: Live Alerts Feed + Fleet Status (Clickable) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveModal('alert')}
          className="lg:col-span-1 cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
          title="Click to inspect complete alert log"
        >
          <div className="absolute top-3 right-3 z-30 opacity-70 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2 py-0.5 rounded bg-black/70 border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
            <Maximize2 className="w-2.5 h-2.5" />
            <span>AUDIT LOG</span>
          </div>
          <AlertCenter alerts={alerts} />
        </div>

        <div
          onClick={() => setActiveModal('fleet')}
          className="lg:col-span-2 cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
          title="Click to inspect fleet vehicle details"
        >
          <div className="absolute top-3 right-3 z-30 opacity-70 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2 py-0.5 rounded bg-black/70 border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
            <Maximize2 className="w-2.5 h-2.5" />
            <span>EXPAND FLEET</span>
          </div>
          <FleetOverview currentRiskLevel={telemetry.risk.risk_level} />
        </div>
      </div>

      {/* Technical System Health */}
      <div
        onClick={() => setActiveModal('digital_twin')}
        className="cursor-pointer group relative hover:ring-1 hover:ring-cyan-400 rounded-xl transition-all"
        title="Click to inspect hardware subsystem diagnostics"
      >
        <SystemHealthPanel health={telemetry.system_health} gsm={telemetry.gsm} />
      </div>

      {/* MODAL INSPECTORS */}
      <RiskDetailModal
        isOpen={activeModal === 'risk'}
        onClose={() => setActiveModal(null)}
        risk={telemetry.risk}
        gps={telemetry.gps}
        ultrasonic={telemetry.ultrasonic}
        visibility={telemetry.visibility}
        gsm={telemetry.gsm}
      />

      <VisionDetailModal
        isOpen={activeModal === 'vision'}
        onClose={() => setActiveModal(null)}
        vision={telemetry.vision}
        visibility={telemetry.visibility}
      />

      <DigitalTwinDetailModal
        isOpen={activeModal === 'digital_twin'}
        onClose={() => setActiveModal(null)}
        ultrasonic={telemetry.ultrasonic}
        imu={telemetry.imu}
        gps={telemetry.gps}
      />

      <GpsDetailModal
        isOpen={activeModal === 'map'}
        onClose={() => setActiveModal(null)}
        gps={telemetry.gps}
      />

      <FusionDetailModal
        isOpen={activeModal === 'fusion'}
        onClose={() => setActiveModal(null)}
        confidence={telemetry.risk.sensor_confidence}
        visibility={telemetry.visibility}
      />

      <DriverDetailModal
        isOpen={activeModal === 'driver'}
        onClose={() => setActiveModal(null)}
        driverSafety={telemetry.risk.driver_safety}
      />

      <AlertDetailModal
        isOpen={activeModal === 'alert'}
        onClose={() => setActiveModal(null)}
        alerts={alerts}
        gps={telemetry.gps}
      />

      <FleetDetailModal
        isOpen={activeModal === 'fleet'}
        onClose={() => setActiveModal(null)}
        currentRiskLevel={telemetry.risk.risk_level}
      />
    </div>
  );
};
