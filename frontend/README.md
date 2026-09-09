# FOG-SAFE Frontend Dashboard

Real-time React + TypeScript + Vite Command Center for Mining Dumper Collision Avoidance.

---

## 🌐 Network Host & Port Reference (Host IDs)

| Service | Environment | Host Address / URL | Protocol | Role / Description |
|---|---|---|---|---|
| **Frontend Web App (Live Cloud)** | **Worldwide / Any Phone** | **`https://kunal9128336815-yash.github.io/REAL-TIME-MONITORING/`** | HTTPS | Public live dashboard accessible anywhere |
| **Frontend Web App** | Localhost | `http://localhost:5173` | HTTP | Local web interface |
| **Frontend Web App** | Network / LAN | `http://<LAPTOP_IP>:5173` | HTTP | Accessible across Wi-Fi / Hotspot (`--host`) |
| **Backend Target** | Localhost | `http://localhost:8000/api` | HTTP REST | FastAPI Telemetry & Fleet API |
| **Backend Target** | Network / LAN | `http://<LAPTOP_IP>:8000/api` | HTTP REST | Target API endpoint for LAN devices |
| **WebSocket Stream** | Localhost | `ws://localhost:8000/ws/telemetry` | WebSocket | 20Hz real-time telemetry feed |
| **WebSocket Stream** | Network / LAN | `ws://<LAPTOP_IP>:8000/ws/telemetry` | WebSocket | Remote WebSocket feed |

> The frontend dynamically connects to `window.location.hostname:8000` by default (see `src/services/api.ts` and `src/services/websocket.ts`).

---

## 🚀 Running the Frontend

### Development Server:
```bash
npm run dev
```

### Exposing to Local Network (LAN):
```bash
npm run dev -- --host
```

### Production Build:
```bash
npm run build
npm run preview
```
