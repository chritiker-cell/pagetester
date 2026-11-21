// ═══════════════════════════════════════════════════════════════════════════
//  Fingerabdruck-Zeichner (Station 3 — Altes Labor)
//  Wird vom Druckblatt (print/requisit-3.html) UND vom Scanner (scan.html)
//  benutzt, damit die Muster überall exakt gleich aussehen.
//
//  Fingerabdruck.zeichne(canvas, {
//    typ:      'bogen' | 'wirbel' | 'schleife',
//    richtung: 1 (Schleife öffnet nach links) | -1 (nach rechts),
//    bogen:    Höhe des Bogens (nur 'bogen', z. B. 0.28 flach, 0.45 spitz),
//    gabelung: true  → eine Linie teilt sich oberhalb des Kerns in zwei,
//    insel:    true  → kurze, freistehende Linie oberhalb des Kerns,
//    narbe:    true  → helle Narbe quer über den unteren Teil,
//    punkt:    true  → kleine Insel im unteren Teil,
//    teil:     true  → nur die obere Hälfte (Teilabdruck vom Tatort),
//    farbe:    Linienfarbe, hintergrund: Flächenfarbe oder null (transparent),
//    markiere: true  → Kreis um die auffällige Stelle
//  })
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const TAU = Math.PI * 2;
  const P = 0.078;                        // Linienabstand (in Fingerbreiten)
  const FORK = { u: 0.16, v: -0.66 };    // Lage von Gabelung bzw. Insel (über dem Kern)

  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const intens = f => 0.5 + 0.5 * Math.cos(TAU * f);

  // Bogenfeld: waagrechte Linien, die sich in der Mitte nach oben wölben
  function bogenFeld(u, v, h, s) { return (v + h * Math.exp(-(u * u) / s)) / P; }

  // Linien-Intensität 0..1. Kern und Außenbereich werden getrennt berechnet und an einer
  // schmalen Grenze überblendet (dort enden Linien — wie bei echten Abdrücken).
  function linie(u, v, o) {
    const spitz = o.typ === 'bogen' && o.bogen > 0.4;
    const arch = bogenFeld(u, v, o.typ === 'bogen' ? (o.bogen || 0.28) : 0.34, spitz ? 0.05 : 0.16)
      + (o.gabelung ? Math.atan2(v - FORK.v, u - FORK.u) / TAU : 0);   // Phasensprung = Gabelung
    if (o.typ === 'bogen') return intens(arch);
    let kern, r;
    if (o.typ === 'wirbel') {
      const du = u, dv = (v - 0.02) / 1.15;
      r = Math.sqrt(du * du + dv * dv);
      kern = r / P + Math.atan2(dv, du) / TAU;           // leichte Spirale
    } else {
      // Schleife: Abstand zu einem Halbstrahl vom Kern schräg nach unten → ineinanderliegende Haarnadeln
      const dir = o.richtung === -1 ? 1 : -1;
      const pu = u + 0.02 * dir, pv = v + 0.02;
      const dx = dir * 0.80, dy = 0.60;
      const t = pu * dx + pv * dy;
      const d = t < 0 ? Math.hypot(pu, pv) : Math.hypot(pu - t * dx, pv - t * dy);
      r = Math.hypot(pu, pv * 0.9);
      kern = d / P;
    }
    const m = smooth(0.47, 0.53, r);
    return intens(kern) * (1 - m) + intens(arch) * m;
  }

  function zeichne(canvas, o) {
    o = Object.assign({ typ: 'schleife', richtung: 1, farbe: '#1a1a2e', hintergrund: '#ffffff' }, o || {});
    const W = canvas.width, H = canvas.height, g = canvas.getContext('2d');
    const img = g.createImageData(W, H), px = img.data;
    const R = W * 0.44, cx = W / 2, cy = H * 0.54;
    const col = parseColor(o.farbe), bg = o.hintergrund ? parseColor(o.hintergrund) : null;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const u = (x - cx) / R, v = (y - cy) / R;
        // Fingerkuppe: Ellipse, oben runder, mit leicht unruhigem Rand
        const e = Math.hypot(u / 0.98, v / (v < 0 ? 1.12 : 1.22));
        const randRausch = (hash(Math.floor(x / 3), Math.floor(y / 3)) - 0.5) * 0.06;
        let mask = 1 - smooth(0.9, 1.0, e + randRausch);
        if (o.teil) {
          // Teilabdruck: nur der obere Bereich, unten verwischt
          const kante = 0.02 + Math.sin(u * 7) * 0.05 + (hash(Math.floor(x / 4), 7) - 0.5) * 0.05;
          mask *= 1 - smooth(kante - 0.06, kante + 0.04, v);
        }
        let ink = 0;
        if (mask > 0) {
          ink = smooth(0.42, 0.62, linie(u, v, o));
          if (hash(x, y) < 0.05) ink *= 0.35;   // Poren
          ink *= mask;
        }
        const i = (y * W + x) * 4;
        if (bg) {
          px[i] = bg[0] + (col[0] - bg[0]) * ink; px[i + 1] = bg[1] + (col[1] - bg[1]) * ink; px[i + 2] = bg[2] + (col[2] - bg[2]) * ink; px[i + 3] = 255;
        } else {
          px[i] = col[0]; px[i + 1] = col[1]; px[i + 2] = col[2]; px[i + 3] = 255 * ink;
        }
      }
    }
    g.putImageData(img, 0, 0);

    const toX = u => cx + u * R, toY = v => cy + v * R;
    const lw = P * R * 0.45;
    // Insel: Stück Linie wegradieren und ein kurzes, freies Stück hineinsetzen
    if (o.insel) {
      radiere(g, toX(FORK.u), toY(FORK.v), P * R * 1.3, P * R * 0.8, bg);
      g.fillStyle = o.farbe;
      g.beginPath(); g.ellipse(toX(FORK.u), toY(FORK.v), P * R * 0.6, lw * 0.6, -0.3, 0, TAU); g.fill();
    }
    if (o.punkt) {
      const pu = -0.18, pv = 0.62;
      radiere(g, toX(pu), toY(pv), P * R * 0.8, P * R * 0.6, bg);
      g.fillStyle = o.farbe;
      g.beginPath(); g.arc(toX(pu), toY(pv), lw * 0.75, 0, TAU); g.fill();
    }
    if (o.narbe) {
      g.save();
      g.lineCap = 'round';
      if (bg) { g.strokeStyle = o.hintergrund; } else { g.globalCompositeOperation = 'destination-out'; g.strokeStyle = '#000'; }
      g.lineWidth = lw * 1.6;
      g.beginPath(); g.moveTo(toX(-0.55), toY(0.55)); g.quadraticCurveTo(toX(-0.05), toY(0.68), toX(0.45), toY(0.80)); g.stroke();
      g.restore();
    }
    if (o.markiere) {
      g.save();
      g.strokeStyle = o.markFarbe || o.farbe; g.lineWidth = Math.max(2, W / 120); g.setLineDash([W / 40, W / 60]);
      g.beginPath(); g.arc(toX(FORK.u), toY(FORK.v), P * R * 1.9, 0, TAU); g.stroke();
      g.restore();
    }
  }

  function radiere(g, x, y, rx, ry, bg) {
    g.save();
    if (bg) { g.fillStyle = 'rgb(' + bg.join(',') + ')'; } else { g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; }
    g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill();
    g.restore();
  }

  function parseColor(c) {
    const h = c.replace('#', '');
    const f = h.length === 3 ? h.split('').map(x => x + x).join('') : h;
    return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
  }

  window.Fingerabdruck = { zeichne };
})();
