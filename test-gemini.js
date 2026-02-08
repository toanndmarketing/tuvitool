require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const MODELS_TO_TEST = ['gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];

if (!API_KEY) {
    console.error('❌ Missing GEMINI_API_KEY in .env');
    process.exit(1);
}

console.log(`🔑 Testing Gemini API with Key: ${API_KEY.substring(0, 10)}...`);

async function testModel(modelName) {
    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

        const data = JSON.stringify({
            contents: [{ parts: [{ text: "Chào bạn, hãy giới thiệu ngắn gọn về mình." }] }]
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(url, options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ [${modelName}] Success!`);
                    resolve(true);
                } else {
                    console.log(`❌ [${modelName}] Failed (${res.statusCode}): ${responseBody}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.error(`❌ [${modelName}] Error: ${error.message}`);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log('--- STARTING CONNECTIVITY TEST ---');
    for (const model of MODELS_TO_TEST) {
        await testModel(model);
    }
    console.log('--- TEST COMPLETE ---');
}

runTests();
