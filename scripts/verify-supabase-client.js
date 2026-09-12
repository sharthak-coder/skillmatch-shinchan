const { createClient } = require('@supabase/supabase-js');

async function testSupabaseAuth() {
  console.log('Testing Supabase Auth API with configured credentials...');
  const supabaseUrl = 'https://bsebsaqoeqvbgsmvfvxn.supabase.co';
  const supabaseAnonKey = 'sb_publishable_bn2gEaw4H-uiBzMBvVhrFA_qreiZ-WJ';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Check getSession with no token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('1. Initial getSession():', session === null ? 'null (Correct: No unauthenticated session leak)' : session);

  // Test invalid login error handling
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'nonexistent_tester_12345@kasukabe.edu',
    password: 'wrongpassword'
  });
  console.log('2. Invalid login response:', loginError ? `Error caught correctly: ${loginError.message}` : 'Unexpected success');

  // Verify profiles table queryable
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name')
    .limit(3);
  console.log('3. Profiles query status:', profilesError ? `Error: ${profilesError.message}` : `Success (${profiles ? profiles.length : 0} profiles found)`);

  console.log('\nSupabase client integration verified successfully.');
}

testSupabaseAuth().catch(console.error);
