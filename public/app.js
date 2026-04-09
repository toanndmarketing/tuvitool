(function () {
    'use strict';

    const $ = (id) => document.getElementById(id);
    const toInt = (v) => parseInt(v, 10);
    const pad2 = (n) => String(n).padStart(2, '0');

    const state = {
        mode: 'single',
        activeMainTab: 'tuvi',
        activeProfile: 'A',
        results: { A: null, B: null },
        aiLoading: { A: false, B: false },
        aiResult: { A: null, B: null },
        raw: { A: '', B: '' },
        promptTemplate: '',
        bManualOverride: false
    };

    const els = {
        form: $('tuViForm'),
        inputSection: $('inputSection'),
        resultsSection: $('resultsSection'),
        twinMode: $('twinMode'),
        namXem: $('namXem'),
        profileB: $('profileCardB'),
        twinTabs: $('twinResultsTabs'),
        chartA: $('chartWrapperA'),
        chartB: $('chartWrapperB'),
        tinhHe: $('tinhHeWrapper'),
        interp: $('interpretationContent'),
        tsh: $('tshContainer'),
        btnSubmit: $('btnSubmit'),
        btnBack: $('btnBack'),
        btnPrint: $('btnPrint'),
        btnDownload: $('btnDownload'),
        btnRaw: $('btnRawdata'),
        tabTSH: $('tabTSH'),
        rawModal: $('rawdataModal'),
        rawText: $('rawdataTextarea'),
        rawCopy: $('rawdataCopyBtn'),
        rawClose: $('rawdataCloseBtn')
    };

    const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
    const tabContents = Array.from(document.querySelectorAll('.tab-content'));
    const twinBtns = Array.from(document.querySelectorAll('.twin-tab-btn'));
    const syncers = {};

    const A_SOURCE_FIELDS = [
        'hoTenA', 'gioiTinhA',
        'solarDayA', 'solarMonthA', 'solarYearA',
        'birthHourA', 'birthMinuteA'
    ];
    const B_MANUAL_FIELDS = [
        'hoTenB', 'gioiTinhB',
        'solarDayB', 'solarMonthB', 'solarYearB',
        'lDayB', 'lMonthB', 'lYearB', 'lLeapB',
        'birthHourB', 'birthMinuteB'
    ];

    function canhFromHourMinute(hour, minute) {
        if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
            throw new Error('Giờ sinh phải từ 0-23');
        }
        if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
            throw new Error('Phút sinh phải từ 0-59');
        }
        if (hour === 23) return 0;
        return Math.floor((hour + 1) / 2) % 12;
    }

    function hourFromCanh(canh) {
        if (canh === 0) return 23;
        return canh * 2 - 1;
    }

    function populateDateOptions(suffix) {
        const sd = $('solarDay' + suffix);
        const sm = $('solarMonth' + suffix);
        const ld = $('lDay' + suffix);
        const lm = $('lMonth' + suffix);

        if (sd.options.length > 0) return;

        for (let i = 1; i <= 31; i++) {
            sd.add(new Option(pad2(i), String(i)));
        }
        for (let i = 1; i <= 12; i++) {
            sm.add(new Option(pad2(i), String(i)));
        }
        for (let i = 1; i <= 30; i++) {
            ld.add(new Option(pad2(i), String(i)));
        }
        for (let i = 1; i <= 12; i++) {
            lm.add(new Option(pad2(i), String(i)));
        }
    }

    function bindSolarLunarSync(suffix) {
        const sd = $('solarDay' + suffix);
        const sm = $('solarMonth' + suffix);
        const sy = $('solarYear' + suffix);
        const ld = $('lDay' + suffix);
        const lm = $('lMonth' + suffix);
        const ly = $('lYear' + suffix);
        const leap = $('lLeap' + suffix);

        let lock = false;

        const solarToLunar = () => {
            if (lock) return;
            lock = true;
            const d = toInt(sd.value);
            const m = toInt(sm.value);
            const y = toInt(sy.value);
            if (d && m && y) {
                const r = AmLich.solarToLunar(d, m, y);
                ld.value = String(r.day);
                lm.value = String(r.month);
                ly.value = String(r.year);
                leap.checked = r.leap === 1;
            }
            lock = false;
        };

        const lunarToSolar = () => {
            if (lock) return;
            lock = true;
            const d = toInt(ld.value);
            const m = toInt(lm.value);
            const y = toInt(ly.value);
            if (d && m && y) {
                const jd = AmLich.lunarToSolarJd(d, m, y, leap.checked ? 1 : 0);
                const r = AmLich.jdToDate(jd);
                sd.value = String(r[0]);
                sm.value = String(r[1]);
                sy.value = String(r[2]);
            }
            lock = false;
        };

        [sd, sm, sy].forEach((el) => el.addEventListener('change', solarToLunar));
        sy.addEventListener('input', solarToLunar);
        [ld, lm, ly, leap].forEach((el) => el.addEventListener('change', lunarToSolar));
        [ld, lm, ly].forEach((el) => el.addEventListener('input', lunarToSolar));

        return {
            solarToLunar,
            setDefault: () => {
                sd.value = '19';
                sm.value = '8';
                sy.value = '2004';
                solarToLunar();
            }
        };
    }

    function cloneAtoB(force) {
        if (!els.twinMode.checked) return;
        if (!force && state.bManualOverride) return;

        $('hoTenB').value = $('hoTenA').value || '';
        $('gioiTinhB').value = $('gioiTinhA').value || 'nam';
        $('solarDayB').value = $('solarDayA').value;
        $('solarMonthB').value = $('solarMonthA').value;
        $('solarYearB').value = $('solarYearA').value;
        $('birthHourB').value = $('birthHourA').value;
        $('birthMinuteB').value = $('birthMinuteA').value;
        syncers.B.solarToLunar();
    }

    function bindAutoCloneAtoB() {
        A_SOURCE_FIELDS.forEach((id) => {
            const el = $(id);
            if (!el) return;
            ['change', 'input'].forEach((evt) => {
                el.addEventListener(evt, () => cloneAtoB(false));
            });
        });

        B_MANUAL_FIELDS.forEach((id) => {
            const el = $(id);
            if (!el) return;
            ['change', 'input'].forEach((evt) => {
                el.addEventListener(evt, () => {
                    if (els.twinMode.checked) {
                        state.bManualOverride = true;
                    }
                });
            });
        });
    }

    function setMode(isTwin) {
        state.mode = isTwin ? 'twin' : 'single';
        els.profileB.style.display = isTwin ? 'block' : 'none';
        els.twinTabs.style.display = isTwin ? 'flex' : 'none';
        els.tabTSH.style.display = isTwin ? 'none' : 'inline-flex';
        
        const twinOrderRow = document.getElementById('twinOrderRow');
        if (twinOrderRow) twinOrderRow.style.display = isTwin ? 'block' : 'none';

        if (isTwin) {
            state.bManualOverride = false;
            cloneAtoB(true);
            setMainTab('tuvi');
        }
    }

    function setMainTab(tab) {
        state.activeMainTab = tab;
        tabBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tab));
        tabContents.forEach((c) => c.classList.toggle('active', c.dataset.tabContent === tab));
        if (tab === 'tuvi') ensureAiForActiveProfile();
    }

    function setProfileTab(key) {
        state.activeProfile = key;
        twinBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.baby === key));
        els.chartA.style.display = key === 'A' ? 'block' : 'none';
        els.chartB.style.display = key === 'B' ? 'block' : 'none';
        renderActiveInterpretation();
        ensureAiForActiveProfile();
    }

    function resetSubmitBtn() {
        els.btnSubmit.innerHTML = '<span class="btn-icon">✨</span><span>Lập Lá Số</span>';
        els.btnSubmit.disabled = false;
    }

    function loadingSubmitBtn() {
        els.btnSubmit.innerHTML = '<span class="btn-icon">⏳</span><span>Đang tính toán...</span>';
        els.btnSubmit.disabled = true;
    }

    function collectProfile(key) {
        const day = toInt($('solarDay' + key).value);
        const month = toInt($('solarMonth' + key).value);
        const year = toInt($('solarYear' + key).value);
        const hour = toInt($('birthHour' + key).value);
        const minute = toInt($('birthMinute' + key).value);
        const fullName = ($('hoTen' + key).value || '').trim();
        const gender = $('gioiTinh' + key).value || 'nam';

        if (!day || !month || !year) {
            throw new Error('Thiếu ngày sinh Đương Số ' + key);
        }
        if (!fullName) {
            throw new Error('Thiếu họ tên Đương Số ' + key);
        }

        const canh = canhFromHourMinute(hour, minute);
        const dateObj = new Date(year, month - 1, day, hour, minute, 0, 0);

        return {
            key,
            label: key === 'A' ? 'Đương Số A' : 'Đương Số B',
            fullName,
            gender,
            day,
            month,
            year,
            hour,
            minute,
            birthTimeExact: `${pad2(hour)}:${pad2(minute)}`,
            canhOriginal: canh,
            canhResolved: canh,
            dateObj
        };
    }

    function applyTwinCanhResolution(a, b) {
        if (!b) return;
        // Bỏ tà thuật Dịch Giờ. Cả 2 giữ nguyên giờ gốc.
        a.canhResolved = a.canhOriginal;
        b.canhResolved = b.canhOriginal;
    }

    function buildTwinMeta(self, other, isEmCungGioi, isOlder) {
        if (!other) return null;
        const minuteDelta = Math.abs(Math.round((self.dateObj.getTime() - other.dateObj.getTime()) / 60000));
        return {
            birthTimeExact: self.birthTimeExact,
            gioSinhIndex: self.canhOriginal,
            gioSinhIndexResolved: self.canhResolved,
            minuteDelta,
            sameGender: self.gender === other.gender,
            isDiCung: isEmCungGioi || false,
            role: isOlder ? 'Anh/Chị (Sinh trước)' : 'Em (Sinh sau)'
        };
    }

    function updateUrl() {
        const p = new URLSearchParams();
        p.set('mode', els.twinMode.checked ? 'twin' : 'single');
        p.set('namXem', els.namXem.value || String(new Date().getFullYear()));

        ['A', 'B'].forEach((k) => {
            if (k === 'B' && !els.twinMode.checked) return;
            p.set(`${k.toLowerCase()}_name`, $('hoTen' + k).value || '');
            p.set(`${k.toLowerCase()}_gender`, $('gioiTinh' + k).value || 'nam');
            p.set(`${k.toLowerCase()}_ngay`, $('solarDay' + k).value);
            p.set(`${k.toLowerCase()}_thang`, $('solarMonth' + k).value);
            p.set(`${k.toLowerCase()}_nam`, $('solarYear' + k).value);
            p.set(`${k.toLowerCase()}_hour`, $('birthHour' + k).value);
            p.set(`${k.toLowerCase()}_minute`, $('birthMinute' + k).value);
        });

        history.pushState({}, '', location.pathname + '?' + p.toString());
    }

    function loadUrl() {
        const p = new URLSearchParams(location.search);
        if (!p.toString()) return false;

        els.twinMode.checked = (p.get('mode') || 'single') === 'twin';
        setMode(els.twinMode.checked);
        if (p.has('namXem')) els.namXem.value = p.get('namXem') || String(new Date().getFullYear());

        const fillProfile = (k) => {
            const q = k.toLowerCase() + '_';
            if (p.has(q + 'name')) $('hoTen' + k).value = p.get(q + 'name') || '';
            if (p.has(q + 'gender')) $('gioiTinh' + k).value = p.get(q + 'gender') || 'nam';
            if (p.has(q + 'ngay')) $('solarDay' + k).value = p.get(q + 'ngay');
            if (p.has(q + 'thang')) $('solarMonth' + k).value = p.get(q + 'thang');
            if (p.has(q + 'nam')) $('solarYear' + k).value = p.get(q + 'nam');
            if (p.has(q + 'hour')) $('birthHour' + k).value = p.get(q + 'hour');
            if (p.has(q + 'minute')) $('birthMinute' + k).value = p.get(q + 'minute');
        };

        fillProfile('A');
        if (els.twinMode.checked) fillProfile('B');

        if (!p.has('a_ngay') && p.has('ngay')) {
            $('solarDayA').value = p.get('ngay') || '19';
            $('solarMonthA').value = p.get('thang') || '8';
            $('solarYearA').value = p.get('nam') || '2004';
            if (p.has('hoTen')) $('hoTenA').value = p.get('hoTen') || '';
            if (p.has('gioiTinh')) $('gioiTinhA').value = p.get('gioiTinh') || 'nam';
            if (p.has('gioSinh')) $('birthHourA').value = String(hourFromCanh(toInt(p.get('gioSinh'))));
        }

        syncers.A.solarToLunar();
        if (els.twinMode.checked) {
            syncers.B.solarToLunar();
        }
        return true;
    }

    async function loadPromptTemplate() {
        if (state.promptTemplate) return state.promptTemplate;
        const resp = await fetch('/prompts/tuvi_master.v11.prompt?v=11.0');
        state.promptTemplate = await resp.text();
        return state.promptTemplate;
    }

    function applyEnhancements(lasoData) {
        if (typeof TuViDaiVanHoa !== 'undefined' && lasoData.daiVanHienTai) {
            try {
                lasoData.daiVanTuHoa = TuViDaiVanHoa.calculate(
                    lasoData.canChiNam.canIndex,
                    lasoData.daiVanHienTai,
                    lasoData.saoMap,
                    lasoData.cungMap
                );
                if (lasoData.daiVanTuHoa) {
                    lasoData.kyTrungPhung = TuViDaiVanHoa.detectKyTrungPhung(lasoData.daiVanTuHoa, lasoData);
                }
            } catch (err) {
                console.warn('[DaiVanTuHoa] Error:', err.message);
            }
        }

        if (typeof TuViTinhHe !== 'undefined') {
            try {
                lasoData.tinhHeMenh = TuViTinhHe.getTinhHe(lasoData.cungMenhPos, lasoData.saoMap);
                lasoData.allTinhHe = TuViTinhHe.getAllTinhHe(lasoData.saoMap);
            } catch (err) {
                console.warn('[TinhHe] Error:', err.message);
            }
        }
    }

    function buildPrevYears(profile, namXem) {
        const arr = [];
        for (let offset = 1; offset <= 3; offset++) {
            try {
                const prevLaso = TuViCalc.calculate({
                    ngay: profile.day,
                    thang: profile.month,
                    nam: profile.year,
                    gioSinh: profile.canhResolved,
                    gioiTinh: profile.gender,
                    namXem: namXem - offset
                });
                TuViSao.anSao(prevLaso);
                arr.push(TuViInterpret.buildPrevYearSummary(prevLaso));
            } catch (err) {
                console.warn('[PrevYear] Error:', err.message);
            }
        }
        return arr;
    }

    function buildChartSignature(lasoData) {
        const saoMap = lasoData.saoMap || {};
        const sao = Array.from({ length: 12 }, (_, i) => {
            const list = Array.isArray(saoMap) ? saoMap[i] : saoMap[i];
            return (list || [])
                .map((s) => `${s.name}|${s.type}|${s.hoa || ''}|${s.luuHoa || ''}`)
                .join(',');
        }).join('||');
        const truongSinh = Array.from({ length: 12 }, (_, i) => (lasoData.truongSinhMap || {})[i] || '').join('|');
        const tuan = ((lasoData.tuanTriet || {}).tuan || []).join(',');
        const triet = ((lasoData.tuanTriet || {}).triet || []).join(',');
        return [
            lasoData.cungMenhPos,
            lasoData.cungThanPos,
            truongSinh,
            tuan,
            triet,
            sao
        ].join('::');
    }

    async function buildResultForProfile(profile, otherProfile, namXem) {
        const lasoData = TuViCalc.calculate({
            ngay: profile.day,
            thang: profile.month,
            nam: profile.year,
            gioSinh: profile.canhResolved,
            gioiTinh: profile.gender,
            namXem
        });
        TuViSao.anSao(lasoData);
        applyEnhancements(lasoData);

        // --- HỆ THỐNG XỬ LÝ SINH ĐÔI CHUYỂN CUNG ---
        const isTwinMode = !!otherProfile;
        let isOlder = false;
        let isEmCungGioi = false;
        
        if (isTwinMode) {
            const twinOrderRadio = document.querySelector('input[name="twinOrder"]:checked');
            const olderKey = twinOrderRadio ? twinOrderRadio.value : 'A';
            isOlder = (olderKey === profile.key);
            isEmCungGioi = (!isOlder) && (profile.gender === otherProfile.gender);
        }

        if (isEmCungGioi) {
            // Dịch chuyển Cung Mệnh sang mượn cung Thiên Di
            // LƯU Ý: Vị trí Thân (cungThanPos) và các sao được giữ nguyên, KHÔNG DỊCH CHUYỂN
            lasoData.cungMenhPos = (lasoData.cungMenhPos + 6) % 12;
            
            // Vẽ lại tên 12 cung theo Mệnh mới
            lasoData.cungMap = TuViCalc.anCung(lasoData.cungMenhPos);
            
            // Tính lại Đại Vận theo Mệnh mới (Tuổi bắt đầu giữ nguyên theo Cục gốc để bảo toàn tọa độ sao)
            lasoData.daiVan = TuViCalc.tinhDaiVan(lasoData.cucValue, lasoData.cungMenhPos, lasoData.thuan, lasoData.lunarDate.year);
            lasoData.daiVanHienTai = TuViCalc.getDaiVanHienTai(lasoData.daiVan, namXem);
            
            // Tính lại Tinh Hệ Mệnh theo vị trí Mệnh mới
            if (typeof TuViTinhHe !== 'undefined') {
                try {
                    lasoData.tinhHeMenh = TuViTinhHe.getTinhHe(lasoData.cungMenhPos, lasoData.saoMap);
                } catch (err) {
                    console.warn('[TinhHe] Error after Di Cung:', err.message);
                }
            }
        }

        const prevYears = buildPrevYears(profile, namXem);
        const interpretation = TuViInterpret.interpret(lasoData);
        interpretation.prevYear = prevYears[0] || null;

        const chartHtml = TuViRender.render(lasoData, profile.fullName, {
            chartId: 'baby-' + profile.key,
            babyLabel: profile.label,
            birthTimeExact: profile.birthTimeExact
        });
        const tinhHeHtml = typeof TuViRender.renderTinhHe === 'function' ? (TuViRender.renderTinhHe(lasoData) || '') : '';
        const interpretationHtml = TuViInterpret.renderInterpretation(interpretation);

        const lunar = lasoData.lunarDate;
        const aiPayload = {
            ...interpretation,
            name: profile.fullName,
            dob: `${lunar.day}/${lunar.month}/${lunar.year}${lunar.leap ? ' (Nhuận)' : ''}`,
            hour: profile.canhResolved,
            yearView: namXem,
            tinhHeMenh: lasoData.tinhHeMenh ? `${lasoData.tinhHeMenh.name} (${lasoData.tinhHeMenh.archetype})` : undefined,
            prevYears
        };

        const compact = {
            profile: profile.label,
            hoTen: profile.fullName,
            gioiTinh: profile.gender,
            ngaySinhDL: `${profile.day}/${profile.month}/${profile.year}`,
            birthTimeExact: profile.birthTimeExact,
            gioSinhIndex: profile.canhOriginal,
            gioSinhIndexResolved: profile.canhResolved,
            amDuong: lasoData.amDuong,
            menhNapAm: lasoData.menhNapAm,
            cucName: lasoData.cucName,
            cungMenh: lasoData.cungMap[lasoData.cungMenhPos],
            cungThan: lasoData.cungMap[lasoData.cungThanPos],
            twin: buildTwinMeta(profile, otherProfile, isEmCungGioi, isOlder)
        };

        let twinContext = "";
        if (isTwinMode) {
            const pronoun = isOlder ? (profile.gender === 'nam' ? 'Anh' : 'Chị') : 'Em';
            twinContext = `\n[HỆ THỐNG LƯU Ý CHO AI]:\nĐây là lá số của Đương Số ${profile.key} trong Cặp Sinh Đôi.\n`;
            twinContext += `- Vai vế thiết lập: Đương số là ${pronoun} (${isOlder ? 'Sinh trước' : 'Sinh sau'}).\n`;
            twinContext += `- Giới tính hai người: ${profile.gender === otherProfile.gender ? 'Cùng giới tính' : 'Khác giới tính'}.\n`;

            if (isEmCungGioi) {
                twinContext += `- Hệ thống áp dụng Di Cung (Mượn cung Thiên Di làm cung Mệnh cho người sinh sau), giữ nguyên tọa độ 108 sao gốc. Khi luận hãy so sánh với lá số gốc, chú ý mối quan hệ anh em đồng giới.\n`;
            } else if (!isOlder && profile.gender !== otherProfile.gender) {
                twinContext += `- Hai đương số khác giới tính (Nam/Nữ) nên hệ thống giữ nguyên Mệnh gốc (Không cần Di Cung). Đại vận chạy ngược chiều nhau tạo ra cách cục khác nhau ngay từ đầu.\n`;
            } else if (isOlder) {
                twinContext += `- Đương số là người sinh trước nên giữ nguyên trục Mệnh gốc.\n`;
            }
        }

        let raw;
        try {
            const template = await loadPromptTemplate();
            raw = template
                .replace(/{{hoTen}}/g, profile.fullName)
                .replace(/{{CUNG_ORDER}}/g, 'MỆNH -> ...')
                .replace(/{{namXem}}/g, String(namXem))
                + twinContext + '\nDATA JSON:\n' + JSON.stringify(compact, null, 2);
        } catch (err) {
            raw = twinContext + '\nDATA JSON:\n' + JSON.stringify(compact, null, 2);
        }

        return {
            chartHtml,
            tinhHeHtml,
            interpretationHtml,
            aiPayload,
            raw,
            signature: buildChartSignature(lasoData)
        };
    }

    function renderChart(key) {
        const wrapper = key === 'A' ? els.chartA : els.chartB;
        const rs = state.results[key];
        if (!wrapper || !rs) return;
        wrapper.innerHTML = rs.chartHtml;
        const grid = wrapper.querySelector('.chart-grid');
        if (grid) {
            TuViRender.initSoiCung({
                chartGrid: grid,
                svgId: 'soiCungSvg-baby-' + key
            });
        }
    }

    function renderActiveInterpretation() {
        const rs = state.results[state.activeProfile];
        if (!rs) return;

        els.interp.innerHTML = rs.interpretationHtml;
        els.tinhHe.innerHTML = rs.tinhHeHtml || '';
        window._currentInterpretation = rs.aiPayload;

        const aiBody = document.getElementById('aiAnalysisBody');
        if (!aiBody) return;
        if (state.aiResult[state.activeProfile]) {
            TuViInterpret.renderAiAnalysis(state.aiResult[state.activeProfile]);
        } else {
            aiBody.innerHTML = '<div class="ai-loading"><div class="ai-spinner"></div><p>Sẵn sàng tải phân tích AI</p></div>';
        }
    }

    async function ensureAiForActiveProfile() {
        const key = state.activeProfile;
        if (state.activeMainTab !== 'tuvi') return;
        if (!state.results[key]) return;
        if (state.aiLoading[key] || state.aiResult[key]) return;

        state.aiLoading[key] = true;
        try {
            const ai = await TuViInterpret.getAiInterpretation(state.results[key].aiPayload);
            state.aiResult[key] = ai;
            if (state.activeProfile === key && state.activeMainTab === 'tuvi') {
                TuViInterpret.renderAiAnalysis(ai);
            }
        } catch (err) {
            state.aiResult[key] = { error: 'Không thể kết nối AI', fallback: true };
            if (state.activeProfile === key && state.activeMainTab === 'tuvi') {
                TuViInterpret.renderAiAnalysis(state.aiResult[key]);
            }
        }
        state.aiLoading[key] = false;
    }

    function buildTSHRawData(data) {
        return 'DATA THAN SO HOC:\n' + JSON.stringify(data, null, 2);
    }

    async function generateCharts() {
        loadingSubmitBtn();
        state.results = { A: null, B: null };
        state.aiResult = { A: null, B: null };
        state.aiLoading = { A: false, B: false };
        state.raw = { A: '', B: '' };
        window._currentTuViRawdata = { A: '', B: '' };
        window._currentTSHRawdata = '';

        try {
            await TuViInterpret.loadInterpretationData();

            const namXem = toInt(els.namXem.value);
            const isTwin = els.twinMode.checked;
            // Khong goi setMode() o day de tranh clone A->B de len du lieu B da sua tay.
            updateUrl();

            const profileA = collectProfile('A');
            const profileB = isTwin ? collectProfile('B') : null;

            applyTwinCanhResolution(profileA, profileB);

            state.results.A = await buildResultForProfile(profileA, profileB, namXem);
            state.raw.A = state.results.A.raw;

            if (isTwin && profileB) {
                state.results.B = await buildResultForProfile(profileB, profileA, namXem);
                state.raw.B = state.results.B.raw;

                const combinedRaw = `====================================================\n` +
                                    `       BÁO CÁO TỬ VI SINH ĐÔI (A VÀ B)\n` +
                                    `====================================================\n\n` +
                                    `>>> [PHẦN 1: ĐƯƠNG SỐ A] <<<\n${state.raw.A}\n\n` +
                                    `----------------------------------------------------\n` +
                                    `>>> [PHẦN 2: ĐƯƠNG SỐ B] <<<\n${state.raw.B}`;
                window._currentTuViRawdata = { A: combinedRaw, B: combinedRaw };
            } else {
                window._currentTuViRawdata = { A: state.raw.A, B: '' };
            }

            renderChart('A');
            if (isTwin && state.results.B) renderChart('B');

            if (!isTwin) {
                const tshData = ThanSoHoc.calculate({
                    day: profileA.day,
                    month: profileA.month,
                    year: profileA.year,
                    fullName: profileA.fullName,
                    currentYear: namXem
                });
                els.tsh.innerHTML = ThanSoHocRender.render(tshData);
                window._currentTSHRawdata = buildTSHRawData(tshData);
            } else {
                els.tsh.innerHTML = '';
            }

            els.inputSection.style.display = 'none';
            els.resultsSection.style.display = 'block';
            els.btnRaw.style.display = 'inline-flex';
            setMainTab('tuvi');
            setProfileTab('A');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            alert('Lỗi khi tính lá số: ' + err.message);
        }

        resetSubmitBtn();
    }

    async function captureChart(grid) {
        await document.fonts.ready;
        return html2canvas(grid, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#fffcf2',
            logging: false
        });
    }

    function saveCanvas(canvas, name) {
        canvas.toBlob((blob) => {
            if (!blob) {
                alert('Lỗi tạo dữ liệu ảnh');
                return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = name;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    async function downloadImage() {
        const old = els.btnDownload.innerHTML;
        els.btnDownload.innerHTML = '⏳ Đang xử lý...';
        els.btnDownload.disabled = true;

        try {
            const sourceName = state.mode === 'single'
                ? (($('hoTenA').value || 'laso'))
                : ((($('hoTenA').value || 'duongsoA') + '_' + ($('hoTenB').value || 'duongsoB')));
            const safe = sourceName.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/g, '_');

            if (state.mode === 'single') {
                const c = await captureChart(els.chartA.querySelector('.chart-grid'));
                saveCanvas(c, `tuvi_${safe}_${Date.now()}.png`);
            } else {
                const prev = state.activeProfile;
                setProfileTab('A');
                await new Promise((r) => requestAnimationFrame(r));
                const ca = await captureChart(els.chartA.querySelector('.chart-grid'));

                setProfileTab('B');
                await new Promise((r) => requestAnimationFrame(r));
                const cb = await captureChart(els.chartB.querySelector('.chart-grid'));

                setProfileTab(prev);

                const m = 20;
                const lh = 34;
                const w = Math.max(ca.width, cb.width) + m * 2;
                const h = ca.height + cb.height + m * 3 + lh * 2;
                const out = document.createElement('canvas');
                out.width = w;
                out.height = h;
                const ctx = out.getContext('2d');
                ctx.fillStyle = '#fffcf2';
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = '#5d4037';
                ctx.font = 'bold 28px Inter, sans-serif';
                ctx.fillText('Đương Số A', m, m + 24);
                ctx.drawImage(ca, m, m + lh);
                const yB = m + lh + ca.height + m;
                ctx.fillText('Đương Số B', m, yB + 24);
                ctx.drawImage(cb, m, yB + lh);
                saveCanvas(out, `tuvi_sinhdoi_${safe}_${Date.now()}.png`);
            }
        } catch (err) {
            alert('Có lỗi khi tạo ảnh: ' + err.message);
        }

        els.btnDownload.innerHTML = old;
        els.btnDownload.disabled = false;
    }

    function bindEvents() {
        els.form.addEventListener('submit', (e) => {
            e.preventDefault();
            generateCharts();
        });

        els.btnBack.addEventListener('click', () => {
            els.resultsSection.style.display = 'none';
            els.inputSection.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        els.btnPrint.addEventListener('click', () => window.print());
        els.btnDownload.addEventListener('click', downloadImage);

        tabBtns.forEach((b) => {
            b.addEventListener('click', () => {
                if (b.dataset.tab === 'thanSoHoc' && state.mode === 'twin') return;
                setMainTab(b.dataset.tab);
            });
        });

        twinBtns.forEach((b) => {
            b.addEventListener('click', () => setProfileTab(b.dataset.baby));
        });

        els.twinMode.addEventListener('change', () => {
            setMode(els.twinMode.checked);
        });

        bindAutoCloneAtoB();

        els.btnRaw.addEventListener('click', () => {
            const isTSH = state.activeMainTab === 'thanSoHoc';
            const key = state.activeProfile;
            const data = isTSH ? window._currentTSHRawdata : ((window._currentTuViRawdata || {})[key] || '');
            if (!data) {
                alert('Vui lòng đợi hệ thống tính xong rawdata.');
                return;
            }
            els.rawText.value = data;
            const h = document.querySelector('.rawdata-modal-header h3');
            if (h) {
                h.textContent = isTSH
                    ? 'Raw Data - Thần Số Học'
                    : (state.mode === 'twin'
                        ? `Raw Data - Tử Vi (Cặp Sinh Đôi A & B)`
                        : 'Raw Data - Tử Vi');
            }
            els.rawModal.style.display = 'flex';
            els.rawText.scrollTop = 0;
        });

        els.rawClose.addEventListener('click', () => {
            els.rawModal.style.display = 'none';
        });
        els.rawModal.addEventListener('click', (e) => {
            if (e.target === els.rawModal) els.rawModal.style.display = 'none';
        });
        els.rawCopy.addEventListener('click', () => {
            els.rawText.select();
            navigator.clipboard.writeText(els.rawText.value).then(() => {
                els.rawCopy.textContent = '✅ Đã copy!';
                setTimeout(() => {
                    els.rawCopy.textContent = '📋 Copy';
                }, 2000);
            }).catch(() => {
                document.execCommand('copy');
            });
        });
    }

    function init() {
        populateDateOptions('A');
        populateDateOptions('B');
        syncers.A = bindSolarLunarSync('A');
        syncers.B = bindSolarLunarSync('B');

        els.namXem.value = String(new Date().getFullYear());
        if (!loadUrl()) {
            syncers.A.setDefault();
            syncers.B.setDefault();
        }

        setMode(els.twinMode.checked);
        bindEvents();

        if (new URLSearchParams(location.search).toString()) {
            generateCharts();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
