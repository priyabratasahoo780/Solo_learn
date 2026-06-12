const API_URL = 'http://localhost:4000/api/auth';
const EMAIL = 'test_user_' + Date.now() + '@example.com';
const PASSWORD = 'password123';
const NAME = 'Test User';

async function test() {
  console.log('--- Starting Login Flow Test ---');
  console.log('Target Email:', EMAIL);

  try {
    // 1. Signup
    console.log('\n1. Signing up...');
    const signupRes = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: NAME, email: EMAIL, password: PASSWORD })
    });
    
    const signupData = await signupRes.json();
    console.log('Signup Response:', JSON.stringify(signupData, null, 2));
    
    if (!signupData.success) throw new Error('Signup failed: ' + (signupData.error || signupData.message));
    if (!signupData.token) throw new Error('Token missing in response');

    console.log('Received Token:', signupData.token);

    // 2. Login
    console.log('\n2. Logging in...');
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });

    const loginData = await loginRes.json();
    console.log('Login Response:', JSON.stringify(loginData, null, 2));

    if (!loginData.success) throw new Error('Login failed: ' + (loginData.error || loginData.message));
    if (!loginData.token) throw new Error('Token missing in response');

    console.log('\nSUCCESS: Login flow verified!');
    console.log('Token:', loginData.token);
    console.log('User:', loginData.data.name);

  } catch (err) {
    console.error('\nFAILURE:', err.message);
    if (err.cause) console.error(err.cause);
  }
}

test();
