import React from 'react';
import { DetailModalWrapper } from './DetailModalWrapper';
import { FleetVehicle } from '../../types';
import { Truck, ShieldCheck, Activity, Gauge, MapPin, Radio } from 'lucide-react';

interface FleetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRiskLevel?: string;
}

export const FleetDetailModal: React.FC<FleetDetailModalProps> = ({
  isOpen,
  onClose,
  currentRiskLevel,
}) => {
  const fleet: FleetVehicle[] = [
    {
      id: "DUMPER_01",
      name: "CAT 777E Dumper #01 (Focus Unit)",
      status: "ACTIVE",
      speed_kmh: 14.5,
      location: "Haul Ramp North - Sector 4",
      risk_level: (currentRiskLevel as any) || "DYNAMIC",
      connection: "4G LTE (Online)",
      driver: "R. Kumar (ID: 4108)",
      payload_tons: 98.4
    },
    {
      id: "DUMPER_02",
      name: "Komatsu HD785 #02",
      status: "ACTIVE",
      speed_kmh: 9.2,
      location: "Crusher Loading Bay 2",
      risk_level: "WARNING",
      connection: "4G LTE (Online)",
      driver: "M. Soren (ID: 3290)",
      payload_tons: 92.0
    },
    {
      id: "DUMPER_03",
      name: "CAT 777E Dumper #03",
      status: "ACTIVE",
      speed_kmh: 16.8,
      location: "Overburden Dump Area C",
      risk_level: "SAFE",
      connection: "4G LTE (Online)",
      driver: "A. Tirkey (ID: 5512)",
      payload_tons: 0.0
    },
    {
      id: "SERVICE_01",
      name: "Safety Patrol / Service Truck #01",
      status: "PATROLLING",
      speed_kmh: 22.0,
      location: "Pit Access Road South",
      risk_level: "SAFE",
      connection: "4G LTE (Online)",
      driver: "S. Verma (Safety Officer)",
      payload_tons: 2.5
    }
  ];

  return (
    <DetailModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="MINE FLEET VEHICLE TELEMETRY & DISPATCH PROFILE"
      subtitle="Heavy haulage fleet health, payload metrics, driver assignment and cellular mesh connectivity"
      badge="4 ACTIVE UNITS"
      badgeColor="bg-cyan-500 text-black"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fleet.map((veh) => {
          const isFocus = veh.id === 'DUMPER_01';
          return (
            <div
              key={veh.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isFocus
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-cyan-300 flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    <span>{veh.name}</span>
                  </span>
                  {isFocus && (
                    <span className="text-[9px] font-black bg-cyan-500 text-black px-2 py-0.5 rounded font-mono">
                      INSTRUMENTED UNIT
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">OPERATOR</span>
                    <span className="font-bold text-slate-200">{veh.driver}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">SECTOR LOCATION</span>
                    <span className="font-bold text-slate-200">{veh.location}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">PAYLOAD TONNAGE</span>
                    <span className="font-bold text-cyan-300">{veh.payload_tons.toFixed(1)} T</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">CURRENT SPEED</span>
                    <span className="font-bold text-emerald-300">{veh.speed_kmh.toFixed(1)} km/h</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Risk: <strong className="text-cyan-300">{veh.risk_level}</strong></span>
                <span className="text-emerald-400 font-bold">{veh.connection}</span>
              </div>
            </div>
          );
        })}
      </div>
    </DetailModalWrapper>
  );
};
