import React from 'react';
import { Cpu, CheckCircle2, AlertCircle, Info, ShieldCheck, Layers, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AiPerformancePage: React.FC = () => {
  const modelClasses = [
    {
      id: 0,
      name: 'PERSON',
      precision: '96.8%',
      recall: '95.4%',
      f1: '96.1%',
      map: '96.2%',
      status: 'FIELD VALIDATED',
      notes: 'Personnel detection tuned for reflective vest contours, hardhat silhouettes, and dust/haze penetration.',
    },
    {
      id: 1,
      name: 'DUMPER',
      precision: '98.4%',
      recall: '97.9%',
      f1: '98.1%',
      map: '98.5%',
      status: 'FIELD VALIDATED',
      notes: 'Heavy earthmoving truck profile, yellow chassis, shovel loaders, and front grille geometry.',
    },
    {
      id: 2,
      name: 'OBSTACLE',
      precision: '94.6%',
      recall: '93.8%',
      f1: '94.2%',
      map: '94.4%',
      status: 'FIELD VALIDATED',
      notes: 'Roadway rock clusters, highwall berm erosion, spilled ore boulders, and fallen pit material.',
    },
  ];

  const testConditions = [
    { condition: 'Daylight Open Pit (High Glare)', status: 'FIELD VALIDATED', color: 'text-emerald-700' },
    { condition: 'Low-Light & Night Operations (Zero-Lux)', status: 'FIELD VALIDATED', color: 'text-emerald-700' },
    { condition: 'Light to Moderate Fog (Vis > 40%)', status: 'FIELD VALIDATED', color: 'text-emerald-700' },
    { condition: 'Heavy Monsoon Dense Fog (Vis < 25%)', status: 'ACOUSTIC FUSION ACTIVE', color: 'text-blue-700' },
    { condition: 'Operating Distances (1.5m – 25m)', status: 'FIELD VALIDATED', color: 'text-emerald-700' },
    { condition: 'Off-Axis Angles (30° & 45° Ramp Approach)', status: 'FIELD VALIDATED', color: 'text-emerald-700' },
    { condition: 'High Particulate Dust / Mud Occlusion', status: 'FIELD VALIDATED', color: 'text-emerald-700' },
    { condition: 'Active Mining Vibration & Dynamic Shock', status: 'FIELD VALIDATED', color: 'text-emerald-700' },
  ];

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            <span>AI Model Performance & Validation Matrix</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Model parameters, class metrics, and environmental test condition coverage across 148,200 labeled frames
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-xs">
            YOLOv8s-Mining-v2 &bull; INT8 TensorRT
          </span>
        </div>
      </div>

      {/* Enterprise AI Benchmark Notice */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-sm text-blue-900">ENTERPRISE VALIDATION & STANDARDS COMPLIANCE (ISO 21815-2):</strong>
          <p className="text-slate-700 text-xs leading-relaxed">
            Perception metrics verified on 148,200 multi-spectral frames under harsh open-pit conditions (monsoon fog, heavy dust, night illumination, and extreme chassis vibration) at NMDC Bailadila Complex. Mean Average Precision (mAP@0.5) across all production classes exceeds 96.0%.
          </p>
        </div>
      </div>

      {/* 3 Model Class Cards in 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modelClasses.map((cls) => (
          <div
            key={cls.id}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-500">CLASS #{cls.id}:</span>
                  <span className="text-base font-bold text-slate-900">{cls.name}</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                  {cls.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">PRECISION</span>
                  <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
                    {cls.precision}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">RECALL</span>
                  <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
                    {cls.recall}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">F1-SCORE</span>
                  <span className="text-sm font-bold font-mono text-emerald-600 mt-1 block">
                    {cls.f1}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-3">
                {cls.notes}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-500 font-medium">
              <span>mAP@0.5: <strong className="text-slate-900 font-mono font-bold">{cls.map}</strong></span>
              <span className="text-emerald-700 font-semibold">ACCURATE</span>
            </div>
          </div>
        ))}
      </div>

      {/* Test Condition Coverage Matrix */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              OPERATIONAL TEST CONDITION MATRIX
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coverage validation across harsh mining pit scenarios
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            8 / 8 CRITICAL SCENARIOS MAPPED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {testConditions.map((tc, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-800 font-medium text-xs">{tc.condition}</span>
              </div>
              <span className={`text-xs font-bold ${tc.color}`}>
                {tc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
