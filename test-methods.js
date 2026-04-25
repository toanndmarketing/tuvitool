require('dotenv').config();
const { createGroq } = require('@ai-sdk/groq');
const { streamText } = require('ai');
(async () => {
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        prompt: 'Hi',
    });
    console.log('Prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(result)));
})();
