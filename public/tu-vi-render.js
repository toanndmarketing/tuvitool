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
     * Render một ô cung (palace cell) with explicit grid placement
     */
    function renderPalaceCell(chiIndex, lasoData) {
        const cungMap = lasoData.cungMap;
        const truongSinhMap = lasoData.truongSinhMap;
        const tuanTriet = lasoData.tuanTriet;
        const saoMap = lasoData.saoMap;
        const cungThanPos = lasoData.cungThanPos;

        const placement = GRID_PLACEMENT[chiIndex];
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
        html += `<span class="palace-name">${cungName}${isThan ? ' &lt;THÂN&gt;' : ''}</span>`;
        html += `<span class="palace-number"></span>`;
        html += `</div>`;

        // Main stars
        if (chinhTinh.length > 0) {
            html += `<div class="palace-main-stars">`;
            chinhTinh.forEach(s => {
                html += `<span class="star-main">${s.name}${getHoaSuffixHtml(s)}</span> `;
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
                    html += `<span class="star-item ${cls}">${s.name}${getHoaSuffixHtml(s)}</span>`;
                }
                html += `</div>`;
            }
            html += `</div>`;
        }

        // Footer
        html += `<div class="palace-footer">`;
        html += `<span>${CHI_NAMES[chiIndex]}</span>`;
        let markers = '';
        if (truongSinh) markers += `<span class="palace-truongsinh">${truongSinh}</span>`;
        html += markers;

        let footerRight = `Tháng ${thangNum}`;
        if (isTuan) footerRight += ` <span class="marker-tuan">Tuần</span>`;
        if (isTriet) footerRight += ` <span class="marker-triet">Triệt</span>`;
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

    return {
        render,
        renderDaiVanTimeline,
        renderTinhHe
    };
})();
