require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('--- GEMINI API KEY TEST ---');
  console.log('Key:', process.env.GEMINI_API_KEY ? 'Present (ending in ' + process.env.GEMINI_API_KEY.slice(-4) + ')' : 'MISSING');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: No API key found in .env');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('Connecting to Gemini API...');
    const result = await model.generateContent('Say "Hello World" if you are online.');
    const response = await result.response;
    console.log('SUCCESS: Gemini responded:', response.text());
  } catch (err) {
    console.error('FAILURE: Gemini API error:', err.message);
    if (err.message.includes('API_KEY_INVALID')) {
      console.error('TIP: The API key provided is invalid.');
    } else if (err.message.includes('fetch failed')) {
      console.error('TIP: Possible network block or DNS issue.');
    }
  }
}

testGemini();
