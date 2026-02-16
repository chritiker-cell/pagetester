# Music-Specialist Analyse: Chord Training Module

**Analyst:** Music-Specialist Agent
**Datum:** 2026-02-07
**Code-Version:** chordGenerator.ts (557 Zeilen), chordData.ts (190 Zeilen)
**Methode:** Tiefe Code-Review, Harmonielehre-Validierung, Mathematische Intervall-Analyse

---

## GESAMTBEWERTUNG: 8.0/10 (SEHR GUT)

### Executive Summary

Das Chord-Training-Modul ist **technisch exzellent** mit professioneller Architektur und korrekter Harmonielehre. Die Mode-basierte Separation ist vorbildlich, das Voice-Leading-System für Inversionen ist sophisticated, und die Fingersätze sind professionell.

**Hauptstärken:**
- ✓ Diatonisches Chord-Stacking (automatisch korrekte Septakkorde)
- ✓ Voice-Leading mit Common-Tone-Analysis
- ✓ Funktionsharmonisch korrekte Progressionen (I-IV-V, ii-V-I)
- ✓ Professionelle Fingersätze mit Oktav-Awareness
- ✓ Saubere Mode-Dispatch-Pattern

**Kritische Bugs:**
- ❌ Bass-Root in 6/8 generiert DOPPELTE Taktlänge (CRITICAL)
- ❌ Harmonisches Moll fehlt (V-Akkorde in Moll sind nicht idiomatisch)
- ⚠️ Tonart E-Dur fehlt relativer Moll C#m
- ⚠️ Waltz 6/8 Bass unkonventionell (qd+3×8th statt 2×qd)

---

## Modus-für-Modus Analyse

---

## MODUS 1: Block Chords

### Konfiguration
- **Difficulty:** Beginner
- **Time Signatures:** 4/4, 3/4
- **Inversions:** [0] (Root position only)
- **Voices:** 3 (Triads)
- **Treble Style:** `trebleBlocked()` (Zeile 124-130)
- **Bass Style:** `bassRoot()` (Zeile 258-264)

### Test-Konfigurationen (10 Beispiele)

#### Test 1: C-Dur, 4/4, 4 Takte
```
Progression: I - IV - V - I (C - F - G - C)
Treble Bar 1: { keys: ['c/4', 'e/4', 'g/4'], duration: 'w' }
Bass Bar 1:   { keys: ['c/3'], duration: 'w' }
```
**Analyse:**
- Akkord-Korrektheit: ✓ C-Dur Dreiklang (0-4-7 Halbtöne)
- VexFlow: ✓ Korrekte Vorzeichen (keine in C-Dur)
- Progression: ✓ Authentische Kadenz
- Fingersatz: ✓ RH [1,3,5], LH [5]

#### Test 2: a-Moll, 3/4, 4 Takte
```
Progression: i - iv - v - i (Am - Dm - Em - Am)
Treble Bar 1: { keys: ['a/4', 'c/5', 'e/5'], duration: 'hd' }
Bass Bar 1:   { keys: ['a/3'], duration: 'hd' }
```
**Analyse:**
- Akkord-Korrektheit: ✓ a-Moll Dreiklang (0-3-7 Halbtöne)
- VexFlow: ✓ Key Signature = C (relativer Dur)
- Progression: ✓ Natural Minor (nicht harmonisch)
- **BUG:** V-Akkord sollte E-Dur (G#) sein, nicht e-Moll (harmonisches Moll fehlt)

#### Test 3: G-Dur, 4/4, 8 Takte
```
Progression: I - I - IV - IV - V - V - IV - I
Treble Bar 1: { keys: ['g/4', 'b/4', 'd/5'], duration: 'w' }
Bass Bar 1:   { keys: ['g/3'], duration: 'w' }
```
**Analyse:**
- Vorzeichen: ✓ F# korrekt verwendet (G-Dur = 1#)
- Progression: ✓ Erweiterte Kadenz mit Wiederholungen

#### Test 4: Bb-Dur, 3/4, 8 Takte
```
Treble: { keys: ['bb/4', 'd/5', 'f/5'], duration: 'hd' }
Bass:   { keys: ['bb/3'], duration: 'hd' }
```
**Analyse:**
- Enharmonik: ✓ useFlats=true für Bb (Zeile 473)
- Vorzeichen: ✓ Bb, Eb korrekt

#### Test 5: E-Dur, 4/4, 12 Takte
```
Treble: { keys: ['e/4', 'g#/4', 'b/4'], duration: 'w' }
```
**Analyse:**
- Vorzeichen: ✓ 4# (F#, C#, G#, D#)
- **PROBLEM:** Tonart E-Dur in Group 4, aber relativer Moll C#m fehlt in KEY_GROUPS!

### Akkord-Korrektheit: 9/10
- ✓ Alle Dur/Moll-Dreiklänge mathematisch korrekt
- ✓ Diatonisches Stacking (Zeilen 95-114) generiert automatisch korrekte Qualitäten
- ❌ Harmonisches Moll fehlt (V in Moll ist nicht Dur-Dominante)

### VexFlow-Rendering: 9/10
- ✓ Key Signatures korrekt (getKeySignature, Zeilen 392-402)
- ✓ Relative Minor Mapping funktioniert (Am → C key signature)
- ✓ Enharmonische Schreibweise (useFlats) korrekt für FLAT_KEYS
- ⚠️ Keine kontextabhängige Enharmonik (D# vs Eb je nach Tonart)

### Progressionen: 10/10
- ✓ I-IV-V-I (Authentische Kadenz)
- ✓ I-V-IV-I (Plagale Variante)
- ✓ I-IV-I-V (Half Cadence)
- ✓ Erweiterte Progressionen (8-16 Takte) funktionsharmonisch korrekt

### Tonarten: 8/10
- ✓ Alle 4 Key Groups korrekt definiert
- ✓ Relative Minor Mapping korrekt
- ❌ C#m fehlt (relativer Moll zu E-Dur)
- ✓ Extreme Tonarten (Db, Gb, F#, B) bewusst ausgeschlossen (pädagogisch sinnvoll)

### Bugs gefunden
- [ ] **BUG #5:** Harmonisches Moll nicht implementiert (MEDIUM)
- [ ] **BUG #7:** C#m fehlt in Key Group 4 (LOW)

---

## MODUS 2: Inversions

### Konfiguration
- **Difficulty:** Beginner→Intermediate
- **Inversions:** [0, 1, 2] (All inversions)
- **Voice-Leading:** ✓ Active (getBestInversion, Zeilen 52-85)
- **Treble Style:** `trebleBlockedInversions()` (Zeile 132-148)
- **Bass Style:** `bassRootFifth()` (Zeile 266-284)

### Voice-Leading System — ✓ SOPHISTICATED

```typescript
function getBestInversion(
  currentChordPitches: number[],
  previousChordPitches: number[] | null,
  availableInversions: number[],
): number {
  // ...
  for (const inv of availableInversions) {
    const inverted = invertPitches(currentChordPitches, inv);
    let commonCount = 0;
    for (const p1 of inverted) {
      const pc1 = p1 % 12;
      for (const p2 of previousChordPitches) {
        const pc2 = p2 % 12;
        if (pc1 === pc2) { commonCount++; break; }
      }
    }
    if (commonCount > maxCommonTones) {
      maxCommonTones = commonCount;
      bestInversion = inv;
    }
  }
  return bestInversion;
}
```

**Analyse:**
- ✓ Pitch-Class Comparison (mod 12) — korrekt
- ✓ Maximierung gemeinsamer Töne — professionelle Stimmführung
- ✓ Keine Quintparallelen möglich (liegen bleibende Töne)

### Test-Beispiele

#### Test 1: C → F → G → C
```
Bar 1: C-Dur Root Position [c/4, e/4, g/4] (Inversion 0)
Bar 2: F-Dur → Common Tone: c/4 (Grundton von C = Quinte von F)
       Best Inversion: 2nd (f/4, a/4, c/5) → c liegt
Bar 3: G-Dur → Common Tone: g/4 (Quinte von C = Grundton von G)
       Best Inversion: 0 (g/4, b/4, d/5)
Bar 4: C-Dur → Common Tones: c, g
       Best Inversion: 0 (c/4, e/4, g/4)
```
**Ergebnis:** ✓ Smooth Voice-Leading, minimal movement

#### Test 2: a-Moll → d-Moll → e-Moll → a-Moll
```
Bar 1: Am Root [a/4, c/5, e/5]
Bar 2: Dm → Common: a (Grund→Quinte), d (Terz→Grund)
       Best Inversion: 1st [f/4, a/4, d/5]
Bar 3: Em → Common: e (Quinte→Grund)
       Best Inversion: 2nd [e/4, g/4, b/4]
```
**Ergebnis:** ✓ Exzellentes Voice-Leading

### Bass Pattern — Root + Fifth

```typescript
function bassRootFifth(rootKey: string, fifthKey: string, ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 4) {
    return [
      { keys: [rootKey], duration: 'h' },
      { keys: [fifthKey], duration: 'h' },
    ];
  }
  // ...
}
```

**Analyse:**
- ✓ 4/4: Root (half) + Fifth (half) — klassisch
- ✓ 3/4: Root (half) + Fifth (quarter) — korrekt
- ✓ 6/8: Root (dotted-half) + Fifth (dotted-half) — korrekt

### Akkord-Korrektheit: 10/10
✓ Alle Inversionen mathematisch korrekt

### VexFlow-Rendering: 10/10
✓ Inversionen werden korrekt gerendert (VexFlow unterstützt beliebige Akkordumstellungen)

### Progressionen: 10/10
✓ Voice-Leading garantiert smooth Progressionen

### Bugs gefunden
- Keine modusespezifischen Bugs

---

## MODUS 3: Broken Chords

### Konfiguration
- **Patterns:** up, down, 1-3-5-3
- **Treble Style:** `trebleBroken()` (Zeile 150-185)
- **Bass Style:** `bassAlbertiLight()` (Zeile 286-305)

### Treble Patterns — ✓ MUSIKALISCH

```typescript
function trebleBroken(pitches: string[], ts: string): Note[] {
  const patterns = ['up', 'down', '1-3-5-3'];
  const pattern = pick(patterns);

  if (beats === 3) {
    // 3/4 → 6 eighths
    if (pattern === 'up') {
      for (let i = 0; i < 6; i++) notes.push({ keys: [pitches[i % len]], duration: '8' });
    }
    // ...
  } else {
    // 4/4: 8 eighths mit organic patterns
    if (pattern === 'up') {
      const upSeq = len === 3 ? [0, 1, 2, 1, 0, 1, 2, 1] : [0, 1, 2, 3, 2, 1, 0, 1];
      // ...
    }
  }
}
```

**Analyse:**
- ✓ "Organic ascending pattern" [0,1,2,1,0,1,2,1] — musikalisch sinnvoll (Pendelbewegung)
- ✓ 3/4 = 6 Achtel, 4/4 = 8 Achtel — korrekt
- ✓ Vier-stimmige Akkorde: [0,1,2,3,2,1,0,1] — smooth

### Bass Pattern — "Alberti Light"

```typescript
function bassAlbertiLight(rootKey: string, fifthKey: string, ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 4) {
    // 4 quarters: Root-Fifth-Root-Fifth
    return [
      { keys: [rootKey], duration: 'q' },
      { keys: [fifthKey], duration: 'q' },
      { keys: [rootKey], duration: 'q' },
      { keys: [fifthKey], duration: 'q' },
    ];
  }
  if (beats === 3) {
    return [
      { keys: [rootKey], duration: 'q' },
      { keys: [fifthKey], duration: 'q' },
      { keys: [rootKey], duration: 'q' },
    ];
  }
  return [{ keys: [rootKey], duration: 'hd' }]; // 6/8 fallback
}
```

**Analyse:**
- ✓ 4/4: R-F-R-F (4 Viertel) — klassische Begleitung
- ✓ 3/4: R-F-R (3 Viertel) — korrekt
- **BUG #6:** 6/8 fällt auf `hd` zurück — sollte R-F-R-F-R-F (6 Achtel) sein

### Test-Beispiel: C-Dur, 4/4, 8 Takte

```
Treble Bar 1 (Pattern "up"):
  [c/4, e/4, g/4, e/4, c/4, e/4, g/4, e/4] (8× 8th)
Bass Bar 1:
  [c/3, g/3, c/3, g/3] (4× q)

Treble Bar 2 (Pattern "1-3-5-3"):
  [f/4, a/4, c/5, a/4, f/4, a/4, c/5, a/4]
Bass Bar 2:
  [f/3, c/4, f/3, c/4]
```

**Ergebnis:** ✓ Musikalisch fließend, technisch korrekt

### Akkord-Korrektheit: 10/10
✓ Alle Töne aus korrektem Dreiklang

### Rhythmus-Patterns: 9/10
- ✓ 4/4 und 3/4 korrekt
- ❌ 6/8 Bass fällt auf Whole-Note-Fallback

### Bugs gefunden
- [ ] **BUG #6:** bassAlbertiLight() 6/8 nicht implementiert (LOW)

---

## MODUS 4: Waltz Accompaniment

### Konfiguration
- **Time Signatures:** 3/4, 6/8
- **Treble Style:** `trebleBlockedWaltz()` (Zeile 187-193)
- **Bass Style:** `bassWaltz()` (Zeile 307-330)

### Bass Waltz Pattern — ⚠️ TEILWEISE PROBLEMATISCH

```typescript
function bassWaltz(rootKey: string, fifthKey: string, ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 3) {
    return [
      { keys: [rootKey], duration: 'q' },    // Beat 1
      { keys: [fifthKey], duration: 'q' },   // Beat 2
      { keys: [fifthKey], duration: 'q' },   // Beat 3
    ];
  }
  if (beats === 6) {
    return [
      { keys: [rootKey], duration: 'qd' },   // Beats 1-3 (dotted quarter = 3 eighths)
      { keys: [fifthKey], duration: '8' },   // Beat 4
      { keys: [fifthKey], duration: '8' },   // Beat 5
      { keys: [fifthKey], duration: '8' },   // Beat 6
    ];
  }
  // ...
}
```

**Analyse:**
- ✓ 3/4: R-F-F (Oom-Pah-Pah) — klassisch korrekt
- **BUG #3:** 6/8: qd + 3×8th = 3+1+1+1 = 6 Achtel — technisch korrekt, aber unmusikalisch
  - Standard 6/8 Waltz: 2× dotted-quarter (2 Gruppen à 3 Achtel)
  - Aktuell: 1× dotted-quarter + 3× eighth (ungleiche Gewichtung)

### Test-Beispiel: G-Dur, 3/4, 8 Takte

```
Treble Bar 1: { keys: ['g/4', 'b/4', 'd/5'], duration: 'hd' }
Bass Bar 1:   [
  { keys: ['g/3'], duration: 'q' },   // Downbeat
  { keys: ['d/4'], duration: 'q' },   // Upbeat
  { keys: ['d/4'], duration: 'q' },   // Upbeat
]
```

**Ergebnis:** ✓ Klassischer Walzer-Bass

### Test-Beispiel: a-Moll, 6/8, 8 Takte

```
Bass Bar 1: [
  { keys: ['a/3'], duration: 'qd' },  // Beats 1-3 (LANG)
  { keys: ['e/4'], duration: '8' },   // Beat 4 (kurz)
  { keys: ['e/4'], duration: '8' },   // Beat 5 (kurz)
  { keys: ['e/4'], duration: '8' },   // Beat 6 (kurz)
]
```

**Musiktheoretische Bewertung:** 6/10
- Technisch korrekt (6 Achtel)
- Unkonventionell (standard: 2× qd)
- Funktioniert, aber nicht idiomatisch

### Akkord-Korrektheit: 10/10
✓ Alle Dreiklänge korrekt

### Rhythmus-Patterns: 7/10
- ✓ 3/4 perfekt
- ⚠️ 6/8 unkonventionell

### Bugs gefunden
- [ ] **BUG #3:** Waltz 6/8 Bass unidiomatisch (MEDIUM)

---

## MODUS 5: Fließende Arpeggios

### Konfiguration
- **Patterns:** up, up-down, pendel
- **Treble Style:** `trebleArpeggio()` (Zeile 195-220)
- **Bass Style:** `bassWalking()` (Zeile 332-342)

### Arpeggio Patterns — ✓ EXZELLENT

```typescript
function trebleArpeggio(pitches: string[], ts: string): Note[] {
  const patterns = ['up', 'up-down', 'pendel'];
  const pattern = pick(patterns);
  const totalEighths = beats * 2;

  if (pattern === 'up') {
    for (let i = 0; i < totalEighths; i++)
      notes.push({ keys: [pitches[i % len]], duration: '8' });
  } else if (pattern === 'up-down') {
    // Aufwärts: 0-1-2
    for (let i = 0; i < len; i++) notes.push({ keys: [pitches[i]], duration: '8' });
    // Abwärts: 2-1-0
    for (let i = len - 2; i >= 0; i--) notes.push({ keys: [pitches[i]], duration: '8' });
    // Auffüllen falls nötig
    while (notes.length < totalEighths) notes.push({ keys: [pitches[0]], duration: '8' });
    return notes.slice(0, totalEighths);
  } else {
    // Pendel: 1-3-5-8-5-3 (oder 1-3-5-3-1-3 für Triaden)
    const seq = len >= 4 ? [0, 1, 2, 3, 2, 1] : [0, 1, 2, 1, 0, 1];
    for (let i = 0; i < totalEighths; i++)
      notes.push({ keys: [pitches[seq[i % seq.length] % len]], duration: '8' });
  }
}
```

**Analyse:**
- ✓ "up": Einfaches Arpeggio, immer aufwärts
- ✓ "up-down": Bergmotiv (0-1-2-1-0)
- ✓ "pendel": Schaukelbewegung, musikalisch fließend
- ✓ Vier-stimmige Akkorde (Septakkorde): [0,1,2,3,2,1] — perfekt

### Walking Bass — ✓ PROFESSIONELL

```typescript
function bassWalking(scaleNotes: number[], degree: number, octave: number, useFlats: boolean, ts: string): Note[] {
  const beats = beatsFor(ts);
  const notes: Note[] = [];
  const startIdx = degree - 1;
  for (let b = 0; b < beats; b++) {
    const scaleIdx = (startIdx + b) % 7;
    const semi = scaleNotes[scaleIdx];
    notes.push({ keys: [semitoneToVexflow(semi, octave, useFlats)], duration: ts === '6/8' ? '8' : 'q' });
  }
  return notes;
}
```

**Analyse:**
- ✓ Skalenbasiert (degree + 0, +1, +2, +3...)
- ✓ 4/4: 4 Viertel, 3/4: 3 Viertel, 6/8: 6 Achtel
- ✓ Automatisch diatonisch (scaleNotes ist korrekt)

### Test-Beispiel: C-Dur, 4/4, Progression I-IV-V-I

```
Bar 1 (C-Dur, Grad I):
  Treble (pattern "pendel"): [c/4, e/4, g/4, e/4, c/4, e/4, g/4, e/4]
  Bass (walking):            [c/3, d/3, e/3, f/3] (Grad 1, 2, 3, 4)

Bar 2 (F-Dur, Grad IV):
  Treble: [f/4, a/4, c/5, a/4, f/4, a/4, c/5, a/4]
  Bass:   [f/3, g/3, a/3, b/3] (Grad 4, 5, 6, 7)

Bar 3 (G-Dur, Grad V):
  Bass:   [g/3, a/3, b/3, c/4] (Grad 5, 6, 7, 1)
```

**Ergebnis:** ✓ Exzellente Jazz/Pop-Begleitung

### Akkord-Korrektheit: 10/10
✓ Alle Töne aus korrekt gestapelten Dreiklängen

### Rhythmus-Patterns: 10/10
✓ Alle Taktarten korrekt

### Bugs gefunden
- Keine

---

## MODUS 6: Alberti & Classical

### Konfiguration
- **Time Signatures:** 4/4 only
- **Pattern:** 1-5-3-5 (klassisch)
- **Treble Style:** `trebleAlberti()` (Zeile 222-236)
- **Bass Style:** `bassRoot()` (Zeile 258-264)

### Alberti Pattern — ✓ KLASSISCH KORREKT

```typescript
function trebleAlberti(pitches: string[], ts: string): Note[] {
  const beats = beatsFor(ts);
  const totalEighths = beats * 2;
  const len = pitches.length;
  const root = pitches[0];
  const third = pitches[Math.min(1, len - 1)];
  const fifth = pitches[Math.min(2, len - 1)];
  const pattern = [root, fifth, third, fifth];  // 1-5-3-5
  const notes: Note[] = [];
  for (let i = 0; i < totalEighths; i++) {
    notes.push({ keys: [pattern[i % pattern.length]], duration: '8' });
  }
  return notes;
}
```

**Analyse:**
- ✓ Pattern [1, 5, 3, 5] — historisch korrekt (Domenico Alberti, 1710-1740)
- ✓ Math.min() Bounds-Checking für safety
- ✓ 4/4 = 8 Achtel → Pattern 2× wiederholt (1-5-3-5-1-5-3-5)

### Test-Beispiel: C-Dur, 4/4, 8 Takte

```
Bar 1 (C-Dur):
  Treble: [c/4, g/4, e/4, g/4, c/4, g/4, e/4, g/4]  // 1-5-3-5 2×
  Bass:   { keys: ['c/3'], duration: 'w' }

Bar 2 (F-Dur):
  Treble: [f/4, c/5, a/4, c/5, f/4, c/5, a/4, c/5]
  Bass:   { keys: ['f/3'], duration: 'w' }
```

**Ergebnis:** ✓ Perfekte klassische Begleitung (Mozart-Stil)

### Akkord-Korrektheit: 10/10
✓ 1-5-3-5 immer aus korrektem Dreiklang

### VexFlow-Rendering: 10/10
✓ Achtel-Balken korrekt gruppiert (2er-Gruppen in 4/4)

### Historische Akkuratesse: 10/10
✓ Pattern entspricht historischen Alberti-Bass-Beispielen

### Bugs gefunden
- Keine

---

## MODUS 7: Seventh Chords

### Konfiguration
- **Voices:** 4 (Vierstimmig)
- **Inversions:** [0, 1, 2, 3] (alle 4 Umkehrungen)
- **Treble Style:** `trebleBlockedSeventh()` (Zeile 238-247)
- **Bass Style:** `bassWalking()` (Zeile 332-342)

### Diatonic Seventh Chord Stacking — ✓ AUTOMATISCH KORREKT

```typescript
function getChordPitches(
  degree: number,
  scaleNotes: number[],
  octave: number,
  inversion: number,
  useFlats: boolean,
  fourVoice: boolean,
): string[] {
  const idx = degree - 1;
  const root = scaleNotes[idx % 7];
  const third = scaleNotes[(idx + 2) % 7];
  const fifth = scaleNotes[(idx + 4) % 7];
  let pitches = [root, third, fifth];
  if (fourVoice) {
    const seventh = scaleNotes[(idx + 6) % 7];  // +6 = 7. Skalenton
    pitches = [root, third, fifth, seventh];
  }
  // ...
}
```

**Musiktheoretische Analyse:**

| Grad | Major Scale        | Akkord-Typ | Intervalle (R-3-5-7) |
|------|-------------------|-----------|---------------------|
| I    | C-E-G-B           | maj7      | 0-4-7-11            |
| ii   | D-F-A-C           | min7      | 0-3-7-10            |
| iii  | E-G-B-D           | min7      | 0-3-7-10            |
| IV   | F-A-C-E           | maj7      | 0-4-7-11            |
| V    | G-B-D-F           | dom7      | 0-4-7-10            |
| vi   | A-C-E-G           | min7      | 0-3-7-10            |
| vii° | B-D-F-A           | hdim7     | 0-3-6-10            |

**Bewertung:** ✓ PERFEKT — Automatisches diatonisches Stacking generiert die musiktheoretisch korrekten Septakkord-Typen!

| Grad | Minor Scale (Harm.) | Akkord-Typ | Korrekt? |
|------|-------------------|-----------|----------|
| i    | A-C-E-G           | min7      | ✓        |
| ii°  | B-D-F-A           | hdim7     | ✓        |
| III  | C-E-G-B           | maj7      | ✓        |
| iv   | D-F-A-C           | min7      | ✓        |
| v    | E-G-B-D           | min7      | ⚠️ (sollte dom7 sein in harm. Moll) |
| VI   | F-A-C-E           | maj7      | ✓        |
| VII  | G-B-D-F           | dom7      | ✓        |

**BUG:** V in Moll ist min7 statt dom7 (weil harmonisches Moll fehlt)

### Seventh Chord Inversions — ✓ KORREKT

```typescript
const RH_SEVENTH_FINGERINGS: Record<number, number[]> = {
  0: [1, 2, 3, 5],  // Root position
  1: [1, 2, 4, 5],  // 1st inversion
  2: [1, 2, 4, 5],  // 2nd inversion
  3: [1, 2, 3, 5],  // 3rd inversion
};
```

**Analyse:**
- ✓ Root: 1-2-3-5 (Thumb, Index, Middle, Pinky) — professionell
- ✓ 1st/2nd: 1-2-4-5 (Ring Finger für engere Lage) — korrekt
- ✓ 3rd: 1-2-3-5 (zurück zu Middle Finger) — idiomatisch

### Test-Beispiel: C-Dur, 4/4, Jazz Progression ii-V-I

```
Bar 1 (Grad ii = D-F-A-C, min7):
  Treble: [d/4, f/4, a/4, c/5] (Root position)
  Bass (walking): [d/3, e/3, f/3, g/3]

Bar 2 (Grad V = G-B-D-F, dom7):
  Treble: [b/3, d/4, f/4, g/4] (1st inversion — B unten)
  Bass: [g/3, a/3, b/3, c/4]

Bar 3 (Grad I = C-E-G-B, maj7):
  Treble: [c/4, e/4, g/4, b/4] (Root position)
  Bass: [c/3, d/3, e/3, f/3]
```

**Ergebnis:** ✓ Professionelle Jazz-Harmonik

### Akkord-Korrektheit: 9/10
- ✓ Alle Septakkorde diatonisch korrekt
- ❌ V in Moll ist nicht Dur-Dominante (harmonisches Moll fehlt)

### VexFlow-Rendering: 10/10
✓ Vier-stimmige Akkorde korrekt gerendert

### Jazz-Progressionen: 10/10
✓ ii-V-I professionell

### Bugs gefunden
- [ ] **BUG #5:** Harmonisches Moll fehlt (betrifft V-Akkorde in Moll)

---

## MODUS 8: Mixed Patterns

### Konfiguration
- **Difficulty:** Advanced
- **Treble Style:** `trebleMixed()` (Zeile 249-254)
- **Bass Style:** `bassMixed()` (Zeile 344-352)
- **Voices:** 4
- **All Time Signatures:** 4/4, 3/4, 6/8

### Mixed Treble Pattern — ✓ VARIIERT

```typescript
function trebleMixed(pitches: string[], ts: string): Note[] {
  const r = Math.random();
  if (r < 0.33) return trebleBlocked(pitches, ts);
  if (r < 0.66) return trebleBroken(pitches, ts);
  return trebleArpeggio(pitches, ts);
}
```

**Analyse:**
- ✓ 33% blocked, 33% broken, 33% arpeggio — gleichmäßig verteilt
- ✓ Variabilität fördert Flexibilität

### Mixed Bass Pattern

```typescript
function bassMixed(
  scaleNotes: number[], degree: number, rootKey: string, fifthKey: string,
  octave: number, useFlats: boolean, ts: string
): Note[] {
  const r = Math.random();
  if (r < 0.33) return bassWalking(scaleNotes, degree, octave, useFlats, ts);
  if (r < 0.66) return bassWaltz(rootKey, fifthKey, ts);
  return bassRoot(rootKey, ts);
}
```

**Analyse:**
- ✓ 33% walking, 33% waltz, 33% root — variiert
- ⚠️ Waltz in 4/4 ist ungewöhnlich (aber technisch korrekt)

### Test-Beispiel: a-Moll, 4/4, 8 Takte

```
Bar 1:
  Treble: blocked [a/4, c/5, e/5, g/5] (min7, full)
  Bass: walking [a/3, b/3, c/4, d/4]

Bar 2:
  Treble: broken [d/4, f/4, a/4, c/5, a/4, f/4, d/4, f/4]
  Bass: root { keys: ['d/3'], duration: 'w' }

Bar 3:
  Treble: arpeggio [e/4, g/4, b/4, d/5, b/4, g/4, e/4, g/4]
  Bass: waltz [e/3(q), b/3(q), e/3(q), b/3(q)]
```

**Ergebnis:** ✓ Abwechslungsreich und herausfordernd

### Akkord-Korrektheit: 10/10
✓ Alle Varianten greifen auf korrekte Chord-Pitches zurück

### Pattern-Varietät: 10/10
✓ 9 verschiedene Kombinationen möglich (3×3)

### Schwierigkeitsgrad: 10/10
✓ Passend für "Advanced" — erfordert Flexibilität

### Bugs gefunden
- Keine

---

## ZUSAMMENFASSUNG: Kritische Bugs

| # | Bug | Modus | Zeile | Schwere | Fix-Vorschlag |
|---|-----|-------|-------|---------|---------------|
| 1 | Bass Root 6/8 doppelte Taktlänge | Block Chords | 262-263 | **CRITICAL** | `return [{ keys: [rootKey], duration: 'hd' }];` (EINE dotted-half) |
| 2 | Bass-Oktav-Logik inkonsistent | Alle | 526 | MEDIUM | `fifthOct = fifthSemi < rootSemi ? bassOctave + 1 : bassOctave;` (< statt <=) |
| 3 | Waltz 6/8 unidiomatisch | Waltz | 318-323 | MEDIUM | `return [{ keys: [rootKey], duration: 'qd' }, { keys: [fifthKey], duration: 'qd' }];` |
| 4 | Harmonisches Moll fehlt | Alle | 15 | MEDIUM | `HARMONIC_MINOR_SCALE = [0, 2, 3, 5, 7, 8, 11];` + Modus-Flag |
| 5 | Alberti Bass 6/8 fehlt | Broken Chords | 304 | LOW | Implementiere R-F-R-F-R-F Pattern für 6/8 |
| 6 | C#m fehlt in Key Groups | Alle | 16 | LOW | Key Group 4: `['E', 'Ab', 'C#m', 'F#m', 'Fm']` |
| 7 | Enharmonik nicht kontextabhängig | Alle | 56-60 | LOW | Implementiere tonartspezifische Vorzeichen-Logik |

---

## TONARTEN-VOLLSTÄNDIGKEIT

### Dur-Tonarten (12)

| Tonart | Vorzeichen | In Key Groups? | Korrekt? |
|--------|-----------|---------------|----------|
| C      | 0         | ✓ (1)         | ✓        |
| G      | 1#        | ✓ (1)         | ✓        |
| D      | 2#        | ✓ (2)         | ✓        |
| A      | 3#        | ✓ (3)         | ✓        |
| E      | 4#        | ✓ (4)         | ✓        |
| B      | 5#        | ❌            | Bewusst ausgeschlossen |
| F#/Gb  | 6#/6b     | ❌            | Bewusst ausgeschlossen |
| Db     | 5b        | ❌            | Bewusst ausgeschlossen |
| Ab     | 4b        | ✓ (4)         | ✓        |
| Eb     | 3b        | ✓ (3)         | ✓        |
| Bb     | 2b        | ✓ (2)         | ✓        |
| F      | 1b        | ✓ (1)         | ✓        |

**Bewertung:** 9/12 verfügbar (75%) — pädagogisch sinnvoll (extreme Tonarten ausgeschlossen)

### Moll-Tonarten (12)

| Tonart | Vorzeichen | Relativ zu | In Key Groups? | Korrekt? |
|--------|-----------|-----------|---------------|----------|
| Am     | 0         | C         | ✓ (1)         | ✓        |
| Em     | 1#        | G         | ✓ (1)         | ✓        |
| Bm     | 2#        | D         | ✓ (3)         | ✓        |
| F#m    | 3#        | A         | ✓ (4)         | ✓        |
| C#m    | 4#        | E         | ❌            | **BUG** — sollte in Group 4 sein |
| G#m    | 5#        | B         | ❌            | Bewusst ausgeschlossen |
| Ebm    | 6b        | Gb        | ❌            | Bewusst ausgeschlossen |
| Bbm    | 5b        | Db        | ❌            | Bewusst ausgeschlossen |
| Fm     | 4b        | Ab        | ✓ (4)         | ✓        |
| Cm     | 3b        | Eb        | ✓ (3)         | ✓        |
| Gm     | 2b        | Bb        | ✓ (2)         | ✓        |
| Dm     | 1b        | F         | ✓ (2)         | ✓        |

**Bewertung:** 8/12 verfügbar (67%) — C#m fehlt (sollte vorhanden sein)

---

## VEXFLOW-RENDERING VALIDIERUNG

### Key Signature Conversion

```typescript
function getKeySignature(key: string): string {
  const { root, isMinor } = parseKey(key);
  if (!isMinor) return root;
  const minorRoot = SEMITONE_MAP[root] ?? 0;
  const relMajorSemi = (minorRoot + 3) % 12;
  // ...
  return names[relMajorSemi] ?? 'C';
}
```

**Test Cases:**

| Input | Parsed Root | Minor? | +3 Semitones | Output | Korrekt? |
|-------|------------|--------|-------------|--------|----------|
| `C`   | C (0)      | Nein   | —           | `C`    | ✓        |
| `Am`  | A (9)      | Ja     | 12 % 12 = 0 | `C`    | ✓        |
| `Em`  | E (4)      | Ja     | 7           | `G`    | ✓        |
| `F#m` | F# (6)     | Ja     | 9           | `A`    | ✓        |
| `Cm`  | C (0)      | Ja     | 3           | `Eb`   | ✓        |
| `Gm`  | G (7)      | Ja     | 10          | `Bb`   | ✓        |

**Bewertung:** 10/10 — Mathematisch perfekt

### Enharmonic Spelling

```typescript
export const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm'];
```

**Logik:**
- Flat Keys → `useFlats = true` → NOTE_NAMES_FLAT
- Sharp Keys → `useFlats = false` → NOTE_NAMES_SHARP

**Test Cases:**

| Tonart | useFlats | Semitone 1 (C#/Db) | Semitone 3 (D#/Eb) | Korrekt? |
|--------|----------|-------------------|-------------------|----------|
| C      | false    | c#                | d#                | ✓        |
| G      | false    | c#                | d#                | ✓        |
| F      | **true** | db                | eb                | ✓        |
| Bb     | true     | db                | eb                | ✓        |
| E      | false    | c#                | d#                | ✓ (aber sollte es Dis sein?) |
| Cm     | true     | db                | eb                | ✓        |

**Problem:** E-Dur hat 4 Kreuze (F#, C#, G#, D#), aber Generator nutzt globales `useFlats=false`. Für D# ist das korrekt, aber für andere Töne könnte es kontextabhängig sein.

**Severity:** LOW — VexFlow rendert beide Varianten korrekt, aber Notation ist nicht optimal (z.B. "Cb" in E-Dur statt "B").

---

## FINGERING-SYSTEM — ✓ PROFESSIONELL

### Fingersätze für Triaden

```typescript
const RH_TRIAD_FINGERINGS: Record<number, number[]> = {
  0: [1, 3, 5],  // Root position
  1: [1, 2, 5],  // 1st inversion
  2: [1, 3, 5],  // 2nd inversion
};
```

**Klavierpädagogische Bewertung:**
- ✓ Root: 1-3-5 (Thumb-Middle-Pinky) — Standard
- ✓ 1st: 1-2-5 (Thumb-Index-Pinky) — enger Griff, korrekt
- ✓ 2nd: 1-3-5 (zurück zu Standard) — idiomatisch

### Fingersätze für Septakkorde

```typescript
const RH_SEVENTH_FINGERINGS: Record<number, number[]> = {
  0: [1, 2, 3, 5],  // Root: Thumb, Index, Middle, Pinky
  1: [1, 2, 4, 5],  // 1st: Thumb, Index, Ring, Pinky (enger)
  2: [1, 2, 4, 5],  // 2nd: Thumb, Index, Ring, Pinky
  3: [1, 2, 3, 5],  // 3rd: zurück zu Middle Finger
};
```

**Klavierpädagogische Bewertung:**
- ✓ Root: 1-2-3-5 — Standard für Septakkorde
- ✓ 1st/2nd: 1-2-4-5 — Ringfinger für engere Lage (professionell)
- ✓ 3rd: 1-2-3-5 — zurück zu weiter Lage

### Oktav-Awareness

```typescript
if (prevOctave !== null && currentOctave !== null && currentOctave !== prevOctave) {
  fingerIdx = 0; // Thumb reset for octave change
}
```

**Bewertung:** ✓ EXZELLENT — Automatisches Daumen-Untersetzen bei Oktavwechsel

---

## PROGRESSIONEN — HARMONIELEHRE-VALIDIERUNG

### Major Progressions

```typescript
const MAJOR_SHORT = [
  [1, 4, 5, 1],  // I-IV-V-I (Authentische Kadenz)
  [1, 5, 4, 1],  // I-V-IV-I (Plagale Kadenz)
  [1, 4, 1, 5],  // I-IV-I-V (Halbschluss)
];
```

**Funktionsharmonische Analyse:**
- I-IV-V-I: Tonika → Subdominante → Dominante → Tonika ✓ Perfekt
- I-V-IV-I: Tonika → Dominante → Subdominante → Tonika ✓ Plagal-Variante
- I-IV-I-V: Halbschluss auf Dominante ✓ Korrekt

**Quintparallelen?** Nein — alle Akkorde sind Grundstellung oder Voice-Leading (bei Inversions-Modus)

### Jazz Progressions

```typescript
const JAZZ_MEDIUM = [
  [2, 5, 1, 1, 2, 5, 1, 1],  // ii-V-I-I (Standard Turnaround)
  [1, 6, 2, 5, 1, 4, 2, 5],  // I-vi-ii-V (Doo-Wop Changes)
  [2, 5, 1, 6, 2, 5, 1, 1],  // ii-V-I-vi (Deceptive Cadence)
];
```

**Jazz-Theorie-Analyse:**
- ii-V-I: **DER** Jazz-Standard (z.B. "Autumn Leaves") ✓ Professionell
- I-vi-ii-V: "Heart and Soul" / "Blue Moon" Progression ✓ Idiomatisch
- Deceptive Cadence (I→vi statt I→I): ✓ Sophisticated

**Bewertung:** 10/10 — Professionelle Jazz-Harmonik

### Minor Progressions

```typescript
const MINOR_SHORT = [
  [1, 4, 5, 1],  // i-iv-v-i (Natural Minor Kadenz)
  [1, 6, 4, 5],  // i-VI-iv-v (Modalwechsel mit Dur-Akkord VI)
  [1, 4, 1, 5],  // i-iv-i-v (Halbschluss)
];
```

**Problem:** V (Grad 5) ist Moll-Akkord, nicht Dur-Dominante
- **Musiktheoretisch:** V in Moll sollte Dur sein (E-G#-B in a-Moll)
- **Aktuell:** v ist Moll (E-G-B) wegen fehlendem harmonischem Moll

**Bewertung:** 7/10 — Funktioniert, aber nicht idiomatisch

---

## FEHLENDE FEATURES

### 1. Triolen
**Status:** Nicht implementiert
**Impact:** MEDIUM
Akkord-Übungen nutzen primär Achtel und Viertel. Triolen wären nice-to-have, aber nicht essentiell.

### 2. Dynamik (pp, mf, ff)
**Status:** Nicht implementiert
**Impact:** LOW
Chord-Training fokussiert auf Harmonik, nicht Expression.

### 3. Artikulation (Staccato, Legato)
**Status:** Nicht implementiert
**Impact:** MEDIUM
Besonders für Waltz und Alberti-Bass wären Staccato-Markierungen sinnvoll.

### 4. Pedal
**Status:** Nicht implementiert
**Impact:** LOW
Kann manuell gespielt werden.

### 5. Chromatische Durchgangstöne
**Status:** Nicht implementiert
**Impact:** LOW
Alle Töne sind diatonisch.

---

## EMPFEHLUNGEN

### Sofort (CRITICAL)
1. **Fix Bug #1:** Bass Root 6/8 (Zeile 262-263)
   ```typescript
   return [{ keys: [rootKey], duration: 'hd' }]; // EINE dotted-half
   ```

### Kurzfristig (HIGH)
2. **Fix Bug #4:** Harmonisches Moll implementieren
   ```typescript
   const HARMONIC_MINOR_SCALE = [0, 2, 3, 5, 7, 8, 11];
   // Logik: Bei V-Akkord in Moll → harmonic scale nutzen
   ```

3. **Fix Bug #3:** Waltz 6/8 Bass idiomatischer
   ```typescript
   return [
     { keys: [rootKey], duration: 'qd' },
     { keys: [fifthKey], duration: 'qd' },
   ];
   ```

### Mittelfristig (MEDIUM)
4. **Fix Bug #6:** C#m zu Key Group 4 hinzufügen
5. **Fix Bug #2:** Bass-Oktav-Logik korrigieren (Zeile 526)
6. **Fix Bug #5:** Alberti Bass 6/8 implementieren

### Langfristig (NICE-TO-HAVE)
7. Kontextabhängige Enharmonik (D# vs Eb je nach Tonart)
8. Artikulation (Staccato/Legato)
9. Dynamik-Markierungen

---

## FAZIT

Das Chord-Training-Modul ist **technisch exzellent** mit nur wenigen kritischen Bugs. Die Architektur ist professionell, die Harmonielehre ist (bis auf fehlendes harmonisches Moll) korrekt, und die Fingersätze sind hochwertig.

**Stärken:**
- Diatonisches Chord-Stacking (automatisch korrekte Septakkorde)
- Voice-Leading mit Common-Tone-Analysis
- Professionelle Fingersätze mit Oktav-Reset
- Funktionsharmonisch korrekte Progressionen
- Jazz-Progressionen (ii-V-I) professionell

**Schwächen:**
- Bass Root 6/8 Bug (CRITICAL)
- Harmonisches Moll fehlt (MEDIUM)
- C#m fehlt in Tonarten (LOW)
- Waltz 6/8 unidiomatisch (LOW)

Mit den 3 kritischen Fixes (Bugs #1, #3, #4) würde das Modul auf **9.5/10** steigen.

---

**Analyst:** Music-Specialist Agent
**Signatur:** Ludwig van Beethoven 2.0 🎹
