const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../../public/iching.html');

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gieo Qu\u1ebb Kinh D\u1ecbch - T\u1eed Vi L\u00e1 S\u1ed1</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0d0d1a;min-height:100vh;font-family:'Segoe UI',sans-serif;color:#ccc}
    .page{max-width:760px;margin:0 auto;padding:36px 20px 72px}

    /* Header */
    header{text-align:center;margin-bottom:36px}
    header h1{font-size:1.9rem;color:#c9a228;margin-bottom:8px}
    header p{color:#777;font-size:.88rem}

    /* Guide */
    .guide{background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid #c9a22840;border-radius:16px;padding:28px;margin-bottom:28px}
    .guide h2{color:#c9a228;font-size:1rem;margin-bottom:22px;display:flex;align-items:center;gap:8px}
    .step{display:flex;gap:14px;margin-bottom:20px;align-items:flex-start}
    .step:last-child{margin-bottom:0}
    .step-n{background:#c9a228;color:#0d0d1a;border-radius:50%;width:26px;height:26px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem;margin-top:3px}
    .step-body strong{color:#e8d5a0;display:block;margin-bottom:5px;font-size:.93rem}
    .step-body p{color:#999;font-size:.83rem;line-height:1.65}
    .tip{background:#ffffff0a;border-left:3px solid #c9a228;border-radius:0 6px 6px 0;padding:7px 11px;margin-top:8px;font-size:.8rem;color:#c9a228}
    .legend{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
    .legend span{font-size:.8rem}

    /* Method cards */
    .method{background:#ffffff06;border:1.5px solid #ffffff10;border-radius:12px;padding:16px 18px;margin-bottom:14px;cursor:pointer;transition:border-color .2s,background .2s;display:block}
    .method.on{border-color:#c9a228;background:#c9a22815}
    .method-row{display:flex;align-items:center;gap:12px}
    .method-row input{accent-color:#c9a228;width:15px;height:15px;flex-shrink:0;margin:0}
    .method-row .lbl{font-size:.92rem;color:#e8d5a0;font-weight:600}
    .method-row .badge{font-size:.68rem;background:#c9a22825;color:#c9a228;padding:2px 8px;border-radius:20px;margin-left:auto}
    .method-desc{color:#777;font-size:.8rem;margin-top:7px;margin-left:27px;line-height:1.5}

    /* Cast button */
    #btn{display:block;width:100%;margin:4px 0 28px;background:linear-gradient(135deg,#c9a228,#7a5c10);color:#fff;border:none;border-radius:14px;padding:15px;font-size:1.05rem;font-weight:600;cursor:pointer;transition:transform .15s,box-shadow .15s,opacity .15s;box-shadow:0 4px 20px rgba(201,162,40,.35)}
    #btn:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(201,162,40,.55)}
    #btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
    #btn.casting{animation:pulse .7s infinite alternate}
    @keyframes pulse{from{box-shadow:0 4px 20px rgba(201,162,40,.3)}to{box-shadow:0 4px 36px rgba(201,162,40,.9)}}

    /* Result */
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
  </style>
</head>
<body>
<div class="page">

  <header>
    <h1>&#9775; Gi\u1eo3o Qu\u1ebb Kinh D\u1ecbch</h1>
    <p>M\u00e1y t\u00ednh gi\u1ea3 l\u1eadp \u0111\u1ed3ng xu cho b\u1ea1n \u2014 kh\u00f4ng c\u1ea7n xu v\u1eadt l\u00fd</p>
  </header>

  <!-- HUONG DAN 6 BUOC -->
  <div class="guide">
    <h2>&#128218; H\u01b0\u1edbng D\u1eabn Gi\u1eo3o Qu\u1ebb T\u1eebng B\u01b0\u1edbc</h2>

    <div class="step">
      <div class="step-n">1</div>
      <div class="step-body">
        <strong>T\u00ecm n\u01a1i y\u00ean t\u0129nh, th\u01b0 gi\u00e3n</strong>
        <p>Ng\u1ed3i th\u1eb3ng l\u01b0ng, h\u00edt th\u1edf s\u00e2u 3 l\u1ea7n. Bu\u00f4ng b\u1ecf m\u1ecdi suy ngh\u0129 ngo\u1ea1i vi, \u0111\u01b0a t\u00e2m tr\u00ed v\u1ec1 tr\u1ea1ng th\u00e1i y\u00ean l\u1eb7ng.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-n">2</div>
      <div class="step-body">
        <strong>\u0110\u1eb7t c\u00e2u h\u1ecfi c\u1ee5 th\u1ec3 trong l\u00f2ng</strong>
        <p>Suy ngh\u0129 r\u00f5 v\u1ec1 v\u1ea5n \u0111\u1ec1 mu\u1ed1n h\u1ecfi. N\u00ean h\u1ecfi: <em>\u201cT\u00f4i n\u00ean l\u00e0m g\u00ec v\u1edbi t\u00ecnh hu\u1ed1ng [X]?\u201d</em> ho\u1eb7c <em>\u201cN\u0103ng l\u01b0\u1ee3ng n\u00e0o \u0111ang chi ph\u1ed1i vi\u1ec7c [X] c\u1ee7a t\u00f4i?\u201d</em></p>
        <div class="tip">&#128161; Tr\u00e1nh h\u1ecfi C\u00f3/Kh\u00f4ng \u2014 Kinh D\u1ecbch cho th\u1ea5y \u0111\u1ecbnh h\u01b0\u1edbng, kh\u00f4ng ph\u1ea3i k\u1ebft qu\u1ea3 ch\u1eafc ch\u1eafn.</div>
      </div>
    </div>

    <div class="step">
      <div class="step-n">3</div>
      <div class="step-body">
        <strong>Ch\u1ecdn ph\u01b0\u01a1ng ph\u00e1p gi\u1eo3o</strong>
        <p>
          <strong style="color:#e8d5a0">3 \u0110\u1ed3ng Xu</strong> \u2014 Gi\u1ea3 l\u1eadp 3 \u0111\u1ed3ng xu tung 6 l\u1ea7n. Ph\u1ed5 bi\u1ebfn, nhanh, \u0111\u01b0\u1ee3c s\u1eed d\u1ee5ng nhi\u1ec1u nh\u1ea5t hi\u1ec7n nay.<br><br>
          <strong style="color:#e8d5a0">6 \u0110\u1ed3ng Xu</strong> \u2014 Gi\u1ea3 l\u1eadp 6 \u0111\u1ed3ng xu m\u1ed7i l\u1ea7n. X\u00e1c su\u1ea5t h\u00e0o \u0111\u1ed9ng th\u1ea5p h\u01a1n (g\u1ea7n v\u1edbi ph\u01b0\u01a1ng ph\u00e1p c\u1ecf thi truy\u1ec1n th\u1ed1ng h\u01a1n).
        </p>
      </div>
    </div>

    <div class="step">
      <div class="step-n">4</div>
      <div class="step-body">
        <strong>Gi\u1eo3o qu\u1ebb</strong>
        <p>Gi\u1eef c\u00e2u h\u1ecfi trong \u0111\u1ea7u, nh\u1ea5n n\u00fat <strong style="color:#c9a228">\u201cGi\u1eo3o Qu\u1ebb\u201d</strong>. H\u1ec7 th\u1ed1ng s\u1ebd th\u1ef1c hi\u1ec7n 6 l\u1ea7n gi\u1ea3 l\u1eadp tung xu, m\u1ed7i l\u1ea7n x\u00e1c \u0111\u1ecbnh 1 trong 6 h\u00e0o (t\u1eeb h\u00e0o 1 d\u01b0\u1edbi l\u00ean h\u00e0o 6 tr\u00ean).</p>
      </div>
    </div>

    <div class="step">
      <div class="step-n">5</div>
      <div class="step-body">
        <strong>\u0110\u1ecdc k\u1ebft qu\u1ea3 qu\u1ebb</strong>
        <p>Qu\u1ebb g\u1ed3m 6 h\u00e0o \u0111\u1ecdc t\u1eeb d\u01b0\u1edbi l\u00ean tr\u00ean. C\u00f3 4 lo\u1ea1i h\u00e0o:</p>
        <div class="legend">
          <span style="color:#e8d5a0"><strong>\u2014\u2014\u2014\u2014\u2014</strong> D\u01b0\u01a1ng (n\u00e9t li\u1ec1n)</span>
          <span style="color:#7a6a4a"><strong>\u2014\u2014 \u2014\u2014</strong> \u00c2m (n\u00e9t g\u00e3y)</span>
          <span style="color:#ff9f1c"><strong>\u2014\u2014\u2014\u2014\u2014 &#10022;</strong> D\u01b0\u01a1ng \u0111\u1ed9ng (bi\u1ebfn th\u00e0nh \u00c2m)</span>
          <span style="color:#ff9f1c"><strong>\u2014\u2014 \u2014\u2014 &#10022;</strong> \u00c2m \u0111\u1ed9ng (bi\u1ebfn th\u00e0nh D\u01b0\u01a1ng)</span>
        </div>
        <div class="tip">&#9888;&#65039; H\u00e0o \u0111\u1ed9ng (&#10022;) b\u00e1o hi\u1ec7u s\u1ef1 bi\u1ebfn chuy\u1ec3n \u2014 \u0111\u00e2y l\u00e0 \u0111i\u1ec3m m\u1ea5u ch\u1ed1t c\u1ea7n ch\u00fa \u00fd trong l\u1eddi gi\u1ea3i.</div>
      </div>
    </div>

    <div class="step">
      <div class="step-n">6</div>
      <div class="step-body">
        <strong>Suy ng\u1eabm v\u00e0 \u1ee9ng d\u1ee5ng</strong>
        <p>Kinh D\u1ecbch kh\u00f4ng ti\u00ean tri \u2014 n\u00f3 ph\u1ea3n \u00e1nh <em>n\u0103ng l\u01b0\u1ee3ng hi\u1ec7n t\u1ea1i</u> c\u1ee7a t\u00ecnh hu\u1ed1ng. \u0110\u1ecdc ph\u00e1n t\u1eeb, suy ng\u1eabm xem n\u00f3 li\u00ean quan th\u1ebf n\u00e0o \u0111\u1ebfn c\u00e2u h\u1ecfi c\u1ee7a b\u1ea1n r\u1ed3i t\u1ef1 r\u00fat ra b\u00e0i h\u1ecdc.</p>
      </div>
    </div>
  </div>

  <!-- CHON PHUONG PHAP -->
  <label class="method on" id="lbl3">
    <div class="method-row">
      <input type="radio" name="m" value="3" id="r3" checked>
      <span class="lbl">&#127922; 3 \u0110\u1ed3ng Xu (Ph\u1ed5 th\u00f4ng)</span>
      <span class="badge">Khuyn\u1ebf d\u00f9ng</span>
    </div>
    <div class="method-desc">Gi\u1ea3 l\u1eadp 3 xu tung 6 l\u1ea7n: 3 ng\u01b0\u1eefa = D\u01b0\u01a1ng \u0111\u1ed9ng, 3 s\u1ea5p = \u00c2m \u0111\u1ed9ng, 2 ng\u01b0\u1eefa = D\u01b0\u01a1ng, 2 s\u1ea5p = \u00c2m.</div>
  </label>

  <label class="method" id="lbl6">
    <div class="method-row">
      <input type="radio" name="m" value="6" id="r6">
      <span class="lbl">&#127922;&#127922; 6 \u0110\u1ed3ng Xu (N\u00e2ng cao)</span>
      <span class="badge">Truy\u1ec1n th\u1ed1ng h\u01a1n</span>
    </div>
    <div class="method-desc">Gi\u1ea3 l\u1eadp 6 xu m\u1ed7i l\u1ea7n. X\u00e1c su\u1ea5t h\u00e0o \u0111\u1ed9ng th\u1ea5p h\u01a1n, k\u1ebft qu\u1ea3 \u1ed5n \u0111\u1ecbnh v\u00e0 g\u1ea7n ph\u01b0\u01a1ng ph\u00e1p c\u1ecf thi h\u01a1n.</div>
  </label>

  <button id="btn">&#9775; Gi\u1eo3o Qu\u1ebb</button>

  <div id="result"></div>
</div>

<script>
(function(){
  var lbl3=document.getElementById('lbl3'),lbl6=document.getElementById('lbl6');
  document.querySelectorAll('input[name="m"]').forEach(function(r){
    r.addEventListener('change',function(){
      lbl3.classList.toggle('on',document.getElementById('r3').checked);
      lbl6.classList.toggle('on',document.getElementById('r6').checked);
    });
  });

  function renderLines(lines){
    var h='';
    for(var i=lines.length-1;i>=0;i--){
      var v=lines[i],yang=(v===7||v===9),dyn=(v===6||v===9);
      h+='<div class="hline '+(yang?'yang':'yin')+(dyn?' dyn':'')+'">'+
        '<span class="lnum">H\u00e0o '+(i+1)+'</span>'+
        '<span class="bar">'+(yang?'&mdash;&mdash;&mdash;&mdash;&mdash;':'&mdash;&mdash; &mdash;&mdash;')+'</span>'+
        (dyn?'<span class="dyn-mark" title="H\u00e0o \u0111\u1ed9ng">&#10022;</span>':'')+
        '</div>';
    }
    return h;
  }

  function renderResult(d){
    var c=document.getElementById('result'),ch='';
    if(d.changingLines&&d.changingLines.length){
      ch='<div class="sec dyn-sec"><h3>&#128260; H\u00e0o \u0110\u1ed9ng</h3><p>Qu\u1ebb c\u00f3 <strong>'+d.changingLines.length+' h\u00e0o \u0111\u1ed9ng</strong> \u2014 t\u00ecnh hu\u1ed1ng \u0111ang <em>trong qu\u00e1 tr\u00ecnh bi\u1ebfn \u0111\u1ed5i</\/em>. H\u00e3y ch\u00fa \u00fd \u0111\u1ebfn s\u1ef1 chuy\u1ec3n h\u00f3a n\u00e0y khi suy ng\u1eabm.<\/p><\/div>';
    }
    c.innerHTML='<div class="card">'+
      '<div class="hex-id">Qu\u1ebb s\u1ed1 '+d.hexagramId+' \/ 64<\/div>'+
      '<div class="hex-sym">'+(d.unicode||'&#9775;')+'<\/div>'+
      '<div class="hex-name">'+d.name+'<\/div>'+
      '<div class="lines">'+renderLines(d.lines)+'<\/div>'+
      '<div class="sec"><h3>&#128220; Ph\u00e1n T\u1eeb<\/h3><p>'+d.description+'<\/p><\/div>'+
      ch+
      '<\/div>';
    c.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function loading(){document.getElementById('result').innerHTML='<div class="loading"><div class="coin-spin">&#127922;<\/div><p>\u0110ang gi\u1ea3o qu\u1ebb\u2026<\/p><\/div>';}
  function err(m){document.getElementById('result').innerHTML='<div class="err">&#10060; '+m+'<\/div>';}

  document.getElementById('btn').addEventListener('click',function(){
    var btn=this,throws=parseInt(document.querySelector('input[name="m"]:checked').value)||3;
    btn.disabled=true;btn.classList.add('casting');loading();
    fetch('/api/iching/cast',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({method:'coin',throws:throws})})
      .then(function(r){return r.ok?r.json():r.json().then(function(e){throw new Error(e.error||'L\u1ed7i server');});})
      .then(function(d){setTimeout(function(){renderResult(d);},1200);})
      .catch(function(e){setTimeout(function(){err(e.message);},600);})
      .finally(function(){setTimeout(function(){btn.disabled=false;btn.classList.remove('casting');},1500);});
  });
})();
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html, { encoding: 'utf8' });
console.log('Written', html.length, 'chars to', OUT);
