/**
 * ============================================
 * TỬ VI SAO - An sao vào lá số
 * 14 Chính Tinh + Phụ Tinh + Sao lưu niên
 * ============================================
 */

const TuViSao = (function () {
    'use strict';

    const CHI_NAMES = AmLich.DIA_CHI;
    const CAN_NAMES = AmLich.THIEN_CAN;

    // =====================
    // SAO DEFINITIONS
    // =====================

    // Type: 'chinh' = chính tinh, 'phu' = phụ tinh, 'luu' = lưu niên
    // Nature: 'cat' = cát (tốt), 'hung' = hung (xấu), 'trung' = trung tính

    // =====================
    // AN 14 CHÍNH TINH
    // =====================

    /**
    /**
     * An Tử Vi tinh hệ
     * Vị trí Tử Vi phụ thuộc vào Cục và ngày Âm lịch
     * Bảng lookup chuẩn (verified)
     * Index: 0=Tý, 1=Sửu, 2=Dần, 3=Mão, 4=Thìn, 5=Tỵ, 6=Ngọ, 7=Mùi, 8=Thân, 9=Dậu, 10=Tuất, 11=Hợi
     */
    function anTuVi(cucValue, ngayAL) {
        const tuViTable = {
            // Thuỷ Nhị Cục (2)
            2: [null, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 0, 0, 1, 1, 2, 2, 3, 3, 4],
            // Mộc Tam Cục (3)
            3: [null, 2, 2, 2, 3, 2, 3, 3, 3, 4, 3, 4, 4, 4, 5, 4, 5, 5, 5, 6, 5, 6, 6, 6, 7, 6, 7, 7, 7, 8, 7],
            // Kim Tứ Cục (4)
            4: [null, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7, 6, 7, 8, 7, 8, 9, 8, 9, 10, 9, 10, 11, 10],
            // Thổ Ngũ Cục (5)
            5: [null, 2, 2, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 4, 3, 4, 4, 4, 4, 4, 5, 4, 5, 5, 5, 5, 5, 6, 5, 6, 6],
            // Hoả Lục Cục (6)
            6: [null, 1, 2, 2, 2, 1, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 4, 3, 4, 4, 4, 4, 4, 5, 4, 5, 5, 5, 5, 5, 6]
        };

        if (!tuViTable[cucValue] || ngayAL < 1 || ngayAL > 30) return 2;
        return tuViTable[cucValue][ngayAL];
    }


    /**
     * An nhóm sao Tử Vi (6 sao chính) - đi NGHỊCH (ngược chiều kim đồng hồ)
     * Quy tắc chuẩn:
     *   Tử Vi → lùi 1 → Thiên Cơ → bỏ cách 1 cung → Thái Dương → Vũ Khúc → Thiên Đồng → bỏ cách 2 cung → Liêm Trinh
     * Tổng offset nghịch từ Tử Vi:
     *   Thiên Cơ: -1, Thái Dương: -3, Vũ Khúc: -4, Thiên Đồng: -5, Liêm Trinh: -8
     */
    function anNhomTuVi(tuViPos) {
        const result = {};
        result['Tử Vi'] = tuViPos;
        result['Thiên Cơ'] = ((tuViPos - 1) % 12 + 12) % 12;
        result['Thái Dương'] = ((tuViPos - 3) % 12 + 12) % 12;
        result['Vũ Khúc'] = ((tuViPos - 4) % 12 + 12) % 12;
        result['Thiên Đồng'] = ((tuViPos - 5) % 12 + 12) % 12;
        result['Liêm Trinh'] = ((tuViPos - 8) % 12 + 12) % 12;
        return result;
    }

    /**
     * An Thiên Phủ tinh hệ (8 sao chính) - đi THUẬN (chiều kim đồng hồ)
     * Thiên Phủ đối xứng Tử Vi qua trục Dần(2)-Thân(8)
     * Công thức đối xứng: ThiênPhủ = (4 - TửVi + 12) % 12
     * 
     * Quy tắc an thuận:
     *   Thiên Phủ → Thái Âm → Tham Lang → Cự Môn → Thiên Tướng → Thiên Lương → Thất Sát → (bỏ 3 cung) → Phá Quân
     */
    function anNhomThienPhu(tuViPos) {
        const result = {};
        let thienPhuPos = ((4 - tuViPos) % 12 + 12) % 12;
        result['Thiên Phủ'] = thienPhuPos;
        result['Thái Âm'] = (thienPhuPos + 1) % 12;
        result['Tham Lang'] = (thienPhuPos + 2) % 12;
        result['Cự Môn'] = (thienPhuPos + 3) % 12;
        result['Thiên Tướng'] = (thienPhuPos + 4) % 12;
        result['Thiên Lương'] = (thienPhuPos + 5) % 12;
        result['Thất Sát'] = (thienPhuPos + 6) % 12;
        // Phá Quân: bỏ cách 3 cung từ Thất Sát = tiến thêm 4 = tổng +10
        result['Phá Quân'] = (thienPhuPos + 10) % 12;
        return result;
    }

    // =====================
    // AN PHỤ TINH
    // =====================

    /**
     * An Tả Phụ, Hữu Bật (theo tháng sinh)
     * Tả Phụ: bắt từ Thìn (4), đi thuận theo tháng
     * Hữu Bật: bắt từ Tuất (10), đi nghịch theo tháng
     */
    function anTaPhuHuuBat(thangAL) {
        return {
            'Tả Phụ': (4 + thangAL - 1) % 12,
            'Hữu Bật': ((10 - thangAL + 1) % 12 + 12) % 12
        };
    }

    /**
     * An Văn Xương, Văn Khúc (theo giờ sinh)
     * Văn Xương: bắt từ Tuất (10), đi nghịch theo giờ
     * Văn Khúc: bắt từ Thìn (4), đi thuận theo giờ
     */
    function anVanXuongVanKhuc(chiGio) {
        return {
            'Văn Xương': ((10 - chiGio) % 12 + 12) % 12,
            'Văn Khúc': (4 + chiGio) % 12
        };
    }

    /**
     * An Thiên Khôi, Thiên Việt (theo can năm)
     */
    function anThienKhoiThienViet(canNam) {
        const khoiTable = [1, 0, 11, 11, 1, 0, 7, 6, 3, 3]; // Sửu Tý Hợi Hợi Sửu Tý Mùi Ngọ Mão Mão
        const vietTable = [7, 8, 9, 9, 7, 8, 1, 2, 5, 5]; // Mùi Thân Dậu Dậu Mùi Thân Sửu Dần Tỵ Tỵ
        return {
            'Thiên Khôi': khoiTable[canNam],
            'Thiên Việt': vietTable[canNam]
        };
    }

    /**
     * An Lộc Tồn, Kình Dương, Đà La, Thiên Mã (theo can năm)
     * Lộc Tồn: Vị trí cố định theo can năm
     */
    function anLocTon(canNam) {
        const locTonTable = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
        // Dần Mão Tỵ Ngọ Tỵ Ngọ Thân Dậu Hợi Tý
        let pos = locTonTable[canNam];
        return {
            'Lộc Tồn': pos,
            'Kình Dương': (pos + 1) % 12,
            'Đà La': ((pos - 1) % 12 + 12) % 12
        };
    }

    /**
     * An Thiên Mã (theo chi năm)
     */
    function anThienMa(chiNam) {
        // Dần Ngọ Tuất: Thân; Thân Tý Thìn: Dần; Tỵ Dậu Sửu: Hợi; Hợi Mão Mùi: Tỵ
        const maTable = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5];
        return { 'Thiên Mã': maTable[chiNam] };
    }

    /**
     * An Hoá Lộc, Hoá Quyền, Hoá Khoa, Hoá Kỵ (Tứ Hoá theo can năm)
     * Trả về tên sao được hoá
     */
    function anTuHoa(canNam) {
        const hoaTable = [
            // [Hoá Lộc, Hoá Quyền, Hoá Khoa, Hoá Kỵ]
            ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],     // Giáp
            ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],          // Ất
            ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],    // Bính
            ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],          // Đinh
            ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],          // Mậu
            ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],       // Kỷ
            ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],       // Canh (Thiên Phủ thay bằng Thái Âm for simplification)
            ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],        // Tân
            ['Thiên Lương', 'Tử Vi', 'Tả Phụ', 'Vũ Khúc'],            // Nhâm
            ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang']            // Quý
        ];
        return {
            'Hoá Lộc': hoaTable[canNam][0],
            'Hoá Quyền': hoaTable[canNam][1],
            'Hoá Khoa': hoaTable[canNam][2],
            'Hoá Kỵ': hoaTable[canNam][3]
        };
    }

    /**
     * An Hoả Tinh, Linh Tinh (theo chi năm + giờ sinh)
     */
    function anHoaLinh(chiNam, chiGio) {
        // Hoả Tinh khởi cung theo chi năm (nhóm Dần Ngọ Tuất, Thân Tý Thìn, Tỵ Dậu Sửu, Hợi Mão Mùi)
        let hoaStart, linhStart;
        const nhom = chiNam % 4;
        // Simplified: Hoả Tinh từ theo nhóm Tam Hợp
        if ([2, 6, 10].includes(chiNam)) { // Dần Ngọ Tuất
            hoaStart = 1; // Sửu
            linhStart = 3; // Mão
        } else if ([8, 0, 4].includes(chiNam)) { // Thân Tý Thìn
            hoaStart = 2; // Dần
            linhStart = 10; // Tuất
        } else if ([5, 9, 1].includes(chiNam)) { // Tỵ Dậu Sửu
            hoaStart = 3; // Mão (actually Tuất for some traditions)
            linhStart = 10; // Tuất
        } else { // Hợi Mão Mùi
            hoaStart = 9; // Dậu
            linhStart = 10; // Tuất
        }

        return {
            'Hoả Tinh': (hoaStart + chiGio) % 12,
            'Linh Tinh': (linhStart + chiGio) % 12
        };
    }

    /**
     * An Không (Địa Không, Địa Kiếp) theo giờ sinh
     * Địa Không: bắt từ Hợi (11), đi nghịch theo giờ
     * Địa Kiếp: bắt từ Hợi (11), đi thuận theo giờ
     */
    function anDiaKhongDiaKiep(chiGio) {
        return {
            'Địa Không': ((11 - chiGio) % 12 + 12) % 12,
            'Địa Kiếp': (11 + chiGio) % 12
        };
    }

    /**
     * An Thiên Khốc, Thiên Hư (theo chi năm)
     */
    function anThienKhocHu(chiNam) {
        return {
            'Thiên Khốc': ((6 - chiNam) % 12 + 12) % 12,
            'Thiên Hư': (6 + chiNam) % 12
        };
    }

    /**
     * An Thiên Hình, Thiên Riêu (Thiên Diêu), Thiên Y
     */
    function anThienHinhDieuY(thangAL) {
        return {
            'Thiên Hình': (9 + thangAL - 1) % 12, // Bắt từ Dậu, thuận theo tháng
            'Thiên Diêu': (1 + thangAL - 1) % 12,  // Bắt từ Sửu, thuận
            'Thiên Y': ((11 - thangAL + 1) % 12 + 12) % 12 // Bắt từ Hợi, nghịch
        };
    }

    /**
     * An Đào Hoa, Hồng Loan, Thiên Hỷ (theo chi năm)
     */
    function anDaoHoaHongLoan(chiNam) {
        // Hồng Loan: đối cung Đào Hoa lùi 2
        // Đào Hoa theo tam hợp: Dần Ngọ Tuất -> Mão, Thân Tý Thìn -> Dậu, Tỵ Dậu Sửu -> Ngọ, Hợi Mão Mùi -> Tý
        const daoHoaMap = {
            0: 9, 1: 6, 2: 3, 3: 0, 4: 9, 5: 6,
            6: 3, 7: 0, 8: 9, 9: 6, 10: 3, 11: 0
        };
        // Hồng Loan: bắt từ Mão(3), đi nghịch theo chi năm
        let hongLoan = ((3 - chiNam) % 12 + 12) % 12;
        // Thiên Hỷ đối cung Hồng Loan
        let thienHy = (hongLoan + 6) % 12;
        return {
            'Đào Hoa': daoHoaMap[chiNam],
            'Hồng Loan': hongLoan,
            'Thiên Hỷ': thienHy
        };
    }

    /**
     * An Thai, Tọa, Quang, Quý
     */
    function anThaiToa(thangAL) {
        return {
            'Thai Phụ': (1 + thangAL) % 12,
            'Phong Cáo': ((11 - thangAL) % 12 + 12) % 12
        };
    }

    /**
     * An Tam Thai, Bát Tọa (theo ngày và chi giờ)
     */
    function anTamThaiBatToa(ngayAL, chiGio) {
        return {
            'Tam Thai': (ngayAL - 1 + chiGio) % 12, // Simplified
            'Bát Tọa': ((ngayAL - 1 + chiGio + 4) % 12) // Simplified
        };
    }

    /**
     * An Thiên Quan, Thiên Phúc (theo can năm)
     */
    function anThienQuanPhuc(canNam) {
        const quanTable = [7, 4, 5, 6, 3, 9, 11, 9, 3, 6];
        const phucTable = [9, 8, 0, 11, 3, 0, 6, 5, 5, 2];
        return {
            'Thiên Quan': quanTable[canNam],
            'Thiên Phúc': phucTable[canNam]
        };
    }

    /**
     * An Thiên Giải, Địa Giải
     */
    function anThienDiaGiai(thangAL) {
        return {
            'Thiên Giải': (thangAL + 7) % 12,
            'Địa Giải': ((thangAL + 7) % 12 + 6) % 12
        };
    }

    /**
     * An Quốc Ấn, Đường Phù (theo can năm)
     */
    function anQuocAnDuongPhu(canNam) {
        const quocAnTable = [6, 7, 5, 4, 5, 4, 10, 11, 2, 3];
        const duongPhuTable = [5, 8, 1, 11, 1, 11, 5, 2, 0, 8];
        return {
            'Quốc Ấn': quocAnTable[canNam],
            'Đường Phù': duongPhuTable[canNam]
        };
    }

    /**
     * An Thiên Đức, Nguyệt Đức
     */
    function anThienNguyetDuc(thangAL) {
        return {
            'Thiên Đức': (9 + thangAL - 1) % 12,
            'Nguyệt Đức': (9 + thangAL - 1) % 12
        };
    }

    /**
     * An vòng Bác Sĩ (12 sao)
     * Khởi từ vị trí Lộc Tồn
     * Dương Nam/Âm Nữ: đi thuận
     * Âm Nam/Dương Nữ: đi nghịch
     */
    function anLucSi(locTonPos, thuan) {
        const names = [
            'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao',
            'Tướng Quân', 'Tấu Thư', 'Phi Liêm', 'Hỷ Thần',
            'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ'
        ];
        const result = {};
        for (let i = 0; i < names.length; i++) {
            let pos;
            if (thuan) {
                pos = (locTonPos + i) % 12;
            } else {
                pos = ((locTonPos - i) % 12 + 12) % 12;
            }
            result[names[i]] = pos;
        }
        return result;
    }

    /**
     * An bộ Đặc Biệt Tinh theo can năm
     * Thiên La, Địa Võng
     */
    function anThienLaDiaVong() {
        return {
            'Thiên La': 4, // Luôn ở Thìn
            'Địa Võng': 10 // Luôn ở Tuất
        };
    }

    /**
     * An các sao Phụ Tinh khác
     */
    function anPhuTinhKhac(chiNam) {
        // Cô Thần, Quả Tú
        const coThanTable = [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2];
        const quaTuTable = [10, 10, 1, 1, 1, 4, 4, 4, 7, 7, 7, 10];
        return {
            'Cô Thần': coThanTable[chiNam],
            'Quả Tú': quaTuTable[chiNam]
        };
    }

    /**
     * An Tuế Phá, Tuế Phá, Long Đức, Phượng Các (theo chi năm)
     */
    function anTuePha(chiNam) {
        return {
            'Tuế Phá': (chiNam + 6) % 12,
            'Long Đức': (chiNam + 3) % 12,
            'Phượng Các': ((chiNam + 3) % 12 + 6) % 12
        };
    }

    /**
     * An Thiên Thương, Thiên Sứ (theo tháng)
     */
    function anThienThuongSu(thangAL) {
        return {
            'Thiên Thương': (thangAL + 1) % 12,
            'Thiên Sứ': (thangAL + 7) % 12
        };
    }

    /**
     * An Ân Quang, Thiên Quý (Thiên Trù) theo ngày
     */
    function anAnQuangThienQuy(ngayAL) {
        return {
            'Ân Quang': ((6 + ngayAL) % 12),
            'Thiên Quý': ((6 - ngayAL + 1 + 12) % 12)
        };
    }

    /**
     * An Long Trì, Phượng Các (theo chi năm)
     */
    function anLongTriPhuongCac(chiNam) {
        return {
            'Long Trì': (4 + chiNam) % 12,
            'Phượng Các': ((10 - chiNam + 12) % 12)
        };
    }

    /**
     * An Lưu Hà, Thiên Trù
     */
    function anLuuHaThienTru(chiNam) {
        return {
            'Lưu Hà': (chiNam + 2) % 12,
            'Thiên Trù': ((chiNam + 8) % 12)
        };
    }

    /**
     * An Giải Thần, Phượng Quang
     */
    function anGiaiThan(thangAL) {
        return {
            'Giải Thần': (thangAL + 5) % 12,
            'Phượng Quang': (thangAL + 7) % 12
        };
    }

    /**
     * An Kiếp Sát, Tang Môn, Bạch Hổ, Điếu Khách (theo chi năm)
     */
    function anKiepSatTangMon(chiNam) {
        const kiepSatTable = [5, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8];
        return {
            'Kiếp Sát': kiepSatTable[chiNam],
            'Tang Môn': (chiNam + 2) % 12,
            'Bạch Hổ': (chiNam + 4) % 12,
            'Điếu Khách': (chiNam + 6) % 12
        };
    }

    /**
     * An Thiểu Dương, Thiểu Âm (theo chi năm)
     */
    function anThieuDuongAm(chiNam) {
        return {
            'Thiểu Dương': (chiNam + 2) % 12,
            'Thiểu Âm': (chiNam + 10) % 12
        };
    }

    /**
     * An Thiên Tài, Thiên Thọ
     */
    function anThienTaiTho(menhPos, chiGio) {
        return {
            'Thiên Tài': (menhPos + chiGio) % 12,
            'Thiên Thọ': ((menhPos + chiGio + 6) % 12)
        };
    }

    /**
     * An Đẩu Quân - Nguyệt tướng
     */
    function anDauQuan(thangAL, chiGio) {
        // Khởi từ Thìn(4), nghịch theo tháng, thuận theo giờ
        let pos = ((4 - thangAL + 1 + chiGio) % 12 + 12) % 12;
        return { 'Đẩu Quân': pos };
    }

    /**
     * An Thiên Phủ (trùng name), Phúc Đức Quý Nhân
     */
    function anThienPhu2(canNam) {
        const table = [9, 8, 0, 11, 3, 0, 6, 5, 5, 2];
        return {
            'Thiên Phúc_2': table[canNam]
        };
    }

    // =====================
    // TỔNG HỢP AN SAO
    // =====================

    /**
     * An toàn bộ sao vào lá số
     * @param {Object} lasoData - Data từ TuViCalc.calculate()
     * @returns {Object} saoMap: { cungIndex: [{ name, type, nature }] }
     */
    function anSao(lasoData) {
        const saoMap = {};
        for (let i = 0; i < 12; i++) {
            saoMap[i] = [];
        }

        const canNam = lasoData.canChiNam.canIndex;
        const chiNam = lasoData.canChiNam.chiIndex;
        const thangAL = lasoData.lunarDate.month;
        const ngayAL = lasoData.lunarDate.day;
        const chiGio = lasoData.input.gioSinh;
        const cucValue = lasoData.cucValue;
        const menhPos = lasoData.cungMenhPos;
        const thuan = lasoData.thuan;

        // Helper: add sao to cung
        function addSao(pos, name, type, nature, extra) {
            if (pos === undefined || pos === null) return;
            pos = ((pos % 12) + 12) % 12;
            saoMap[pos].push({ name, type: type || 'phu', nature: nature || 'trung', ...(extra || {}) });
        }

        // --- 14 Chính Tinh ---
        const tuViPos = anTuVi(cucValue, ngayAL);
        const nhomTuVi = anNhomTuVi(tuViPos);
        const nhomThienPhu = anNhomThienPhu(tuViPos);

        // Add Tử Vi hệ
        addSao(nhomTuVi['Tử Vi'], 'Tử Vi', 'chinh', 'cat');
        addSao(nhomTuVi['Thiên Cơ'], 'Thiên Cơ', 'chinh', 'cat');
        addSao(nhomTuVi['Thái Dương'], 'Thái Dương', 'chinh', 'cat');
        addSao(nhomTuVi['Vũ Khúc'], 'Vũ Khúc', 'chinh', 'trung');
        addSao(nhomTuVi['Thiên Đồng'], 'Thiên Đồng', 'chinh', 'cat');
        addSao(nhomTuVi['Liêm Trinh'], 'Liêm Trinh', 'chinh', 'trung');

        // Add Thiên Phủ hệ
        addSao(nhomThienPhu['Thiên Phủ'], 'Thiên Phủ', 'chinh', 'cat');
        addSao(nhomThienPhu['Thái Âm'], 'Thái Âm', 'chinh', 'cat');
        addSao(nhomThienPhu['Tham Lang'], 'Tham Lang', 'chinh', 'trung');
        addSao(nhomThienPhu['Cự Môn'], 'Cự Môn', 'chinh', 'trung');
        addSao(nhomThienPhu['Thiên Tướng'], 'Thiên Tướng', 'chinh', 'cat');
        addSao(nhomThienPhu['Thiên Lương'], 'Thiên Lương', 'chinh', 'cat');
        addSao(nhomThienPhu['Thất Sát'], 'Thất Sát', 'chinh', 'hung');
        addSao(nhomThienPhu['Phá Quân'], 'Phá Quân', 'chinh', 'trung');

        // --- Phụ Tinh ---

        // Tả Phụ, Hữu Bật
        const taPhuHuuBat = anTaPhuHuuBat(thangAL);
        addSao(taPhuHuuBat['Tả Phụ'], 'Tả Phụ', 'phu', 'cat');
        addSao(taPhuHuuBat['Hữu Bật'], 'Hữu Bật', 'phu', 'cat');

        // Văn Xương, Văn Khúc
        const vanXuongKhuc = anVanXuongVanKhuc(chiGio);
        addSao(vanXuongKhuc['Văn Xương'], 'Văn Xương', 'phu', 'cat');
        addSao(vanXuongKhuc['Văn Khúc'], 'Văn Khúc', 'phu', 'cat');

        // Thiên Khôi, Thiên Việt
        const khoiViet = anThienKhoiThienViet(canNam);
        addSao(khoiViet['Thiên Khôi'], 'Thiên Khôi', 'phu', 'cat');
        addSao(khoiViet['Thiên Việt'], 'Thiên Việt', 'phu', 'cat');

        // Lộc Tồn, Kình Dương, Đà La
        const locTon = anLocTon(canNam);
        addSao(locTon['Lộc Tồn'], 'Lộc Tồn', 'phu', 'cat');
        addSao(locTon['Kình Dương'], 'Kình Dương', 'phu', 'hung');
        addSao(locTon['Đà La'], 'Đà La', 'phu', 'hung');

        // Thiên Mã
        const thienMa = anThienMa(chiNam);
        addSao(thienMa['Thiên Mã'], 'Thiên Mã', 'phu', 'cat');

        // Tứ Hoá
        const tuHoa = anTuHoa(canNam);
        // Mark Hoá trên sao tương ứng
        lasoData.tuHoa = tuHoa;
        // Tìm vị trí các sao được hoá trong saoMap
        // (Sẽ xử lý sau khi an xong tất cả sao)

        // Hoả Tinh, Linh Tinh
        const hoaLinh = anHoaLinh(chiNam, chiGio);
        addSao(hoaLinh['Hoả Tinh'], 'Hoả Tinh', 'phu', 'hung');
        addSao(hoaLinh['Linh Tinh'], 'Linh Tinh', 'phu', 'hung');

        // Địa Không, Địa Kiếp
        const diaKhongKiep = anDiaKhongDiaKiep(chiGio);
        addSao(diaKhongKiep['Địa Không'], 'Địa Không', 'phu', 'hung');
        addSao(diaKhongKiep['Địa Kiếp'], 'Địa Kiếp', 'phu', 'hung');

        // Thiên Khốc, Thiên Hư
        const khocHu = anThienKhocHu(chiNam);
        addSao(khocHu['Thiên Khốc'], 'Thiên Khốc', 'phu', 'hung');
        addSao(khocHu['Thiên Hư'], 'Thiên Hư', 'phu', 'hung');

        // Thiên Hình, Thiên Diêu, Thiên Y
        const hinhDieuY = anThienHinhDieuY(thangAL);
        addSao(hinhDieuY['Thiên Hình'], 'Thiên Hình', 'phu', 'hung');
        addSao(hinhDieuY['Thiên Diêu'], 'Thiên Diêu', 'phu', 'trung');
        addSao(hinhDieuY['Thiên Y'], 'Thiên Y', 'phu', 'cat');

        // Đào Hoa, Hồng Loan, Thiên Hỷ
        const daoHoa = anDaoHoaHongLoan(chiNam);
        addSao(daoHoa['Đào Hoa'], 'Đào Hoa', 'phu', 'trung');
        addSao(daoHoa['Hồng Loan'], 'Hồng Loan', 'phu', 'cat');
        addSao(daoHoa['Thiên Hỷ'], 'Thiên Hỷ', 'phu', 'cat');

        // Thai Phụ, Phong Cáo
        const thaiToa = anThaiToa(thangAL);
        addSao(thaiToa['Thai Phụ'], 'Thai Phụ', 'phu', 'cat');
        addSao(thaiToa['Phong Cáo'], 'Phong Cáo', 'phu', 'cat');

        // Thiên Quan, Thiên Phúc
        const quanPhuc = anThienQuanPhuc(canNam);
        addSao(quanPhuc['Thiên Quan'], 'Thiên Quan', 'phu', 'cat');
        addSao(quanPhuc['Thiên Phúc'], 'Thiên Phúc', 'phu', 'cat');

        // Quốc Ấn, Đường Phù
        const quocAnDuongPhu = anQuocAnDuongPhu(canNam);
        addSao(quocAnDuongPhu['Quốc Ấn'], 'Quốc Ấn', 'phu', 'cat');
        addSao(quocAnDuongPhu['Đường Phù'], 'Đường Phù', 'phu', 'cat');

        // Thiên La, Địa Võng
        const thienLa = anThienLaDiaVong();
        addSao(thienLa['Thiên La'], 'Thiên La', 'phu', 'hung');
        addSao(thienLa['Địa Võng'], 'Địa Võng', 'phu', 'hung');

        // Kiếp Sát, Tang Môn, Bạch Hổ, Điếu Khách
        const kiepSat = anKiepSatTangMon(chiNam);
        addSao(kiepSat['Kiếp Sát'], 'Kiếp Sát', 'phu', 'hung');
        addSao(kiepSat['Tang Môn'], 'Tang Môn', 'phu', 'hung');
        addSao(kiepSat['Bạch Hổ'], 'Bạch Hổ', 'phu', 'hung');
        addSao(kiepSat['Điếu Khách'], 'Điếu Khách', 'phu', 'hung');

        // Cô Thần, Quả Tú
        const coThan = anPhuTinhKhac(chiNam);
        addSao(coThan['Cô Thần'], 'Cô Thần', 'phu', 'hung');
        addSao(coThan['Quả Tú'], 'Quả Tú', 'phu', 'hung');

        // Tam Thai, Bát Tọa
        const tamThai = anTamThaiBatToa(ngayAL, chiGio);
        addSao(tamThai['Tam Thai'], 'Tam Thai', 'phu', 'cat');
        addSao(tamThai['Bát Tọa'], 'Bát Tọa', 'phu', 'cat');

        // Thiểu Dương, Thiểu Âm
        const thieuDuongAm = anThieuDuongAm(chiNam);
        addSao(thieuDuongAm['Thiểu Dương'], 'Thiểu Dương', 'phu', 'trung');
        addSao(thieuDuongAm['Thiểu Âm'], 'Thiểu Âm', 'phu', 'trung');

        // Thiên Tài, Thiên Thọ
        const thienTaiTho = anThienTaiTho(menhPos, chiGio);
        addSao(thienTaiTho['Thiên Tài'], 'Thiên Tài', 'phu', 'cat');
        addSao(thienTaiTho['Thiên Thọ'], 'Thiên Thọ', 'phu', 'cat');

        // Long Trì, Phượng Các
        const longTri = anLongTriPhuongCac(chiNam);
        addSao(longTri['Long Trì'], 'Long Trì', 'phu', 'cat');
        addSao(longTri['Phượng Các'], 'Phượng Các', 'phu', 'cat');

        // Lưu Hà, Thiên Trù
        const luuHa = anLuuHaThienTru(chiNam);
        addSao(luuHa['Lưu Hà'], 'Lưu Hà', 'phu', 'trung');
        addSao(luuHa['Thiên Trù'], 'Thiên Trù', 'phu', 'cat');

        // Giải Thần, Phượng Quang (dùng Phong Cáo/Quang)
        const giaiThan = anGiaiThan(thangAL);
        addSao(giaiThan['Giải Thần'], 'Giải Thần', 'phu', 'cat');

        // Tuế Phá, Long Đức, Phượng Các sao lưu niên
        const tuePha = anTuePha(chiNam);

        // Thiên Thương, Thiên Sứ
        const thuongSu = anThienThuongSu(thangAL);
        addSao(thuongSu['Thiên Thương'], 'Thiên Thương', 'phu', 'hung');
        addSao(thuongSu['Thiên Sứ'], 'Thiên Sứ', 'phu', 'hung');

        // Ân Quang, Thiên Quý
        const anQuang = anAnQuangThienQuy(ngayAL);
        addSao(anQuang['Ân Quang'], 'Ân Quang', 'phu', 'cat');
        addSao(anQuang['Thiên Quý'], 'Thiên Quý', 'phu', 'cat');

        // Đẩu Quân
        const dauQuan = anDauQuan(thangAL, chiGio);
        addSao(dauQuan['Đẩu Quân'], 'Đẩu Quân', 'phu', 'trung');

        // Vòng Bác Sĩ (khởi từ Lộc Tồn, thuận/nghịch theo Âm Dương)
        const lucSiBo = anLucSi(locTon['Lộc Tồn'], thuan);

        // Bộ Bác Sĩ
        addSao(lucSiBo['Bác Sĩ'], 'Bác Sĩ', 'phu', 'cat');
        addSao(lucSiBo['Lực Sĩ'], 'Lực Sĩ', 'phu', 'cat');
        addSao(lucSiBo['Thanh Long'], 'Thanh Long', 'phu', 'cat');
        addSao(lucSiBo['Tiểu Hao'], 'Tiểu Hao', 'phu', 'hung');
        addSao(lucSiBo['Tướng Quân'], 'Tướng Quân', 'phu', 'trung');
        addSao(lucSiBo['Tấu Thư'], 'Tấu Thư', 'phu', 'cat');
        addSao(lucSiBo['Phi Liêm'], 'Phi Liêm', 'phu', 'hung');
        addSao(lucSiBo['Hỷ Thần'], 'Hỷ Thần', 'phu', 'cat');
        addSao(lucSiBo['Bệnh Phù'], 'Bệnh Phù', 'phu', 'hung');
        addSao(lucSiBo['Đại Hao'], 'Đại Hao', 'phu', 'hung');
        addSao(lucSiBo['Phục Binh'], 'Phục Binh', 'phu', 'hung');
        addSao(lucSiBo['Quan Phủ'], 'Quan Phủ', 'phu', 'hung');

        // --- Xử lý Tứ Hoá ---
        // Gán Hoá lên sao
        for (let cungIdx = 0; cungIdx < 12; cungIdx++) {
            saoMap[cungIdx].forEach(sao => {
                if (sao.name === tuHoa['Hoá Lộc']) sao.hoa = 'Lộc';
                if (sao.name === tuHoa['Hoá Quyền']) sao.hoa = 'Quyền';
                if (sao.name === tuHoa['Hoá Khoa']) sao.hoa = 'Khoa';
                if (sao.name === tuHoa['Hoá Kỵ']) sao.hoa = 'Kỵ';
            });
        }

        // Long Đức, Phượng Các (lưu niên) - add
        addSao(tuePha['Long Đức'], 'Long Đức', 'phu', 'cat');
        addSao(tuePha['Phượng Các'], 'Phượng Các', 'phu', 'cat');

        // --- Sao Lưu Niên (theo Can Chi năm xem) ---
        if (lasoData.canChiNamXem) {
            const canNamXem = lasoData.canChiNamXem.canIndex;
            const chiNamXem = lasoData.canChiNamXem.chiIndex;

            // Lưu Thái Tuế = Chi năm xem
            addSao(chiNamXem, 'Lưu Thái Tuế', 'luu', 'trung');

            // Lưu Thiên Mã
            const luuMa = anThienMa(chiNamXem);
            addSao(luuMa['Thiên Mã'], 'Lưu Thiên Mã', 'luu', 'cat');

            // Lưu Lộc Tồn, Kình Dương, Đà La
            const luuLoc = anLocTon(canNamXem);
            addSao(luuLoc['Lộc Tồn'], 'Lưu Lộc Tồn', 'luu', 'cat');
            addSao(luuLoc['Kình Dương'], 'Lưu Kình Dương', 'luu', 'hung');
            addSao(luuLoc['Đà La'], 'Lưu Đà La', 'luu', 'hung');

            // Lưu Thiên Khôi, Thiên Việt
            const luuKV = anThienKhoiThienViet(canNamXem);
            addSao(luuKV['Thiên Khôi'], 'Lưu Thiên Khôi', 'luu', 'cat');
            addSao(luuKV['Thiên Việt'], 'Lưu Thiên Việt', 'luu', 'cat');

            // Lưu Tang Môn, Bạch Hổ, Điếu Khách (theo chi năm xem)
            const luuTangMon = anKiepSatTangMon(chiNamXem);
            addSao(luuTangMon['Tang Môn'], 'Lưu Tang Môn', 'luu', 'hung');
            addSao(luuTangMon['Bạch Hổ'], 'Lưu Bạch Hổ', 'luu', 'hung');
            addSao(luuTangMon['Điếu Khách'], 'Lưu Điếu Khách', 'luu', 'hung');

            // Lưu Hồng Loan, Đào Hoa, Thiên Hỷ (theo chi năm xem)
            const luuDaoHoa = anDaoHoaHongLoan(chiNamXem);
            addSao(luuDaoHoa['Hồng Loan'], 'Lưu Hồng Loan', 'luu', 'cat');
            addSao(luuDaoHoa['Đào Hoa'], 'Lưu Đào Hoa', 'luu', 'trung');
            addSao(luuDaoHoa['Thiên Hỷ'], 'Lưu Thiên Hỷ', 'luu', 'cat');

            // Lưu Hoả Tinh, Linh Tinh (theo chi năm xem + giờ sinh)
            const luuHoaLinh = anHoaLinh(chiNamXem, chiGio);
            addSao(luuHoaLinh['Hoả Tinh'], 'Lưu Hoả Tinh', 'luu', 'hung');
            addSao(luuHoaLinh['Linh Tinh'], 'Lưu Linh Tinh', 'luu', 'hung');

            // Lưu Tứ Hoá
            const luuTuHoa = anTuHoa(canNamXem);
            lasoData.luuTuHoa = luuTuHoa;

            // Gán Lưu Hoá lên sao
            for (let ci = 0; ci < 12; ci++) {
                saoMap[ci].forEach(sao => {
                    if (sao.name === luuTuHoa['Hoá Lộc']) sao.luuHoa = 'Lộc';
                    if (sao.name === luuTuHoa['Hoá Quyền']) sao.luuHoa = 'Quyền';
                    if (sao.name === luuTuHoa['Hoá Khoa']) sao.luuHoa = 'Khoa';
                    if (sao.name === luuTuHoa['Hoá Kỵ']) sao.luuHoa = 'Kỵ';
                });
            }
        }

        // Store saoMap
        lasoData.saoMap = saoMap;
        lasoData.nhomTuVi = nhomTuVi;
        lasoData.nhomThienPhu = nhomThienPhu;

        return saoMap;
    }

    // =====================
    // CHỦ MỆNH / CHỦ THÂN
    // =====================

    /**
     * Xác định Chủ Mệnh (sao chủ cung Mệnh)
     * Dựa vào Địa Chi cung Mệnh
     */
    function getChuMenh(cungMenhPos) {
        const chuMenhMap = {
            0: 'Tham Lang', 1: 'Cự Môn', 2: 'Lộc Tồn', 3: 'Văn Khúc',
            4: 'Liêm Trinh', 5: 'Vũ Khúc', 6: 'Phá Quân', 7: 'Vũ Khúc',
            8: 'Liêm Trinh', 9: 'Văn Khúc', 10: 'Lộc Tồn', 11: 'Cự Môn'
        };
        return chuMenhMap[cungMenhPos] || 'Tham Lang';
    }

    /**
     * Xác định Chủ Thân (sao chủ cung Thân)
     */
    function getChuThan(cungThanPos) {
        const chuThanMap = {
            0: 'Linh Tinh', 1: 'Thiên Tướng', 2: 'Thiên Lương', 3: 'Thiên Đồng',
            4: 'Văn Xương', 5: 'Thiên Cơ', 6: 'Hoả Tinh', 7: 'Thiên Cơ',
            8: 'Văn Xương', 9: 'Thiên Đồng', 10: 'Thiên Lương', 11: 'Thiên Tướng'
        };
        return chuThanMap[cungThanPos] || 'Thiên Tướng';
    }

    return {
        anSao,
        anTuHoa,
        getChuMenh,
        getChuThan
    };
})();
