/**
 * THẦN SỐ HỌC (NUMEROLOGY) - ENGINE
 * Theo phương pháp Pythagoras
 */

const LETTER_MAP: Record<string, number> = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
};

const VOWELS = ['a', 'e', 'i', 'o', 'u', 'y'];
const MASTER_NUMBERS = [11, 22, 33];

/**
 * Xử lý tên tiếng Việt: bỏ dấu, chuyển thường
 */
function removeVietnameseDiacritics(str: string): string {
    const diacritics: Record<string, string> = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        'À': 'a', 'Á': 'a', 'Ả': 'a', 'Ã': 'a', 'Ạ': 'a',
        'Ă': 'a', 'Ằ': 'a', 'Ắ': 'a', 'Ẳ': 'a', 'Ẵ': 'a', 'Ặ': 'a',
        'Â': 'a', 'Ầ': 'a', 'Ấ': 'a', 'Ẩ': 'a', 'Ẫ': 'a', 'Ậ': 'a',
        'È': 'e', 'É': 'e', 'Ẻ': 'e', 'Ẽ': 'e', 'Ẹ': 'e',
        'Ê': 'e', 'Ề': 'e', 'Ế': 'e', 'Ể': 'e', 'Ễ': 'e', 'Ệ': 'e',
        'Ì': 'i', 'Í': 'i', 'Ỉ': 'i', 'Ĩ': 'i', 'Ị': 'i',
        'Ò': 'o', 'Ó': 'o', 'Ỏ': 'o', 'Õ': 'o', 'Ọ': 'o',
        'Ô': 'o', 'Ồ': 'o', 'Ố': 'o', 'Ổ': 'o', 'Ỗ': 'o', 'Ộ': 'o',
        'Ơ': 'o', 'Ờ': 'o', 'Ớ': 'o', 'Ở': 'o', 'Ỡ': 'o', 'Ợ': 'o',
        'Ù': 'u', 'Ú': 'u', 'Ủ': 'u', 'Ũ': 'u', 'Ụ': 'u',
        'Ư': 'u', 'Ừ': 'u', 'Ứ': 'u', 'Ử': 'u', 'Ữ': 'u', 'Ự': 'u',
        'Ỳ': 'y', 'Ý': 'y', 'Ỷ': 'y', 'Ỹ': 'y', 'Ỵ': 'y',
        'Đ': 'd'
    };

    return str.split('').map(c => diacritics[c] || c).join('').toLowerCase();
}

/**
 * Cộng tổng các chữ số
 */
function sumDigits(num: number | string): number {
    return String(num).split('').reduce((sum, d) => {
        const parsed = parseInt(d);
        return isNaN(parsed) ? sum : sum + parsed;
    }, 0);
}

/**
 * Rút gọn số về 1 chữ số (giữ Master Number nếu cần)
 */
function reduceToSingleDigit(num: number, keepMaster = true): number {
    let result = num;
    while (result > 9) {
        if (keepMaster && MASTER_NUMBERS.includes(result)) return result;
        result = sumDigits(result);
    }
    return result;
}

export interface NumerologyResult {
    lifePath: number;
    birthDay: number;
    attitude: number;
    soulUrge: number;
    personality: number;
    expression: number;
    maturity: number;
    personalYear: number;
    birthChart: Record<number, number>;
    arrows: { nums: number[]; name: string; isStrength: boolean }[];
    missingNumbers: number[];
    presentNumbers: number[];
    pinnacles: { number: number; startAge: number; endAge: number | null }[];
}

export class Numerology {
    static calculate(params: {
        day: number;
        month: number;
        year: number;
        fullName: string;
        currentYear?: number;
    }): NumerologyResult {
        const { day, month, year, fullName, currentYear = new Date().getFullYear() } = params;

        const lp = this.calcLifePath(day, month, year);
        const bd = this.calcBirthDay(day);
        const at = this.calcAttitude(day, month);
        const su = this.calcSoulUrge(fullName);
        const pn = this.calcPersonality(fullName);
        const ex = this.calcExpression(fullName);
        const mt = this.calcMaturity(lp, ex);
        const py = this.calcPersonalYear(day, month, currentYear);

        const birthChart = this.calcBirthChart(day, month, year);
        const arrows = this.calcArrows(birthChart);
        
        const missingNumbers: number[] = [];
        const presentNumbers: number[] = [];
        for (let i = 1; i <= 9; i++) {
            if (birthChart[i] === 0) missingNumbers.push(i);
            else presentNumbers.push(i);
        }

        const pinnacles = this.calcPinnacles(day, month, year);

        return {
            lifePath: lp,
            birthDay: bd,
            attitude: at,
            soulUrge: su,
            personality: pn,
            expression: ex,
            maturity: mt,
            personalYear: py,
            birthChart,
            arrows,
            missingNumbers,
            presentNumbers,
            pinnacles
        };
    }

    private static calcLifePath(d: number, m: number, y: number): number {
        const sumD = reduceToSingleDigit(d, false);
        const sumM = reduceToSingleDigit(m, false);
        const sumY = reduceToSingleDigit(sumDigits(y), false);
        return reduceToSingleDigit(sumD + sumM + sumY, true);
    }

    private static calcBirthDay(d: number): number {
        return reduceToSingleDigit(d, true);
    }

    private static calcAttitude(d: number, m: number): number {
        return reduceToSingleDigit(reduceToSingleDigit(d, false) + reduceToSingleDigit(m, false), false);
    }

    private static calcSoulUrge(name: string): number {
        const clean = removeVietnameseDiacritics(name);
        let sum = 0;
        for (const c of clean) {
            if (VOWELS.includes(c) && LETTER_MAP[c]) sum += LETTER_MAP[c];
        }
        return reduceToSingleDigit(sum, true);
    }

    private static calcPersonality(name: string): number {
        const clean = removeVietnameseDiacritics(name);
        let sum = 0;
        for (const c of clean) {
            if (!VOWELS.includes(c) && LETTER_MAP[c]) sum += LETTER_MAP[c];
        }
        return reduceToSingleDigit(sum, true);
    }

    private static calcExpression(name: string): number {
        const clean = removeVietnameseDiacritics(name);
        let sum = 0;
        for (const c of clean) {
            if (LETTER_MAP[c]) sum += LETTER_MAP[c];
        }
        return reduceToSingleDigit(sum, true);
    }

    private static calcMaturity(lp: number, ex: number): number {
        return reduceToSingleDigit(lp + ex, true);
    }

    private static calcPersonalYear(d: number, m: number, cy: number): number {
        const sumD = reduceToSingleDigit(d, false);
        const sumM = reduceToSingleDigit(m, false);
        const sumY = reduceToSingleDigit(sumDigits(cy), false);
        return reduceToSingleDigit(sumD + sumM + sumY, true);
    }

    private static calcBirthChart(d: number, m: number, y: number): Record<number, number> {
        const res: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
        const s = `${d}${m}${y}`;
        for (const c of s) {
            const n = parseInt(c);
            if (n >= 1 && n <= 9) res[n]++;
        }
        return res;
    }

    private static calcArrows(chart: Record<number, number>) {
        const arrows: { nums: number[]; name: string; isStrength: boolean }[] = [];
        const defs = [
            { nums: [1, 2, 3], s: 'Mũi tên Kế hoạch', w: 'Mũi tên Hỗn loạn' },
            { nums: [4, 5, 6], s: 'Mũi tên Ý chí', w: 'Mũi tên Uất giận' },
            { nums: [7, 8, 9], s: 'Mũi tên Hoạt động', w: 'Mũi tên Thụ động' },
            { nums: [1, 4, 7], s: 'Mũi tên Thực tế', w: 'Mũi tên Viển vông' },
            { nums: [2, 5, 8], s: 'Mũi tên Cân bằng Cảm xúc', w: 'Mũi tên Nhạy cảm Quá mức' },
            { nums: [3, 6, 9], s: 'Mũi tên Trí tuệ', w: 'Mũi tên Trí nhớ Kém' },
            { nums: [1, 5, 9], s: 'Mũi tên Quyết tham', w: 'Mũi tên Do dự' },
            { nums: [3, 5, 7], s: 'Mũi tên Tâm linh', w: 'Mũi tên Hoài nghi' }
        ];

        for (const d of defs) {
            if (d.nums.every(n => chart[n] > 0)) {
                arrows.push({ nums: d.nums, name: d.s, isStrength: true });
            } else if (d.nums.every(n => chart[n] === 0)) {
                arrows.push({ nums: d.nums, name: d.w, isStrength: false });
            }
        }
        return arrows;
    }

    private static calcPinnacles(d: number, m: number, y: number) {
        const sd = reduceToSingleDigit(d, false);
        const sm = reduceToSingleDigit(m, false);
        const sy = reduceToSingleDigit(sumDigits(y), false);
        const lp = this.calcLifePath(d, m, y);
        const firstEnd = 36 - reduceToSingleDigit(lp, false);

        const p1 = reduceToSingleDigit(sd + sm, true);
        const p2 = reduceToSingleDigit(sd + sy, true);
        const p3 = reduceToSingleDigit(p1 + p2, true);
        const p4 = reduceToSingleDigit(sm + sy, true);

        return [
            { number: p1, startAge: 0, endAge: firstEnd },
            { number: p2, startAge: firstEnd + 1, endAge: firstEnd + 9 },
            { number: p3, startAge: firstEnd + 10, endAge: firstEnd + 18 },
            { number: p4, startAge: firstEnd + 19, endAge: null }
        ];
    }
}
