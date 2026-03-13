#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate iching.html with Form and Raw Data Export"""
import os

OUT = os.path.join(os.path.dirname(__file__), '../../public/iching.html')

HTML = """\
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gieo Quẻ Kinh Dịch - Tử Vi Lá Số</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0d0d1a;min-height:100vh;font-family:'Segoe UI',sans-serif;color:#ccc}
    .page{max-width:760px;margin:0 auto;padding:36px 20px 72px}
    header{text-align:center;margin-bottom:36px}
    header h1{font-size:1.9rem;color:#c9a228;margin-bottom:8px}
    header p{color:#777;font-size:.88rem}
    .guide{background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid #c9a22840;border-radius:16px;padding:28px;margin-bottom:28px}
    .guide h2{color:#c9a228;font-size:1rem;margin-bottom:22px}
    .step{display:flex;gap:14px;margin-bottom:20px}
    .step:last-child{margin-bottom:0}
    .step-n{background:#c9a228;color:#0d0d1a;border-radius:50%;width:26px;height:26px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem;margin-top:3px}
    .step-body strong{color:#e8d5a0;display:block;margin-bottom:5px;font-size:.93rem}
    .step-body p{color:#999;font-size:.83rem;line-height:1.65}
    .tip{background:#ffffff0a;border-left:3px solid #c9a228;border-radius:0 6px 6px 0;padding:7px 11px;margin-top:8px;font-size:.8rem;color:#c9a228}
    .legend{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px}
    .method{background:#ffffff06;border:1.5px solid #ffffff10;border-radius:12px;padding:16px 18px;margin-bottom:14px;cursor:pointer;transition:border-color .2s,background .2s;display:block}
    .method.on{border-color:#c9a228;background:#c9a22815}
    .method-row{display:flex;align-items:center;gap:12px}
    .method-row input{accent-color:#c9a228;width:15px;height:15px;flex-shrink:0;margin:0}
    .method-row .lbl{font-size:.92rem;color:#e8d5a0;font-weight:600}
    .method-row .badge{font-size:.68rem;background:#c9a22825;color:#c9a228;padding:2px 8px;border-radius:20px;margin-left:auto}
    .method-desc{color:#777;font-size:.8rem;margin-top:7px;margin-left:27px;line-height:1.5}
    
    /* Form Styles */
    .form-group{margin-bottom:16px}
    .form-group label{display:block;color:#e8d5a0;font-size:.85rem;margin-bottom:6px}
    .form-control{width:100%;padding:12px 16px;background:#ffffff08;border:1px solid #ffffff15;border-radius:10px;color:#fff;font-family:inherit;font-size:.95rem;outline:none;transition:border-color .2s}
    .form-control:focus{border-color:#c9a228}
    select.form-control{background:#16213e;cursor:pointer}
    .flex-row{display:flex;gap:16px;flex-wrap:wrap}
    .flex-col{flex:1;min-width:140px}

    #btn{display:block;width:100%;margin:12px 0 28px;background:linear-gradient(135deg,#c9a228,#7a5c10);color:#fff;border:none;border-radius:14px;padding:15px;font-size:1.05rem;font-weight:600;cursor:pointer;box-shadow:0 4px 20px rgba(201,162,40,.35);transition:transform .15s,box-shadow .15s,opacity .15s}
    #btn:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(201,162,40,.55)}
    #btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
    #btn.casting{animation:pulse .7s infinite alternate}
    @keyframes pulse{from{box-shadow:0 4px 20px rgba(201,162,40,.3)}to{box-shadow:0 4px 36px rgba(201,162,40,.9)}}
    .loading{text-align:center;padding:48px 0}
    .coin-spin{font-size:3rem;display:inline-block;animation:spinY .5s linear infinite}
    @keyframes spinY{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
    .loading p{color:#777;margin-top:12px;font-size:.88rem}
    .card{background:linear-gradient(160deg,#1a1a2e,#16213e);border:1px solid #c9a22840;border-radius:18px;padding:36px 28px;text-align:center;animation:fadeUp .5s ease}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    .hex-id{font-size:.75rem;color:#555;margin-bottom:4px}
    .hex-sym{font-size:5rem;color:#c9a228;line-height:1;margin-bottom:8px}
    .hex-name{font-size:1.3rem;color:#e8d5a0;margin-bottom:24px}
    .lines{display:inline-block;margin-bottom:26px}
    .hline{display:flex;align-items:center;gap:10px;margin:7px 0;font-size:1.75rem;letter-spacing:3px}
    .hline .lnum{font-size:.7rem;color:#444;min-width:36px;text-align:right}
    .hline.yang .bar{color:#e8d5a0}
    .hline.yin .bar{color:#7a6a4a}
    .hline.dyn .bar{color:#ff9f1c}
    .dyn-mark{font-size:.8rem;color:#ff9f1c}
    .sec{background:#ffffff07;border-radius:10px;padding:15px 18px;margin-bottom:12px;text-align:left}
    .sec h3{color:#c9a228;font-size:.88rem;margin-bottom:7px}
    .sec p{color:#ccc;font-size:.86rem;line-height:1.7}
    .sec.dyn-sec{border:1px solid #ff9f1c40}
    .err{text-align:center;color:#e74c3c;padding:32px}
    
    .raw-data-box{margin-top:24px;text-align:left;position:relative}
    .raw-data-box h3{color:#c9a228;font-size:1rem;margin-bottom:12px}
    .raw-data-box textarea{width:100%;height:200px;background:#0d0d1a;color:#a6e22e;padding:16px;font-family:monospace;font-size:13px;border:1px solid #333;border-radius:8px;resize:vertical;outline:none}
    .btn-copy{position:absolute;top:38px;right:10px;background:#c9a228;color:#000;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:bold;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.5)}
    .btn-copy:hover{background:#e8d5a0}
  </style>
</head>
<body>
<div class="page">

  <header>
    <h1>&#9775; Gieo Quẻ Kinh Dịch</h1>
    <p>Máy tính giả lập đồng xu &#8212; không cần xu vật lý</p>
  </header>

  <!-- HUONG DAN 6 BUOC -->
  <div class="guide" style="margin-bottom: 20px;">
    <h2>&#128218; Hướng Dẫn Gieo Quẻ Từng Bước</h2>
    <div class="step"><div class="step-n">1</div><div class="step-body"><strong>Tìm nơi yên tĩnh, thư giãn</strong><p>Buông bỏ suy nghĩ, đưa tâm trí về trạng thái yên lặng.</p></div></div>
    <div class="step"><div class="step-n">2</div><div class="step-body"><strong>Đặt câu hỏi cụ thể</strong><p>Nên đặt: <em>"Tôi nên làm gì với tình huống này?"</em> Tránh hỏi Có/Không.</p></div></div>
    <div class="step"><div class="step-n">3</div><div class="step-body"><strong>Gieo quẻ & Copy Data cho AI</strong><p>Nhập thông tin bên dưới, bấm "Gieo Quẻ" và Copy Raw Data để gửi cho Thầy Kinh Dịch (AI).</p></div></div>
  </div>

  <!-- THONG TIN NGUOI HOI -->
  <div class="guide" style="padding:24px;">
    <h2>&#128100; Thông Tin Người Hỏi & Câu Hỏi</h2>
    
    <div class="flex-row">
      <div class="form-group flex-col" style="flex:2">
        <label>Họ và tên</label>
        <input type="text" id="iq-name" class="form-control" placeholder="VD: Nguyễn Văn A">
      </div>
      <div class="form-group flex-col">
        <label>Năm sinh (Dương lịch)</label>
        <input type="number" id="iq-year" class="form-control" placeholder="VD: 1995">
      </div>
      <div class="form-group flex-col" style="min-width:100px">
        <label>Giới tính</label>
        <select id="iq-gender" class="form-control">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>
    </div>
    
    <div class="form-group" style="margin-bottom:0">
      <label>Sự việc / Vấn đề cần hỏi <span style="color:#e74c3c">*</span></label>
      <textarea id="iq-question" class="form-control" placeholder="Hãy miêu tả rõ tình huống hoặc vấn đề bạn đang băn khoăn để nhận lời khuyên chính xác nhất..." rows="3"></textarea>
    </div>
  </div>

  <!-- CHON PHUONG PHAP -->
  <label class="method on" id="lbl3">
    <div class="method-row">
      <input type="radio" name="m" value="3" id="r3" checked>
      <span class="lbl">&#127922; 3 Đồng Xu (Phổ thông)</span>
      <span class="badge">Khuyên dùng</span>
    </div>
  </label>

  <label class="method" id="lbl6">
    <div class="method-row">
      <input type="radio" name="m" value="6" id="r6">
      <span class="lbl">&#127922;&#127922; 6 Đồng Xu (Nâng cao)</span>
      <span class="badge">Ít biến động</span>
    </div>
  </label>

  <button id="btn">&#9775; Bắt Đầu Gieo Quẻ</button>

  <div id="result"></div>
</div>

<script>
(function(){
  var lbl3=document.getElementById('lbl3'),lbl6=document.getElementById('lbl6');
  document.querySelectorAll('input[name=m]').forEach(function(r){
    r.addEventListener('change',function(){
      lbl3.classList.toggle('on',document.getElementById('r3').checked);
      lbl6.classList.toggle('on',document.getElementById('r6').checked);
    });
  });

  function rl(lines){
    var h='';
    for(var i=lines.length-1;i>=0;i--){
      var v=lines[i],y=(v===7||v===9),d=(v===6||v===9);
      h+='<div class="hline '+(y?'yang':'yin')+(d?' dyn':'')+'">'
        +'<span class="lnum">Hào '+(i+1)+'</span>'
        +'<span class="bar">'+(y?'&mdash;&mdash;&mdash;&mdash;&mdash;':'&mdash;&mdash; &mdash;&mdash;')+'</span>'
        +(d?'<span class="dyn-mark" title="Hào động">&#10022;</span>':'')
        +'</div>';
    }
    return h;
  }

  window.copyRawData = function() {
    var ta = document.getElementById('rawTextToCopy');
    ta.select();
    document.execCommand('copy');
    var btn = document.querySelector('.btn-copy');
    var oldText = btn.innerText;
    btn.innerText = 'Đã Copy ✔';
    btn.style.background = '#a6e22e';
    setTimeout(function(){ btn.innerText = oldText; btn.style.background = '#c9a228'; }, 2000);
  };

  function show(d){
    var c=document.getElementById('result'),ch='';
    var qData = window._lastAskData;
    
    if(d.changingLines&&d.changingLines.length)
      ch='<div class="sec dyn-sec"><h3>&#128260; Hào Động</h3><p>Quẻ có <strong>'+d.changingLines.length+' hào động</strong> — tình huống đang biến đổi. Hãy chú ý đến sự chuyển hóa này khi suy ngẫm.</p></div>';
      
    var rawObj = {
      "Thông tin người hỏi": (qData.name || "Ẩn danh") + ", " + qData.gender + ", sinh năm Dương Lịch " + (qData.year || "[Không có]"),
      "Câu hỏi": qData.question,
      "Dữ liệu Quẻ": {
        "hexagram": {
          "hexagramId": d.hexagramId,
          "name": d.name,
          "unicode": d.unicode,
          "description": d.description
        },
        "lines": d.lines,
        "changingLines": d.changingLines
      }
    };
    var rawText = JSON.stringify(rawObj, null, 2);

    c.innerHTML='<div class="card">'
      +'<div style="background:#ffffff0a;padding:16px;border-radius:12px;margin-bottom:24px;text-align:left;border-left:3px solid #c9a228;">'
      +  '<div style="color:#e8d5a0;font-size:0.95rem;margin-bottom:6px;"><strong>Người hỏi:</strong> '+(qData.name||"Ẩn danh")+' ('+qData.gender+', SN: '+(qData.year||"?")+')</div>'
      +  '<div style="color:#ccc;font-size:0.95rem;line-height:1.5;"><strong>Câu hỏi:</strong> <em>"'+qData.question+'"</em></div>'
      +'</div>'
      +'<div class="hex-id">Quẻ số '+d.hexagramId+' / 64</div>'
      +'<div class="hex-sym">'+(d.unicode||'&#9775;')+'</div>'
      +'<div class="hex-name">'+d.name+'</div>'
      +'<div class="lines">'+rl(d.lines)+'</div>'
      +'<div class="sec"><h3>&#128220; Phán Từ</h3><p>'+d.description+'</p></div>'
      +ch
      +'<div class="raw-data-box">'
      +  '<h3>&#128196; Dữ Liệu Gửi Cho AI Bậc Thầy</h3>'
      +  '<textarea id="rawTextToCopy" readonly>'+rawText+'</textarea>'
      +  '<button class="btn-copy" onclick="copyRawData()">Copy Data</button>'
      +  '<p style="color:#888;font-size:0.8rem;margin-top:8px;">Copy đoạn chữ trên và gửi cho AI (Gemini/ChatGPT) cùng với System Prompt để nhận lời giải chi tiết.</p>'
      +'</div>'
      +'</div>';
    c.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function spin(){document.getElementById('result').innerHTML='<div class="loading"><div class="coin-spin">&#127922;</div><p>Đang gieo quẻ…</p></div>';}
  function er(m){document.getElementById('result').innerHTML='<div class="err">&#10060; '+m+'</div>';}
  
  document.getElementById('btn').addEventListener('click',function(){
    var qInput = document.getElementById('iq-question');
    if(!qInput.value.trim()){
      alert("Vui lòng nhập rõ sự việc/vấn đề bạn đang băn khoăn trước khi gieo quẻ để kết quả được linh ứng!");
      qInput.focus();
      return;
    }
    
    window._lastAskData = {
      name: document.getElementById('iq-name').value.trim(),
      year: document.getElementById('iq-year').value.trim(),
      gender: document.getElementById('iq-gender').value,
      question: qInput.value.trim()
    };

    var btn=this,t=parseInt(document.querySelector('input[name=m]:checked').value)||3;
    btn.disabled=true;btn.classList.add('casting');spin();
    
    fetch('/api/iching/cast',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({method:'coin',throws:t})})
      .then(function(r){return r.ok?r.json():r.json().then(function(e){throw new Error(e.error||'Lỗi server');});})
      .then(function(d){setTimeout(function(){show(d);},1200);})
      .catch(function(e){setTimeout(function(){er(e.message);},600);})
      .finally(function(){setTimeout(function(){btn.disabled=false;btn.classList.remove('casting');},1500);});
  });
})();
</script>
</body>
</html>
"""

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(HTML)

print(f'Written {len(HTML)} chars to {OUT}')
