import { useState, useEffect, useCallback, useRef } from 'react';
import { TelemetryState, ScenarioType, HistoricalDataPoint, AlertRecord } from '../types';
import { clientSimulator } from '../services/simulator';
import { wsClient } from '../services/websocket';
import { piHardwareClient, PiConnectionStatus } from '../services/piHardwareClient';
import { setBackendScenario, controlBackendSimulation, startBackendGuidedDemo, setOperatingMode, fetchAlerts } from '../services/api';

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryState>(() => clientSimulator.tick());
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [piStatus, setPiStatus] = useState<PiConnectionStatus>(() => piHardwareClient.getStatus());
  const [operatingMode, setOperatingModeState] = useState<'DEMO_MODE' | 'LIVE_HARDWARE'>('DEMO_MODE');
  const [history, setHistory] = useState<HistoricalDataPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);

  const lastRiskRef = useRef<string>('SAFE');
  const lastScenarioRef = useRef<string>('NORMAL_OPERATION');
  const isPiActiveRef = useRef<boolean>(false);

  // 1. Connect Raspberry Pi Hardware Poller on Mount (http://192.168.137.214:5000/data)
  useEffect(() => {
    piHardwareClient.start();

    const unsubPi = piHardwareClient.subscribe((connected, piTelemetry) => {
      isPiActiveRef.current = connected;
      setPiStatus(piHardwareClient.getStatus());

      if (connected && piTelemetry) {
        setTelemetry(piTelemetry);
        recordHistory(piTelemetry);

        // Check if risk transitioned to add dynamic alert
        if (piTelemetry.risk.risk_level !== lastRiskRef.current) {
          if (piTelemetry.risk.risk_level === 'CRITICAL' || piTelemetry.risk.risk_level === 'WARNING') {
            const newAlert: AlertRecord = {
              id: Date.now(),
              timestamp: piTelemetry.timestamp,
              severity: piTelemetry.risk.risk_level,
              message: piTelemetry.risk.hazard_summary,
              category: 'COLLISION_RISK',
              sms_sent: piTelemetry.risk.emergency_sms_required,
              sms_details: piTelemetry.risk.emergency_sms_required
                ? `4G SMS dispatched via ${piTelemetry.gsm.carrier} to Mine Safety Control`
                : undefined,
            };
            setAlerts((prev) => [newAlert, ...prev.slice(0, 24)]);
          }
          lastRiskRef.current = piTelemetry.risk.risk_level;
        }
      }
    });

    return () => {
      unsubPi();
      piHardwareClient.stop();
    };
  }, []);

  // 2. Connect WebSocket to FastAPI backend on mount
  useEffect(() => {
    wsClient.connect();

    const unsubConn = wsClient.subscribeConnection((connected) => {
      setBackendConnected(connected);
    });

    const unsubData = wsClient.subscribeData((data) => {
      // If direct Raspberry Pi hardware is not streaming, use backend WebSocket
      if (!isPiActiveRef.current) {
        setTelemetry(data);
        recordHistory(data);
      }
    });

    // Initial alerts
    fetchAlerts().then(setAlerts).catch(() => {});

    return () => {
      unsubConn();
      unsubData();
    };
  }, []);

  // 3. Standalone client loop (runs ONLY when neither Pi nor FastAPI backend is connected)
  useEffect(() => {
    if (backendConnected || piStatus.connected) return;

    const interval = window.setInterval(() => {
      if (isPiActiveRef.current) return;

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
          setAlerts((prev) => [newAlert, ...prev.slice(0, 24)]);
        }
        lastRiskRef.current = nextState.risk.risk_level;
      }
    }, 400);

    return () => clearInterval(interval);
  }, [backendConnected, piStatus.connected]);

  // Keep a running buffer of the last 60 seconds (at 1-second cadence)
  const recordHistory = (state: TelemetryState) => {
    const point: HistoricalDataPoint = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      speed: state.gps.speed_kmh,
      front_distance: state.ultrasonic.front,
      ttc: state.risk.ttc_seconds ?? 0,
      visibility: state.visibility.index_percent,
      risk_numeric:
        state.risk.risk_level === 'CRITICAL'
          ? 3
          : state.risk.risk_level === 'WARNING'
          ? 2
          : state.risk.risk_level === 'CAUTION'
          ? 1
          : 0,
    };

    setHistory((prev) => {
      const updated = [...prev, point];
      return updated.slice(-60);
    });
  };

  const triggerScenario = useCallback(
    async (scenario: ScenarioType) => {
      lastScenarioRef.current = scenario;
      if (backendConnected) {
        await setBackendScenario(scenario);
      } else {
        clientSimulator.setScenario(scenario);
      }
    },
    [backendConnected]
  );

  const triggerGuidedDemo = useCallback(async () => {
    if (backendConnected) {
      await startBackendGuidedDemo();
    } else {
      clientSimulator.startGuidedDemo();
    }
  }, [backendConnected]);

  const handleControl = useCallback(
    async (action: string, speed?: number) => {
      if (backendConnected) {
        await controlBackendSimulation(action, speed);
      } else {
        clientSimulator.applyControl(action, speed);
      }
    },
    [backendConnected]
  );

  const toggleOperatingMode = useCallback(async (targetMode?: 'DEMO_MODE' | 'LIVE_HARDWARE') => {
    const nextMode = targetMode || (operatingMode === 'DEMO_MODE' ? 'LIVE_HARDWARE' : 'DEMO_MODE');
    setOperatingModeState(nextMode);
    if (backendConnected) {
      await setOperatingMode(nextMode);
    }
  }, [operatingMode, backendConnected]);

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

  const setPiUrl = useCallback((url: string) => {
    piHardwareClient.setUrl(url);
    setPiStatus(piHardwareClient.getStatus());
  }, []);

  const checkPiConnection = useCallback(async () => {
    const ok = await piHardwareClient.checkConnection();
    setPiStatus(piHardwareClient.getStatus());
    return ok;
  }, []);

  return {
    telemetry,
    backendConnected: backendConnected || piStatus.connected,
    isPiConnected: piStatus.connected,
    piStatus,
    piUrl: piStatus.url,
    setPiUrl,
    checkPiConnection,
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
