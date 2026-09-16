/**
 * Groshi247 Credit Check — Embeddable Widget
 * MIT License — https://groshi247.com.ua
 * Usage: <div id="groshi247-credit-check" data-amount="5000" data-term="90"></div>
 *        <script src="https://raw.githubusercontent.com/franchuk111-hash/mfo-ukraine-2026/main/embed.js"></script>
 */
(function() {
  'use strict';

  var DATA_URL = 'https://raw.githubusercontent.com/franchuk111-hash/mfo-ukraine-2026/main/data/verified-rates.json';
  var container = document.getElementById('groshi247-credit-check');

  if (!container) return;

  var amount = parseInt(container.dataset.amount || '5000', 10);
  var term = parseInt(container.dataset.term || '90', 10);

  fetch(DATA_URL)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var mfo = data.mfo || data;
      renderWidget(container, mfo, amount, term);
    })
    .catch(function() {
      container.innerHTML = '<p style="font-family:sans-serif;color:#666;">Дані тимчасово недоступні.</p>';
    });

  function fmt(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' грн';
  }

  function renderWidget(el, mfo, amount, term) {
    var select = '<select id="g247-mfo" style="width:100%;padding:10px;font-size:16px;border:1px solid #FF6B35;border-radius:8px;background:#1a1a2e;color:#fff;">';
    mfo.forEach(function(m) {
      select += '<option value="' + m.slug + '">' + m.name + '</option>';
    });
    select += '</select>';

    var amountSlider = '<input type="range" id="g247-amount" min="500" max="20000" step="500" value="' + amount + '" style="width:100%;accent-color:#FF6B35;">';
    var termSlider = '<input type="range" id="g247-term" min="61" max="365" step="1" value="' + term + '" style="width:100%;accent-color:#FF6B35;">';

    el.innerHTML = 
      '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#1a1a2e;border-radius:16px;color:#fff;">' +
        '<h3 style="color:#FF6B35;margin:0 0 16px;font-size:20px;">💳 Кредитний чек</h3>' +
        '<label style="display:block;margin:12px 0 4px;font-size:14px;color:#aaa;">Кредитор</label>' +
        select +
        '<label style="display:block;margin:12px 0 4px;font-size:14px;color:#aaa;">Сума: <span id="g247-amount-val" style="color:#FF6B35;font-weight:bold;">' + fmt(amount) + '</span></label>' +
        amountSlider +
        '<label style="display:block;margin:12px 0 4px;font-size:14px;color:#aaa;">Строк: <span id="g247-term-val" style="color:#FF6B35;font-weight:bold;">' + term + ' днів</span></label>' +
        termSlider +
        '<div id="g247-result" style="margin-top:16px;padding:16px;background:#16213e;border-radius:12px;border:1px solid #FF6B35;">' +
          '<div style="display:flex;justify-content:space-between;margin:8px 0;"><span style="color:#aaa;">Отримаєте:</span><strong id="g247-get">—</strong></div>' +
          '<div style="display:flex;justify-content:space-between;margin:8px 0;"><span style="color:#aaa;">Повернете:</span><strong id="g247-return" style="color:#FF6B35;">—</strong></div>' +
          '<div style="display:flex;justify-content:space-between;margin:8px 0;"><span style="color:#aaa;">Переплата:</span><strong id="g247-fee">—</strong></div>' +
          '<div style="display:flex;justify-content:space-between;margin:8px 0;"><span style="color:#aaa;">Ставка:</span><strong id="g247-rate">—</strong></div>' +
          '<div style="display:flex;justify-content:space-between;margin:8px 0;font-size:12px;color:#666;"><span>Перевірено:</span><span>2026-09-16</span></div>' +
        '</div>' +
        '<a href="https://groshi247.com.ua/kredyt-tyek/" target="_blank" rel="noopener" style="display:block;margin-top:12px;text-align:center;color:#FF6B35;font-size:13px;text-decoration:none;">' +
          '🔗 Детальніший розрахунок → groshi247.com.ua' +
        '</a>' +
      '</div>';

    var sel = document.getElementById('g247-mfo');
    var aSlider = document.getElementById('g247-amount');
    var tSlider = document.getElementById('g247-term');
    var aVal = document.getElementById('g247-amount-val');
    var tVal = document.getElementById('g247-term-val');

    function update() {
      var a = parseInt(aSlider.value, 10);
      var t = parseInt(tSlider.value, 10);
      var slug = sel.value;
      var selected = mfo.find(function(m) { return m.slug === slug; });
      if (!selected) return;

      aVal.textContent = fmt(a);
      tVal.textContent = t + ' днів';

      var rate = parseFloat(selected.rate) || 0;
      var isFirstFree = selected.first_loan_free !== false;
      var fee = isFirstFree ? 0 : Math.round(a * (rate / 100) * t);
      var total = a + fee;

      document.getElementById('g247-get').textContent = fmt(a);
      document.getElementById('g247-return').textContent = fmt(total);
      document.getElementById('g247-fee').textContent = isFirstFree ? '0 грн (0% перший кредит)' : fmt(fee);
      document.getElementById('g247-rate').textContent = isFirstFree ? '0%/день (акція)' : (rate + '%/день');
    }

    sel.addEventListener('change', update);
    aSlider.addEventListener('input', update);
    tSlider.addEventListener('input', update);
    update();
  }
})();