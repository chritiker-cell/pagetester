# Projektplan: Stufe 3 & 4 Überarbeitung + 50 Iterationen (Stufe 3-5)

**Projekt:** ClefBuddy Exercise Generator
**Datum:** 2026-01-31
**Status:** Genehmigung ausstehend
**Verantwortlich:** Projektmanager (PM)

---

## Executive Summary

Nach 50 erfolgreichen Iterationen sollen **Stufe 3 und 4 grundlegend umgebaut** werden, um pädagogisch sinnvolle Akkord-Progression zu erreichen. Anschließend folgen **50 weitere Iterationen** für Stufe 3-5, um jedes generierte Notenblatt individuell zu analysieren und zu optimieren.

**Ziele:**
1. **Stufe 3 (Mittelstufe)** → "Akkorde kennenlernen" (60% geblockt, 40% gebrochen, kein schneller Wechsel)
2. **Stufe 4 (Fortgeschritten)** → "Akkorde flüssig wechseln" (Alberti-Bass, Arpeggien, Synkopen, 15-25% Triolen)
3. **50 Iterationen** für Stufe 3-5 mit piano-pädagogischer Analyse pro Notenblatt

**Geschätzter Aufwand:** 12-16 Stunden (verteilt über 3-4 Tage)

---

## Kontext: Aktueller Stand

### Bereits erreicht (50 Iterationen)
✅ Harmonie-System (I-IV-V-I Progressionen)
✅ Skalenfragmente und Arpeggien
✅ Schnelle Noten schrittweise (16tel/32tel max Sekunde)
✅ Phrasen-Wiederholung (AABA-Form)
✅ Harmonische Bass-Begleitung (Alberti-Bass ab Stufe 4)
✅ Akkordtöne auf starken Schlägen
✅ Pausen eingebaut (10-20% je nach Stufe)
✅ Recovery-System verbessert (ab Quarte)

**Bewertung aktuell:** 8.5/10 (Musikalität, Pädagogik, Spielbarkeit)

### Offene Probleme (Fokus dieses Plans)

**Stufe 3:**
- Akkorde kommen vor, aber zu häufig hintereinander
- Große Sprünge (>Oktave) noch vorhanden
- Triolen/Duolen zu häufig (>10%)
- Akkorde sollten als "Lernmomente" eingesetzt werden, nicht als Standardfall

**Stufe 4:**
- Akkordwechsel sollten häufiger sein (mehrmals pro Takt)
- Triolen-Anteil zu niedrig (<15%)
- Klassische Patterns (Alberti-Bass, gebrochene Oktaven, Synkopen) zu selten
- Große Sprünge sollten dosiert, aber erlaubt sein

---

## Phasenübersicht

| Phase | Beschreibung | Dauer | Agenten | Deliverable |
|-------|--------------|-------|---------|-------------|
| **Phase 1** | Analyse & Design | 2h | Music-Specialist (Piano-Pedagogy-Expert) | Design-Spezifikation |
| **Phase 2** | Implementierung Stufe 3 | 3h | Music-Webapp-Frontend | Code (Stufe 3 Rework) |
| **Phase 3** | Implementierung Stufe 4 | 3h | Music-Webapp-Frontend | Code (Stufe 4 Rework) |
| **Phase 4** | 50 Iterationen (Stufe 3-5) | 4h | Music-Specialist + Frontend | 50 optimierte Generierungen |
| **Phase 5** | Testing & QA | 2h | ClefBuddy-QA-Engineer | Test-Report |

**Gesamt:** ~14 Stunden (3-4 Tage bei 4h/Tag)

---

## Phase 1: Analyse & Design (Piano-Pedagogy-Expert)

### Ziel
Detaillierte pädagogische Spezifikation für Stufe 3 und 4 basierend auf Klavierpädagogik-Prinzipien.

### Tasks

#### Task 1.1: Stufe 3 Spezifikation ("Akkorde kennenlernen")
**Zuständig:** `music-specialist` (als Piano-Pedagogy-Expert)
**Dauer:** 60 Minuten

**Anforderungen:**
1. **Akkord-Frequenz:** Wie oft sollen Akkorde vorkommen?
   - Vorschlag: 1 Akkord pro 2-4 Takte (max 25% der Takte)
2. **Akkord-Platzierung:** Wo im Takt?
   - Vorschlag: Immer auf Beat 1, danach Melodie/Pause bis nächster Takt
3. **Akkord-Typ-Verteilung:**
   - 60% geblockt (alle Töne gleichzeitig)
   - 40% gebrochen (Arpeggio über mehrere Schläge)
4. **Intervall-Beschränkung:**
   - Große Sprünge (>Oktave) auf <5% reduzieren
   - Wie? Recovery-System verschärfen, max-Intervall capping
5. **Triolen/Duolen:**
   - Aktuell: Wie viel? Ziel: 5-10%
   - Umsetzung: Triolen-Wahrscheinlichkeit reduzieren
6. **Rhythmus-Fokus:**
   - Hauptsächlich q, h, qd, 8 (überschaubar)
   - 16tel nur in Skalen-Läufen (max 10% der Takte)

**Akzeptanzkriterien:**
- Detaillierte Parameter-Spezifikation für Stufe 3 (als TypeScript-Config)
- Beispiel-Notation: 3 ideale Takte (gezeichnet oder beschrieben)
- Validierungs-Regeln: Was macht einen "guten" Stufe-3-Takt aus?

**Deliverable:** `STUFE_3_SPEC.md` (Markdown-Datei mit allen Parametern)

---

#### Task 1.2: Stufe 4 Spezifikation ("Akkorde flüssig wechseln")
**Zuständig:** `music-specialist` (als Piano-Pedagogy-Expert)
**Dauer:** 60 Minuten

**Anforderungen:**
1. **Akkord-Frequenz:** Mehrmals pro Takt erlaubt
   - Vorschlag: 40-60% der Takte haben Akkorde
   - Akkordwechsel: 1-2 pro Takt (z.B. Beat 1 + Beat 3)
2. **Triolen-Anteil:** 15-25% der Takte
   - Welche Triolen-Muster? (qd qd vs. 8t 8t 8t)
3. **Klassische Patterns:**
   - Alberti-Bass: Wie häufig? (Vorschlag: 30% der Bass-Takte)
   - Gebrochene Oktaven: Wie häufig? (Vorschlag: 10%)
   - Synkopen mit Akkorden: Wie häufig? (Vorschlag: 15%)
4. **Gebrochene Akkorde/Arpeggien:**
   - Im Bass: 40% der Takte (statt blockartig)
   - Im Treble: 20% der Akkorde
5. **Große Sprünge:**
   - Erlaubt, aber dosiert (max 10% der Intervalle)
   - Nur in musikalisch sinnvollen Kontexten (Phrase-Climax, Oktav-Sprung zum neuen Akkord)

**Akzeptanzkriterien:**
- Detaillierte Parameter-Spezifikation für Stufe 4
- Beispiel-Notation: 4 ideale Takte (Alberti-Bass, Triolen, Arpeggien)
- Pattern-Library: 5-10 neue rhythmische/melodische Patterns

**Deliverable:** `STUFE_4_SPEC.md`

---

### Risiken & Hinweise (Phase 1)
- **Risiko:** Zu viele Parameter → Implementierung komplex
  - **Mitigation:** Iterativer Ansatz, erst einfache Regeln, dann verfeinern
- **Risiko:** Pädagogische Meinungen variieren
  - **Mitigation:** Evidenz-basiert (Referenz auf Klavierschulen: Bartók Mikrokosmos, Kabalevsky Op. 39)

---

## Phase 2: Implementierung Stufe 3 Rework

### Ziel
Code-Änderungen in `exerciseGenerator.ts` basierend auf `STUFE_3_SPEC.md`.

### Tasks

#### Task 2.1: Akkord-Frequenz reduzieren (Stufe 3)
**Zuständig:** `music-webapp-frontend`
**Dauer:** 45 Minuten
**Abhängigkeit:** Task 1.1 abgeschlossen

**Implementierung:**
```typescript
// In fillBar() für Stufe 3:
const shouldPlaceChord = difficulty === 3 && !isBass && Math.random() < 0.15; // statt 0.35
const chordNoteIndex = shouldPlaceChord ? 0 : -1; // Nur Beat 1

// Alternative: Akkord pro 2-4 Takte statt pro Takt
if (barInPhrase === 0 && Math.random() < 0.4) {
  // Platziere Akkord in diesem Takt
}
```

**Akzeptanzkriterien:**
- Akkorde erscheinen in max 25% der Takte (Stufe 3)
- Akkorde IMMER auf Beat 1 (nie auf Beat 2/3/4)

---

#### Task 2.2: Akkord-Typ-Verteilung (60% geblockt, 40% gebrochen)
**Zuständig:** `music-webapp-frontend`
**Dauer:** 60 Minuten

**Implementierung:**
```typescript
function generateChordForDifficulty3(baseKey: string, scaleNotes: string[]): Note[] {
  const chordType = Math.random() < 0.6 ? 'blocked' : 'broken';

  if (chordType === 'blocked') {
    // Alle Töne gleichzeitig
    return [{ keys: [root, third, fifth], duration: 'h' }];
  } else {
    // Gebrochen über 2-4 Schläge
    return [
      { keys: [root], duration: 'q' },
      { keys: [third], duration: 'q' },
      { keys: [fifth], duration: 'q' },
      { keys: [root], duration: 'q' },
    ];
  }
}
```

**Akzeptanzkriterien:**
- 60% ± 5% geblockte Akkorde (gemessen über 20 Generierungen)
- 40% ± 5% gebrochene Akkorde
- Gebrochene Akkorde füllen ganzen Takt (4/4) oder halben Takt (3/4)

---

#### Task 2.3: Große Sprünge reduzieren (>Oktave auf <5%)
**Zuständig:** `music-webapp-frontend`
**Dauer:** 30 Minuten

**Implementierung:**
```typescript
// In generateNote() für Stufe 3:
if (difficulty === 3 && intervalSize >= 7) { // 7 = Oktave
  // Nur erlauben bei Phrase-Climax (wie bereits implementiert)
  if (contourPhase !== 'climax') {
    intervalSize = randInt(2, 4); // Fallback auf Terz-Quinte
  }
}

// Zusätzlich: Post-Validation
function validateBarIntervals(bar: Bar, difficulty: Difficulty): boolean {
  if (difficulty !== 3) return true;
  const largeJumps = countIntervalsAbove(bar.notes, 7); // >Oktave
  const totalIntervals = bar.notes.length - 1;
  return (largeJumps / totalIntervals) < 0.05; // <5%
}
```

**Akzeptanzkriterien:**
- Max 5% der Intervalle in Stufe 3 sind >Oktave
- Test über 50 generierte Übungen

---

#### Task 2.4: Triolen/Duolen auf 5-10% begrenzen
**Zuständig:** `music-webapp-frontend`
**Dauer:** 45 Minuten

**Implementierung:**
```typescript
// Neue Triolen-Pattern-Liste für Stufe 3 (reduziert)
const TRIPLET_PATTERNS_3: string[][] = [
  ['qt', 'qt', 'qt', 'q'],     // Viertel-Triole (selten)
];

// In getRhythmicPatterns():
function getRhythmicPatterns(timeSignature: string, difficulty: Difficulty): string[][] {
  const base = RHYTHMIC_PATTERNS_4_4[difficulty];
  if (difficulty === 3) {
    // Nur 5-10% Triolen
    const tripletChance = 0.05; // 5%
    if (Math.random() < tripletChance) {
      return [...base, ...TRIPLET_PATTERNS_3];
    }
  }
  return base;
}
```

**Akzeptanzkriterien:**
- 5-10% der Takte in Stufe 3 enthalten Triolen
- Triolen nur als Viertel-Triolen (keine Achtel-Triolen in Stufe 3)

---

### Testing-Checkpoint (Phase 2)
Nach allen Tasks von Phase 2:

**Zu testen:**
- ✅ npm run build (keine Fehler)
- ✅ 20 Generierungen Stufe 3 → Akkord-Frequenz messen
- ✅ Akkord-Typ-Verteilung prüfen (60/40)
- ✅ Große Sprünge zählen (<5%)
- ✅ Triolen-Anteil messen (5-10%)

**Deliverable:** Code-Änderungen in `exerciseGenerator.ts` + Test-Report

---

## Phase 3: Implementierung Stufe 4 Rework

### Ziel
Code-Änderungen in `exerciseGenerator.ts` basierend auf `STUFE_4_SPEC.md`.

### Tasks

#### Task 3.1: Akkord-Frequenz erhöhen (40-60% der Takte)
**Zuständig:** `music-webapp-frontend`
**Dauer:** 30 Minuten
**Abhängigkeit:** Task 1.2 abgeschlossen

**Implementierung:**
```typescript
// In fillBar() für Stufe 4:
const shouldPlaceChord = difficulty === 4 && !isBass && Math.random() < 0.5; // 50%
// Akkorde können auf Beat 1 UND Beat 3 erscheinen
const chordPlacements = [0, Math.floor(pattern.length / 2)]; // Beat 1 + Taktmitte
```

**Akzeptanzkriterien:**
- 40-60% der Takte haben mindestens 1 Akkord
- Akkorde können auf Beat 1 und/oder Beat 3 erscheinen

---

#### Task 3.2: Triolen auf 15-25% erhöhen
**Zuständig:** `music-webapp-frontend`
**Dauer:** 45 Minuten

**Implementierung:**
```typescript
const TRIPLET_PATTERNS_4: string[][] = [
  ['qt', 'qt', 'qt', 'q'],           // Viertel-Triolen
  ['8t', '8t', '8t', 'q', 'q'],      // Achtel-Triolen + Viertel
  ['q', '8t', '8t', '8t', 'q'],      // Triolen in Taktmitte
];

// In getRhythmicPatterns():
if (difficulty === 4 && Math.random() < 0.20) { // 20% Chance
  return [...base, ...TRIPLET_PATTERNS_4];
}
```

**Akzeptanzkriterien:**
- 15-25% der Takte in Stufe 4 enthalten Triolen
- Triolen sowohl als Viertel- als auch Achtel-Triolen

---

#### Task 3.3: Alberti-Bass Frequenz erhöhen (30% der Bass-Takte)
**Zuständig:** `music-webapp-frontend`
**Dauer:** 30 Minuten

**Implementierung:**
```typescript
// In generateHarmonicBass() für Stufe 4:
function generateHarmonicBass(...) {
  if (difficulty === 4) {
    const bassPattern = Math.random() < 0.3 ? 0 : randInt(1, 3);
    // Pattern 0 = Alberti-Bass (30% Wahrscheinlichkeit)
    // Patterns 1-3 = Oom-pah, Broken Chord, Octave Bass (70%)
  }
}
```

**Akzeptanzkriterien:**
- 30% ± 5% der Bass-Takte in Stufe 4 nutzen Alberti-Bass-Pattern
- Gemessen über 20 Generierungen

---

#### Task 3.4: Gebrochene Akkorde/Arpeggien im Bass (40% der Takte)
**Zuständig:** `music-webapp-frontend`
**Dauer:** 45 Minuten

**Implementierung:**
```typescript
// Neue Bass-Patterns für Stufe 4:
const BASS_ARPEGGIO_PATTERNS = [
  ['8', '8', '8', '8', 'h'],         // Gebrochener Akkord schnell
  ['q', '8', '8', 'q', 'q'],          // Gemischte Brechung
  ['8', '8', 'q', '8', '8', 'q'],    // Synkopiert gebrochen
];

// In generateHarmonicBass():
if (difficulty === 4 && Math.random() < 0.4) {
  // Generiere Arpeggio-Bass statt Alberti/Oom-pah
  const pattern = pick(BASS_ARPEGGIO_PATTERNS);
  const arpKeys = generateArpeggio(chordDegree, scaleNotes, bassOctave, pattern.length, 'updown', bassRange);
  // ... map pattern + arpKeys to notes
}
```

**Akzeptanzkriterien:**
- 40% der Bass-Takte in Stufe 4 nutzen gebrochene Akkorde (Arpeggios)
- Arpeggios nutzen verschiedene Patterns (nicht nur up/down, auch updown)

---

#### Task 3.5: Synkopen mit Akkorden (15% der Takte)
**Zuständig:** `music-webapp-frontend`
**Dauer:** 60 Minuten

**Implementierung:**
```typescript
const SYNCOPATED_CHORD_PATTERNS: string[][] = [
  ['8', 'qd', '8', 'q'],             // Synkopierter Akkord auf Beat 2+
  ['qr', 'q', 'q', 'q'],              // Akkord nach Pause (Off-Beat)
];

// In fillBar() für Stufe 4:
if (difficulty === 4 && Math.random() < 0.15 && shouldPlaceChord) {
  // Nutze synkopierten Pattern statt Standard-Pattern
  pattern = pick(SYNCOPATED_CHORD_PATTERNS);
  // Platziere Akkord auf 2. Note (nicht Beat 1)
  chordNoteIndex = 1;
}
```

**Akzeptanzkriterien:**
- 15% der Takte in Stufe 4 haben synkopierte Akkorde
- Akkorde erscheinen NICHT auf Beat 1, sondern auf Offbeat

---

#### Task 3.6: Große Sprünge dosiert erlauben (10% der Intervalle)
**Zuständig:** `music-webapp-frontend`
**Dauer:** 30 Minuten

**Implementierung:**
```typescript
// In generateNote() für Stufe 4:
if (difficulty === 4 && intervalSize >= 7) {
  // Große Sprünge erlauben, aber nur in 10% der Fälle
  if (Math.random() > 0.10) {
    intervalSize = randInt(3, 5); // Fallback auf Terz-Quinte
  }
  // Wenn erlaubt: nur bei musikalisch sinnvollen Kontexten
  if (contourPhase !== 'climax' && Math.random() > 0.3) {
    intervalSize = randInt(3, 5);
  }
}
```

**Akzeptanzkriterien:**
- Max 10% der Intervalle in Stufe 4 sind >Oktave
- Große Sprünge erscheinen bevorzugt bei Phrase-Climax

---

### Testing-Checkpoint (Phase 3)
Nach allen Tasks von Phase 3:

**Zu testen:**
- ✅ npm run build (keine Fehler)
- ✅ 20 Generierungen Stufe 4 → Akkord-Frequenz messen (40-60%)
- ✅ Triolen-Anteil messen (15-25%)
- ✅ Alberti-Bass Frequenz (30%)
- ✅ Gebrochene Akkorde im Bass (40%)
- ✅ Synkopen-Anteil (15%)
- ✅ Große Sprünge zählen (≤10%)

**Deliverable:** Code-Änderungen in `exerciseGenerator.ts` + Test-Report

---

## Phase 4: 50 Iterationen (Stufe 3-5)

### Ziel
Jedes generierte Notenblatt wird individuell analysiert und optimiert. Pro Iteration:
1. Generiere 1 Übung (Stufe 3, 4 oder 5)
2. Analysiere musikalische Qualität (Piano-Pedagogy-Expert)
3. Identifiziere Verbesserungspotenzial
4. Implementiere 1-2 kleine Fixes
5. Re-generiere und validiere

### Workflow pro Iteration

**Schritt 1: Generierung (Frontend-Agent)**
```bash
# Code-Änderung in exerciseGenerator.ts
# Generiere 1 Übung mit aktuellen Parametern
const exercise = generateExercise({ difficulty: 3, timeSignature: '4/4', keyStage: 1 });
```

**Schritt 2: Analyse (Music-Specialist als Piano-Pedagogy-Expert)**
- Rendering: VexFlow-Notenblatt ansehen
- Metriken prüfen:
  - Akkord-Frequenz
  - Intervall-Verteilung
  - Rhythmus-Komplexität
  - Spielbarkeit (Fingersätze, Handbewegungen)
  - Musikalische Natürlichkeit (Phrasen, Kadenzen)
- **Bewertung:** 1-10 für jede Dimension
- **Feedback:** 1-2 konkrete Verbesserungsvorschläge

**Schritt 3: Implementierung (Frontend-Agent)**
- Kleine Code-Änderung basierend auf Feedback
- Beispiele:
  - "Akkorde zu dicht → Reduziere Wahrscheinlichkeit von X auf Y"
  - "Triolen zu häufig → Ändere Pattern-Auswahl"
  - "Sprung zu groß → Verschärfe Recovery-Regel"

**Schritt 4: Validierung (Beide Agenten)**
- Re-generiere gleiche Übung (mit gleichen Seeds falls möglich)
- Vergleiche vorher/nachher
- Bestätige Verbesserung

**Schritt 5: Dokumentation**
- Log-Eintrag in `ITERATION_LOG.md`:
  ```markdown
  ## Iteration 23
  - **Stufe:** 4
  - **Problem:** Alberti-Bass zu selten (nur 15% statt 30%)
  - **Fix:** Erhöhe bassPattern-Gewichtung für Pattern 0
  - **Code-Änderung:** Zeile 1379, `Math.random() < 0.15` → `Math.random() < 0.30`
  - **Ergebnis:** Alberti-Bass jetzt 28% (✅)
  - **Bewertung:** 7/10 → 8/10
  ```

### Task-Verteilung (50 Iterationen)

#### Task 4.1: Iterationen 1-20 (Stufe 3)
**Zuständig:** `music-specialist` + `music-webapp-frontend`
**Dauer:** 90 Minuten
**Fokus:** Akkord-Platzierung, Intervalle, Rhythmus-Ausgewogenheit

**Ziel-Metriken:**
- Akkord-Frequenz: 20-25% (±3%)
- Große Sprünge: <5% (±1%)
- Triolen: 5-10% (±2%)
- Musikalische Natürlichkeit: 8/10

---

#### Task 4.2: Iterationen 21-40 (Stufe 4)
**Zuständig:** `music-specialist` + `music-webapp-frontend`
**Dauer:** 90 Minuten
**Fokus:** Triolen, Alberti-Bass, Synkopen, Arpeggien

**Ziel-Metriken:**
- Akkord-Frequenz: 40-60% (±5%)
- Triolen: 15-25% (±3%)
- Alberti-Bass: 30% (±5%)
- Gebrochene Akkorde (Bass): 40% (±5%)
- Synkopen: 15% (±3%)

---

#### Task 4.3: Iterationen 41-50 (Stufe 5)
**Zuständig:** `music-specialist` + `music-webapp-frontend`
**Dauer:** 60 Minuten
**Fokus:** 16tel-Läufe, Umkehrungen, Chromatik (optional)

**Ziel-Metriken:**
- 16tel schrittweise: 98% (±2%)
- Akkord-Umkehrungen: 20% der Akkorde (falls implementiert)
- Chromatische Durchgangstöne: 5-10% (optional)

---

### Deliverable (Phase 4)
- **`ITERATION_LOG.md`**: Dokumentation aller 50 Iterationen
- **Code-Änderungen**: Final version von `exerciseGenerator.ts`
- **Metriken-Report**: Vergleich Start vs. Ende (Excel/CSV)

---

## Phase 5: Testing & QA

### Ziel
Umfassende Qualitätssicherung der finalen Version.

### Tasks

#### Task 5.1: Automatisierte Tests
**Zuständig:** `clefbuddy-qa-engineer`
**Dauer:** 60 Minuten

**Test-Suite:**
```typescript
// src/utils/generatorQualityTest.ts (erweitern)
describe('Stufe 3 Rework', () => {
  it('Akkorde erscheinen in 20-25% der Takte', () => {
    const exercises = generateMultiple(3, 50);
    const chordFreq = measureChordFrequency(exercises);
    expect(chordFreq).toBeGreaterThan(0.20);
    expect(chordFreq).toBeLessThan(0.25);
  });

  it('Große Sprünge <5%', () => {
    const exercises = generateMultiple(3, 50);
    const largeJumps = measureLargeJumps(exercises);
    expect(largeJumps).toBeLessThan(0.05);
  });

  it('Triolen 5-10%', () => {
    const exercises = generateMultiple(3, 50);
    const triplets = measureTriplets(exercises);
    expect(triplets).toBeGreaterThan(0.05);
    expect(triplets).toBeLessThan(0.10);
  });
});

describe('Stufe 4 Rework', () => {
  it('Akkorde in 40-60% der Takte', () => {
    const exercises = generateMultiple(4, 50);
    const chordFreq = measureChordFrequency(exercises);
    expect(chordFreq).toBeGreaterThan(0.40);
    expect(chordFreq).toBeLessThan(0.60);
  });

  it('Triolen 15-25%', () => {
    const exercises = generateMultiple(4, 50);
    const triplets = measureTriplets(exercises);
    expect(triplets).toBeGreaterThan(0.15);
    expect(triplets).toBeLessThan(0.25);
  });

  it('Alberti-Bass ~30%', () => {
    const exercises = generateMultiple(4, 50);
    const alberti = measureAlbertiBass(exercises);
    expect(alberti).toBeCloseTo(0.30, 1); // ±10%
  });
});
```

**Akzeptanzkriterien:**
- Alle Tests bestehen (100% Pass-Rate)
- Test-Coverage: Stufe 3-5 vollständig abgedeckt

---

#### Task 5.2: Manuelles Testing im Browser
**Zuständig:** `clefbuddy-qa-engineer`
**Dauer:** 30 Minuten

**Test-Fälle:**
1. **Stufe 3:**
   - Generiere 10 Übungen
   - Prüfe visuell: Akkorde sehen "lernbar" aus (nicht zu häufig)
   - Prüfe: Keine extremen Sprünge
2. **Stufe 4:**
   - Generiere 10 Übungen
   - Prüfe: Alberti-Bass sichtbar in ~3 von 10 Übungen
   - Prüfe: Triolen erkennbar
3. **Stufe 5:**
   - Generiere 5 Übungen
   - Prüfe: 16tel-Läufe sind schrittweise

**Dokumentation:** Screenshot + Beschreibung pro Test-Fall

---

#### Task 5.3: Regression-Tests (Stufe 1, 2, 6)
**Zuständig:** `clefbuddy-qa-engineer`
**Dauer:** 30 Minuten

**Ziel:** Sicherstellen, dass Änderungen an Stufe 3-4 nicht Stufe 1/2/6 beeinflussen.

**Test-Fälle:**
- Stufe 1: Handwechsel funktioniert weiterhin
- Stufe 2: Bass spielt Akkord-Grundtöne (keine Regression)
- Stufe 6: 32tel schrittweise (keine Regression)

**Akzeptanzkriterien:**
- Keine Regression in Stufe 1, 2, 6
- Alle bestehenden Features funktionieren weiterhin

---

### Deliverable (Phase 5)
- **Test-Report**: `QA_REPORT.md` (alle Test-Ergebnisse)
- **Bug-Liste**: Falls Bugs gefunden → Issue-Tracker oder Markdown-Liste
- **Go/No-Go Empfehlung**: Bereit für Production?

---

## Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| **Triolen-Implementierung komplex** | Hoch | Mittel | Notfall-Fallback: Triolen optional (Feature-Flag) |
| **50 Iterationen zu zeitaufwändig** | Mittel | Niedrig | Reduziere auf 30 Iterationen falls nötig |
| **Pädagogische Spezifikation unklar** | Niedrig | Hoch | Frühes Review nach Task 1.1 + 1.2 |
| **Breaking Changes** | Niedrig | Hoch | Strikte API-Stabilität, nur interne Änderungen |
| **Metriken nicht messbar** | Mittel | Mittel | Implementiere Mess-Funktionen vor Phase 4 |

---

## Erfolgskriterien

### Musikalische Qualität
- ✅ Stufe 3: Akkorde als "Lernmomente" erkennbar (nicht überwältigend)
- ✅ Stufe 4: Flüssige Akkordwechsel, idiomatische Patterns (Alberti-Bass)
- ✅ Alle Stufen: Spielbar von Zielgruppe (keine unmöglichen Finger-Abstände)

### Metriken
| Metrik | Stufe 3 | Stufe 4 | Stufe 5 |
|--------|---------|---------|---------|
| Akkord-Frequenz | 20-25% | 40-60% | 30-50% |
| Triolen | 5-10% | 15-25% | 10-20% |
| Große Sprünge (>Oktave) | <5% | ≤10% | ≤15% |
| Alberti-Bass (Bass-Takte) | 0% | 30% | 20% |
| Gebrochene Akkorde (Bass) | 20% | 40% | 35% |
| 16tel schrittweise | N/A | N/A | 98% |
| Musikalische Natürlichkeit | 8/10 | 8/10 | 8/10 |

### Pädagogischer Mehrwert
- ✅ Progression erkennbar: Stufe 3 → 4 → 5 steigert Komplexität graduell
- ✅ Lernkurve: Jede Stufe fokussiert auf 1-2 neue Fähigkeiten
- ✅ Wiedererkennbarkeit: Muster wiederholen sich, aber variieren (AABA-Prinzip)

---

## Zeitplan (Gantt-Chart)

```
Tag 1:
[===== Phase 1: Analyse & Design (2h) =====]
  Task 1.1: Stufe 3 Spec (1h)
  Task 1.2: Stufe 4 Spec (1h)

Tag 2:
[======== Phase 2: Implementierung Stufe 3 (3h) ========]
  Task 2.1: Akkord-Frequenz (45min)
  Task 2.2: Akkord-Typ (60min)
  Task 2.3: Sprünge (30min)
  Task 2.4: Triolen (45min)

Tag 3:
[======== Phase 3: Implementierung Stufe 4 (3h) ========]
  Task 3.1: Akkord-Frequenz (30min)
  Task 3.2: Triolen (45min)
  Task 3.3: Alberti-Bass (30min)
  Task 3.4: Arpeggien (45min)
  Task 3.5: Synkopen (60min)
  Task 3.6: Sprünge (30min)

Tag 4:
[========= Phase 4: 50 Iterationen (4h) =========]
  Task 4.1: Iterationen 1-20 (90min)
  Task 4.2: Iterationen 21-40 (90min)
  Task 4.3: Iterationen 41-50 (60min)

Tag 5 (optional):
[==== Phase 5: Testing & QA (2h) ====]
  Task 5.1: Automatisierte Tests (60min)
  Task 5.2: Manuelles Testing (30min)
  Task 5.3: Regression-Tests (30min)
```

**Gesamt:** 4-5 Tage bei 3-4h Arbeit/Tag

---

## Nächste Schritte

### Sofort (heute)
1. **Review dieses Plans** mit allen Beteiligten
2. **Genehmigung einholen** für Zeitaufwand
3. **Starten mit Task 1.1** (Stufe 3 Spezifikation)

### Diese Woche
4. Abschluss Phase 1 + 2 (Analyse + Stufe 3 Implementation)
5. Testing-Checkpoint nach Phase 2

### Nächste Woche
6. Phase 3 (Stufe 4 Implementation)
7. Start Phase 4 (Iterationen)

### Übernächste Woche
8. Abschluss Phase 4 + 5
9. Production Deployment

---

## Ressourcen & Referenzen

### Agenten-Kontakte
- **music-specialist**: Musiktheorie, Piano-Pädagogik, Analyse
- **music-webapp-frontend**: TypeScript, React, VexFlow, Implementierung
- **clefbuddy-qa-engineer**: Testing, Validierung, Bug-Hunting

### Dateien
- **Hauptdatei**: `/home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy/src/utils/exerciseGenerator.ts`
- **Analyse**: `GENERATOR_ANALYSIS.md`
- **Bisherige Verbesserungen**: `GENERATOR_IMPROVEMENTS.md`
- **Typen**: `src/types/music.ts`

### Externe Referenzen
- Bartók: Mikrokosmos (Stufe 3-4 Didaktik)
- Kabalevsky: 24 Easy Pieces Op. 39 (Akkord-Progression für Kinder)
- SightReadingFactory.com (Referenz-Plattform)

---

## Fazit

Dieser Plan adressiert die pädagogischen Lücken in Stufe 3 und 4 durch:

1. **Gezielte Akkord-Pädagogik** (Stufe 3: kennenlernen, Stufe 4: fließend wechseln)
2. **Idiomatische Patterns** (Alberti-Bass, Arpeggien, Triolen)
3. **Iterative Verfeinerung** (50 Iterationen mit Piano-Pedagogy-Expert-Feedback)
4. **Qualitätssicherung** (Automatisierte + manuelle Tests)

**Erwartetes Ergebnis:** Generator erzeugt pädagogisch wertvolle, musikalisch natürliche und spielbare Übungen für Stufe 3-5, die eine klare Progression abbilden.

**Empfehlung:** Plan genehmigen und mit Phase 1 beginnen.

---

**Erstellt von:** Projektmanager (PM)
**Datum:** 2026-01-31
**Status:** Zur Genehmigung vorgelegt
**Nächster Schritt:** Review + Start Task 1.1
