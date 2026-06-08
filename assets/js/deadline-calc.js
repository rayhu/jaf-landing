/* California notice-deadline calculator — dependency-free, CSP-safe ('self').
   Legal rules + court holidays come from the #calc-data JSON island (data/rules/*.yaml),
   never hard-coded here, so the logic stays static/cacheable and the data stays reviewed. */
(function () {
  var root = document.getElementById('deadline-calc');
  if (!root) return;
  var dataEl = document.getElementById('calc-data');
  if (!dataEl) return;

  var data;
  try {
    data = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  var rules = data.rules || {};
  var holidays = data.holidays || {};
  var t = data.i18n || {};

  var form = root.querySelector('.calc-form');
  var result = root.querySelector('.calc-result');
  if (!form || !result) return;

  // Local YYYY-MM-DD (avoids UTC shift from toISOString).
  function iso(d) {
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }
  function isWeekend(d) {
    var g = d.getDay();
    return g === 0 || g === 6;
  }

  // Returns true/false if the year is known, or null if the holiday table lacks that year.
  function courtClosed(d) {
    var list = holidays[String(d.getFullYear())];
    if (!list) return null; // unknown year -> fail safe
    return isWeekend(d) || list.indexOf(iso(d)) !== -1;
  }
  function addCalendarDays(date, n) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + n);
    return d;
  }
  // Move forward to the next day the court is open. null if year unknown.
  function rollForward(date) {
    var d = new Date(date.getTime());
    for (var i = 0; i < 400; i++) {
      var c = courtClosed(d);
      if (c === null) return null;
      if (!c) return d;
      d.setDate(d.getDate() + 1);
    }
    return null;
  }
  // Count n court days AFTER the start date. null if year unknown.
  function addCourtDays(date, n) {
    var d = new Date(date.getTime()),
      added = 0;
    for (var i = 0; i < 400 && added < n; i++) {
      d.setDate(d.getDate() + 1);
      var c = courtClosed(d);
      if (c === null) return null;
      if (!c) added++;
    }
    return added === n ? d : null;
  }

  function render(message, statute, isError) {
    result.hidden = false;
    result.textContent = '';
    result.classList.toggle('calc-error', !!isError);
    var p = document.createElement('p');
    p.className = 'calc-answer';
    p.textContent = message;
    result.appendChild(p);
    if (statute) {
      var s = document.createElement('p');
      s.className = 'calc-statute';
      s.textContent = (t.statutePrefix || 'Authority:') + ' ' + statute;
      result.appendChild(s);
    }
  }

  function compute() {
    var rule = rules[form.noticeType.value];
    if (!rule) return;
    var raw = form.serviceDate.value;
    if (!raw) {
      render(t.invalid || 'Please enter the date you were served.', null, true);
      return;
    }
    var parts = raw.split('-');
    if (parts.length !== 3) {
      render(t.invalid, null, true);
      return;
    }
    var start = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    if (isNaN(start.getTime())) {
      render(t.invalid, null, true);
      return;
    }

    // Service-by-mail extension (calendar days, CCP §1013) applies first, where the rule allows it.
    var base = start;
    var method = (form.querySelector('input[name="serviceMethod"]:checked') || {}).value;
    if (method === 'mail' && rule.mailExtension) {
      base = addCalendarDays(base, rule.mailExtension);
    }

    var deadline;
    if (rule.basis === 'court') {
      deadline = addCourtDays(base, rule.days);
    } else {
      deadline = rollForward(addCalendarDays(base, rule.days)); // last day rolls to next court day
    }
    if (!deadline) {
      render(t.missingYear || 'Court-holiday data unavailable for that year.', null, true);
      return;
    }

    var human;
    try {
      human = deadline.toLocaleDateString(data.locale || undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      human = iso(deadline);
    }

    render((t.result || 'Your deadline is') + ' ' + human + '.', rule.statute, false);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    compute();
  });
})();
