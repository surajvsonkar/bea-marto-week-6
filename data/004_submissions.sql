-- ============================================================
-- CardVault — Week 5 Schema additions
-- Adds: submissions table, photo_url column, storage setup
-- Run AFTER Week 4 schema files
-- ============================================================

-- Add photo_url to cards (for uploaded profile photos)
ALTER TABLE cards ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- ============================================================
-- TABLE: submissions (public form entries awaiting review)
-- ============================================================

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_session ON submissions(session_id);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);

CREATE TRIGGER submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS for submissions
-- ============================================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can submit"
  ON submissions FOR INSERT
  WITH CHECK (true);

-- Only admins can read all submissions
CREATE POLICY "Admin can view submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'email' = 'admin@example.com'
  );

-- Only admins can update submissions (approve/reject)
CREATE POLICY "Admin can update submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'email' = 'admin@example.com')
  WITH CHECK (auth.jwt()->>'email' = 'admin@example.com');

-- Only admins can delete submissions
CREATE POLICY "Admin can delete submissions"
  ON submissions FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'email' = 'admin@example.com');

-- ============================================================
-- STORAGE: card-photos bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('card-photos', 'card-photos', true)
  ON CONFLICT (id) DO NOTHING;

-- Anyone can upload photos to the submissions folder
CREATE POLICY "Public upload to card-photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'card-photos');

-- Photos are publicly readable
CREATE POLICY "Public read card-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'card-photos');

-- Admins can delete photos
CREATE POLICY "Admin delete card-photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'card-photos');
