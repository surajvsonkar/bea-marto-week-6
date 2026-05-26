-- ============================================================
-- CardVault — RLS Policies (Week 4)
-- Run this AFTER 001_schema.sql
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Categories: publicly readable
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT USING (true);

-- Cards: publicly readable
CREATE POLICY "Cards are publicly readable"
  ON cards FOR SELECT USING (true);

-- Cards: only admin can insert/update/delete
-- Replace 'admin@example.com' with your actual admin email
CREATE POLICY "Admin can insert cards"
  ON cards FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'email' = 'admin@example.com'
  );

CREATE POLICY "Admin can update cards"
  ON cards FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'email' = 'admin@example.com'
  )
  WITH CHECK (
    auth.jwt()->>'email' = 'admin@example.com'
  );

CREATE POLICY "Admin can delete cards"
  ON cards FOR DELETE
  TO authenticated
  USING (
    auth.jwt()->>'email' = 'admin@example.com'
  );

-- Profiles: users can read all profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Profiles: users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles: allow self-insert as fallback
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
