/**
 * Test AI Interpretation v2 (Compact Data)
 * Gọi API /api/interpret/ai với data từ test-output.json
 * So sánh prompt size và chất lượng output
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8950/api/interpret/ai';

async function main() {
    // Load test data từ JSON
    const testData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'test-output.json'), 'utf8'));

    // Build interpretation payload giống frontend gửi
    // Cần transform từ raw lasoData -> interpret() format
    const vm = require('vm');
    const sandbox = {
        console: console, Math: Math, parseInt: parseInt, parseFloat: parseFloat,
        isNaN: isNaN, Date: Date, JSON: JSON, Array: Array, Object: Object,
        String: String, Number: Number, Error: Error, RegExp: RegExp, Map: Map, Set: Set
    };
    vm.createContext(sandbox);

    // Load modules
    [
        'am-lich.js', 'tu-vi-calc.js', 'tu-vi-sao.js',
        'tu-vi-star-patterns.js', 'tu-vi-event-rules.js',
        'tu-vi-templates.js', 'tu-vi-event-scanner.js', 'tu-vi-luu-nien.js'
    ].forEach(mod => {
        try {
            vm.runInContext(fs.readFileSync(path.join(__dirname, 'public', mod), 'utf8'), sandbox, { filename: mod });
        } catch (e) {
            console.error('[FAIL] ' + mod + ': ' + e.message);
        }
    });

    // Simulate interpret()
    const interpretCode = `(function() {
        var params = { ngay: 28, thang: 1, nam: 1991, gioSinh: 6, gioiTinh: "nam", namXem: 2026 };
        var lasoData = TuViCalc.calculate(params);
        TuViSao.anSao(lasoData);
        var luuNien = TuViLuuNien.analyzeFull(lasoData);
        var eventScan = TuViEventScanner.scan(lasoData);
        var DIA_CHI = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

        // Simulate analyzeCung for each cung
        var palaces = [];
        for (var i = 0; i < 12; i++) {
            var pos = (lasoData.cungMenhPos + i) % 12;
            var cungName = lasoData.cungMap[pos];
            var saoList = lasoData.saoMap[pos] || [];
            var chinhTinh = saoList.filter(function(s) { return s.type === 'chinh'; });
            var phuTinh = saoList.filter(function(s) { return s.type !== 'chinh' && s.type !== 'luu'; });
            var catTinh = saoList.filter(function(s) { return s.nature === 'cat'; });
            var hungTinh = saoList.filter(function(s) { return s.nature === 'hung'; });

            var combos = TuViStarPatterns.detectCombos(saoList, pos);
            var starStatusFn = TuViStarPatterns.getStarStatus;

            var palace = {
                cungName: cungName,
                chiName: DIA_CHI[pos],
                chiIndex: pos,
                isHourDependent: (pos === lasoData.cungMenhPos || pos === lasoData.cungThanPos),
                chinhTinh: chinhTinh.map(function(s) {
                    var status = starStatusFn(s.name, pos);
                    var statusText = '';
                    if (status === 'mieu') statusText = '⬆ Miếu (rất mạnh)';
                    else if (status === 'vuong') statusText = '⬆ Vượng (mạnh)';
                    else if (status === 'dac') statusText = '➡ Đắc (khá)';
                    else if (status === 'ham') statusText = '⬇ Hãm (yếu)';
                    var nhaiNguyetInfo = null;
                    if (s.name === 'Thái Dương') nhaiNguyetInfo = TuViStarPatterns.luanThaiDuong(pos);
                    if (s.name === 'Thái Âm') nhaiNguyetInfo = TuViStarPatterns.luanThaiAm(pos);
                    return { name: s.name, hoa: s.hoa || null, luuHoa: s.luuHoa || null, statusText: statusText, nhaiNguyetInfo: nhaiNguyetInfo };
                }),
                phuTinh: phuTinh.map(function(s) {
                    return { name: s.name, hoa: s.hoa || null, luuHoa: s.luuHoa || null, nature: s.nature };
                }),
                combos: combos.map(function(c) { return { name: c.name, stars: c.stars, nature: c.nature }; }),
                rating: catTinh.length >= hungTinh.length + 2 ? 4 : (catTinh.length > hungTinh.length ? 3 : 2),
                voChinhDieu: chinhTinh.length === 0 ? true : null,
                tuanTriet: null
            };

            // Check Tuần/Triệt
            if (lasoData.tuanTriet) {
                var biTuan = TuViStarPatterns.isTuan(pos, lasoData.tuanTriet);
                var biTriet = TuViStarPatterns.isTriet(pos, lasoData.tuanTriet);
                if (biTuan || biTriet) {
                    palace.tuanTriet = { tuan: biTuan, triet: biTriet };
                }
            }

            palaces.push(palace);
        }

        // Build vanHan
        var dvPos = lasoData.daiVanHienTai.cungPos;
        var dvSaoList = lasoData.saoMap[dvPos] || [];
        var dvChinh = dvSaoList.filter(function(s) { return s.type === 'chinh'; });
        var tvPos = lasoData.tieuVan.cungPos;
        var tvChinh = (lasoData.saoMap[tvPos] || []).filter(function(s) { return s.type === 'chinh'; });

        var vanHan = {
            daiVan: {
                cungName: lasoData.cungMap[dvPos],
                chiName: DIA_CHI[dvPos],
                tuoiFrom: lasoData.daiVanHienTai.tuoiFrom,
                tuoiTo: lasoData.daiVanHienTai.tuoiTo,
                namFrom: lasoData.daiVanHienTai.namFrom,
                namTo: lasoData.daiVanHienTai.namTo,
                chinhTinh: dvChinh.map(function(s) { return { name: s.name, hoa: s.hoa || null }; })
            },
            tieuVan: {
                cungName: lasoData.cungMap[tvPos],
                chiName: DIA_CHI[tvPos],
                tuoi: lasoData.tieuVan.tuoi,
                chinhTinh: tvChinh.map(function(s) { return s.name; })
            },
            luuTuHoa: lasoData.luuTuHoa,
            luuNienAnalysis: luuNien,
            events: eventScan.events,
            patterns: eventScan.patterns,
            eventSummary: eventScan.summary
        };

        // === TÍNH NĂM TRƯỚC (2025) ĐỂ SO SÁNH ỨNG SỐ ===
        var prevParams = { ngay: 28, thang: 1, nam: 1991, gioSinh: 6, gioiTinh: "nam", namXem: 2025 };
        var prevLasoData = TuViCalc.calculate(prevParams);
        TuViSao.anSao(prevLasoData);
        var prevLuuNien = TuViLuuNien.analyzeFull(prevLasoData);
        var prevEventScan = TuViEventScanner.scan(prevLasoData);
        var prevDv = prevLasoData.daiVanHienTai;
        var prevTv = prevLasoData.tieuVan;
        var prevYear = {
            nam: 2025,
            daiVan: prevDv ? { cungName: prevLasoData.cungMap[prevDv.cungPos], chiName: DIA_CHI[prevDv.cungPos], tuoiFrom: prevDv.tuoiFrom, tuoiTo: prevDv.tuoiTo } : null,
            tieuVan: prevTv ? { cungName: prevLasoData.cungMap[prevTv.cungPos], chiName: DIA_CHI[prevTv.cungPos], tuoi: prevTv.tuoi } : null,
            nangLuong: prevLuuNien.energyScore ? { taiChinh: prevLuuNien.energyScore.taiChinh.score, sucKhoe: prevLuuNien.energyScore.sucKhoe.score, tinhCam: prevLuuNien.energyScore.tinhCam.score, tongHop: prevLuuNien.energyScore.overall } : null,
            luuTuHoa: prevLuuNien.luuTuHoa.map(function(h) { return h.hoaName + ': ' + h.saoName + ' → ' + h.cungName; }),
            hungTinh: prevLuuNien.hungTinhOverlay.map(function(a) { return a.cungName + ' (' + a.severity + ')'; }),
            suKien: prevEventScan.events.slice(0, 5).map(function(e) { return e.title + ' (' + e.severity + ')'; }),
            rating: prevEventScan.summary ? prevEventScan.summary.rating : null
        };

        return {
            overview: {
                gioiTinh: 'nam',
                cungMenhPos: lasoData.cungMenhPos,
                cungThanPos: lasoData.cungThanPos,
                amDuong: lasoData.amDuong,
                menhNapAm: lasoData.menhNapAm,
                hanhMenh: lasoData.hanhMenh,
                cucName: lasoData.cucName,
                hanhCuc: lasoData.hanhCuc,
                chuMenh: TuViSao.getChuMenh(lasoData.cungMenhPos),
                chuThan: TuViSao.getChuThan(lasoData.cungThanPos),
                thuan: lasoData.thuan,
                namXem: 2026
            },
            palaces: palaces,
            specials: [],
            vanHan: vanHan,
            yearView: 2026,
            prevYear: prevYear
        };
    })();`;

    const interpretation = vm.runInContext(interpretCode, sandbox, { filename: 'interpret' });

    console.log('=== AI Interpretation v2 Test ===');
    console.log('Palaces:', interpretation.palaces.length);
    console.log('VanHan:', interpretation.vanHan ? 'YES' : 'NO');
    console.log('');

    // Call API
    console.log('Calling API...');
    const startTime = Date.now();

    const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interpretation)
    });

    const elapsed = Date.now() - startTime;

    if (!resp.ok) {
        const errText = await resp.text();
        console.error('API Error:', resp.status, errText);
        return;
    }

    const result = await resp.json();

    console.log(`\n=== RESULT (${elapsed}ms) ===`);

    if (result.error) {
        console.error('Error:', result.error);
        return;
    }

    // Print sections
    if (result.sections) {
        console.log('\n--- SECTIONS ---');
        result.sections.forEach(s => {
            console.log(`\n${s.icon} ${s.title}:`);
            console.log(s.content.substring(0, 200) + (s.content.length > 200 ? '...' : ''));
        });
    }

    // Print palace sections
    if (result.palaceSections) {
        console.log('\n--- PALACE SECTIONS ---');
        Object.entries(result.palaceSections).forEach(([name, content]) => {
            console.log(`\n[${name}]:`);
            console.log(content.substring(0, 150) + (content.length > 150 ? '...' : ''));
        });
    }

    // Save full result
    const outputPath = path.join(__dirname, 'data', 'test-ai-v2-output.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log('\n✅ Full result saved to:', outputPath);

    // Save as markdown
    let md = '# KẾT QUẢ AI INTERPRETATION v2\n\n';
    md += `> Thời gian xử lý: ${elapsed}ms\n\n`;

    if (result.sections) {
        result.sections.forEach(s => {
            md += `## ${s.icon} ${s.title}\n\n${s.content}\n\n---\n\n`;
        });
    }

    if (result.palaceSections) {
        md += '## 🏛️ Luận Giải Từng Cung\n\n';
        Object.entries(result.palaceSections).forEach(([name, content]) => {
            md += `### [${name}]\n\n${content}\n\n---\n\n`;
        });
    }

    const mdPath = path.join(__dirname, 'data', 'test-ai-v2-output.md');
    fs.writeFileSync(mdPath, md, 'utf8');
    console.log('✅ Markdown saved to:', mdPath);
}

main().catch(console.error);
