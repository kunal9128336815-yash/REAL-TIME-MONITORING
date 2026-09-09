import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "mining_telemetry.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Table for alerts log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        severity TEXT NOT NULL,
        message TEXT NOT NULL,
        category TEXT NOT NULL,
        sms_sent INTEGER DEFAULT 0,
        sms_details TEXT
    )
    """)
    
    # Table for telemetry history
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS telemetry_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        vehicle_id TEXT NOT NULL,
        speed REAL,
        ttc REAL,
        visibility REAL,
        risk_level TEXT,
        front_dist REAL,
        rear_dist REAL,
        left_dist REAL,
        right_dist REAL,
        hazard_detected TEXT
    )
    """)
    
    conn.commit()
    conn.close()

def log_alert(severity: str, message: str, category: str, sms_sent: bool = False, sms_details: str = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    ts = datetime.utcnow().strftime("%H:%M:%S")
    cursor.execute("""
    INSERT INTO alerts (timestamp, severity, message, category, sms_sent, sms_details)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (ts, severity, message, category, 1 if sms_sent else 0, sms_details))
    conn.commit()
    conn.close()

def get_recent_alerts(limit: int = 50):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
