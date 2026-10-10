# FloraPulse AI — Production Deployment Guide

## 1. Environment Configuration

### Frontend (`frontend/.env`)
```bash
# Supabase Cloud Authentication & PostgreSQL Client
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# FastAPI Backend Service URL
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```bash
# Supabase JWT Secret & Service Role Key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# Server Environment
HOST=0.0.0.0
PORT=8000
```

---

## 2. Supabase Database & Storage Deployment

1. Open the **SQL Editor** in your Supabase dashboard:
   - Run the initial migration script: [`supabase/migrations/20261010000000_create_tables.sql`](file:///d:/Darshana/Code_Carnival_3.0/AI_Urban_Farming/supabase/migrations/20261010000000_create_tables.sql).
   - This creates `profiles`, `plants`, `scans`, `watering_logs`, `care_recommendations`, all indexes, triggers, and Row Level Security (RLS) policies.
2. Run the storage bucket script: [`supabase/storage.sql`](file:///d:/Darshana/Code_Carnival_3.0/AI_Urban_Farming/supabase/storage.sql).
   - Creates the private `plant-scans` bucket with strict folder ownership policies (`${auth.uid()}/*`).

---

## 3. Backend Deployment (FastAPI)

### Local / Virtual Environment
```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest tests -v
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker Deployment
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
Build and run:
```bash
docker build -t florapulse-backend ./backend
docker run -p 8000:8000 --env-file ./backend/.env florapulse-backend
```

---

## 4. Frontend Production Build & Hosting

1. Build the minified production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Verify production build locally:
   ```bash
   npm run preview
   ```
3. Deploy `dist/` output to static hosting services (Vercel, Cloudflare Pages, Netlify, or AWS S3 + CloudFront).

---

## 5. Security & Verification Checklist

- [x] **Zero Secret Exposure**: No Supabase service-role keys or JWT secrets are stored in frontend client code.
- [x] **Strict Server-Side Auth**: The backend derives the authenticated user ID strictly from verified token claims (`auth.uid()`), never trusting user ID values in request bodies.
- [x] **Row Level Security (RLS)**: PostgreSQL enforces database-level tenant isolation across all tables.
- [x] **File Validation**: Image uploads are restricted to JPG, PNG, and WebP formats with a strict 10MB file size limit.
- [x] **Uncertainty Calibration**: Model outputs employ temperature scaling ($T=1.35$) and an explicit inconclusive state for low-confidence or non-leaf photos.
- [x] **Automated Test Suite**: 100% test pass rate across authentication, plant CRUD, user isolation, ML inference, and weather reasoning.
