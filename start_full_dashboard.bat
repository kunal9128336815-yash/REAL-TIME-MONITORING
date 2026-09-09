@echo off
title FOG-SAFE System Launcher
color 0A

echo ================================================================
echo         FOG-SAFE SYSTEM LAUNCHER (BACKEND + DASHBOARD)
echo ================================================================
echo.
echo  Starting Backend Server and Frontend Dashboard on-demand...
echo.

:: Start Backend in a separate window
start "FOG-SAFE Backend Server" cmd /k "cd /d "%~dp0backend" && python run.py"

:: Start Frontend in current window
cd /d "%~dp0frontend"
npm run dev -- --host

