-- ============================================================================
-- FLORA PULSE AI — COMPREHENSIVE SUPABASE POSTGRESQL MIGRATION
-- Migration: 20261010000000_create_tables.sql
-- Description: Core tables, constraints, indexes, triggers, and Row Level Security
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- Extends auth.users with gardener metadata
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'Urban Gardener',
    location_name TEXT NOT NULL DEFAULT 'Bandra West, Mumbai',
    latitude NUMERIC(9,6) DEFAULT 19.076090,
    longitude NUMERIC(9,6) DEFAULT 72.877426,
    temp_unit TEXT NOT NULL DEFAULT 'celsius' CHECK (temp_unit IN ('celsius', 'fahrenheit')),
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-sync profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, location_name)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Urban Gardener'),
        COALESCE(new.raw_user_meta_data->>'location_name', 'Bandra West, Mumbai')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. PLANTS TABLE
-- Tracks individual tomato plants and microclimate placement
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species TEXT NOT NULL DEFAULT 'Solanum lycopersicum',
    variety TEXT NOT NULL DEFAULT 'Cherry Tomato (Super Sweet 100)',
    planting_date DATE NOT NULL DEFAULT CURRENT_DATE,
    growing_location TEXT NOT NULL DEFAULT 'balcony' 
        CHECK (growing_location IN ('balcony', 'terrace', 'indoor_window', 'patio', 'garden_bed')),
    container_type TEXT NOT NULL DEFAULT 'terracotta_pot'
        CHECK (container_type IN ('terracotta_pot', 'grow_bag', 'plastic_pot', 'raised_bed', 'ground')),
    sunlight TEXT NOT NULL DEFAULT 'full_sun'
        CHECK (sunlight IN ('full_sun', 'partial_shade', 'low_light')),
    health_status TEXT NOT NULL DEFAULT 'unscanned'
        CHECK (health_status IN ('healthy', 'attention_needed', 'critical', 'unscanned')),
    notes TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    last_watered TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plants_user_id ON public.plants(user_id);
CREATE INDEX IF NOT EXISTS idx_plants_health_status ON public.plants(health_status);

-- ----------------------------------------------------------------------------
-- 3. SCANS TABLE
-- Stores AI inference results, calibrated confidence, and private storage refs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES public.plants(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    condition_code TEXT NOT NULL,
    condition_name TEXT NOT NULL,
    confidence NUMERIC(5,4) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    is_inconclusive BOOLEAN NOT NULL DEFAULT false,
    top_predictions JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_plant_id ON public.scans(plant_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. WATERING LOGS TABLE
-- Records irrigation history and soil moisture observations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.watering_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
    amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
    soil_condition_before TEXT NOT NULL DEFAULT 'dry'
        CHECK (soil_condition_before IN ('dry', 'slightly_moist', 'wet')),
    notes TEXT DEFAULT '',
    logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_watering_logs_user_id ON public.watering_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_watering_logs_plant_id ON public.watering_logs(plant_id);
CREATE INDEX IF NOT EXISTS idx_watering_logs_logged_at ON public.watering_logs(logged_at DESC);

-- Trigger to update plant last_watered timestamp
CREATE OR REPLACE FUNCTION public.update_plant_last_watered()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.plants
    SET last_watered = NEW.logged_at,
        updated_at = now()
    WHERE id = NEW.plant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_watering_logged ON public.watering_logs;
CREATE TRIGGER on_watering_logged
    AFTER INSERT ON public.watering_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_plant_last_watered();

-- ----------------------------------------------------------------------------
-- 5. CARE RECOMMENDATIONS TABLE
-- Verified agronomic knowledge reference (Public read-only)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.care_recommendations (
    condition_code TEXT PRIMARY KEY,
    condition_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'attention_needed',
    severity TEXT NOT NULL DEFAULT 'moderate',
    summary TEXT NOT NULL,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    immediate_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    prevention JSONB NOT NULL DEFAULT '[]'::jsonb,
    organic_treatment JSONB NOT NULL DEFAULT '[]'::jsonb,
    chemical_guidance JSONB NOT NULL DEFAULT '[]'::jsonb,
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict user data isolation: users can NEVER access or mutate foreign records
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watering_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_recommendations ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Plants Policies
DROP POLICY IF EXISTS "Users can view own plants" ON public.plants;
CREATE POLICY "Users can view own plants"
    ON public.plants FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own plants" ON public.plants;
CREATE POLICY "Users can insert own plants"
    ON public.plants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own plants" ON public.plants;
CREATE POLICY "Users can update own plants"
    ON public.plants FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own plants" ON public.plants;
CREATE POLICY "Users can delete own plants"
    ON public.plants FOR DELETE
    USING (auth.uid() = user_id);

-- Scans Policies
DROP POLICY IF EXISTS "Users can view own scans" ON public.scans;
CREATE POLICY "Users can view own scans"
    ON public.scans FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scans" ON public.scans;
CREATE POLICY "Users can insert own scans"
    ON public.scans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own scans" ON public.scans;
CREATE POLICY "Users can delete own scans"
    ON public.scans FOR DELETE
    USING (auth.uid() = user_id);

-- Watering Logs Policies
DROP POLICY IF EXISTS "Users can view own watering logs" ON public.watering_logs;
CREATE POLICY "Users can view own watering logs"
    ON public.watering_logs FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own watering logs" ON public.watering_logs;
CREATE POLICY "Users can insert own watering logs"
    ON public.watering_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own watering logs" ON public.watering_logs;
CREATE POLICY "Users can delete own watering logs"
    ON public.watering_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Care Recommendations Policies (World readable)
DROP POLICY IF EXISTS "Anyone can read care guidance" ON public.care_recommendations;
CREATE POLICY "Anyone can read care guidance"
    ON public.care_recommendations FOR SELECT
    USING (true);
