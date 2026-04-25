require('dotenv').config();
const { createGroq } = require('@ai-sdk/groq');
const { generateText, streamText } = require('ai');
(async () => {
    try {
        const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
        const result = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: 'Chào bạn',
        });
        console.log('Result:', result.text);
    } catch(e) {
        console.error('Error:', e.message);
    }
})();
