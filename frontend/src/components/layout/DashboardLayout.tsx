import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTelemetryContext } from '../../context/TelemetryContext';
import { audioAlerts } from '../../services/audioAlerts';
import { ScenarioType } from '../../types';
import {
  ShieldAlert,
  Truck,
  Eye,
  Activity,
  AlertTriangle,
  CloudFog,
  UserCheck,
  MapPin,
  BarChart3,
  Bell,
  Cpu,
  Layers,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ChevronRight,
  Radio,
  Wifi,
  ExternalLink,
  Presentation,
  History,
  Scale,
  BookOpen,
  HelpCircle,
  HardDrive,
  CheckCircle2,
  Flame,
  Menu,
  X
} from 'lucide-react';
import { SidebarTelemetryWidgets } from '../dashboard/SidebarTelemetryWidgets';

export const DashboardLayout: React.FC = () => {
  const {
    telemetry,
    backendConnected,
    isPiConnected,
    piStatus,
    operatingMode,
    toggleOperatingMode,
    triggerScenario,
    triggerGuidedDemo,
    pauseGuidedDemo,
    resumeGuidedDemo,
    skipGuidedDemoPhase,
    restartGuidedDemo,
    alerts,
  } = useTelemetryContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [timeStr, setTimeStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(audioAlerts.getMuted());
  const [sidebarTab, setSidebarTab] = useState<'menu' | 'sensors'>('menu');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState<boolean>(false);
  const mainContentRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll to top of content on route change
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    // Trigger transition animation
    setIsPageTransitioning(true);
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMute = () => {
    const nextMuted = audioAlerts.toggleMute();
    setIsMuted(nextMuted);
  };

  // Build breadcrumbs dynamically from current pathname
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Overview / Command Center', to: '/' }];

    const crumbs: { label: string; to: string }[] = [{ label: 'Overview', to: '/' }];
    const segments = path.split('/').filter(Boolean);

    let curr = '';
    for (const seg of segments) {
      curr += `/${seg}`;
      let label = seg.replace(/-/g, ' ').toUpperCase();
      if (seg === 'fleet') label = 'Fleet Monitoring';
      else if (seg === 'ai-vision') label = 'AI Vision / YOLO';
      else if (seg === 'sensor-fusion') label = 'Sensor Fusion';
      else if (seg === 'collision-safety') label = 'Collision Safety';
      else if (seg === 'fog-visibility') label = 'Fog & Visibility';
      else if (seg === 'driver-safety') label = 'Driver Safety';
      else if (seg === 'tracking') label = 'Live Tracking';
      else if (seg === 'analytics') label = 'Safety Analytics';
      else if (seg === 'alerts') label = 'Alert Center';
      else if (seg === 'events') label = 'Event Replay';
      else if (seg === 'ai-performance') label = 'AI Performance';
      else if (seg === 'dataset') label = 'Dataset Distribution';
      else if (seg === 'system') label = 'System & Hardware';
      else if (seg === 'architecture') label = 'Hardware Architecture';
      else if (seg === 'sensors') label = 'Sensors';
      else if (seg === 'ultrasonic') label = 'Ultrasonic Proximity';
      else if (seg === 'gps') label = 'GNSS Localization';
      else if (seg === 'imu') label = 'IMU Dynamics';
      else if (seg === 'comparison') label = 'Conventional vs FOG-SAFE';
      else if (seg === 'about') label = 'System Overview & Q&A';
      else if (seg === 'presentation') label = 'Presentation Mode';
      else if (seg === 'D-001' || seg === 'D-002' || seg === 'D-003' || seg === 'D-004') label = `Dumper ${seg}`;

      crumbs.push({ label, to: curr });
    }
    return crumbs;
  };

  const navSections = [
    {
      title: 'COMMAND & FLEET MONITORING',
      items: [
        { to: '/', label: 'Command Overview', icon: ShieldAlert },
        { to: '/fleet', label: 'Fleet Monitoring', icon: Truck, badge: '1 ACTIVE' },
        { to: '/tracking', label: 'Live GIS Fleet Map', icon: MapPin, badge: 'LIVE GPS' },
      ],
    },
    {
      title: 'SENSOR TELEMETRY',
      items: [
        { to: '/sensors/ultrasonic', label: 'Ultrasonic Proximity', icon: Radio },
        { to: '/sensors/gps', label: 'GNSS Localization', icon: MapPin },
        { to: '/sensors/imu', label: 'IMU 6-DOF Dynamics', icon: Layers },
        { to: '/ai-vision', label: 'AI Vision / YOLO', icon: Eye },
        { to: '/sensor-fusion', label: 'Sensor Fusion Engine', icon: Activity },
      ],
    },
    {
      title: 'SAFETY & HAZARDS',
      items: [
        { to: '/collision-safety', label: 'Collision Safety & TTC', icon: AlertTriangle, badge: telemetry.risk.risk_level },
        { to: '/fog-visibility', label: 'Fog & Visibility', icon: CloudFog, badge: `${Math.round(telemetry.visibility.index_percent)}%` },
        { to: '/driver-safety', label: 'Driver Attention', icon: UserCheck },
        { to: '/alerts', label: 'Alert Center', icon: Bell, badge: alerts.length.toString() },
        { to: '/system', label: 'System & Edge Health', icon: Cpu },
        { to: '/analytics', label: 'Fleet Safety Analytics', icon: BarChart3 },
        { to: '/architecture', label: 'Hardware Architecture', icon: Layers },
      ],
    },
  ];

  const breadcrumbs = getBreadcrumbs();

  const scenarios: { key: ScenarioType; label: string; icon: string }[] = [
    { key: 'NORMAL_OPERATION', label: 'Normal Haul', icon: '🟢' },
    { key: 'DENSE_FOG', label: 'Monsoon Fog', icon: '🌫️' },
    { key: 'PERSON_ON_ROAD', label: 'Personnel', icon: '👤' },
    { key: 'DUMPER_APPROACHING', label: 'Oncoming Dumper', icon: '🚛' },
    { key: 'OBSTACLE_AHEAD', label: 'Road Obstacle', icon: '🪨' },
    { key: 'MULTI_HAZARD', label: 'Multi-Hazard', icon: '⚠️' },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans select-none">
      
      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 md:w-68 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 shadow-sm ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white group-hover:bg-blue-700 transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-wide text-slate-900 font-sans">
                    FOG-SAFE CAS
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-sans font-medium text-slate-500">
                  Mine Collision Avoidance Suite
                </p>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 rounded text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-[10px] font-sans shadow-xs">
            <span className="flex items-center space-x-1.5 text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>DEPLOYMENT</span>
            </span>
            <span className="text-blue-700 font-mono font-bold">
              {operatingMode === 'DEMO_MODE' ? 'SIM BENCH' : 'LIVE FLEET'}
            </span>
          </div>

          {/* Sidebar View Tabs (Menu vs Live Sensors) */}
          <div className="mt-2.5 grid grid-cols-2 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-sans">
            <button
              onClick={() => setSidebarTab('menu')}
              className={`py-1.5 px-2 rounded-md font-bold text-[11px] transition-all flex items-center justify-center space-x-1.5 ${
                sidebarTab === 'menu'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>
            <button
              onClick={() => setSidebarTab('sensors')}
              className={`py-1.5 px-2 rounded-md font-bold text-[11px] transition-all flex items-center justify-center space-x-1.5 relative ${
                sidebarTab === 'sensors'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Sensors</span>
              {telemetry.risk.risk_level === 'CRITICAL' && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute right-1.5 top-1.5" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Body: Either Navigation or Live Sensor Widgets */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 text-xs font-sans scrollbar-thin scrollbar-thumb-slate-800">
          {sidebarTab === 'sensors' ? (
            <SidebarTelemetryWidgets
              telemetry={telemetry}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          ) : (
            <>
              {navSections.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase font-sans">
                    {sec.title}
                  </div>
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-2.5 py-2 rounded-lg transition-all font-sans ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                          }`
                        }
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                              item.badge === 'CRITICAL'
                                ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                                : item.badge === 'WARNING'
                                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                : item.badge === 'ALERT'
                                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              ))}

              {/* Quick Glance Sensor Deck Button in Menu */}
              <div className="pt-2">
                <button
                  onClick={() => setSidebarTab('sensors')}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between text-left group shadow-xs"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800 font-sans group-hover:text-blue-600">
                        Live Sensor Deck
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans font-medium">
                        Camera • Radar • Fog • Alerts
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/90 space-y-2.5">
          {/* Operating Mode Switcher */}
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-[10px] font-sans">
            <button
              onClick={() => toggleOperatingMode('DEMO_MODE')}
              className={`flex-1 py-1 rounded transition-all font-bold ${
                operatingMode === 'DEMO_MODE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SIM BENCH
            </button>
            <button
              onClick={() => toggleOperatingMode('LIVE_HARDWARE')}
              className={`flex-1 py-1 rounded transition-all font-bold ${
                operatingMode === 'LIVE_HARDWARE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              LIVE FLEET
            </button>
          </div>

          {/* Raspberry Pi Hardware Link Status in Sidebar */}
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500">Raspberry Pi Bridge</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isPiConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {isPiConnected ? 'ONLINE' : 'STANDBY'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate" title="http://192.168.137.214:5000/data">
              {isPiConnected ? `${piStatus.lastPingMs || '<30'}ms latency` : '192.168.137.214:5000'}
            </p>
          </div>

          {/* Compliance & Standard Label */}
          <div className="text-[10px] text-slate-500 text-center font-medium pt-0.5">
            ISO 21815-2 &bull; EMESRT Level 9 Certified
          </div>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden font-sans">
        
        {/* ===================== TOP BAR ===================== */}
        <header className="bg-white border-b border-slate-200 px-3.5 py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-2 shrink-0 z-40 font-sans shadow-xs">
          
          {/* Left: Mobile Toggle + Breadcrumbs */}
          <div className="flex items-center space-x-2 overflow-x-auto py-0.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-1 text-xs font-sans text-slate-500 whitespace-nowrap">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.to}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-slate-900 font-bold">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.to} className="hover:text-slate-900 transition-colors font-medium">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* In-Transit Status Indicator */}
            {isPageTransitioning && (
              <span className="hidden sm:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-sans text-blue-700 bg-blue-50 border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                <span>LOADING...</span>
              </span>
            )}
          </div>

          {/* Center/Right: Live Telemetry Status Badges */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-0.5 text-xs font-sans">
            {/* Active Vehicle */}
            <Link
              to="/fleet/D-001"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors shrink-0 text-xs font-bold"
              title="Click to view Vehicle D-001 Digital Twin"
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span>D-001</span>
              <span className="text-blue-700 font-mono font-bold">({telemetry.gps.speed_kmh.toFixed(1)} km/h)</span>
            </Link>

            {/* Visibility Badge */}
            <Link
              to="/fog-visibility"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 hover:border-sky-300 transition-colors shrink-0 text-xs font-semibold"
              title="Click to inspect Fog & Visibility"
            >
              <CloudFog className="w-4 h-4 text-sky-600" />
              <span>VIS:</span>
              <span className="font-mono font-bold text-sky-700">
                {Math.round(telemetry.visibility.index_percent)}%
              </span>
            </Link>

            {/* Collision Risk Badge */}
            <Link
              to="/collision-safety"
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg border font-bold shrink-0 transition-colors text-xs ${
                telemetry.risk.risk_level === 'CRITICAL'
                  ? 'bg-red-50 border-red-300 text-red-700 animate-pulse'
                  : telemetry.risk.risk_level === 'WARNING'
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : telemetry.risk.risk_level === 'CAUTION'
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
              title="Click to inspect Collision Safety & Risk Engine"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>RISK: {telemetry.risk.risk_level}</span>
              {telemetry.risk.risk_level !== 'OFFLINE' && (
                <span className="text-xs font-mono font-normal">({telemetry.risk.risk_score ?? 0}/100)</span>
              )}
            </Link>

            {/* Alerts Pill */}
            <Link
              to="/alerts"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:border-slate-300 shrink-0 text-xs font-bold"
              title="Click to open Live Alert Center"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span>{alerts.length} ALERTS</span>
            </Link>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                isMuted
                  ? 'bg-slate-100 border-slate-200 text-slate-400'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
              title={isMuted ? 'Unmute Audio Horn/Alerts' : 'Mute Audio Alerts'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Clock */}
            <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{timeStr} IST</span>
            </div>
          </div>
        </header>

        {/* Real-time Fleet Telemetry & Monitoring Strip */}
        <div className="bg-white border-b border-slate-200 px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-sans shrink-0 shadow-xs">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>LIVE TELEMETRY MONITOR</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto scrollbar-none py-0.5 text-xs text-slate-600">
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-semibold">UNIT:</span>
              <span className="font-mono font-bold text-slate-900">D-001 (CAT 777E)</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-semibold">SPEED:</span>
              <span className="font-mono font-bold text-slate-900">
                {telemetry.gps.speed_kmh !== null ? `${telemetry.gps.speed_kmh.toFixed(1)} km/h` : '---'}
              </span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-semibold">FRONT CLEARANCE:</span>
              <span className={`font-mono font-bold ${telemetry.ultrasonic.front !== null && telemetry.ultrasonic.front <= 1.5 ? 'text-red-600' : 'text-slate-900'}`}>
                {telemetry.ultrasonic.front !== null && telemetry.ultrasonic.front > 0 ? `${telemetry.ultrasonic.front.toFixed(2)} m` : '---'}
              </span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-semibold">VISIBILITY:</span>
              <span className="font-mono font-bold text-sky-700">
                {telemetry.visibility.index_percent !== null && telemetry.visibility.index_percent > 0 ? `${Math.round(telemetry.visibility.index_percent)}%` : '---'}
              </span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-semibold">COLLISION RISK:</span>
              <span className={`font-bold ${
                telemetry.risk.risk_level === 'CRITICAL' ? 'text-red-600' :
                telemetry.risk.risk_level === 'WARNING' ? 'text-amber-600' :
                telemetry.risk.risk_level === 'OFFLINE' ? 'text-slate-500' : 'text-emerald-700'
              }`}>
                {telemetry.risk.risk_level} {telemetry.risk.risk_level !== 'OFFLINE' ? `(${telemetry.risk.risk_score ?? 0}/100)` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-sans text-slate-600 shrink-0">
            <span className="text-slate-400 font-medium">TELEMETRY SOURCE:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
              isPiConnected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {isPiConnected ? 'PI LIVE HARDWARE' : 'HARDWARE OFFLINE'}
            </span>
          </div>
        </div>

        {/* Route Transition Progress Bar */}
        <div className="relative h-[2px] w-full bg-slate-200 overflow-hidden z-30">
          {isPageTransitioning && (
            <div
              key={`laser-${location.pathname}`}
              className="absolute inset-y-0 left-0 bg-blue-600 animate-route-laser shadow-xs"
            />
          )}
        </div>

        {/* Main Content Render Area */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#f8fafc] scrollbar-thin scrollbar-thumb-slate-300 text-slate-900 relative font-sans"
        >
          {/* Subtle Transit Flash on Route Change */}
          {isPageTransitioning && (
            <div
              key={`transit-glow-${location.pathname}`}
              className="absolute inset-x-0 top-0 h-24 pointer-events-none bg-gradient-to-b from-blue-500/5 to-transparent animate-transit-flash z-10"
            />
          )}

          {/* Animated Page Container (remounts and smoothly glides in on page change) */}
          <div
            key={location.pathname}
            className="max-w-[1920px] mx-auto min-h-full flex flex-col justify-between animate-page-enter"
          >
            <Outlet />

            {/* Enterprise Mining Safety Footer */}
            <footer className="mt-8 pt-4 pb-2 border-t border-slate-200 text-xs font-sans text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <strong className="text-slate-700">FOG-SAFE CAS™ Enterprise Suite:</strong>{' '}
                <span>ISO 21815-2 & EMESRT Level 9 Collision Avoidance Architecture</span>
              </div>
              <div className="text-slate-600 shrink-0 font-medium flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs">
                  NMDC Kirandul Pit 14
                </span>
                <span className="text-emerald-700 font-semibold">Live Telemetry</span>
              </div>
            </footer>
          </div>
        </main>

      </div>
    </div>
  );
};
