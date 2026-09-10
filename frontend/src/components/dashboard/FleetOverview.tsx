import React, { useEffect, useState } from 'react';
import { FleetVehicle } from '../../types';
import { fetchFleet } from '../../services/api';
import { Truck, ShieldAlert, Wifi, Activity, Navigation } from 'lucide-react';

interface FleetOverviewProps {
  currentRiskLevel?: string;
}

export const FleetOverview: React.FC<FleetOverviewProps> = ({ currentRiskLevel }) => {
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);

  useEffect(() => {
    fetchFleet().then(setFleet).catch(() => {});
  }, []);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'WARNING':
        return 'bg-amber-500 text-black';
      case 'CAUTION':
        return 'bg-yellow-500 text-black';
      case 'OFFLINE':
        return 'bg-slate-700 text-slate-300';
      case 'SAFE':
      default:
        return 'bg-emerald-500 text-black';
    }
  };

  return (
    <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            FLEET SAFETY MONITORING & VEHICLE DISPATCH
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
          4 Open-Cast Units Tracked
        </span>
      </div>

      {/* Fleet Table */}
      <div className="overflow-x-auto my-3">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 font-mono uppercase">
              <th className="py-2 px-3">Vehicle ID</th>
              <th className="py-2 px-3">Operator</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Speed</th>
              <th className="py-2 px-3">Sector Location</th>
              <th className="py-2 px-3">Payload</th>
              <th className="py-2 px-3">Safety Risk</th>
              <th className="py-2 px-3">Cellular Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {fleet.map((veh) => {
              const effectiveRisk = veh.id === 'DUMPER_01' ? (currentRiskLevel || 'SAFE') : veh.risk_level;
              const isFocus = veh.id === 'DUMPER_01';

              return (
                <tr
                  key={veh.id}
                  className={`transition-colors ${
                    isFocus
                      ? 'bg-cyan-950/40 hover:bg-cyan-950/60 font-semibold text-cyan-200'
                      : 'hover:bg-slate-900/50 text-slate-300'
                  }`}
                >
                  <td className="py-3 px-3 flex items-center space-x-2">
                    <Truck className={`w-3.5 h-3.5 ${isFocus ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{veh.name}</span>
                    {isFocus && (
                      <span className="text-[8px] bg-cyan-500 text-black px-1 rounded font-bold">THIS UNIT</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{veh.driver}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center space-x-1 text-[10px] font-bold ${
                      veh.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        veh.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}></span>
                      <span>{veh.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-200">
                    {veh.speed_kmh !== null && veh.speed_kmh !== undefined ? `${veh.speed_kmh.toFixed(1)} km/h` : 'N/A'}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{veh.location}</td>
                  <td className="py-3 px-3 text-slate-400">
                    {veh.payload_tons !== null && veh.payload_tons !== undefined ? `${veh.payload_tons.toFixed(1)} T` : '0.0 T'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono ${getRiskBadge(effectiveRisk)}`}>
                      {effectiveRisk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[10px] text-cyan-400">{veh.connection}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span>Fleet V2X Protocol: 4G LTE Private APN Mesh</span>
        <span>Centrally Synchronized</span>
      </div>
    </div>
  );
};
