import { useState, useEffect, useCallback, useRef } from 'react';
import { TelemetryState, ScenarioType, HistoricalDataPoint, AlertRecord } from '../types';
import { clientSimulator } from '../services/simulator';
import { wsClient } from '../services/websocket';
import { setBackendScenario, controlBackendSimulation, startBackendGuidedDemo, setOperatingMode, fetchAlerts } from '../services/api';

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryState>(() => clientSimulator.tick());
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [operatingMode, setOperatingModeState] = useState<'DEMO_MODE' | 'LIVE_HARDWARE'>('DEMO_MODE');
  const [history, setHistory] = useState<HistoricalDataPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);

  const lastRiskRef = useRef<string>('SAFE');
  const lastScenarioRef = useRef<string>('NORMAL_OPERATION');

  // Connect WebSocket on mount
  useEffect(() => {
    wsClient.connect();

    const unsubConn = wsClient.subscribeConnection((connected) => {
      setBackendConnected(connected);
    });

    const unsubData = wsClient.subscribeData((data) => {
      setTelemetry(data);
      recordHistory(data);
    });

    // Initial alerts
    fetchAlerts().then(setAlerts).catch(() => {});

    return () => {
      unsubConn();
      unsubData();
    };
  }, []);

  // Standalone client loop (runs when backend is disconnected or in standalone mode)
  useEffect(() => {
    if (backendConnected) return;

    const interval = window.setInterval(() => {
      const nextState = clientSimulator.tick();
      setTelemetry(nextState);
      recordHistory(nextState);

      // Check if risk transitioned to add dynamic alert
      if (nextState.risk.risk_level !== lastRiskRef.current) {
        if (nextState.risk.risk_level === 'CRITICAL' || nextState.risk.risk_level === 'WARNING') {
          const newAlert: AlertRecord = {
            id: Date.now(),
            timestamp: nextState.timestamp,
            severity: nextState.risk.risk_level,
            message: nextState.risk.hazard_summary,
            category: 'COLLISION_RISK',
            sms_sent: nextState.risk.emergency_sms_required,
            sms_details: nextState.risk.emergency_sms_required 
              ? `4G SMS dispatched via ${nextState.gsm.carrier} to Mine Safety Control` 
              : undefined,
          };
          setAlerts(prev => [newAlert, ...prev.slice(0, 24)]);
        }
        lastRiskRef.current = nextState.risk.risk_level;
      }
    }, 400);

    return () => clearInterval(interval);
  }, [backendConnected]);

  const recordHistory = useCallback((state: TelemetryState) => {
    const riskMap: Record<string, number> = {
      SAFE: 0,
      CAUTION: 1,
      WARNING: 2,
      CRITICAL: 3,
    };

    const point: HistoricalDataPoint = {
      time: state.timestamp,
      speed: state.gps.speed_kmh,
      ttc: state.risk.ttc_seconds ?? 10.0,
      visibility: state.visibility.index_percent,
      front_distance: state.ultrasonic.front,
      risk_numeric: riskMap[state.risk.risk_level] ?? 0,
    };

    setHistory((prev) => {
      const updated = [...prev, point];
      return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
    });
  }, []);

  const triggerScenario = useCallback((scenario: ScenarioType) => {
    clientSimulator.setScenario(scenario);
    lastScenarioRef.current = scenario;
    if (backendConnected) {
      setBackendScenario(scenario);
      wsClient.send({ type: 'SET_SCENARIO', scenario });
    }
  }, [backendConnected]);

  const triggerGuidedDemo = useCallback(() => {
    clientSimulator.startGuidedDemo();
    if (backendConnected) {
      startBackendGuidedDemo();
      wsClient.send({ type: 'START_GUIDED_DEMO' });
    }
  }, [backendConnected]);

  const handleControl = useCallback((action: 'start' | 'pause' | 'reset', speed: number = 1.0) => {
    if (action === 'start') {
      clientSimulator.setRunning(true);
    } else if (action === 'pause') {
      clientSimulator.setRunning(false);
    } else if (action === 'reset') {
      clientSimulator.reset();
    }
    clientSimulator.setSimSpeed(speed);

    if (backendConnected) {
      controlBackendSimulation(action, speed);
    }
  }, [backendConnected]);

  const toggleOperatingMode = useCallback((mode: 'DEMO_MODE' | 'LIVE_HARDWARE') => {
    setOperatingModeState(mode);
    if (backendConnected) {
      setOperatingMode(mode);
    }
  }, [backendConnected]);

  const setManualVisibility = useCallback((vis: number) => {
    clientSimulator.setManualVisibility(vis);
  }, []);

  const clearManualVisibility = useCallback(() => {
    clientSimulator.clearManualVisibility();
  }, []);

  const pauseGuidedDemo = useCallback(() => {
    clientSimulator.pauseGuidedDemo();
  }, []);

  const resumeGuidedDemo = useCallback(() => {
    clientSimulator.resumeGuidedDemo();
  }, []);

  const skipGuidedDemoPhase = useCallback(() => {
    clientSimulator.skipGuidedDemoPhase();
  }, []);

  const restartGuidedDemo = useCallback(() => {
    clientSimulator.restartGuidedDemo();
  }, []);

  return {
    telemetry,
    backendConnected,
    operatingMode,
    history,
    alerts,
    triggerScenario,
    triggerGuidedDemo,
    handleControl,
    toggleOperatingMode,
    setManualVisibility,
    clearManualVisibility,
    pauseGuidedDemo,
    resumeGuidedDemo,
    skipGuidedDemoPhase,
    restartGuidedDemo,
  };
}
