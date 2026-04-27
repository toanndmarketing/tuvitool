// @ts-nocheck
'use client';

import { useState } from 'react';
import HeaderNav from '@/components/HeaderNav';

interface CastResult {
  hexagramId: number;
  name: string;
  unicode: string;
  description: string;
  lines: number[];
  changingLines: number[];
}

export default function KinhDichPage() {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('Nam');
  const [question, setQuestion] = useState('');
  const [method, setMethod] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CastResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCast() {
    if (!question.trim()) {
      alert('Vui lòng nhập sự việc/vấn đề cần hỏi trước khi gieo quẻ!');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/iching/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'coin', throws: method }),
      });
      if (!res.ok) throw new Error('Lỗi server');
      const data = await res.json();
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1200);
    } catch {
      alert('Lỗi kết nối server');
      setLoading(false);
    }
  }

  function getRawData() {
    if (!result) return '';
    return JSON.stringify({
      'Thông tin người hỏi': `${name || 'Ẩn danh'}, ${gender}, sinh năm DL ${year || '[Không có]'}`,
      'Câu hỏi': question,
      'Dữ liệu Quẻ': {
        hexagram: { hexagramId: result.hexagramId, name: result.name, unicode: result.unicode, description: result.description },
        lines: result.lines,
        changingLines: result.changingLines,
      },
    }, null, 2);
  }

  function copyRawData() {
    navigator.clipboard.writeText(getRawData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function renderLine(value: number, index: number) {
    const isYang = value === 7 || value === 9;
    const isDynamic = value === 6 || value === 9;
    return (
      <div key={index} className={`iching-line ${isYang ? 'yang' : 'yin'} ${isDynamic ? 'dynamic' : ''}`}>
        <span className="line-num">Hào {6 - index}</span>
        <span className="line-bar">{isYang ? '━━━━━━━━━' : '━━━━ ━━━━'}</span>
        {isDynamic && <span className="dynamic-mark" title="Hào động">✦</span>}
      </div>
    );
  }

  return (
    <>
      <HeaderNav />
      <div className="iching-page">
        <div className="iching-container">
          <header className="iching-header">
            <h1>☯ Gieo Quẻ Kinh Dịch</h1>
            <p>Máy tính giả lập đồng xu — không cần xu vật lý</p>
          </header>

          {/* Hướng dẫn */}
          <div className="iching-guide">
            <h2>📚 Hướng Dẫn Gieo Quẻ</h2>
            <div className="step"><span className="step-n">1</span><div className="step-body"><strong>Tìm nơi yên tĩnh, thư giãn</strong><p>Buông bỏ suy nghĩ, đưa tâm trí về trạng thái yên lặng.</p></div></div>
            <div className="step"><span className="step-n">2</span><div className="step-body"><strong>Đặt câu hỏi cụ thể</strong><p>Nên đặt: <em>"Tôi nên làm gì với tình huống này?"</em> Tránh hỏi Có/Không.</p></div></div>
            <div className="step"><span className="step-n">3</span><div className="step-body"><strong>Gieo quẻ & Copy Data cho AI</strong><p>Nhập thông tin, bấm "Gieo Quẻ" rồi Copy Raw Data gửi cho AI luận giải.</p></div></div>
          </div>

          {/* Form thông tin */}
          <div className="iching-card">
            <h2>👤 Thông Tin Người Hỏi</h2>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Họ và tên</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Nguyễn Văn A" />
              </div>
              <div className="form-group">
                <label>Năm sinh (DL)</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="VD: 1995" />
              </div>
              <div className="form-group" style={{ minWidth: 90 }}>
                <label>Giới tính</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Sự việc / Vấn đề cần hỏi <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Miêu tả rõ tình huống bạn đang băn khoăn..." rows={3} />
            </div>
          </div>

          {/* Chọn phương pháp */}
          <div className="method-group">
            <label className={`method-label ${method === 3 ? 'active' : ''}`} onClick={() => setMethod(3)}>
              <input type="radio" name="m" checked={method === 3} readOnly />
              <span>🎲 3 Đồng Xu (Phổ thông)</span>
              <span className="badge-rec">Khuyên dùng</span>
            </label>
            <label className={`method-label ${method === 6 ? 'active' : ''}`} onClick={() => setMethod(6)}>
              <input type="radio" name="m" checked={method === 6} readOnly />
              <span>🎲🎲 6 Đồng Xu (Nâng cao)</span>
              <span className="badge-adv">Ít biến động</span>
            </label>
          </div>

          <button className="btn-cast" onClick={handleCast} disabled={loading}>
            {loading ? '⏳ Đang gieo quẻ...' : '☯ Bắt Đầu Gieo Quẻ'}
          </button>

          {/* Loading */}
          {loading && (
            <div className="iching-loading">
              <div className="coin-spin">🎲</div>
              <p>Đang gieo quẻ…</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="iching-result">
              <div className="result-card">
                {/* Thông tin người hỏi */}
                <div className="asker-info">
                  <div className="asker-name"><strong>Người hỏi:</strong> {name || 'Ẩn danh'} ({gender}, SN: {year || '?'})</div>
                  <div className="asker-question"><strong>Câu hỏi:</strong> <em>"{question}"</em></div>
                </div>

                <div className="hex-id">Quẻ số {result.hexagramId} / 64</div>
                <div className="hex-symbol">{result.unicode || '☯'}</div>
                <div className="hex-name">{result.name}</div>

                <div className="hex-lines">
                  {result.lines.map((v, i) => renderLine(v, i))}
                </div>

                <div className="hex-section">
                  <h3>📜 Phán Từ</h3>
                  <p>{result.description}</p>
                </div>

                {result.changingLines.length > 0 && (
                  <div className="hex-section dynamic-section">
                    <h3>🔄 Hào Động</h3>
                    <p>Quẻ có <strong>{result.changingLines.length} hào động</strong> — tình huống đang biến đổi.</p>
                  </div>
                )}

                <div className="raw-section">
                  <h3>📄 Dữ Liệu Gửi Cho AI Luận Giải</h3>
                  <textarea readOnly value={getRawData()} rows={8} />
                  <button className="btn-copy" onClick={copyRawData}>
                    {copied ? '✅ Đã Copy' : '📋 Copy Data'}
                  </button>
                  <p className="raw-hint">Copy đoạn trên và gửi cho AI (Gemini/ChatGPT) để nhận luận giải chi tiết.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .iching-page {
            min-height: 100vh;
            background: #050510;
            color: #e2e8f0;
            padding: 0 0 60px;
          }
          .iching-container {
            max-width: 680px;
            margin: 0 auto;
            padding: 20px 16px;
          }
          .iching-header {
            text-align: center;
            margin-bottom: 24px;
          }
          .iching-header h1 {
            font-size: 1.6rem;
            background: linear-gradient(135deg, #c9a228, #e8d5a0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 0 6px;
          }
          .iching-header p {
            color: #64748b;
            font-size: 0.85rem;
            margin: 0;
          }
          .iching-guide {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .iching-guide h2 {
            font-size: 1rem;
            color: #e8d5a0;
            margin: 0 0 14px;
          }
          .step {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
            align-items: flex-start;
          }
          .step-n {
            background: rgba(201,162,40,0.2);
            color: #c9a228;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.8rem;
            flex-shrink: 0;
          }
          .step-body p {
            margin: 4px 0 0;
            font-size: 0.8rem;
            color: #94a3b8;
          }
          .step-body strong {
            font-size: 0.85rem;
          }
          .iching-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .iching-card h2 {
            font-size: 1rem;
            color: #e8d5a0;
            margin: 0 0 14px;
          }
          .form-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }
          .form-group {
            flex: 1;
            margin-bottom: 12px;
            min-width: 0;
          }
          .form-group label {
            display: block;
            font-size: 0.78rem;
            color: #94a3b8;
            margin-bottom: 5px;
          }
          .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 9px 12px;
            background: rgba(15,23,42,0.8);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            color: #e2e8f0;
            font-size: 0.85rem;
            outline: none;
            box-sizing: border-box;
          }
          .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            border-color: rgba(201,162,40,0.4);
          }
          .method-group {
            display: flex;
            gap: 10px;
            margin-bottom: 16px;
            flex-wrap: wrap;
          }
          .method-label {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 10px;
            cursor: pointer;
            font-size: 0.82rem;
            transition: all 0.2s;
            min-width: 200px;
          }
          .method-label.active {
            border-color: rgba(201,162,40,0.4);
            background: rgba(201,162,40,0.08);
          }
          .method-label input {
            accent-color: #c9a228;
          }
          .badge-rec, .badge-adv {
            font-size: 0.65rem;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: auto;
          }
          .badge-rec {
            background: rgba(34,197,94,0.15);
            color: #22c55e;
          }
          .badge-adv {
            background: rgba(59,130,246,0.15);
            color: #3b82f6;
          }
          .btn-cast {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #92702d, #c9a228);
            color: #000;
            font-weight: 700;
            font-size: 1rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .btn-cast:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(201,162,40,0.3);
          }
          .btn-cast:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .iching-loading {
            text-align: center;
            padding: 40px;
          }
          .coin-spin {
            font-size: 3rem;
            animation: spin 0.6s linear infinite;
          }
          @keyframes spin { from { transform: rotateY(0); } to { transform: rotateY(360deg); } }
          .iching-loading p { color: #94a3b8; margin-top: 12px; }

          .iching-result { margin-top: 24px; }
          .result-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(201,162,40,0.2);
            border-radius: 16px;
            padding: 24px;
          }
          .asker-info {
            background: rgba(255,255,255,0.03);
            padding: 14px;
            border-radius: 10px;
            border-left: 3px solid #c9a228;
            margin-bottom: 20px;
            font-size: 0.85rem;
          }
          .asker-question { color: #94a3b8; margin-top: 6px; line-height: 1.5; }
          .hex-id { text-align: center; color: #64748b; font-size: 0.8rem; margin-bottom: 8px; }
          .hex-symbol { text-align: center; font-size: 4rem; line-height: 1; margin: 10px 0; }
          .hex-name {
            text-align: center;
            font-size: 1.3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #c9a228, #e8d5a0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
          }
          .hex-lines {
            max-width: 320px;
            margin: 0 auto 20px;
          }
          .iching-line {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 0;
            font-family: monospace;
          }
          .line-num { font-size: 0.7rem; color: #64748b; width: 42px; }
          .line-bar { letter-spacing: 2px; font-size: 1.1rem; }
          .iching-line.yang .line-bar { color: #22c55e; }
          .iching-line.yin .line-bar { color: #ef4444; }
          .iching-line.dynamic .line-bar { text-shadow: 0 0 8px currentColor; }
          .dynamic-mark { color: #fbbf24; font-size: 1rem; animation: pulse 1.5s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

          .hex-section {
            padding: 16px;
            background: rgba(255,255,255,0.03);
            border-radius: 10px;
            margin-bottom: 12px;
          }
          .hex-section h3 { font-size: 0.9rem; color: #e8d5a0; margin: 0 0 8px; }
          .hex-section p { font-size: 0.85rem; color: #cbd5e1; line-height: 1.6; margin: 0; }
          .dynamic-section { border-left: 3px solid #fbbf24; }

          .raw-section {
            margin-top: 16px;
            padding: 16px;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
          }
          .raw-section h3 { font-size: 0.85rem; color: #94a3b8; margin: 0 0 10px; }
          .raw-section textarea {
            width: 100%;
            background: rgba(15,23,42,0.8);
            color: #10b981;
            font-family: monospace;
            font-size: 0.75rem;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 8px;
            padding: 12px;
            resize: vertical;
            box-sizing: border-box;
          }
          .btn-copy {
            margin-top: 8px;
            padding: 8px 16px;
            background: #c9a228;
            color: #000;
            font-weight: 600;
            font-size: 0.8rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
          .btn-copy:hover { background: #e8d5a0; }
          .raw-hint { font-size: 0.72rem; color: #64748b; margin-top: 8px; }
        `}</style>
      </div>
    </>
  );
}
