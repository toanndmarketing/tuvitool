/**
 * ============================================
 * MODULE ÂM LỊCH - Chuyển đổi Dương lịch sang Âm lịch
 * Thuật toán dựa trên Hồ Ngọc Đức (https://www.informatik.uni-leipzig.de/~duc/amlich/)
 * ============================================
 */

const AmLich = (function () {
    'use strict';

    const PI = Math.PI;

    // Julian Day Number từ ngày dương lịch
    function jdFromDate(dd, mm, yy) {
        let a = Math.floor((14 - mm) / 12);
        let y = yy + 4800 - a;
        let m = mm + 12 * a - 3;
        let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y
            + Math.floor(y / 4) - Math.floor(y / 100)
            + Math.floor(y / 400) - 32045;
        if (jd < 2299161) {
            jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y
                + Math.floor(y / 4) - 32083;
        }
        return jd;
    }

    // Ngày dương lịch từ Julian Day Number
    function jdToDate(jd) {
        let a, b, c, d, e, m, day, month, year;
        if (jd > 2299160) {
            a = jd + 32044;
            b = Math.floor((4 * a + 3) / 146097);
            c = a - Math.floor(146097 * b / 4);
        } else {
            b = 0;
            c = jd + 32082;
        }
        d = Math.floor((4 * c + 3) / 1461);
        e = c - Math.floor(1461 * d / 4);
        m = Math.floor((5 * e + 2) / 153);
        day = e - Math.floor((153 * m + 2) / 5) + 1;
        month = m + 3 - 12 * Math.floor(m / 10);
        year = 100 * b + d - 4800 + Math.floor(m / 10);
        return [day, month, year];
    }

    // Tính New Moon
    function newMoon(k) {
        let T = k / 1236.85;
        let T2 = T * T;
        let T3 = T2 * T;
        let dr = PI / 180;
        let Jd1 = 2415020.75933 + 29.53058868 * k
            + 0.0001178 * T2 - 0.000000155 * T3
            + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
        let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr)
            + 0.0021 * Math.sin(2 * dr * M)
            - 0.4068 * Math.sin(Mpr * dr)
            + 0.0161 * Math.sin(dr * 2 * Mpr)
            - 0.0004 * Math.sin(dr * 3 * Mpr)
            + 0.0104 * Math.sin(dr * 2 * F)
            - 0.0051 * Math.sin(dr * (M + Mpr))
            - 0.0074 * Math.sin(dr * (M - Mpr))
            + 0.0004 * Math.sin(dr * (2 * F + M))
            - 0.0004 * Math.sin(dr * (2 * F - M))
            - 0.0006 * Math.sin(dr * (2 * F + Mpr))
            + 0.0010 * Math.sin(dr * (2 * F - Mpr))
            + 0.0005 * Math.sin(dr * (2 * Mpr + M));
        let dt;
        if (T < -11) {
            dt = 0.001 + 0.000677 * T - 0.0000839 * T2
                + 0.00000587 * T3;
        } else {
            dt = -0.000278 + 0.000265 * T + 0.000262 * T2;
        }
        return Jd1 + C1 - dt;
    }

    // Tọa độ mặt trời (Sun Longitude)
    function sunLongitude(jdn) {
        let T = (jdn - 2451545.0) / 36525;
        let T2 = T * T;
        let dr = PI / 180;
        let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2
            - 0.00000048 * T * T2;
        let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
        let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
            + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M)
            + 0.000290 * Math.sin(dr * 3 * M);
        let L = L0 + DL;
        L = L * dr;
        L = L - PI * 2 * Math.floor(L / (PI * 2));
        return L;
    }

    // Tính Sun Longitude cho ngày JD
    function getSunLongitude(dayNumber, timeZone) {
        return Math.floor(sunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6);
    }

    /**
     * Tính ngày New Moon có điều chỉnh timezone (theo Hồ Ngọc Đức)
     * Trả về JD của ngày mùng 1 âm lịch tại timezone cụ thể
     */
    function getNewMoonDay(k, timeZone) {
        return Math.floor(newMoon(k) + 0.5 + timeZone / 24);
    }

    // Tìm ngày mùng 1 tháng 11 âm lịch
    function getLunarMonth11(yy, timeZone) {
        let off = jdFromDate(31, 12, yy) - 2415021;
        let k = Math.floor(off / 29.530588853);
        let nm = getNewMoonDay(k, timeZone);
        let sunLong = getSunLongitude(nm, timeZone);
        if (sunLong >= 9) {
            nm = getNewMoonDay(k - 1, timeZone);
        }
        return nm;
    }

    // Tìm leap month offset
    function getLeapMonthOffset(a11, timeZone) {
        let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        let last = 0;
        let i = 1;
        let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
        do {
            last = arc;
            i++;
            arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
        } while (arc !== last && i < 14);
        return i - 1;
    }

    /**
     * Chuyển đổi Dương lịch sang Âm lịch
     * @returns {Object} { day, month, year, leap, jd }
     */
    function solarToLunar(dd, mm, yy, timeZone = 7) {
        let dayNumber = jdFromDate(dd, mm, yy);
        let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
        let monthStart = getNewMoonDay(k + 1, timeZone);
        if (monthStart > dayNumber) {
            monthStart = getNewMoonDay(k, timeZone);
        }
        let a11 = getLunarMonth11(yy, timeZone);
        let b11 = a11;
        let lunarYear;
        if (a11 >= monthStart) {
            lunarYear = yy;
            a11 = getLunarMonth11(yy - 1, timeZone);
        } else {
            lunarYear = yy + 1;
            b11 = getLunarMonth11(yy + 1, timeZone);
        }
        let lunarDay = dayNumber - monthStart + 1;
        let diff = Math.floor((monthStart - a11) / 29);
        let lunarLeap = 0;
        let lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff === leapMonthDiff) {
                    lunarLeap = 1;
                }
            }
        }
        if (lunarMonth > 12) {
            lunarMonth = lunarMonth - 12;
        }
        if (lunarMonth >= 11 && diff < 4) {
            lunarYear -= 1;
        }
        return {
            day: lunarDay,
            month: lunarMonth,
            year: lunarYear,
            leap: lunarLeap,
            jd: dayNumber
        };
    }

    // Can Chi
    const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
    const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

    // Prefix short for Dia Chi
    const DIA_CHI_PREFIX = {
        'Tý': 'G.Tí', 'Sửu': 'Á.Sửu', 'Dần': 'G.Dần', 'Mão': 'Á.Mão',
        'Thìn': 'B.Thìn', 'Tỵ': 'Đ.Tỵ', 'Ngọ': 'M.Ngọ', 'Mùi': 'K.Mùi',
        'Thân': 'C.Thân', 'Dậu': 'N.Tuất', 'Tuất': 'N.Tuất', 'Hợi': 'Q.Hợi'
    };

    /**
     * Lấy Can Chi năm
     */
    function getCanChiNam(year) {
        let canIndex = (year + 6) % 10;
        let chiIndex = (year + 8) % 12;
        return {
            can: THIEN_CAN[canIndex],
            chi: DIA_CHI[chiIndex],
            canIndex: canIndex,
            chiIndex: chiIndex,
            full: THIEN_CAN[canIndex] + ' ' + DIA_CHI[chiIndex]
        };
    }

    /**
     * Lấy Can Chi tháng (dựa vào can của năm và tháng âm lịch)
     */
    function getCanChiThang(canNam, thangAL) {
        // Can đầu của tháng Giêng phụ thuộc vào can năm
        // Giáp/Kỷ -> Bính, Ất/Canh -> Mậu, Bính/Tân -> Canh, Đinh/Nhâm -> Nhâm, Mậu/Quý -> Giáp
        let canDauThg1;
        switch (canNam % 5) {
            case 0: canDauThg1 = 2; break; // Giáp/Kỷ -> Bính Dần (tháng 1)
            case 1: canDauThg1 = 4; break; // Ất/Canh -> Mậu Dần
            case 2: canDauThg1 = 6; break; // Bính/Tân -> Canh Dần
            case 3: canDauThg1 = 8; break; // Đinh/Nhâm -> Nhâm Dần
            case 4: canDauThg1 = 0; break; // Mậu/Quý -> Giáp Dần
        }
        let canThang = (canDauThg1 + thangAL - 1) % 10;
        // Chi tháng: tháng 1 = Dần (index 2), tháng 2 = Mão(3)...
        let chiThang = (thangAL + 1) % 12;
        return {
            can: THIEN_CAN[canThang],
            chi: DIA_CHI[chiThang],
            canIndex: canThang,
            chiIndex: chiThang,
            full: THIEN_CAN[canThang] + ' ' + DIA_CHI[chiThang]
        };
    }

    /**
     * Lấy Can Chi ngày (dựa vào JD)
     */
    function getCanChiNgay(jd) {
        let canIndex = (jd + 9) % 10;
        let chiIndex = (jd + 1) % 12;
        return {
            can: THIEN_CAN[canIndex],
            chi: DIA_CHI[chiIndex],
            canIndex: canIndex,
            chiIndex: chiIndex,
            full: THIEN_CAN[canIndex] + ' ' + DIA_CHI[chiIndex]
        };
    }

    /**
     * Lấy Can Chi giờ
     */
    function getCanChiGio(canNgay, chiGio) {
        // Can đầu giờ Tý phụ thuộc can ngày
        let canDauTy;
        switch (canNgay % 5) {
            case 0: canDauTy = 0; break; // Giáp/Kỷ -> Giáp Tý
            case 1: canDauTy = 2; break; // Ất/Canh -> Bính Tý
            case 2: canDauTy = 4; break; // Bính/Tân -> Mậu Tý
            case 3: canDauTy = 6; break; // Đinh/Nhâm -> Canh Tý
            case 4: canDauTy = 8; break; // Mậu/Quý -> Nhâm Tý
        }
        let canGio = (canDauTy + chiGio) % 10;
        return {
            can: THIEN_CAN[canGio],
            chi: DIA_CHI[chiGio],
            canIndex: canGio,
            chiIndex: chiGio,
            full: THIEN_CAN[canGio] + ' ' + DIA_CHI[chiGio]
        };
    }

    /**
     * Chuyển đổi Âm lịch sang Julian Day Number
     */
    function lunarToSolarJd(lDay, lMonth, lYear, lLeap, timeZone = 7) {
        let referenceYear = lMonth >= 11 ? lYear : lYear - 1;
        let a11 = getLunarMonth11(referenceYear, timeZone);
        let b11 = getLunarMonth11(referenceYear + 1, timeZone);
        let off = 0;
        let diff;

        if (lMonth >= 11) diff = lMonth - 11;
        else diff = lMonth + 1;

        if (b11 - a11 > 365) {
            let leapMonthIndex = getLeapMonthOffset(a11, timeZone);
            if (diff > leapMonthIndex || (diff === leapMonthIndex && lLeap)) {
                off = 1;
            }
        }

        let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        let nm = getNewMoonDay(k + diff + off, timeZone);
        return nm + lDay - 1;
    }

    return {
        solarToLunar,
        lunarToSolarJd,
        jdToDate,
        getCanChiNam,
        getCanChiThang,
        getCanChiNgay,
        getCanChiGio,
        jdFromDate,
        THIEN_CAN,
        DIA_CHI,
        DIA_CHI_PREFIX
    };
})();



/**
 * ============================================
 * TỬ VI CALC - Tính toán cơ bản lá số Tử Vi
 * Bao gồm: Mệnh, Thân, Cục, Cung, Tràng Sinh
 * ============================================
 */

const TuViCalc = (function () {
    'use strict';

    // =====================
    // CONSTANTS
    // =====================

    // 12 Cung theo thứ tự Địa Chi (bắt đầu từ Dần - cung Mệnh mặc định)
    const CUNG_NAMES = [
        'MỆNH', 'HUYNH ĐỆ', 'PHU THÊ', 'TỬ TỨC',
        'TÀI BẠCH', 'TẬT ÁCH', 'THIÊN DI', 'NÔ BỘC',
        'QUAN LỘC', 'ĐIỀN TRẠCH', 'PHÚC ĐỨC', 'PHỤ MẪU'
    ];

    // Ngũ Hành Cục
    const NGU_HANH_CUC = {
        2: 'Thuỷ nhị cục',
        3: 'Mộc tam cục',
        4: 'Kim tứ cục',
        5: 'Thổ ngũ cục',
        6: 'Hoả lục cục'
    };

    // Ngũ Hành Mệnh (Nạp Âm)
    const NGU_HANH_MENH = [
        // Giáp Tý, Ất Sửu
        'Hải Trung Kim', 'Hải Trung Kim',
        // Bính Dần, Đinh Mão
        'Lô Trung Hoả', 'Lô Trung Hoả',
        // Mậu Thìn, Kỷ Tỵ
        'Đại Lâm Mộc', 'Đại Lâm Mộc',
        // Canh Ngọ, Tân Mùi
        'Lộ Bàng Thổ', 'Lộ Bàng Thổ',
        // Nhâm Thân, Quý Dậu
        'Kiếm Phong Kim', 'Kiếm Phong Kim',
        // Giáp Tuất, Ất Hợi
        'Sơn Đầu Hoả', 'Sơn Đầu Hoả',
        // Bính Tý, Đinh Sửu
        'Giản Hạ Thuỷ', 'Giản Hạ Thuỷ',
        // Mậu Dần, Kỷ Mão
        'Thành Đầu Thổ', 'Thành Đầu Thổ',
        // Canh Thìn, Tân Tỵ
        'Bạch Lạp Kim', 'Bạch Lạp Kim',
        // Nhâm Ngọ, Quý Mùi
        'Dương Liễu Mộc', 'Dương Liễu Mộc',
        // Giáp Thân, Ất Dậu
        'Tuyền Trung Thuỷ', 'Tuyền Trung Thuỷ',
        // Bính Tuất, Đinh Hợi
        'Ốc Thượng Thổ', 'Ốc Thượng Thổ',
        // Mậu Tý, Kỷ Sửu
        'Tích Lịch Hoả', 'Tích Lịch Hoả',
        // Canh Dần, Tân Mão
        'Tùng Bách Mộc', 'Tùng Bách Mộc',
        // Nhâm Thìn, Quý Tỵ
        'Trường Lưu Thuỷ', 'Trường Lưu Thuỷ',
        // Giáp Ngọ, Ất Mùi
        'Sa Trung Kim', 'Sa Trung Kim',
        // Bính Thân, Đinh Dậu
        'Sơn Hạ Hoả', 'Sơn Hạ Hoả',
        // Mậu Tuất, Kỷ Hợi
        'Bình Địa Mộc', 'Bình Địa Mộc',
        // Canh Tý, Tân Sửu
        'Bích Thượng Thổ', 'Bích Thượng Thổ',
        // Nhâm Dần, Quý Mão
        'Kim Bạc Kim', 'Kim Bạc Kim',
        // Giáp Thìn, Ất Tỵ
        'Phú Đăng Hoả', 'Phú Đăng Hoả',
        // Bính Ngọ, Đinh Mùi
        'Thiên Hà Thuỷ', 'Thiên Hà Thuỷ',
        // Mậu Thân, Kỷ Dậu
        'Đại Trạch Thổ', 'Đại Trạch Thổ',
        // Canh Tuất, Tân Hợi
        'Thoa Xuyến Kim', 'Thoa Xuyến Kim',
        // Nhâm Tý, Quý Sửu
        'Tang Đố Mộc', 'Tang Đố Mộc',
        // Giáp Dần, Ất Mão
        'Đại Khê Thuỷ', 'Đại Khê Thuỷ',
        // Bính Thìn, Đinh Tỵ
        'Sa Trung Thổ', 'Sa Trung Thổ',
        // Mậu Ngọ, Kỷ Mùi
        'Thiên Thượng Hoả', 'Thiên Thượng Hoả',
        // Canh Thân, Tân Dậu
        'Thạch Lựu Mộc', 'Thạch Lựu Mộc',
        // Nhâm Tuất, Quý Hợi
        'Đại Hải Thuỷ', 'Đại Hải Thuỷ'
    ];

    // Tràng Sinh (12 trạng thái)
    const TRUONG_SINH = [
        'Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan',
        'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
    ];

    // =====================
    // HELPER FUNCTIONS
    // =====================

    /**
     * Xác định Âm Dương
     * Nam sinh năm Dương (Can: Giáp, Bính, Mậu, Canh, Nhâm) => Dương Nam
     * Nữ sinh năm Dương => Dương Nữ
     * Nam sinh năm Âm (Can: Ất, Đinh, Kỷ, Tân, Quý) => Âm Nam
     * Nữ sinh năm Âm => Âm Nữ
     */
    function getAmDuong(canNamIndex, gioiTinh) {
        let namDuong = canNamIndex % 2 === 0; // Can chẵn = Dương
        if (gioiTinh === 'nam') {
            return namDuong ? 'Dương Nam' : 'Âm Nam';
        } else {
            return namDuong ? 'Dương Nữ' : 'Âm Nữ';
        }
    }

    /**
     * Kiểm tra thuận/nghịch
     * Dương Nam, Âm Nữ => thuận (true)
     * Âm Nam, Dương Nữ => nghịch (false)
     */
    function isThuan(canNamIndex, gioiTinh) {
        let namDuong = canNamIndex % 2 === 0;
        if (gioiTinh === 'nam') return namDuong;
        else return !namDuong;
    }

    /**
     * Tìm vị trí cung Mệnh
     * Bắt đầu từ cung Dần (tháng 1), đếm thuận theo tháng => cung đó
     * Từ cung đó đếm ngược theo giờ
     *
     * Cách tính: cungMenh = (tháng + 1 - giờ) mod 12
     *   tháng 1 = Dần (index 2)
     *   Ví dụ: tháng 11, giờ Tý(0): Dần+10 = Tý (index 0), Tý-0 = Tý
     *   Tính: (2 + 11 - 1 - 0) = 12 mod 12 = 0 => Tý
     */
    function getCungMenh(thangAL, chiGio) {
        let pos = ((2 + thangAL - 1 - chiGio) % 12 + 12) % 12;
        return pos;
    }

    /**
     * Tìm cung Thân
     * Bắt đầu từ cung Dần (tháng 1), đếm thuận theo tháng
     * Từ cung đó đếm thuận theo giờ
     * Cách tính: cungThan = (tháng + giờ - 1 + 2) mod 12
     */
    function getCungThan(thangAL, chiGio) {
        let pos = ((2 + thangAL - 1 + chiGio) % 12 + 12) % 12;
        return pos;
    }

    /**
     * Xác định Cục (Ngũ Hành Cục)
     * Dựa vào Can năm sinh và vị trí cung Mệnh
     */
    function getCuc(canNamIndex, cungMenhPos) {
        // Can khởi Dần theo can năm:
        // Giáp/Kỷ (0,5)-> Bính(2); Ất/Canh (1,6)-> Mậu(4); Bính/Tân (2,7)-> Canh(6); Đinh/Nhâm (3,8)-> Nhâm(8); Mậu/Quý (4,9)-> Giáp(0)
        const canDanMap = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
        let canDan = canDanMap[canNamIndex];
        
        let offset = (cungMenhPos - 2 + 12) % 12;
        let canCungMenh = (canDan + offset) % 10;
        
        let pos = -1;
        for (let i = 0; i < 60; i++) {
            if (i % 10 === canCungMenh && i % 12 === cungMenhPos) {
                pos = i;
                break;
            }
        }
        
        if (pos === -1 || !NGU_HANH_MENH[pos]) return 2; // Default Thủy nhị cục
        
        let tenMenh = NGU_HANH_MENH[pos];
        
        if (tenMenh.includes('Kim')) return 4;
        if (tenMenh.includes('Mộc')) return 3;
        if (tenMenh.includes('Thuỷ') || tenMenh.includes('Thủy')) return 2;
        if (tenMenh.includes('Hoả') || tenMenh.includes('Hỏa')) return 6;
        if (tenMenh.includes('Thổ')) return 5;
        
        return 2;
    }

    /**
     * Lấy Mệnh (Nạp Âm Ngũ Hành)
     */
    function getMenh(canNamIndex, chiNamIndex) {
        let idx = canNamIndex * 12 + chiNamIndex;
        // Mapping theo chu kỳ 60 Hoa Giáp
        let napAmIndex = (canNamIndex % 10) * 6 + Math.floor(chiNamIndex / 2);
        // Chuẩn hơn: Tính theo Nạp Âm 60 Hoa Giáp
        let hgIndex = ((canNamIndex % 10) + (chiNamIndex % 12)) % 60;
        // Simple approach: use can*12 + chi, then mod 60
        let hg60 = (canNamIndex * 12 + chiNamIndex);
        // Find the position in the 60-year cycle
        // Can cycle: 10, Chi cycle: 12, LCM = 60
        // Position = offset such that canIndex matches and chiIndex matches
        // canIndex = pos % 10, chiIndex = pos % 12
        // We need pos where pos%10 = canIndex and pos%12 = chiIndex
        let pos = -1;
        for (let i = 0; i < 60; i++) {
            if (i % 10 === canNamIndex && i % 12 === chiNamIndex) {
                pos = i;
                break;
            }
        }
        if (pos >= 0 && pos < 60) {
            return NGU_HANH_MENH[pos];
        }
        return 'Không xác định';
    }

    /**
     * Xác định hành của Mệnh từ tên Nạp Âm
     */
    function getHanhMenh(menhStr) {
        if (menhStr.includes('Kim')) return 'Kim';
        if (menhStr.includes('Mộc')) return 'Mộc';
        if (menhStr.includes('Thuỷ') || menhStr.includes('Thủy')) return 'Thuỷ';
        if (menhStr.includes('Hoả') || menhStr.includes('Hỏa')) return 'Hoả';
        if (menhStr.includes('Thổ')) return 'Thổ';
        return '';
    }

    /**
     * Xác định hành của Cục
     */
    function getHanhCuc(cucValue) {
        switch (cucValue) {
            case 2: return 'Thuỷ';
            case 3: return 'Mộc';
            case 4: return 'Kim';
            case 5: return 'Thổ';
            case 6: return 'Hoả';
        }
        return '';
    }

    /**
     * Kiểm tra Âm Dương nghịch lý
     */
    function checkAmDuongNghichLy(canNamIndex, gioiTinh) {
        return !isThuan(canNamIndex, gioiTinh);
    }

    /**
     * Kiểm tra Cục khắc Mệnh
     */
    function checkCucKhacMenh(hanhCuc, hanhMenh) {
        const khac = {
            'Kim': 'Mộc',
            'Mộc': 'Thổ',
            'Thuỷ': 'Hoả',
            'Hoả': 'Kim',
            'Thổ': 'Thuỷ'
        };
        return khac[hanhCuc] === hanhMenh;
    }

    /**
     * Kiểm tra Thân Mệnh đồng cung
     */
    function checkThanMenhDongCung(cungMenh, cungThan) {
        return cungMenh === cungThan;
    }

    /**
     * An vòng Tràng Sinh (12 trạng thái) vào 12 cung
     * Thuỷ cục (2): bắt đầu từ Thân (index 8), thuận
     * Mộc cục (3): bắt đầu từ Hợi (index 11), thuận
     * Kim cục (4): bắt đầu từ Tỵ (index 5), thuận  
     * Thổ cục (5): bắt đầu từ Thân (index 8), thuận
     * Hoả cục (6): bắt đầu từ Dần (index 2), thuận
     * Nếu thuận: đi thuận. Nếu nghịch: đi nghịch
     */
    function anTruongSinh(cucValue, thuan) {
        let startPos;
        switch (cucValue) {
            case 2: startPos = 8; break; // Thuỷ - Thân
            case 3: startPos = 11; break; // Mộc - Hợi
            case 4: startPos = 5; break; // Kim - Tỵ
            case 5: startPos = 8; break; // Thổ - Thân
            case 6: startPos = 2; break; // Hoả - Dần
            default: startPos = 2;
        }

        let result = {};
        for (let i = 0; i < 12; i++) {
            let pos;
            if (thuan) {
                pos = (startPos + i) % 12;
            } else {
                pos = ((startPos - i) % 12 + 12) % 12;
            }
            result[pos] = TRUONG_SINH[i];
        }
        return result;
    }

    /**
     * An Tuần và Triệt
     * Tuần: Tuần Không (2 chi không có can trong tuần 10 ngày)
     * Triệt: Triệt Lộ (2 chi nối giữa 2 tuần)
     */
    function anTuanTriet(canNamIndex, chiNamIndex) {
        // Tuần Không: Tính theo hoa giáp
        let chiDau = ((chiNamIndex - canNamIndex) % 12 + 12) % 12;
        let tuan1 = (chiDau + 10) % 12;
        let tuan2 = (chiDau + 11) % 12;

        // Triệt (Triệt Lộ Không Vong): Phụ thuộc vào Can năm
        // Giáp/Kỷ: Thân, Dậu (8, 9)
        // Ất/Canh: Ngọ, Mùi (6, 7)
        // Bính/Tân: Thìn, Tỵ (4, 5)
        // Đinh/Nhâm: Dần, Mão (2, 3)
        // Mậu/Quý: Tý, Sửu (0, 1)
        const trietMap = [
            [8, 9], [6, 7], [4, 5], [2, 3], [0, 1],
            [8, 9], [6, 7], [4, 5], [2, 3], [0, 1]
        ];
        let triet1 = trietMap[canNamIndex][0];
        let triet2 = trietMap[canNamIndex][1];

        return {
            tuan: [tuan1, tuan2],
            triet: [triet1, triet2]
        };
    }

    /**
     * Xác định Thái Tuế (vị trí năm xem trong 12 cung)
     */
    function getThaiTue(chiNamXem) {
        return chiNamXem;
    }

    /**
     * An 12 cung vào lá số
     * Bắt đầu từ cung Mệnh, đi NGƯỢC CHIỀU KIM ĐỒNG HỒ (theo quy tắc Tử Vi cổ truyền)
     * Mệnh → Huynh Đệ → Phu Thê → Tử Tức → Tài Bạch → Tật Ách → Thiên Di → Nô Bộc → Quan Lộc → Điền Trạch → Phúc Đức → Phụ Mẫu
     */
    function anCung(cungMenhPos) {
        let result = {};
        for (let i = 0; i < 12; i++) {
            let pos = ((cungMenhPos - i) % 12 + 12) % 12;
            result[pos] = CUNG_NAMES[i];
        }
        return result;
    }

    /**
     * Tính tuổi
     */
    function tinhTuoi(namSinh, namXem) {
        return namXem - namSinh + 1; // Tuổi mụ
    }

    // =====================
    // ĐẠI VẬN & TIỂU VẬN
    // =====================

    /**
     * Tính Đại Vận (12 giai đoạn, mỗi giai đoạn 10 năm)
     * Thuận: Mệnh → Phụ Mẫu → Phúc Đức (tăng chi index)
     * Nghịch: Mệnh → Huynh Đệ → Phu Thê (giảm chi index)
     */
    function tinhDaiVan(cucValue, cungMenhPos, thuan, namSinhAL) {
        const daiVanList = [];
        const tuoiBatDau = cucValue;

        for (let i = 0; i < 12; i++) {
            let cungPos;
            if (thuan) {
                cungPos = (cungMenhPos + i) % 12;
            } else {
                cungPos = ((cungMenhPos - i) % 12 + 12) % 12;
            }

            const tuoiFrom = tuoiBatDau + i * 10;
            const tuoiTo = tuoiBatDau + (i + 1) * 10 - 1;
            const namFrom = namSinhAL + tuoiFrom - 1;
            const namTo = namSinhAL + tuoiTo - 1;

            daiVanList.push({
                index: i,
                cungPos: cungPos,
                tuoiFrom: tuoiFrom,
                tuoiTo: tuoiTo,
                namFrom: namFrom,
                namTo: namTo
            });
        }

        return daiVanList;
    }

    /**
     * Tính Tiểu Vận cho năm xem
     * Nam khởi Dần (2), Nữ khởi Thân (8) tại tuổi 1
     * Thuận/Nghịch theo Âm Dương
     */
    function tinhTieuVan(gioiTinh, thuan, namSinhAL, namXem) {
        const tuoi = namXem - namSinhAL + 1;
        const khoi = gioiTinh === 'nam' ? 2 : 8;

        let cungPos;
        if (thuan) {
            cungPos = (khoi + tuoi - 1) % 12;
        } else {
            cungPos = ((khoi - tuoi + 1) % 12 + 12) % 12;
        }

        return { cungPos, tuoi };
    }

    /**
     * Tính Nguyệt Hạn (Tiểu hạn 12 tháng)
     * Khởi tháng Giêng từ cung Tiểu Vận
     * Thuận/Nghịch theo Âm Dương giới tính
     * @param {number} tieuVanPos - Vị trí cung Tiểu Vận
     * @param {boolean} thuan - Thuận hay Nghịch
     * @param {number} namXem - Năm xem
     * @returns {Array} 12 tháng, mỗi tháng: { thang, cungPos, canChiThang }
     */
    function tinhNguyetHan(tieuVanPos, thuan, namXem) {
        const canChiNamXem = AmLich.getCanChiNam(namXem);
        const monthlyFortune = [];

        for (let thang = 1; thang <= 12; thang++) {
            let cungPos;
            if (thuan) {
                cungPos = (tieuVanPos + thang - 1) % 12;
            } else {
                cungPos = ((tieuVanPos - thang + 1) % 12 + 12) % 12;
            }

            // Can Chi của tháng trong năm xem
            const canChiThang = AmLich.getCanChiThang(canChiNamXem.canIndex, thang);

            monthlyFortune.push({
                thang: thang,
                cungPos: cungPos,
                canChiThang: canChiThang
            });
        }

        return monthlyFortune;
    }

    /**
     * Xác định Đại Vận hiện tại theo năm xem
     */
    function getDaiVanHienTai(daiVanList, namXem) {
        for (const dv of daiVanList) {
            if (namXem >= dv.namFrom && namXem <= dv.namTo) {
                return dv;
            }
        }
        return daiVanList[0] || null;
    }

    // =====================
    // MAIN CALCULATION
    // =====================

    /**
     * Tính toán đầy đủ lá số Tử Vi
     * @param {Object} params - { ngay, thang, nam, gioSinh (0-11), gioiTinh, namXem }
     * @returns {Object} Toàn bộ dữ liệu lá số
     */
    function calculate(params) {
        const { ngay, thang, nam, gioSinh, gioiTinh, namXem } = params;

        // 1. Chuyển đổi Âm lịch
        const lunarDate = AmLich.solarToLunar(ngay, thang, nam);

        // 2. Can Chi
        const canChiNam = AmLich.getCanChiNam(lunarDate.year);
        const canChiThang = AmLich.getCanChiThang(canChiNam.canIndex, lunarDate.month);
        const canChiNgay = AmLich.getCanChiNgay(lunarDate.jd);
        const canChiGio = AmLich.getCanChiGio(canChiNgay.canIndex, gioSinh);
        const canChiNamXem = AmLich.getCanChiNam(namXem);

        // 3. Âm Dương
        const amDuong = getAmDuong(canChiNam.canIndex, gioiTinh);
        const thuan = isThuan(canChiNam.canIndex, gioiTinh);

        // 4. Cung Mệnh và Cung Thân
        const cungMenhPos = getCungMenh(lunarDate.month, gioSinh);
        const cungThanPos = getCungThan(lunarDate.month, gioSinh);

        // 5. Cục
        const cucValue = getCuc(canChiNam.canIndex, cungMenhPos);
        const cucName = NGU_HANH_CUC[cucValue];

        // 6. Mệnh (Nạp Âm)
        const menhNapAm = getMenh(canChiNam.canIndex, canChiNam.chiIndex);
        const hanhMenh = getHanhMenh(menhNapAm);
        const hanhCuc = getHanhCuc(cucValue);

        // 7. An cung
        const cungMap = anCung(cungMenhPos);

        // 8. An Tràng Sinh
        const truongSinhMap = anTruongSinh(cucValue, thuan);

        // 9. Tuần Triệt
        const tuanTriet = anTuanTriet(canChiNam.canIndex, canChiNam.chiIndex);

        // 10. Đặc biệt checks
        const amDuongNghichLy = checkAmDuongNghichLy(canChiNam.canIndex, gioiTinh);
        const cucKhacMenh = checkCucKhacMenh(hanhCuc, hanhMenh);
        const thanMenhDongCung = checkThanMenhDongCung(cungMenhPos, cungThanPos);

        // 11. Tuổi
        const tuoi = tinhTuoi(lunarDate.year, namXem);

        // 12. Đại Vận
        const daiVan = tinhDaiVan(cucValue, cungMenhPos, thuan, lunarDate.year);
        const daiVanHienTai = getDaiVanHienTai(daiVan, namXem);

        // 13. Tiểu Vận
        const tieuVan = tinhTieuVan(gioiTinh, thuan, lunarDate.year, namXem);

        // 14. Nguyệt Hạn (12 tháng)
        const nguyetHan = tinhNguyetHan(tieuVan.cungPos, thuan, namXem);

        return {
            // Input
            input: params,

            // Âm lịch
            lunarDate: lunarDate,

            // Can Chi
            canChiNam,
            canChiThang,
            canChiNgay,
            canChiGio,
            canChiNamXem,

            // Âm Dương, Thuận/Nghịch
            amDuong,
            thuan,

            // Mệnh, Cục
            cungMenhPos,
            cungThanPos,
            cucValue,
            cucName,
            menhNapAm,
            hanhMenh,
            hanhCuc,

            // Cung map
            cungMap,

            // Tràng Sinh
            truongSinhMap,

            // Tuần Triệt
            tuanTriet,

            // Checks
            amDuongNghichLy,
            cucKhacMenh,
            thanMenhDongCung,

            // Tuổi
            tuoi,

            // Đại Vận
            daiVan,
            daiVanHienTai,

            // Tiểu Vận
            tieuVan,

            // Nguyệt Hạn (12 tháng)
            nguyetHan,

            // Sao (sẽ được TuViSao populate)
            saoMap: {}
        };
    }

    /**
     * Xác định Cung Phi (Bát Trạch)
     */
    function getCungPhi(namSinh, gioiTinh) {
        let sum = namSinh.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        while (sum > 9) {
            sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }

        const map = {
            1: 'Khảm (Thuỷ)', 2: 'Khôn (Thổ)', 3: 'Chấn (Mộc)', 4: 'Tốn (Mộc)',
            5: (gioiTinh === 'nam' ? 'Khôn (Thổ)' : 'Cấn (Thổ)'),
            6: 'Càn (Kim)', 7: 'Đoài (Kim)', 8: 'Cấn (Thổ)', 9: 'Ly (Hoả)'
        };

        let resultIdx;
        if (gioiTinh === 'nam') {
            resultIdx = (11 - sum) % 9;
            if (resultIdx === 0) resultIdx = 9;
        } else {
            resultIdx = (sum + 4) % 9;
            if (resultIdx === 0) resultIdx = 9;
        }

        return map[resultIdx] || '';
    }

    return {
        calculate,
        CUNG_NAMES,
        NGU_HANH_CUC,
        TRUONG_SINH,
        getHanhMenh,
        getHanhCuc,
        anCung,
        anTruongSinh,
        anTuanTriet,
        getCungMenh,
        getCungThan,
        getCuc,
        tinhDaiVan,
        tinhTieuVan,
        tinhNguyetHan,
        getDaiVanHienTai,
        getCungPhi
    };
})();





const inputSolar = {
    ngay: 13,
    thang: 12,
    nam: 1990,
    gioSinh: 6, // Giờ Ngọ
    gioiTinh: 'nam',
    namXem: 2024
};

const laso = TuViCalc.calculate(inputSolar);
console.log('Result for Solar 13/12/1990:');
console.log('Lunar Date:', laso.lunarDate.day + '/' + laso.lunarDate.month + '/' + laso.lunarDate.year);
console.log('Cung Menh Pos:', laso.cungMenhPos);
console.log('Cuc Name:', laso.cucName);
console.log('Cuc Value:', laso.cucValue);
console.log('-------------------------');

const inputLunar = {
    ngay: 13,
    thang: 12,
    nam: 1990,
    gioSinh: 6, // Giờ Ngọ
    gioiTinh: 'nam'
};

// If input is Lunar 13/12/1990
// First find solar date for Lunar 13/12/1990
const jd = AmLich.lunarToSolarJd(13, 12, 1990, 0);
const solar = AmLich.jdToDate(jd);
console.log('Lunar 13/12/1990 corresponds to Solar:', solar[0]+'/'+solar[1]+'/'+solar[2]);

const lasoLunar = TuViCalc.calculate({
    ngay: solar[0],
    thang: solar[1],
    nam: solar[2],
    gioSinh: 6,
    gioiTinh: 'nam',
    namXem: 2024
});

console.log('Result for Lunar 13/12/1990:');
console.log('Cung Menh Pos:', lasoLunar.cungMenhPos);
console.log('Cuc Name:', lasoLunar.cucName);
console.log('Cuc Value:', lasoLunar.cucValue);
console.log('Dai Van 1:', lasoLunar.daiVanList[0].tuoiFrom + '-' + lasoLunar.daiVanList[0].tuoiTo);
