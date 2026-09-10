@echo off
title FOG-SAFE System Launcher
color 0A

echo ================================================================
echo         FOG-SAFE SYSTEM LAUNCHER (BACKEND + DASHBOARD)
echo ================================================================
echo.
echo  Starting Unified Backend (Port 8000) and Frontend Dev Server (Port 5173)...
echo.
echo  [*] Unified Host (UI + API): http://localhost:8000
echo  [*] Vite Dev Dashboard:      http://localhost:5173
echo  [*] Backend Swagger API:     http://localhost:8000/docs
echo  [*] WebSocket Telemetry:     ws://localhost:8000/ws/telemetry
echo ================================================================
echo.

:: Start Backend in a separate window
start "FOG-SAFE Backend Server (Port 8000)" cmd /k "cd /d "%~dp0backend" && python run.py"

:: Start Frontend in current window
cd /d "%~dp0frontend"
call npm.cmd run dev -- --host
