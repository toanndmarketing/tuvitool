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
        let a11 = getLunarMonth11(lYear - 1, timeZone);
        let b11 = getLunarMonth11(lYear, timeZone);
        let off = 0;
        let diff;

        if (b11 - a11 > 365) {
            let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
            if (lMonth > leapMonthDiff || (lMonth === leapMonthDiff && lLeap)) {
                off = 1;
            }
        }

        if (lMonth >= 11) diff = lMonth - 11;
        else diff = lMonth + 1;

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


