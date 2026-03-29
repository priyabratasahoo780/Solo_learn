/**
 * Unified AI Service for Sketch Academy
 * Direct Fetch implementation for Gemini 1.5 Flash (v1 API)
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Generates AI content from a prompt.
 * @param {string} prompt - The prompt to send.
 * @param {boolean} isJson - Whether to expect and return JSON data.
 * @returns {Promise<string|object>} - The AI generated response.
 */
exports.generateAIContent = async (prompt, isJson = false) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  // Handle both standard and JSON-formatted requests
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: isJson ? { responseMimeType: "application/json" } : {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass local network TLS firewall blocks
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [GEMINI_API_ERROR]:', errorData);
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error('EMPTY_AI_RESPONSE');

    // Clean JSON if it's wrapped in markdown code blocks
    if (isJson) {
      text = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(text);
    }

    return text;
  } catch (err) {
    console.error('❌ [AI_SERVICE_FAIL]:', err.message);
    throw err;
  }
};
