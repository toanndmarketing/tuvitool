// Quick check: verify renderLuuNienAnalysis runs correctly
const fs = require('fs');
const vm = require('vm');

const sandbox = {
    console, Math, parseInt, parseFloat, isNaN, Date, JSON, Array, Object,
    String, Number, Error, RegExp, Map, Set,
    window: { location: { hostname: 'localhost' } },
    document: { addEventListener: () => { }, querySelector: () => null, querySelectorAll: () => [] },
    fetch: () => Promise.resolve(), AUTH: { isAuthenticated: () => false, getAuthToken: () => null }
};
vm.createContext(sandbox);

const mods = [
    'am-lich.js', 'tu-vi-calc.js', 'tu-vi-sao.js', 'tu-vi-star-patterns.js',
    'tu-vi-event-rules.js', 'tu-vi-templates.js', 'tu-vi-event-scanner.js',
    'tu-vi-luu-nien.js', 'tu-vi-interpret.js'
];

mods.forEach(m => {
    try {
        vm.runInContext(fs.readFileSync('/app/public/' + m, 'utf8'), sandbox, { filename: m });
        console.log('[OK] ' + m);
    } catch (e) {
        console.error('[FAIL] ' + m + ': ' + e.message);
    }
});

const testCode = `(function() {
    var params = { ngay: 28, thang: 1, nam: 1991, gioSinh: 6, gioiTinh: "nam", namXem: 2026 };
    var lasoData = TuViCalc.calculate(params);
    TuViSao.anSao(lasoData);

    // Call analyzeVanHan only (doesn't need _cungData)
    var vh = TuViInterpret.analyzeVanHan(lasoData);

    var result = {};
    result.hasLuuNienAnalysis = !!vh.luuNienAnalysis;

    if (vh.luuNienAnalysis) {
        var ln = vh.luuNienAnalysis;
        result.energyOverall = ln.energyScore ? ln.energyScore.overall : 'N/A';
        result.energyTaiChinh = ln.energyScore ? ln.energyScore.taiChinh.score : 'N/A';
        result.energySucKhoe = ln.energyScore ? ln.energyScore.sucKhoe.score : 'N/A';
        result.energyTinhCam = ln.energyScore ? ln.energyScore.tinhCam.score : 'N/A';
        result.luuTuHoaCount = ln.luuTuHoa ? ln.luuTuHoa.length : 0;
        result.luuTuHoaNames = ln.luuTuHoa ? ln.luuTuHoa.map(function(h) { return h.hoaName + ':' + h.saoName; }) : [];
        result.hungOverlayCount = ln.hungTinhOverlay ? ln.hungTinhOverlay.length : 0;
        result.hungOverlayList = ln.hungTinhOverlay ? ln.hungTinhOverlay.map(function(a) { return a.cungName + '(' + a.severity + ')'; }) : [];
        result.thaiTue = ln.thaiTue ? ln.thaiTue.taiTueCung : 'N/A';
        result.thaiTueInteractions = ln.thaiTue && ln.thaiTue.interactions ? ln.thaiTue.interactions.length : 0;
        result.nguyetHanCount = ln.nguyetHan ? ln.nguyetHan.length : 0;
        result.bestMonth = 'N/A';
        result.worstMonth = 'N/A';
        if (ln.nguyetHan && ln.nguyetHan.length > 0) {
            var sorted = ln.nguyetHan.slice().sort(function(a,b) { return b.energy - a.energy; });
            result.bestMonth = 'T' + sorted[0].thang + '(' + sorted[0].energy + '/' + sorted[0].cungName + ')';
            result.worstMonth = 'T' + sorted[sorted.length-1].thang + '(' + sorted[sorted.length-1].energy + '/' + sorted[sorted.length-1].cungName + ')';
        }
    }

    return result;
})();`;

const result = vm.runInContext(testCode, sandbox, { filename: 'test-render' });
console.log('\n========== RENDER CHECK ==========');
console.log(JSON.stringify(result, null, 2));
console.log('==================================');
