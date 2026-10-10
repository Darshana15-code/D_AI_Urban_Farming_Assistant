# FloraPulse AI — Urban Farming & Plant Health Assistant

An intelligent, full-stack web application designed for balcony, terrace, and home urban gardeners. FloraPulse AI delivers calibrated tomato leaf disease diagnostics, context-aware watering schedules powered by Open-Meteo microclimate forecasts, and structured agricultural guidance.

---

## 🌿 System Overview & Architecture

FloraPulse AI is engineered with a clean, decoupled architecture:

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, editorial typography (*Fraunces* + *Plus Jakarta Sans*), responsive mobile-first AppShell, and domain service client.
* **Backend**: Python FastAPI service with Pydantic v2 schemas, strict token verification, real ML inference engine, explainable watering rules, and unified repository.
* **Data & Identity**: Supabase Auth, PostgreSQL with Row Level Security (RLS), private image storage bucket (`plant-scans`), and resilient offline SQLite fallback.
* **Artificial Intelligence**: Real convolutional tomato leaf disease classification across 10 benchmark classes with calibrated temperature scaling ($T=1.35$) and out-of-distribution uncertainty quantification.
* **Weather Integration**: Open-Meteo Forecast API with transparent balcony shelter factor and container physics rules.

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest tests -v
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
* **API Documentation (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### 2. Start the Frontend Web Application (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
* **Web Application**: [http://localhost:3000](http://localhost:3000)

### 3. Build for Production
```bash
# Frontend production build
cd frontend
npm run build
npm run preview

# Run backend automated test suite
cd backend
python -m pytest tests -v
```

---

## 🔬 Supported Tomato Conditions & Model Architecture

The vision engine supports 10 conditions from the PlantVillage agricultural benchmark:
1. `tomato_healthy`: Tomato - Healthy Foliage
2. `tomato_early_blight`: Early Blight (*Alternaria solani*)
3. `tomato_late_blight`: Late Blight (*Phytophthora infestans*)
4. `tomato_bacterial_spot`: Bacterial Spot (*Xanthomonas spp.*)
5. `tomato_leaf_mold`: Leaf Mold (*Passalora fulva*)
6. `tomato_septoria_leaf_spot`: Septoria Leaf Spot (*Septoria lycopersici*)
7. `tomato_spider_mites`: Two-Spotted Spider Mites (*Tetranychus urticae*)
8. `tomato_target_spot`: Target Spot (*Corynespora cassiicola*)
9. `tomato_yellow_leaf_curl_virus`: Tomato Yellow Leaf Curl Virus (TYLCV)
10. `tomato_mosaic_virus`: Tomato Mosaic Virus (ToMV)

### Calibrated Uncertainty & Inconclusive State
Predictions with top probability $< 0.65$ or a margin $< 0.12$ between top-2 candidates, as well as non-foliar images, are flagged as `is_inconclusive = True` with actionable guidance to retake the photo in diffused natural daylight.

---

## 🔒 Security & Tenant Isolation

1. **Token-Derived Identity**: The backend derives the authenticated user identity strictly from validated token claims (`auth.uid()`), never trusting user ID values in request bodies.
2. **Database Row Level Security (RLS)**: Enforced across all PostgreSQL tables (`profiles`, `plants`, `scans`, `watering_logs`).
3. **Private Storage**: User-uploaded leaf specimens are isolated to private storage folders (`{user_id}/{filename}`) protected by RLS.
4. **Secret Isolation**: Service-role keys and backend secrets are strictly excluded from client browser code.

---

## 📚 Technical Documentation

* [API Specification (`docs/API_SPEC.md`)](file:///d:/Darshana/Code_Carnival_3.0/AI_Urban_Farming/docs/API_SPEC.md): Complete REST endpoint documentation and schemas.
* [Model Card (`docs/MODEL_CARD.md`)](file:///d:/Darshana/Code_Carnival_3.0/AI_Urban_Farming/docs/MODEL_CARD.md): Vision architecture, calibration temperature, and precision/recall benchmarks.
* [Architecture Decision Records (`docs/ARCHITECTURE_DECISIONS.md`)](file:///d:/Darshana/Code_Carnival_3.0/AI_Urban_Farming/docs/ARCHITECTURE_DECISIONS.md): ADRs for ML inference, uncertainty quantification, and tenant isolation.
* [Deployment Guide (`docs/DEPLOYMENT_GUIDE.md`)](file:///d:/Darshana/Code_Carnival_3.0/AI_Urban_Farming/docs/DEPLOYMENT_GUIDE.md): Docker deployment, environment configuration, and security audits.
* [Database Migrations (`supabase/migrations/`)](file:///d:/Darshana/Code_Carnival_3.0/AI_Urban_Farming/supabase/migrations/20261010000000_create_tables.sql): Full PostgreSQL DDL with RLS policies and indexes.
