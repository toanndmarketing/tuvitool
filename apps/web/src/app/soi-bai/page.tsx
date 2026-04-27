// @ts-nocheck
'use client';

import { useState } from 'react';
import HeaderNav from '@/components/HeaderNav';

export default function SoiBaiPage() {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('nam');
  const [topic, setTopic] = useState('soil');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  async function handleDraw() {
    setLoading(true);
    setResult(null);
    setFlippedCards([]);
    try {
      const res = await fetch('/api/soi-bai/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 9, name, gender, year, topic }),
      });
      if (!res.ok) throw new Error('Lỗi server');
      const data = await res.json();
      setResult(data);
      setLoading(false);
      // Staggered flip animation
      data.cards_drawn.forEach((_: any, i: number) => {
        setTimeout(() => setFlippedCards((prev) => [...prev, i]), (i + 1) * 300);
      });
    } catch {
      alert('Lỗi kết nối server');
      setLoading(false);
    }
  }

  function copyRaw() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getVerdictColor(verdict: string) {
    if (verdict.includes('Đại Cát') || verdict.includes('Cát')) return '#22c55e';
    if (verdict.includes('Hung') || verdict.includes('Bất lợi')) return '#ef4444';
    return '#fbbf24';
  }

  return (
    <>
      <HeaderNav />
      <div className="soibai-page">
        <div className="soibai-container">
          <header className="soibai-header">
            <h1>🃏 Soi Bài 52 Lá</h1>
            <p>Hệ chuyên gia Tâm Linh Digital — Soi Đất Cát & Mồ Mả</p>
          </header>

          {/* Form */}
          <div className="sb-card">
            <h2>👤 Thông Tin Người Xem</h2>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Họ và tên</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Nguyễn Văn A" />
              </div>
              <div className="form-group" style={{ minWidth: 90 }}>
                <label>Giới tính</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="nam">Nam</option>
                  <option value="nu">Nữ</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Năm sinh (Âm lịch)</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="VD: 1990" />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Vấn đề cần hỏi (Xác định Time-Lock)</label>
                <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                  <option value="soil">Soi Địa Tầng & Đất Cát (Khóa 1 Năm)</option>
                  <option value="grave">Soi Mồ Mả & Gia Tiên (Khóa 1 Năm)</option>
                  <option value="entity">Soi Vong Linh & Tà Khí (Khóa 1 Tháng)</option>
                  <option value="opportunity">Soi Cơ Hội Mua Bán (Khóa 1 Ngày)</option>
                </select>
              </div>
            </div>
          </div>

          <button className="btn-draw" onClick={handleDraw} disabled={loading}>
            {loading ? '⏳ Đang soi năng lượng...' : '✨ Gieo Quẻ Tâm Linh'}
          </button>
          <p className="draw-hint">Hệ thống sẽ bốc bộ 9 lá bài (Cửu Cung) tương ứng với thời vận của bạn.</p>

          {/* Cards */}
          {result && (
            <div className="cards-area">
              <div className="cards-grid">
                {result.cards_drawn.map((card: any, i: number) => {
                  const isFlipped = flippedCards.includes(i);
                  return (
                    <div key={i} className={`card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                      <div className="card-inner">
                        <div className="card-back">🃏</div>
                        <div className={`card-front ${card.color === 'red' ? 'red' : 'black'}`}>
                          <div className="card-rank-top">{card.rank}</div>
                          <div className="card-suit-top">{card.suitSymbol}</div>
                          <div className="card-mid">{card.suitSymbol}</div>
                          <div className="card-rank-bot">{card.rank}</div>
                          <div className="card-suit-bot">{card.suitSymbol}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results */}
          {result && flippedCards.length === result.cards_drawn.length && (
            <div className="results-area">
              {/* Actions */}
              <div className="results-actions">
                <button className="btn-raw" onClick={() => setShowRaw(true)}>📋 Xem Raw Data</button>
              </div>

              {/* Summary Grid */}
              <div className="summary-grid">
                <div className="summary-card">
                  <h3>Kết Quả Tổng Quan</h3>
                  <div className="verdict-badge" style={{ color: getVerdictColor(result.scan_summary.verdict) }}>
                    {result.scan_summary.verdict}
                  </div>
                  <div className="confidence">
                    <label>Độ tin cậy:</label>
                    <div className="progress-bg"><div className="progress-fill" style={{ width: `${result.scan_summary.confidence}%` }} /></div>
                  </div>
                </div>

                {result.compatibility && (
                  <div className="summary-card compat-card">
                    <h3>Hợp Mệnh Người Xem</h3>
                    <div className="verdict-badge" style={{ color: '#3b82f6' }}>{result.compatibility.result_type}</div>
                    <p className="compat-desc">
                      <strong>Người xem:</strong> {result.compatibility.person_name} ({result.compatibility.person_element})<br />
                      <strong>Năng lượng đất:</strong> {result.compatibility.land_dominant_element}
                    </p>
                    <p className="compat-text">{result.compatibility.description}</p>
                  </div>
                )}

                {result.authentication?.is_time_locked && (
                  <div className="summary-card auth-card">
                    <h3>🔒 Xác Thực Tâm Linh (Time-Lock)</h3>
                    <p><strong>Thời gian khóa quẻ:</strong> <span className="time-lock-val">{result.authentication.time_lock}</span></p>
                    <p className="auth-hint">{result.authentication.hint}</p>
                  </div>
                )}
              </div>

              {/* 4 Modes Grid */}
              <div className="modes-grid">
                {[
                  { key: 'physicalSoil', cls: 'physical' },
                  { key: 'ancestralGrave', cls: 'ancestral' },
                  { key: 'entityDetection', cls: 'entity' },
                  { key: 'riskOpportunity', cls: 'risk' },
                ].map(({ key, cls }) => {
                  const mode = result.detailed_analysis[key];
                  return (
                    <div key={key} className={`mode-panel ${cls}`}>
                      <div className="mode-icon">{mode.icon}</div>
                      <h3>{mode.title.split('(')[0].trim()}</h3>
                      <ul>{mode.results.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
                    </div>
                  );
                })}
              </div>

              {/* Combos */}
              {result.combos_detected.length > 0 && (
                <div className="combo-section">
                  <h3>⚠️ Dấu Hiệu Đặc Biệt</h3>
                  {result.combos_detected.map((c: any, i: number) => (
                    <div key={i} className="combo-item">
                      <span className="combo-name">{c.name} [{c.severity}]</span>
                      <p>{c.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Remedies */}
              <div className="remedy-section">
                <h3>💡 Gợi Ý Hóa Giải</h3>
                {result.remedy_suggestion.map((r: string, i: number) => (
                  <div key={i} className="remedy-item">✨ {r}</div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Data Modal */}
          {showRaw && result && (
            <div className="modal-overlay" onClick={() => setShowRaw(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>📋 Raw Data — Quẻ Bài 52 Lá</h3>
                  <div className="modal-actions">
                    <button onClick={copyRaw}>{copied ? '✅ Đã Copy' : '📋 Copy'}</button>
                    <button onClick={() => setShowRaw(false)}>✕</button>
                  </div>
                </div>
                <p className="modal-hint">Copy data → dán vào ChatGPT/Gemini để luận giải chuyên sâu</p>
                <textarea readOnly value={JSON.stringify(result, null, 2)} rows={15} />
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .soibai-page { min-height: 100vh; background: #050510; color: #e2e8f0; padding: 0 0 60px; }
          .soibai-container { max-width: 720px; margin: 0 auto; padding: 20px 16px; }
          .soibai-header { text-align: center; margin-bottom: 24px; }
          .soibai-header h1 {
            font-size: 1.6rem;
            background: linear-gradient(135deg, #8b5cf6, #c084fc);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 6px;
          }
          .soibai-header p { color: #64748b; font-size: 0.85rem; margin: 0; }

          .sb-card {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px; padding: 20px; margin-bottom: 20px;
          }
          .sb-card h2 { font-size: 1rem; color: #c084fc; margin: 0 0 14px; }
          .form-row { display: flex; gap: 12px; flex-wrap: wrap; }
          .form-group { flex: 1; margin-bottom: 12px; min-width: 0; }
          .form-group label { display: block; font-size: 0.78rem; color: #94a3b8; margin-bottom: 5px; }
          .form-group input, .form-group select {
            width: 100%; padding: 9px 12px;
            background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; color: #e2e8f0; font-size: 0.85rem; outline: none; box-sizing: border-box;
          }
          .form-group input:focus, .form-group select:focus { border-color: rgba(139,92,246,0.4); }

          .btn-draw {
            width: 100%; padding: 14px;
            background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff;
            font-weight: 700; font-size: 1rem; border: none; border-radius: 12px;
            cursor: pointer; transition: all 0.3s;
          }
          .btn-draw:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(139,92,246,0.3); }
          .btn-draw:disabled { opacity: 0.6; cursor: not-allowed; }
          .draw-hint { text-align: center; font-size: 0.75rem; color: #64748b; margin: 8px 0 0; }

          /* Cards */
          .cards-area { margin-top: 24px; }
          .cards-grid {
            display: grid; grid-template-columns: repeat(3, 1fr);
            gap: 12px; max-width: 400px; margin: 0 auto;
          }
          .card-wrapper {
            aspect-ratio: 2.5/3.5; perspective: 600px; cursor: pointer;
          }
          .card-inner {
            position: relative; width: 100%; height: 100%;
            transition: transform 0.6s; transform-style: preserve-3d;
          }
          .card-wrapper.flipped .card-inner { transform: rotateY(180deg); }
          .card-back, .card-front {
            position: absolute; inset: 0; backface-visibility: hidden;
            border-radius: 8px; display: flex; align-items: center; justify-content: center;
          }
          .card-back {
            background: linear-gradient(135deg, #1e3a5f, #0f172a);
            border: 2px solid rgba(255,255,255,0.1);
            font-size: 2rem;
          }
          .card-front {
            transform: rotateY(180deg);
            background: #fefefe; border: 2px solid #ccc;
            flex-direction: column; padding: 6px; position: relative;
          }
          .card-front.red { color: #dc2626; }
          .card-front.black { color: #1e293b; }
          .card-rank-top, .card-suit-top { position: absolute; top: 4px; left: 6px; font-size: 0.75rem; font-weight: 700; }
          .card-suit-top { top: 16px; }
          .card-mid { font-size: 1.8rem; }
          .card-rank-bot, .card-suit-bot { position: absolute; bottom: 4px; right: 6px; font-size: 0.75rem; font-weight: 700; transform: rotate(180deg); }
          .card-suit-bot { bottom: 16px; }

          /* Results */
          .results-area { margin-top: 24px; }
          .results-actions { display: flex; justify-content: flex-end; margin-bottom: 16px; }
          .btn-raw {
            padding: 8px 14px; background: #334155; color: #e2e8f0;
            border: none; border-radius: 8px; cursor: pointer; font-size: 0.8rem;
          }
          .btn-raw:hover { background: #475569; }

          .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
          @media (max-width: 600px) { .summary-grid { grid-template-columns: 1fr; } }
          .summary-card {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px; padding: 16px;
          }
          .summary-card h3 { font-size: 0.85rem; color: #94a3b8; margin: 0 0 10px; }
          .verdict-badge { font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; }
          .confidence label { font-size: 0.72rem; color: #64748b; }
          .progress-bg { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; margin-top: 4px; }
          .progress-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #34d399); border-radius: 3px; transition: width 0.5s; }
          .compat-card { border-color: rgba(59,130,246,0.3); }
          .compat-desc { font-size: 0.8rem; color: #cbd5e1; margin: 8px 0; line-height: 1.5; }
          .compat-text { font-size: 0.8rem; color: #94a3b8; background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 6px; }
          .auth-card {
            grid-column: 1 / -1;
            border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.03);
          }
          .auth-card h3 { color: #10b981; }
          .time-lock-val { color: #fbbf24; font-weight: 700; }
          .auth-hint { font-style: italic; color: #64748b; font-size: 0.8rem; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; margin-top: 8px; }

          .modes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
          @media (max-width: 600px) { .modes-grid { grid-template-columns: 1fr; } }
          .mode-panel {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px; padding: 16px;
          }
          .mode-panel.physical { border-left: 3px solid #22c55e; }
          .mode-panel.ancestral { border-left: 3px solid #8b5cf6; }
          .mode-panel.entity { border-left: 3px solid #f97316; }
          .mode-panel.risk { border-left: 3px solid #3b82f6; }
          .mode-icon { font-size: 1.5rem; margin-bottom: 6px; }
          .mode-panel h3 { font-size: 0.85rem; color: #e2e8f0; margin: 0 0 10px; }
          .mode-panel ul { list-style: none; padding: 0; margin: 0; }
          .mode-panel li { font-size: 0.8rem; color: #94a3b8; padding: 4px 0; line-height: 1.4; }

          .combo-section {
            background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2);
            border-radius: 12px; padding: 16px; margin-bottom: 20px;
          }
          .combo-section h3 { font-size: 0.9rem; color: #ef4444; margin: 0 0 12px; }
          .combo-item { margin-bottom: 10px; }
          .combo-name { font-weight: 700; color: #fbbf24; font-size: 0.85rem; }
          .combo-item p { font-size: 0.8rem; color: #94a3b8; margin: 4px 0 0; }

          .remedy-section {
            background: rgba(34,197,94,0.05); border: 1px solid rgba(34,197,94,0.2);
            border-radius: 12px; padding: 16px;
          }
          .remedy-section h3 { font-size: 0.9rem; color: #22c55e; margin: 0 0 12px; }
          .remedy-item { font-size: 0.82rem; color: #cbd5e1; padding: 6px 0; line-height: 1.5; }

          /* Modal */
          .modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.8);
            z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px;
          }
          .modal-content {
            background: #1e293b; border-radius: 12px; padding: 20px;
            max-width: 600px; width: 100%; max-height: 80vh; overflow: auto;
          }
          .modal-header { display: flex; justify-content: space-between; align-items: center; }
          .modal-header h3 { font-size: 0.95rem; color: #e2e8f0; margin: 0; }
          .modal-actions { display: flex; gap: 8px; }
          .modal-actions button {
            padding: 6px 12px; background: #334155; color: #e2e8f0;
            border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;
          }
          .modal-actions button:hover { background: #475569; }
          .modal-hint { font-size: 0.75rem; color: #64748b; margin: 8px 0; }
          .modal-content textarea {
            width: 100%; background: #0f172a; color: #10b981;
            font-family: monospace; font-size: 0.75rem;
            border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
            padding: 12px; resize: vertical; box-sizing: border-box;
          }
        `}</style>
      </div>
    </>
  );
}
