/**
 * ============================================
 * TỬ VI LƯU NIÊN - Luận giải sao lưu + Nguyệt Hạn
 * P2: Luận giải Lưu Tứ Hóa
 * P3: Trigger Logic (Kích hoạt Sát tinh)
 * P4: Lưu Thái Tuế tương tác
 * P5: Tiểu hạn 12 tháng phân tích
 * P6: Energy Score JSON
 * ============================================
 */

const TuViLuuNien = (function () {
    'use strict';

    const CHI_NAMES = AmLich.DIA_CHI;

    // =====================
    // P2: LUẬN GIẢI LƯU TỨ HÓA
    // =====================

    /**
     * Ý nghĩa Lưu Hóa theo từng cung
     */
    const LUU_HOA_MEANING = {
        'MỆNH': {
            'Lộc': 'Bản thân gặp nhiều may mắn, vận khí cá nhân rất tốt.',
            'Quyền': 'Uy tín tăng cao, có thể thăng chức hoặc nắm vị trí quan trọng.',
            'Khoa': 'Được quý nhân phù trợ, phù hợp học tập, thi cử.',
            'Kỵ': 'Dễ gặp phiền não, thị phi. Cẩn trọng lời nói, tránh xung đột.'
        },
        'PHU THÊ': {
            'Lộc': 'Tình duyên thuận lợi, người độc thân dễ gặp đối tượng phù hợp.',
            'Quyền': 'Vợ/chồng mạnh mẽ, có sức ảnh hưởng. Cần khéo léo giao tiếp.',
            'Khoa': 'Quan hệ hôn nhân hài hòa, phù hợp bàn chuyện lớn.',
            'Kỵ': '⚠ Hôn nhân dễ xung đột, cần kiên nhẫn. Hạn chế ký hợp đồng chung.'
        },
        'TÀI BẠCH': {
            'Lộc': '💰 Tài chính thuận lợi, nhiều nguồn thu mới. Cơ hội đầu tư tốt.',
            'Quyền': 'Quản lý tài chính hiệu quả, phù hợp mở rộng kinh doanh.',
            'Khoa': 'Thu nhập ổn định từ chuyên môn, trí tuệ.',
            'Kỵ': '⚠ Dễ hao tài, đầu tư rủi ro cao. Thận trọng chi tiêu, tránh cho vay lớn.'
        },
        'QUAN LỘC': {
            'Lộc': '🌟 Công việc hanh thông, cơ hội thăng tiến cao.',
            'Quyền': 'Được giao trọng trách, phù hợp khởi nghiệp hoặc mở rộng.',
            'Khoa': 'Danh tiếng nghề nghiệp tốt, được nể trọng.',
            'Kỵ': '⚠ Công việc gặp trở ngại, cẩn trọng hợp đồng và giấy tờ.'
        },
        'THIÊN DI': {
            'Lộc': 'Đi xa gặp may, hợp tác ngoài thuận lợi.',
            'Quyền': 'Ra ngoài có uy, dễ được giúp đỡ.',
            'Khoa': 'Học hỏi bên ngoài tốt, quý nhân ở xa.',
            'Kỵ': '⚠ Đi xa dễ gặp rủi ro. Tránh đầu tư xa nhà.'
        },
        'HUYNH ĐỆ': {
            'Lộc': 'Anh em bạn bè hỗ trợ tốt, hợp tác thuận lợi.',
            'Quyền': 'Anh em có ảnh hưởng mạnh, cần tế nhị.',
            'Khoa': 'Nhận được lời khuyên quý từ bạn bè, anh em.',
            'Kỵ': '⚠ Dễ xung đột với anh em, bạn bè. Cẩn trọng hợp tác.'
        },
        'TỬ TỨC': {
            'Lộc': 'Con cái mang niềm vui, phù hợp sinh con.',
            'Quyền': 'Con cái nổi bật, có tài. Cần định hướng đúng.',
            'Khoa': 'Con cái học hành tốt, thi cử đỗ đạt.',
            'Kỵ': '⚠ Con cái dễ gây phiền muộn. Cần quan tâm nhiều hơn.'
        },
        'NÔ BỘC': {
            'Lộc': 'Nhân sự hỗ trợ tốt, tìm được người tài.',
            'Quyền': 'Có sức chỉ huy, được cấp dưới nể phục.',
            'Khoa': 'Đội ngũ giỏi, nhân sự trình độ cao.',
            'Kỵ': '⚠ Dễ bị phản bội, nhân sự gây rắc rối. Cẩn trọng đối tác.'
        },
        'ĐIỀN TRẠCH': {
            'Lộc': '🏠 Thuận lợi mua nhà đất, bất động sản tăng giá.',
            'Quyền': 'Nắm quyền sở hữu BĐS, gia sản ổn định.',
            'Khoa': 'Nhà cửa yên ổn, phong thủy tốt. Phù hợp cải tạo.',
            'Kỵ': '⚠ Nhà cửa dễ sự cố. Cẩn trọng giấy tờ đất đai.'
        },
        'PHÚC ĐỨC': {
            'Lộc': 'Phúc lộc dồi dào, tổ tiên phù hộ.',
            'Quyền': 'Tâm linh mạnh mẽ, ý chí kiên định.',
            'Khoa': 'Ngộ đạo tốt, trí tuệ minh mẫn.',
            'Kỵ': '⚠ Phúc đức bị động, chú ý phần mộ. Nên cúng giải hạn.'
        },
        'PHỤ MẪU': {
            'Lộc': 'Cha mẹ khỏe mạnh, gia đình hài hòa.',
            'Quyền': 'Cha mẹ có uy, gia đình hưng vượng.',
            'Khoa': 'Được thừa hưởng trí tuệ gia đình, phù hợp học tập.',
            'Kỵ': '⚠ Cha mẹ dễ gặp vấn đề sức khỏe. Cần chăm sóc nhiều hơn.'
        },
        'TẬT ÁCH': {
            'Lộc': 'Sức khỏe tốt, ít bệnh tật, tinh thần phấn chấn.',
            'Quyền': 'Thể lực dồi dào, sức khỏe mạnh mẽ.',
            'Khoa': 'Nếu bệnh sẽ gặp thầy giỏi, chẩn đoán chính xác.',
            'Kỵ': '⚠ Sức khỏe suy giảm, dễ phát bệnh. Cần khám định kỳ.'
        }
    };

    /**
     * Luận giải Lưu Tứ Hóa rơi vào các cung
     * @returns {Array} Danh sách luận giải
     */
    function luanGiaiLuuTuHoa(lasoData) {
        if (!lasoData.luuTuHoa || !lasoData.saoMap) return [];

        const results = [];
        const hoaNames = ['Hoá Lộc', 'Hoá Quyền', 'Hoá Khoa', 'Hoá Kỵ'];
        const hoaTypes = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];

        hoaNames.forEach(function (hoaName, idx) {
            const saoName = lasoData.luuTuHoa[hoaName];
            const hoaType = hoaTypes[idx];

            // Tìm vị trí sao trong saoMap
            for (let i = 0; i < 12; i++) {
                const saoList = lasoData.saoMap[i] || [];
                const found = saoList.find(function (s) { return s.name === saoName; });
                if (found) {
                    const cungName = lasoData.cungMap[i] || '';
                    const meaning = (LUU_HOA_MEANING[cungName] || {})[hoaType] || '';

                    results.push({
                        hoaType: hoaType,
                        hoaName: hoaName,
                        saoName: saoName,
                        cungPos: i,
                        cungName: cungName,
                        chiName: CHI_NAMES[i],
                        meaning: meaning,
                        isNegative: hoaType === 'Kỵ',
                        isVeryGood: hoaType === 'Lộc'
                    });
                    break;
                }
            }
        });

        return results;
    }

    // =====================
    // P3: TRIGGER LOGIC (Kích hoạt Sát tinh)
    // =====================

    /**
     * Phân tích overlay hung tinh tại từng cung
     * So sánh sao gốc hung + sao lưu hung → tính hệ số nhân
     * @returns {Array} Cảnh báo overlay
     */
    function analyzeHungTinhOverlay(lasoData) {
        if (!lasoData.saoMap) return [];

        const alerts = [];
        const HUNG_GOC = ['Kình Dương', 'Đà La', 'Hoả Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp',
            'Thiên Hình', 'Tang Môn', 'Bạch Hổ', 'Thiên Khốc', 'Thiên Hư'];
        const HUNG_LUU = ['Lưu Kình Dương', 'Lưu Đà La', 'Lưu Hoả Tinh', 'Lưu Linh Tinh',
            'Lưu Tang Môn', 'Lưu Bạch Hổ', 'Lưu Điếu Khách'];

        for (let i = 0; i < 12; i++) {
            const saoList = lasoData.saoMap[i] || [];
            const cungName = lasoData.cungMap[i] || '';

            // Đếm hung tinh gốc
            const hungGocFound = [];
            const hungLuuFound = [];
            let hasHoaKy = false;
            let hasLuuHoaKy = false;

            saoList.forEach(function (s) {
                if (HUNG_GOC.indexOf(s.name) >= 0) hungGocFound.push(s.name);
                if (HUNG_LUU.indexOf(s.name) >= 0) hungLuuFound.push(s.name);
                if (s.hoa === 'Kỵ') hasHoaKy = true;
                if (s.luuHoa === 'Kỵ') hasLuuHoaKy = true;
            });

            // Tính mức độ nghiêm trọng
            const hungGocCount = hungGocFound.length + (hasHoaKy ? 1 : 0);
            const hungLuuCount = hungLuuFound.length + (hasLuuHoaKy ? 1 : 0);
            const totalHung = hungGocCount + hungLuuCount;

            if (hungGocCount >= 1 && hungLuuCount >= 1 && totalHung >= 3) {
                let severity = 'warning';
                let multiplier = 1.5;
                let description = '';

                if (totalHung >= 5 || (hasHoaKy && hasLuuHoaKy)) {
                    severity = 'critical';
                    multiplier = 3.0;
                    description = '🔴 CỰC KỲ NGUY HIỂM: Hung tinh gốc chồng lưu niên, Hóa Kỵ Song Kỵ';
                } else if (totalHung >= 4 || hasHoaKy || hasLuuHoaKy) {
                    severity = 'danger';
                    multiplier = 2.0;
                    description = '🟠 NGUY HIỂM: Nhiều hung tinh kích hoạt, mức độ nghiêm trọng tăng gấp đôi';
                } else {
                    description = '🟡 CẢNH BÁO: Hung tinh gốc bị sao lưu kích hoạt thêm';
                }

                alerts.push({
                    cungPos: i,
                    cungName: cungName,
                    chiName: CHI_NAMES[i],
                    severity: severity,
                    multiplier: multiplier,
                    hungGoc: hungGocFound,
                    hungLuu: hungLuuFound,
                    hasHoaKy: hasHoaKy,
                    hasLuuHoaKy: hasLuuHoaKy,
                    totalHung: totalHung,
                    description: description
                });
            }
        }

        // Sort by severity
        alerts.sort(function (a, b) {
            var sevOrder = { critical: 0, danger: 1, warning: 2 };
            return (sevOrder[a.severity] || 2) - (sevOrder[b.severity] || 2);
        });

        return alerts;
    }

    // =====================
    // P4: LƯU THÁI TUẾ TƯƠNG TÁC
    // =====================

    /**
     * Phân tích cung bị Lưu Thái Tuế "động"
     * Lưu Thái Tuế + cung đó có sao gì → cảnh báo
     * @returns {Object} { dongCung, taiTuePos, interactions }
     */
    function analyzeLuuThaiTue(lasoData) {
        if (!lasoData.canChiNamXem || !lasoData.saoMap) return null;

        const taiTuePos = lasoData.canChiNamXem.chiIndex;
        const taiTueCung = lasoData.cungMap[taiTuePos] || '';
        const taiTueSao = lasoData.saoMap[taiTuePos] || [];

        // Cung bị Thái Tuế kích hoạt
        const doiCung = (taiTuePos + 6) % 12; // Xung chiếu

        const interactions = [];

        // 1. Cung có Lưu Thái Tuế
        const chinhTinhTaiTue = taiTueSao.filter(function (s) { return s.type === 'chinh'; });
        const hungTinhTaiTue = taiTueSao.filter(function (s) { return s.nature === 'hung'; });

        if (hungTinhTaiTue.length >= 2) {
            interactions.push({
                type: 'dong_manh',
                cungPos: taiTuePos,
                cungName: taiTueCung,
                description: '⚡ Cung ' + taiTueCung + ' (' + CHI_NAMES[taiTuePos] + ') bị Thái Tuế + ' +
                    hungTinhTaiTue.length + ' hung tinh kích hoạt mạnh. Cần đặc biệt cẩn trọng trong lĩnh vực này.'
            });
        }

        // 2. Xung chiếu đối cung
        const doiCungName = lasoData.cungMap[doiCung] || '';
        const doiCungSao = lasoData.saoMap[doiCung] || [];
        const hungDoiCung = doiCungSao.filter(function (s) { return s.nature === 'hung'; });

        if (hungDoiCung.length >= 2) {
            interactions.push({
                type: 'xung_chieu',
                cungPos: doiCung,
                cungName: doiCungName,
                description: '⚡ Cung ' + doiCungName + ' (' + CHI_NAMES[doiCung] + ') bị Thái Tuế xung chiếu + ' +
                    hungDoiCung.length + ' hung tinh. Lĩnh vực này bất ổn.'
            });
        }

        // 3. So sánh Thái Tuế vs Đại Vận
        let daiVanConflict = null;
        if (lasoData.daiVanHienTai) {
            const dvPos = lasoData.daiVanHienTai.cungPos;
            if (dvPos === taiTuePos) {
                daiVanConflict = {
                    type: 'trung_dai_van',
                    description: '🔥 Lưu Thái Tuế TRÙNG cung Đại Vận! Năm nay cung ' + taiTueCung + ' bị kích hoạt cực mạnh. Biến động lớn trong lĩnh vực ' + taiTueCung + '.'
                };
            } else if (dvPos === doiCung) {
                daiVanConflict = {
                    type: 'xung_dai_van',
                    description: '⚡ Lưu Thái Tuế XUNG CHIẾU cung Đại Vận! Áp lực lớn từ các yếu tố bên ngoài.'
                };
            }
        }

        // 4. So sánh Thái Tuế vs Tiểu Vận  
        let tieuVanConflict = null;
        if (lasoData.tieuVan) {
            const tvPos = lasoData.tieuVan.cungPos;
            if (tvPos === taiTuePos) {
                tieuVanConflict = {
                    type: 'trung_tieu_van',
                    description: '🔥 Lưu Thái Tuế TRÙNG cung Tiểu Vận! Biến động nội tại cá nhân mạnh.'
                };
            }
        }

        // Lời giải tổng quan theo tên cung bị Thái Tuế
        const taiTueCungGiai = {
            'MỆNH': 'Thái Tuế nhập Mệnh: vận mệnh biến động, nên sống chậm, tu tâm.',
            'PHU THÊ': 'Thái Tuế nhập Phu Thê: tình cảm dễ xáo trộn, cần kiên nhẫn.',
            'TÀI BẠCH': 'Thái Tuế nhập Tài Bạch: tài chính biến động lớn, cẩn trọng đầu tư.',
            'QUAN LỘC': 'Thái Tuế nhập Quan Lộc: sự nghiệp biến động, có thể đổi việc lớn.',
            'THIÊN DI': 'Thái Tuế nhập Thiên Di: nhiều dịch chuyển, cẩn trọng di chuyển xa.',
            'HUYNH ĐỆ': 'Thái Tuế nhập Huynh Đệ: quan hệ bạn bè xáo trộn, tỉnh táo hợp tác.',
            'TỬ TỨC': 'Thái Tuế nhập Tử Tức: chuyện con cái biến động, cần quan tâm.',
            'NÔ BỘC': 'Thái Tuế nhập Nô Bộc: nhân sự dễ rắc rối, cẩn trọng dùng người.',
            'ĐIỀN TRẠCH': 'Thái Tuế nhập Điền Trạch: nhà cửa, BĐS biến động.',
            'PHÚC ĐỨC': 'Thái Tuế nhập Phúc Đức: tâm linh cần chú ý, nên cúng giải hạn.',
            'PHỤ MẪU': 'Thái Tuế nhập Phụ Mẫu: sức khỏe cha mẹ cần quan tâm.',
            'TẬT ÁCH': 'Thái Tuế nhập Tật Ách: sức khỏe biến động, nên khám tổng quát.'
        };

        return {
            taiTuePos: taiTuePos,
            taiTueCung: taiTueCung,
            taiTueChiName: CHI_NAMES[taiTuePos],
            cungGiai: taiTueCungGiai[taiTueCung] || '',
            chinhTinhTaiTue: chinhTinhTaiTue.map(function (s) { return s.name; }),
            interactions: interactions,
            daiVanConflict: daiVanConflict,
            tieuVanConflict: tieuVanConflict
        };
    }

    // =====================
    // P5: PHÂN TÍCH NGUYỆT HẠN (12 tháng)
    // =====================

    /**
     * Phân tích chi tiết 12 tháng
     * Mỗi tháng: cung qua + sao trong cung → điểm năng lượng
     */
    function analyzeNguyetHan(lasoData) {
        if (!lasoData.nguyetHan || !lasoData.saoMap) return [];

        const results = [];

        lasoData.nguyetHan.forEach(function (month) {
            const cungPos = month.cungPos;
            const cungName = lasoData.cungMap[cungPos] || '';
            const saoList = lasoData.saoMap[cungPos] || [];

            // Phân loại sao
            const chinhTinh = saoList.filter(function (s) { return s.type === 'chinh'; });
            const catTinh = saoList.filter(function (s) { return s.nature === 'cat'; });
            const hungTinh = saoList.filter(function (s) { return s.nature === 'hung'; });
            const luuTinh = saoList.filter(function (s) { return s.type === 'luu'; });

            // Tính điểm năng lượng cơ bản
            let energy = 50; // Base 50/100

            chinhTinh.forEach(function (s) {
                if (s.nature === 'cat') energy += 8;
                else if (s.nature === 'hung') energy -= 8;
                else energy += 3;
                // Bonus Miếu/Hãm
                if (typeof TuViStarPatterns !== 'undefined') {
                    var status = TuViStarPatterns.getStarStatus(s.name, cungPos);
                    if (status === 'mieu') energy += 5;
                    else if (status === 'vuong') energy += 3;
                    else if (status === 'ham') energy -= 5;
                }
            });

            catTinh.forEach(function (s) {
                if (s.type !== 'chinh') energy += 3;
                if (s.hoa === 'Lộc') energy += 8;
                if (s.hoa === 'Quyền') energy += 5;
                if (s.hoa === 'Khoa') energy += 4;
                if (s.luuHoa === 'Lộc') energy += 6;
                if (s.luuHoa === 'Quyền') energy += 4;
                if (s.luuHoa === 'Khoa') energy += 3;
            });

            hungTinh.forEach(function (s) {
                if (s.type !== 'chinh') energy -= 4;
                if (s.hoa === 'Kỵ') energy -= 10;
                if (s.luuHoa === 'Kỵ') energy -= 8;
            });

            // Lưu niên sao ảnh hưởng
            luuTinh.forEach(function (s) {
                if (s.nature === 'cat') energy += 3;
                else if (s.nature === 'hung') energy -= 4;
            });

            // Tuần/Triệt
            if (lasoData.tuanTriet) {
                if (lasoData.tuanTriet.tuan.indexOf(cungPos) >= 0) energy -= 5;
                if (lasoData.tuanTriet.triet.indexOf(cungPos) >= 0) energy -= 8;
            }

            // Clamp 0-100
            energy = Math.max(0, Math.min(100, energy));

            // Đánh giá mức
            let level = '';
            if (energy >= 75) level = 'rat_tot';
            else if (energy >= 60) level = 'tot';
            else if (energy >= 45) level = 'binh_thuong';
            else if (energy >= 30) level = 'xau';
            else level = 'rat_xau';

            results.push({
                thang: month.thang,
                cungPos: cungPos,
                cungName: cungName,
                chiName: CHI_NAMES[cungPos],
                canChiThang: month.canChiThang,
                chinhTinh: chinhTinh.map(function (s) { return s.name; }),
                catCount: catTinh.length,
                hungCount: hungTinh.length,
                luuCount: luuTinh.length,
                energy: Math.round(energy),
                level: level,
                // Highlight events
                hasHoaLoc: saoList.some(function (s) { return s.hoa === 'Lộc' || s.luuHoa === 'Lộc'; }),
                hasHoaKy: saoList.some(function (s) { return s.hoa === 'Kỵ' || s.luuHoa === 'Kỵ'; })
            });
        });

        return results;
    }

    // =====================
    // P6: ENERGY SCORE JSON
    // =====================

    /**
     * Tính Energy Score tổng hợp cho 3 trụ: Tài chính - Sức khỏe - Tình cảm
     * Dựa trên sao trong cung tương ứng + lưu niên + tháng
     */
    function calculateEnergyScore(lasoData) {
        if (!lasoData.saoMap || !lasoData.cungMap) return null;

        // Cung đại diện cho mỗi trụ
        const pillars = {
            taiChinh: { houses: ['TÀI BẠCH', 'ĐIỀN TRẠCH', 'QUAN LỘC'], weight: [0.5, 0.25, 0.25] },
            sucKhoe: { houses: ['TẬT ÁCH', 'MỆNH', 'PHÚC ĐỨC'], weight: [0.5, 0.30, 0.20] },
            tinhCam: { houses: ['PHU THÊ', 'TỬ TỨC', 'HUYNH ĐỆ'], weight: [0.5, 0.25, 0.25] }
        };

        function scoreCung(cungName) {
            var pos = -1;
            for (var k = 0; k < 12; k++) {
                if (lasoData.cungMap[k] === cungName) { pos = k; break; }
            }
            if (pos < 0) return 50;

            var saoList = lasoData.saoMap[pos] || [];
            var score = 50;

            saoList.forEach(function (s) {
                if (s.nature === 'cat') {
                    score += (s.type === 'chinh' ? 6 : 3);
                    if (s.hoa === 'Lộc') score += 10;
                    if (s.hoa === 'Quyền') score += 6;
                    if (s.luuHoa === 'Lộc') score += 8;
                } else if (s.nature === 'hung') {
                    score -= (s.type === 'chinh' ? 6 : 3);
                    if (s.hoa === 'Kỵ') score -= 12;
                    if (s.luuHoa === 'Kỵ') score -= 10;
                }
            });

            // Tuần/Triệt penalty
            if (lasoData.tuanTriet) {
                if (lasoData.tuanTriet.tuan.indexOf(pos) >= 0) score -= 5;
                if (lasoData.tuanTriet.triet.indexOf(pos) >= 0) score -= 8;
            }

            return Math.max(0, Math.min(100, Math.round(score)));
        }

        var result = {};
        Object.keys(pillars).forEach(function (key) {
            var pillar = pillars[key];
            var totalScore = 0;
            var details = [];

            pillar.houses.forEach(function (house, idx) {
                var s = scoreCung(house);
                totalScore += s * pillar.weight[idx];
                details.push({ house: house, score: s });
            });

            result[key] = {
                score: Math.round(totalScore),
                details: details
            };
        });

        // Overall
        result.overall = Math.round((result.taiChinh.score + result.sucKhoe.score + result.tinhCam.score) / 3);

        // Monthly energy (nếu có nguyệt hạn)
        result.monthly = [];
        if (lasoData.nguyetHan) {
            var nguyetHanAnalysis = analyzeNguyetHan(lasoData);
            result.monthly = nguyetHanAnalysis.map(function (m) {
                return {
                    thang: m.thang,
                    energy: m.energy,
                    level: m.level,
                    cungName: m.cungName
                };
            });
        }

        return result;
    }

    // =====================
    // P7: ĐẠI VẬN TỨ HÓA (Trung Châu Phái - Giai đoạn 3)
    // =====================

    /**
     * Luận giải Đại Vận Tứ Hóa
     * @param {Object} lasoData
     * @returns {Object|null}
     */
    function analyzeDaiVanTuHoa(lasoData) {
        if (!lasoData.daiVanTuHoa) return null;

        var dvTH = lasoData.daiVanTuHoa;
        var result = {
            canDaiVan: dvTH.canDaiVan,
            items: [],
            kyTrungPhung: lasoData.kyTrungPhung || null
        };

        // Luận giải mỗi Hóa rơi vào cung nào
        for (var i = 0; i < dvTH.details.length; i++) {
            var detail = dvTH.details[i];
            var cungName = detail.cungName;
            var hoaType = detail.hoaType;
            var meaning = '';

            // Dùng LUU_HOA_MEANING có sẵn → reuse cho ĐV
            if (LUU_HOA_MEANING[cungName] && LUU_HOA_MEANING[cungName][hoaType]) {
                meaning = 'Đại Vận ' + LUU_HOA_MEANING[cungName][hoaType];
            } else {
                meaning = 'Đại Vận Hóa ' + hoaType + ' tại ' + cungName + '.';
            }

            result.items.push({
                hoaType: hoaType,
                hoaName: detail.hoaName,
                saoName: detail.saoName,
                cungName: cungName,
                meaning: meaning,
                isNegative: detail.isNegative
            });
        }

        return result;
    }

    // =====================
    // TỔNG HỢP PHÂN TÍCH LƯU NIÊN
    // =====================

    /**
     * Phân tích toàn diện lưu niên
     * Gọi tất cả P2-P7
     */
    function analyzeFull(lasoData) {
        return {
            luuTuHoa: luanGiaiLuuTuHoa(lasoData),
            hungTinhOverlay: analyzeHungTinhOverlay(lasoData),
            thaiTue: analyzeLuuThaiTue(lasoData),
            nguyetHan: analyzeNguyetHan(lasoData),
            energyScore: calculateEnergyScore(lasoData),
            daiVanTuHoa: analyzeDaiVanTuHoa(lasoData)
        };
    }

    // =====================
    // EXPORTS
    // =====================

    return {
        luanGiaiLuuTuHoa: luanGiaiLuuTuHoa,
        analyzeHungTinhOverlay: analyzeHungTinhOverlay,
        analyzeLuuThaiTue: analyzeLuuThaiTue,
        analyzeNguyetHan: analyzeNguyetHan,
        calculateEnergyScore: calculateEnergyScore,
        analyzeDaiVanTuHoa: analyzeDaiVanTuHoa,
        analyzeFull: analyzeFull,
        LUU_HOA_MEANING: LUU_HOA_MEANING
    };
})();
