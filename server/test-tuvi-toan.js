/**
 * TEST LUẬN GIẢI TỬ VI CHUYÊN SÂU - DATA CHUẨN (v2 - DB supported)
 * Đương số: Nguyễn Đức Toàn
 * Ngày sinh: 28/01/1991 (DL) - 13/12/1990 (AL)
 * Giờ sinh: Ngọ 12h30
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const gemini = require('./gemini');
const db = require('./db');

// 1. Lấy dữ liệu diễn giải từ Database
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

async function runRealTest() {
    console.log("🚀 Đang khởi tạo môi trường tính toán...");

    const { _saoData, _cungData, _specialData } = getInterpretationData();

    // Khởi tạo môi trường ảo
    const sandbox = {
        console: console, Math: Math, parseInt: parseInt, parseFloat: parseFloat,
        isNaN: isNaN, Date: Date, JSON: JSON, Array: Array, Object: Object,
        String: String, Number: Number, Error: Error, RegExp: RegExp, Map: Map, Set: Set,
        document: { addEventListener: () => { } },
        _saoData, _cungData, _specialData // Inject DB data
    };
    vm.createContext(sandbox);

    // Load engine files
    ['am-lich.js', 'tu-vi-calc.js', 'tu-vi-sao.js', 'tu-vi-interpret.js'].forEach(mod => {
        const filePath = path.join('/app', 'public', mod);
        vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox, { filename: mod });
    });

    console.log("� Đang tính toán lá số thực tế cho: Nguyễn Đức Toàn (28/01/1991)...");

    // 2. Chạy engine để lấy data chuẩn
    const res = vm.runInContext(`
        (function() {
            var params = { 
                ngay: 28, 
                thang: 1, 
                nam: 1991, 
                gioSinh: 6, // Giờ Ngọ 
                gioiTinh: "nam", 
                namXem: 2026 
            };
            
            // Tiêm data vào interpret
            TuViInterpret.setData({ sao: _saoData, cung: _cungData, special: _specialData });

            var lasoData = TuViCalc.calculate(params);
            TuViSao.anSao(lasoData);
            
            // Build interpretation data structure
            var interp = TuViInterpret.interpret(lasoData);
            interp.name = "Nguyễn Đức Toàn";
            interp.dob = "28/01/1991";
            interp.hour = 6;
            interp.yearView = 2026;
            
            return interp;
        })()
    `, sandbox);

    console.log("✅ Đã tính xong lá số mẫu chuẩn. Đang gửi sang Gemini AI để luận giải chuyên sâu...");
    console.log("--------------------------------------------------------------------------------");

    try {
        const aiResult = await gemini.generateAiInterpretation(res);

        if (aiResult.error) {
            console.error("❌ LỖI AI:", aiResult.error);
            return;
        }

        // Output to console & file
        let fullText = "";
        if (aiResult.sections) {
            aiResult.sections.forEach(s => {
                const block = `# ${s.icon} ${s.title}\n${s.content}\n\n`;
                console.log(block);
                fullText += block;
            });
        }

        if (aiResult.palaceSections) {
            Object.entries(aiResult.palaceSections).forEach(([name, content]) => {
                const block = `## 🏛️ Cung ${name}\n${content}\n\n`;
                // console.log(block); // Too much for console maybe
                fullText += block;
            });
        }

        const outputPath = path.join(__dirname, 'test_output_nguyen_duc_toan.md');
        fs.writeFileSync(outputPath, fullText);
        console.log(`\n💾 Đã lưu kết quả LUẬN GIẢI CHUẨN vào: ${outputPath}`);
        console.log("🎉 HOÀN TẤT!");

    } catch (err) {
        console.error("❌ CRITICAL ERROR:", err.message);
    }
}

runRealTest();
