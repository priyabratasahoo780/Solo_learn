const fs = require('fs');
require('dotenv').config();
const { generateAIContent } = require('./src/utils/aiService');

(async () => {
    try {
        const result = await generateAIContent('hello');
        fs.writeFileSync('result_success.txt', JSON.stringify(result));
    } catch (err) {
        fs.writeFileSync('result_error.txt', err.message);
    }
})();
