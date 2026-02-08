/**
 * ============================================
 * APP.JS - Điều phối chính
 * Kết nối form → API → render → AI
 * ============================================
 */

(function () {
    'use strict';

    const form = document.getElementById('tuViForm');
    const inputSection = document.getElementById('inputSection');
    const chartSection = document.getElementById('chartSection');
    const chartWrapper = document.getElementById('chartWrapper');
    const interpretationSection = document.getElementById('interpretationSection');
    const interpretationContent = document.getElementById('interpretationContent');
    const btnBack = document.getElementById('btnBack');
    const btnPrint = document.getElementById('btnPrint');
    const btnSubmit = document.getElementById('btnSubmit');

    // =====================
    // EVENT HANDLERS
    // =====================

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        generateChart();
    });

    btnBack.addEventListener('click', function () {
        chartSection.style.display = 'none';
        interpretationSection.style.display = 'none';
        inputSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnPrint.addEventListener('click', function () {
        window.print();
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

            // 2. Calculate
            const params = { ngay, thang, nam, gioSinh, gioiTinh, namXem };
            const lasoData = TuViCalc.calculate(params);

            // 3. An sao
            TuViSao.anSao(lasoData);

            // 4. Render chart
            const chartHtml = TuViRender.render(lasoData, hoTen);
            chartWrapper.innerHTML = chartHtml;

            // 5. Generate interpretation (từ API data)
            const interpretation = TuViInterpret.interpret(lasoData);
            const interpHtml = TuViInterpret.renderInterpretation(interpretation);
            interpretationContent.innerHTML = interpHtml;

            // 6. Show sections
            inputSection.style.display = 'none';
            chartSection.style.display = 'block';
            interpretationSection.style.display = 'block';

            // Scroll + animation
            window.scrollTo({ top: 0, behavior: 'smooth' });
            chartWrapper.style.opacity = '0';
            chartWrapper.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
                chartWrapper.style.transition = 'opacity 0.6s, transform 0.6s';
                chartWrapper.style.opacity = '1';
                chartWrapper.style.transform = 'translateY(0)';
            });

            // 7. Async: Gọi AI interpretation (không block UI)
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
