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

type EventType =
    | 'tangSuGiaDinh'
    | 'honNhanDuongSo'
    | 'duongSoCoCon'
    | 'suNghiepPhatPha'
    | 'sucKhoeNguyCap'
    | 'taiSanLon'
    | 'phapLyThiPhi'
    | 'bienDongDiChuyen';

type EventRule = {
    label: string;
    palaces: string[];
    stars: string[];
    riskStars: string[];
    action: string;
    scan?: {
        minAge?: number;
        maxAge?: number;
        yearsBack?: number;
        yearsForward?: number;
    };
};

const EVENT_RULES: Record<EventType, EventRule> = {
    tangSuGiaDinh: {
        label: 'Tang sự gần nhất (ông bà, bố mẹ, vợ/chồng, con cái)',
        palaces: ['PHỤ MẪU', 'PHÚC ĐỨC', 'PHU THÊ', 'TỬ TỨC'],
        stars: ['Thiên Đức', 'Phúc Đức', 'Long Đức', 'Giải Thần', 'Thiên Quan', 'Thiên Phúc'],
        riskStars: ['Tang Môn', 'Lưu Tang Môn', 'Bạch Hổ', 'Lưu Bạch Hổ', 'Thiên Hình', 'Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La'],
        action: 'Ưu tiên phòng tang chế bằng quản trị rủi ro gia đình, chú trọng sức khỏe người thân lớn tuổi.',
    },
    honNhanDuongSo: {
        label: 'Đám cưới / biến cố hôn nhân của đương số',
        palaces: ['PHU THÊ', 'MỆNH', 'PHÚC ĐỨC'],
        stars: ['Thiên Hỷ', 'Hỷ Thần', 'Hồng Loan', 'Đào Hoa', 'Lưu Thiên Hỷ', 'Lưu Hồng Loan', 'Long Trì', 'Phượng Các'],
        riskStars: ['Tang Môn', 'Lưu Tang Môn', 'Kình Dương', 'Đà La', 'Hóa Kỵ', 'Lưu Hóa Kỵ', 'Cự Môn', 'Thiên Hư'],
        action: 'Năm điểm cao phù hợp chốt cam kết; năm xung mạnh cần tách bạch tiền - quyền - ranh giới cảm xúc.',
        scan: { minAge: 16, yearsForward: 3 },
    },
    duongSoCoCon: {
        label: 'Đương số có con / biến cố con cái',
        palaces: ['TỬ TỨC', 'PHU THÊ', 'PHÚC ĐỨC'],
        stars: ['Thiên Hỷ', 'Hỷ Thần', 'Thai Phụ', 'Phong Cáo', 'Long Đức', 'Thiên Phúc'],
        riskStars: ['Tang Môn', 'Lưu Tang Môn', 'Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hóa Kỵ'],
        action: 'Ưu tiên theo dõi sức khỏe sinh sản, canh cửa sổ thuận và chủ động kế hoạch tài chính gia đình.',
        scan: { minAge: 16, yearsForward: 3 },
    },
    suNghiepPhatPha: {
        label: 'Sự nghiệp phất mạnh hoặc phá sản',
        palaces: ['QUAN LỘC', 'TÀI BẠCH', 'THIÊN DI', 'ĐIỀN TRẠCH'],
        stars: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Lộc Tồn', 'Hóa Lộc', 'Hóa Quyền', 'Lưu Lộc Tồn', 'Quốc Ấn'],
        riskStars: ['Hóa Kỵ', 'Lưu Hóa Kỵ', 'Kình Dương', 'Đà La', 'Lưu Kình Dương', 'Lưu Đà La', 'Địa Không', 'Địa Kiếp', 'Đại Hao', 'Tiểu Hao'],
        action: 'Năm điểm cao có thể bứt phá lớn; năm xấu phải bảo toàn dòng tiền và giới hạn đòn bẩy.',
        scan: { minAge: 18, yearsForward: 3 },
    },
    sucKhoeNguyCap: {
        label: 'Sức khỏe chết hụt, biến cố suýt chết',
        palaces: ['TẬT ÁCH', 'MỆNH', 'THIÊN DI', 'PHÚC ĐỨC'],
        stars: ['Thiên Lương', 'Thiên Đồng', 'Thiên Việt', 'Thiên Y', 'Thiếu Âm', 'Thiếu Dương'],
        riskStars: ['Kình Dương', 'Đà La', 'Bạch Hổ', 'Thiên Hình', 'Địa Không', 'Địa Kiếp', 'Linh Tinh', 'Hỏa Tinh', 'Tang Môn', 'Hóa Kỵ'],
        action: 'Năm nguy cấp phải khám chuyên sâu, hạn chế di chuyển rủi ro cao và tuyệt đối tránh quá sức.',
    },
    taiSanLon: {
        label: 'Biến động tài sản lớn (mua/bán/mất mát)',
        palaces: ['TÀI BẠCH', 'ĐIỀN TRẠCH', 'QUAN LỘC'],
        stars: ['Lộc Tồn', 'Hóa Lộc', 'Hóa Quyền', 'Thiên Phủ', 'Vũ Khúc', 'Long Trì', 'Phượng Các'],
        riskStars: ['Đại Hao', 'Tiểu Hao', 'Hóa Kỵ', 'Lưu Hóa Kỵ', 'Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp'],
        action: 'Năm tốt có thể tối ưu tài sản; năm xấu cần khóa rủi ro pháp lý và tránh all-in.',
        scan: { minAge: 18, yearsForward: 3 },
    },
    phapLyThiPhi: {
        label: 'Pháp lý, kiện tụng, thị phi',
        palaces: ['QUAN LỘC', 'THIÊN DI', 'NÔ BỘC', 'MỆNH'],
        stars: ['Giải Thần', 'Thiên Quan', 'Thiên Phúc', 'Văn Xương', 'Văn Khúc'],
        riskStars: ['Quan Phủ', 'Thiên Hình', 'Kình Dương', 'Đà La', 'Hóa Kỵ', 'Lưu Hóa Kỵ', 'Cự Môn', 'Thiên Hư'],
        action: 'Siết hợp đồng và bằng chứng pháp lý; tránh phát ngôn nóng trong năm có điểm xung cao.',
        scan: { minAge: 16, yearsForward: 3 },
    },
    bienDongDiChuyen: {
        label: 'Biến động di chuyển (xuất ngoại/chuyển chỗ ở/tai nạn đường xa)',
        palaces: ['THIÊN DI', 'MỆNH', 'QUAN LỘC'],
        stars: ['Thiên Mã', 'Lưu Thiên Mã', 'Thiên Khôi', 'Thiên Việt', 'Long Đức'],
        riskStars: ['Đà La', 'Lưu Đà La', 'Kình Dương', 'Lưu Kình Dương', 'Bạch Hổ', 'Thiên Hình', 'Địa Không', 'Địa Kiếp'],
        action: 'Năm dịch chuyển mạnh cần quản trị lịch trình, bảo hiểm và kịch bản an toàn khi đi xa.',
    },
};

const EVENT_ORDER: EventType[] = [
    'tangSuGiaDinh',
    'honNhanDuongSo',
    'duongSoCoCon',
    'suNghiepPhatPha',
    'sucKhoeNguyCap',
    'taiSanLon',
    'phapLyThiPhi',
    'bienDongDiChuyen',
];

function uniqueStrings(arr: string[]) {
    return [...new Set(arr.filter(Boolean))];
}

function scoreToLevel(score: number) {
    if (score >= 10) return 'very_high';
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
}

function findCurrentDaiVan(chart: any) {
    const namXem = chart?.input?.namXem;
    const tuoi = chart?.tuoi;
    const daiVan = Array.isArray(chart?.daiVan) ? chart.daiVan : [];
    if (!daiVan.length) return null;

    return daiVan.find((dv: any) => {
        if (typeof namXem === 'number' && typeof dv?.namFrom === 'number' && typeof dv?.namTo === 'number') {
            return namXem >= dv.namFrom && namXem <= dv.namTo;
        }
        if (typeof tuoi === 'number' && typeof dv?.tuoiFrom === 'number' && typeof dv?.tuoiTo === 'number') {
            return tuoi >= dv.tuoiFrom && tuoi <= dv.tuoiTo;
        }
        return false;
    }) || daiVan[0];
}

function calcLuuNienPos(year: number) {
    return (year + 8) % 12;
}

function calcTieuVanPos(chiNamSinh: number, gioiTinh: string, tuoi: number) {
    const startMap: Record<number, number> = {
        0: 10, 1: 7, 2: 4, 3: 1, 4: 10, 5: 7,
        6: 4, 7: 1, 8: 10, 9: 7, 10: 4, 11: 1
    };
    const startPos = startMap[chiNamSinh];
    if (startPos === undefined || typeof tuoi !== 'number') return null;
    if (gioiTinh === 'nam') return (startPos + tuoi - 1) % 12;
    return ((startPos - tuoi + 1) % 12 + 12) % 12;
}

function getDaiVanPosByYear(chart: any, year: number) {
    const daiVan = Array.isArray(chart?.daiVan) ? chart.daiVan : [];
    const byYear = daiVan.find((dv: any) => typeof dv?.namFrom === 'number' && typeof dv?.namTo === 'number' && year >= dv.namFrom && year <= dv.namTo);
    if (byYear) return byYear.cungPos;

    const tuoi = chart?.tuoi - (chart?.input?.namXem - year);
    const byAge = daiVan.find((dv: any) => typeof dv?.tuoiFrom === 'number' && typeof dv?.tuoiTo === 'number' && tuoi >= dv.tuoiFrom && tuoi <= dv.tuoiTo);
    return byAge ? byAge.cungPos : null;
}

function getEventScanWindow(chart: any, rule: EventRule, defaultYearsBack: number, defaultYearsForward: number) {
    const namXem = chart?.input?.namXem;
    const tuoiNow = chart?.tuoi;
    if (typeof namXem !== 'number' || typeof tuoiNow !== 'number') {
        return { startYear: null, endYear: null };
    }

    const yearsForward = rule.scan?.yearsForward ?? defaultYearsForward;
    const endYearByForward = namXem + yearsForward;
    const maxAge = rule.scan?.maxAge;
    const endYearByAge = typeof maxAge === 'number'
        ? namXem + (maxAge - tuoiNow)
        : endYearByForward;

    let startYear = namXem - (rule.scan?.yearsBack ?? defaultYearsBack);
    if (typeof rule.scan?.minAge === 'number') {
        startYear = namXem - (tuoiNow - rule.scan.minAge);
    }

    const endYear = Math.min(endYearByForward, endYearByAge);
    return { startYear, endYear };
}

function buildPastWindow(chart: any, yearsBack = 15) {
    const namXem = chart?.input?.namXem;
    const tuoiNow = chart?.tuoi;
    const chiNamSinh = chart?.canChiNam?.chiIndex;
    const gioiTinh = chart?.input?.gioiTinh;
    if (typeof namXem !== 'number' || typeof tuoiNow !== 'number' || typeof chiNamSinh !== 'number') return [];

    const arr = [];
    for (let year = namXem - yearsBack; year <= namXem; year++) {
        const tuoi = tuoiNow - (namXem - year);
        const tieuVanPos = calcTieuVanPos(chiNamSinh, gioiTinh, tuoi);
        arr.push({
            year,
            tuoi,
            tieuVanPos,
            luuNienPos: calcLuuNienPos(year),
            daiVanPos: getDaiVanPosByYear(chart, year),
        });
    }
    return arr;
}

function getPalaceMap(chart: any) {
    const map: Record<string, any> = {};
    for (const p of (chart?.palaces || [])) {
        if (p?.cungName) map[p.cungName] = p;
    }
    return map;
}

function getStarNames(palace: any) {
    const stars = [...(palace?.chinhTinh || []), ...(palace?.phuTinh || [])];
    return stars.map((s: any) => s?.name).filter(Boolean);
}

function getAgeAtYear(chart: any, year: number) {
    const namXem = chart?.input?.namXem;
    const tuoiNow = chart?.tuoi;
    if (typeof namXem !== 'number' || typeof tuoiNow !== 'number') return null;
    return tuoiNow - (namXem - year);
}

function selectEventTopYears(chart: any, rule: EventRule, scored: Array<{
    year: number;
    score: number;
    level: string;
    reasons: string[];
    anchors: { daiVan: boolean; tieuHan: boolean; luuNien: boolean };
    stars: { positive: string[]; risk: string[] };
}>) {
    const byScore = [...scored].sort((a, b) => b.score - a.score).slice(0, 5);
    const earlyAdult = typeof rule.scan?.minAge === 'number'
        ? [...scored]
            .filter((x) => {
                const age = getAgeAtYear(chart, x.year);
                return age !== null && age >= rule.scan!.minAge! && age <= 25;
            })
            .sort((a, b) => b.score - a.score || a.year - b.year)
            .slice(0, 2)
        : [];

    const selected = [...byScore, ...earlyAdult];
    const uniqueByYear = Array.from(new Map(selected.map((x) => [x.year, x])).values());
    return uniqueByYear
        .sort((a, b) => b.score - a.score || Math.abs(a.year - (chart?.input?.namXem || a.year)) - Math.abs(b.year - (chart?.input?.namXem || b.year)))
        .slice(0, 5);
}

function analyzeEvent(chart: any, type: EventType, yearsBack = 15, yearsForward = 3) {
    const namXem = chart?.input?.namXem;
    const tuoiNow = chart?.tuoi;
    const chiNamSinh = chart?.canChiNam?.chiIndex;
    const gioiTinh = chart?.input?.gioiTinh;
    if (typeof namXem !== 'number' || typeof tuoiNow !== 'number' || typeof chiNamSinh !== 'number') {
        return { yearCandidates: [], reasons: ['Thiếu dữ liệu hạn để nội suy sự kiện.'], confidence: 'low' };
    }

    const rule = EVENT_RULES[type];
    const scanWindow = getEventScanWindow(chart, rule, yearsBack, yearsForward);
    const palaceMap = getPalaceMap(chart);
    const targetPalaces = rule.palaces.map((name) => palaceMap[name]).filter(Boolean);
    const targetPos = uniqueStrings(targetPalaces.map((p: any) => String(p.index))).map((v) => parseInt(v, 10));

    const positiveHits: string[] = [];
    const riskHits: string[] = [];
    let positiveStarCount = 0;
    let riskStarCount = 0;
    for (const p of targetPalaces) {
        const stars = getStarNames(p);
        const pos = stars.filter((s) => rule.stars.includes(s));
        const risk = stars.filter((s) => rule.riskStars.includes(s));
        positiveStarCount += pos.length;
        riskStarCount += risk.length;
        if (pos.length) positiveHits.push(`${p.cungName}: ${uniqueStrings(pos).join(', ')}`);
        if (risk.length) riskHits.push(`${p.cungName}: ${uniqueStrings(risk).join(', ')}`);
    }

    const scored: Array<{
        year: number;
        score: number;
        level: string;
        reasons: string[];
        anchors: { daiVan: boolean; tieuHan: boolean; luuNien: boolean };
        stars: { positive: string[]; risk: string[] };
    }> = [];
    const startYear = scanWindow.startYear ?? (namXem - yearsBack);
    const endYear = scanWindow.endYear ?? (namXem + yearsForward);

    for (let year = startYear; year <= endYear; year++) {
        const tuoi = tuoiNow - (namXem - year);
        const tieuVanPos = calcTieuVanPos(chiNamSinh, gioiTinh, tuoi);
        const luuNienPos = calcLuuNienPos(year);
        const daiVanPos = getDaiVanPosByYear(chart, year);
        let score = 0;
        const reasons: string[] = [];

        const tieuHanHit = tieuVanPos !== null && targetPos.includes(tieuVanPos);
        const luuNienHit = targetPos.includes(luuNienPos);
        const daiVanHit = daiVanPos !== null && targetPos.includes(daiVanPos);

        if (tieuHanHit) {
            score += 3;
            reasons.push(`Tiểu hạn vào cung trọng tâm (${chart?.palaces?.[tieuVanPos]?.cungName || tieuVanPos})`);
        }
        if (luuNienHit) {
            score += 2;
            reasons.push(`Lưu niên trùng cung trọng tâm (${chart?.palaces?.[luuNienPos]?.cungName || luuNienPos})`);
        }
        if (daiVanHit) {
            score += 4;
            reasons.push(`Đại vận đi qua cung trọng tâm (${chart?.palaces?.[daiVanPos]?.cungName || daiVanPos})`);
        }

        const starScore = Math.min(3, Math.floor(positiveStarCount / 2)) + Math.min(3, Math.floor(riskStarCount / 2));
        if (starScore > 0) {
            score += starScore;
            reasons.push(`Sao sự kiện hội tụ (${positiveStarCount} cát tinh / ${riskStarCount} hung tinh)`);
        }

        if (score > 0) {
            scored.push({
                year,
                score,
                level: scoreToLevel(score),
                reasons,
                anchors: { daiVan: daiVanHit, tieuHan: tieuHanHit, luuNien: luuNienHit },
                stars: {
                    positive: positiveHits,
                    risk: riskHits,
                },
            });
        }
    }

    scored.sort((a, b) => b.score - a.score || Math.abs(a.year - namXem) - Math.abs(b.year - namXem));
    const top = selectEventTopYears(chart, rule, scored);
    const yearCandidates = top.map((x) => x.year);

    const reasons = uniqueStrings([
        ...positiveHits.map((x) => `Sao hỗ trợ: ${x}`),
        ...riskHits.map((x) => `Sao cảnh báo: ${x}`),
        ...top.flatMap((x) => x.reasons),
    ]).slice(0, 8);

    const maxScore = top.length ? top[0].score : 0;
    const confidence = maxScore >= 8 ? 'high' : maxScore >= 5 ? 'medium' : 'low';

    if (!yearCandidates.length) {
        return {
            label: rule.label,
            yearCandidates: [namXem],
            reasons: ['Thiếu tín hiệu hội tụ mạnh; dùng năm hiện tại làm mốc quan sát.'],
            confidence: 'low',
            yearlyScan: [],
        };
    }

    return {
        label: rule.label,
        yearCandidates,
        reasons,
        confidence,
        maxScore: maxScore,
        severityYear: top[0]?.year || null,
        yearlyScan: scored.map((x) => ({
            year: x.year,
            score: x.score,
            level: x.level,
            anchors: x.anchors,
            stars: x.stars,
            reasons: x.reasons,
        })),
    };
}

export function createEventSignals(chart: any) {
    if (!chart || !chart.palaces) return null;

    const currentYear = chart?.input?.namXem;
    const current = findCurrentDaiVan(chart);
    const eventCatalog = EVENT_ORDER.reduce((acc, eventKey) => {
        acc[eventKey] = analyzeEvent(chart, eventKey, 20, 3);
        return acc;
    }, {} as Record<EventType, any>);

    const eventSignals = {
        currentYear: typeof currentYear === 'number' ? currentYear : null,
        currentDaiVan: current ? {
            namFrom: current.namFrom,
            namTo: current.namTo,
            cungPos: current.cungPos,
        } : null,
        pastWindow: buildPastWindow(chart, 20),
        priorityEvents: eventCatalog,
        eventCatalog,
        eventOrder: EVENT_ORDER,
    };

    return eventSignals;
}

export function buildTopEventsTable(eventSignals: any): string {
    if (!eventSignals?.priorityEvents) return "";
    const currentYear = typeof eventSignals?.currentYear === 'number' ? eventSignals.currentYear : null;
    const lines = EVENT_ORDER.map((eventKey) => {
        const rule = EVENT_RULES[eventKey];
        const payload = eventSignals.priorityEvents[eventKey] || {};
        const yearCandidates = Array.isArray(payload.yearCandidates) ? payload.yearCandidates : [];
        const pastYears = currentYear === null
            ? yearCandidates.slice(0, 2)
            : yearCandidates.filter((y: number) => y <= currentYear).slice(0, 2);
        const futureYears = currentYear === null
            ? []
            : yearCandidates.filter((y: number) => y > currentYear).slice(0, 2);
        const pastText = pastYears.length ? pastYears.join(', ') : 'Chưa rõ';
        const futureText = futureYears.length ? futureYears.join(', ') : 'Chưa rõ';
        const confidence = payload.confidence || 'low';
        const maxScore = typeof payload.maxScore === 'number' ? payload.maxScore : 0;
        const reason = Array.isArray(payload.topReasons) && payload.topReasons.length
            ? payload.topReasons[0]
            : 'Thiếu tín hiệu hội tụ';
        const anchors = payload?.anchors || {};
        const anchorTokens = [
            anchors.daiVan ? 'Đại vận' : '',
            anchors.tieuHan ? 'Tiểu hạn' : '',
            anchors.luuNien ? 'Lưu niên' : '',
        ].filter(Boolean);
        const anchorText = anchorTokens.length ? anchorTokens.join(' + ') : 'Chưa hội tụ đủ 3 lớp hạn';
        return `- ${rule.label}: Kiểm chứng ${pastText} | Dự báo ${futureText} (±1 năm) | ${confidence} (score ${maxScore}) | Căn cứ: ${reason} | Neo hạn: ${anchorText} | Hành động: ${rule.action}`;
    });

    return lines.join('\n');
}

function trimEventForPrompt(eventPayload: any) {
    const yearlyScan = Array.isArray(eventPayload?.yearlyScan) ? eventPayload.yearlyScan : [];
    const yearlyScanTopRaw = yearlyScan
        .filter((x: any) => (x?.score || 0) >= 5)
        .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
        .slice(0, 3);

    const yearlyScanTop = yearlyScanTopRaw
        .map((x: any) => ({
            year: x.year,
            score: x.score,
            level: x.level,
            anchors: x.anchors,
        }));

    const head = yearlyScanTopRaw[0] || yearlyScan[0] || {};
    const eventStars = {
        positive: Array.isArray(head?.stars?.positive) ? head.stars.positive.slice(0, 2) : [],
        risk: Array.isArray(head?.stars?.risk) ? head.stars.risk.slice(0, 2) : [],
    };

    const eventAnchors = {
        daiVan: yearlyScanTopRaw.some((x: any) => x?.anchors?.daiVan),
        tieuHan: yearlyScanTopRaw.some((x: any) => x?.anchors?.tieuHan),
        luuNien: yearlyScanTopRaw.some((x: any) => x?.anchors?.luuNien),
    };

    return {
        label: eventPayload?.label || '',
        severityYear: eventPayload?.severityYear || null,
        maxScore: eventPayload?.maxScore || 0,
        confidence: eventPayload?.confidence || 'low',
        yearCandidates: Array.isArray(eventPayload?.yearCandidates) ? eventPayload.yearCandidates.slice(0, 3) : [],
        topReasons: Array.isArray(eventPayload?.reasons) ? eventPayload.reasons.slice(0, 2) : [],
        stars: eventStars,
        anchors: eventAnchors,
        yearlyScanTop,
    };
}

function compactPastWindowForPrompt(pastWindow: any[]) {
    if (!Array.isArray(pastWindow)) return [];
    return pastWindow.slice(-8).map((x: any) => ({
        year: x.year,
        tuoi: x.tuoi,
        tieuVanPos: x.tieuVanPos,
        luuNienPos: x.luuNienPos,
        daiVanPos: x.daiVanPos,
    }));
}

export function compactEventSignalsForPrompt(eventSignals: any) {
    if (!eventSignals) return null;

    const compactPriority = EVENT_ORDER.reduce((acc, key) => {
        acc[key] = trimEventForPrompt(eventSignals?.priorityEvents?.[key] || {});
        return acc;
    }, {} as Record<EventType, any>);

    return {
        currentYear: eventSignals?.currentYear || null,
        currentDaiVan: eventSignals?.currentDaiVan || null,
        pastWindow: compactPastWindowForPrompt(eventSignals?.pastWindow || []),
        priorityEvents: compactPriority,
        eventOrder: eventSignals?.eventOrder || EVENT_ORDER,
    };
}

function _compress(chart: any) {
    if (!chart || !chart.palaces) return chart;

    const eventSignals = createEventSignals(chart);
    const eventSignalsCompact = compactEventSignalsForPrompt(eventSignals);

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
        dvh: eventSignalsCompact?.currentDaiVan || null,
        pw: eventSignalsCompact?.pastWindow || [],
        es: eventSignalsCompact?.priorityEvents || {},
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
