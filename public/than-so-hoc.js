/**
 * ============================================
 * THẦN SỐ HỌC (NUMEROLOGY) - ENGINE
 * Theo phương pháp Pythagoras
 * Tham khảo: Lê Đỗ Quỳnh Hương / David A. Phillips
 * ============================================
 */

const ThanSoHoc = (function () {
    'use strict';

    // =====================
    // BẢNG QUY ĐỔI CHỮ CÁI → SỐ (Pythagoras)
    // =====================
    const LETTER_MAP = {
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
        'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
        's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
    };

    // Nguyên âm tiếng Việt (bỏ dấu)
    const VOWELS = ['a', 'e', 'i', 'o', 'u', 'y'];

    // Master Numbers - không rút gọn
    const MASTER_NUMBERS = [11, 22, 33];

    /**
     * Xử lý tên tiếng Việt: bỏ dấu, chuyển thường
     */
    function removeVietnameseDiacritics(str) {
        const diacritics = {
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
     * Rút gọn số về 1 chữ số (giữ Master Number nếu cần)
     */
    function reduceToSingleDigit(num, keepMaster = true) {
        while (num > 9) {
            if (keepMaster && MASTER_NUMBERS.includes(num)) return num;
            num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
        }
        return num;
    }

    /**
     * Cộng tổng các chữ số
     */
    function sumDigits(num) {
        return String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
    }

    // =====================
    // 1. SỐ CHỦ ĐẠO (Life Path Number)
    // =====================
    function calcLifePath(day, month, year) {
        const d = reduceToSingleDigit(day, false);
        const m = reduceToSingleDigit(month, false);
        const y = reduceToSingleDigit(sumDigits(year), false);
        const total = d + m + y;
        return reduceToSingleDigit(total, true);
    }

    // =====================
    // 2. SỐ NGÀY SINH (Birth Day Number)
    // =====================
    function calcBirthDay(day) {
        return reduceToSingleDigit(day, true);
    }

    // =====================
    // 3. SỐ THÁI ĐỘ (Attitude Number)
    // =====================
    function calcAttitude(day, month) {
        const total = reduceToSingleDigit(day, false) + reduceToSingleDigit(month, false);
        return reduceToSingleDigit(total, false);
    }

    // =====================
    // 4. SỐ LINH HỒN (Soul Urge / Heart's Desire)
    // Tính từ nguyên âm trong họ tên
    // =====================
    function calcSoulUrge(fullName) {
        const clean = removeVietnameseDiacritics(fullName);
        let sum = 0;
        for (const c of clean) {
            if (VOWELS.includes(c) && LETTER_MAP[c]) {
                sum += LETTER_MAP[c];
            }
        }
        return reduceToSingleDigit(sum, true);
    }

    // =====================
    // 5. SỐ NHÂN CÁCH (Personality Number)
    // Tính từ phụ âm trong họ tên
    // =====================
    function calcPersonality(fullName) {
        const clean = removeVietnameseDiacritics(fullName);
        let sum = 0;
        for (const c of clean) {
            if (!VOWELS.includes(c) && LETTER_MAP[c]) {
                sum += LETTER_MAP[c];
            }
        }
        return reduceToSingleDigit(sum, true);
    }

    // =====================
    // 6. SỐ SỨ MỆNH (Expression / Destiny Number)
    // Tính từ tất cả chữ cái trong họ tên
    // =====================
    function calcExpression(fullName) {
        const clean = removeVietnameseDiacritics(fullName);
        let sum = 0;
        for (const c of clean) {
            if (LETTER_MAP[c]) {
                sum += LETTER_MAP[c];
            }
        }
        return reduceToSingleDigit(sum, true);
    }

    // =====================
    // 7. SỐ TRƯỞNG THÀNH (Maturity Number)
    // = Số Chủ Đạo + Số Sứ Mệnh
    // =====================
    function calcMaturity(lifePath, expression) {
        return reduceToSingleDigit(lifePath + expression, true);
    }

    // =====================
    // 8. NĂM CÁ NHÂN (Personal Year Number)
    // =====================
    function calcPersonalYear(day, month, currentYear) {
        const d = reduceToSingleDigit(day, false);
        const m = reduceToSingleDigit(month, false);
        const y = reduceToSingleDigit(sumDigits(currentYear), false);
        const total = d + m + y;
        return reduceToSingleDigit(total, true);
    }

    // =====================
    // 9. THÁNG CÁ NHÂN (Personal Month)
    // =====================
    function calcPersonalMonth(personalYear, currentMonth) {
        return reduceToSingleDigit(personalYear + currentMonth, false);
    }

    // =====================
    // 10. BIỂU ĐỒ NGÀY SINH (Pythagorean Birth Chart 3x3)
    // Layout:
    //   3  6  9
    //   2  5  8
    //   1  4  7
    // =====================
    function calcBirthChart(day, month, year) {
        const chart = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
        const dateStr = String(day) + String(month) + String(year);

        for (const d of dateStr) {
            const num = parseInt(d);
            if (num >= 1 && num <= 9) {
                chart[num]++;
            }
            // 0 bị bỏ qua
        }

        return chart;
    }

    // =====================
    // 11. MŨI TÊN CÁ TÍNH (Arrows of Personality)
    // =====================
    function calcArrows(birthChart) {
        const arrows = [];

        // Định nghĩa tất cả 8 mũi tên
        const arrowDefs = [
            // Hàng ngang
            { nums: [1, 2, 3], nameStrength: 'Mũi tên Kế hoạch', nameWeakness: 'Mũi tên Hỗn loạn', type: 'row' },
            { nums: [4, 5, 6], nameStrength: 'Mũi tên Ý chí', nameWeakness: 'Mũi tên Uất giận', type: 'row' },
            { nums: [7, 8, 9], nameStrength: 'Mũi tên Hoạt động', nameWeakness: 'Mũi tên Thụ động', type: 'row' },
            // Hàng dọc
            { nums: [1, 4, 7], nameStrength: 'Mũi tên Thực tế', nameWeakness: 'Mũi tên Viển vông', type: 'col' },
            { nums: [2, 5, 8], nameStrength: 'Mũi tên Cân bằng Cảm xúc', nameWeakness: 'Mũi tên Nhạy cảm Quá mức', type: 'col' },
            { nums: [3, 6, 9], nameStrength: 'Mũi tên Trí tuệ', nameWeakness: 'Mũi tên Trí nhớ Kém', type: 'col' },
            // Đường chéo
            { nums: [1, 5, 9], nameStrength: 'Mũi tên Quyết tâm', nameWeakness: 'Mũi tên Do dự', type: 'diag' },
            { nums: [3, 5, 7], nameStrength: 'Mũi tên Tâm linh', nameWeakness: 'Mũi tên Hoài nghi', type: 'diag' },
        ];

        for (const def of arrowDefs) {
            const allPresent = def.nums.every(n => birthChart[n] > 0);
            const allAbsent = def.nums.every(n => birthChart[n] === 0);

            if (allPresent) {
                arrows.push({
                    nums: def.nums,
                    name: def.nameStrength,
                    isStrength: true,
                    type: def.type
                });
            } else if (allAbsent) {
                arrows.push({
                    nums: def.nums,
                    name: def.nameWeakness,
                    isStrength: false,
                    type: def.type
                });
            }
        }

        return arrows;
    }

    // =====================
    // 12. SỐ THIẾU & SỐ CÓ (Missing & Present Numbers)
    // =====================
    function calcMissingNumbers(birthChart) {
        const missing = [];
        const present = [];
        const dominant = [];

        for (let i = 1; i <= 9; i++) {
            if (birthChart[i] === 0) {
                missing.push(i);
            } else {
                present.push(i);
                if (birthChart[i] >= 2) {
                    dominant.push({ num: i, count: birthChart[i] });
                }
            }
        }

        return { missing, present, dominant };
    }

    // =====================
    // 13. CHU KỲ ĐỈNH CAO (Pinnacle Cycles)
    // Công thức chuẩn:
    // - Pinnacle 1: Từ sinh đến tuổi (36 - lifePath), số = day + month
    // - Pinnacle 2: 9 năm tiếp, số = day + year
    // - Pinnacle 3: 9 năm tiếp, số = pinnacle1 + pinnacle2
    // - Pinnacle 4: Từ đó trở đi, số = month + year
    // =====================
    function calcPinnacles(day, month, year) {
        const d = reduceToSingleDigit(day, false);
        const m = reduceToSingleDigit(month, false);
        const y = reduceToSingleDigit(sumDigits(year), false);
        const lifePath = calcLifePath(day, month, year);

        // Tuổi kết thúc Pinnacle 1: 36 - Life Path (rút gọn về 1 chữ số)
        const firstEnd = 36 - reduceToSingleDigit(lifePath, false);

        const p1Num = reduceToSingleDigit(d + m, true);
        const p2Num = reduceToSingleDigit(d + y, true);
        const p3Num = reduceToSingleDigit(p1Num + p2Num, true);
        const p4Num = reduceToSingleDigit(m + y, true);

        const pinnacles = [
            {
                number: p1Num,
                startAge: 0,
                endAge: firstEnd,
                startYear: year,
                endYear: year + firstEnd
            },
            {
                number: p2Num,
                startAge: firstEnd + 1,
                endAge: firstEnd + 9,
                startYear: year + firstEnd + 1,
                endYear: year + firstEnd + 9
            },
            {
                number: p3Num,
                startAge: firstEnd + 10,
                endAge: firstEnd + 18,
                startYear: year + firstEnd + 10,
                endYear: year + firstEnd + 18
            },
            {
                number: p4Num,
                startAge: firstEnd + 19,
                endAge: null,
                startYear: year + firstEnd + 19,
                endYear: null
            }
        ];

        return pinnacles;
    }

    // =====================
    // 14. CHỈ SỐ THÁCH THỨC (Challenge Numbers)
    // =====================
    function calcChallenges(day, month, year) {
        const d = reduceToSingleDigit(day, false);
        const m = reduceToSingleDigit(month, false);
        const y = reduceToSingleDigit(sumDigits(year), false);

        const c1 = Math.abs(m - d);
        const c2 = Math.abs(d - y);
        const c3 = Math.abs(c1 - c2);
        const c4 = Math.abs(m - y);

        return [
            { label: 'Thách thức 1', number: c1 },
            { label: 'Thách thức 2', number: c2 },
            { label: 'Thách thức 3', number: c3 },
            { label: 'Thách thức 4', number: c4 }
        ];
    }

    // =====================
    // 15. CHỈ SỐ CẦU NỐI (Bridge Numbers)
    // Khoảng cách giữa các chỉ số chính
    // =====================
    function calcBridgeNumbers(lifePath, expression, soulUrge, personality) {
        return [
            { label: 'Cầu nối Đường đời - Sứ mệnh', number: Math.abs(lifePath - expression) },
            { label: 'Cầu nối Linh hồn - Nhân cách', number: Math.abs(soulUrge - personality) },
        ];
    }

    // =====================
    // TỔNG HỢP: Tính toán tất cả
    // =====================
    function calculate(params) {
        const { day, month, year, fullName, currentYear } = params;

        // Core numbers
        const lifePath = calcLifePath(day, month, year);
        const birthDay = calcBirthDay(day);
        const attitude = calcAttitude(day, month);
        const soulUrge = calcSoulUrge(fullName);
        const personality = calcPersonality(fullName);
        const expression = calcExpression(fullName);
        const maturity = calcMaturity(lifePath, expression);
        const personalYear = calcPersonalYear(day, month, currentYear);

        // Birth Chart
        const birthChart = calcBirthChart(day, month, year);
        const arrows = calcArrows(birthChart);
        const { missing, present, dominant } = calcMissingNumbers(birthChart);

        // Cycles
        const pinnacles = calcPinnacles(day, month, year);
        const challenges = calcChallenges(day, month, year);
        const bridgeNumbers = calcBridgeNumbers(lifePath, expression, soulUrge, personality);

        // Tuổi hiện tại
        const currentAge = currentYear - year;

        // Xác định Chu kỳ Đỉnh cao hiện tại
        let currentPinnacle = pinnacles[0];
        for (const p of pinnacles) {
            if (p.endAge === null || currentAge <= p.endAge) {
                currentPinnacle = p;
                break;
            }
        }

        // Tính Năm Cá Nhân cho 11 năm: 5 năm trước + hiện tại + 5 năm sau
        const personalYearTimeline = [];
        for (let y = currentYear - 5; y <= currentYear + 5; y++) {
            personalYearTimeline.push({
                year: y,
                number: calcPersonalYear(day, month, y),
                isCurrent: y === currentYear
            });
        }

        return {
            // Input
            fullName,
            day,
            month,
            year,
            currentYear,
            currentAge,

            // Core Numbers
            lifePath,
            birthDay,
            attitude,
            soulUrge,
            personality,
            expression,
            maturity,
            personalYear,

            // Chart
            birthChart,
            arrows,
            missingNumbers: missing,
            presentNumbers: present,
            dominantNumbers: dominant,

            // Cycles
            pinnacles,
            currentPinnacle,
            challenges,
            bridgeNumbers,

            // Personal Year Timeline (5 năm trước + hiện tại + 5 năm sau)
            personalYearTimeline,

            // Helper: name breakdown
            nameBreakdown: getNameBreakdown(fullName)
        };
    }

    /**
     * Chi tiết phân tích tên → số
     */
    function getNameBreakdown(fullName) {
        const clean = removeVietnameseDiacritics(fullName);
        const letters = [];

        for (const c of clean) {
            if (LETTER_MAP[c]) {
                letters.push({
                    original: c,
                    value: LETTER_MAP[c],
                    isVowel: VOWELS.includes(c)
                });
            }
        }

        return letters;
    }

    // Public API
    return {
        calculate,
        calcLifePath,
        calcBirthDay,
        calcSoulUrge,
        calcPersonality,
        calcExpression,
        calcPersonalYear,
        reduceToSingleDigit,
        removeVietnameseDiacritics,
        LETTER_MAP,
        VOWELS
    };

})();
