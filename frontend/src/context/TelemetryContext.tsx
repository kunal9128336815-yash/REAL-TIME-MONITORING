import React, { createContext, useContext } from 'react';
import { useTelemetry } from '../hooks/useTelemetry';

type TelemetryContextType = ReturnType<typeof useTelemetry>;

const TelemetryContext = createContext<TelemetryContextType | null>(null);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const telemetryData = useTelemetry();

  return (
    <TelemetryContext.Provider value={telemetryData}>
      {children}
    </TelemetryContext.Provider>
  );
};

export function useTelemetryContext(): TelemetryContextType {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetryContext must be used within a TelemetryProvider');
  }
  return context;
}
