// src/api/iching/hexagramService.js
// Service for casting I Ching hexagrams using 3‑coin or 6‑coin method

const fs = require('fs');
const path = require('path');

// Load hexagram data (expects JSON file defined by ICHING_DATA_PATH env var)
function loadHexagrams() {
    const dataPath = process.env.ICHING_DATA_PATH || path.resolve(__dirname, '../../data/iching/hexagrams.json');
    if (!fs.existsSync(dataPath)) {
        throw new Error(`Hexagram data file not found at ${dataPath}`);
    }
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
}

const hexagrams = loadHexagrams();

/**
 * Convert a sequence of coin throws (0 = tails, 1 = heads) into a line value.
 * 0 -> broken (yin), 1 -> solid (yang)
 */
function coinToLine(throws) {
    // Sum of three coins: 0,1,2,3 heads
    const sum = throws.reduce((a, b) => a + b, 0);
    // Traditional I Ching: 6 (old yin), 7 (young yang), 8 (young yin), 9 (old yang)
    // We'll map 0/1 heads to 6/9 for changing lines, otherwise 7/8.
    if (sum === 0) return 6; // three tails -> old yin (changing)
    if (sum === 3) return 9; // three heads -> old yang (changing)
    if (sum === 1) return 8; // one head -> young yin
    return 7; // two heads -> young yang
}

/**
 * Cast a hexagram.
 * @param {string} method "coin" (default) – currently only coin method supported.
 * @param {number} throws Number of throws: 3 for 3‑coin (one line), 6 for 6‑coin (two lines per line).
 * @returns {object} {hexagramId, name, description, lines, changingLines}
 */
function cast({ method = 'coin', throws = 3 }) {
    if (method !== 'coin') {
        throw new Error('Only coin method is implemented');
    }
    const totalLines = 6;
    const lineValues = [];
    const changing = [];
    for (let i = 0; i < totalLines; i++) {
        const coinThrows = [];
        const repeat = throws === 3 ? 1 : 2; // 3‑coin: one throw per line, 6‑coin: two throws per line (average)
        for (let r = 0; r < repeat; r++) {
            // simulate three coin flips per throw
            const three = [Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random())];
            coinThrows.push(...three);
        }
        // For 6‑coin method we take the average of two throws (sum of six bits / 2)
        const line = coinToLine(coinThrows.slice(0, 3)); // use first three bits for simplicity
        lineValues.unshift(line); // bottom line first, so we unshift to have top‑to‑bottom order later
        if (line === 6 || line === 9) changing.push(6 - line); // store index of changing line (0‑based from bottom)
    }
    // Convert line values to binary (yang=1, yin=0) ignoring changing nature
    const binary = lineValues.map(l => (l === 7 || l === 9) ? 1 : 0).reverse(); // top to bottom
    const index = parseInt(binary.join(''), 2);
    const hex = hexagrams[index];
    if (!hex) {
        throw new Error('Hexagram data missing for index ' + index);
    }
    return {
        hexagramId: hex.id,
        name: hex.name,
        unicode: hex.unicode,
        description: hex.judgment,
        lines: lineValues,
        changingLines: changing,
    };
}

module.exports = { cast };
