import os
import sqlite3
import json
import uuid
from datetime import datetime, date, timezone
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings

class DatabaseService:
    def __init__(self):
        self.use_supabase = bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY)
        self.sqlite_path = os.path.join(settings.DATA_DIR, "flora_local.db")
        os.makedirs(settings.DATA_DIR, exist_ok=True)
        self._init_sqlite()

    def _init_sqlite(self):
        """Initializes SQLite schema matching the PostgreSQL structure for testing and local mode."""
        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS plants (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                species TEXT NOT NULL,
                variety TEXT NOT NULL,
                planting_date TEXT NOT NULL,
                growing_location TEXT NOT NULL,
                container_type TEXT NOT NULL,
                sunlight TEXT NOT NULL,
                health_status TEXT NOT NULL,
                notes TEXT,
                image_url TEXT,
                last_watered TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                plant_id TEXT,
                image_url TEXT NOT NULL,
                condition_code TEXT NOT NULL,
                condition_name TEXT NOT NULL,
                confidence REAL NOT NULL,
                is_inconclusive INTEGER NOT NULL,
                top_predictions TEXT NOT NULL,
                notes TEXT,
                created_at TEXT NOT NULL
            )
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS watering_logs (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                plant_id TEXT NOT NULL,
                amount_ml INTEGER NOT NULL,
                soil_condition_before TEXT NOT NULL,
                notes TEXT,
                logged_at TEXT NOT NULL
            )
        """)
        
        conn.commit()
        conn.close()

    # -------------------------------------------------------------------------
    # PLANTS
    # -------------------------------------------------------------------------
    def get_plants_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM plants WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        rows = [dict(row) for row in cur.fetchall()]
        conn.close()
        return rows

    def get_plant_by_id(self, plant_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM plants WHERE id = ? AND user_id = ?", (plant_id, user_id))
        row = cur.fetchone()
        conn.close()
        return dict(row) if row else None

    def create_plant(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        plant_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        planting_date_str = str(data.get("planting_date") or date.today())
        
        record = {
            "id": plant_id,
            "user_id": user_id,
            "name": data["name"],
            "species": data.get("species", "Solanum lycopersicum"),
            "variety": data.get("variety", "Cherry Tomato (Super Sweet 100)"),
            "planting_date": planting_date_str,
            "growing_location": data.get("growing_location", "balcony"),
            "container_type": data.get("container_type", "terracotta_pot"),
            "sunlight": data.get("sunlight", "full_sun"),
            "health_status": "unscanned",
            "notes": data.get("notes", ""),
            "image_url": data.get("image_url", "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80"),
            "last_watered": None,
            "created_at": now,
            "updated_at": now
        }

        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO plants (
                id, user_id, name, species, variety, planting_date,
                growing_location, container_type, sunlight, health_status,
                notes, image_url, last_watered, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record["id"], record["user_id"], record["name"], record["species"], record["variety"],
            record["planting_date"], record["growing_location"], record["container_type"],
            record["sunlight"], record["health_status"], record["notes"], record["image_url"],
            record["last_watered"], record["created_at"], record["updated_at"]
        ))
        conn.commit()
        conn.close()
        return record

    def update_plant(self, plant_id: str, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        existing = self.get_plant_by_id(plant_id, user_id)
        if not existing:
            return None

        now = datetime.now(timezone.utc).isoformat()
        fields = []
        values = []
        for k, v in updates.items():
            if v is not None and k in existing and k not in ["id", "user_id", "created_at"]:
                fields.append(f"{k} = ?")
                values.append(str(v) if isinstance(v, (date, datetime)) else v)

        if not fields:
            return existing

        fields.append("updated_at = ?")
        values.append(now)
        values.extend([plant_id, user_id])

        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        cur.execute(f"UPDATE plants SET {', '.join(fields)} WHERE id = ? AND user_id = ?", values)
        conn.commit()
        conn.close()

        return self.get_plant_by_id(plant_id, user_id)

    def delete_plant(self, plant_id: str, user_id: str) -> bool:
        existing = self.get_plant_by_id(plant_id, user_id)
        if not existing:
            return False

        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        cur.execute("DELETE FROM plants WHERE id = ? AND user_id = ?", (plant_id, user_id))
        cur.execute("DELETE FROM scans WHERE plant_id = ? AND user_id = ?", (plant_id, user_id))
        cur.execute("DELETE FROM watering_logs WHERE plant_id = ? AND user_id = ?", (plant_id, user_id))
        conn.commit()
        conn.close()
        return True

    # -------------------------------------------------------------------------
    # SCANS
    # -------------------------------------------------------------------------
    def create_scan(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        scan_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        record = {
            "id": scan_id,
            "user_id": user_id,
            "plant_id": data.get("plant_id"),
            "image_url": data["image_url"],
            "condition_code": data["condition_code"],
            "condition_name": data["condition_name"],
            "confidence": float(data["confidence"]),
            "is_inconclusive": 1 if data.get("is_inconclusive") else 0,
            "top_predictions": json.dumps(data.get("top_predictions", [])),
            "notes": data.get("notes", ""),
            "created_at": now
        }

        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO scans (
                id, user_id, plant_id, image_url, condition_code,
                condition_name, confidence, is_inconclusive, top_predictions,
                notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record["id"], record["user_id"], record["plant_id"], record["image_url"],
            record["condition_code"], record["condition_name"], record["confidence"],
            record["is_inconclusive"], record["top_predictions"], record["notes"], record["created_at"]
        ))
        conn.commit()
        conn.close()

        # Update plant health status if linked
        plant_id = data.get("plant_id")
        if plant_id:
            new_health = "healthy" if data["condition_code"] == "tomato_healthy" and not data.get("is_inconclusive") else "attention_needed"
            self.update_plant(plant_id, user_id, {"health_status": new_health})

        record["is_inconclusive"] = bool(record["is_inconclusive"])
        record["top_predictions"] = data.get("top_predictions", [])
        return record

    def get_scans_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM scans WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        rows = []
        for r in cur.fetchall():
            d = dict(r)
            d["is_inconclusive"] = bool(d["is_inconclusive"])
            try:
                d["top_predictions"] = json.loads(d["top_predictions"])
            except Exception:
                d["top_predictions"] = []
            rows.append(d)
        conn.close()
        return rows

    def get_scan_by_id(self, scan_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM scans WHERE id = ? AND user_id = ?", (scan_id, user_id))
        row = cur.fetchone()
        conn.close()
        if not row:
            return None
        d = dict(row)
        d["is_inconclusive"] = bool(d["is_inconclusive"])
        try:
            d["top_predictions"] = json.loads(d["top_predictions"])
        except Exception:
            d["top_predictions"] = []
        return d

    # -------------------------------------------------------------------------
    # WATERING LOGS
    # -------------------------------------------------------------------------
    def create_watering_log(self, user_id: str, plant_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        log_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        record = {
            "id": log_id,
            "user_id": user_id,
            "plant_id": plant_id,
            "amount_ml": int(data["amount_ml"]),
            "soil_condition_before": data.get("soil_condition_before", "dry"),
            "notes": data.get("notes", ""),
            "logged_at": now
        }

        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO watering_logs (
                id, user_id, plant_id, amount_ml, soil_condition_before, notes, logged_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            record["id"], record["user_id"], record["plant_id"], record["amount_ml"],
            record["soil_condition_before"], record["notes"], record["logged_at"]
        ))
        conn.commit()
        conn.close()

        # Update plant last_watered
        self.update_plant(plant_id, user_id, {"last_watered": now})

        return record

    def get_watering_logs_for_plant(self, plant_id: str, user_id: str) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM watering_logs WHERE plant_id = ? AND user_id = ? ORDER BY logged_at DESC", (plant_id, user_id))
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return rows

db_service = DatabaseService()
