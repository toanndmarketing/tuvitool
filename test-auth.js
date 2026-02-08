/**
 * Test Auth API Endpoints
 * Chạy: node test-auth.js
 */

const API_BASE = 'http://localhost:8950';

async function testAuthFlow() {
    console.log('🧪 Testing Auth Flow...\n');

    // Test 1: Login với credentials đúng
    console.log('1️⃣ Test Login - Correct Credentials');
    try {
        const loginResp = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'tuvisteven',
                password: '2134jsad@#@!%asgg'
            })
        });

        if (loginResp.ok) {
            const data = await loginResp.json();
            console.log('✅ Login successful!');
            console.log('   Token:', data.token.substring(0, 20) + '...');
            console.log('   Expires in:', data.expiresIn, 'seconds\n');

            // Test 2: Gọi AI API với token
            console.log('2️⃣ Test AI API - With Valid Token');
            const aiResp = await fetch(`${API_BASE}/api/interpret/ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify({
                    overview: {
                        amDuong: 'Dương',
                        menhNapAm: 'Test',
                        hanhMenh: 'Kim',
                        cucName: 'Test Cục',
                        hanhCuc: 'Thuỷ',
                        chuMenh: 'Test',
                        chuThan: 'Test',
                        thuan: true
                    },
                    palaces: [],
                    specials: [],
                    name: 'Test User',
                    dob: '2000-01-01',
                    hour: 0,
                    yearView: 2026
                })
            });

            if (aiResp.ok) {
                console.log('✅ AI API accessible with token!\n');
            } else {
                console.log('❌ AI API failed:', aiResp.status, await aiResp.text(), '\n');
            }
        } else {
            console.log('❌ Login failed:', loginResp.status, await loginResp.text(), '\n');
        }
    } catch (err) {
        console.log('❌ Error:', err.message, '\n');
    }

    // Test 3: Login với credentials sai
    console.log('3️⃣ Test Login - Wrong Credentials');
    try {
        const wrongResp = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'wrong',
                password: 'wrong'
            })
        });

        if (wrongResp.status === 401) {
            console.log('✅ Correctly rejected wrong credentials\n');
        } else {
            console.log('❌ Should return 401 for wrong credentials\n');
        }
    } catch (err) {
        console.log('❌ Error:', err.message, '\n');
    }

    // Test 4: Gọi AI API không có token
    console.log('4️⃣ Test AI API - Without Token');
    try {
        const noTokenResp = await fetch(`${API_BASE}/api/interpret/ai`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                overview: { test: true },
                palaces: [],
                specials: []
            })
        });

        if (noTokenResp.status === 401) {
            console.log('✅ Correctly rejected request without token\n');
        } else {
            console.log('❌ Should return 401 for missing token\n');
        }
    } catch (err) {
        console.log('❌ Error:', err.message, '\n');
    }

    console.log('✅ All tests completed!');
}

testAuthFlow().catch(console.error);
