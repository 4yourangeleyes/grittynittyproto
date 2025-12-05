-- ============================================================================
-- Migration: Add Contract Clause Support to Templates
-- ============================================================================

-- Add columns to templates table for contract-specific data
ALTER TABLE public.templates 
ADD COLUMN IF NOT EXISTS contract_type TEXT,
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS clauses JSONB DEFAULT '[]'::jsonb;

-- Add comment explaining the JSONB columns
COMMENT ON COLUMN public.templates.items IS 'Array of invoice items stored as JSONB for invoice templates';
COMMENT ON COLUMN public.templates.clauses IS 'Array of contract clauses stored as JSONB for contract templates';
COMMENT ON COLUMN public.templates.contract_type IS 'Type of contract (Service Agreement, NDA, etc.) for contract templates';

-- Create index for contract_type queries
CREATE INDEX IF NOT EXISTS idx_templates_contract_type ON public.templates(contract_type);

-- Note: The template_items table remains for backward compatibility
-- but new templates will use the JSONB items/clauses columns instead
