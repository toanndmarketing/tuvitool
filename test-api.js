const { createGroq } = require('@ai-sdk/groq');
const { streamText } = require('ai');
(async () => {
    const groq = createGroq({ apiKey: 'YOUR_KEY' });
    const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        prompt: 'Hi',
    });
    console.log('toDataStreamResponse exists?', typeof result.toDataStreamResponse);
    console.log('toTextStreamResponse exists?', typeof result.toTextStreamResponse);
    console.log('toUIMessageStreamResponse exists?', typeof result.toUIMessageStreamResponse);
})();
