
const fs = require('fs');
const path = require('path');
const vm = require('vm');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('./db');
const gemini = require('./gemini');

function getInterpretationData() {
    const saoRows = db.getAllSaoInterpret();
    const cungRows = db.getAllCungInterpret();
    const specialRows = db.getAllSpecialInterpret();

    const _saoData = {};
    saoRows.forEach(r => { _saoData[r.sao_name] = r; });

    const _cungData = {};
    cungRows.forEach(r => { _cungData[r.cung_name] = r; });

    const _specialData = {};
    specialRows.forEach(r => { _specialData[r.condition_key] = r; });

    return { _saoData, _cungData, _specialData };
}

async function runTest() {
    const { _saoData, _cungData, _specialData } = getInterpretationData();

    const sandbox = {
        console: {
            log: (...args) => console.log('[VM-LOG]', ...args),
            error: (...args) => console.error('[VM-ERR]', ...args),
            warn: (...args) => console.warn('[VM-WARN]', ...args)
        },
        Math: Math, parseInt: parseInt, parseFloat: parseFloat,
        isNaN: isNaN, Date: Date, JSON: JSON, Array: Array, Object: Object,
        String: String, Number: Number, Error: Error, RegExp: RegExp, Map: Map, Set: Set,
        document: { addEventListener: () => { }, querySelector: () => null, getElementById: () => null },
        window: { location: { hostname: 'localhost' } },
        _saoData, _cungData, _specialData
    };
    vm.createContext(sandbox);

    const baseDir = '/app/public';
    const filesToLoad = [
        'am-lich.js', 'tu-vi-calc.js', 'tu-vi-sao.js', 'tu-vi-star-patterns.js',
        'tu-vi-event-rules.js', 'tu-vi-event-scanner.js', 'tu-vi-luu-nien.js',
        'tu-vi-templates.js', 'tu-vi-interpret.js'
    ];

    filesToLoad.forEach(mod => {
        const filePath = path.join(baseDir, mod);
        if (fs.existsSync(filePath)) {
            vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox);
        }
    });

    const params = {
        ngay: 11, thang: 5, nam: 1982,
        gioSinh: 3, // 6h sáng là giờ Mão (5h-7h), index 3
        gioiTinh: "nu", // NỮ Mạng
        namXem: 2026
    };

    const res = vm.runInContext(`
        (function() {
            var params = ${JSON.stringify(params)};
            TuViInterpret.setData({ sao: _saoData, cung: _cungData, special: _specialData });
            var lasoData = TuViCalc.calculate(params);
            TuViSao.anSao(lasoData);
            var interp = TuViInterpret.interpret(lasoData);
            return { lasoData, interp };
        })()
    `, sandbox);

    console.log("--- KẾT QUẢ TÍNH TOÁN LÁ SỐ (NỮ) ---");
    console.log("Ngày DL: " + params.ngay + "/" + params.thang + "/" + params.nam);
    console.log("Âm lịch: " + res.lasoData.lunarDate.day + "/" + res.lasoData.lunarDate.month + "/" + res.lasoData.lunarDate.year);
    console.log("Năm Can Chi: " + res.lasoData.canChiNam.can + " " + res.lasoData.canChiNam.chi);
    console.log("Cung Mệnh tại: " + res.lasoData.cungMenhPos + " (" + res.lasoData.cungMap[res.lasoData.cungMenhPos] + ")");

    const cungMenhStars = res.lasoData.saoMap[res.lasoData.cungMenhPos];
    console.log("Sao tại cung Mệnh: " + cungMenhStars.map(s => s.name + (s.hoa ? " (Hoá " + s.hoa + ")" : "")).join(", "));

    // Gọi AI luận giải
    console.log("\n--- ĐANG GỌI AI LUẬN GIẢI CHUYÊN SÂU... ---");
    try {
        const aiResult = await gemini.generateAiInterpretation(res.interp);

        if (aiResult.error) {
            console.error("AI Error:", aiResult.error);
            return;
        }

        let fullText = "LÁ SỐ NỮ MẠNG - 11/05/1982\n\n";
        if (aiResult.sections) {
            aiResult.sections.forEach(s => {
                fullText += "# " + s.icon + " " + s.title + "\n" + s.content + "\n\n";
            });
        }
        if (aiResult.palaceSections) {
            Object.entries(aiResult.palaceSections).forEach(([name, content]) => {
                fullText += "## 🏛️ Cung " + name + "\n" + content + "\n\n";
            });
        }

        const outputPath = '/app/data/test_output_11_05_1982_nu.md';
        fs.writeFileSync(outputPath, fullText);
        console.log("Đã lưu kết quả luận giải chuyên sâu (NỮ) vào: " + outputPath);

    } catch (err) {
        console.error("Critical AI Error:", err.message);
    }
}

runTest().catch(console.error);
