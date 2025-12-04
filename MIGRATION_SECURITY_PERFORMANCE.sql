-- ============================================================================
-- GritDocs Security & Performance Migration
-- Run this in Supabase SQL Editor to add rate limiting and performance indexes
-- Date: December 4, 2025
-- ============================================================================

-- STEP 1: Add rate_limits table for security
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'ai_generation', 'email_send', etc.
  count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  reset_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_user_action ON public.rate_limits(user_id, action, window_start);
CREATE INDEX idx_rate_limits_reset ON public.rate_limits(reset_at);

-- RLS Policies for rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits"
  ON public.rate_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage rate limits"
  ON public.rate_limits FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE public.rate_limits IS 'Rate limiting for API abuse prevention';

-- STEP 2: Add performance indexes
-- ============================================================================

-- Documents indexes (WHERE clause for soft deletes)
CREATE INDEX IF NOT EXISTS idx_documents_user_date 
  ON public.documents(user_id, date_issued DESC) 
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_documents_user_type 
  ON public.documents(user_id, doc_type) 
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_documents_user_status 
  ON public.documents(user_id, status) 
  WHERE deleted_at IS NULL;

-- Clients index
CREATE INDEX IF NOT EXISTS idx_clients_user_name 
  ON public.clients(user_id, business_name);

-- Templates index
CREATE INDEX IF NOT EXISTS idx_templates_user_category 
  ON public.templates(user_id, category);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run these queries to verify the migration succeeded:

-- Check rate_limits table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'rate_limits'
) AS rate_limits_exists;

-- Check indexes were created
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================
-- DROP TABLE IF EXISTS public.rate_limits CASCADE;
-- DROP INDEX IF EXISTS idx_documents_user_date;
-- DROP INDEX IF EXISTS idx_documents_user_type;
-- DROP INDEX IF EXISTS idx_documents_user_status;
-- DROP INDEX IF EXISTS idx_clients_user_name;
-- DROP INDEX IF EXISTS idx_templates_user_category;
