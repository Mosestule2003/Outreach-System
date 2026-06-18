import pg from 'pg'

const passwords = [
  'Mimi&nana2025',
  '[Mimi&nana2025]',
  '[Mimi&nana2025',
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
      `
      await client.query(createTableQuery)
      console.log("Created table waitlist")
      await client.end()
      return
    } catch (e) {
      console.log("Failed.")
    }
  }
}

run()
