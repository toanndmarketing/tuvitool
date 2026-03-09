/**
 * iching.js - Kinh Dich Frontend Logic
 */

const IChingApp = (() => {
  const API_URL = '/api/iching/cast';

  function renderLines(lines) {
    return lines.map(val => {
      const isYang = val === 7 || val === 9;
      const isChanging = val === 6 || val === 9;
      const label = isYang ? '&mdash;&mdash;&mdash;&mdash;&mdash;' : '&mdash;&mdash; &mdash;&mdash;';
      return '<div class="iching-line ' + (isYang ? 'yang' : 'yin') + (isChanging ? ' changing' : '') + '">' +
        '<span>' + label + '</span>' +
        (isChanging ? '<span class="changing-mark">&#10022;</span>' : '') + '</div>';
    }).reverse().join('');
  }

  function renderResult(data) {
    const container = document.getElementById('iching-result');
    if (!container) return;
    let changingHtml = '';
    if (data.changingLines && data.changingLines.length > 0) {
      changingHtml = '<div class="iching-section changing-notice"><h3>&#128260; Hào Động</h3><p>Quẻ có ' + data.changingLines.length + ' hào động.</p></div>';
    }
    container.innerHTML =
      '<div class="iching-card animate-in">' +
        '<div class="iching-symbol">' + (data.unicode || '?') + '</div>' +
        '<h2 class="iching-name">' + data.name + '</h2>' +
        '<div class="iching-lines-container">' + renderLines(data.lines) + '</div>' +
        '<div class="iching-section"><h3>&#128220; Phán Từ</h3><p>' + data.description + '</p></div>' +
        changingHtml +
      '</div>';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showLoading() {
    const c = document.getElementById('iching-result');
    if (c) c.innerHTML = '<div class="iching-loading"><div class="coin-spin">&#129490;</div><p>Đang gieo quẻ......</p></div>';
  }

  function showError(msg) {
    const c = document.getElementById('iching-result');
    if (c) c.innerHTML = '<div class="iching-error">&#10060; ' + msg + '</div>';
  }

  async function cast(method, throws) {
    showLoading();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: method, throws: throws })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Loi server');
      }
      const data = await res.json();
      setTimeout(function() { renderResult(data); }, 1200);
    } catch (e) {
      setTimeout(function() { showError(e.message); }, 800);
    }
  }

  function init() {
    const btn = document.getElementById('btn-gieo-que');
    if (!btn) return;
    btn.addEventListener('click', function() {
      const throwsEl = document.querySelector('input[name="iching-method"]:checked');
      const throws = throwsEl ? parseInt(throwsEl.value) : 3;
      btn.disabled = true;
      btn.classList.add('casting');
      cast('coin', throws).finally(function() {
        setTimeout(function() {
          btn.disabled = false;
          btn.classList.remove('casting');
        }, 1500);
      });
    });
  }

  return { init: init };
})();

document.addEventListener('DOMContentLoaded', IChingApp.init);
