// src/api/iching/hexagramController.js
const express = require('express');
const router = express.Router();
const { cast } = require('./hexagramService');

// Simple validation middleware
function validateCastBody(req, res, next) {
    const { method, throws } = req.body || {};
    if (method && method !== 'coin') {
        return res.status(400).json({ error: 'Only "coin" method is supported' });
    }
    const throwsNum = throws || 3;
    if (![3, 6].includes(throwsNum)) {
        return res.status(400).json({ error: 'Throws must be 3 (3‑coin) or 6 (6‑coin)' });
    }
    req.castOptions = { method: 'coin', throws: throwsNum };
    next();
}

router.post('/cast', validateCastBody, (req, res) => {
    try {
        const result = cast(req.castOptions);
        res.json(result);
    } catch (err) {
        console.error('[IChing] Cast error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
