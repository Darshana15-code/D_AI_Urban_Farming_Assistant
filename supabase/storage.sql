-- ============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION & POLICIES
-- Bucket: plant-scans (Private)
-- ============================================================================

-- Create private bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'plant-scans',
    'plant-scans',
    false, -- Private bucket
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- ----------------------------------------------------------------------------
-- STORAGE RLS POLICIES
-- Path Convention: {user_id}/{filename}
-- ----------------------------------------------------------------------------

-- 1. Users can upload only to their own folder
DROP POLICY IF EXISTS "Users can upload their own leaf scans" ON storage.objects;
CREATE POLICY "Users can upload their own leaf scans"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'plant-scans' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Users can read/download only their own images
DROP POLICY IF EXISTS "Users can view their own leaf scans" ON storage.objects;
CREATE POLICY "Users can view their own leaf scans"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'plant-scans' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Users can delete their own leaf images
DROP POLICY IF EXISTS "Users can delete their own leaf scans" ON storage.objects;
CREATE POLICY "Users can delete their own leaf scans"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'plant-scans' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
