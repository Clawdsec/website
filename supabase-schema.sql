-- Waitlist table for Clawsec
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated/anon users (via service role in API)
-- The service role key bypasses RLS, so this is for reference
CREATE POLICY "Service role can manage waitlist" ON waitlist
  FOR ALL
  USING (true)
  WITH CHECK (true);
