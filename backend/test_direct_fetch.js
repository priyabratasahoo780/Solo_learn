async function testFetch() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY;
  console.log('Testing direct fetch to:', 'https://generativelanguage.googleapis.com/v1beta/models');
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('STATUS:', res.status);
    console.log('DATA:', JSON.stringify(data).substring(0, 100));
  } catch (err) {
    console.error('FETCH ERROR:', err.message);
    if (err.cause) console.error('CAUSE:', err.cause);
  }
}

require('dotenv').config();
testFetch();
