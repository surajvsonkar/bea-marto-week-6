-- ============================================================
-- CardVault — Week 6 AI Schema additions
-- Adds: ai_generations table
-- Run AFTER Week 5 schema files
-- ============================================================

-- ============================================================
-- TABLE: ai_generations (stores AI-generated content)
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'bio',
  prompt TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_generations_user ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_created ON ai_generations(created_at DESC);

-- ============================================================
-- RLS for ai_generations
-- ============================================================

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Users can view their own generations
CREATE POLICY "Users can view own AI generations"
  ON ai_generations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create AI generations
CREATE POLICY "Users can create AI generations"
  ON ai_generations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
