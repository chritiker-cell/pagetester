// Shake detection
const SHAKE_THRESHOLD = 15;
let lastX, lastY, lastZ;
let shakeCallback = null;
let shakeCooldown = false;

async function enableMotion() {
  if (typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function') {
    const permission = await DeviceMotionEvent.requestPermission();
    return permission === 'granted';
  }
  return true;
}

function onShake(callback) {
  shakeCallback = callback;
  window.addEventListener('devicemotion', (e) => {
    const acc = e.accelerationIncludingGravity;
    if (!acc || shakeCooldown) return;
    if (lastX === undefined) { lastX = acc.x; lastY = acc.y; lastZ = acc.z; return; }

    const delta = Math.abs(acc.x - lastX) + Math.abs(acc.y - lastY) + Math.abs(acc.z - lastZ);
    if (delta > SHAKE_THRESHOLD) {
      shakeCooldown = true;
      setTimeout(() => { shakeCooldown = false; }, 1500);
      if (shakeCallback) shakeCallback();
    }
    lastX = acc.x; lastY = acc.y; lastZ = acc.z;
  });
}

// Hint overlay
function showHint(text, onClose) {
  const existing = document.getElementById('hint-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'hint-overlay';
  overlay.innerHTML = `
    <div class="hint-box">
      <div class="hint-glitch">SCHATTENSCHULE</div>
      <div class="hint-text">${text}</div>
      <button class="hint-close" onclick="closeHint()">[ VERSTANDEN ]</button>
    </div>
  `;
  document.body.appendChild(overlay);

  window._hintOnClose = onClose || null;
}

function closeHint() {
  const overlay = document.getElementById('hint-overlay');
  if (overlay) overlay.remove();
  if (window._hintOnClose) window._hintOnClose();
}

// Station progress (localStorage)
const PROGRESS_KEY = 'schattenschule_progress';

function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch { return {}; }
}

function markStationDone(stationId) {
  const p = getProgress();
  p[stationId] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function isStationDone(stationId) {
  return !!getProgress()[stationId];
}

function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(DIGITS_KEY);
  localStorage.removeItem(LOCK_KEY);
  // Station 3 (Labor): Fehlversuche, eigene Sperre, gefundene Spuren
  ['schattenschule_lab_fails', 'schattenschule_lab_lock_until', 'schattenschule_lab_spuren']
    .forEach(k => localStorage.removeItem(k));
}

// ── Stationen & Laptop-Code ────────────────────────────────────────────────
// HINWEIS FÜR LEHRER: Hier stehen Name, Code-Feld und Code-Fragment jeder Station.
// Die Fragmente in Feld-Reihenfolge ergeben den 12-stelligen Laptop-Code
// (aktuell 417 · 725 · 803 · 184). hack.html liest den Code direkt von hier.
// Story-Bedeutung: Fallnummer · Funkfrequenz · Ausweisnummer des Täters · Uhrzeit 18:40
const STATIONS = {
  'station-1': { name: 'MORAVAS BÜRO', field: 1, symbol: '▲', code: '417' },
  'station-2': { name: 'FUNKRAUM',     field: 2, symbol: '●', code: '725' },
  'station-3': { name: 'ALTES LABOR',  field: 3, symbol: '■', code: '803' },
  'station-4': { name: 'ARCHIV',       field: 4, symbol: '✦', code: '184' },
};

// Stationen in Feld-Reihenfolge (▲ ● ■ ✦)
function getStationsByField() {
  return Object.values(STATIONS).sort((a, b) => a.field - b.field);
}

const DIGITS_KEY = 'schattenschule_digits';

function getStationName(id) {
  return STATIONS[id] ? STATIONS[id].name : id.toUpperCase();
}

function getRoute() {
  try { return JSON.parse(localStorage.getItem('schattenschule_route')) || []; }
  catch { return []; }
}

function getStep() {
  return parseInt(localStorage.getItem('schattenschule_step') || '0', 10);
}

// Zeigt "1/4" usw. im Element #step-counter
function initStepCounter() {
  const el = document.getElementById('step-counter');
  const route = getRoute();
  if (el && route.length) el.textContent = (getStep() + 1) + '/' + route.length;
}

function getDigits() {
  try { return JSON.parse(localStorage.getItem(DIGITS_KEY)) || {}; }
  catch { return {}; }
}

// Einheitlicher Code-Dialog am Ende jeder Station
function showDigit(stationId, introHtml, onDone) {
  const s = STATIONS[stationId];
  const d = getDigits();
  d[s.field] = s.code;
  localStorage.setItem(DIGITS_KEY, JSON.stringify(d));
  const multi = s.code.length > 1;

  showHint(
    (introHtml ? introHtml + '<br><br>' : '') +
    '<span style="color:#cc3300">// LAPTOP-CODE</span><br>' +
    (multi ? 'Code-Fragment' : 'Ziffer') + ' für <strong>Feld ' + s.field + '</strong> ' +
    '<span style="color:#cc3300">' + s.symbol + '</span>:<br>' +
    '<span style="font-size:2.4em;color:#cc3300;letter-spacing:0.2em"><strong>' + s.code + '</strong></span><br>' +
    '<span style="color:#888;font-size:0.85em">Tragt ' + (multi ? 'es' : 'sie') +
    ' auf eurem Aufgabenblatt ins Feld ' + s.symbol + ' ein.</span>',
    () => {
      markStationDone(stationId);
      if (onDone) onDone(); else showNextStation();
    }
  );
}

// ── Scanner-Modus (scan.html: eine Seite für alle Marker) ─────────────────
// Gelöst = Rätsel geschafft (Belohnung sichtbar); erledigt = Code-Teil notiert.
function isSolved(id) { return !!getProgress()['solved:' + id]; }
function markSolved(id) {
  const p = getProgress();
  p['solved:' + id] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}
function countDone() { return Object.keys(STATIONS).filter(isStationDone).length; }
// Nächste empfohlene Station: erste noch nicht erledigte in der Gruppen-Route
function nextRecommended() {
  const route = getRoute();
  const order = route.length ? route : Object.keys(STATIONS);
  return order.find(id => STATIONS[id] && !isStationDone(id)) || null;
}
function stationLabel(id) { return STATIONS[id] ? STATIONS[id].symbol + ' ' + STATIONS[id].name : id; }

function showNextStation() {
  if (window.SCANNER_MODE) {
    const next = nextRecommended();
    if (!next) { showFinish(); return; }
    showHint(
      '✓ STATION ABGESCHLOSSEN<br><br>Empfohlen als Nächstes:<br>' +
      '<strong style="color:#cc3300;font-size:1.2em">' + stationLabel(next) + '</strong><br><br>' +
      '<span style="color:#888;font-size:0.85em">Geht zu diesem Tisch und richtet die Kamera auf das Motiv.</span>',
      () => { if (window.onScannerProgress) window.onScannerProgress(); }
    );
    return;
  }
  const route = getRoute();
  const step = getStep() + 1;
  localStorage.setItem('schattenschule_step', step);

  if (!route.length || step >= route.length) {
    showFinish();
    return;
  }
  const next = route[step];
  showHint(
    '✓ STATION ABGESCHLOSSEN<br><br>Nächste Station:<br>' +
    '<strong style="color:#cc3300">' + getStationName(next) + '</strong>',
    () => { window.location.href = next + '.html'; }
  );
}

// Ziffern-Tastatur: Schüler geben ihre Rätsel-Lösung (eine Ziffer 0–9) ein.
// Erst bei richtiger Antwort wird onCorrect aufgerufen.
function askDigit(questionHtml, correct, onCorrect) {
  const old = document.getElementById('hint-overlay');
  if (old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'hint-overlay';
  let keys = '';
  for (const k of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
    keys += '<button class="hint-close" data-k="' + k + '" style="font-size:1.2rem;padding:0.6rem 0">' + k + '</button>';
  }
  overlay.innerHTML =
    '<div class="hint-box">' +
      '<div class="hint-glitch">SCHATTENSCHULE</div>' +
      '<div class="hint-text">' + questionHtml + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0.4rem">' + keys + '</div>' +
      '<div id="ask-feedback" style="color:#c00;font-size:0.8rem;min-height:1.4em;margin-top:0.75rem"></div>' +
      '<button class="hint-close" data-close style="margin-top:0.5rem;border-color:#555;color:#888">[ ZURÜCK ]</button>' +
    '</div>';
  document.body.appendChild(overlay);
  const feedback = overlay.querySelector('#ask-feedback');
  const keyBtns = overlay.querySelectorAll('[data-k]');
  let tick = null;

  const close = () => { clearInterval(tick); overlay.remove(); };
  overlay.querySelector('[data-close]').addEventListener('click', close);

  // Sperre anzeigen, solange sie läuft (überlebt Schließen und Neuladen)
  function runLock() {
    const left = Math.ceil((getLockUntil() - Date.now()) / 1000);
    const locked = left > 0;
    keyBtns.forEach(b => { b.disabled = locked; b.style.opacity = locked ? '0.3' : '1'; });
    if (locked) {
      feedback.textContent = '⚠ ALARM AUSGELÖST — SYSTEM GESPERRT: ' + left + ' s';
    } else {
      clearInterval(tick);
      tick = null;
      if (feedback.textContent.startsWith('⚠ ALARM')) feedback.textContent = 'Sperre aufgehoben. Denkt nach, bevor ihr tippt!';
    }
  }
  function startLockTicker() {
    runLock();
    if (!tick && getLockUntil() > Date.now()) tick = setInterval(runLock, 250);
  }

  keyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (getLockUntil() > Date.now()) return;
      if (btn.dataset.k === String(correct)) {
        close();
        onCorrect();
      } else {
        btn.style.borderColor = '#c00';
        btn.style.color = '#c00';
        try { localStorage.setItem(LOCK_KEY, String(Date.now() + WRONG_ANSWER_LOCK_SECONDS * 1000)); } catch {}
        startLockTicker();
      }
    });
  });
  startLockTicker();
}

// Strafzeit nach falscher Antwort an der Ziffern-Tastatur (gegen Durchprobieren 0–9)
// HINWEIS FÜR LEHRER: Dauer hier anpassen (0 = keine Sperre)
const WRONG_ANSWER_LOCK_SECONDS = 30;
const LOCK_KEY = 'schattenschule_lock_until';

function getLockUntil() {
  try { return parseInt(localStorage.getItem(LOCK_KEY) || '0', 10); }
  catch { return 0; }
}

// Macht aus der Statuszeile unten (#scan-prompt) einen dauerhaften Button,
// z. B. um die Antwort-Tastatur jederzeit wieder zu öffnen.
function enableAnswerButton(label, onClick) {
  const el = document.getElementById('scan-prompt');
  if (!el) return;
  el.textContent = label;
  el.style.display = 'block';
  el.style.animation = 'none';
  el.style.color = '#e0e0e0';
  el.style.border = '1px solid #cc3300';
  el.style.background = '#0a0a0acc';
  el.style.padding = '0.8rem 1.2rem';
  el.style.cursor = 'pointer';
  el.onclick = onClick;
}

// Schlussbildschirm nach der letzten Station: gesammelte Ziffern + "Geht zum Laptop"
function showFinish() {
  const d = getDigits();
  const fields = getStationsByField()
    .map(s =>
      '<span style="display:inline-block;min-width:2.8rem;border:1px solid #cc3300;margin:0.15rem;padding:0.3rem 0.4rem">' +
      '<span style="color:#cc3300;font-size:0.8rem">' + s.symbol + '</span><br>' +
      '<strong style="font-size:1.5rem;letter-spacing:0.1em">' + (d[s.field] || '?'.repeat(s.code.length)) + '</strong></span>'
    ).join('');

  const old = document.getElementById('hint-overlay');
  if (old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'hint-overlay';
  overlay.innerHTML =
    '<div class="hint-box">' +
      '<div class="hint-glitch">ALLE SIGNALE EMPFANGEN</div>' +
      '<div class="hint-text">Ihr habt alle 4 Code-Teile gesammelt.<br><br>' + fields + '<br><br>' +
      'Geht jetzt zu <strong style="color:#cc3300">eurem Laptop</strong> und hackt das System der Schattenschule.</div>' +
    '</div>';
  document.body.appendChild(overlay);
}
