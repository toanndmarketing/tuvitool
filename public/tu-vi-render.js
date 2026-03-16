/**
 * ============================================
 * TỬ VI RENDER - Vẽ lá số Tử Vi theo dạng lưới 4x4
 * Layout chuẩn: 12 cung xung quanh, 2x2 trung tâm
 * ============================================
 */

const TuViRender = (function () {
    'use strict';

    const CHI_NAMES = AmLich.DIA_CHI;
    const CAN_NAMES = AmLich.THIEN_CAN;

    // Tháng tương ứng với mỗi cung (Dần = Tháng 1, Mão = Tháng 2,...)
    const THANG_MAP = {
        2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6,
        8: 7, 9: 8, 10: 9, 11: 10, 0: 11, 1: 12
    };

    // CSS Grid placement for each chi index
    // Row and Column are 1-indexed for CSS grid
    const GRID_PLACEMENT = {
        5: { row: 1, col: 1 }, // Tỵ
        6: { row: 1, col: 2 }, // Ngọ
        7: { row: 1, col: 3 }, // Mùi
        8: { row: 1, col: 4 }, // Thân
        4: { row: 2, col: 1 }, // Thìn
        9: { row: 2, col: 4 }, // Dậu
        3: { row: 3, col: 1 }, // Mão
        10: { row: 3, col: 4 }, // Tuất
        2: { row: 4, col: 1 }, // Dần
        1: { row: 4, col: 2 }, // Sửu
        0: { row: 4, col: 3 }, // Tý
        11: { row: 4, col: 4 }  // Hợi
    };

    // Prefix cho Địa Chi (theo Can năm)
    function getDiaChiPrefix(canNamIndex, chiIndex) {
        let canDauDan;
        switch (canNamIndex % 5) {
            case 0: canDauDan = 2; break; // Bính
            case 1: canDauDan = 4; break; // Mậu
            case 2: canDauDan = 6; break; // Canh
            case 3: canDauDan = 8; break; // Nhâm
            case 4: canDauDan = 0; break; // Giáp
        }
        let offset = ((chiIndex - 2) % 12 + 12) % 12;
        let canCung = (canDauDan + offset) % 10;
        let canChar = CAN_NAMES[canCung].charAt(0);
        return canChar + '.' + CHI_NAMES[chiIndex];
    }

    function getSaoClass(sao) {
        if (sao.type === 'chinh') return 'star-main';
        if (sao.type === 'luu') return 'star-luu';
        if (sao.nature === 'cat') return 'star-good';
        if (sao.nature === 'hung') return 'star-bad';
        return 'star-neutral';
    }

    function getHoaSuffixHtml(sao) {
        if (!sao.hoa) return '';
        const hcls = sao.hoa === 'Kỵ' ? 'hoa-ky' : (sao.hoa === 'Lộc' ? 'hoa-loc' : (sao.hoa === 'Quyền' ? 'hoa-quyen' : 'hoa-khoa'));
        const label = sao.hoa === 'Lộc' ? 'Đ' : sao.hoa === 'Quyền' ? 'B' : sao.hoa === 'Khoa' ? 'V' : 'Đ';
        return `<span class="hoa-marker ${hcls}">(${label})</span>`;
    }

    /**
     * Render sao với tooltip mô tả
     * @param {boolean} isTopRow - true nếu ô thuộc hàng trên cùng (tooltip hiện xuống dưới)
     */
    function renderStarWithTooltip(sao, cssClass, isTopRow) {
        const desc = (typeof STAR_DESCRIPTIONS !== 'undefined') ? STAR_DESCRIPTIONS[sao.name] : null;
        const starText = `${sao.name}${getHoaSuffixHtml(sao)}`;
        if (!desc) {
            return `<span class="${cssClass}">${starText}</span>`;
        }
        const tipCls = isTopRow ? 'star-tooltip tooltip-below' : 'star-tooltip';
        const tooltipContent = `<b>${sao.name}</b> — ${desc.nguHanh} | ${desc.loai}<br>${desc.moTa}`;
        return `<span class="star-tooltip-wrap"><span class="${cssClass}">${starText}</span><span class="${tipCls}">${tooltipContent}</span></span>`;
    }

    /**
     * Render tooltip cho tên cung
     */
    function renderCungTooltip(cungName, isTopRow) {
        const desc = (typeof CUNG_DESCRIPTIONS !== 'undefined') ? CUNG_DESCRIPTIONS[cungName] : null;
        if (!desc) {
            return `<span class="palace-name">${cungName}</span>`;
        }
        const tipCls = isTopRow ? 'star-tooltip tooltip-below' : 'star-tooltip';
        return `<span class="cung-tooltip-wrap"><span class="palace-name">${cungName}</span><span class="${tipCls}"><b>${cungName}</b><br>${desc}</span></span>`;
    }

    /**
     * Render tooltip cho Trường Sinh
     */
    function renderTruongSinhTooltip(truongSinh, isTopRow) {
        if (!truongSinh) return '';
        const desc = (typeof TRUONG_SINH_DESCRIPTIONS !== 'undefined') ? TRUONG_SINH_DESCRIPTIONS[truongSinh] : null;
        if (!desc) {
            return `<span class="palace-truongsinh">${truongSinh}</span>`;
        }
        const tipCls = isTopRow ? 'star-tooltip tooltip-below' : 'star-tooltip';
        return `<span class="cung-tooltip-wrap"><span class="palace-truongsinh">${truongSinh}</span><span class="${tipCls}"><b>${truongSinh}</b><br>${desc}</span></span>`;
    }

    /**
     * Render tooltip cho Tuần/Triệt
     */
    function renderTuanTrietTooltip(type, label, isTopRow) {
        const desc = (typeof TUAN_TRIET_DESCRIPTIONS !== 'undefined') ? TUAN_TRIET_DESCRIPTIONS[type] : null;
        const cls = type === 'Triệt' ? 'marker-triet' : 'marker-tuan';
        if (!desc) {
            return `<span class="${cls}">${label}</span>`;
        }
        const tipCls = isTopRow ? 'star-tooltip tooltip-below' : 'star-tooltip';
        return `<span class="cung-tooltip-wrap"><span class="${cls}">${label}</span><span class="${tipCls}">${desc}</span></span>`;
    }

    /**
     * Render một ô cung (palace cell) with explicit grid placement
     */
    function renderPalaceCell(chiIndex, lasoData) {
        const cungMap = lasoData.cungMap;
        const truongSinhMap = lasoData.truongSinhMap;
        const tuanTriet = lasoData.tuanTriet;
        const saoMap = lasoData.saoMap;
        const cungThanPos = lasoData.cungThanPos;

        const placement = GRID_PLACEMENT[chiIndex];
        const isTopRow = placement.row === 1;
        const cungName = cungMap[chiIndex] || '';
        const truongSinh = truongSinhMap[chiIndex] || '';
        const thangNum = THANG_MAP[chiIndex];
        const saoList = saoMap[chiIndex] || [];

        const isTuan = tuanTriet.tuan.includes(chiIndex);
        const isTriet = tuanTriet.triet.includes(chiIndex);
        const isThan = (chiIndex === cungThanPos);

        const chinhTinh = saoList.filter(s => s.type === 'chinh');
        const phuTinh = saoList.filter(s => s.type !== 'chinh' && s.type !== 'luu');

        const prefix = getDiaChiPrefix(lasoData.canChiNam.canIndex, chiIndex);

        let style = `grid-row: ${placement.row}; grid-column: ${placement.col};`;
        let html = `<div class="palace-cell" data-cung="${chiIndex}" data-palace="${cungName}" style="${style}">`;

        // Header
        html += `<div class="palace-header">`;
        html += `<span class="palace-dizhi">${prefix}</span>`;
        const thanLabel = isThan ? ' &lt;THÂN&gt;' : '';
        html += renderCungTooltip(cungName, isTopRow) + thanLabel;
        html += `<span class="palace-number"></span>`;
        html += `</div>`;

        // Main stars
        if (chinhTinh.length > 0) {
            html += `<div class="palace-main-stars">`;
            chinhTinh.forEach(s => {
                html += renderStarWithTooltip(s, 'star-main', isTopRow) + ' ';
            });
            html += `</div>`;
        }

        // Phụ tinh
        if (phuTinh.length > 0) {
            html += `<div class="palace-stars">`;
            for (let i = 0; i < phuTinh.length; i += 2) {
                html += `<div class="star-row">`;
                for (let j = i; j < Math.min(i + 2, phuTinh.length); j++) {
                    const s = phuTinh[j];
                    const cls = getSaoClass(s);
                    html += renderStarWithTooltip(s, `star-item ${cls}`, isTopRow);
                }
                html += `</div>`;
            }
            html += `</div>`;
        }

        // Footer
        html += `<div class="palace-footer">`;
        html += `<span>${CHI_NAMES[chiIndex]}</span>`;
        let markers = '';
        if (truongSinh) markers += renderTruongSinhTooltip(truongSinh, isTopRow);
        html += markers;

        let footerRight = `Tháng ${thangNum}`;
        if (isTuan) footerRight += ` ${renderTuanTrietTooltip('Tuần', 'Tuần', isTopRow)}`;
        if (isTriet) footerRight += ` ${renderTuanTrietTooltip('Triệt', 'Triệt', isTopRow)}`;
        html += `<span>${footerRight}</span>`;

        html += `</div>`;
        html += `</div>`;
        return html;
    }

    /**
     * Render ô trung tâm (center cell)
     */
    function renderCenterCell(lasoData, hoTen) {
        const ld = lasoData.lunarDate;
        const canChiNam = lasoData.canChiNam;
        const canChiThang = lasoData.canChiThang;
        const canChiNgay = lasoData.canChiNgay;
        const canChiGio = lasoData.canChiGio;
        const canChiNamXem = lasoData.canChiNamXem;

        const chuMenh = TuViSao.getChuMenh(lasoData.cungMenhPos);
        const chuThan = TuViSao.getChuThan(lasoData.cungThanPos);

        const gioLabel = CHI_NAMES[lasoData.input.gioSinh];

        // Center cell spans columns 2-3 and rows 2-3
        let html = `<div class="center-cell" style="grid-column: 2 / 4; grid-row: 2 / 4;">`;

        // Watermark trung tâm - 3 dòng lặp lại kéo dài
        const wmLong = "Webest.asia - Nguyễn Đức Toàn - Lập trình WEB, APP, AI  •  ".repeat(5);
        html += `<div class="center-content-watermark">
            <div class="wm-line">${wmLong}</div>
            <div class="wm-line">${wmLong}</div>
            <div class="wm-line">${wmLong}</div>
        </div>`;

        // Watermark Hán tự cũ (giữ lại hoặc thay thế)
        html += `<div class="center-watermark">紫微趣南</div>`;

        // Title
        html += `<div class="center-title">LÁ SỐ TỬ VI</div>`;

        // Info
        html += `<div class="center-info">`;
        html += `<div class="center-info-row"><span class="center-info-label">Họ tên:</span><span class="center-info-value">${hoTen}</span></div>`;
        html += `<div class="center-info-row"><span class="center-info-label">Năm:</span><span class="center-info-value">${lasoData.input.nam}</span><span class="center-info-canchi">${canChiNam.full}</span></div>`;
        html += `<div class="center-info-row"><span class="center-info-label">Tháng:</span><span class="center-info-value">${ld.month} (${lasoData.input.thang})</span><span class="center-info-canchi">${canChiThang.full}</span></div>`;
        html += `<div class="center-info-row"><span class="center-info-label">Ngày:</span><span class="center-info-value">${ld.day} (${lasoData.input.ngay})</span><span class="center-info-canchi">${canChiNgay.full}</span></div>`;
        html += `<div class="center-info-row"><span class="center-info-label">Giờ:</span><span class="center-info-value">${gioLabel}</span><span class="center-info-canchi">${canChiGio.full}</span></div>`;

        html += `<hr class="center-divider">`;

        html += `<div class="center-info-row"><span class="center-info-label">Năm xem:</span><span class="center-info-value">${lasoData.input.namXem}</span><span class="center-info-canchi">${canChiNamXem.full}</span></div>`;
        html += `<div class="center-info-row"><span class="center-info-label"></span><span class="center-info-value">${lasoData.tuoi} tuổi</span></div>`;

        html += `<hr class="center-divider">`;

        html += `<div class="center-menh-info">`;
        html += `<div>Âm Dương: <strong>${lasoData.amDuong}</strong></div>`;
        html += `<div>Mệnh: <strong class="center-highlight">${lasoData.menhNapAm}</strong></div>`;
        html += `<div>Cục: <strong>${lasoData.cucName}</strong></div>`;

        html += `<hr class="center-divider">`;

        html += `<div>Chủ Mệnh: <strong>${chuMenh}</strong></div>`;
        html += `<div>Chủ Thân: <strong>${chuThan}</strong></div>`;

        if (lasoData.amDuongNghichLy) {
            html += `<div class="center-highlight-bad">⚠ Âm Dương nghịch lý</div>`;
        }
        if (lasoData.cucKhacMenh) {
            html += `<div class="center-highlight-bad">⚠ Cục khắc Mệnh</div>`;
        }
        if (lasoData.thanMenhDongCung) {
            html += `<div class="center-highlight-bad">⚠ Thân Mệnh đồng cung</div>`;
        }

        html += `</div>`; // center-menh-info
        html += `</div>`; // center-info

        // SVG overlay cho soi cung
        html += `<svg class="soi-cung-svg" id="soiCungSvg"></svg>`;

        html += `</div>`; // center-cell

        return html;
    }

    /**
     * Render bảng Đại Vận & Tiểu Vận
     */
    function renderDaiVanTimeline(lasoData) {
        const daiVan = lasoData.daiVan;
        const daiVanHienTai = lasoData.daiVanHienTai;
        const tieuVan = lasoData.tieuVan;
        const cungMap = lasoData.cungMap;
        const saoMap = lasoData.saoMap;

        if (!daiVan || daiVan.length === 0) return '';

        let html = `<div class="dai-van-section">`;
        html += `<h3 class="dai-van-title">📅 Đại Vận & Tiểu Vận — Năm ${lasoData.input.namXem}</h3>`;

        // Tiểu Vận info banner
        if (tieuVan) {
            const tvCungName = cungMap[tieuVan.cungPos] || '';
            const tvChiName = CHI_NAMES[tieuVan.cungPos];
            const tvSao = (saoMap[tieuVan.cungPos] || []).filter(s => s.type === 'chinh').map(s => s.name).join(', ');
            html += `<div class="tieu-van-banner">`;
            html += `<div class="tieu-van-main">`;
            html += `<span class="tieu-van-label">🔄 Tiểu Vận:</span>`;
            html += `<span class="tieu-van-value">Cung <strong>${tvCungName}</strong> (${tvChiName}) — ${tieuVan.tuoi} tuổi</span>`;
            html += `</div>`;
            if (tvSao) html += `<div class="tieu-van-sao">Chính tinh: ${tvSao}</div>`;
            html += `</div>`;
        }

        // Lưu Tứ Hoá banner
        if (lasoData.luuTuHoa) {
            const lth = lasoData.luuTuHoa;
            html += `<div class="luu-tu-hoa-banner">`;
            html += `<span class="luu-hoa-label">✨ Lưu Tứ Hoá ${lasoData.input.namXem}:</span>`;
            html += `<span class="luu-hoa-items">`;
            html += `<span class="lh-loc">Lộc→${lth['Hoá Lộc']}</span>`;
            html += `<span class="lh-quyen">Quyền→${lth['Hoá Quyền']}</span>`;
            html += `<span class="lh-khoa">Khoa→${lth['Hoá Khoa']}</span>`;
            html += `<span class="lh-ky">Kỵ→${lth['Hoá Kỵ']}</span>`;
            html += `</span></div>`;
        }

        // Đại Vận Tứ Hóa banner (Giai đoạn 3)
        if (lasoData.daiVanTuHoa) {
            const dvth = lasoData.daiVanTuHoa;
            html += `<div class="luu-tu-hoa-banner" style="border-left: 3px solid #9b59b6;">`;
            html += `<span class="luu-hoa-label">⚖️ Đại Vận Tứ Hóa (Can ${dvth.canDaiVan}):</span>`;
            html += `<span class="luu-hoa-items">`;
            dvth.details.forEach(function (d) {
                var cls = d.hoaType === 'Kỵ' ? 'lh-ky' : (d.hoaType === 'Lộc' ? 'lh-loc' : (d.hoaType === 'Quyền' ? 'lh-quyen' : 'lh-khoa'));
                html += `<span class="${cls}">${d.hoaType}→${d.saoName}(${d.cungName})</span>`;
            });
            html += `</span></div>`;

            // Kỵ trùng phùng cảnh báo
            if (lasoData.kyTrungPhung) {
                html += `<div class="luu-tu-hoa-banner" style="border-left: 3px solid #e74c3c; background: #fff5f5;">`;
                html += `<span style="color: #e74c3c; font-weight: 600;">${lasoData.kyTrungPhung.description}</span>`;
                html += `</div>`;
            }
        }

        // Đại Vận grid
        html += `<div class="dai-van-grid">`;
        html += `<div class="dai-van-header-row">`;
        html += `<div class="dvh-cell">#</div>`;
        html += `<div class="dvh-cell">Tuổi</div>`;
        html += `<div class="dvh-cell">Năm</div>`;
        html += `<div class="dvh-cell">Cung</div>`;
        html += `<div class="dvh-cell dvh-sao">Chính Tinh</div>`;
        html += `</div>`;

        daiVan.forEach(dv => {
            const isActive = daiVanHienTai && dv.index === daiVanHienTai.index;
            const cungName = cungMap[dv.cungPos] || '';
            const chiName = CHI_NAMES[dv.cungPos];
            const saoList = (saoMap[dv.cungPos] || []).filter(s => s.type === 'chinh');
            const saoNames = saoList.map(s => {
                let n = s.name;
                if (s.hoa) n += `(${s.hoa})`;
                return n;
            }).join(', ');

            html += `<div class="dai-van-row ${isActive ? 'dai-van-active' : ''}">`;
            html += `<div class="dv-cell dv-index">${dv.index + 1}</div>`;
            html += `<div class="dv-cell dv-age">${dv.tuoiFrom}—${dv.tuoiTo}</div>`;
            html += `<div class="dv-cell dv-year">${dv.namFrom}—${dv.namTo}</div>`;
            html += `<div class="dv-cell dv-cung"><strong>${cungName}</strong><br><small>${chiName}</small></div>`;
            html += `<div class="dv-cell dv-sao">${saoNames || '<em>—</em>'}</div>`;
            if (isActive) html += `<div class="dv-badge">▶ Hiện tại</div>`;
            html += `</div>`;
        });

        html += `</div>`; // dai-van-grid
        html += `</div>`; // dai-van-section
        return html;
    }

    /**
     * Render toàn bộ lá số
     */
    function render(lasoData, hoTen) {
        let html = `<div class="chart-grid">`;

        // All 12 palace cells with explicit grid placement
        const chiOrder = [5, 6, 7, 8, 4, 9, 3, 10, 2, 1, 0, 11];
        chiOrder.forEach(chi => {
            html += renderPalaceCell(chi, lasoData);
        });

        // Center cell (spans col 2-3, row 2-3)
        html += renderCenterCell(lasoData, hoTen);

        html += `</div>`;

        return html;
    }

    /**
     * Render Tinh Hệ Mệnh (nếu có)
     */
    function renderTinhHe(lasoData) {
        if (!lasoData.tinhHeMenh || lasoData.tinhHeMenh.id === 'vcd') return '';

        const th = lasoData.tinhHeMenh;
        const cungMenhName = lasoData.cungMap[lasoData.cungMenhPos] || 'MỆNH';
        const profileText = (typeof TuViTinhHe !== 'undefined' && th.byPalace && th.byPalace[cungMenhName])
            ? th.byPalace[cungMenhName]
            : th.profile;

        let html = `<div class="tinh-he-section">`;
        html += `<h3 class="tinh-he-title">☄️ Tinh Hệ Mệnh: <strong>${th.name}</strong></h3>`;
        html += `<div class="tinh-he-archetype">${th.archetype}</div>`;
        html += `<div class="tinh-he-profile">${profileText}</div>`;

        if (th.strengths && th.strengths.length > 0) {
            html += `<div class="tinh-he-tags">`;
            html += `<span class="tinh-he-tag-label">Điểm mạnh:</span>`;
            th.strengths.forEach(function (s) {
                html += `<span class="tinh-he-tag tinh-he-tag-good">${s}</span>`;
            });
            if (th.weaknesses && th.weaknesses.length > 0) {
                html += `<span class="tinh-he-tag-label" style="margin-left: 12px;">Điểm yếu:</span>`;
                th.weaknesses.forEach(function (w) {
                    html += `<span class="tinh-he-tag tinh-he-tag-bad">${w}</span>`;
                });
            }
            html += `</div>`;
        }

        html += `</div>`;
        return html;
    }

    // =====================
    // SOI CUNG ĐỐI DIỆN & TAM HỢP
    // =====================

    // Nhóm Tam Hợp theo Địa Chi index
    const TAM_HOP = [
        [2, 6, 10],  // Dần-Ngọ-Tuất
        [8, 0, 4],   // Thân-Tý-Thìn
        [5, 9, 1],   // Tỵ-Dậu-Sửu
        [11, 3, 7]   // Hợi-Mão-Mùi
    ];

    function getDoiCung(chiIndex) {
        return (chiIndex + 6) % 12;
    }

    function getTamHop(chiIndex) {
        for (const group of TAM_HOP) {
            if (group.includes(chiIndex)) {
                return group.filter(c => c !== chiIndex);
            }
        }
        return [];
    }

    /**
     * Khởi tạo tính năng soi cung
     * Gọi sau khi chart đã render vào DOM
     */
    function initSoiCung() {
        const chartGrid = document.querySelector('.chart-grid');
        const svg = document.getElementById('soiCungSvg');
        if (!chartGrid || !svg) return;

        let activeCell = null;

        function drawLines(chiIndex) {
            svg.innerHTML = '';
            const centerCell = chartGrid.querySelector('.center-cell');
            if (!centerCell) return;

            const centerRect = centerCell.getBoundingClientRect();
            const cx = centerRect.width / 2;
            const cy = centerRect.height / 2;

            const doiCung = getDoiCung(chiIndex);
            const tamHop = getTamHop(chiIndex);

            // Vẽ lines tới 4 cung: active + đối cung (cam), 2 tam hợp (xanh)
            const targets = [
                { chi: chiIndex, color: '#FF6B4A' },
                { chi: doiCung, color: '#FF6B4A' },
                { chi: tamHop[0], color: '#38BDF8' },
                { chi: tamHop[1], color: '#38BDF8' }
            ];

            targets.forEach(t => {
                const targetCell = chartGrid.querySelector(`.palace-cell[data-cung="${t.chi}"]`);
                if (!targetCell) return;

                const targetRect = targetCell.getBoundingClientRect();
                // Toạ độ tâm target relative to center-cell
                const tx = (targetRect.left + targetRect.width / 2) - centerRect.left;
                const ty = (targetRect.top + targetRect.height / 2) - centerRect.top;

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', cx);
                line.setAttribute('y1', cy);
                line.setAttribute('x2', tx);
                line.setAttribute('y2', ty);
                line.setAttribute('stroke', t.color);
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-opacity', '0.85');
                line.setAttribute('stroke-linecap', 'round');
                svg.appendChild(line);
            });

            svg.style.opacity = '1';
        }

        function clearLines() {
            svg.innerHTML = '';
            svg.style.opacity = '0';
            if (activeCell) {
                activeCell.classList.remove('palace-active');
                // Clear related highlights
                chartGrid.querySelectorAll('.palace-highlight-doi, .palace-highlight-tam').forEach(el => {
                    el.classList.remove('palace-highlight-doi', 'palace-highlight-tam');
                });
                activeCell = null;
            }
        }

        function highlightCells(chiIndex) {
            const doiCung = getDoiCung(chiIndex);
            const tamHop = getTamHop(chiIndex);

            const doiCell = chartGrid.querySelector(`.palace-cell[data-cung="${doiCung}"]`);
            if (doiCell) doiCell.classList.add('palace-highlight-doi');

            tamHop.forEach(chi => {
                const cell = chartGrid.querySelector(`.palace-cell[data-cung="${chi}"]`);
                if (cell) cell.classList.add('palace-highlight-tam');
            });
        }

        // Event delegation
        chartGrid.addEventListener('mouseenter', function (e) {
            const cell = e.target.closest('.palace-cell');
            if (!cell) return;
            const chi = parseInt(cell.dataset.cung, 10);
            if (isNaN(chi)) return;

            clearLines();
            activeCell = cell;
            cell.classList.add('palace-active');
            highlightCells(chi);
            drawLines(chi);
        }, true);

        chartGrid.addEventListener('mouseleave', function (e) {
            const cell = e.target.closest('.palace-cell');
            if (!cell) return;
            // Check if we're leaving to another palace cell
            const related = e.relatedTarget ? e.relatedTarget.closest('.palace-cell') : null;
            if (!related) {
                clearLines();
            }
        }, true);

        // Mobile: tap toggle
        chartGrid.addEventListener('click', function (e) {
            if (window.matchMedia('(hover: none)').matches) {
                const cell = e.target.closest('.palace-cell');
                if (!cell) { clearLines(); return; }
                const chi = parseInt(cell.dataset.cung, 10);
                if (isNaN(chi)) return;

                if (activeCell === cell) {
                    clearLines();
                } else {
                    clearLines();
                    activeCell = cell;
                    cell.classList.add('palace-active');
                    highlightCells(chi);
                    drawLines(chi);
                }
            }
        });
    }

    return {
        render,
        renderDaiVanTimeline,
        renderTinhHe,
        initSoiCung
    };
})();
