/**
 * ============================================
 * TEST CHUẨN TỬ VI - FULL ANALYSIS (P1-P6)
 * DATA: Nguyễn Đức Toàn
 * 28/01/1991 | Giờ Ngọ (6) | Nam | Xem 2026
 * Output: data/test-output.json + data/test-output.md
 * ============================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sandbox = {
    console: console, Math: Math, parseInt: parseInt, parseFloat: parseFloat,
    isNaN: isNaN, Date: Date, JSON: JSON, Array: Array, Object: Object,
    String: String, Number: Number, Error: Error, RegExp: RegExp, Map: Map, Set: Set
};
vm.createContext(sandbox);

// Load all modules
[
    'am-lich.js',
    'tu-vi-calc.js',
    'tu-vi-sao.js',
    'tu-vi-star-patterns.js',
    'tu-vi-event-rules.js',
    'tu-vi-templates.js',
    'tu-vi-event-scanner.js',
    'tu-vi-luu-nien.js'
].forEach(mod => {
    try {
        vm.runInContext(fs.readFileSync(path.join(__dirname, 'public', mod), 'utf8'), sandbox, { filename: mod });
        console.log('[OK] ' + mod);
    } catch (e) {
        console.error('[FAIL] ' + mod + ': ' + e.message);
    }
});

// Test code runs INSIDE sandbox
const testCode = `(function() {
    var DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

    // === CALCULATE ===
    var params = { ngay: 28, thang: 1, nam: 1991, gioSinh: 6, gioiTinh: "nam", namXem: 2026 };
    var lasoData = TuViCalc.calculate(params);
    TuViSao.anSao(lasoData);

    // === LƯU NIÊN ANALYSIS ===
    var luuNien = TuViLuuNien.analyzeFull(lasoData);

    // === EVENT SCANNER ===
    var eventScan = TuViEventScanner.scan(lasoData);

    // =====================
    // BUILD JSON OUTPUT
    // =====================
    var saoMapSimple = {};
    for (var ci = 0; ci < 12; ci++) {
        saoMapSimple[ci] = (lasoData.saoMap[ci] || []).map(function(s) {
            var obj = { name: s.name, type: s.type, nature: s.nature };
            if (s.hoa) obj.hoa = s.hoa;
            if (s.luuHoa) obj.luuHoa = s.luuHoa;
            return obj;
        });
    }

    var jsonOutput = {
        timestamp: new Date().toISOString(),
        input: params,
        lunarDate: lasoData.lunarDate,
        canChiNam: lasoData.canChiNam,
        canChiNamXem: lasoData.canChiNamXem,
        menh: { napAm: lasoData.menhNapAm, hanh: lasoData.hanhMenh },
        cuc: { name: lasoData.cucName, value: lasoData.cucValue, hanh: lasoData.hanhCuc },
        cungMenhPos: lasoData.cungMenhPos,
        cungThanPos: lasoData.cungThanPos,
        thuan: lasoData.thuan,
        cungMap: lasoData.cungMap,
        saoMap: saoMapSimple,
        tuHoa: lasoData.tuHoa,
        luuTuHoa: lasoData.luuTuHoa,
        daiVanHienTai: lasoData.daiVanHienTai,
        tieuVan: lasoData.tieuVan,
        nguyetHan: lasoData.nguyetHan,
        luuNienAnalysis: luuNien,
        eventScan: {
            totalEvents: eventScan.events.length,
            totalPatterns: eventScan.patterns.length,
            events: eventScan.events,
            patterns: eventScan.patterns,
            summary: eventScan.summary
        }
    };

    // =====================
    // BUILD MARKDOWN REPORT
    // =====================
    var md = [];
    function log(s) { md.push(s || ""); }

    log("# KẾT QUẢ TEST TỬ VI - FULL ANALYSIS (P1-P6)");
    log("");
    log("> **Người test:** Nguyễn Đức Toàn");
    log("> **Ngày chạy:** " + jsonOutput.timestamp);
    log("> **Source:** test-tuvi-full.js trong Docker container");
    log("> **Input:** 28/01/1991, Giờ Ngọ, Nam, Xem 2026");
    log("");
    log("---");
    log("");

    // === CORE INFO ===
    log("## THÔNG TIN CƠ BẢN");
    log("");
    log("| Trường | Giá trị |");
    log("|---|---|");
    log("| Mệnh | " + lasoData.menhNapAm + " (" + lasoData.hanhMenh + ") |");
    log("| Cục | " + lasoData.cucName + " (" + lasoData.cucValue + ") |");
    log("| Cung Mệnh | " + DIA_CHI[lasoData.cungMenhPos] + " (index " + lasoData.cungMenhPos + ") |");
    log("| Thuận/Nghịch | " + (lasoData.thuan ? "THUẬN" : "NGHỊCH") + " |");
    log("| Đại Vận | " + DIA_CHI[lasoData.daiVanHienTai.cungPos] + " (" + (lasoData.cungMap[lasoData.daiVanHienTai.cungPos] || "") + ") " + lasoData.daiVanHienTai.tuoiFrom + "-" + lasoData.daiVanHienTai.tuoiTo + " |");
    log("| Tiểu Vận | " + DIA_CHI[lasoData.tieuVan.cungPos] + " (" + (lasoData.cungMap[lasoData.tieuVan.cungPos] || "") + ") |");
    log("");

    // === P1: SAO LƯU NIÊN ===
    log("## P1: SAO LƯU NIÊN");
    log("");
    log("| Sao | Cung | Địa Chi | Tính chất |");
    log("|---|---|---|---|");
    var totalLuu = 0;
    for (var ci = 0; ci < 12; ci++) {
        var luuSao = (lasoData.saoMap[ci] || []).filter(function(s) { return s.type === "luu"; });
        luuSao.forEach(function(s) {
            var nature = s.nature === "cat" ? "Cát (+)" : (s.nature === "hung" ? "Hung (-)" : "Trung (~)");
            log("| " + s.name + " | " + (lasoData.cungMap[ci] || "") + " | " + DIA_CHI[ci] + " | " + nature + " |");
            totalLuu++;
        });
    }
    log("");
    log("**Tổng sao lưu:** " + totalLuu);
    log("");

    // === P2: LƯU TỨ HÓA ===
    log("## P2: LƯU TỨ HÓA LUẬN GIẢI");
    log("");
    if (luuNien.luuTuHoa && luuNien.luuTuHoa.length > 0) {
        luuNien.luuTuHoa.forEach(function(h) {
            var icon = h.isVeryGood ? "🌟" : (h.isNegative ? "⚠" : "📌");
            log("### " + icon + " " + h.hoaName + ": " + h.saoName + " → " + h.cungName + " (" + h.chiName + ")");
            log("");
            log(h.meaning);
            log("");
        });
    }

    // === P3: TRIGGER LOGIC ===
    log("## P3: TRIGGER LOGIC - HUNG TINH OVERLAY");
    log("");
    if (luuNien.hungTinhOverlay.length === 0) {
        log("✅ Không có cung nào bị hung tinh chồng nặng.");
    } else {
        luuNien.hungTinhOverlay.forEach(function(a) {
            log("### " + a.cungName + " (" + a.chiName + ") — " + a.severity.toUpperCase());
            log("");
            log(a.description);
            log("");
            log("- **Hung gốc:** " + a.hungGoc.join(", "));
            log("- **Hung lưu:** " + a.hungLuu.join(", "));
            log("- **Tổng hung:** " + a.totalHung + " | **Hệ số nhân:** x" + a.multiplier);
            if (a.hasHoaKy) log("- **Hóa Kỵ gốc:** CÓ");
            if (a.hasLuuHoaKy) log("- **Lưu Hóa Kỵ:** CÓ");
            log("");
        });
    }
    log("");

    // === P4: LƯU THÁI TUẾ ===
    log("## P4: LƯU THÁI TUẾ TƯƠNG TÁC");
    log("");
    if (luuNien.thaiTue) {
        var tt = luuNien.thaiTue;
        log("**Vị trí Thái Tuế:** Cung " + tt.taiTueCung + " (" + tt.taiTueChiName + ")");
        log("");
        if (tt.cungGiai) {
            log("> " + tt.cungGiai);
            log("");
        }
        if (tt.chinhTinhTaiTue.length > 0) {
            log("**Chính tinh tại cung:** " + tt.chinhTinhTaiTue.join(", "));
            log("");
        }
        if (tt.interactions.length > 0) {
            log("### Tương tác:");
            tt.interactions.forEach(function(it) { log("- " + it.description); });
            log("");
        }
        if (tt.daiVanConflict) {
            log("### Đại Vận:");
            log("- " + tt.daiVanConflict.description);
            log("");
        }
        if (tt.tieuVanConflict) {
            log("### Tiểu Vận:");
            log("- " + tt.tieuVanConflict.description);
            log("");
        }
    }

    // === P5: NGUYỆT HẠN ===
    log("## P5: NGUYỆT HẠN 12 THÁNG");
    log("");
    log("| Tháng | Cung | Địa Chi | Can Chi | Energy | Level | Ghi chú |");
    log("|---|---|---|---|---|---|---|");
    if (luuNien.nguyetHan) {
        var levelText = {
            rat_tot: "🌟 Rất tốt",
            tot: "😊 Tốt",
            binh_thuong: "⚖ Bình thường",
            xau: "⚡ Xấu",
            rat_xau: "🛡 Rất xấu"
        };
        luuNien.nguyetHan.forEach(function(m) {
            var flag = "";
            if (m.hasHoaLoc) flag = "💰 Hóa Lộc";
            if (m.hasHoaKy) flag = "⚠ Hóa Kỵ";
            var canChi = m.canChiThang ? (m.canChiThang.full || "") : "";
            log("| T" + (m.thang < 10 ? "0" : "") + m.thang + " | " + m.cungName + " | " + m.chiName + " | " + canChi + " | " + m.energy + "/100 | " + (levelText[m.level] || m.level) + " | " + flag + " |");
        });
    }
    log("");

    // Energy chart
    log("### Biểu đồ năng lượng");
    log("");
    log("\\x60\\x60\\x60");
    if (luuNien.nguyetHan) {
        luuNien.nguyetHan.forEach(function(m) {
            var bar = "";
            for (var b = 0; b < Math.floor(m.energy / 5); b++) bar += "#";
            for (var b2 = bar.length; b2 < 20; b2++) bar += ".";
            var flag = m.hasHoaLoc ? " LOC" : (m.hasHoaKy ? " KY!" : "");
            log("T" + (m.thang < 10 ? "0" : "") + m.thang + " [" + bar + "] " + m.energy + "/100 " + m.cungName + flag);
        });
    }
    log("\\x60\\x60\\x60");
    log("");

    // === P6: ENERGY SCORE ===
    log("## P6: ENERGY SCORE DASHBOARD");
    log("");
    if (luuNien.energyScore) {
        var es = luuNien.energyScore;
        log("| Trụ | Score | Chi tiết |");
        log("|---|---|---|");
        log("| 💰 Tài Chính | **" + es.taiChinh.score + "/100** | " + es.taiChinh.details.map(function(d) { return d.house + ":" + d.score; }).join(", ") + " |");
        log("| ❤ Sức Khỏe | **" + es.sucKhoe.score + "/100** | " + es.sucKhoe.details.map(function(d) { return d.house + ":" + d.score; }).join(", ") + " |");
        log("| 💕 Tình Cảm | **" + es.tinhCam.score + "/100** | " + es.tinhCam.details.map(function(d) { return d.house + ":" + d.score; }).join(", ") + " |");
        log("| **OVERALL** | **" + es.overall + "/100** | |");
        log("");
    }

    // === EVENT SCANNER ===
    log("## SỰ KIỆN PHÁT HIỆN (Event Scanner)");
    log("");
    log("**Tổng:** " + eventScan.events.length + " events, " + eventScan.patterns.length + " patterns");
    log("");
    if (eventScan.events.length > 0) {
        log("| # | Severity | Tên | Score | Cung | Sao |");
        log("|---|---|---|---|---|---|");
        eventScan.events.forEach(function(e, idx) {
            var sev = e.severity === "critical" ? "🔴" : (e.severity === "important" ? "🟠" : "🔵");
            log("| " + (idx+1) + " | " + sev + " " + e.severity + " | " + e.name + " | " + e.score + " | " + (e.primaryCungName || "") + " | " + (e.matchedStars || []).join(", ") + " |");
        });
        log("");
    }

    if (eventScan.patterns && eventScan.patterns.length > 0) {
        log("### Patterns");
        log("");
        eventScan.patterns.forEach(function(p) {
            log("- **" + p.patternName + "** tại " + p.cungName + ": " + (p.effect || ""));
        });
        log("");
    }

    // Summary
    if (eventScan.summary) {
        log("### Tóm tắt");
        log("");
        log("- Rating: " + (eventScan.summary.rating || "-") + "/5");
        if (eventScan.summary.overallText) log("- " + eventScan.summary.overallText);
        log("");
    }

    log("---");
    log("");
    log("_Test hoàn thành. Output từ test-tuvi-full.js chạy trong Docker container._");

    // Return both JSON + Markdown
    return { json: jsonOutput, markdown: md.join("\\n") };
})();`;

const result = vm.runInContext(testCode, sandbox, { filename: 'test-full' });

// Write JSON
const jsonPath = path.join(__dirname, 'data', 'test-output.json');
fs.writeFileSync(jsonPath, JSON.stringify(result.json, null, 2), 'utf8');
console.log('\n✅ JSON -> ' + jsonPath);

// Write Markdown
const mdContent = result.markdown.replace(/\\n/g, '\n').replace(/\\x60/g, '`');
const mdPath = path.join(__dirname, 'data', 'test-output.md');
fs.writeFileSync(mdPath, mdContent, 'utf8');
console.log('✅ Markdown -> ' + mdPath);

// Summary
console.log('\n========== SUMMARY ==========');
console.log('Sao lưu niên: ' + Object.keys(result.json.saoMap).reduce((sum, k) => sum + result.json.saoMap[k].filter(s => s.type === 'luu').length, 0));
console.log('Nguyệt Hạn: ' + (result.json.nguyetHan ? result.json.nguyetHan.length + ' tháng' : 'NONE'));
console.log('Lưu Tứ Hóa: ' + (result.json.luuNienAnalysis.luuTuHoa ? result.json.luuNienAnalysis.luuTuHoa.length + ' hóa' : 'NONE'));
console.log('Hung Overlay: ' + result.json.luuNienAnalysis.hungTinhOverlay.length + ' cung');
console.log('Energy Score: ' + (result.json.luuNienAnalysis.energyScore ? result.json.luuNienAnalysis.energyScore.overall + '/100' : 'NONE'));
console.log('Events: ' + result.json.eventScan.totalEvents);
console.log('Patterns: ' + result.json.eventScan.totalPatterns);
console.log('=============================');
