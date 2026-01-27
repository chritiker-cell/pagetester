# NeoKeys – Musiktheorie-Spezifikation

**Version:** 1.0.0
**Datum:** 2026-01-26
**Agent:** Music Specialist

## Überblick

Diese Spezifikation definiert die musiktheoretischen Grundlagen für das NeoKeys Note-Reading MVP. Sie dient als Referenz für Frontend-Entwicklung und spätere Generierungslogik.

---

## 1. VexFlow-Notationsformat

### 1.1 Tonhöhen (Keys)
- **Format:** `"note/octave"` (z.B. `"c/4"`, `"g/5"`)
- **Oktavierung:** Scientific Pitch Notation
  - C4 = mittleres C (261,63 Hz)
  - C5 = eingestrichenes C (523,25 Hz)
- **Vorzeichen:** Werden durch Key Signature definiert (im MVP nur C-Dur ohne Vorzeichen)

**Beispiel:**
```json
{"keys": ["e/4"], "duration": "q"}
```

### 1.2 Notenwerte (Durations)
| Code | Notenwert | Schläge (4/4) |
|------|-----------|---------------|
| `w`  | Ganze     | 4             |
| `h`  | Halbe     | 2             |
| `hd` | Punktierte Halbe | 3      |
| `q`  | Viertel   | 1             |
| `8`  | Achtel    | 0,5           |

**Validierungsregel:** Die Summe aller Durations in einem Takt muss der Taktart entsprechen (z.B. 4 Schläge in 4/4).

### 1.3 Taktstruktur
```json
{
  "number": 1,
  "notes": [
    {"keys": ["c/4"], "duration": "q"},
    {"keys": ["d/4"], "duration": "q"},
    {"keys": ["e/4"], "duration": "h"}
  ]
}
```

### 1.4 Übungs-Metadaten
```json
{
  "timeSignature": "4/4",
  "keySignature": "C",
  "clef": "treble",
  "tempo": 60
}
```

---

## 2. Level-Progression

### Level 1: Absolute Anfänger
**Ziel:** Tonhöhenerkennung im kleinsten Raum

| Parameter | Wert |
|-----------|------|
| Tonbereich | C4–G4 (Fünffingerraum) |
| Rhythmen | Viertel, Halbe |
| Intervalle | Unisono, Sekunde (stufenweise) |
| Takte | 4–8 |
| Besonderheit | Keine Sprünge, maximale Wiederholung |

**Didaktischer Fokus:**
- Liniennotenerkennung (E4, G4)
- Zwischenraumnotenerkennung (D4, F4)
- C4 als Orientierungston (unter den Linien)

### Level 2: Leicht Fortgeschritten
**Ziel:** Oktaverweiterung und ganze Noten

| Parameter | Wert |
|-----------|------|
| Tonbereich | C4–C5 (eine Oktave) |
| Rhythmen | Viertel, Halbe, Ganze |
| Intervalle | Unisono, Sekunde, Terz |
| Takte | 6–8 |
| Besonderheit | Dreiklangs-Arpeggien |

**Didaktischer Fokus:**
- Obere Oktaverkennung (A4, B4, C5)
- Ganze Noten als "Anker"
- Kleine Terzsprünge (C-E, E-G)

### Level 3: Fortgeschrittener Anfänger
**Ziel:** Rhythmische Variation und größere Sprünge

| Parameter | Wert |
|-----------|------|
| Tonbereich | C4–E5 (erweitert) |
| Rhythmen | + Punktierte Halbe |
| Intervalle | + Quarte, Quinte |
| Takte | 8 |
| Besonderheit | Sequenzmuster |

**Didaktischer Fokus:**
- Punktierung (3+1 Schläge)
- Quinten-Arpeggien (C-G-C)
- Hilfslinien oben (D5, E5)

---

## 3. Kompositionsregeln

### 3.1 Melodische Prinzipien
1. **Stufenweise Bewegung bevorzugen:** 70% der Bewegungen sollten Sekundschritte sein
2. **Sprünge auflösen:** Nach einem Sprung > Terz folgt Gegenbewegung
3. **Tonale Zentrierung:** Beginne und ende mit dem Grundton (C)
4. **Phrasenstruktur:** 2-, 4- oder 8-taktige Einheiten
5. **Spannungsbogen:** Höhepunkt in der Mitte, dann Abstieg zur Kadenz

### 3.2 Rhythmische Prinzipien
1. **Taktfüllung:** Exakt 4 Schläge in 4/4 (keine "halben" Takte)
2. **Variation:** Nicht mehr als 2 identische Takte hintereinander
3. **Wiederholung:** Rhythmische Patterns dürfen wiederholt werden (Lerneffekt)
4. **Startpunkt:** Übungen beginnen auf Schlag 1 (kein Auftakt im MVP)

### 3.3 Validierungsregeln
```javascript
// Pseudocode für Validierung
function validateBar(bar, timeSignature) {
  const totalBeats = bar.notes.reduce((sum, note) =>
    sum + getDurationInBeats(note.duration), 0
  );

  if (totalBeats !== getBeatsFromTimeSignature(timeSignature)) {
    throw new Error(`Bar ${bar.number}: Invalid beat count`);
  }
}

function validateMelodicLine(notes, maxJump) {
  for (let i = 1; i < notes.length; i++) {
    const interval = getInterval(notes[i-1], notes[i]);
    if (interval > maxJump) {
      console.warn(`Large jump detected: ${interval}`);
    }
  }
}
```

---

## 4. Generierungs-Algorithmus (Zukunft)

Für Phase 2 (dynamische Generierung):

### Schritt 1: Parameter laden
```javascript
const level = loadLevel(levelId);
const { noteRange, allowedDurations, maxJump } = level.parameters;
```

### Schritt 2: Skelett erstellen
```javascript
const bars = [];
for (let i = 0; i < level.barCount; i++) {
  bars.push(generateBar(noteRange, allowedDurations, maxJump));
}
```

### Schritt 3: Musikalische Post-Processing
- **Tonale Anpassung:** Beginne mit C, ende mit C
- **Melodische Glättung:** Zu viele Sprünge korrigieren
- **Rhythmische Balance:** Variation sicherstellen

### Schritt 4: Validierung
- Taktfüllung prüfen
- Tonbereich prüfen
- Intervalle prüfen

---

## 5. Beispiel-Übung annotiert

```json
{
  "id": "l1_ex1",
  "level": 1,
  "bars": [
    {
      "number": 1,
      "notes": [
        // Aufsteigende Tonleiter – klassisches Lernmuster
        {"keys": ["c/4"], "duration": "q"},  // Grundton
        {"keys": ["d/4"], "duration": "q"},  // Sekunde
        {"keys": ["e/4"], "duration": "q"},  // Terz
        {"keys": ["f/4"], "duration": "q"}   // Quarte
      ]
      // Summe: 4 Viertel = 4 Schläge ✓
    },
    {
      "number": 2,
      "notes": [
        // Absteigende Bewegung – Symmetrie
        {"keys": ["g/4"], "duration": "q"},  // Quinte (Ziel erreicht)
        {"keys": ["f/4"], "duration": "q"},
        {"keys": ["e/4"], "duration": "q"},
        {"keys": ["d/4"], "duration": "q"}
      ]
    },
    {
      "number": 3,
      "notes": [
        // Rhythmische Variation mit halben Noten
        {"keys": ["c/4"], "duration": "h"},  // Grundton betont
        {"keys": ["e/4"], "duration": "h"}   // Terz als harmonische Farbe
      ]
    },
    {
      "number": 4,
      "notes": [
        // Kadenz – Dominante zur Tonika
        {"keys": ["g/4"], "duration": "h"},  // Dominante (G)
        {"keys": ["c/4"], "duration": "h"}   // Tonika (C) – Schluss
      ]
    }
  ]
}
```

**Analyse:**
- ✓ Stufenweise Bewegung in Takt 1–2
- ✓ Tonumfang C4–G4 eingehalten
- ✓ Rhythmische Progression (4× Viertel → 2× Halbe)
- ✓ Tonikaschluss (G→C)
- ✓ Jeder Takt hat 4 Schläge

---

## 6. VexFlow-Integration

### Rendering-Pipeline
```javascript
import Vex from 'vexflow';

function renderExercise(exercise, divId) {
  const VF = Vex.Flow;
  const div = document.getElementById(divId);
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

  renderer.resize(800, 200);
  const context = renderer.getContext();
  const stave = new VF.Stave(10, 40, 750);

  // Time Signature und Key Signature
  stave.addClef(exercise.clef);
  stave.addTimeSignature(exercise.timeSignature);
  stave.addKeySignature(exercise.keySignature);

  stave.setContext(context).draw();

  // Noten aus JSON
  const notes = exercise.bars.flatMap(bar =>
    bar.notes.map(note =>
      new VF.StaveNote({
        keys: note.keys,
        duration: note.duration,
        clef: exercise.clef
      })
    )
  );

  const voice = new VF.Voice({num_beats: 16, beat_value: 4}); // 4 Takte
  voice.addTickables(notes);

  const formatter = new VF.Formatter()
    .joinVoices([voice])
    .format([voice], 700);

  voice.draw(context, stave);
}
```

---

## 7. Testing-Checkliste

Für jede neue Übung prüfen:

- [ ] **Taktfüllung:** Alle Takte haben korrekte Schlaganzahl
- [ ] **Tonbereich:** Alle Noten liegen im Level-Range
- [ ] **Intervalle:** Keine unerlaubten Sprünge
- [ ] **Start/Ende:** Beginnt und endet mit Grundton (außer bei bewussten Ausnahmen)
- [ ] **Rhythmische Balance:** Mindestens 2 verschiedene Notenwerte
- [ ] **Phrasenstruktur:** 2-, 4- oder 8-taktige Einheiten
- [ ] **VexFlow-Syntax:** Keys und Durations sind valide
- [ ] **JSON-Validität:** Keine Syntax-Fehler

---

## 8. Nächste Schritte

### Phase 1 (MVP – aktuell)
- ✓ Statische Übungen definiert
- ⏳ Frontend-Integration durch Frontend-Agent
- ⏳ MIDI-Playback-Integration

### Phase 2 (Erweiterung)
- Generierungs-Algorithmus implementieren
- Weitere Levels (4–10)
- Bass-Schlüssel einführen
- Vorzeichen (G-Dur, F-Dur)
- Pausen einbauen

### Phase 3 (Fortgeschritten)
- Akkord-Erkennung
- Zweihändige Übungen
- Rhythmus-Diktate
- Gehörbildung

---

## Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Unisono** | Tonwiederholung (gleiches Ton) |
| **Sekunde** | Nachbarton (1 Tonschritt) |
| **Terz** | Überspringt 1 Ton (2 Tonschritte) |
| **Quarte** | 3 Tonschritte (C→F) |
| **Quinte** | 4 Tonschritte (C→G) |
| **Oktave** | 7 Tonschritte (C→C) |
| **Stufenweise** | Nur Sekundschritte |
| **Sprung** | Intervall ≥ Terz |
| **Kadenz** | Schlusswendung (hier: G→C) |
| **Arpeggio** | Dreiklangs-Brechung (C-E-G) |
| **Sequenz** | Pattern-Wiederholung auf anderer Stufe |
| **Phrasenstruktur** | Melodische Einheiten (meist 2/4/8 Takte) |

---

**Autor:** NeoKeys Music Theory Agent
**Kontakt für Fragen:** Frontend-Agent via Task-System
