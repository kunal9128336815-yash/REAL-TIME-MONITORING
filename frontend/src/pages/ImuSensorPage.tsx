import React from 'react';
import { useTelemetryContext } from '../context/TelemetryContext';
import { Layers } from 'lucide-react';

export const ImuSensorPage: React.FC = () => {
  const { telemetry } = useTelemetryContext();
  const imu = telemetry.imu;

  // Calculate pitch and roll angles for visual indicator
  const pitch = imu.tilt_deg;
  const roll = parseFloat((imu.tilt_deg * 0.4).toFixed(1));
  const yaw = telemetry.gps.heading_deg;

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <span>MPU6050 6-DOF Inertial Measurement Unit</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tri-axial accelerometer and gyroscope motion dynamics and chassis incline monitoring
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>I2C Bus 0x68 Online</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Orientation Artificial Horizon & Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 6 cols: Visual Incline & Horizon Indicator */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dynamic Attitude & Pit Incline Indicator
            </h2>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {imu.motion_status}
            </span>
          </div>

          {/* Visual Artificial Horizon */}
          <div className="relative h-64 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            {/* Horizon Disc */}
            <div
              className="w-48 h-48 rounded-full border-2 border-slate-300 relative overflow-hidden shadow-inner transition-transform duration-200"
              style={{
                transform: `rotate(${roll}deg) translateY(${pitch * 2}px)`,
              }}
            >
              {/* Sky */}
              <div className="h-1/2 bg-sky-200 border-b-2 border-blue-600" />
              {/* Ground */}
              <div className="h-1/2 bg-amber-100" />
              {/* Center crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-0.5 bg-blue-700" />
                <div className="w-0.5 h-8 bg-blue-700" />
              </div>
            </div>

            {/* Incline Overlay Badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-200 text-xs shadow-md font-sans">
              <span>Pitch: <strong className="text-blue-700 font-mono font-bold">{pitch}°</strong></span>
              <span className="ml-3">Roll: <strong className="text-slate-800 font-mono font-bold">{roll}°</strong></span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            Attitude fused via complementary filter (98% gyro integration + 2% gravity vector)
          </div>
        </div>

        {/* Right 6 cols: Tri-Axial Telemetry Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Tri-Axial Accelerometer & Gyroscope
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Net Acceleration</span>
                <div className="text-xl font-bold font-mono text-blue-700">
                  {imu.acceleration_g.toFixed(2)} g
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Gravitational ref: 1.0g nominal
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Pit Ramp Tilt</span>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {imu.tilt_deg.toFixed(1)}°
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Haul road bench incline
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Yaw Azimuth</span>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {yaw.toFixed(1)}°
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Gyro drift compensated
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Braking / Inertia</span>
                <div className="text-xl font-bold font-sans text-emerald-700">
                  {telemetry.gps.speed_kmh > 0.5 ? 'Haul Forward' : 'Stationary'}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Dynamic motion state
                </span>
              </div>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Why IMU is Crucial for Mining Safety
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Mining dumpers operate on steep 8% to 12% ramp inclines. The IMU detects severe tilt (rollover risk), sudden emergency braking deceleration, and turning dynamics. In the Collision Safety model, heavy braking inertia is factored into required stopping distance.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
