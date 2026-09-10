"""
FOG-SAFE: Laptop Camera YOLO Vision Runner
==============================================================================
Runs the custom trained mining YOLO model (`models/best.pt`) on your Laptop Webcam.
Provides:
  1. Real-time inference on laptop camera (cv2.VideoCapture(0, cv2.CAP_DSHOW))
  2. High-tech collision avoidance HUD (SAFE, CAUTION, CRITICAL)
  3. Live telemetry streaming to the Central Dashboard Backend (http://localhost:8000)
  4. Local MJPEG video streaming server on port 8080 (http://localhost:8080/video_feed)
==============================================================================
"""

import sys
import time
import json
import threading
from datetime import datetime
from pathlib import Path
import urllib.request
import urllib.error

import cv2
from ultralytics import YOLO

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
MODEL_PATH = Path(__file__).parent / "models" / "best.pt"
CAMERA_INDEX = 0
BACKEND_URL = "http://localhost:8000/api/telemetry"
INCIDENT_URL = "http://localhost:8000/api/incident"
MJPEG_PORT = 8080
TARGET_FPS = 30
CONFIDENCE_THRESHOLD = 0.40

# Class colors for bounding boxes
CLASS_COLORS = {
    "person": (0, 0, 255),      # Red (BGR)
    "dumper": (255, 200, 0),    # Cyan/Yellow
    "obstacle": (0, 165, 255),  # Orange
}
DEFAULT_COLOR = (0, 255, 0)     # Green

# Global variable for MJPEG streaming
current_encoded_frame = None
frame_lock = threading.Lock()


# ---------------------------------------------------------------------------
# MJPEG HTTP Server (allows viewing the annotated YOLO feed in any browser)
# ---------------------------------------------------------------------------
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

class StreamHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global current_encoded_frame, frame_lock
        if self.path == '/video_feed':
            self.send_response(200)
            self.send_header('Content-type', 'multipart/x-mixed-replace; boundary=frame')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            while True:
                with frame_lock:
                    if current_encoded_frame is None:
                        time.sleep(0.03)
                        continue
                    frame_bytes = current_encoded_frame
                try:
                    chunk = b'--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ' + str(len(frame_bytes)).encode() + b'\r\n\r\n' + frame_bytes + b'\r\n'
                    self.wfile.write(chunk)
                    time.sleep(0.033)
                except (BrokenPipeError, ConnectionResetError, Exception):
                    break
        else:
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            html = """
            <!DOCTYPE html>
            <html>
            <head>
              <title>FOG-SAFE Laptop YOLO Stream</title>
              <style>
                body { margin: 0; background: #0b1324; color: #38bdf8; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
                h1 { margin-bottom: 8px; }
                img { border: 2px solid #0284c7; border-radius: 8px; box-shadow: 0 0 30px rgba(2,132,199,0.3); max-width: 90vw; }
              </style>
            </head>
            <body>
              <h1>[FOG-SAFE] LAPTOP WEBCAM YOLO LIVE STREAM</h1>
              <p>Direct live feed with real-time neural network inference</p>
              <img src="/video_feed" />
            </body>
            </html>
            """
            self.wfile.write(html.encode('utf-8'))

    def log_message(self, format, *args):
        pass  # Suppress HTTP access logs in console


def start_mjpeg_server():
    try:
        server = ThreadingHTTPServer(('0.0.0.0', MJPEG_PORT), StreamHandler)
        server.serve_forever()
    except Exception as e:
        print(f"[MJPEG] Stream server error: {e}")


# ---------------------------------------------------------------------------
# Telemetry PUSHER (Sends YOLO inference to Central Dashboard)
# ---------------------------------------------------------------------------
def push_telemetry_async(payload):
    def _send():
        try:
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(
                BACKEND_URL,
                data=data,
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                pass
        except Exception:
            pass  # Non-blocking, continue edge loop
    threading.Thread(target=_send, daemon=True).start()


def push_incident_async(incident_payload):
    def _send():
        try:
            data = json.dumps(incident_payload).encode('utf-8')
            req = urllib.request.Request(
                INCIDENT_URL,
                data=data,
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                pass
        except Exception:
            pass
    threading.Thread(target=_send, daemon=True).start()


# ---------------------------------------------------------------------------
# Main Laptop YOLO Loop
# ---------------------------------------------------------------------------
def main():
    global current_encoded_frame, frame_lock

    print("=" * 70)
    print("🚜 FOG-SAFE: LAPTOP WEBCAM YOLO EDGE VISION RUNNER")
    print(f"📦 Model Weights: {MODEL_PATH}")
    print(f"📷 Camera Device: Laptop Webcam (Index {CAMERA_INDEX})")
    print(f"🌐 Central Backend: {BACKEND_URL}")
    print(f"📡 Local Stream:   http://localhost:{MJPEG_PORT}/video_feed")
    print("=" * 70)

    if not MODEL_PATH.exists():
        print(f"❌ ERROR: Model not found at {MODEL_PATH}")
        sys.exit(1)

    print("⏳ Loading YOLO Neural Network weights into memory...")
    try:
        model = YOLO(str(MODEL_PATH))
        print(f"✅ YOLO Model loaded! Classes: {model.names}")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        sys.exit(1)

    # Start background MJPEG stream server
    stream_thread = threading.Thread(target=start_mjpeg_server, daemon=True)
    stream_thread.start()
    print(f"🚀 MJPEG Stream Server active on http://localhost:{MJPEG_PORT}/video_feed")

    # Open Camera with DSHOW for Windows stability
    print("⏳ Opening Laptop Webcam...")
    cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
    if not cap.isOpened():
        print("⚠️ DSHOW failed, trying default DirectShow/MSMF...")
        cap = cv2.VideoCapture(CAMERA_INDEX)

    if not cap.isOpened():
        print("❌ Could not open laptop webcam. Please check permissions or close other apps using the camera.")
        sys.exit(1)

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, TARGET_FPS)

    print("✅ Laptop camera online!")
    print("✨ Press 'q' or 'ESC' in the video window to stop.")
    print("=" * 70)

    last_telemetry_time = 0
    fps_counter = 0
    fps_start_time = time.time()
    current_fps = 0.0

    last_critical_alert_time = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret or frame is None:
                print("⚠️ Frame dropped from laptop camera, retrying...")
                time.sleep(0.05)
                continue

            h, w, _ = frame.shape
            inference_start = time.time()

            # Run YOLO Inference
            results = model.predict(source=frame, conf=CONFIDENCE_THRESHOLD, verbose=False)
            inference_ms = (time.time() - inference_start) * 1000.0

            detections_list = []
            min_distance = 999.0
            critical_detected = False

            # Parse Bounding Boxes
            if len(results) > 0 and results[0].boxes is not None:
                boxes = results[0].boxes
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    conf = float(box.conf[0].item())
                    cls_name = model.names.get(cls_id, f"class_{cls_id}")

                    xyxy = box.xyxy[0].tolist()
                    x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])
                    bw, bh = x2 - x1, y2 - y1

                    # Normalized coordinates [x, y, w, h] for web dashboard
                    norm_bbox = [
                        round(x1 / w, 4),
                        round(y1 / h, 4),
                        round(bw / w, 4),
                        round(bh / h, 4)
                    ]

                    # Distance estimation using bounding box height
                    # Standard person height ~1.7m; standard dumper height ~4m
                    if cls_name == "person":
                        ref_h = 420.0
                    elif cls_name == "dumper":
                        ref_h = 480.0
                    else:
                        ref_h = 350.0

                    est_dist = max(0.4, round((ref_h / max(bh, 15)) * 0.9, 1))
                    if est_dist < min_distance:
                        min_distance = est_dist

                    if est_dist < 2.0:
                        critical_detected = True

                    detections_list.append({
                        "class_name": cls_name,
                        "confidence": round(conf, 2),
                        "bbox": norm_bbox,
                        "distance_est": est_dist,
                    })

                    # Draw Bounding Box on OpenCV Preview Frame
                    color = CLASS_COLORS.get(cls_name.lower(), DEFAULT_COLOR)
                    if est_dist < 2.0:
                        color = (0, 0, 255)  # Flash Red if critical

                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

                    # Label tag
                    tag = f"{cls_name.upper()} {int(conf*100)}% | {est_dist:.1f}m"
                    (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                    cv2.rectangle(frame, (x1, y1 - 22), (x1 + tw + 6, y1), color, -1)
                    cv2.putText(frame, tag, (x1 + 3, y1 - 6),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

            # Determine Safety Level
            if critical_detected or (detections_list and min_distance < 2.0):
                alert_level = "CRITICAL"
                banner_color = (0, 0, 255)   # Red
                banner_text = "STATUS: CRITICAL (STOP VEHICLE!)"
            elif detections_list and min_distance < 5.0:
                alert_level = "CAUTION"
                banner_color = (0, 165, 255) # Orange
                banner_text = "STATUS: CAUTION (OBSTACLE NEARBY)"
            else:
                alert_level = "SAFE"
                banner_color = (0, 200, 0)   # Green
                banner_text = "STATUS: SAFE (PATH CLEAR)"

            # Draw HUD Overlay on Frame
            # Top Banner
            cv2.rectangle(frame, (0, 0), (w, 38), (15, 15, 25), -1)
            cv2.line(frame, (0, 38), (w, 38), banner_color, 2)
            cv2.putText(frame, banner_text, (12, 25),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, banner_color, 2, cv2.LINE_AA)

            # Status Stats (Right side)
            fps_counter += 1
            if time.time() - fps_start_time >= 1.0:
                current_fps = fps_counter / (time.time() - fps_start_time)
                fps_counter = 0
                fps_start_time = time.time()

            stats_str = f"FPS: {current_fps:.1f} | Latency: {inference_ms:.1f}ms | Targets: {len(detections_list)}"
            cv2.putText(frame, stats_str, (w - 380, 25),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (220, 220, 220), 1, cv2.LINE_AA)

            # Bottom Status Bar
            cv2.rectangle(frame, (0, h - 28), (w, h), (15, 15, 25), -1)
            bot_text = f"LAPTOP CAM 01 • YOLOv11 Mining Model • Synced to Central Dashboard: {BACKEND_URL}"
            cv2.putText(frame, bot_text, (10, h - 9),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.42, (180, 180, 180), 1, cv2.LINE_AA)

            # Encode frame for MJPEG stream
            _, encoded_jpeg = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 75])
            with frame_lock:
                current_encoded_frame = encoded_jpeg.tobytes()

            # Push live telemetry to Central Dashboard Backend every 150ms
            now = time.time()
            if now - last_telemetry_time >= 0.15:
                last_telemetry_time = now
                telemetry_packet = {
                    "vehicle_id": "LAPTOP-CAM-01",
                    "timestamp": datetime.utcnow().isoformat(),
                    "alert_level": alert_level,
                    "detections": detections_list,
                    "target_count": len(detections_list),
                    "closest_distance_m": min_distance if min_distance < 900 else None,
                    "inference_time_ms": round(inference_ms, 1),
                    "camera_fps": round(current_fps, 1),
                }
                push_telemetry_async(telemetry_packet)

                # Push incident report if critical collision event triggered
                if alert_level == "CRITICAL" and (now - last_critical_alert_time > 4.0):
                    last_critical_alert_time = now
                    incident_payload = {
                        "timestamp": datetime.utcnow().isoformat(),
                        "vehicle_id": "LAPTOP-CAM-01",
                        "severity": "CRITICAL",
                        "distance": min_distance,
                        "obstacle_type": detections_list[0]["class_name"] if detections_list else "obstacle",
                        "message": f"CRITICAL: {detections_list[0]['class_name'].upper()} detected at {min_distance}m by Laptop Camera YOLO!"
                    }
                    push_incident_async(incident_payload)

            # Display GUI window
            cv2.imshow("FOG-SAFE - Laptop Camera YOLO Live Inference", frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == 27:
                print("\n🛑 Quitting Laptop YOLO Runner...")
                break

    except KeyboardInterrupt:
        print("\n🛑 Interrupted by user.")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("✅ Camera released. FOG-SAFE YOLO runner stopped cleanly.")


if __name__ == "__main__":
    main()


