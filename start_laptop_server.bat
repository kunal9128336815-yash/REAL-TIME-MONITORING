@echo off
title FOG-SAFE Telemetry Server (ON-DEMAND)
color 0B

echo ================================================================
echo         FOG-SAFE MINING CAS - ON-DEMAND SERVER
echo ================================================================
echo.
echo  [+] Detecting Laptop Local IP Address...
for /f "tokens=4" %%a in ('route print ^| find " 0.0.0.0 " ^| find /v "0.0.0.0      0.0.0.0"') do (
    set LOCAL_IP=%%a
)

echo  [*] Server Host: 0.0.0.0 (Port 8000)
echo  [*] Local Laptop URL:  http://localhost:8000
echo  [*] Network / Pi URL:  http://%LOCAL_IP%:8000
echo  [*] Swagger Docs:      http://localhost:8000/docs
echo  [*] WebSocket Feed:    ws://localhost:8000/ws/telemetry
echo.
echo ================================================================
echo  STATUS: SERVER IS NOW [ON]
echo.
echo  TO TURN SERVER [OFF]:
echo    Just press Ctrl + C  OR  Simply CLOSE this window!
echo ================================================================
echo.

cd /d "%~dp0backend"
python run.py

echo.
echo ================================================================
echo  STATUS: SERVER IS NOW [OFF]
echo ================================================================
pause
