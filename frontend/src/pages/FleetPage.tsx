import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelemetryContext } from '../context/TelemetryContext';
import { Truck, ArrowRight, MapPin, Radio, AlertTriangle } from 'lucide-react';
import { GpsTrackingMap } from '../components/dashboard/GpsTrackingMap';

export const FleetPage: React.FC = () => {
  const navigate = useNavigate();
  const { telemetry } = useTelemetryContext();

  const isLive = telemetry.mode === 'LIVE_HARDWARE';

  const vehicles = [
    {
      id: 'D-001',
      name: 'Dumper D-001 (Active Hardware Rig)',
      driver: 'Ramesh Kumar (ID #849)',
      status: isLive ? 'ACTIVE' : 'OFFLINE',
      speed: telemetry.gps.speed_kmh !== null ? `${telemetry.gps.speed_kmh.toFixed(1)} km/h` : 'N/A',
      risk: telemetry.risk.risk_level,
      riskScore: telemetry.risk.risk_score !== null ? telemetry.risk.risk_score : '--',
      visibility: telemetry.visibility.index_percent !== null ? `${Math.round(telemetry.visibility.index_percent)}%` : 'N/A',
      ttc: telemetry.risk.ttc_seconds !== null ? `${telemetry.risk.ttc_seconds.toFixed(1)}s` : (isLive ? '> 8.0s' : 'N/A'),
      gps: telemetry.gps.fix_status || (isLive ? '3D_FIX' : 'NO_FIX'),
      connection: isLive ? 'ONLINE (ESP32 + Pi 4)' : 'OFFLINE (Waiting for Pi Feed)',
      payload: isLive ? '85.4 Tons' : '0.0 Tons',
      sector: isLive ? 'Pit Alpha - Haul Road 2' : 'Test Rig (Bench)',
      isPrimary: true,
    },
    {
      id: 'D-002',
      name: 'Dumper D-002',
      driver: 'Vikram Singh (ID #712)',
      status: 'OFFLINE',
      speed: '0.0 km/h',
      risk: 'SAFE',
      riskScore: '--',
      visibility: 'N/A',
      ttc: 'N/A',
      gps: 'STANDBY',
      connection: 'OFFLINE (Parked in Depot)',
      payload: '0.0 Tons',
      sector: 'Maintenance Bay 3',
      isPrimary: false,
    },
    {
      id: 'D-003',
      name: 'Dumper D-003',
      driver: 'Anil Sharma (ID #521)',
      status: 'OFFLINE',
      speed: '0.0 km/h',
      risk: 'SAFE',
      riskScore: '--',
      visibility: 'N/A',
      ttc: 'N/A',
      gps: 'STANDBY',
      connection: 'OFFLINE (Parked in Depot)',
      payload: '0.0 Tons',
      sector: 'South Fueling Station',
      isPrimary: false,
    },
    {
      id: 'D-004',
      name: 'Dumper D-004',
      driver: 'Mohd. Salim (ID #639)',
      status: 'OFFLINE',
      speed: '0.0 km/h',
      risk: 'SAFE',
      riskScore: '--',
      visibility: 'N/A',
      ttc: 'N/A',
      gps: 'STANDBY',
      connection: 'OFFLINE (Parked in Depot)',
      payload: '0.0 Tons',
      sector: 'Workshop Bay 1',
      isPrimary: false,
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'WARNING':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'CAUTION':
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      case 'OFFLINE':
        return 'text-slate-500 bg-slate-100 border-slate-200';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Truck className="w-6 h-6 text-blue-600" />
            <span>Fleet Proximity Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry and collision risk index across all active open-pit mining dumpers
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>1 Active Rig (D-001)</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-medium">
            3 Offline (Depot)
          </span>
        </div>
      </div>

      {/* Fleet Live Section Map with click-to-expand */}
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white">
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Live Fleet Movement Section Map
            </span>
          </div>
          <button
            onClick={() => navigate('/tracking')}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
          >
            <span>Open Whole Map (Full Page)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <GpsTrackingMap
          gps={telemetry.gps}
          ultrasonic={telemetry.ultrasonic}
          visibility={telemetry.visibility}
          hazardDetected={telemetry.risk.risk_level === 'CRITICAL'}
          onOpenFullscreen={() => navigate('/tracking')}
        />
      </div>

      {/* Fleet Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Active Haul Fleet Sensory Matrix
          </h2>
          <span className="text-xs text-slate-500">
            Click any vehicle row to inspect digital twin & sensors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">VEHICLE</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">SPEED</th>
                <th className="py-3 px-3">RISK LEVEL</th>
                <th className="py-3 px-3">VISIBILITY</th>
                <th className="py-3 px-3">TTC</th>
                <th className="py-3 px-3">GNSS STATUS</th>
                <th className="py-3 px-3">CONNECTION</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/fleet/${v.id}`)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 group-hover:border-blue-400 transition-colors">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-900 font-mono font-bold text-sm">{v.id}</span>
                        {v.isPrimary && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-medium">
                            Test Rig
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block font-normal">{v.driver}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold font-mono text-slate-800">
                    {v.speed}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getRiskColor(v.risk)}`}>
                      {v.risk} ({v.riskScore})
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-medium font-mono text-slate-800">
                    {v.visibility}
                  </td>
                  <td className="py-3.5 px-3 font-bold font-mono text-blue-700">
                    {v.ttc}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span className="font-mono">{v.gps}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                    <div className="flex items-center space-x-1">
                      <Radio className="w-3 h-3 text-blue-600" />
                      <span>{v.connection}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-blue-600 group-hover:text-blue-800 flex items-center justify-end space-x-1 text-xs font-semibold">
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Fleet Risk Posture</span>
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-slate-700">
              <span>Critical Dumpers:</span>
              <span className="font-bold text-red-600">1 Unit (D-004)</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Warning Dumpers:</span>
              <span className="font-bold text-amber-600">1 Unit (D-002)</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Normal Running:</span>
              <span className="font-bold text-emerald-600">2 Units</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Environment Distribution</span>
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-slate-700">
              <span>Pit Bottom Fog Index:</span>
              <span className="font-bold text-slate-900">28% (Severe Fog)</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Surface Crusher Visibility:</span>
              <span className="font-bold text-slate-900">71% (Moderate Fog)</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Sensor Fusion Integrity:</span>
              <span className="font-bold text-emerald-600">100% Proximity Available</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Dispatch Actions</span>
            <p className="mt-1 text-slate-600 text-[11px]">
              Broadcast emergency corridor clearing audio siren across entire pit fleet.
            </p>
          </div>
          <button
            onClick={() => navigate('/alerts')}
            className="mt-3 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Dispatch Fleet Hazard Advisory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
