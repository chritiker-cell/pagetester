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
}
