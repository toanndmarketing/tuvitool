/**
 * ============================================
 * SOI-BAI.JS - Interaction Logic
 * ============================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const btnDraw = document.getElementById('btnDraw');
    const cardsArea = document.getElementById('cardsArea');
    const resultsArea = document.getElementById('resultsArea');
    const deckContainer = document.getElementById('deckContainer');
    const verdictBadge = document.getElementById('verdictBadge');
    
    // Results panels
    const listPhysical = document.getElementById('listPhysical');
    const listAncestral = document.getElementById('listAncestral');
    const listEntity = document.getElementById('listEntity');
    const listRisk = document.getElementById('listRisk');
    const comboSection = document.getElementById('comboSection');
    const comboContainer = document.getElementById('comboContainer');
    const remedyList = document.getElementById('remedyList');

    // Rawdata Modal elements
    const btnRawdata = document.getElementById('btnRawdata');
    const rawdataModal = document.getElementById('rawdataModal');
    const rawdataTextarea = document.getElementById('rawdataTextarea');
    const rawdataCopyBtn = document.getElementById('rawdataCopyBtn');
    const rawdataCloseBtn = document.getElementById('rawdataCloseBtn');

    let currentRawData = null;

    btnDraw.addEventListener('click', async () => {
        const name = document.getElementById('personName').value;
        const gender = document.getElementById('personGender').value;
        const year = document.getElementById('personYear').value;
        const topic = document.getElementById('drawTopic').value;

        btnDraw.disabled = true;
        btnDraw.innerHTML = '✨ Đang soi năng lượng...';
        
        // Clear old results
        deckContainer.innerHTML = '';
        listPhysical.innerHTML = '';
        listAncestral.innerHTML = '';
        listEntity.innerHTML = '';
        listRisk.innerHTML = '';
        comboContainer.innerHTML = '';
        remedyList.innerHTML = '';
        comboSection.style.display = 'none';

        try {
            const response = await fetch('/api/soi-bai/draw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    count: 9, // Draw Cửu Cung
                    name,
                    gender,
                    year,
                    topic
                })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            currentRawData = data;

            // Display areas
            cardsArea.style.display = 'block';
            resultsArea.style.display = 'block';

            // 1. Render Cards (Grid 3x3)
            deckContainer.style.display = 'grid';
            deckContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(100px, 1fr))';
            if(window.innerWidth > 600) {
                 deckContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
                 deckContainer.style.maxWidth = '600px';
                 deckContainer.style.margin = '0 auto';
                 deckContainer.style.gap = '15px';
            }
            renderCards(data.cards_drawn);

            // 2. Render Analysis
            renderAnalysis(data);

            // Scroll to results
            window.scrollTo({ top: cardsArea.offsetTop - 50, behavior: 'smooth' });

        } catch (err) {
            alert('Lỗi khi kết nối server: ' + err.message);
        } finally {
            btnDraw.disabled = false;
            btnDraw.innerHTML = '<span class="icon">✨</span><span>Bốc Bài Soi Tiếp</span>';
        }
    });

    function renderCards(cards) {
        cards.forEach((card, index) => {
            const cardEl = createCardElement(card);
            deckContainer.appendChild(cardEl);
            
            // Staggered reveal
            setTimeout(() => {
                cardEl.classList.add('flipped');
            }, (index + 1) * 300);
        });
    }

    function createCardElement(card) {
        const wrapper = document.createElement('div');
        wrapper.className = `card-wrapper`;
        
        const colorClass = card.color === 'red' ? 'red' : 'black';
        
        wrapper.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front ${colorClass}" title="${card.rankLabel} ${card.suit}">
                <div class="card-rank-top">${card.rank}</div>
                <div class="card-suit-top">${card.suitSymbol}</div>
                <div class="card-mid-suit">${card.suitSymbol}</div>
                <div class="card-rank-bot">${card.rank}</div>
                <div class="card-suit-bot">${card.suitSymbol}</div>
            </div>
        `;
        return wrapper;
    }

    function renderAnalysis(data) {
        const { scan_summary, detailed_analysis, combos_detected, remedy_suggestion, compatibility, authentication } = data;

        // Verdict
        verdictBadge.textContent = scan_summary.verdict;
        document.getElementById('confidenceBar').style.width = `${scan_summary.confidence}%`;

        // Authentication Block
        if (authentication && authentication.is_time_locked) {
            const authContainer = document.getElementById('authContainer');
            if (authContainer) {
                authContainer.style.display = 'block';
                document.getElementById('authTimeLock').textContent = authentication.time_lock;
                document.getElementById('authHint').textContent = authentication.hint;
            }
        }

        // Compatibility
        if (compatibility) {
            document.getElementById('compBadge').textContent = compatibility.result_type;
            document.getElementById('compDescription').innerHTML = `
                <p><strong>Người xem:</strong> ${compatibility.person_name} (${compatibility.person_element})</p>
                <p><strong>Năng lượng đất:</strong> ${compatibility.land_dominant_element}</p>
                <p style="margin-top:10px; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px;">${compatibility.description}</p>
            `;
        }

        // Details
        detailed_analysis.physicalSoil.results.forEach(res => listPhysical.innerHTML += `<li>${res}</li>`);
        detailed_analysis.ancestralGrave.results.forEach(res => listAncestral.innerHTML += `<li>${res}</li>`);
        detailed_analysis.entityDetection.results.forEach(res => listEntity.innerHTML += `<li>${res}</li>`);
        detailed_analysis.riskOpportunity.results.forEach(res => listRisk.innerHTML += `<li>${res}</li>`);

        // Combos
        if (combos_detected.length > 0) {
            comboSection.style.display = 'block';
            combos_detected.forEach(combo => {
                comboContainer.innerHTML += `
                    <div class="combo-item">
                        <span class="combo-name">${combo.name} [${combo.severity}]</span>
                        <p class="combo-desc">${combo.description}</p>
                    </div>
                `;
            });
        }

        // Remedies
        remedy_suggestion.forEach(rem => {
            remedyList.innerHTML += `<div class="remedy-item">✨ ${rem}</div>`;
        });
    }

    // Modal Events
    btnRawdata.addEventListener('click', () => {
        if (!currentRawData) return alert('Vui lòng bốc bài trước!');
        rawdataTextarea.value = JSON.stringify(currentRawData, null, 2);
        rawdataModal.style.display = 'flex';
    });

    rawdataCloseBtn.addEventListener('click', () => {
        rawdataModal.style.display = 'none';
    });

    rawdataCopyBtn.addEventListener('click', () => {
        rawdataTextarea.select();
        document.execCommand('copy');
        rawdataCopyBtn.textContent = '✅ Đã Copy';
        setTimeout(() => {
            rawdataCopyBtn.textContent = '📋 Copy';
        }, 2000);
    });

    window.addEventListener('click', (e) => {
        if (e.target === rawdataModal) {
            rawdataModal.style.display = 'none';
        }
    });
});
