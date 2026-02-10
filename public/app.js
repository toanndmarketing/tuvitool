/**
 * ============================================
 * APP.JS - Điều phối chính
 * Kết nối form → API → render → AI
 * Hỗ trợ 2 tab: Tử Vi + Thần Số Học
 * ============================================
 */

(function () {
    'use strict';

    const form = document.getElementById('tuViForm');
    const inputSection = document.getElementById('inputSection');
    const resultsSection = document.getElementById('resultsSection');
    const chartWrapper = document.getElementById('chartWrapper');
    const interpretationContent = document.getElementById('interpretationContent');
    const tshContainer = document.getElementById('tshContainer');
    const btnBack = document.getElementById('btnBack');
    const btnPrint = document.getElementById('btnPrint');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnRawdata = document.getElementById('btnRawdata');
    const rawdataModal = document.getElementById('rawdataModal');
    const rawdataTextarea = document.getElementById('rawdataTextarea');
    const rawdataCopyBtn = document.getElementById('rawdataCopyBtn');
    const rawdataCloseBtn = document.getElementById('rawdataCloseBtn');

    // Tab elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // =====================
    // TAB SWITCHING
    // =====================
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetTab = this.dataset.tab;

            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update active content
            tabContents.forEach(tc => tc.classList.remove('active'));
            const targetContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
                // Smooth scroll to top of results
                targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =====================
    // EVENT HANDLERS
    // =====================

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        generateChart();
    });

    btnBack.addEventListener('click', function () {
        resultsSection.style.display = 'none';
        inputSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnPrint.addEventListener('click', function () {
        window.print();
    });

    // Rawdata Modal
    btnRawdata.addEventListener('click', function () {
        if (window._currentRawdata) {
            rawdataTextarea.value = window._currentRawdata;
            rawdataModal.style.display = 'flex';
            rawdataTextarea.scrollTop = 0;
        }
    });

    rawdataCloseBtn.addEventListener('click', function () {
        rawdataModal.style.display = 'none';
    });

    rawdataModal.addEventListener('click', function (e) {
        if (e.target === rawdataModal) rawdataModal.style.display = 'none';
    });

    rawdataCopyBtn.addEventListener('click', function () {
        rawdataTextarea.select();
        navigator.clipboard.writeText(rawdataTextarea.value).then(() => {
            rawdataCopyBtn.textContent = '✅ Đã copy!';
            setTimeout(() => { rawdataCopyBtn.textContent = '📋 Copy'; }, 2000);
        }).catch(() => {
            document.execCommand('copy');
            rawdataCopyBtn.textContent = '✅ Đã copy!';
            setTimeout(() => { rawdataCopyBtn.textContent = '📋 Copy'; }, 2000);
        });
    });

    // =====================
    // MAIN GENERATE (ASYNC)
    // =====================

    async function generateChart() {
        btnSubmit.innerHTML = '<span class="btn-icon">⏳</span><span>Đang tính toán...</span>';
        btnSubmit.disabled = true;

        try {
            // 0. Load interpretation data từ API
            await TuViInterpret.loadInterpretationData();

            // 1. Collect input
            const hoTen = document.getElementById('hoTen').value || 'Không xác định';
            const gioiTinh = document.getElementById('gioiTinh').value;
            const ngaySinhStr = document.getElementById('ngaySinh').value;
            const gioSinh = parseInt(document.getElementById('gioSinh').value);
            const namXem = parseInt(document.getElementById('namXem').value);

            if (!ngaySinhStr) {
                alert('Vui lòng nhập ngày sinh!');
                resetButton();
                return;
            }

            const parts = ngaySinhStr.split('-');
            const nam = parseInt(parts[0]);
            const thang = parseInt(parts[1]);
            const ngay = parseInt(parts[2]);

            // =====================
            // TỬ VI CALCULATION
            // =====================
            const params = { ngay, thang, nam, gioSinh, gioiTinh, namXem };
            const lasoData = TuViCalc.calculate(params);

            // An sao
            TuViSao.anSao(lasoData);

            // === TÍNH NĂM TRƯỚC (namXem - 1) ĐỂ SO SÁNH ỨNG SỐ ===
            let prevYearSummary = null;
            try {
                const prevParams = { ngay, thang, nam, gioSinh, gioiTinh, namXem: namXem - 1 };
                const prevLasoData = TuViCalc.calculate(prevParams);
                TuViSao.anSao(prevLasoData);
                prevYearSummary = TuViInterpret.buildPrevYearSummary(prevLasoData);
                console.log('[PrevYear] Đã tính năm', namXem - 1);
            } catch (err) {
                console.warn('[PrevYear] Không tính được năm trước:', err.message);
            }

            // Render chart
            const chartHtml = TuViRender.render(lasoData, hoTen);
            chartWrapper.innerHTML = chartHtml;

            // Generate interpretation (từ API data)
            const interpretation = TuViInterpret.interpret(lasoData);
            interpretation.prevYear = prevYearSummary;
            const interpHtml = TuViInterpret.renderInterpretation(interpretation);
            interpretationContent.innerHTML = interpHtml;

            // Build rawdata cho nút "Xem Rawdata" - GỌN, chỉ lá số + sao + vận hạn
            try {
                const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
                const compact = {
                    // Thông tin cơ bản
                    gioiTinh: gioiTinh,
                    ngaySinh: ngaySinhStr,
                    gioSinh: gioSinh,
                    namXem: namXem,
                    amDuong: lasoData.amDuong,
                    menhNapAm: lasoData.menhNapAm,
                    hanhMenh: lasoData.hanhMenh,
                    cucName: lasoData.cucName,
                    cungMenh: lasoData.cungMap[lasoData.cungMenhPos] + ' (' + DIA_CHI[lasoData.cungMenhPos] + ')',
                    cungThan: lasoData.cungMap[lasoData.cungThanPos] + ' (' + DIA_CHI[lasoData.cungThanPos] + ')',
                    thuan: lasoData.thuan,
                    // 12 cung - chỉ tên sao + trạng thái + hoá
                    cung: {}
                };
                for (let i = 0; i < 12; i++) {
                    const pos = (lasoData.cungMenhPos + i) % 12;
                    const cungName = lasoData.cungMap[pos];
                    const saoList = lasoData.saoMap[pos] || [];
                    const chinh = saoList.filter(s => s.type === 'chinh').map(s => {
                        let label = s.name;
                        const st = typeof TuViStarPatterns !== 'undefined' ? TuViStarPatterns.getStarStatus(s.name, pos) : '';
                        if (st) label += '(' + st + ')';
                        if (s.hoa) label += '[' + s.hoa + ']';
                        if (s.luuHoa) label += '[Lưu' + s.luuHoa + ']';
                        return label;
                    });
                    const phu = saoList.filter(s => s.type !== 'chinh' && s.type !== 'luu').map(s => {
                        let label = s.name;
                        if (s.hoa) label += '[' + s.hoa + ']';
                        if (s.luuHoa) label += '[Lưu' + s.luuHoa + ']';
                        return label;
                    });
                    compact.cung[cungName + '(' + DIA_CHI[pos] + ')'] = {
                        chinh: chinh.length > 0 ? chinh.join(', ') : 'VCĐ',
                        phu: phu.join(', ')
                    };
                }
                // Đại vận + Tiểu vận
                const dv = lasoData.daiVanHienTai;
                const tv = lasoData.tieuVan;
                if (dv) {
                    const dvSao = (lasoData.saoMap[dv.cungPos] || []).filter(s => s.type === 'chinh').map(s => s.name);
                    compact.daiVan = {
                        cung: lasoData.cungMap[dv.cungPos] + '(' + DIA_CHI[dv.cungPos] + ')',
                        tuoi: dv.tuoiFrom + '-' + dv.tuoiTo,
                        saoChinhTinh: dvSao.join(', ') || 'VCĐ'
                    };
                }
                if (tv) {
                    const tvSao = (lasoData.saoMap[tv.cungPos] || []).filter(s => s.type === 'chinh').map(s => s.name);
                    compact.tieuVan = {
                        cung: lasoData.cungMap[tv.cungPos] + '(' + DIA_CHI[tv.cungPos] + ')',
                        tuoi: tv.tuoi,
                        saoChinhTinh: tvSao.join(', ') || 'VCĐ'
                    };
                }
                // Lưu Tứ Hoá
                if (lasoData.luuTuHoa && lasoData.luuTuHoa.length > 0) {
                    compact.luuTuHoa = lasoData.luuTuHoa.map(h => h.hoaName + ': ' + h.saoName + ' → ' + lasoData.cungMap[h.cungPos]);
                }
                // Tuần/Triệt
                if (lasoData.tuanTriet) {
                    compact.tuanTriet = lasoData.tuanTriet;
                }
                // Sự kiện (Vận hạn) năm hiện tại
                const eventScan = TuViEventScanner.scan(lasoData);
                if (eventScan.events && eventScan.events.length > 0) {
                    compact.suKien = eventScan.events.slice(0, 10).map(e =>
                        `${e.severityInfo?.icon || '•'} ${e.name} (${e.severity}) tại ${e.primaryCungName || 'Lưu Cung'}`
                    );
                }
                // Năm trước (nếu có)
                if (prevYearSummary) {
                    compact.namTruoc = prevYearSummary;
                }

                const prompt = `Bạn là chuyên gia Tử Vi Đẩu Số. Hãy phân tích CHI TIẾT lá số dưới đây.\n\nYêu cầu:\n- Dùng danh xưng "Đương số"\n- Mỗi cung 4-6 câu: đặc điểm + ảnh hưởng thực tế + lời khuyên\n- Phân tích tam hợp, xung chiếu, tứ hoá xuyên cung\n- Chú ý: miếu/hãm, Hoá Kỵ, Tuần/Triệt, VCĐ\n- Nếu có data năm trước, so sánh ứng số\n\nDATA:\n`;
                window._currentRawdata = prompt + JSON.stringify(compact, null, 2);
                btnRawdata.style.display = 'inline-flex';
            } catch (e) {
                console.warn('[Rawdata] Error building rawdata:', e);
            }

            // =====================
            // THẦN SỐ HỌC CALCULATION
            // =====================
            const tshResult = ThanSoHoc.calculate({
                day: ngay,
                month: thang,
                year: nam,
                fullName: hoTen,
                currentYear: namXem
            });

            // Render Thần Số Học
            const tshHtml = ThanSoHocRender.render(tshResult);
            tshContainer.innerHTML = tshHtml;

            console.log('Thần Số Học data:', tshResult);

            // =====================
            // SHOW RESULTS
            // =====================
            inputSection.style.display = 'none';
            resultsSection.style.display = 'block';

            // Ensure first tab is active
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            document.getElementById('tabTuVi').classList.add('active');
            document.getElementById('tabContentTuVi').classList.add('active');

            // Scroll + animation
            window.scrollTo({ top: 0, behavior: 'smooth' });
            chartWrapper.style.opacity = '0';
            chartWrapper.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
                chartWrapper.style.transition = 'opacity 0.6s, transform 0.6s';
                chartWrapper.style.opacity = '1';
                chartWrapper.style.transform = 'translateY(0)';
            });

            // Async: Gọi AI interpretation (không block UI)
            loadAiAnalysis(interpretation, { hoTen, ngaySinhStr, gioSinh, namXem });

            console.log('Lá số data:', lasoData);

        } catch (error) {
            console.error('Error generating chart:', error);
            alert('Lỗi khi tính lá số: ' + error.message);
        }

        resetButton();
    }

    /**
     * Load AI analysis async (không block)
     */
    async function loadAiAnalysis(interpretation, metadata) {
        try {
            const payload = {
                ...interpretation,
                name: metadata.hoTen,
                dob: metadata.ngaySinhStr,
                hour: metadata.gioSinh,
                yearView: metadata.namXem
            };

            // Lưu vào global để dùng lại sau khi login
            window._currentInterpretation = payload;

            const aiResult = await TuViInterpret.getAiInterpretation(payload);
            TuViInterpret.renderAiAnalysis(aiResult);
        } catch (err) {
            console.error('AI Error:', err);
            TuViInterpret.renderAiAnalysis({ error: 'Không thể kết nối AI', fallback: true });
        }
    }

    function resetButton() {
        btnSubmit.innerHTML = '<span class="btn-icon">✨</span><span>Lập Lá Số</span>';
        btnSubmit.disabled = false;
    }

    // Auto-fill defaults
    document.addEventListener('DOMContentLoaded', function () {
        const currentYear = new Date().getFullYear();
        document.getElementById('namXem').value = currentYear;
    });

})();
