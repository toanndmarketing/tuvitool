/**
 * ============================================
 * TỬ VI ĐẠI VẬN HÓA - Đại Vận Tứ Hóa
 * Tính Tứ Hóa riêng cho mỗi giai đoạn Đại Vận
 * Trường phái: Trung Châu (Vương Đình Chi)
 * ============================================
 */

const TuViDaiVanHoa = (function () {
    'use strict';

    const CAN_NAMES = AmLich.THIEN_CAN;

    // =====================
    // BẢNG CAN CUNG (NGŨ HỔ ĐỘN)
    // =====================
    // Từ Can năm sinh → Can cung Dần → đếm thuận đến cung cần tính
    // Giáp/Kỷ → Bính Dần, Ất/Canh → Mậu Dần, Bính/Tân → Canh Dần
    // Đinh/Nhâm → Nhâm Dần, Mậu/Quý → Giáp Dần

    const CAN_CUNG_DAN = [
        2, // 0: Giáp → Bính (index 2)
        4, // 1: Ất  → Mậu (index 4)
        6, // 2: Bính → Canh (index 6)
        8, // 3: Đinh → Nhâm (index 8)
        0, // 4: Mậu → Giáp (index 0)
        2, // 5: Kỷ  → Bính (index 2) [= Giáp]
        4, // 6: Canh → Mậu (index 4) [= Ất]
        6, // 7: Tân  → Canh (index 6) [= Bính]
        8, // 8: Nhâm → Nhâm (index 8) [= Đinh]
        0  // 9: Quý  → Giáp (index 0) [= Mậu]
    ];

    // =====================
    // TÍNH CAN CUNG
    // =====================

    /**
     * Tính Thiên Can của 1 cung bất kỳ dựa trên Can năm sinh
     * @param {number} canNam - Index Can năm sinh (0-9: Giáp → Quý)
     * @param {number} cungPos - Vị trí cung (0-11: Tý → Hợi)
     * @returns {number} Index Can của cung (0-9)
     */
    function tinhCanCung(canNam, cungPos) {
        var canDanIndex = CAN_CUNG_DAN[canNam];
        // Từ Dần (index 2) đến cungPos, đếm thuận
        var offset = ((cungPos - 2) % 12 + 12) % 12;
        return (canDanIndex + offset) % 10;
    }

    // =====================
    // TÍNH ĐẠI VẬN TỨ HÓA
    // =====================

    /**
     * Tính Tứ Hóa cho 1 Đại Vận cụ thể
     * @param {number} canNam - Can năm sinh (0-9)
     * @param {Object} daiVan - Object Đại Vận { cungPos, tuoiFrom, tuoiTo, ... }
     * @param {Object} saoMap - Map sao trên lá số { 0: [...], 1: [...], ... }
     * @param {Object} cungMap - Map cung { 0: 'MỆNH', 1: 'HUYNH ĐỆ', ... }
     * @returns {Object|null} Đại Vận Tứ Hóa
     */
    function calculate(canNam, daiVan, saoMap, cungMap) {
        if (!daiVan || daiVan.cungPos === undefined || !saoMap) return null;

        // 1. Tính Can cung Đại Vận
        var canCung = tinhCanCung(canNam, daiVan.cungPos);
        var canCungName = CAN_NAMES[canCung];

        // 2. Gọi anTuHoa() hiện có với Can cung Đại Vận
        if (typeof TuViSao === 'undefined' || !TuViSao.anTuHoa) return null;
        var tuHoa = TuViSao.anTuHoa(canCung);

        // 3. Tìm vị trí các sao được Hóa trên lá số
        var result = {
            canDaiVan: canCungName,
            canDaiVanIndex: canCung,
            tuHoa: tuHoa,
            details: []
        };

        var hoaNames = ['Hoá Lộc', 'Hoá Quyền', 'Hoá Khoa', 'Hoá Kỵ'];
        var hoaTypes = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];

        hoaNames.forEach(function (hoaName, idx) {
            var saoName = tuHoa[hoaName];
            var hoaType = hoaTypes[idx];
            var foundPos = -1;
            var foundCungName = '';

            // Tìm sao trong saoMap
            for (var i = 0; i < 12; i++) {
                var saoList = saoMap[i] || [];
                var found = saoList.find(function (s) { return s.name === saoName; });
                if (found) {
                    foundPos = i;
                    foundCungName = cungMap[i] || '';
                    break;
                }
            }

            result.details.push({
                hoaType: hoaType,
                hoaName: hoaName,
                saoName: saoName,
                cungPos: foundPos,
                cungName: foundCungName,
                isNegative: hoaType === 'Kỵ',
                isVeryGood: hoaType === 'Lộc'
            });

            // Shortcut cho Hóa Kỵ và Hóa Lộc
            if (hoaType === 'Kỵ') {
                result.hoaKyCung = foundPos;
                result.hoaKyCungName = foundCungName;
                result.hoaKySao = saoName;
            }
            if (hoaType === 'Lộc') {
                result.hoaLocCung = foundPos;
                result.hoaLocCungName = foundCungName;
                result.hoaLocSao = saoName;
            }
        });

        return result;
    }

    /**
     * Phát hiện "Kỵ trùng phùng" — ĐV Hóa Kỵ + Lưu Hóa Kỵ cùng cung
     * @param {Object} dvTuHoa - Kết quả từ calculate()
     * @param {Object} lasoData - Data lá số (chứa luuTuHoa)
     * @returns {Object|null} Cảnh báo nếu phát hiện
     */
    function detectKyTrungPhung(dvTuHoa, lasoData) {
        if (!dvTuHoa || dvTuHoa.hoaKyCung < 0) return null;
        if (!lasoData.luuTuHoa) return null;

        var luuKySao = lasoData.luuTuHoa['Hoá Kỵ'];
        if (!luuKySao) return null;

        // Tìm vị trí Lưu Hóa Kỵ
        var luuKyPos = -1;
        for (var i = 0; i < 12; i++) {
            var saoList = lasoData.saoMap[i] || [];
            var found = saoList.find(function (s) { return s.name === luuKySao; });
            if (found) { luuKyPos = i; break; }
        }

        if (luuKyPos === dvTuHoa.hoaKyCung) {
            var cungName = lasoData.cungMap[luuKyPos] || '';
            return {
                type: 'ky_trung_phung',
                severity: 'critical',
                cungPos: luuKyPos,
                cungName: cungName,
                dvKySao: dvTuHoa.hoaKySao,
                luuKySao: luuKySao,
                description: '🔴 KỴ TRÙNG PHÙNG: Đại Vận Hóa Kỵ (' + dvTuHoa.hoaKySao +
                    ') + Lưu Hóa Kỵ (' + luuKySao + ') đều rơi vào cung ' + cungName +
                    '. Cung này chịu áp lực cực lớn trong năm nay!'
            };
        }

        // Check xung chiếu (ĐV Kỵ xung chiếu Lưu Kỵ)
        var doiCung = (dvTuHoa.hoaKyCung + 6) % 12;
        if (luuKyPos === doiCung) {
            var doiCungName = lasoData.cungMap[doiCung] || '';
            return {
                type: 'ky_xung_chieu',
                severity: 'danger',
                cungPos: doiCung,
                cungName: doiCungName,
                dvKySao: dvTuHoa.hoaKySao,
                luuKySao: luuKySao,
                description: '🟠 KỴ XUNG CHIẾU: Đại Vận Hóa Kỵ (' + dvTuHoa.hoaKySao +
                    ') xung chiếu Lưu Hóa Kỵ (' + luuKySao + '). Áp lực lớn giữa cung ' +
                    (lasoData.cungMap[dvTuHoa.hoaKyCung] || '') + ' và ' + doiCungName + '.'
            };
        }

        return null;
    }

    // =====================
    // EXPORTS
    // =====================

    return {
        tinhCanCung: tinhCanCung,
        calculate: calculate,
        detectKyTrungPhung: detectKyTrungPhung,
        CAN_CUNG_DAN: CAN_CUNG_DAN
    };
})();
