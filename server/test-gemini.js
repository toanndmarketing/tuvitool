const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL;

console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);
console.log(`🤖 Testing Model: ${MODEL}`);

function testTuViAnalysis() {
    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

        const data = JSON.stringify({
            contents: [{
                parts: [{
                    text: "Bạn là chuyên gia Tử Vi Đẩu Số. Hãy phân tích ngắn gọn ý nghĩa của sao Tử Vi ngồi tại cung Mệnh, kèm sao Thiên Phủ đồng cung. Viết 3-4 câu."
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
            }
        });

        const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`\n✅ SUCCESS! AI Response:\n`);
                    console.log('═══════════════════════════════════════════════════');
                    try {
                        const json = JSON.parse(body);
                        const text = json.candidates[0].content.parts[0].text;
                        console.log(text);
                        console.log('═══════════════════════════════════════════════════');
                        console.log('\n🎉 Model is working perfectly for Tử Vi analysis!');
                    } catch (e) {
                        console.log(body);
                    }
                } else {
                    console.log(`\n❌ FAILED (${res.statusCode}):`);
                    console.log(body);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log('❌ Error:', e.message);
            resolve();
        });

        req.write(data);
        req.end();
    });
}

testTuViAnalysis();
