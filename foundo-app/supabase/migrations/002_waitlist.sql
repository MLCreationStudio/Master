-- ============================================================
-- Foundo — Waitlist Schema
-- For landing page leads
-- ============================================================

CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for waitlist)
CREATE POLICY "Public can join waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- Only admin can read waitlist (for future dash)
CREATE POLICY "Only admin can view waitlist"
  ON waitlist FOR SELECT
  USING (false); -- Admin roles to be defined later
