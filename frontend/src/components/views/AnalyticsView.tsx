import React from 'react';
import { HistoricalDataPoint, AlertRecord } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { LineChart as LineChartIcon, Activity, Clock, ShieldAlert } from 'lucide-react';

interface AnalyticsViewProps {
  history: HistoricalDataPoint[];
  alerts: AlertRecord[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ history, alerts }) => {
  // Aggregate alerts by severity
  const alertCounts = [
    { severity: 'CRITICAL', count: alerts.filter(a => a.severity === 'CRITICAL').length, fill: '#ef4444' },
    { severity: 'WARNING', count: alerts.filter(a => a.severity === 'WARNING').length, fill: '#f97316' },
    { severity: 'CAUTION', count: alerts.filter(a => a.severity === 'CAUTION').length, fill: '#f59e0b' },
    { severity: 'INFO', count: alerts.filter(a => a.severity === 'INFO').length, fill: '#3b82f6' },
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <LineChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              OPERATIONAL TELEMETRY & HISTORICAL ANALYTICS
            </h2>
            <p className="text-xs text-slate-400">
              Live sliding time-series window (Last 30 cycles recorded at 400ms interval)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5" />
          <span>SAMPLING: 2.5 HZ</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. Speed vs Time */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-cyan-400 uppercase">
              VEHICLE SPEED (KM/H) VS TIME
            </span>
            <span className="text-[10px] font-mono text-slate-400">NEO-6M GNSS Doppler</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 30]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Area type="monotone" dataKey="speed" stroke="#00e5ff" strokeWidth={2} fillOpacity={1} fill="url(#speedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Time To Collision (TTC) vs Time */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-amber-400 uppercase">
              ESTIMATED TIME TO COLLISION (TTC IN SECONDS)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Critical Threshold: &lt;2.0s</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Line type="stepAfter" dataKey="ttc" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Environmental Visibility vs Time */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-sky-400 uppercase">
              OPTICAL VISIBILITY INDEX (%)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Dense Fog Cutoff: 35%</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Area type="monotone" dataKey="visibility" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#visGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Ultrasonic Front Distance vs Time */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-emerald-400 uppercase">
              ULTRASONIC FORWARD DISTANCE (METERS)
            </span>
            <span className="text-[10px] font-mono text-slate-400">HC-SR04 / JSN-SR04T Array</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 20]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Line type="monotone" dataKey="front_distance" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Collision Risk Level vs Time */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-red-400 uppercase">
              COLLISION RISK TRANSITIONS (0=SAFE, 1=CAUTION, 2=WARN, 3=CRIT)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Risk Engine State</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 3]} ticks={[0, 1, 2, 3]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Line type="stepAfter" dataKey="risk_numeric" stroke="#ef4444" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Alerts by Severity Distribution */}
        <div className="bg-[#0b1324] rounded-xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase">
              ALERT DISTRIBUTION BY SEVERITY
            </span>
            <span className="text-[10px] font-mono text-slate-400">Logged Safety Events</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="severity" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {alertCounts.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
