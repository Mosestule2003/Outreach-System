-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  work_email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  role_other TEXT,
  annual_revenue TEXT NOT NULL,
  challenge TEXT NOT NULL,
  challenge_other TEXT,
  hope_to_solve TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow admins to read all data (if using Supabase Auth for admins later)
-- CREATE POLICY "Allow authenticated users to read" ON waitlist FOR SELECT USING (auth.role() = 'authenticated');
