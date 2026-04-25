// src/lib/astrology/AiUtils.ts

/**
 * Nén dữ liệu lá số Tử Vi để tối ưu Token cho AI.
 * Rút gọn Key và loại bỏ các trường không cần thiết cho việc luận giải.
 */
export function compactAstrologyData(data: any): string {
    if (!data) return "";

    // Nếu là sinh đôi, nén cả hai
    if (data.A && data.B) {
        return JSON.stringify({
            A: _compress(data.A),
            B: _compress(data.B)
        });
    }

    return JSON.stringify(_compress(data));
}

function _compress(chart: any) {
    if (!chart || !chart.palaces) return chart;

    const compressedPalaces = chart.palaces.map((p: any) => {
        let ttStr = "";
        if (p.tuanTriet) {
            const arr = [];
            if (p.tuanTriet.tuan) arr.push("Tuần");
            if (p.tuanTriet.triet) arr.push("Triệt");
            ttStr = arr.join(",");
        }

        const res: any = {
            c: p.cungName,
            l: p.chiName,
            ts: p.truongSinh
        };
        
        if (ttStr) res.tt = ttStr;

        const ct = Array.isArray(p.chinhTinh) ? p.chinhTinh.map((s: any) => _compactStarStr(s)).join(", ") : "";
        if (ct) res.ct = ct;

        const pt = Array.isArray(p.phuTinh) ? p.phuTinh.map((s: any) => _compactStarStr(s)).filter(Boolean).join(", ") : "";
        if (pt) res.pt = pt;

        return res;
    });

    return {
        i: {
            sx: chart.amDuong,
            dl: `${chart.input?.ngay}/${chart.input?.thang}/${chart.input?.nam}`,
            m: chart.menhNapAm,
            cuc: chart.cucName
        },
        p: compressedPalaces,
        dv: chart.daiVan?.map((d: any) => `${d.tuoiFrom}-${d.tuoiTo}(${d.cungPos})`).join("|"),
        ln: chart.luuNienPos,
        age: chart.tuoi
    };
}

function _compactStarStr(s: any): string {
    let str = s.name;
    if (s.brightness && s.brightness !== 'B') {
        str += `(${s.brightness})`;
    }
    if (s.hoa) {
        str += `[${s.hoa.replace("Hóa ", "H.")}]`;
    }
    if (s.luuHoa) {
        str += `[L.${s.luuHoa.replace("Hóa ", "H.")}]`;
    }
    return str;
}
