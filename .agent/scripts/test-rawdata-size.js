/**
 * Test rawdata compact size
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const sandbox = {
    console, Math, parseInt, parseFloat, isNaN, Date, JSON, Array, Object,
    String, Number, Error, RegExp, Map, Set
};
vm.createContext(sandbox);

['am-lich.js', 'tu-vi-calc.js', 'tu-vi-sao.js', 'tu-vi-star-patterns.js'].forEach(m => {
    vm.runInContext(fs.readFileSync(path.join('/app/public', m), 'utf8'), sandbox, { filename: m });
});

const code = `(function() {
    var p = { ngay: 28, thang: 1, nam: 1991, gioSinh: 6, gioiTinh: "nam", namXem: 2026 };
    var d = TuViCalc.calculate(p);
    TuViSao.anSao(d);
    var DC = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

    var compact = {
        gioiTinh: "nam",
        ngaySinh: "1991-01-28",
        gioSinh: 6,
        namXem: 2026,
        amDuong: d.amDuong,
        menhNapAm: d.menhNapAm,
        hanhMenh: d.hanhMenh,
        cucName: d.cucName,
        cungMenh: d.cungMap[d.cungMenhPos] + "(" + DC[d.cungMenhPos] + ")",
        cungThan: d.cungMap[d.cungThanPos] + "(" + DC[d.cungThanPos] + ")",
        thuan: d.thuan,
        cung: {}
    };

    for (var i = 0; i < 12; i++) {
        var pos = (d.cungMenhPos + i) % 12;
        var cungName = d.cungMap[pos];
        var saoList = d.saoMap[pos] || [];
        var chinh = saoList.filter(function(s) { return s.type === "chinh"; }).map(function(s) {
            var label = s.name;
            var st = TuViStarPatterns.getStarStatus(s.name, pos);
            if (st) label += "(" + st + ")";
            if (s.hoa) label += "[" + s.hoa + "]";
            if (s.luuHoa) label += "[Lưu" + s.luuHoa + "]";
            return label;
        });
        var phu = saoList.filter(function(s) { return s.type !== "chinh" && s.type !== "luu"; }).map(function(s) {
            var label = s.name;
            if (s.hoa) label += "[" + s.hoa + "]";
            if (s.luuHoa) label += "[Lưu" + s.luuHoa + "]";
            return label;
        });
        compact.cung[cungName + "(" + DC[pos] + ")"] = {
            chinh: chinh.length > 0 ? chinh.join(", ") : "VCĐ",
            phu: phu.join(", ")
        };
    }

    // Đại vận + Tiểu vận
    var dv = d.daiVanHienTai;
    if (dv) {
        var dvSao = (d.saoMap[dv.cungPos] || []).filter(function(s) { return s.type === "chinh"; }).map(function(s) { return s.name; });
        compact.daiVan = {
            cung: d.cungMap[dv.cungPos] + "(" + DC[dv.cungPos] + ")",
            tuoi: dv.tuoiFrom + "-" + dv.tuoiTo,
            saoChinhTinh: dvSao.join(", ") || "VCĐ"
        };
    }
    var tv = d.tieuVan;
    if (tv) {
        var tvSao = (d.saoMap[tv.cungPos] || []).filter(function(s) { return s.type === "chinh"; }).map(function(s) { return s.name; });
        compact.tieuVan = {
            cung: d.cungMap[tv.cungPos] + "(" + DC[tv.cungPos] + ")",
            tuoi: tv.tuoi,
            saoChinhTinh: tvSao.join(", ") || "VCĐ"
        };
    }

    // Tuần/Triệt
    if (d.tuanTriet) compact.tuanTriet = d.tuanTriet;

    return compact;
})()`;

const result = vm.runInContext(code, sandbox);
const json = JSON.stringify(result, null, 2);
console.log('=== RAWDATA COMPACT ===');
console.log('Size:', json.length, 'chars');
console.log(json);
