import { TelemetryState } from '../types';

type TelemetryCallback = (data: TelemetryState) => void;
type ConnectionCallback = (connected: boolean) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onDataCallbacks: TelemetryCallback[] = [];
  private onConnectionCallbacks: ConnectionCallback[] = [];
  private reconnectTimer: number | null = null;
  private isConnected: boolean = false;

  constructor() {
    const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
    this.url = `ws://${host}:8000/ws/telemetry`;
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.notifyConnection(true);
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const telemetry: TelemetryState = JSON.parse(event.data);
          this.notifyData(telemetry);
        } catch (e) {
          console.error("Failed to parse websocket telemetry", e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notifyConnection(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
        this.notifyConnection(false);
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch {
      this.isConnected = false;
      this.notifyConnection(false);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public send(msg: Record<string, unknown>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  public subscribeData(cb: TelemetryCallback): () => void {
    this.onDataCallbacks.push(cb);
    return () => {
      this.onDataCallbacks = this.onDataCallbacks.filter(c => c !== cb);
    };
  }

  public subscribeConnection(cb: ConnectionCallback): () => void {
    this.onConnectionCallbacks.push(cb);
    cb(this.isConnected);
    return () => {
      this.onConnectionCallbacks = this.onConnectionCallbacks.filter(c => c !== cb);
    };
  }

  private notifyData(data: TelemetryState) {
    this.onDataCallbacks.forEach(cb => cb(data));
  }

  private notifyConnection(status: boolean) {
    this.onConnectionCallbacks.forEach(cb => cb(status));
  }
}

export const wsClient = new WebSocketClient();
