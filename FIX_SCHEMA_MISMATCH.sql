-- ============================================================================
-- Fix Schema Mismatch - Add Missing Columns
-- Run this in Supabase SQL Editor immediately
-- ============================================================================

-- Add body_text column to documents table (used for contracts)
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS body_text TEXT;

-- Add clauses column to documents table (used for contracts)
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS clauses JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.documents.body_text IS 'Rich text content for contract documents';
COMMENT ON COLUMN public.documents.clauses IS 'Array of contract clauses in JSONB format';
COMMENT ON COLUMN public.documents.clauses IS 'Array of contract clauses in JSON format';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'documents'
  AND column_name IN ('body_text', 'clauses');

-- Expected result: 
-- body_text | text   | YES
-- clauses   | jsonb  | YES

-- ============================================================================
-- Additional: Verify all expected columns exist
-- ============================================================================

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'documents'
ORDER BY ordinal_position;

-- You should see all these columns:
-- id, user_id, name, category, doc_type, theme, status, data, 
-- created_at, updated_at, deleted_at, date_issued, invoice_number,
-- client_id, total_amount, currency, vat_enabled, tax_rate, 
-- clauses, body_text
