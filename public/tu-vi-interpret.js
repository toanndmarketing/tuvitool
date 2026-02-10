/**
 * ============================================
 * TỬ VI INTERPRET - Frontend Interpretation
 * Gọi API Backend để lấy dữ liệu diễn giải
 * + Gọi Gemini AI qua Backend
 * ============================================
 */

const TuViInterpret = (function () {
    'use strict';

    // Data từ DB (không cache - luôn lấy mới từ DB mỗi lần)
    let _saoData = null;
    let _cungData = null;
    let _specialData = null;

    // =====================
    // LOAD DATA TỪ API
    // =====================

    /**
     * Load tất cả data diễn giải từ backend
     */
    async function loadInterpretationData() {
        // Luôn gọi DB mới mỗi lần (không cache)
        try {
            const resp = await fetch('/api/interpretations/all');
            if (!resp.ok) throw new Error('API error: ' + resp.status);

            const data = await resp.json();
            _saoData = data.sao || {};
            _cungData = data.cung || {};
            _specialData = data.special || {};
            console.log('[Interpret] Data loaded from DB');
        } catch (err) {
            console.error('[Interpret] Failed to load data:', err);
            // Fallback: dùng data trống
            _saoData = {};
            _cungData = {};
            _specialData = {};
        }
    }

    // =====================
    // PHÂN TÍCH TỔNG HỢP
    // =====================

    function analyzeCung(cungName, saoList, pos, lasoData) {
        const cungInfo = _cungData[cungName] || {};
        const chinhTinh = saoList.filter(s => s.type === 'chinh');
        const phuTinh = saoList.filter(s => s.type !== 'chinh');
        const catTinh = saoList.filter(s => s.nature === 'cat');
        const hungTinh = saoList.filter(s => s.nature === 'hung');

        // Xác định độ phụ thuộc vào giờ sinh
        const hourStars = ['Văn Xương', 'Văn Khúc', 'Địa Không', 'Địa Kiếp', 'Hoả Tinh', 'Linh Tinh'];
        const hasHourStars = saoList.some(s => hourStars.includes(s.name));
        const isMenhThan = (pos === lasoData.cungMenhPos || pos === lasoData.cungThanPos);

        let analysis = {
            cungName,
            pos,
            isHourDependent: isMenhThan || hasHourStars,
            hourDependentReason: isMenhThan ? 'Cung Mệnh/Thân' : (hasHourStars ? 'Chứa sao an theo giờ' : ''),
            icon: cungInfo.icon || '🔮',
            desc: cungInfo.desc || '',
            chinhTinh: [],
            phuTinh: [],
            combos: [],       // Cặp sao kết hợp
            voChinhDieu: null, // Vô Chính Diệu info
            truongSinh: null,  // Tràng Sinh info
            tuanTriet: null,   // Tuần/Triệt info
            nhaiNguyet: null,  // Thái Dương/Thái Âm sáng tối
            overall: '',
            rating: 0
        };

        // === VÔ CHÍNH DIỆU ===
        if (chinhTinh.length === 0 && typeof TuViStarPatterns !== 'undefined') {
            analysis.voChinhDieu = TuViStarPatterns.luanVoChinhDieu(pos, cungName, lasoData.saoMap, lasoData.cungMap);
        }

        // === ANALYZE CHÍNH TINH (có miếu hãm + Thái Dương/Âm sáng tối) ===
        chinhTinh.forEach(s => {
            const info = _saoData[s.name] || {};
            let starStatus = '';
            let statusText = '';
            let statusRatingBonus = 0;

            // Miếu Hãm
            if (typeof TuViStarPatterns !== 'undefined') {
                starStatus = TuViStarPatterns.getStarStatus(s.name, pos);
                if (starStatus === 'mieu') { statusText = '⬆ Miếu (rất mạnh)'; statusRatingBonus = 2; }
                else if (starStatus === 'vuong') { statusText = '⬆ Vượng (mạnh)'; statusRatingBonus = 1; }
                else if (starStatus === 'dac') { statusText = '➡ Đắc (khá)'; statusRatingBonus = 0; }
                else if (starStatus === 'ham') { statusText = '⬇ Hãm (yếu)'; statusRatingBonus = -2; }
            }

            // Thái Dương sáng/tối
            let nhaiNguyetInfo = null;
            if (s.name === 'Thái Dương' && typeof TuViStarPatterns !== 'undefined') {
                nhaiNguyetInfo = TuViStarPatterns.luanThaiDuong(pos);
                statusRatingBonus += nhaiNguyetInfo.rating;
                analysis.nhaiNguyet = nhaiNguyetInfo;
            }
            if (s.name === 'Thái Âm' && typeof TuViStarPatterns !== 'undefined') {
                nhaiNguyetInfo = TuViStarPatterns.luanThaiAm(pos);
                statusRatingBonus += nhaiNguyetInfo.rating;
                analysis.nhaiNguyet = nhaiNguyetInfo;
            }

            analysis.chinhTinh.push({
                name: s.name,
                hoa: s.hoa || null,
                luuHoa: s.luuHoa || null,
                icon: info.icon || '⭐',
                short: info.short || '',
                detail: info.detail || '',
                good: info.good || '',
                bad: info.bad || '',
                status: starStatus,
                statusText: statusText,
                statusRatingBonus: statusRatingBonus,
                nhaiNguyetInfo: nhaiNguyetInfo
            });
        });

        // === ANALYZE PHỤ TINH QUAN TRỌNG ===
        const importantPhuTinh = ['Tả Phụ', 'Hữu Bật', 'Văn Xương', 'Văn Khúc',
            'Thiên Khôi', 'Thiên Việt', 'Lộc Tồn', 'Kình Dương', 'Đà La',
            'Hoả Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Thiên Mã',
            'Đào Hoa', 'Hồng Loan', 'Thiên Hỷ', 'Tang Môn', 'Bạch Hổ',
            'Điếu Khách', 'Thiên Hình', 'Cô Thần', 'Quả Tú', 'Thiên La', 'Địa Võng',
            'Thai Phụ', 'Quốc Ấn', 'Đường Phù', 'Thiên Quan', 'Thiên Phúc'];
        phuTinh.forEach(s => {
            if (importantPhuTinh.includes(s.name) || s.hoa || s.luuHoa) {
                const info = _saoData[s.name] || {};
                analysis.phuTinh.push({
                    name: s.name,
                    hoa: s.hoa || null,
                    luuHoa: s.luuHoa || null,
                    nature: s.nature,
                    icon: info.icon || (s.nature === 'cat' ? '✅' : s.nature === 'hung' ? '❌' : '➖'),
                    short: info.short || '',
                    good: info.good || '',
                    bad: info.bad || ''
                });
            }
        });

        // === DETECT CẶP SAO KẾT HỢP ===
        if (typeof TuViStarPatterns !== 'undefined') {
            analysis.combos = TuViStarPatterns.detectCombos(saoList, pos);
        }

        // === TRÀNG SINH ===
        if (lasoData.truongSinhMap && lasoData.truongSinhMap[pos] && typeof TuViStarPatterns !== 'undefined') {
            const tsName = lasoData.truongSinhMap[pos];
            analysis.truongSinh = TuViStarPatterns.luanTruongSinh(tsName);
            analysis.truongSinh.name = tsName;
        }

        // === TUẦN / TRIỆT ===
        if (lasoData.tuanTriet && typeof TuViStarPatterns !== 'undefined') {
            const biTuan = TuViStarPatterns.isTuan(pos, lasoData.tuanTriet);
            const biTriet = TuViStarPatterns.isTriet(pos, lasoData.tuanTriet);
            if (biTuan || biTriet) {
                analysis.tuanTriet = {
                    tuan: biTuan,
                    triet: biTriet,
                    text: biTuan
                        ? 'Cung bị Tuần Trung Không — sao cát bị giảm lực, sao hung cũng bớt xấu. Như mây che nắng, giảm cả tốt lẫn xấu.'
                        : 'Cung bị Triệt Lộ — tuyệt đường, sao bị triệt tiêu lực. Khó phát huy, cần nỗ lực gấp đôi để vượt qua.',
                    rating: biTriet ? -2 : -1
                };
            }
        }

        // === TÍNH RATING NÂNG CAO ===
        let rating = 0;

        // 1. Rating từ chính tinh (có miếu hãm weight)
        analysis.chinhTinh.forEach(ct => {
            // Thất Sát là hung duy nhất trong chính tinh
            let baseScore = ct.name === 'Thất Sát' ? -1 : 2;
            // Sao trung tính bắt đầu +1
            if (['Vũ Khúc', 'Tham Lang', 'Cự Môn', 'Liêm Trinh', 'Phá Quân'].indexOf(ct.name) >= 0) {
                baseScore = 1;
            }
            // Miếu hãm adjustment
            baseScore += ct.statusRatingBonus;
            // Hoá
            if (ct.hoa === 'Lộc' || ct.hoa === 'Quyền' || ct.hoa === 'Khoa') baseScore += 2;
            if (ct.hoa === 'Kỵ') baseScore -= 2;
            if (ct.luuHoa === 'Lộc') baseScore += 1;
            if (ct.luuHoa === 'Kỵ') baseScore -= 1;
            rating += baseScore;
        });

        // 2. Rating từ phụ tinh
        catTinh.filter(s => s.type !== 'chinh').forEach(s => {
            rating += 1;
            if (s.hoa === 'Lộc' || s.hoa === 'Quyền' || s.hoa === 'Khoa') rating += 1;
        });
        hungTinh.filter(s => s.type !== 'chinh').forEach(s => {
            rating -= 1;
            if (s.hoa === 'Kỵ') rating -= 1;
        });

        // 3. Rating từ cặp sao
        analysis.combos.forEach(combo => {
            if (combo.nature === 'cat') rating += (combo.isMieu ? 2 : 1);
            else if (combo.nature === 'hung') rating -= (combo.isHam ? 2 : 1);
        });

        // 4. Rating từ Vô Chính Diệu
        if (analysis.voChinhDieu) {
            rating += analysis.voChinhDieu.rating;
        }

        // 5. Rating từ Tràng Sinh
        if (analysis.truongSinh) {
            rating += Math.round(analysis.truongSinh.rating * 0.5);
        }

        // 6. Rating từ Tuần/Triệt
        if (analysis.tuanTriet) {
            rating += analysis.tuanTriet.rating;
        }

        // Normalize to 1-5 stars
        analysis.rating = Math.max(1, Math.min(5, Math.round(rating / 3) + 3));

        // === BUILD OVERALL TEXT (TÓM TẮT NGẮN GỌN) ===
        // Chi tiết đã được hiện ở phần sao, cặp sao, tràng sinh... bên trên
        // Phần tóm tắt chỉ đưa ra verdict ngắn, không lặp lại
        let overallParts = [];

        // Vô Chính Diệu (đặc biệt quan trọng, cần nhắc)
        if (analysis.voChinhDieu) {
            overallParts.push(analysis.voChinhDieu.text);
        }

        // Tuần/Triệt (đáng nhắc vì ảnh hưởng tổng)
        if (analysis.tuanTriet) {
            overallParts.push(analysis.tuanTriet.tuan ? '⚡ Bị Tuần — sao cát giảm, sao hung bớt.' : '⚡ Bị Triệt — sao bị triệt tiêu lực.');
        }

        // Verdict ngắn gọn
        if (analysis.rating >= 4) {
            overallParts.push('→ Cung này RẤT TỐT, nhiều yếu tố thuận lợi.');
        } else if (analysis.rating >= 3) {
            overallParts.push('→ Cung này khá, cần phát huy thêm.');
        } else if (analysis.rating >= 2) {
            overallParts.push('→ Cát hung lẫn lộn, cần cẩn trọng.');
        } else {
            overallParts.push('→ Nhiều thách thức, cần tu tâm dưỡng đức.');
        }

        analysis.overall = overallParts.join(' ');

        return analysis;
    }

    function analyzeSpecial(lasoData) {
        const specials = [];

        if (lasoData.amDuongNghichLy && _specialData.am_duong_nghich_ly) {
            const s = _specialData.am_duong_nghich_ly;
            specials.push({ icon: s.icon, title: s.title, content: s.description, dep: '📅 Năm sinh' });
        }

        if (lasoData.cucKhacMenh && _specialData.cuc_khac_menh) {
            const s = _specialData.cuc_khac_menh;
            specials.push({
                icon: s.icon, title: s.title,
                content: `${s.description} (Cục ${lasoData.hanhCuc} khắc Mệnh ${lasoData.hanhMenh})`,
                dep: '⏰ Giờ sinh',
                isHour: true
            });
        }

        if (lasoData.thanMenhDongCung && _specialData.than_menh_dong_cung) {
            const s = _specialData.than_menh_dong_cung;
            specials.push({ icon: s.icon, title: s.title, content: s.description, dep: '⏰ Giờ sinh', isHour: true });
        }

        // Tứ Hoá
        const tuHoa = lasoData.tuHoa;
        if (tuHoa && _specialData.tu_hoa) {
            const s = _specialData.tu_hoa;
            specials.push({
                icon: s.icon, title: s.title,
                content: `${s.description}\n\nHoá Lộc: ${tuHoa['Hoá Lộc']} → Tăng tài lộc, may mắn.\nHoá Quyền: ${tuHoa['Hoá Quyền']} → Tăng quyền lực, uy tín.\nHoá Khoa: ${tuHoa['Hoá Khoa']} → Tăng học vấn, danh tiếng.\nHoá Kỵ: ${tuHoa['Hoá Kỵ']} → Gây trở ngại, thị phi.`,
                dep: '📅 Năm sinh'
            });
        }

        // === NẠP ÂM CHI TIẾT (MỚI) ===
        if (lasoData.menhNapAm && typeof TuViStarPatterns !== 'undefined') {
            const napAmText = TuViStarPatterns.luanNapAm(lasoData.menhNapAm);
            if (napAmText) {
                specials.push({
                    icon: '🔥',
                    title: 'Nạp Âm: ' + lasoData.menhNapAm,
                    content: napAmText + '\nHành ' + lasoData.hanhMenh + ' — ' + lasoData.menhNapAm + '.',
                    dep: '📅 Năm sinh'
                });
            }
        }

        // === TUẦN/TRIỆT TẠI MỆNH (MỚI) ===
        if (lasoData.tuanTriet && typeof TuViStarPatterns !== 'undefined') {
            const menhPos = lasoData.cungMenhPos;
            if (TuViStarPatterns.isTuan(menhPos, lasoData.tuanTriet)) {
                specials.push({
                    icon: '🌑',
                    title: 'Tuần Trung Không tại Mệnh',
                    content: 'Mệnh bị Tuần Trung Không — sao cát giảm lực, sao hung bớt xấu. Cần nỗ lực nhiều hơn nhưng ít đại họa.',
                    dep: '📅 Năm sinh',
                    isHour: true
                });
            }
            if (TuViStarPatterns.isTriet(menhPos, lasoData.tuanTriet)) {
                specials.push({
                    icon: '⛔',
                    title: 'Triệt Lộ tại Mệnh',
                    content: 'Mệnh bị Triệt Lộ — sao bị triệt tiêu lực. Nửa đầu đời trắc trở, tự lập sớm; nửa sau khởi sắc.',
                    dep: '📅 Năm sinh',
                    isHour: true
                });
            }
        }

        // === SONG KỴ / SONG LỘC TẠI MỆNH (MỚI) ===
        if (lasoData.saoMap && lasoData.cungMenhPos !== undefined) {
            const menhSao = lasoData.saoMap[lasoData.cungMenhPos] || [];
            let hasGocKy = false, hasLuuKy = false, hasGocLoc = false, hasLuuLoc = false;
            menhSao.forEach(s => {
                if (s.hoa === 'Kỵ') hasGocKy = true;
                if (s.luuHoa === 'Kỵ') hasLuuKy = true;
                if (s.hoa === 'Lộc') hasGocLoc = true;
                if (s.luuHoa === 'Lộc') hasLuuLoc = true;
            });
            const hasLocTon = menhSao.some(s => s.name === 'Lộc Tồn' || s.name === 'Lưu Lộc Tồn');

            if (hasGocKy && hasLuuKy) {
                specials.push({
                    icon: '⚠️',
                    title: 'Song Kỵ tại Mệnh',
                    content: 'Mệnh SONG KỴ (Hoá Kỵ gốc + Lưu Hoá Kỵ) — tổ hợp cực hung. Dễ thị phi, tổn thất nhiều phía.',
                    dep: '📅 Năm xem'
                });
            }
            if ((hasGocLoc && hasLuuLoc) || (hasGocLoc && hasLocTon) || (hasLuuLoc && hasLocTon)) {
                specials.push({
                    icon: '💰',
                    title: 'Song Lộc tại Mệnh',
                    content: 'Mệnh SONG LỘC — đại cát tài lộc, may mắn kép, tài chính dồi dào.',
                    dep: '📅 Năm xem'
                });
            }
        }

        return specials;
    }

    /**
     * Phân tích Vận Hạn năm xem (Đại Vận + Tiểu Vận + Lưu Niên)
     */
    function analyzeVanHan(lasoData) {
        const dv = lasoData.daiVanHienTai;
        const tv = lasoData.tieuVan;
        if (!dv) return null;

        const cungMap = lasoData.cungMap;
        const saoMap = lasoData.saoMap;

        // Đại Vận
        const dvPos = dv.cungPos;
        const dvCungName = cungMap[dvPos] || '';
        const dvSaoList = saoMap[dvPos] || [];
        const dvChinh = dvSaoList.filter(s => s.type === 'chinh');
        const dvLuu = dvSaoList.filter(s => s.type === 'luu');
        const dvCat = dvSaoList.filter(s => s.nature === 'cat');
        const dvHung = dvSaoList.filter(s => s.nature === 'hung');

        let dvRating = 0;
        dvCat.forEach(s => { dvRating += (s.type === 'chinh' ? 2 : 1); });
        dvHung.forEach(s => { dvRating -= (s.type === 'chinh' ? 2 : 1); });
        dvRating = Math.max(-5, Math.min(5, dvRating));

        // Tiểu Vận
        let tvData = null;
        if (tv) {
            const tvPos = tv.cungPos;
            const tvCungName = cungMap[tvPos] || '';
            const tvSaoList = saoMap[tvPos] || [];
            const tvChinh = tvSaoList.filter(s => s.type === 'chinh');
            tvData = {
                cungPos: tvPos,
                cungName: tvCungName,
                chiName: AmLich.DIA_CHI[tvPos],
                tuoi: tv.tuoi,
                chinhTinh: tvChinh.map(s => s.name)
            };
        }

        // === EVENT SCANNER ===
        let eventScan = { events: [], patterns: [], summary: null };
        try {
            if (typeof TuViEventScanner !== 'undefined') {
                eventScan = TuViEventScanner.scan(lasoData);
                console.log('[EventScanner] Found', eventScan.events.length, 'events,',
                    eventScan.patterns.length, 'patterns');
            }
        } catch (err) {
            console.error('[EventScanner] Error:', err);
        }

        // === LƯU NIÊN ANALYSIS (P2-P6) ===
        let luuNienAnalysis = null;
        try {
            if (typeof TuViLuuNien !== 'undefined') {
                luuNienAnalysis = TuViLuuNien.analyzeFull(lasoData);
                console.log('[LuuNien] Analyzed:',
                    luuNienAnalysis.luuTuHoa.length, 'Tứ Hóa,',
                    luuNienAnalysis.hungTinhOverlay.length, 'hung overlays,',
                    luuNienAnalysis.nguyetHan.length, 'months');
            }
        } catch (err) {
            console.error('[LuuNien] Error:', err);
        }

        // Đánh giá tổng thể (kết hợp scanner summary)
        let overall = '';
        if (eventScan.summary && eventScan.summary.overallText) {
            overall = eventScan.summary.overallText;
        } else {
            if (dvRating >= 3) overall = 'Vận hạn rất tốt, nhiều thuận lợi và cát tinh hội tụ. Nên chủ động nắm bắt cơ hội.';
            else if (dvRating >= 1) overall = 'Vận hạn khá tốt, có nhiều yếu tố hỗ trợ. Cần nỗ lực để phát huy tối đa.';
            else if (dvRating >= -1) overall = 'Vận hạn bình thường, cát hung lẫn lộn. Nên cẩn trọng trong các quyết định lớn.';
            else overall = 'Vận hạn nhiều thách thức, hung tinh chiếu. Cần đề phòng và tu tâm dưỡng đức.';
        }

        // Đại Vận qua cung text
        let daiVanCungInfo = null;
        if (typeof TuViTemplates !== 'undefined') {
            daiVanCungInfo = TuViTemplates.getDaiVanCungText(dvCungName);
        }

        return {
            daiVan: {
                index: dv.index,
                cungPos: dvPos,
                cungName: dvCungName,
                chiName: AmLich.DIA_CHI[dvPos],
                tuoiFrom: dv.tuoiFrom,
                tuoiTo: dv.tuoiTo,
                namFrom: dv.namFrom,
                namTo: dv.namTo,
                chinhTinh: dvChinh.map(s => ({ name: s.name, hoa: s.hoa || null })),
                luuSao: dvLuu.map(s => ({ name: s.name, nature: s.nature })),
                rating: dvRating,
                cungInfo: daiVanCungInfo
            },
            tieuVan: tvData,
            luuTuHoa: lasoData.luuTuHoa || null,
            // P2-P6: Lưu Niên Analysis
            luuNienAnalysis: luuNienAnalysis,
            events: eventScan.events,
            patterns: eventScan.patterns,
            eventSummary: eventScan.summary,
            overall,
            rating: eventScan.summary ? eventScan.summary.rating : (dvRating >= 2 ? 4 : dvRating >= 0 ? 3 : 2)
        };
    }

    /**
     * Tổng hợp diễn giải toàn bộ lá số
     */
    function interpret(lasoData) {
        const result = {
            overview: {},
            palaces: [],
            specials: []
        };

        result.overview = {
            gioiTinh: lasoData.input.gioiTinh,
            cungMenhPos: lasoData.cungMenhPos,
            cungThanPos: lasoData.cungThanPos,
            amDuong: lasoData.amDuong,
            menhNapAm: lasoData.menhNapAm,
            hanhMenh: lasoData.hanhMenh,
            cucName: lasoData.cucName,
            hanhCuc: lasoData.hanhCuc,
            chuMenh: TuViSao.getChuMenh(lasoData.cungMenhPos),
            chuThan: TuViSao.getChuThan(lasoData.cungThanPos),
            thuan: lasoData.thuan
        };

        for (let i = 0; i < 12; i++) {
            const pos = (lasoData.cungMenhPos + i) % 12;
            const cungName = lasoData.cungMap[pos];
            const saoList = lasoData.saoMap[pos] || [];
            const analysis = analyzeCung(cungName, saoList, pos, lasoData);
            analysis.chiIndex = pos;
            analysis.chiName = AmLich.DIA_CHI[pos];
            result.palaces.push(analysis);
        }

        result.specials = analyzeSpecial(lasoData);

        // Vận Hạn (năm xem)
        result.vanHan = analyzeVanHan(lasoData);

        // Lưu ref để render timeline
        result._lasoData = lasoData;

        return result;
    }

    // =====================
    // AI INTERPRETATION
    // =====================

    /**
     * Gọi API để lấy AI interpretation
     * Không tự động show modal, chỉ check auth status
     */
    async function getAiInterpretation(interpretation) {
        // Bypass auth check nếu ở local
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        // Check auth - nếu chưa login và không phải local, return placeholder
        if (!isLocal && !AUTH.isAuthenticated()) {
            return {
                requiresAuth: true,
                message: 'Vui lòng đăng nhập để xem phân tích AI chuyên sâu'
            };
        }

        // Đã login hoặc là local, gọi AI API
        return await callAiApi(interpretation);
    }

    /**
     * Internal: Gọi AI API với auth token
     */
    async function callAiApi(interpretation) {
        try {
            const token = AUTH.getAuthToken();
            const headers = { 'Content-Type': 'application/json' };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const resp = await fetch('/api/interpret/ai', {
                method: 'POST',
                headers,
                body: JSON.stringify(interpretation)
            });

            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.error || 'API error');
            }

            return await resp.json();
        } catch (err) {
            console.error('[AI] Error:', err.message);
            return { error: err.message, fallback: true };
        }
    }

    // =====================
    // RENDER HTML
    // =====================

    function getHanhRelation(hanhCuc, hanhMenh) {
        const sinh = { 'Kim': 'Thuỷ', 'Thuỷ': 'Mộc', 'Mộc': 'Hoả', 'Hoả': 'Thổ', 'Thổ': 'Kim' };
        const khac = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thuỷ': 'Hoả', 'Hoả': 'Kim', 'Thổ': 'Thuỷ' };

        if (hanhCuc === hanhMenh) return 'Cục và Mệnh đồng hành → Hòa hợp, ổn định.';
        if (sinh[hanhCuc] === hanhMenh) return 'Cục sinh Mệnh → Rất tốt, phát triển thuận lợi.';
        if (sinh[hanhMenh] === hanhCuc) return 'Mệnh sinh Cục → Hao sinh lực, phải nỗ lực nhiều.';
        if (khac[hanhCuc] === hanhMenh) return 'Cục khắc Mệnh → Nhiều thử thách, cần kiên cường.';
        if (khac[hanhMenh] === hanhCuc) return 'Mệnh khắc Cục → Có sức mạnh nội tại nhưng hay bị cản trở.';
        return 'Mối quan hệ trung bình.';
    }

    /**
     * Render P2-P6 Lưu Niên Analysis (bên trong Vận Hạn card)
     */
    function renderLuuNienAnalysis(vh, ln) {
        if (!ln) {
            // Fallback: chỉ giữ Lưu Tứ Hóa tên sao cũ
            if (vh.luuTuHoa) {
                return `<div style="margin-bottom:8px;font-size:0.85rem">
                    <strong style="color:var(--accent-gold)">Lưu Tứ Hoá:</strong>
                    Hoá Lộc → ${vh.luuTuHoa['Hoá Lộc']},
                    Hoá Quyền → ${vh.luuTuHoa['Hoá Quyền']},
                    Hoá Khoa → ${vh.luuTuHoa['Hoá Khoa']},
                    Hoá Kỵ → ${vh.luuTuHoa['Hoá Kỵ']}
                </div>`;
            }
            return '';
        }

        let out = '';

        // =====================
        // P6: ENERGY SCORE DASHBOARD (hiển thị đầu tiên - tổng quan visual)
        // =====================
        if (ln.energyScore) {
            const es = ln.energyScore;
            out += `<div class="luu-nien-section-title">📊 Năng Lượng Năm</div>
            <div class="energy-dashboard">
                <div class="energy-pillar" style="--pillar-color:#4caf50">
                    <div class="energy-pillar-icon">💰</div>
                    <div class="energy-pillar-name">Tài Chính</div>
                    <div class="energy-pillar-score">${es.taiChinh.score}</div>
                    <div class="energy-pillar-bar"><div class="energy-pillar-bar-fill" style="width:${es.taiChinh.score}%"></div></div>
                    <div class="energy-pillar-details">${es.taiChinh.details.map(d => d.house + ':' + d.score).join(' | ')}</div>
                </div>
                <div class="energy-pillar" style="--pillar-color:#f44336">
                    <div class="energy-pillar-icon">❤</div>
                    <div class="energy-pillar-name">Sức Khỏe</div>
                    <div class="energy-pillar-score">${es.sucKhoe.score}</div>
                    <div class="energy-pillar-bar"><div class="energy-pillar-bar-fill" style="width:${es.sucKhoe.score}%"></div></div>
                    <div class="energy-pillar-details">${es.sucKhoe.details.map(d => d.house + ':' + d.score).join(' | ')}</div>
                </div>
                <div class="energy-pillar" style="--pillar-color:#e040fb">
                    <div class="energy-pillar-icon">💕</div>
                    <div class="energy-pillar-name">Tình Cảm</div>
                    <div class="energy-pillar-score">${es.tinhCam.score}</div>
                    <div class="energy-pillar-bar"><div class="energy-pillar-bar-fill" style="width:${es.tinhCam.score}%"></div></div>
                    <div class="energy-pillar-details">${es.tinhCam.details.map(d => d.house + ':' + d.score).join(' | ')}</div>
                </div>
                <div class="energy-overall">
                    <span class="energy-overall-label">TỔNG NĂNG LƯỢNG NĂM</span>
                    <span class="energy-overall-score">${es.overall}/100</span>
                </div>
            </div>`;
        }

        // =====================
        // P2: LƯU TỨ HÓA LUẬN GIẢI
        // =====================
        if (ln.luuTuHoa && ln.luuTuHoa.length > 0) {
            out += `<div class="luu-nien-section-title">🔄 Lưu Tứ Hóa Luận Giải</div>`;
            ln.luuTuHoa.forEach(h => {
                const hoaType = h.hoaName.includes('Lộc') ? 'hoa-loc' :
                    h.hoaName.includes('Quyền') ? 'hoa-quyen' :
                        h.hoaName.includes('Khoa') ? 'hoa-khoa' : 'hoa-ky';
                const icon = h.isVeryGood ? '🌟' : (h.isNegative ? '⚠' : '📌');
                out += `<div class="luu-hoa-card ${hoaType}">
                    <div class="luu-hoa-title">${icon} ${h.hoaName}: ${h.saoName} → ${h.cungName} (${h.chiName})</div>
                    <div class="luu-hoa-meaning">${h.meaning}</div>
                </div>`;
            });
        }

        // =====================
        // P3: HUNG TINH OVERLAY
        // =====================
        if (ln.hungTinhOverlay && ln.hungTinhOverlay.length > 0) {
            out += `<div class="luu-nien-section-title">⚡ Hung Tinh Kích Hoạt</div>`;
            ln.hungTinhOverlay.forEach(a => {
                const sevClass = a.severity === 'critical' ? 'severity-critical' :
                    a.severity === 'danger' ? 'severity-danger' : 'severity-warning';
                const sevIcon = a.severity === 'critical' ? '🔴' :
                    a.severity === 'danger' ? '🟠' : '🟡';
                out += `<div class="hung-overlay-item ${sevClass}">
                    <div class="hung-overlay-title">${sevIcon} ${a.cungName} (${a.chiName}) — ${a.severity.toUpperCase()}</div>
                    <div class="hung-overlay-desc">${a.description}</div>
                    <div class="hung-overlay-tags">
                        ${a.hungGoc.map(s => `<span class="hung-overlay-tag">⬛ ${s}</span>`).join('')}
                        ${a.hungLuu.map(s => `<span class="hung-overlay-tag">🔸 ${s}</span>`).join('')}
                        ${a.hasHoaKy ? '<span class="hung-overlay-tag" style="color:#ef5350">Hóa Kỵ gốc</span>' : ''}
                        ${a.hasLuuHoaKy ? '<span class="hung-overlay-tag" style="color:#ef5350">Lưu Hóa Kỵ</span>' : ''}
                        <span class="hung-overlay-tag">x${a.multiplier}</span>
                    </div>
                </div>`;
            });
        }

        // =====================
        // P4: THÁI TUẾ TƯƠNG TÁC
        // =====================
        if (ln.thaiTue) {
            const tt = ln.thaiTue;
            out += `<div class="luu-nien-section-title">👑 Lưu Thái Tuế</div>
            <div class="thai-tue-box">
                <div class="thai-tue-position">📍 ${tt.taiTueCung} (${tt.taiTueChiName})</div>
                ${tt.cungGiai ? `<div class="thai-tue-detail">${tt.cungGiai}</div>` : ''}
                ${tt.chinhTinhTaiTue && tt.chinhTinhTaiTue.length > 0 ? `<div class="thai-tue-detail" style="margin-top:0.3rem"><strong>Chính tinh:</strong> ${tt.chinhTinhTaiTue.join(', ')}</div>` : ''}
            </div>`;
            if (tt.interactions && tt.interactions.length > 0) {
                tt.interactions.forEach(it => {
                    out += `<div class="thai-tue-interaction">${it.description}</div>`;
                });
            }
            if (tt.daiVanConflict) {
                out += `<div class="thai-tue-interaction" style="color:#ff9800">${tt.daiVanConflict.description}</div>`;
            }
            if (tt.tieuVanConflict) {
                out += `<div class="thai-tue-interaction" style="color:#ff9800">${tt.tieuVanConflict.description}</div>`;
            }
        }

        // =====================
        // P5: NGUYỆT HẠN 12 THÁNG
        // =====================
        if (ln.nguyetHan && ln.nguyetHan.length > 0) {
            out += `<div class="luu-nien-section-title">📅 Nguyệt Hạn 12 Tháng</div>
            <div class="nguyet-han-chart">`;
            ln.nguyetHan.forEach(m => {
                const flag = m.hasHoaLoc ? '💰' : (m.hasHoaKy ? '⚠' : '');
                const monthStr = 'T' + (m.thang < 10 ? '0' : '') + m.thang;
                out += `<div class="nguyet-han-row">
                    <span class="nguyet-han-month">${monthStr}</span>
                    <div class="nguyet-han-bar-bg">
                        <div class="nguyet-han-bar-fill level-${m.level}" style="width:${m.energy}%"></div>
                    </div>
                    <span class="nguyet-han-score">${m.energy}</span>
                    <span class="nguyet-han-cung">${m.cungName}</span>
                    <span class="nguyet-han-flag">${flag}</span>
                </div>`;
            });
            out += `</div>`;
        }

        return out;
    }

    function renderInterpretation(interpretation) {
        let html = '';

        const ov = interpretation.overview;

        // Overview card
        html += `<div class="interp-card" style="--index: 0">
            <div class="interp-header">
                <span class="interp-icon">🌟</span>
                <span class="interp-title">Tổng Quan Lá Số</span>
                <span class="interp-toggle open">▼</span>
            </div>
            <div class="interp-body open">
                <p><strong>Âm Dương:</strong> ${ov.amDuong} (${ov.thuan ? 'Thuận hành' : 'Nghịch hành'})</p>
                <p><strong>Mệnh:</strong> ${ov.menhNapAm} (Hành ${ov.hanhMenh})</p>
                <p><strong>Cục:</strong> ${ov.cucName} (Hành ${ov.hanhCuc})</p>
                <p><strong>Chủ Mệnh:</strong> ${ov.chuMenh} | <strong>Chủ Thân:</strong> ${ov.chuThan}</p>
                <div class="interp-summary">
                    Mệnh ${ov.hanhMenh} - Cục ${ov.hanhCuc}: ${getHanhRelation(ov.hanhCuc, ov.hanhMenh)}
                </div>
            </div>
        </div>`;

        // AI Analysis placeholder
        html += `<div class="interp-card" id="aiAnalysisCard" style="--index: 1">
            <div class="interp-header">
                <span class="interp-icon">🔮</span>
                <span class="interp-title">Phân Tích Chuyên Sâu</span>
                <span class="interp-toggle open">▼</span>
            </div>
            <div class="interp-body open" id="aiAnalysisBody">
                <div class="ai-loading">
                    <div class="ai-spinner"></div>
                    <p>Đang phân tích lá số...</p>
                </div>
            </div>
        </div>`;

        // Special cards
        interpretation.specials.forEach((s, idx) => {
            html += `<div class="interp-card ${s.isHour ? 'is-hour-card' : ''}" style="--index: ${idx + 2}">
                <div class="interp-header">
                    <span class="interp-icon">${s.icon}</span>
                    <div class="interp-title-group">
                        <span class="interp-title">${s.title}</span>
                        <span class="badge-hour ${s.isHour ? 'important' : 'lite'}">${s.dep}</span>
                    </div>
                    <span class="interp-toggle">▼</span>
                </div>
                <div class="interp-body">
                    <p>${s.content.replace(/\n/g, '<br>')}</p>
                </div>
            </div>`;
        });

        // === Group patterns by cungName cho palace cards ===
        const patternsByPalace = {};
        if (interpretation.vanHan && interpretation.vanHan.patterns) {
            interpretation.vanHan.patterns.forEach(pat => {
                const key = pat.cungName;
                if (!patternsByPalace[key]) patternsByPalace[key] = [];
                patternsByPalace[key].push(pat);
            });
        }

        // Palace cards
        interpretation.palaces.forEach((p, idx) => {
            const index = idx + interpretation.specials.length + 2;
            const ratingColor = p.rating >= 4 ? 'interp-good' : (p.rating <= 2 ? 'interp-bad' : '');
            const ratingText = '⭐'.repeat(Math.max(1, Math.min(5, p.rating)));

            html += `<div class="interp-card ${p.isHourDependent ? 'is-hour-card' : ''}" style="--index: ${index}">
                <div class="interp-header">
                    <span class="interp-icon">${p.icon}</span>
                    <div class="interp-title-group">
                        <span class="interp-title">${p.cungName} (${p.chiName}) <span class="${ratingColor}">${ratingText}</span></span>
                        <span class="badge-hour ${p.isHourDependent ? 'important' : 'lite'}">${p.isHourDependent ? '⏰ Giờ sinh' : '📅 Năm/Tháng'}</span>
                    </div>
                    <span class="interp-toggle">▼</span>
                </div>
                <div class="interp-body">
                    <p>${p.desc}</p>`;

            // Vô Chính Diệu warning
            if (p.voChinhDieu) {
                html += `<div class="interp-warning" style="background:rgba(255,193,7,0.1);border-left:3px solid #ffc107;padding:8px 12px;margin:8px 0;border-radius:4px;">
                    <strong>⚠️ Vô Chính Diệu</strong><br>
                    <small>${p.voChinhDieu.text}</small>
                </div>`;
            }

            // Chính tinh (với miếu hãm)
            if (p.chinhTinh.length > 0) {
                html += `<h4 style="margin-top:10px; color: var(--accent-gold);">Chính Tinh:</h4>
                    <ul class="interp-star-list">`;
                p.chinhTinh.forEach(s => {
                    const statusBadge = s.statusText ? `<span class="star-status-badge ${s.status === 'ham' ? 'status-ham' : (s.status === 'mieu' || s.status === 'vuong' ? 'status-mieu' : 'status-dac')}">${s.statusText}</span>` : '';
                    html += `<li>
                        <span class="interp-star-name">${s.icon} ${s.name}</span>
                        ${statusBadge}
                        ${s.hoa ? `<span class="hoa-marker ${s.hoa === 'Kỵ' ? 'hoa-ky' : 'hoa-loc'}"> (Hoá ${s.hoa})</span>` : ''}
                        ${s.luuHoa ? `<span class="hoa-marker ${s.luuHoa === 'Kỵ' ? 'hoa-ky' : 'hoa-loc'}"> (Lưu Hoá ${s.luuHoa})</span>` : ''}
                        - ${s.short || ''}
                        ${s.nhaiNguyetInfo ? `<br><small style="color:${s.nhaiNguyetInfo.trangThai === 'sáng' ? '#4caf50' : '#ff5722'}">☀ ${s.nhaiNguyetInfo.text}</small>` : ''}
                        <br><small>${s.detail || ''}</small>
                    </li>`;
                });
                html += `</ul>`;
            }

            // Phụ tinh
            if (p.phuTinh.length > 0) {
                html += `<h4 style="margin-top:10px; color: var(--text-secondary);">Phụ Tinh Quan Trọng:</h4>
                    <ul class="interp-star-list">`;
                p.phuTinh.forEach(s => {
                    html += `<li>
                        <span class="interp-star-name">${s.icon} ${s.name}</span>
                        ${s.hoa ? `<span class="hoa-marker ${s.hoa === 'Kỵ' ? 'hoa-ky' : 'hoa-loc'}"> (Hoá ${s.hoa})</span>` : ''}
                        ${s.luuHoa ? `<span class="hoa-marker ${s.luuHoa === 'Kỵ' ? 'hoa-ky' : 'hoa-loc'}"> (Lưu Hoá ${s.luuHoa})</span>` : ''}
                        - ${s.short || ''}
                        ${s.good ? `<br><small class="interp-good">✅ ${s.good}</small>` : ''}
                        ${s.bad ? `<br><small class="interp-bad">❌ ${s.bad}</small>` : ''}
                    </li>`;
                });
                html += `</ul>`;
            }

            // Cặp sao kết hợp
            if (p.combos && p.combos.length > 0) {
                html += `<h4 style="margin-top:10px; color: var(--accent-secondary, #e040fb);">🔗 Cặp Sao Kết Hợp:</h4>
                    <div class="combo-list">`;
                p.combos.forEach(combo => {
                    const comboClass = combo.nature === 'cat' ? 'combo-cat' : (combo.nature === 'hung' ? 'combo-hung' : 'combo-mixed');
                    html += `<div class="combo-item ${comboClass}">
                        <strong>${combo.name}</strong> (${combo.stars.join(' + ')})
                        ${combo.status ? `<span class="combo-status">${combo.isMieu ? '⬆ Miếu' : (combo.isHam ? '⬇ Hãm' : '➡ Bình')}</span>` : ''}
                        <br><small>${combo.detail}</small>
                    </div>`;
                });
                html += `</div>`;
            }

            // Tràng Sinh
            if (p.truongSinh && p.truongSinh.text) {
                const tsColor = p.truongSinh.rating >= 2 ? '#4caf50' : (p.truongSinh.rating <= -2 ? '#ff5722' : '#ff9800');
                html += `<div style="margin-top:8px;padding:6px 10px;border-radius:4px;background:rgba(255,255,255,0.05);font-size:0.85rem;">
                    <span style="color:${tsColor}">🌱 ${p.truongSinh.name}</span>: ${p.truongSinh.text}
                </div>`;
            }

            // Tuần/Triệt
            if (p.tuanTriet) {
                html += `<div style="margin-top:6px;padding:6px 10px;border-radius:4px;background:rgba(255,0,0,0.08);font-size:0.85rem;color:#ff9800;">
                    ${p.tuanTriet.tuan ? '🌑 Tuần Trung Không' : '⛔ Triệt Lộ'}: ${p.tuanTriet.text}
                </div>`;
            }

            // === BỘ SAO ĐẶC BIỆT TRONG CUNG NÀY ===
            const palacePatterns = patternsByPalace[p.cungName] || [];
            if (palacePatterns.length > 0) {
                html += `<div class="palace-patterns-section">
                    <h4 style="margin-top:12px; color: var(--accent-gold);">⚡ Bộ Sao Đặc Biệt:</h4>`;
                palacePatterns.forEach(pat => {
                    const typeClass = pat.patternType === 'hung' ? 'pattern-hung' :
                        pat.patternType === 'cat' ? 'pattern-cat' : 'pattern-spiritual';
                    const typeIcon = pat.patternType === 'hung' ? '🔴' :
                        pat.patternType === 'cat' ? '🟢' : '🟣';
                    html += `<div class="pattern-alert-inline ${typeClass}">
                        <div class="pattern-alert-header">
                            <span class="pattern-icon">${typeIcon}</span>
                            <span class="pattern-name">${pat.patternName}</span>
                            <span class="pattern-intensity">${'●'.repeat(Math.min(pat.intensity, 10))}</span>
                        </div>
                        <div class="pattern-alert-body">
                            <div class="pattern-stars">${pat.matchedStars.join(', ')}</div>
                            <div class="pattern-effect">${pat.effect}</div>
                            ${pat.advice ? `<div class="pattern-advice">💡 ${pat.advice}</div>` : ''}
                        </div>
                    </div>`;
                });
                html += `</div>`;
            }

            html += `<div class="interp-summary">${p.overall}</div>`;
            html += `</div></div>`;
        });

        // Vận Hạn card (cuối cùng, sau tất cả palace cards)
        if (interpretation.vanHan) {
            const vh = interpretation.vanHan;
            const ln = vh.luuNienAnalysis;
            const vhIdx = interpretation.palaces.length + interpretation.specials.length + 2;
            const vhRatingStars = vh.rating >= 5 ? '🌟🌟🌟🌟🌟' : vh.rating >= 4 ? '🌟🌟🌟🌟' : vh.rating >= 3 ? '🌟🌟🌟' : vh.rating >= 2 ? '🌟🌟' : '🌟';
            const vhRatingColor = vh.rating >= 4 ? 'interp-good' : (vh.rating <= 2 ? 'interp-bad' : '');
            const summaryIcon = vh.eventSummary ? vh.eventSummary.ratingIcon : '📅';

            html += `<div class="interp-card" style="--index: ${vhIdx}">
                <div class="interp-header">
                    <span class="interp-icon">${summaryIcon}</span>
                    <div class="interp-title-group">
                        <span class="interp-title">Vận Hạn Năm ${interpretation.overview?.namXem || ''} <span class="${vhRatingColor}">${vhRatingStars}</span></span>
                        <span class="badge-hour important">Đại Vận + Tiểu Vận + Lưu Niên</span>
                    </div>
                    <span class="interp-toggle open">▼</span>
                </div>
                <div class="interp-body open">
                    <div class="van-han-summary">
                        <div class="van-han-box">
                            <div class="van-han-box-title">Đại Vận (10 năm)</div>
                            <div class="van-han-box-value">Cung ${vh.daiVan.cungName} (${vh.daiVan.chiName})</div>
                            <div class="van-han-box-detail">Tuổi ${vh.daiVan.tuoiFrom}—${vh.daiVan.tuoiTo} | Năm ${vh.daiVan.namFrom}—${vh.daiVan.namTo}</div>
                            ${vh.daiVan.chinhTinh.length > 0 ? `<div class="van-han-box-detail" style="margin-top:4px">Chính tinh: <strong>${vh.daiVan.chinhTinh.map(s => s.name + (s.hoa ? '(' + s.hoa + ')' : '')).join(', ')}</strong></div>` : ''}
                            ${vh.daiVan.cungInfo ? `<div class="van-han-box-detail" style="margin-top:6px;font-style:italic;color:var(--text-secondary)">${vh.daiVan.cungInfo.text}</div>` : ''}
                        </div>
                        ${vh.tieuVan ? `<div class="van-han-box">
                            <div class="van-han-box-title">Tiểu Vận (1 năm)</div>
                            <div class="van-han-box-value">Cung ${vh.tieuVan.cungName} (${vh.tieuVan.chiName})</div>
                            <div class="van-han-box-detail">${vh.tieuVan.tuoi} tuổi</div>
                            ${vh.tieuVan.chinhTinh.length > 0 ? `<div class="van-han-box-detail" style="margin-top:4px">Chính tinh: <strong>${vh.tieuVan.chinhTinh.join(', ')}</strong></div>` : ''}
                        </div>` : ''}
                    </div>

                    ${renderLuuNienAnalysis(vh, ln)}

                    ${vh.eventSummary ? `<div class="event-summary-bar">
                        <span class="event-summary-badge">📊 ${vh.eventSummary.totalEvents} sự kiện phát hiện</span>
                        ${vh.eventSummary.criticalCount > 0 ? `<span class="event-badge event-critical">⚠️ ${vh.eventSummary.criticalCount} cần lưu ý</span>` : ''}
                        ${vh.eventSummary.positiveCount > 0 ? `<span class="event-badge event-positive">✅ ${vh.eventSummary.positiveCount} thuận lợi</span>` : ''}
                    </div>` : ''}
                    <div class="interp-summary">${vh.overall}</div>
                </div>
            </div>`;

            // === RENDER EVENT CARDS ===
            if (vh.events && vh.events.length > 0) {
                html += renderEventCards(vh.events, vhIdx + 1, interpretation.overview?.namXem);
            }

            // Patterns đã được render inline trong palace cards ở trên, không render riêng nữa
        }

        // Đại Vận Timeline (cuối cùng)
        if (interpretation._lasoData) {
            html += TuViRender.renderDaiVanTimeline(interpretation._lasoData);
        }

        return html;
    }

    // =====================
    // RENDER EVENT SCANNER RESULTS
    // =====================

    /**
     * Render các event cards từ scanner
     */
    function renderEventCards(events, startIdx, namXem) {
        let html = `<div class="event-scanner-section">
            <h3 class="event-scanner-title">🔍 Sự Kiện Phát Hiện — Năm ${namXem || ''}</h3>`;

        events.forEach((evt, idx) => {
            const sevInfo = evt.severityInfo || {};
            const cssClass = sevInfo.cssClass || 'event-info';
            const sevColor = sevInfo.color || '#4169E1';
            const catInfo = evt.categoryInfo || {};

            html += `<div class="event-card ${cssClass} ${evt.isPositive ? 'event-positive-card' : ''}" style="--index: ${startIdx + idx}; --event-color: ${sevColor}">
                <div class="event-card-header" onclick="this.parentElement.classList.toggle('event-collapsed')">
                    <div class="event-card-left">
                        <span class="event-cat-icon">${catInfo.icon || '📌'}</span>
                        <div class="event-card-info">
                            <span class="event-card-name">${evt.name}</span>
                            <span class="event-card-category">${catInfo.name || ''}</span>
                        </div>
                    </div>
                    <div class="event-card-right">
                        <span class="event-severity-badge" style="background:${sevColor}">${sevInfo.prefix || '📌'} ${sevInfo.label || ''}</span>
                        <span class="event-score">Score: ${evt.score}</span>
                        <span class="event-toggle">▼</span>
                    </div>
                </div>
                <div class="event-card-body">
                    <div class="event-stars">
                        <span class="event-stars-label">Sao liên quan:</span>
                        ${evt.matchedStars.map(s => `<span class="event-star-tag">${s}</span>`).join('')}
                    </div>
                    <div class="event-focus">
                        <span class="event-focus-label">Cung ảnh hưởng:</span>
                        ${evt.focusHouses.map(h => `<span class="event-house-tag">${h}</span>`).join('')}
                    </div>
                    ${evt.details && evt.details.length > 0 ? `<div class="event-details">
                        ${evt.details.map(d => `<span class="event-detail-tag">${d}</span>`).join('')}
                    </div>` : ''}
                    <div class="event-description">${evt.longText || evt.shortText || ''}</div>
                    ${evt.advice ? `<div class="event-advice">
                        <span class="event-advice-icon">💡</span>
                        <span>${evt.advice}</span>
                    </div>` : ''}
                </div>
            </div>`;
        });

        html += '</div>';
        return html;
    }

    /**
     * Render pattern alerts (Bộ sao đặc biệt)
     */
    function renderPatternAlerts(patterns, startIdx) {
        if (!patterns || patterns.length === 0) return '';

        let html = `<div class="pattern-alerts-section">
            <h3 class="pattern-alerts-title">⚡ Bộ Sao Đặc Biệt Phát Hiện</h3>`;

        patterns.forEach((pat, idx) => {
            const typeClass = pat.patternType === 'hung' ? 'pattern-hung' :
                pat.patternType === 'cat' ? 'pattern-cat' : 'pattern-spiritual';
            const typeIcon = pat.patternType === 'hung' ? '🔴' :
                pat.patternType === 'cat' ? '🟢' : '🟣';

            html += `<div class="pattern-alert ${typeClass}" style="--index: ${startIdx + idx}">
                <div class="pattern-alert-header">
                    <span class="pattern-icon">${typeIcon}</span>
                    <span class="pattern-name">${pat.patternName}</span>
                    <span class="pattern-cung">@ ${pat.cungName}</span>
                    <span class="pattern-intensity">${'●'.repeat(Math.min(pat.intensity, 10))}</span>
                </div>
                <div class="pattern-alert-body">
                    <div class="pattern-stars">${pat.matchedStars.join(', ')}</div>
                    <div class="pattern-effect">${pat.effect}</div>
                    ${pat.advice ? `<div class="pattern-advice">💡 ${pat.advice}</div>` : ''}
                </div>
            </div>`;
        });

        html += '</div>';
        return html;
    }

    /**
     * Render AI analysis sections
     */
    function renderAiAnalysis(aiResult) {
        const container = document.getElementById('aiAnalysisBody');
        if (!container) return;

        // Nếu cần auth, hiển thị nút login
        if (aiResult.requiresAuth) {
            container.innerHTML = `<div class="ai-auth-required">
                <p class="ai-auth-message">🔐 ${aiResult.message || 'Vui lòng đăng nhập để xem phân tích AI chuyên sâu'}</p>
                <button class="btn-ai-login" id="btnAiLogin">
                    <span class="btn-icon">🔓</span>
                    <span>Đăng Nhập Để Xem Phân Tích</span>
                </button>
            </div>`;

            // Attach event listener
            const btnLogin = document.getElementById('btnAiLogin');
            if (btnLogin) {
                btnLogin.addEventListener('click', handleAiLoginClick);
            }
            return;
        }

        if (aiResult.error || aiResult.fallback) {
            // Nếu lỗi do hết hạn token hoặc server restart, hiển thị lại nút login
            if (aiResult.error && (aiResult.error.includes('Unauthorized') || aiResult.error.includes('expired token'))) {
                return renderAiAnalysis({
                    requiresAuth: true,
                    message: 'Phiên đăng nhập đã hết hạn do server vừa khởi động lại. Vui lòng đăng nhập lại.'
                });
            }

            container.innerHTML = `<div class="ai-error">
                <p>⚠️ ${aiResult.error || 'Phân tích chuyên sâu không khả dụng'}</p>
                <p><small>Bạn vẫn có thể xem diễn giải chi tiết từng cung bên dưới.</small></p>
                <button class="btn-ai-retry" id="btnAiRetry">
                    <span class="btn-icon">🔄</span>
                    <span>Tải lại phân tích AI</span>
                </button>
            </div>`;

            // Attach retry handler
            const btnRetry = document.getElementById('btnAiRetry');
            if (btnRetry) {
                btnRetry.addEventListener('click', async function () {
                    // Show loading
                    container.innerHTML = `<div class="ai-loading">
                        <div class="ai-spinner"></div>
                        <p>Đang tải lại phân tích...</p>
                    </div>`;

                    try {
                        const payload = window._currentInterpretation;
                        if (!payload) {
                            renderAiAnalysis({ error: 'Không có dữ liệu để tải lại. Vui lòng lập lá số mới.', fallback: true });
                            return;
                        }
                        const result = await getAiInterpretation(payload);
                        renderAiAnalysis(result);
                    } catch (retryErr) {
                        console.error('[AI Retry] Error:', retryErr);
                        renderAiAnalysis({ error: 'Tải lại thất bại: ' + retryErr.message, fallback: true });
                    }
                });
            }
            return;
        }

        // Icon mapping cho từng cung
        const PALACE_ICONS = {
            'MỆNH': '🏛️', 'PHỤ MẪU': '👨‍👩‍👧', 'PHÚC ĐỨC': '🙏', 'ĐIỀN TRẠCH': '🏠',
            'QUAN LỘC': '💼', 'NÔ BỘC': '🤝', 'THIÊN DI': '✈️', 'TẬT ÁCH': '🏥',
            'TÀI BẠCH': '💰', 'TỬ TỨC': '👶', 'PHU THÊ': '💕', 'HUYNH ĐỆ': '👫'
        };

        let html = '';

        // 1. Render overview sections (Tổng quan, Vận Hạn, Lời Khuyên)
        if (aiResult.sections && aiResult.sections.length > 0) {
            aiResult.sections.forEach(section => {
                const isBirthHour = section.title.includes('Giờ Sinh');
                html += `<div class="ai-section ${isBirthHour ? 'ai-section-highlight' : ''}">
                    <h4 class="ai-section-title">${section.icon} ${section.title}</h4>
                    <p>${section.content}</p>
                    ${isBirthHour ? `<small class="ai-note">⚠️ Phần này phụ thuộc hoàn toàn vào chính xác của giờ sinh.</small>` : ''}
                </div>`;
            });
        }

        // 2. Render per-palace sections (12 cung) trong cùng 1 card
        if (aiResult.palaceSections && Object.keys(aiResult.palaceSections).length > 0) {
            html += `<div class="ai-palaces-divider">
                <h4 class="ai-section-title">🏛️ Luận Giải Chi Tiết Từng Cung</h4>
            </div>`;

            const palaceOrder = ['MỆNH', 'PHỤ MẪU', 'PHÚC ĐỨC', 'ĐIỀN TRẠCH', 'QUAN LỘC', 'NÔ BỘC',
                'THIÊN DI', 'TẬT ÁCH', 'TÀI BẠCH', 'TỬ TỨC', 'PHU THÊ', 'HUYNH ĐỆ'];

            // Render theo thứ tự chuẩn, fallback cho keys không match
            const renderedKeys = new Set();
            palaceOrder.forEach(pName => {
                if (aiResult.palaceSections[pName]) {
                    const icon = PALACE_ICONS[pName] || '📌';
                    html += `<div class="ai-palace-block">
                        <div class="ai-palace-header" onclick="this.nextElementSibling.classList.toggle('ai-palace-collapsed')">
                            <span class="ai-palace-icon">${icon}</span>
                            <span class="ai-palace-name">Cung ${pName}</span>
                            <span class="ai-palace-toggle">▼</span>
                        </div>
                        <div class="ai-palace-body">
                            <p>${aiResult.palaceSections[pName]}</p>
                        </div>
                    </div>`;
                    renderedKeys.add(pName);
                }
            });

            // Render các keys còn lại (nếu AI trả về tên cung khác)
            Object.keys(aiResult.palaceSections).forEach(key => {
                if (!renderedKeys.has(key)) {
                    html += `<div class="ai-palace-block">
                        <div class="ai-palace-header" onclick="this.nextElementSibling.classList.toggle('ai-palace-collapsed')">
                            <span class="ai-palace-icon">📌</span>
                            <span class="ai-palace-name">Cung ${key}</span>
                            <span class="ai-palace-toggle">▼</span>
                        </div>
                        <div class="ai-palace-body">
                            <p>${aiResult.palaceSections[key]}</p>
                        </div>
                    </div>`;
                }
            });
        }

        if (!html && aiResult.raw) {
            html = `<p>${aiResult.raw.replace(/\n/g, '<br>')}</p>`;
        }

        container.innerHTML = html;
    }

    /**
     * Handle AI login button click
     */
    function handleAiLoginClick() {
        // Lấy interpretation data từ global hoặc re-generate
        const container = document.getElementById('aiAnalysisBody');

        // Show loading
        container.innerHTML = `<div class="ai-loading">
            <div class="ai-spinner"></div>
            <p>Đang xác thực...</p>
        </div>`;

        // Show login modal
        AUTH.showLoginModal(
            // onSuccess callback
            async () => {
                // Sau khi login thành công, reload AI analysis
                container.innerHTML = `<div class="ai-loading">
                    <div class="ai-spinner"></div>
                    <p>Đang phân tích lá số...</p>
                </div>`;

                // Re-trigger AI analysis
                if (window._currentInterpretation) {
                    const aiResult = await callAiApi(window._currentInterpretation);
                    renderAiAnalysis(aiResult);
                } else {
                    container.innerHTML = `<div class="ai-error">
                        <p>⚠️ Vui lòng lập lại lá số để xem phân tích AI</p>
                    </div>`;
                }
            },
            // onCancel callback
            () => {
                // Restore lại nút login khi user hủy
                renderAiAnalysis({
                    requiresAuth: true,
                    message: 'Vui lòng đăng nhập để xem phân tích AI chuyên sâu'
                });
            }
        );
    }

    return {
        loadInterpretationData,
        interpret,
        renderInterpretation,
        getAiInterpretation,
        renderAiAnalysis,
        analyzeVanHan
    };
})();

// Event delegation for toggle - không dùng inline onclick (CSP safe)
document.addEventListener('click', function (e) {
    const header = e.target.closest('.interp-header');
    if (!header) return;
    const body = header.nextElementSibling;
    const toggle = header.querySelector('.interp-toggle');
    if (body) body.classList.toggle('open');
    if (toggle) toggle.classList.toggle('open');
});
