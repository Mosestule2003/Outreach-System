import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hjfjabpxrhjsdcegoaqb.supabase.co'
const supabaseAnonKey = 'sb_publishable_ynRypBnAYqfRHDWd87BNww_qWJDNRtu'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verify() {
  console.log("Verifying connection to waitlist table...")
  
  // Create a unique test email so it doesn't violate the UNIQUE constraint on work_email
  const testEmail = `test_${Date.now()}@example.com`
  
  const payload = {
    name: 'Verification Test',
    company: 'Test Company',
    work_email: testEmail,
    role: 'other',
    annual_revenue: 'under-250k',
    challenge: 'other',
    hope_to_solve: 'Verification'
  }
  
  const { data, error } = await supabase
    .from('waitlist')
    .insert([payload])
    
  if (error) {
    console.error("FAILED to insert into waitlist table. The table might not exist yet, or the policy is missing.")
    console.error("Error details:", error.message, error.details, error.hint)
  } else {
    console.log("SUCCESS! Connected to Supabase and successfully inserted a test record into the 'waitlist' table.")
  }
}

verify()
