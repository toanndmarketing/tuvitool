/**
 * ============================================
 * SERVER.JS - Express Backend + API
 * Serve static + API cho Tử Vi
 * Bảo mật key Gemini phía server
 * ============================================
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const db = require('./db');
const gemini = require('./gemini');

const app = express();
const PORT = process.env.PORT || 8950;

// Trust proxy (chạy sau Nginx)
app.set('trust proxy', true);

// =====================
// AUTH STORAGE (In-memory)
// =====================
const authTokens = new Map(); // token -> { username, expiry }

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function verifyToken(token) {
    if (!token) return null;
    const data = authTokens.get(token);
    if (!data) return null;
    if (Date.now() > data.expiry) {
        authTokens.delete(token);
        return null;
    }
    return data;
}

// Middleware: Verify auth token
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    req.user = user;
    next();
}

// =====================
// SECURITY
// =====================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            styleSrcAttr: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(express.json({ limit: '1mb' }));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    max: 30, // 30 requests/phút
    message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' }
});

const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5, // 5 AI requests/phút (tránh lạm dụng Gemini quota)
    message: { error: 'Đã vượt giới hạn AI, vui lòng thử lại sau 1 phút.' }
});

// =====================
// STATIC FILES
// =====================
app.use(express.static(path.join(__dirname, '..', 'public')));

// =====================
// API ROUTES
// =====================

// --- Lấy data diễn giải sao ---
app.get('/api/interpretations/sao', apiLimiter, (req, res) => {
    try {
        const saoList = db.getAllSaoInterpret();
        // Transform to keyed object
        const result = {};
        saoList.forEach(s => {
            result[s.sao_name] = {
                icon: s.icon,
                short: s.short_desc,
                detail: s.detail,
                good: s.good_aspects,
                bad: s.bad_aspects,
                nature: s.nature,
                type: s.sao_type
            };
        });
        res.json(result);
    } catch (err) {
        console.error('[API] Error fetching sao:', err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// --- Lấy data diễn giải cung ---
app.get('/api/interpretations/cung', apiLimiter, (req, res) => {
    try {
        const cungList = db.getAllCungInterpret();
        const result = {};
        cungList.forEach(c => {
            result[c.cung_name] = {
                icon: c.icon,
                desc: c.description,
                aspects: JSON.parse(c.key_aspects || '[]')
            };
        });
        res.json(result);
    } catch (err) {
        console.error('[API] Error fetching cung:', err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// --- Lấy data diễn giải đặc biệt ---
app.get('/api/interpretations/special', apiLimiter, (req, res) => {
    try {
        const specialList = db.getAllSpecialInterpret();
        const result = {};
        specialList.forEach(s => {
            result[s.condition_key] = {
                title: s.title,
                icon: s.icon,
                description: s.description,
                advice: s.advice
            };
        });
        res.json(result);
    } catch (err) {
        console.error('[API] Error fetching special:', err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// --- Tất cả data diễn giải (combined) ---
app.get('/api/interpretations/all', apiLimiter, (req, res) => {
    try {
        const saoList = db.getAllSaoInterpret();
        const cungList = db.getAllCungInterpret();
        const specialList = db.getAllSpecialInterpret();

        const sao = {};
        saoList.forEach(s => {
            sao[s.sao_name] = {
                icon: s.icon, short: s.short_desc, detail: s.detail,
                good: s.good_aspects, bad: s.bad_aspects,
                nature: s.nature, type: s.sao_type
            };
        });

        const cung = {};
        cungList.forEach(c => {
            cung[c.cung_name] = {
                icon: c.icon, desc: c.description,
                aspects: JSON.parse(c.key_aspects || '[]')
            };
        });

        const special = {};
        specialList.forEach(s => {
            special[s.condition_key] = {
                title: s.title, icon: s.icon,
                description: s.description, advice: s.advice
            };
        });

        res.json({ sao, cung, special });
    } catch (err) {
        console.error('[API] Error fetching all:', err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// --- Auth Login ---
app.post('/api/auth/login', apiLimiter, (req, res) => {
    try {
        const { username, password } = req.body;

        const validUsername = process.env.AUTH_USERNAME || 'tuvisteven';
        const validPassword = process.env.AUTH_PASSWORD || '2134jsad@#@!%asgg';

        if (username === validUsername && password === validPassword) {
            const token = generateToken();
            const expiry = Date.now() + (30 * 60 * 1000); // 30 phút

            authTokens.set(token, { username, expiry });

            res.json({
                success: true,
                token,
                expiresIn: 1800 // seconds
            });
        } else {
            res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
        }
    } catch (err) {
        console.error('[Auth] Login error:', err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// --- AI Interpretation (Gemini) - Protected ---
app.post('/api/interpret/ai', aiLimiter, requireAuth, async (req, res) => {
    try {
        const interpretationData = req.body;
        if (!interpretationData || !interpretationData.overview) {
            return res.status(400).json({ error: 'Dữ liệu lá số không hợp lệ' });
        }

        // Đảm bảo có metadata để cache chính xác
        const payload = {
            ...interpretationData,
            name: interpretationData.name || 'Ẩn danh',
            dob: interpretationData.dob,
            hour: interpretationData.hour,
            yearView: interpretationData.yearView
        };

        const result = await gemini.generateAiInterpretation(payload);
        res.json(result);
    } catch (err) {
        console.error('[API] AI Error:', err.message);
        res.status(500).json({ error: 'Lỗi AI', fallback: true });
    }
});

// --- Health check ---
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        geminiConfigured: !!process.env.GEMINI_API_KEY
    });
});

// --- Fallback: serve index.html ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// =====================
// START SERVER
// =====================
app.listen(PORT, '0.0.0.0', () => {
    // Initialize DB on startup
    db.getDb();
    console.log(`
╔══════════════════════════════════════╗
║     TỬ VI LÁ SỐ - Backend API      ║
║     http://localhost:${PORT}           ║
║     Gemini AI: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not set'}      ║
╚══════════════════════════════════════╝
    `);
});
