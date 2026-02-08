/**
 * ============================================
 * THẦN SỐ HỌC - RENDER UI
 * Hiển thị kết quả luận giải Thần Số Học
 * ============================================
 */

const ThanSoHocRender = (function () {
    'use strict';

    /**
     * Render toàn bộ kết quả Thần Số Học
     */
    function render(result) {
        const data = ThanSoHocData;

        let html = '';

        // 0. Thông tin cá nhân & Giới thiệu
        html += renderIntroHeader(result);

        // 1. Tổng quan - Số Chủ Đạo (Life Path)
        html += renderLifePath(result, data);

        // 2. Biểu đồ ngày sinh 3x3 + Mũi tên
        html += renderBirthChart(result, data);

        // 3. Các chỉ số từ Tên
        html += renderNameNumbers(result, data);

        // 4. Năm Cá Nhân
        html += renderPersonalYear(result, data);

        // 5. Chu kỳ Đỉnh Cao & Thách Thức
        html += renderCycles(result, data);

        // 6. Số thiếu & Số mạnh
        html += renderMissingDominant(result, data);

        // 7. Name Breakdown
        html += renderNameBreakdown(result);

        return html;
    }

    // =====================
    // 0. THÔNG TIN CÁ NHÂN & GIỚI THIỆU
    // =====================
    function renderIntroHeader(result) {
        return `
        <div class="tsh-card tsh-intro-card" style="--index:0">
            <div class="tsh-section-header">
                <span class="tsh-section-icon">👤</span>
                <h3 class="tsh-section-title">Luận Giải Thần Số Học Pythagoras</h3>
            </div>
            <div class="tsh-intro-body">
                <div class="tsh-card-watermark">
                    <div class="wm-line">${"Webest.asia - Nguyễn Đức Toàn - Lập trình WEB, APP, AI  •  ".repeat(5)}</div>
                    <div class="wm-line">${"Webest.asia - Nguyễn Đức Toàn - Lập trình WEB, APP, AI  •  ".repeat(5)}</div>
                    <div class="wm-line">${"Webest.asia - Nguyễn Đức Toàn - Lập trình WEB, APP, AI  •  ".repeat(5)}</div>
                </div>
                <div class="tsh-user-meta">
                    <div class="tsh-meta-item">
                        <span class="tsh-meta-label">Họ và tên:</span>
                        <span class="tsh-meta-value">${result.fullName}</span>
                    </div>
                    <div class="tsh-meta-item">
                        <span class="tsh-meta-label">Ngày sinh:</span>
                        <span class="tsh-meta-value">${result.day}/${result.month}/${result.year} (Dương lịch)</span>
                    </div>
                </div>
                <div class="tsh-welcome-text">
                    <p>Thần Số Học là bộ môn khoa học về các con số giúp chúng ta thấu hiểu bản thân thông qua tần số rung động của họ tên và ngày sinh. Bản báo cáo chuyên sâu này sẽ giúp bạn khám phá <strong>sứ mệnh, tiềm năng và các giai đoạn quan trọng</strong> trong cuộc đời mình.</p>
                </div>
            </div>
        </div>`;
    }

    // =====================
    // 1. SỐ CHỦ ĐẠO
    // =====================
    function renderLifePath(result, data) {
        const lp = data.LIFE_PATH[result.lifePath] || data.LIFE_PATH[reduceForLookup(result.lifePath)];
        if (!lp) return '';

        const bdData = data.BIRTH_DAY[result.birthDay] || data.BIRTH_DAY[reduceForLookup(result.birthDay)] || '';
        const attData = data.ATTITUDE[result.attitude] || '';

        return `
        <div class="tsh-card tsh-card-hero" style="--index:1">
            <div class="tsh-hero-number">
                <div class="tsh-number-circle tsh-number-large">${result.lifePath}</div>
                <div class="tsh-hero-info">
                    <h3 class="tsh-hero-title">${lp.title}</h3>
                    <div class="tsh-keywords">
                        ${lp.keywords.map(k => `<span class="tsh-keyword">${k}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="tsh-hero-body">
                <div class="tsh-detail-grid">
                    <div class="tsh-detail-item">
                        <div class="tsh-detail-icon">💎</div>
                        <div class="tsh-detail-label">Điểm mạnh</div>
                        <div class="tsh-detail-text">${lp.strengths}</div>
                    </div>
                    <div class="tsh-detail-item">
                        <div class="tsh-detail-icon">⚠️</div>
                        <div class="tsh-detail-label">Cần cải thiện</div>
                        <div class="tsh-detail-text">${lp.weaknesses}</div>
                    </div>
                    <div class="tsh-detail-item">
                        <div class="tsh-detail-icon">💼</div>
                        <div class="tsh-detail-label">Sự nghiệp phù hợp</div>
                        <div class="tsh-detail-text">${lp.career}</div>
                    </div>
                    <div class="tsh-detail-item">
                        <div class="tsh-detail-icon">❤️</div>
                        <div class="tsh-detail-label">Tình yêu</div>
                        <div class="tsh-detail-text">${lp.love}</div>
                    </div>
                    <div class="tsh-detail-item tsh-detail-full">
                        <div class="tsh-detail-icon">🎯</div>
                        <div class="tsh-detail-label">Sứ mệnh cuộc đời</div>
                        <div class="tsh-detail-text tsh-mission">${lp.mission}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="tsh-mini-cards" style="--index:1">
            <div class="tsh-mini-card">
                <div class="tsh-number-circle tsh-number-small">${result.birthDay}</div>
                <div class="tsh-mini-title">Số Ngày Sinh</div>
                <div class="tsh-mini-desc">${bdData}</div>
            </div>
            <div class="tsh-mini-card">
                <div class="tsh-number-circle tsh-number-small">${result.attitude}</div>
                <div class="tsh-mini-title">Số Thái Độ</div>
                <div class="tsh-mini-desc">${attData}</div>
            </div>
        </div>`;
    }

    // =====================
    // 2. BIỂU ĐỒ NGÀY SINH 3x3
    // =====================
    function renderBirthChart(result, data) {
        const chart = result.birthChart;

        // Layout: 3-6-9 / 2-5-8 / 1-4-7
        const gridOrder = [
            [3, 6, 9],
            [2, 5, 8],
            [1, 4, 7]
        ];

        // Labels
        const planeLabels = ['Trí tuệ', 'Cảm xúc', 'Thể chất'];

        let chartHtml = `
        <div class="tsh-card" style="--index:2">
            <div class="tsh-section-header">
                <span class="tsh-section-icon">📊</span>
                <h3 class="tsh-section-title">Biểu Đồ Ngày Sinh</h3>
            </div>
            <p class="tsh-section-desc">Phân tích tính cách dựa trên ngày sinh dương lịch: <strong>${result.day}/${result.month}/${result.year}</strong></p>
            
            <div class="tsh-chart-container">
                <div class="tsh-chart-grid">`;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const num = gridOrder[row][col];
                const count = chart[num];
                const isEmpty = count === 0;
                const isStrong = count >= 2;

                chartHtml += `
                    <div class="tsh-chart-cell ${isEmpty ? 'tsh-cell-empty' : ''} ${isStrong ? 'tsh-cell-strong' : ''}">
                        <div class="tsh-cell-number">${num}</div>
                        <div class="tsh-cell-dots">
                            ${count > 0 ? '●'.repeat(Math.min(count, 4)) : '○'}
                        </div>
                        <div class="tsh-cell-count">${count > 0 ? `×${count}` : 'Thiếu'}</div>
                    </div>`;
            }
            chartHtml += `<div class="tsh-plane-label">${planeLabels[row]}</div>`;
        }

        chartHtml += `</div>`;

        // Mũi tên
        if (result.arrows.length > 0) {
            chartHtml += `
                <div class="tsh-arrows">
                    <h4 class="tsh-arrows-title">Mũi Tên Cá Tính</h4>
                    <div class="tsh-arrows-list">`;

            for (const arrow of result.arrows) {
                const arrowData = data.ARROWS[arrow.name] || {};
                const icon = arrowData.icon || (arrow.isStrength ? '✅' : '⭕');

                chartHtml += `
                    <div class="tsh-arrow-item ${arrow.isStrength ? 'tsh-arrow-strength' : 'tsh-arrow-weakness'}">
                        <div class="tsh-arrow-icon">${icon}</div>
                        <div class="tsh-arrow-content">
                            <div class="tsh-arrow-name">${arrow.name} (${arrow.nums.join('-')})</div>
                            <div class="tsh-arrow-desc">${arrowData.desc || ''}</div>
                        </div>
                    </div>`;
            }

            chartHtml += `</div></div>`;
        }

        chartHtml += `</div></div>`;
        return chartHtml;
    }

    // =====================
    // 3. CÁC CHỈ SỐ TỪ TÊN
    // =====================
    function renderNameNumbers(result, data) {
        const soulData = data.SOUL_URGE[result.soulUrge] || data.SOUL_URGE[reduceForLookup(result.soulUrge)] || '';
        const persData = data.PERSONALITY[result.personality] || data.PERSONALITY[reduceForLookup(result.personality)] || '';
        const exprData = data.EXPRESSION[result.expression] || data.EXPRESSION[reduceForLookup(result.expression)] || '';

        // Maturity
        const matNum = result.maturity;
        const matLookup = reduceForLookup(matNum);
        const matData = data.LIFE_PATH[matNum] || data.LIFE_PATH[matLookup];
        const matDesc = matData ? `Khi trưởng thành, bạn sẽ phát triển theo hướng của "${matData.title}". ${matData.mission}` : '';

        return `
        <div class="tsh-card" style="--index:3">
            <div class="tsh-section-header">
                <span class="tsh-section-icon">✍️</span>
                <h3 class="tsh-section-title">Phân Tích Từ Họ Tên</h3>
            </div>
            <p class="tsh-section-desc">Họ tên phân tích: <strong>${result.fullName}</strong></p>
            
            <div class="tsh-name-numbers">
                <div class="tsh-name-card">
                    <div class="tsh-name-header">
                        <div class="tsh-number-circle tsh-number-small tsh-color-soul">${result.soulUrge}</div>
                        <div>
                            <div class="tsh-name-title">Số Linh Hồn</div>
                            <div class="tsh-name-subtitle">Khát vọng nội tâm (nguyên âm trong tên)</div>
                        </div>
                    </div>
                    <div class="tsh-name-desc">${soulData}</div>
                </div>
                
                <div class="tsh-name-card">
                    <div class="tsh-name-header">
                        <div class="tsh-number-circle tsh-number-small tsh-color-personality">${result.personality}</div>
                        <div>
                            <div class="tsh-name-title">Số Nhân Cách</div>
                            <div class="tsh-name-subtitle">Hình ảnh bên ngoài (phụ âm trong tên)</div>
                        </div>
                    </div>
                    <div class="tsh-name-desc">${persData}</div>
                </div>
                
                <div class="tsh-name-card">
                    <div class="tsh-name-header">
                        <div class="tsh-number-circle tsh-number-small tsh-color-expression">${result.expression}</div>
                        <div>
                            <div class="tsh-name-title">Số Sứ Mệnh</div>
                            <div class="tsh-name-subtitle">Tài năng & tiềm năng (tất cả chữ cái)</div>
                        </div>
                    </div>
                    <div class="tsh-name-desc">${exprData}</div>
                </div>
                
                <div class="tsh-name-card">
                    <div class="tsh-name-header">
                        <div class="tsh-number-circle tsh-number-small tsh-color-maturity">${result.maturity}</div>
                        <div>
                            <div class="tsh-name-title">Số Trưởng Thành</div>
                            <div class="tsh-name-subtitle">Hướng phát triển khi trưởng thành</div>
                        </div>
                    </div>
                    <div class="tsh-name-desc">${matDesc}</div>
                </div>
            </div>
        </div>`;
    }

    // =====================
    // 4. NĂM CÁ NHÂN - TIMELINE 11 NĂM
    // =====================
    function renderPersonalYear(result, data) {
        const pyData = data.PERSONAL_YEAR[result.personalYear] || data.PERSONAL_YEAR[reduceForLookup(result.personalYear)];
        if (!pyData) return '';

        // Timeline 11 năm
        let timelineHtml = '';
        if (result.personalYearTimeline && result.personalYearTimeline.length > 0) {
            timelineHtml = `
                <div class="tsh-timeline">
                    <h4 class="tsh-sub-title">📈 Vòng quay 11 năm cá nhân (${result.personalYearTimeline[0].year} - ${result.personalYearTimeline[result.personalYearTimeline.length - 1].year})</h4>
                    <div class="tsh-timeline-grid">`;

            for (const item of result.personalYearTimeline) {
                const itemData = data.PERSONAL_YEAR[item.number] || data.PERSONAL_YEAR[reduceForLookup(item.number)];
                const itemTitle = itemData ? itemData.title : `Năm số ${item.number}`;
                const itemDesc = itemData ? itemData.desc : '';
                const isCurrentClass = item.isCurrent ? 'tsh-timeline-current' : '';
                const isPast = item.year < result.currentYear;
                const timeClass = isPast ? 'tsh-timeline-past' : (item.isCurrent ? '' : 'tsh-timeline-future');

                timelineHtml += `
                        <div class="tsh-timeline-item ${isCurrentClass} ${timeClass}">
                            <div class="tsh-timeline-year-header">
                                <span class="tsh-timeline-year">${item.year}</span>
                                <div class="tsh-number-circle tsh-number-tiny ${item.isCurrent ? 'tsh-color-year' : ''}">${item.number}</div>
                            </div>
                            <div class="tsh-timeline-title">${itemTitle}</div>
                            <div class="tsh-timeline-desc">${itemDesc}</div>
                            ${item.isCurrent ? '<div class="tsh-timeline-badge">👉 Hiện tại</div>' : ''}
                        </div>`;
            }

            timelineHtml += `</div></div>`;
        }

        return `
        <div class="tsh-card" style="--index:4">
            <div class="tsh-section-header">
                <span class="tsh-section-icon">📅</span>
                <h3 class="tsh-section-title">Năm Cá Nhân ${result.currentYear}</h3>
            </div>
            <div class="tsh-year-card">
                <div class="tsh-number-circle tsh-number-medium tsh-color-year">${result.personalYear}</div>
                <div class="tsh-year-info">
                    <h4 class="tsh-year-title">${pyData.title}</h4>
                    <p class="tsh-year-desc">${pyData.desc}</p>
                    <div class="tsh-year-meta">
                        <span>🎂 Tuổi: <strong>${result.currentAge}</strong></span>
                        <span>📆 Năm xem: <strong>${result.currentYear}</strong></span>
                    </div>
                </div>
            </div>
            ${timelineHtml}
        </div>`;
    }

    // =====================
    // 5. CHU KỲ ĐỈNH CAO & THÁCH THỨC
    // =====================
    function renderCycles(result, data) {
        let html = `
        <div class="tsh-card" style="--index:5">
            <div class="tsh-section-header">
                <span class="tsh-section-icon">⛰️</span>
                <h3 class="tsh-section-title">Chu Kỳ Đỉnh Cao & Thách Thức</h3>
            </div>
            <p class="tsh-section-desc">Tuổi hiện tại: <strong>${result.currentAge} tuổi</strong> (Năm <strong>${result.currentYear}</strong>)</p>
            
            <div class="tsh-cycles-wrapper">
                <div class="tsh-cycles-section">
                    <h4 class="tsh-cycles-title">🏔️ 4 Đỉnh Cao Cuộc Đời</h4>
                    <div class="tsh-pinnacles">`;

        for (let i = 0; i < result.pinnacles.length; i++) {
            const p = result.pinnacles[i];
            const isCurrent = p === result.currentPinnacle;
            const pinnacleDesc = data.PINNACLES[p.number] || data.PINNACLES[reduceForLookup(p.number)] || '';

            // Hiển thị tuổi + năm cụ thể
            let periodText;
            if (p.endAge === null) {
                periodText = `Từ ${p.startAge} tuổi trở đi (${p.startYear}+)`;
            } else {
                periodText = `${p.startAge} - ${p.endAge} tuổi (${p.startYear} - ${p.endYear})`;
            }

            html += `
                <div class="tsh-pinnacle-item ${isCurrent ? 'tsh-pinnacle-current' : ''}">
                    <div class="tsh-pinnacle-header">
                        <div class="tsh-number-circle tsh-number-tiny">${p.number}</div>
                        <div>
                            <div class="tsh-pinnacle-label">Đỉnh cao ${i + 1}${isCurrent ? ' 👉 (hiện tại)' : ''}</div>
                            <div class="tsh-pinnacle-period">${periodText}</div>
                        </div>
                    </div>
                    <div class="tsh-pinnacle-desc">${pinnacleDesc}</div>
                </div>`;
        }

        html += `</div></div>
                <div class="tsh-cycles-section">
                    <h4 class="tsh-cycles-title">⚡ Chỉ Số Thách Thức</h4>
                    <div class="tsh-challenges">`;

        for (let i = 0; i < result.challenges.length; i++) {
            const c = result.challenges[i];
            const cDesc = data.CHALLENGES[c.number] !== undefined ? data.CHALLENGES[c.number] : `Thách thức số ${c.number}`;
            // Liên kết thách thức với đỉnh cao tương ứng
            let periodLabel = '';
            if (i < result.pinnacles.length) {
                const p = result.pinnacles[i];
                if (p.endAge === null) {
                    periodLabel = `(Từ ${p.startAge} tuổi+)`;
                } else {
                    periodLabel = `(${p.startAge} - ${p.endAge} tuổi)`;
                }
            }
            html += `
                <div class="tsh-challenge-item">
                    <div class="tsh-number-circle tsh-number-tiny tsh-color-challenge">${c.number}</div>
                    <div>
                        <div class="tsh-challenge-label">${c.label} <span class="tsh-challenge-period">${periodLabel}</span></div>
                        <div class="tsh-challenge-desc">${cDesc}</div>
                    </div>
                </div>`;
        }

        html += `</div></div>`;

        // Chỉ số Cầu nối
        if (result.bridgeNumbers && result.bridgeNumbers.length > 0) {
            html += `
                <div class="tsh-cycles-section">
                    <h4 class="tsh-cycles-title">🌉 Chỉ Số Cầu Nối</h4>
                    <div class="tsh-bridges">`;

            for (const b of result.bridgeNumbers) {
                const bridgeDesc = getBridgeDescription(b.number);
                html += `
                    <div class="tsh-bridge-item">
                        <div class="tsh-number-circle tsh-number-tiny tsh-color-bridge">${b.number}</div>
                        <div>
                            <div class="tsh-bridge-label">${b.label}</div>
                            <div class="tsh-bridge-desc">${bridgeDesc}</div>
                        </div>
                    </div>`;
            }

            html += `</div></div>`;
        }

        html += `</div></div>`;
        return html;
    }

    // =====================
    // 6. SỐ THIẾU & SỐ MẠNH
    // =====================
    function renderMissingDominant(result, data) {
        let html = `
        <div class="tsh-card" style="--index:6">
            <div class="tsh-section-header">
                <span class="tsh-section-icon">🔢</span>
                <h3 class="tsh-section-title">Phân Tích Số Thiếu & Số Mạnh</h3>
            </div>`;

        // Số thiếu
        if (result.missingNumbers.length > 0) {
            html += `
            <div class="tsh-missing-section">
                <h4 class="tsh-sub-title">❌ Số Thiếu (cần bổ sung)</h4>
                <div class="tsh-missing-list">`;

            for (const num of result.missingNumbers) {
                const desc = data.MISSING_NUMBERS[num] || '';
                html += `
                    <div class="tsh-missing-item">
                        <div class="tsh-number-circle tsh-number-tiny tsh-color-missing">${num}</div>
                        <div class="tsh-missing-desc">${desc}</div>
                    </div>`;
            }

            html += `</div></div>`;
        }

        // Số mạnh (lặp nhiều lần)
        if (result.dominantNumbers.length > 0) {
            html += `
            <div class="tsh-dominant-section">
                <h4 class="tsh-sub-title">⭐ Số Mạnh (xuất hiện nhiều lần)</h4>
                <div class="tsh-dominant-list">`;

            for (const d of result.dominantNumbers) {
                const domData = data.DOMINANT_NUMBERS[d.num];
                const countKey = Math.min(d.count, 4);
                const desc = domData ? (domData[countKey] || domData[Math.min(countKey, 4)] || '') : '';

                html += `
                    <div class="tsh-dominant-item">
                        <div class="tsh-dominant-header">
                            <div class="tsh-number-circle tsh-number-tiny tsh-color-dominant">${d.num}</div>
                            <span class="tsh-dominant-count">Xuất hiện ${d.count} lần</span>
                        </div>
                        <div class="tsh-dominant-desc">${desc}</div>
                    </div>`;
            }

            html += `</div></div>`;
        }

        html += `</div>`;
        return html;
    }

    // =====================
    // 7. NAME BREAKDOWN
    // =====================
    function renderNameBreakdown(result) {
        if (!result.nameBreakdown || result.nameBreakdown.length === 0) return '';

        const vowelLetters = result.nameBreakdown.filter(l => l.isVowel);
        const consonantLetters = result.nameBreakdown.filter(l => !l.isVowel);

        return `
        <div class="tsh-card" style="--index:7">
            <div class="tsh-section-header">
                <span class="tsh-section-icon">🔤</span>
                <h3 class="tsh-section-title">Chi Tiết Quy Đổi Tên</h3>
            </div>
            <div class="tsh-breakdown">
                <div class="tsh-breakdown-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Bảng Pythagoras</th>
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<th>${n}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Hàng 1</td>
                                <td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td>I</td>
                            </tr>
                            <tr>
                                <td>Hàng 2</td>
                                <td>J</td><td>K</td><td>L</td><td>M</td><td>N</td><td>O</td><td>P</td><td>Q</td><td>R</td>
                            </tr>
                            <tr>
                                <td>Hàng 3</td>
                                <td>S</td><td>T</td><td>U</td><td>V</td><td>W</td><td>X</td><td>Y</td><td>Z</td><td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="tsh-letter-flow">
                    <div class="tsh-letter-row">
                        <span class="tsh-letter-label">Tên (bỏ dấu):</span>
                        ${result.nameBreakdown.map(l => `
                            <span class="tsh-letter ${l.isVowel ? 'tsh-letter-vowel' : 'tsh-letter-consonant'}"
                                  title="${l.isVowel ? 'Nguyên âm' : 'Phụ âm'}: ${l.original.toUpperCase()} = ${l.value}">
                                ${l.original.toUpperCase()}<sub>${l.value}</sub>
                            </span>`).join('')}
                    </div>
                    <div class="tsh-letter-summary">
                        <div class="tsh-sum-item">
                            <span class="tsh-sum-label">Nguyên âm (Linh hồn):</span>
                            <span class="tsh-sum-calc">${vowelLetters.map(l => l.value).join(' + ')} = <strong>${result.soulUrge}</strong></span>
                        </div>
                        <div class="tsh-sum-item">
                            <span class="tsh-sum-label">Phụ âm (Nhân cách):</span>
                            <span class="tsh-sum-calc">${consonantLetters.map(l => l.value).join(' + ')} = <strong>${result.personality}</strong></span>
                        </div>
                        <div class="tsh-sum-item">
                            <span class="tsh-sum-label">Tất cả (Sứ mệnh):</span>
                            <span class="tsh-sum-calc">${result.nameBreakdown.map(l => l.value).join(' + ')} = <strong>${result.expression}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Luận giải Chỉ số Cầu nối
     */
    function getBridgeDescription(num) {
        const descs = {
            0: 'Số cầu nối 0: Hai chỉ số này hoàn toàn hòa hợp, không cần điều chỉnh. Đây là một lợi thế lớn!',
            1: 'Số cầu nối 1: Cần phát triển sự tự tin và độc lập hơn để kết nối hai khía cạnh này.',
            2: 'Số cầu nối 2: Cần kiên nhẫn, hợp tác và lắng nghe nhiều hơn để cân bằng.',
            3: 'Số cầu nối 3: Cần biểu đạt bản thân tốt hơn, sáng tạo và giao tiếp hiệu quả hơn.',
            4: 'Số cầu nối 4: Cần kỷ luật, tổ chức và làm việc chăm chỉ để thu hẹp khoảng cách.',
            5: 'Số cầu nối 5: Cần linh hoạt, chấp nhận thay đổi và khám phá để phát triển.',
            6: 'Số cầu nối 6: Cần trách nhiệm, tình yêu và sự chăm sóc nhiều hơn.',
            7: 'Số cầu nối 7: Cần chiêm nghiệm, phân tích và phát triển nội tâm.',
            8: 'Số cầu nối 8: Cần phát triển khả năng quản lý và tầm nhìn chiến lược.'
        };
        return descs[num] || `Số cầu nối ${num}: Cần nỗ lực để hài hòa hai khía cạnh cuộc sống.`;
    }

    /**
     * Rút gọn số để lookup trong data (master → single digit)
     */
    function reduceForLookup(num) {
        while (num > 9) {
            num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
        }
        return num;
    }

    // Public API
    return {
        render
    };

})();
