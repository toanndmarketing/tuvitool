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
