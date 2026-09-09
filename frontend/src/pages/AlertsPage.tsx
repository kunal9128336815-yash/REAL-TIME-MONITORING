import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelemetryContext } from '../context/TelemetryContext';
import { Bell, AlertTriangle, ShieldAlert, Info, ArrowRight, Radio } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, telemetry } = useTelemetryContext();
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'CAUTION' | 'INFO'>('ALL');

  const filteredAlerts = alerts.filter(a => filter === 'ALL' || a.severity === filter);

  const getAlertStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'border-l-4 border-l-red-600 bg-red-50/70 text-red-900 border-slate-200';
      case 'WARNING':
        return 'border-l-4 border-l-amber-600 bg-amber-50/70 text-amber-900 border-slate-200';
      case 'CAUTION':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50/70 text-yellow-900 border-slate-200';
      default:
        return 'border-l-4 border-l-blue-600 bg-blue-50/70 text-blue-900 border-slate-200';
    }
  };

  const getIcon = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'CAUTION':
        return <ShieldAlert className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Bell className="w-6 h-6 text-amber-600" />
            <span>Live Safety Alert Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit trail of real-time collision hazards, fog degradations, and 4G SMS dispatches
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center space-x-1.5 text-xs">
          {(['ALL', 'CRITICAL', 'WARNING', 'CAUTION', 'INFO'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filter === sev
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => navigate('/collision-safety')}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-blue-400 hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${getAlertStyle(
                alert.severity
              )}`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 shadow-2xs">
                  {getIcon(alert.severity)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-600 font-bold font-mono">
                      VEHICLE D-001
                    </span>
                    <span className="text-[11px] text-slate-500">
                      &bull; {alert.timestamp}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {alert.message}
                  </div>
                  {alert.sms_details && (
                    <div className="text-xs text-emerald-700 flex items-center space-x-1 font-medium">
                      <Radio className="w-3.5 h-3.5" />
                      <span>{alert.sms_details}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs shrink-0 self-end sm:self-center">
                <span className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1">
                  <span>Inspect Event</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs shadow-xs">
            No active alerts currently matching filter "{filter}".
          </div>
        )}
      </div>

      {/* 4G SIM Dispatch Architecture */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Radio className="w-4 h-4 text-blue-600" />
            <span>4G LTE GSM Emergency SMS Subsystem</span>
          </span>
          <span className="text-emerald-700 font-semibold">
            Carrier: {telemetry.gsm.carrier}
          </span>
        </div>
        <p className="text-slate-600 leading-relaxed text-xs">
          When risk escalates to <strong className="text-red-700">CRITICAL</strong>, an autonomous AT-command string is dispatched to the SIM7600 4G modem, broadcasting an emergency SMS to the Mine Dispatch Safety Desk with GPS coordinates, closing speed, and distance.
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
          <span>Total Dispatched: {telemetry.gsm.sms_sent_count} SMS</span>
          <span>Signal: {telemetry.gsm.signal_dbm} dBm (CSQ {telemetry.gsm.csq}/31)</span>
        </div>
      </div>
    </div>
  );
};
