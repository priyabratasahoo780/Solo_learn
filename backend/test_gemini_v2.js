require('dotenv').config();
const { generateAIContent } = require('./src/utils/aiService');

/**
 * REVISED GEMINI TEST SUITE
 * Uses the Direct Fetch AI Service to bypass SDK network blocks.
 */

async function testWorkingGemini() {
  console.log('--- REVISED GEMINI TEST [V2] ---');
  console.log('Key Status:', process.env.GEMINI_API_KEY ? 'Present' : 'MISSING');
  
  if (!process.env.GEMINI_API_KEY) return console.error('ERROR: No API key found in .env');

  try {
    console.log('Attempting Generative Handshake (Direct Fetch)...');
    const answer = await generateAIContent('Confirm operational status. Are you generative?');
    
    console.log('SUCCESS: Gemini Operational Signal Detected:');
    console.log('--->', answer);
    
    console.log('Testing JSON Structural Integrity...');
    const jsonObj = await generateAIContent('Create a JSON object with a key "status" and value "online".', true);
    console.log('SUCCESS: JSON Parsed:', jsonObj);
    
  } catch (err) {
    console.error('FAILURE: Revised Gemini Test Error:', err.message);
  }
}

testWorkingGemini();
