@echo off
title FOG-SAFE - Laptop Camera YOLO Live Inference
color 0A

echo ================================================================
echo    FOG-SAFE MINING CAS - LAPTOP WEBCAM YOLO VISION SYSTEM
echo ================================================================
echo.
echo  [*] Loading YOLO Model: models\best.pt
echo  [*] Camera Source: Laptop Optical Webcam (Index 0)
echo  [*] Telemetry Target: http://localhost:8000/api/telemetry
echo  [*] Web Stream Feed: http://localhost:8080/video_feed
echo.
echo  To STOP the camera at any time:
echo    - Press 'q' or 'ESC' on the camera window
echo    - Or press Ctrl+C in this console window
echo ================================================================
echo.

cd /d "%~dp0"
python run_laptop_yolo.py

echo.
echo ================================================================
echo  YOLO Runner has stopped.
echo ================================================================
pause
