const fs = require('fs');
const path = require('path');

// Load am-lich.js content and evaluate it to get AmLich object
const amLichContent = fs.readFileSync(path.join(__dirname, 'public', 'am-lich.js'), 'utf8');
// AmLich is defined as a const at the top level in am-lich.js
// We need to extract the IIFE or just use it. 
// Since it's a constant, we can just append 'AmLich' to the end of the evaluation.
const AmLich = eval(amLichContent + '; AmLich;');

const testDates = [
    { d: 31, m: 10, y: 1990, label: 'Bug report date' },
    { d: 20, m: 1, y: 1990, label: 'Before Lunar NY 1990' },
    { d: 27, m: 1, y: 1990, label: 'Lunar NY 1990' },
    { d: 1, m: 1, y: 2024, label: 'Normal date' },
    { d: 10, m: 2, y: 2024, label: 'Lunar New Year 2024' }
];

console.log('--- LUNAR CONVERSION TEST ---');
testDates.forEach(date => {
    const res = AmLich.solarToLunar(date.d, date.m, date.y);
    const canChi = AmLich.getCanChiNam(res.year);
    console.log(`[${date.label}] Solar: ${date.d}/${date.m}/${date.y} -> Lunar: ${res.day}/${res.month}/${res.year} (${canChi.full})${res.leap ? ' (Nhuận)' : ''}`);
});
