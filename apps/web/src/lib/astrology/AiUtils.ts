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
        return {
            name: p.cungName,
            loc: p.chiName,
            ts: p.truongSinh,
            // Rút gọn sao
            ct: (p.chinhTinh || []).map((s: any) => _compactStar(s)),
            pt: (p.phuTinh || []).map((s: any) => _compactStar(s)),
            tt: p.tuanTriet // Tuần Triệt
        };
    });

    return {
        info: {
            name: chart.hoTen,
            sex: chart.amDuong,
            dob: chart.input,
            lunar: chart.lunarDate,
            nap_am: chart.menhNapAm,
            h_menh: chart.hanhMenh,
            cuc: chart.cucName,
            phi: chart.cungPhi,
            cm: chart.chuMenh,
            ct: chart.chuThan,
            cc: {
                n: chart.canChiNam?.full,
                t: chart.canChiThang?.full,
                ng: chart.canChiNgay?.full,
                g: chart.canChiGio?.full,
                nx: chart.canChiNamXem?.full
            }
        },
        p: compressedPalaces, // Palaces
        dv: chart.daiVan?.map((d: any) => ({ f: d.tuoiFrom, t: d.tuoiTo, p: d.cungPos })), // Dai Van
        vh: chart.vanHan, // Van Han
        ln_pos: chart.luuNienPos,
        tuoi: chart.tuoi,
        num: chart.numerology ? {
            lp: chart.numerology.lifePath,
            py: chart.numerology.personalYear,
            arrows: chart.numerology.arrows?.map((a: any) => a.name)
        } : undefined
    };
}

function _compactStar(s: any) {
    const res: any = { s: s.name }; // s = star name
    if (s.nature && s.nature !== 'trung') res.n = s.nature === 'cat' ? '+' : '-'; // n = nature (+/-)
    if (s.hoa) res.h = s.hoa; // h = hoa (năm sinh)
    if (s.luuHoa) res.lh = s.luuHoa; // lh = lưu hóa (năm xem)
    if (s.status) res.st = s.status[0]; // st = status (m/v/d/b/h)
    if (s.hanh) {
        const h = s.hanh[0];
        res.ah = (s.hanh === 'Thổ') ? 'O' : h; // Thổ -> O to avoid collision with Thủy (T)
    }
    return res;
}
