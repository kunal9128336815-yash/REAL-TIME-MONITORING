#!/bin/bash
# ==============================================================================
# FOG-SAFE 24/7 Raspberry Pi Hosting Installer
# Automates: Python VirtualEnv, dependencies, and systemd 24/7 auto-boot service
# ==============================================================================

set -e

SERVICE_NAME="fogsafe-backend"
CURRENT_USER=$(whoami)
APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VENV_DIR="$APP_DIR/venv"

echo "=========================================================="
echo "  Setting up FOG-SAFE Backend 24/7 Service on Raspberry Pi"
echo "  User: $CURRENT_USER"
echo "  Backend Directory: $APP_DIR"
echo "=========================================================="

# 1. Update system packages and ensure python3-venv & pip exist
echo "[1/5] Checking Python3 and virtualenv tools..."
sudo apt-get update -y
sudo apt-get install -y python3-pip python3-venv

# 2. Setup virtual environment
echo "[2/5] Creating Python virtual environment..."
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
fi

# 3. Install requirements
echo "[3/5] Installing backend dependencies..."
"$VENV_DIR/bin/pip" install --upgrade pip
"$VENV_DIR/bin/pip" install -r "$APP_DIR/requirements.txt"

# 4. Generate systemd service file tailored to the current user & path
echo "[4/5] Configuring systemd service..."
SERVICE_PATH="/etc/systemd/system/${SERVICE_NAME}.service"

sudo bash -c "cat <<EOF > $SERVICE_PATH
[Unit]
Description=FOG-SAFE Mining CAS Telemetry FastAPI Server
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$APP_DIR
ExecStart=$VENV_DIR/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3
KillMode=process
StandardOutput=journal
StandardError=journal
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF"

# 5. Reload and enable service
echo "[5/5] Enabling and starting $SERVICE_NAME service..."
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"

echo ""
echo "=========================================================="
echo "  SUCCESS! FOG-SAFE Backend is now running 24/7 on your Pi!"
echo "=========================================================="
echo "  Status check:  sudo systemctl status $SERVICE_NAME"
echo "  View live logs: journalctl -u $SERVICE_NAME -f"
echo "  Restart server: sudo systemctl restart $SERVICE_NAME"
echo "  Stop server:    sudo systemctl stop $SERVICE_NAME"
echo ""
PI_IP=$(hostname -I | awk '{print $1}')
echo "  Your Pi IP Address: http://$PI_IP:8000"
echo "  Swagger API Docs:   http://$PI_IP:8000/docs"
echo "  WebSocket Feed:     ws://$PI_IP:8000/ws/telemetry"
echo "=========================================================="
