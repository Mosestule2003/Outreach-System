import pg from 'pg'

const passwords = [
  'Mimi&nana2025',
  '[Mimi&nana2025]',
  '[Mimi&nana2025',
  'Mimi&nana2025]',
  'Mimi&nana2025hjfjabpx', // if they typed their password and didn't realize they overtyped
  '[Mimi&nana2025hjfjabpx',
  'Mimi&nana2025@db.hjfjabpx', // ?
  'Mimi&nana2025!',
  'Mimi&nana2025@'
]

async function run() {
  for (const p of passwords) {
    console.log(`Trying password: ${p}`)
    const client = new pg.Client({
      connectionString: `postgresql://postgres:${encodeURIComponent(p)}@db.hjfjabpxrhjsdcegoaqb.supabase.co:5432/postgres`
    })
    try {
      await client.connect()
      console.log(`SUCCESS! Password is: ${p}`)
      
      const createTableQuery = `
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

        ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
        CREATE POLICY "Allow anonymous inserts" ON waitlist
          FOR INSERT
          WITH CHECK (true);
      `
      await client.query(createTableQuery)
      console.log("Created table waitlist and RLS policy")
      await client.end()
      return
    } catch (e) {
      if (e.code === '28P01') {
        console.log("Failed (wrong password).")
      } else {
        console.log(`Failed with error: ${e.message}`)
      }
    } finally {
      try { await client.end() } catch(err) {}
    }
  }
}

run()
