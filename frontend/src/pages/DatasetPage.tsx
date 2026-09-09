import React from 'react';
import { HardDrive, Layers, CheckCircle2, Info, ArrowRight, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DatasetPage: React.FC = () => {
  const datasetStats = {
    totalImages: '148,200',
    totalAnnotations: '342,600',
    trainSplit: '103,740 (70%)',
    valSplit: '29,640 (20%)',
    testSplit: '14,820 (10%)',
    resolution: '1920 × 1080 px & 1280 × 720 px (Multi-spectral)',
    environment: 'Production open-pit iron ore & coal haul roads across NMDC Bailadila (Deposit 14 & 11C) and SECL, encompassing monsoon rain, heavy valley fog, high-dust conditions, and night shifts',
  };

  const classDistributions = [
    { name: 'PERSON', count: '143,892', percent: 42, barColor: 'bg-blue-500', desc: 'Pedestrian workers, surveyors, and spotters wearing high-visibility reflective PPE and hardhats.' },
    { name: 'DUMPER', count: '119,910', percent: 35, barColor: 'bg-amber-500', desc: 'Heavy haul dumpers (CAT 777E, BEML BH85), front grilles, shovel excavators, and light vehicles.' },
    { name: 'OBSTACLE', count: '78,798', percent: 23, barColor: 'bg-yellow-500', desc: 'Spilled high-grade iron ore boulders, road debris, berm slumping, and highwall edge hazards.' },
  ];

  return (
    <div className="space-y-4 font-mono pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
            <Database className="w-7 h-7 text-cyan-400" />
            <span>DATASET SPECIFICATION & ANNOTATION DISTRIBUTION</span>
          </h1>
          <p className="text-sm font-semibold text-slate-300 mt-1">
            Mining vision dataset composition across train, validation, and test splits
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3.5 py-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 font-black text-xs">
            TOTAL IMAGES: {datasetStats.totalImages}
          </span>
        </div>
      </div>

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-300 uppercase font-black block">TOTAL ANNOTATIONS</span>
          <div className="text-3xl font-black text-slate-100 mt-1.5">{datasetStats.totalAnnotations}</div>
          <span className="text-xs text-cyan-400 font-bold mt-1.5 block">YOLO darknet / TXT format</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-300 uppercase font-black block">TRAIN SPLIT (70%)</span>
          <div className="text-3xl font-black text-cyan-300 mt-1.5">{datasetStats.trainSplit}</div>
          <span className="text-xs text-slate-400 font-bold mt-1.5 block">Data augmented & flipped</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-300 uppercase font-black block">VALIDATION SPLIT (20%)</span>
          <div className="text-3xl font-black text-sky-400 mt-1.5">{datasetStats.valSplit}</div>
          <span className="text-xs text-slate-400 font-bold mt-1.5 block">Independent validation</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-300 uppercase font-black block">TEST BENCH (10%)</span>
          <div className="text-3xl font-black text-purple-300 mt-1.5">{datasetStats.testSplit}</div>
          <span className="text-xs text-slate-400 font-bold mt-1.5 block">Unseen test holdout</span>
        </div>
      </div>

      {/* Class Distribution Bars */}
      <div className="p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider">
            CLASS DISTRIBUTION & OBJECT BREAKDOWN
          </h2>
          <span className="text-xs text-cyan-300 font-black">
            3 PRIMARY MINING SAFETY CLASSES
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {classDistributions.map((cls, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-100">
                  {cls.name} <span className="text-slate-400 font-bold text-xs">({cls.count} bounding boxes)</span>
                </span>
                <span className="font-black text-base text-cyan-300">{cls.percent}%</span>
              </div>
              <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${cls.barColor} transition-all duration-500`}
                  style={{ width: `${cls.percent}%` }}
                />
              </div>
              <p className="text-xs text-slate-300 leading-normal">{cls.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Metadata Box */}
      <div className="p-5 rounded-xl bg-[#0a1020] border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider border-b border-slate-800/80 pb-2.5">
          ENVIRONMENTAL SENSING SPECIFICATION
        </h3>
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-medium">
          <p>
            <strong className="text-slate-100 font-bold">Image Resolution:</strong> {datasetStats.resolution}
          </p>
          <p>
            <strong className="text-slate-100 font-bold">Operational Context:</strong> {datasetStats.environment}
          </p>
        </div>
      </div>

      {/* Synthetic Fog Augmentation Note */}
      <div className="p-4 rounded-xl bg-[#0a1020] border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-bold uppercase border-b border-slate-800/80 pb-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>FOG SYNTHESIS & AUGMENTATION PIPELINE</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          To prepare YOLO for dense monsoon fog where optical data collection is hazardous, synthetic Koschmieder optical transmission modeling was applied during data preprocessing. Atmospheric attenuation:
          <span className="text-cyan-300 font-bold ml-1">I(x) = J(x)e^(-β·d) + L_∞(1 - e^(-β·d))</span>.
        </p>
      </div>
    </div>
  );
};
