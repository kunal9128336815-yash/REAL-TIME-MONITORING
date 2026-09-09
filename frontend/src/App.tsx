import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TelemetryProvider } from './context/TelemetryContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Dedicated Route Pages
import { OverviewPage } from './pages/OverviewPage';
import { FleetPage } from './pages/FleetPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { AiVisionPage } from './pages/AiVisionPage';
import { SensorFusionPage } from './pages/SensorFusionPage';
import { CollisionSafetyPage } from './pages/CollisionSafetyPage';
import { FogVisibilityPage } from './pages/FogVisibilityPage';
import { TrackingPage } from './pages/TrackingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { EventReplayPage } from './pages/EventReplayPage';
import { AiPerformancePage } from './pages/AiPerformancePage';
import { DatasetPage } from './pages/DatasetPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { UltrasonicSensorPage } from './pages/UltrasonicSensorPage';
import { GpsSensorPage } from './pages/GpsSensorPage';
import { ImuSensorPage } from './pages/ImuSensorPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { AboutJudgePage } from './pages/AboutJudgePage';
import { PresentationModePage } from './pages/PresentationModePage';

export function App() {
  return (
    <TelemetryProvider>
      <HashRouter>
        <Routes>
          {/* Fullscreen Judge Presentation Route */}
          <Route path="/presentation" element={<PresentationModePage />} />

          {/* Persistent Sidebar & Topbar Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="fleet" element={<FleetPage />} />
            <Route path="fleet/:vehicleId" element={<VehicleDetailPage />} />
            <Route path="ai-vision" element={<AiVisionPage />} />
            <Route path="sensor-fusion" element={<SensorFusionPage />} />
            <Route path="collision-safety" element={<CollisionSafetyPage />} />
            <Route path="fog-visibility" element={<FogVisibilityPage />} />
            <Route path="driver-safety" element={<Navigate to="/collision-safety" replace />} />
            <Route path="tracking" element={<TrackingPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="events" element={<EventReplayPage />} />
            <Route path="ai-performance" element={<AiPerformancePage />} />
            <Route path="dataset" element={<DatasetPage />} />
            <Route path="system" element={<SystemHealthPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="sensors/ultrasonic" element={<UltrasonicSensorPage />} />
            <Route path="sensors/gps" element={<GpsSensorPage />} />
            <Route path="sensors/imu" element={<ImuSensorPage />} />
            <Route path="comparison" element={<ComparisonPage />} />
            <Route path="about" element={<AboutJudgePage />} />
            
            {/* Fallback to Overview */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </TelemetryProvider>
  );
}

export default App;
