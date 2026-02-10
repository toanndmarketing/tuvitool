// Test P1-P6 Luu Nien - use Function constructor to handle const IIFEs
const fs = require('fs');

const files = [
    '/app/public/am-lich.js',
    '/app/public/tu-vi-calc.js',
    '/app/public/tu-vi-sao.js',
    '/app/public/tu-vi-star-patterns.js',
    '/app/public/tu-vi-event-rules.js',
    '/app/public/tu-vi-templates.js',
    '/app/public/tu-vi-event-scanner.js',
    '/app/public/tu-vi-luu-nien.js'
];

// Build one big script that loads all modules + runs the test
var script = files.map(f => fs.readFileSync(f, 'utf-8')).join('\n;\n');

script += `
// Input: Nguyen Duc Toan
var params = { ngay: 28, thang: 1, nam: 1991, gioSinh: 6, gioiTinh: 'nam', namXem: 2026 };
var lasoData = TuViCalc.calculate(params);
TuViSao.anSao(lasoData);

console.log('=== P1: SAO LUU MOI ===');
var luuSaoCount = 0;
for (var i = 0; i < 12; i++) {
    var luuSao = lasoData.saoMap[i].filter(function(s) { return s.type === 'luu'; });
    if (luuSao.length > 0) {
        var chiName = AmLich.DIA_CHI[i];
        var cungName = lasoData.cungMap[i];
        luuSao.forEach(function(s) {
            console.log('  ' + s.name + ' -> ' + cungName + ' (' + chiName + ') [' + s.nature + ']');
            luuSaoCount++;
        });
    }
}
console.log('  Total Luu Sao: ' + luuSaoCount);

console.log('\\n=== P5: NGUYET HAN (12 thang) ===');
if (lasoData.nguyetHan) {
    lasoData.nguyetHan.forEach(function(m) {
        var chiName = AmLich.DIA_CHI[m.cungPos];
        var cungName = lasoData.cungMap[m.cungPos];
        console.log('  T' + m.thang + ': ' + cungName + ' (' + chiName + ') - ' + m.canChiThang.full);
    });
}

console.log('\\n=== P2-P6: LUU NIEN ANALYSIS ===');
var analysis = TuViLuuNien.analyzeFull(lasoData);

console.log('\\n--- P2: LUU TU HOA LUAN GIAI ---');
analysis.luuTuHoa.forEach(function(h) {
    console.log('  ' + h.hoaName + ': ' + h.saoName + ' -> ' + h.cungName + ' (' + h.chiName + ')');
    console.log('    => ' + h.meaning);
});

console.log('\\n--- P3: HUNG TINH OVERLAY ---');
if (analysis.hungTinhOverlay.length === 0) {
    console.log('  Khong co cung nao bi hung tinh chong nang.');
} else {
    analysis.hungTinhOverlay.forEach(function(a) {
        console.log('  ' + a.description);
        console.log('    Cung: ' + a.cungName + ' | Goc: ' + a.hungGoc.join(', ') + ' | Luu: ' + a.hungLuu.join(', '));
        console.log('    Total: ' + a.totalHung + ' | x' + a.multiplier);
    });
}

console.log('\\n--- P4: LUU THAI TUE ---');
if (analysis.thaiTue) {
    console.log('  Thai Tue tai: ' + analysis.thaiTue.taiTueCung + ' (' + analysis.thaiTue.taiTueChiName + ')');
    console.log('  ' + analysis.thaiTue.cungGiai);
    analysis.thaiTue.interactions.forEach(function(it) { console.log('  ' + it.description); });
    if (analysis.thaiTue.daiVanConflict) console.log('  ' + analysis.thaiTue.daiVanConflict.description);
    if (analysis.thaiTue.tieuVanConflict) console.log('  ' + analysis.thaiTue.tieuVanConflict.description);
}

console.log('\\n--- P5: NGUYET HAN ENERGY ---');
analysis.nguyetHan.forEach(function(m) {
    var bar = '';
    for (var b = 0; b < Math.floor(m.energy / 5); b++) bar += '#';
    for (var b2 = bar.length; b2 < 20; b2++) bar += '.';
    var flag = m.hasHoaLoc ? ' LOC' : (m.hasHoaKy ? ' KY!' : '');
    console.log('  T' + (m.thang < 10 ? '0' : '') + m.thang + ' [' + bar + '] ' + m.energy + '/100 ' + m.level + ' - ' + m.cungName + flag);
});

console.log('\\n--- P6: ENERGY SCORE ---');
var es = analysis.energyScore;
if (es) {
    console.log('  Tai Chinh: ' + es.taiChinh.score + '/100');
    es.taiChinh.details.forEach(function(d) { console.log('    - ' + d.house + ': ' + d.score); });
    console.log('  Suc Khoe:  ' + es.sucKhoe.score + '/100');
    es.sucKhoe.details.forEach(function(d) { console.log('    - ' + d.house + ': ' + d.score); });
    console.log('  Tinh Cam:  ' + es.tinhCam.score + '/100');
    es.tinhCam.details.forEach(function(d) { console.log('    - ' + d.house + ': ' + d.score); });
    console.log('  OVERALL:   ' + es.overall + '/100');
}

console.log('\\n=== EVENT SCANNER (with new rules) ===');
var scan = TuViEventScanner.scan(lasoData);
console.log('  Total Events: ' + scan.events.length);
scan.events.forEach(function(e) {
    console.log('  [' + e.severity.toUpperCase() + '] ' + e.name + ' (Score: ' + e.score + ')');
    console.log('    Cung: ' + e.primaryCungName + ' | Sao: ' + e.matchedStars.join(', '));
});

console.log('\\n=== DONE ===');
`;

// Execute as Function to avoid const scope issues
new Function(script)();
