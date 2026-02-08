/**
 * ============================================
 * TỬ VI INTERPRET - Frontend Interpretation
 * Gọi API Backend để lấy dữ liệu diễn giải
 * + Gọi Gemini AI qua Backend
 * ============================================
 */

const TuViInterpret = (function () {
    'use strict';

    // Cache data từ API
    let _saoData = null;
    let _cungData = null;
    let _specialData = null;
    let _dataLoaded = false;

    // =====================
    // LOAD DATA TỪ API
    // =====================

    /**
     * Load tất cả data diễn giải từ backend
     */
    async function loadInterpretationData() {
        if (_dataLoaded) return;

        try {
            const resp = await fetch('/api/interpretations/all');
            if (!resp.ok) throw new Error('API error: ' + resp.status);

            const data = await resp.json();
            _saoData = data.sao || {};
            _cungData = data.cung || {};
            _specialData = data.special || {};
            _dataLoaded = true;
            console.log('[Interpret] Data loaded from API');
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
            overall: '',
            rating: 0
        };

        // Analyze chính tinh
        chinhTinh.forEach(s => {
            const info = _saoData[s.name] || {};
            analysis.chinhTinh.push({
                name: s.name,
                hoa: s.hoa || null,
                icon: info.icon || '⭐',
                short: info.short || '',
                detail: info.detail || '',
                good: info.good || '',
                bad: info.bad || ''
            });
        });

        // Analyze phụ tinh quan trọng
        const importantPhuTinh = ['Tả Phụ', 'Hữu Bật', 'Văn Xương', 'Văn Khúc',
            'Thiên Khôi', 'Thiên Việt', 'Lộc Tồn', 'Kình Dương', 'Đà La',
            'Hoả Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Thiên Mã',
            'Đào Hoa', 'Hồng Loan', 'Thiên Hỷ'];
        phuTinh.forEach(s => {
            if (importantPhuTinh.includes(s.name) || s.hoa) {
                const info = _saoData[s.name] || {};
                analysis.phuTinh.push({
                    name: s.name,
                    hoa: s.hoa || null,
                    nature: s.nature,
                    icon: info.icon || (s.nature === 'cat' ? '✅' : s.nature === 'hung' ? '❌' : '➖'),
                    short: info.short || '',
                    good: info.good || '',
                    bad: info.bad || ''
                });
            }
        });

        // Calculate rating
        let rating = 0;
        catTinh.forEach(s => {
            rating += (s.type === 'chinh' ? 2 : 1);
            if (s.hoa === 'Lộc' || s.hoa === 'Quyền' || s.hoa === 'Khoa') rating += 1;
        });
        hungTinh.forEach(s => {
            rating -= (s.type === 'chinh' ? 2 : 1);
            if (s.hoa === 'Kỵ') rating -= 1;
        });
        analysis.rating = Math.max(-5, Math.min(5, rating));

        // Overall assessment
        if (analysis.rating >= 3) {
            analysis.overall = 'Cung này rất tốt đẹp, nhiều cát tinh hội tụ, hứa hẹn thuận lợi và may mắn.';
        } else if (analysis.rating >= 1) {
            analysis.overall = 'Cung này khá tốt, có nhiều yếu tố thuận lợi nhưng cần nỗ lực bản thân.';
        } else if (analysis.rating >= -1) {
            analysis.overall = 'Cung này bình thường, cát hung lẫn lộn, cần cẩn trọng trong các quyết định.';
        } else if (analysis.rating >= -3) {
            analysis.overall = 'Cung này có nhiều hung tinh, cần đề phòng và chú ý hóa giải.';
        } else {
            analysis.overall = 'Cung này hung nhiều, cần đặc biệt cẩn trọng, nên tu tâm dưỡng đức để hóa giải.';
        }

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

        return specials;
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
        // Check auth - nếu chưa login, return placeholder
        if (!AUTH.isAuthenticated()) {
            return {
                requiresAuth: true,
                message: 'Vui lòng đăng nhập để xem phân tích AI chuyên sâu'
            };
        }

        // Đã login, gọi AI API
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

        // Palace cards
        interpretation.palaces.forEach((p, idx) => {
            const index = idx + interpretation.specials.length + 2;
            const ratingColor = p.rating >= 2 ? 'interp-good' : (p.rating <= -2 ? 'interp-bad' : '');
            const ratingText = p.rating >= 3 ? '⭐⭐⭐⭐⭐' :
                p.rating >= 2 ? '⭐⭐⭐⭐' :
                    p.rating >= 1 ? '⭐⭐⭐' :
                        p.rating >= 0 ? '⭐⭐' : '⭐';

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

            if (p.chinhTinh.length > 0) {
                html += `<h4 style="margin-top:10px; color: var(--accent-gold);">Chính Tinh:</h4>
                    <ul class="interp-star-list">`;
                p.chinhTinh.forEach(s => {
                    html += `<li>
                        <span class="interp-star-name">${s.icon} ${s.name}</span>
                        ${s.hoa ? `<span class="hoa-marker ${s.hoa === 'Kỵ' ? 'hoa-ky' : 'hoa-loc'}"> (Hoá ${s.hoa})</span>` : ''}
                        - ${s.short || ''}
                        <br><small>${s.detail || ''}</small>
                    </li>`;
                });
                html += `</ul>`;
            }

            if (p.phuTinh.length > 0) {
                html += `<h4 style="margin-top:10px; color: var(--text-secondary);">Phụ Tinh Quan Trọng:</h4>
                    <ul class="interp-star-list">`;
                p.phuTinh.forEach(s => {
                    html += `<li>
                        <span class="interp-star-name">${s.icon} ${s.name}</span>
                        ${s.hoa ? `<span class="hoa-marker ${s.hoa === 'Kỵ' ? 'hoa-ky' : 'hoa-loc'}"> (Hoá ${s.hoa})</span>` : ''}
                        - ${s.short || ''}
                        ${s.good ? `<br><small class="interp-good">✅ ${s.good}</small>` : ''}
                        ${s.bad ? `<br><small class="interp-bad">❌ ${s.bad}</small>` : ''}
                    </li>`;
                });
                html += `</ul>`;
            }

            html += `<div class="interp-summary">${p.overall}</div>`;
            html += `</div></div>`;
        });

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
            </div>`;
            return;
        }

        let html = '';
        if (aiResult.sections && aiResult.sections.length > 0) {
            aiResult.sections.forEach(section => {
                const isBirthHour = section.title.includes('Giờ Sinh');
                html += `<div class="ai-section ${isBirthHour ? 'ai-section-highlight' : ''}">
                    <h4 class="ai-section-title">${section.icon} ${section.title}</h4>
                    <p>${section.content}</p>
                    ${isBirthHour ? `<small class="ai-note">⚠️ Phần này phụ thuộc hoàn toàn vào chính xác của giờ sinh.</small>` : ''}
                </div>`;
            });
        } else if (aiResult.raw) {
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
        renderAiAnalysis
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
