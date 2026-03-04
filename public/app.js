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
    // DATE SYNC LOGIC
    // =====================
    const solarDaySelect = document.getElementById('solarDay');
    const solarMonthSelect = document.getElementById('solarMonth');
    const solarYearInput = document.getElementById('solarYear');
    const lDayInput = document.getElementById('lDay');
    const lMonthInput = document.getElementById('lMonth');
    const lYearInput = document.getElementById('lYear');
    const lLeapCheckbox = document.getElementById('lLeap');

    // Populate day options (1-31)
    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d < 10 ? '0' + d : d;
        solarDaySelect.appendChild(opt);
    }

    // Populate solar month options (1-12) - Only numbers
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m < 10 ? '0' + m : m;
        solarMonthSelect.appendChild(opt);
    }

    // Populate lunar day options (1-30)
    for (let d = 1; d <= 30; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d < 10 ? '0' + d : d;
        lDayInput.appendChild(opt);
    }

    // Populate lunar month options (1-12)
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m < 10 ? '0' + m : m;
        lMonthInput.appendChild(opt);
    }

    let isSyncing = false;

    const syncSolarToLunar = () => {
        if (isSyncing) return;
        isSyncing = true;
        const d = parseInt(solarDaySelect.value);
        const m = parseInt(solarMonthSelect.value);
        const y = parseInt(solarYearInput.value);
        if (d && m && y) {
            const res = AmLich.solarToLunar(d, m, y);
            // Cập nhật select box Âm lịch
            lDayInput.value = res.day;
            lMonthInput.value = res.month;
            lYearInput.value = res.year;
            lLeapCheckbox.checked = res.leap === 1;
        }
        isSyncing = false;
    };

    const syncLunarToSolar = () => {
        if (isSyncing) return;
        isSyncing = true;
        const ld = parseInt(lDayInput.value);
        const lm = parseInt(lMonthInput.value);
        const ly = parseInt(lYearInput.value);
        const isLeap = lLeapCheckbox.checked;
        if (ld && lm && ly) {
            const jd = AmLich.lunarToSolarJd(ld, lm, ly, isLeap ? 1 : 0);
            const res = AmLich.jdToDate(jd);
            // Cập nhật select box và input Dương lịch
            solarDaySelect.value = res[0];
            solarMonthSelect.value = res[1];
            solarYearInput.value = res[2];
        }
        isSyncing = false;
    };

    // Attach listeners
    [solarDaySelect, solarMonthSelect, solarYearInput].forEach(el => {
        el.addEventListener('change', syncSolarToLunar);
    });
    solarYearInput.addEventListener('input', syncSolarToLunar);

    [lDayInput, lMonthInput, lYearInput, lLeapCheckbox].forEach(el => {
        el.addEventListener('change', syncLunarToSolar);
    });
    [lDayInput, lMonthInput, lYearInput].forEach(el => {
        el.addEventListener('input', syncLunarToSolar);
    });

    // Populate initial default if not provided by URL
    const setDefaultValues = () => {
        solarDaySelect.value = '19';
        solarMonthSelect.value = '8';
        solarYearInput.value = '2004';
        syncSolarToLunar();
    };

    // =====================
    // URL STATE LOGIC
    // =====================
    const updateUrlFromForm = () => {
        const params = new URLSearchParams();
        params.set('hoTen', document.getElementById('hoTen').value);
        params.set('gioiTinh', document.getElementById('gioiTinh').value);
        params.set('ngay', solarDaySelect.value);
        params.set('thang', solarMonthSelect.value);
        params.set('nam', solarYearInput.value);
        params.set('gioSinh', document.getElementById('gioSinh').value);
        params.set('namXem', document.getElementById('namXem').value);

        const newUrl = window.location.pathname + '?' + params.toString();
        window.history.pushState({ path: newUrl }, '', newUrl);
    };

    const loadFormFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('hoTen')) {
            document.getElementById('hoTen').value = params.get('hoTen');
            document.getElementById('gioiTinh').value = params.get('gioiTinh');
            solarDaySelect.value = params.get('ngay');
            solarMonthSelect.value = params.get('thang');
            solarYearInput.value = params.get('nam');
            document.getElementById('gioSinh').value = params.get('gioSinh');
            document.getElementById('namXem').value = params.get('namXem');

            // Sync lunar side
            syncSolarToLunar();
            return true;
        }

        // No URL params, use defaults
        setDefaultValues();
        return false;
    };

    // =====================
    // EVENT HANDLERS
    // =====================
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        updateUrlFromForm();
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
        const activeBtn = document.querySelector('.tab-btn.active');
        if (!activeBtn) {
            console.warn('[Rawdata] No active tab button found');
            return;
        }

        const activeTab = activeBtn.dataset.tab;
        let data = '';
        let title = '';

        console.log('[Rawdata] Clicked. Active Tab:', activeTab);

        if (activeTab === 'tuvi') {
            data = window._currentTuViRawdata;
            title = '📋 Raw Data - Lá Số Tử Vi';
        } else if (activeTab === 'thanSoHoc') {
            data = window._currentTSHRawdata;
            title = '📋 Raw Data - Thần Số Học';
        }

        if (data) {
            rawdataTextarea.value = data;
            const titleEl = document.querySelector('.rawdata-modal-header h3');
            if (titleEl) titleEl.textContent = title;
            rawdataModal.style.display = 'flex';
            rawdataTextarea.scrollTop = 0;
        } else {
            console.warn('[Rawdata] No data available for tab:', activeTab);
            alert('Vui lòng đợi hệ thống tính toán xong dữ liệu cho tab này.');
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

    // Download chart as image
    const btnDownload = document.getElementById('btnDownload');
    if (btnDownload) {
        btnDownload.addEventListener('click', async function () {
            const chartEl = document.querySelector('.chart-grid');
            if (!chartEl) {
                alert('Không tìm thấy vùng dữ liệu lá số');
                return;
            }

            const originalText = btnDownload.innerHTML;
            btnDownload.innerHTML = '⏳ Đang xử lý...';
            btnDownload.disabled = true;

            try {
                // Đảm bảo các font đã được load
                await document.fonts.ready;

                const canvas = await html2canvas(chartEl, {
                    scale: 2, // Tăng chất lượng ảnh
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#fffcf2', // Khớp với --chart-bg
                    logging: false,
                    onclone: (clonedDoc) => {
                        // Đảm bảo watermark hiển thị trong bản clone
                        const centerCell = clonedDoc.querySelector('.center-cell');
                        if (centerCell) centerCell.style.overflow = 'hidden';
                    }
                });

                // Watermark text ở góc dưới (phụ trợ cho watermark nền)
                const ctx = canvas.getContext('2d');
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                ctx.textAlign = 'right';
                ctx.fillText('tuvi.demowebest.site', canvas.width - 20, canvas.height - 20);

                // Chuyển sang Blob để tải file ổn định hơn trên mobile/tablet
                canvas.toBlob((blob) => {
                    if (!blob) {
                        alert('Lỗi tạo dữ liệu ảnh');
                        return;
                    }
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const hoTen = document.getElementById('hoTen').value || 'laso';
                    const safeName = hoTen.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
                    link.download = `tuvi_${safeName}_${new Date().getTime()}.png`;
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    btnDownload.innerHTML = originalText;
                    btnDownload.disabled = false;
                }, 'image/png');

            } catch (err) {
                console.error('Download error:', err);
                alert('Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại hoặc chụp màn hình trực tiếp.');
                btnDownload.innerHTML = originalText;
                btnDownload.disabled = false;
            }
        });
    }


    async function generateChart() {
        btnSubmit.innerHTML = '<span class="btn-icon">⏳</span><span>Đang tính toán...</span>';
        btnSubmit.disabled = true;

        try {
            await TuViInterpret.loadInterpretationData();

            // 1. Collect basic input
            const hoTen = document.getElementById('hoTen').value || 'Không xác định';
            const gioiTinh = document.getElementById('gioiTinh').value;
            const gioSinh = parseInt(document.getElementById('gioSinh').value);
            const namXem = parseInt(document.getElementById('namXem').value);

            const ngay = parseInt(document.getElementById('solarDay').value);
            const thang = parseInt(document.getElementById('solarMonth').value);
            const nam = parseInt(document.getElementById('solarYear').value);

            if (!ngay || !thang || !nam) {
                alert('Vui lòng nhập đầy đủ ngày tháng năm sinh!');
                resetButton();
                return;
            }

            const jd = AmLich.jdFromDate(ngay, thang, nam);

            // 2. Chuyển đổi sang object chuẩn của engine
            // Nếu là Solar, engine sẽ tự convert sang Lunar. 
            // Nếu là Lunar, ta tính JD rồi lát nữa TuViCalc sẽ dùng.

            // ĐỂ ĐẢM BẢO ENGINE ĐÚNG: Ta luôn đưa về Solar date tương ứng
            const solarParts = AmLich.jdToDate(jd); // [d, m, y]
            const params = {
                ngay: solarParts[0],
                thang: solarParts[1],
                nam: solarParts[2],
                gioSinh,
                gioiTinh,
                namXem
            };

            const lasoData = TuViCalc.calculate(params);


            // An sao
            TuViSao.anSao(lasoData);

            // === ĐẠI VẬN TỨ HÓA (Giai đoạn 3: Trung Châu Phái) ===
            if (typeof TuViDaiVanHoa !== 'undefined' && lasoData.daiVanHienTai) {
                try {
                    lasoData.daiVanTuHoa = TuViDaiVanHoa.calculate(
                        lasoData.canChiNam.canIndex,
                        lasoData.daiVanHienTai,
                        lasoData.saoMap,
                        lasoData.cungMap
                    );
                    // Phát hiện Kỵ trùng phùng
                    if (lasoData.daiVanTuHoa) {
                        lasoData.kyTrungPhung = TuViDaiVanHoa.detectKyTrungPhung(
                            lasoData.daiVanTuHoa, lasoData
                        );
                    }
                    console.log('[DaiVanTuHoa] Calculated:', lasoData.daiVanTuHoa);
                } catch (err) {
                    console.warn('[DaiVanTuHoa] Error:', err.message);
                }
            }

            // === TINH HỆ (Lục Thập Tinh Hệ v1.0) ===
            if (typeof TuViTinhHe !== 'undefined') {
                try {
                    lasoData.tinhHeMenh = TuViTinhHe.getTinhHe(lasoData.cungMenhPos, lasoData.saoMap);
                    lasoData.allTinhHe = TuViTinhHe.getAllTinhHe(lasoData.saoMap);
                    console.log('[TinhHe] Mệnh:', lasoData.tinhHeMenh?.name);
                } catch (err) {
                    console.warn('[TinhHe] Error:', err.message);
                }
            }

            // === TÍNH 3 NĂM TRƯỚC (N-1, N-2, N-3) ĐỂ SO SÁNH ỨNG SỐ ===
            let prevYearsSummaries = [];
            for (let offset = 1; offset <= 3; offset++) {
                try {
                    const prevParams = { ngay, thang, nam, gioSinh, gioiTinh, namXem: namXem - offset };
                    const prevLasoData = TuViCalc.calculate(prevParams);
                    TuViSao.anSao(prevLasoData);
                    const summary = TuViInterpret.buildPrevYearSummary(prevLasoData);
                    prevYearsSummaries.push(summary);
                    console.log('[PrevYear] Đã tính năm', namXem - offset);
                } catch (err) {
                    console.warn('[PrevYear] Không tính được năm', namXem - offset, ':', err.message);
                }
            }
            // Backward compat: giữ prevYearSummary = năm gần nhất
            const prevYearSummary = prevYearsSummaries.length > 0 ? prevYearsSummaries[0] : null;

            // Render chart
            const chartHtml = TuViRender.render(lasoData, hoTen);
            chartWrapper.innerHTML = chartHtml;

            // Tinh Hệ Mệnh section (sau chart, trước interpretation)
            if (typeof TuViRender.renderTinhHe === 'function') {
                const tinhHeHtml = TuViRender.renderTinhHe(lasoData);
                if (tinhHeHtml) {
                    chartWrapper.insertAdjacentHTML('afterend', tinhHeHtml);
                }
            }

            // Generate interpretation (từ API data)
            const interpretation = TuViInterpret.interpret(lasoData);
            interpretation.prevYear = prevYearSummary;
            const interpHtml = TuViInterpret.renderInterpretation(interpretation);
            interpretationContent.innerHTML = interpHtml;

            // Build rawdata cho nút "Xem Rawdata"
            try {
                const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
                const HUNG_TINH_NANG = ['Kình Dương', 'Đà La', 'Hoả Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];
                const lunar = lasoData.lunarDate;
                const lunarDateStr = `Ngày ${lunar.day} tháng ${lunar.month} năm ${lunar.year}${lunar.leap ? ' (Nhuận)' : ''} (${lasoData.canChiNam.full})`;
                const gioSinhStr = `Giờ ${DIA_CHI[gioSinh]}`;
                const ngayDL = `${ngay}/${thang}/${nam}`;

                // Thứ tự cung chuẩn Tử Vi
                const CUNG_ORDER = ['MỆNH', 'HUYNH ĐỆ', 'PHU THÊ', 'TỬ TỨC', 'TÀI BẠCH', 'TẬT ÁCH',
                    'THIÊN DI', 'NÔ BỘC', 'QUAN LỘC', 'ĐIỀN TRẠCH', 'PHÚC ĐỨC', 'PHỤ MẪU'];

                const compact = {
                    hoTen: hoTen,
                    gioiTinh: gioiTinh,
                    ngaySinhAL: lunarDateStr,
                    ngaySinhDL: ngayDL,
                    gioSinh: gioSinhStr,
                    namXem: namXem,
                    amDuong: lasoData.amDuong,
                    menhNapAm: lasoData.menhNapAm,
                    hanhMenh: lasoData.hanhMenh,
                    cucName: lasoData.cucName,
                    cungMenh: lasoData.cungMap[lasoData.cungMenhPos] + ' tại cung ' + DIA_CHI[lasoData.cungMenhPos],
                    cungThan: lasoData.cungMap[lasoData.cungThanPos] + ' tại cung ' + DIA_CHI[lasoData.cungThanPos],
                    thuan: lasoData.thuan ? 'Thuận lý' : 'Nghịch lý',
                    cung: {}
                };

                // Tinh Hệ Mệnh
                if (lasoData.tinhHeMenh && lasoData.tinhHeMenh.id !== 'vcd') {
                    compact.tinhHeMenh = lasoData.tinhHeMenh.name + ' (' + lasoData.tinhHeMenh.archetype + ')';
                }

                // 12 cung: sao + trạng thái + hoá + TRỌNG SỐ (weight)
                for (let i = 0; i < 12; i++) {
                    const pos = (lasoData.cungMenhPos + i) % 12;
                    const cungName = lasoData.cungMap[pos];
                    const saoList = lasoData.saoMap[pos] || [];

                    // Tính trọng số cung
                    let heavyCount = 0;
                    saoList.forEach(s => {
                        if (HUNG_TINH_NANG.includes(s.name)) heavyCount++;
                        if (s.hoa === 'Kỵ') heavyCount++;
                        if (s.luuHoa === 'Kỵ') heavyCount++;
                    });
                    // Tuần/Triệt
                    if (lasoData.tuanTriet) {
                        if (lasoData.tuanTriet.triet && lasoData.tuanTriet.triet.indexOf(pos) >= 0) heavyCount++;
                    }

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
                    const cungEntry = {
                        chinh: chinh.length > 0 ? chinh.join(', ') : 'Vô Chính Diệu',
                        phu: phu.join(', ')
                    };
                    if (heavyCount >= 3) cungEntry.weight = 'HEAVY';
                    compact.cung[cungName + ' (' + DIA_CHI[pos] + ')'] = cungEntry;
                }

                // Đại vận + Tiểu vận
                const dv = lasoData.daiVanHienTai;
                const tv = lasoData.tieuVan;
                if (dv) {
                    const dvSao = (lasoData.saoMap[dv.cungPos] || []).filter(s => s.type === 'chinh').map(s => s.name);
                    compact.daiVan = {
                        cung: lasoData.cungMap[dv.cungPos] + ' (' + DIA_CHI[dv.cungPos] + ')',
                        tuoi: dv.tuoiFrom + ' đến ' + dv.tuoiTo + ' tuổi',
                        saoChinhTinh: dvSao.join(', ') || 'Vô Chính Diệu'
                    };
                }
                if (tv) {
                    const tvSao = (lasoData.saoMap[tv.cungPos] || []).filter(s => s.type === 'chinh').map(s => s.name);
                    compact.tieuVan = {
                        cung: lasoData.cungMap[tv.cungPos] + ' (' + DIA_CHI[tv.cungPos] + ')',
                        tuoi: tv.tuoi + ' tuổi',
                        saoChinhTinh: tvSao.join(', ') || 'Vô Chính Diệu'
                    };
                }
                // Lưu Tứ Hoá
                if (lasoData.luuTuHoa && lasoData.luuTuHoa.length > 0) {
                    compact.luuTuHoa = lasoData.luuTuHoa.map(h => h.hoaName + ': ' + h.saoName + ' → ' + lasoData.cungMap[h.cungPos]);
                }
                // Đại Vận Tứ Hóa
                if (lasoData.daiVanTuHoa) {
                    compact.daiVanTuHoa = {
                        canDaiVan: lasoData.daiVanTuHoa.canDaiVan,
                        tuHoa: lasoData.daiVanTuHoa.details.map(d => d.hoaName + ': ' + d.saoName + ' → ' + d.cungName)
                    };
                    if (lasoData.kyTrungPhung) {
                        compact.daiVanTuHoa.kyTrungPhung = lasoData.kyTrungPhung.description;
                    }
                }

                // Nguyệt hạn 12 tháng
                if (interpretation.vanHan && interpretation.vanHan.luuNienAnalysis && interpretation.vanHan.luuNienAnalysis.nguyetHan) {
                    compact.nguyetHan = interpretation.vanHan.luuNienAnalysis.nguyetHan.map(m => ({
                        thang: m.thang,
                        cung: m.cungName,
                        energy: m.energy,
                        level: m.level,
                        chinh: m.chinhTinh ? m.chinhTinh.join(', ') : 'VCĐ',
                        hoaKy: m.hasHoaKy ? true : undefined
                    }));
                }

                // 3 năm trước (tóm tắt điểm nhấn)
                if (prevYearsSummaries.length > 0) {
                    compact.ungSo3NamTruoc = prevYearsSummaries.map(s => ({
                        nam: s.nam,
                        daiVan: s.daiVan ? s.daiVan.cungName : null,
                        tieuVan: s.tieuVan ? s.tieuVan.cungName : null,
                        nangLuong: s.nangLuong ? s.nangLuong.tongHop : null,
                        suKien: s.suKien ? s.suKien.slice(0, 3) : null,
                        rating: s.rating || null
                    }));
                }

                // Build rawdata prompt chuyên nghiệp
                // Build rawdata prompt chuyên nghiệp v9.0 (Master Prompt - Loaded from file)
                (async () => {
                    try {
                        const promptResp = await fetch('/prompts/tuvi_master.v11.prompt?v=11.0');
                        let promptTemplate = await promptResp.text();

                        // Replace placeholders
                        const promptMerged = promptTemplate
                            .replace(/{{hoTen}}/g, hoTen)
                            .replace(/{{CUNG_ORDER}}/g, CUNG_ORDER.join(' → '))
                            .replace(/{{namXem}}/g, namXem);

                        window._currentTuViRawdata = promptMerged + JSON.stringify(compact, null, 2);
                        btnRawdata.style.display = 'inline-flex';
                    } catch (promptErr) {
                        console.warn('[Rawdata] Could not load prompt file, using fallback');
                        window._currentTuViRawdata = "DATA LÁ SỐ:\n" + JSON.stringify(compact, null, 2);
                        btnRawdata.style.display = 'inline-flex';
                    }
                })();
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

            // Build TSH Rawdata
            try {
                const tshPrompt = `Bạn là một chuyên gia Thần Số Học (Numerologist) hàng đầu với hơn 20 năm kinh nghiệm, am hiểu sâu sắc trường phái Pythagoras. Bản luận giải này cần sự sâu sắc, thấu cảm và mang tính định hướng cao.

## NHIỆM VỤ:
Dựa trên dữ liệu JSON bên dưới, hãy viết một bản Luận giải Thần Số Học chi tiết (khoảng 2000-3000 từ). 

## CẤU TRÚC BÀI LUẬN GIẢI YÊU CẦU:
1. **LỜI DẪN**: Giới thiệu về ý nghĩa các con số và thông điệp chung cho Đương số.
2. **CON SỐ CHỦ ĐẠO (Life Path)**: Phân tích bài học, năng lực và con đường phát triển.
3. **BIỂU ĐỒ NGÀY SINH**: Phân tích các bộ số, Mũi tên Sức mạnh và Mũi tên Trống. Đưa ra giải pháp "điền số ảo" để hóa giải.
4. **LINH HỒN (Soul Urge) & NHÂN CÁCH (Personality)**: Sự mâu thuẫn hoặc cộng hưởng giữa khao khát nội tâm và biểu hiện bên ngoài.
5. **SỨ MỆNH (Expression) & TRƯỞNG THÀNH (Maturity)**: Tài năng thiên bẩm và vận mệnh hậu vận.
6. **CHỈ SỐ CẦU NỐI**: Cách hài hòa các khía cạnh cuộc sống.
7. **NĂM CÁ NHÂN & CHU KỲ ĐỈNH CAO**: Phân tích vận trình năm hiện tại và 4 đỉnh cao vinh quang.
8. **LỜI KHUYÊN CHIẾN LƯỢC**: 3 bước hành động cụ thể.

## QUY TẮC BẮT BUỘC:
- Gọi là "Đương số".
- Phải phân tích sự TƯƠNG TÁC giữa các con số (ví dụ: Số Chủ Đạo 4 gặp Linh Hồn 1 thì sẽ thế nào).
- KHÔNG nói chung chung, hãy dùng ngôn từ tinh tế, truyền cảm hứng.

## DATA THẦN SỐ HỌC:
`;
                window._currentTSHRawdata = tshPrompt + JSON.stringify(tshResult, null, 2);
            } catch (e) {
                console.warn('[Rawdata TSH] Error building rawdata:', e);
            }

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
            const lunarStr = `${lasoData.lunarDate.day}/${lasoData.lunarDate.month}/${lasoData.lunarDate.year}${lasoData.lunarDate.leap ? ' (Nhuận)' : ''}`;
            loadAiAnalysis(interpretation, { hoTen, ngaySinhStr: lunarStr, gioSinh, namXem, tinhHeMenh: lasoData.tinhHeMenh, prevYears: prevYearsSummaries });


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
                yearView: metadata.namXem,
                tinhHeMenh: metadata.tinhHeMenh ? metadata.tinhHeMenh.name + ' (' + metadata.tinhHeMenh.archetype + ')' : undefined,
                prevYears: metadata.prevYears || []
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

    // Auto-fill defaults & Load from URL
    document.addEventListener('DOMContentLoaded', function () {
        const currentYear = new Date().getFullYear();
        document.getElementById('namXem').value = currentYear;

        // Nếu có URL params, tự động lập lá số
        if (loadFormFromUrl()) {
            console.log('[App] Detected URL params, auto-generating chart...');
            generateChart();
        }
    });

})();
