# Musikpädagogische Spezifikation: Stufe 3 & 4 - Akkord-Fokus

## Autor: Musiktheorie-Experte (zweiter Ludwig van Beethoven)
**Datum:** 2026-01-31
**Version:** 1.0

---

## Übersicht

Diese Spezifikation definiert die musikpädagogische Progression von **Stufe 3 (Akkorde kennenlernen)** zu **Stufe 4 (Akkorde fließend wechseln)** für ClefBuddy.

---

## 1. Akkord-Typen für Stufe 3

### 1.1 Philosophie
- **Hauptziel:** Akkorde als Klangeinheit **visuell und auditiv** erfassen
- **Didaktik:** Akkorde werden am Taktanfang platziert, danach folgt einfache Melodie/Pause
- **Wechselhäufigkeit:** Max. 1-2 Akkorde pro Phrase (4 Takte), **keine schnellen Wechsel**

### 1.2 Erlaubte Akkord-Typen (Stufe 3)

| Typ | Beschreibung | Lagen | Spannweite | Häufigkeit |
|-----|--------------|-------|------------|------------|
| **Dur-Dreiklang (Grundstellung)** | Root-Third-Fifth | C4-E4-G4 | Max. Quinte | 50% |
| **Moll-Dreiklang (Grundstellung)** | Root-Third-Fifth | A3-C4-E4 | Max. Quinte | 25% |
| **Dur-Zweiklang (Terz)** | Root-Third | C4-E4 | Terz | 15% |
| **Dur-Zweiklang (Quinte)** | Root-Fifth | C4-G4 | Quinte | 10% |

**Maximale Spannweite:** Quinte (5 Halbtöne innerhalb einer Oktave)
**Keine Umkehrungen in Stufe 3!** (verhindert verwirrende Akkordbilder)

### 1.3 TypeScript-Datenstruktur (Stufe 3)

```typescript
const CHORD_TYPES_3: Array<{
  type: 'major_triad' | 'minor_triad' | 'major_dyad_third' | 'major_dyad_fifth';
  intervalDegrees: number[]; // Scale degrees from root [0, 2, 4] = root-third-fifth
  maxSpanSemitones: number;  // Max span in semitones
  weight: number;            // Probability weight
}> = [
  {
    type: 'major_triad',
    intervalDegrees: [0, 2, 4],  // Root, Third, Fifth
    maxSpanSemitones: 7,         // Perfect fifth = 7 semitones
    weight: 50
  },
  {
    type: 'minor_triad',
    intervalDegrees: [0, 2, 4],  // Same structure, third is minor by scale
    maxSpanSemitones: 7,
    weight: 25
  },
  {
    type: 'major_dyad_third',
    intervalDegrees: [0, 2],     // Root + Third only
    maxSpanSemitones: 4,         // Major third = 4 semitones
    weight: 15
  },
  {
    type: 'major_dyad_fifth',
    intervalDegrees: [0, 4],     // Root + Fifth only
    maxSpanSemitones: 7,
    weight: 10
  },
];
```

---

## 2. Rhythmische Muster Stufe 3 (Akkord + Melodie)

### 2.1 Prinzipien
- **Akkord-Platzierung:** Immer auf **Schlag 1** (Downbeat)
- **Anschluss:** Einfache Melodie oder Pause danach
- **Notation:** `'chord_X'` = geblockte Akkordnote (alle Töne gleichzeitig)
- **Gebrochene Akkorde:** Separat behandelt (siehe 3.)

### 2.2 Neue Rhythmische Patterns (4/4-Takt)

```typescript
const RHYTHMIC_PATTERNS_4_4_CHORD_3: string[][] = [
  // Akkord am Anfang, dann Melodie
  ['chord_h', 'h'],                    // Akkord (halbe) + Pause/Melodie (halbe)
  ['chord_q', 'q', 'q', 'q'],          // Akkord (viertel) + 3 Melodienoten
  ['chord_q', 'q', 'h'],               // Akkord + Note + halbe Note
  ['chord_hd', 'q'],                   // Akkord (punktierte halbe) + Viertel
  ['chord_q', 'qr', 'h'],              // Akkord + Pause + halbe Note

  // Sehr einfache Achtel-Anschlüsse (max. 2 Achtel!)
  ['chord_h', '8', '8', 'q'],          // Akkord (halbe) + 2 Achtel + Viertel
  ['chord_q', '8', '8', 'h'],          // Akkord + 2 Achtel + halbe

  // Langsame Akkordfolge (nur bei 2 Akkorden pro Phrase)
  ['chord_h', 'qr', 'q'],              // Akkord + Pause + Vorbereitung für nächsten Akkord
  ['chord_q', 'h', 'qr'],              // Akkord + halbe + Pause

  // Keine Achtel-Läufe nach Akkord! Zu kompliziert für Stufe 3
];
```

### 2.3 Neue Rhythmische Patterns (3/4-Takt)

```typescript
const RHYTHMIC_PATTERNS_3_4_CHORD_3: string[][] = [
  ['chord_hd'],                        // Akkord über ganzen Takt
  ['chord_h', 'q'],                    // Akkord (halbe) + Viertel
  ['chord_q', 'q', 'q'],               // Akkord + 2 Melodienoten
  ['chord_q', 'h'],                    // Akkord + halbe Note
  ['chord_q', 'qr', 'q'],              // Akkord + Pause + Viertel
  ['chord_h', 'qr'],                   // Akkord + Pause
];
```

### 2.4 Neue Rhythmische Patterns (2/4-Takt)

```typescript
const RHYTHMIC_PATTERNS_2_4_CHORD_3: string[][] = [
  ['chord_h'],                         // Akkord über ganzen Takt
  ['chord_q', 'q'],                    // Akkord + Viertel
  ['chord_q', '8', '8'],               // Akkord + 2 Achtel
  ['chord_q', 'qr'],                   // Akkord + Pause
];
```

---

## 3. Gebrochene Akkord-Muster Stufe 3

### 3.1 Philosophie
- **Arpeggien:** Akkordtöne nacheinander spielen (root-third-fifth oder Umkehrungen)
- **Didaktik:** Verbindet visuelle Akkorderkennung mit motorischer Ausführung
- **Häufigkeit:** 40% der Akkorde gebrochen statt geblockt

### 3.2 Arpeggio-Patterns (als separate Noten im Bar)

```typescript
const ARPEGGIO_PATTERNS_3: Array<{
  name: string;
  pattern: number[];      // Akkordton-Indizes [0=root, 1=third, 2=fifth]
  durations: string[];    // Notenwerte für jede Note
  totalBeats: number;     // Summe der Schläge
}> = [
  {
    name: 'ascending_quarter',
    pattern: [0, 1, 2, 0],              // Root-Third-Fifth-Root
    durations: ['q', 'q', 'q', 'q'],    // 4 Viertelnoten
    totalBeats: 4,
  },
  {
    name: 'descending_quarter',
    pattern: [2, 1, 0, 2],              // Fifth-Third-Root-Fifth
    durations: ['q', 'q', 'q', 'q'],
    totalBeats: 4,
  },
  {
    name: 'ascending_half',
    pattern: [0, 1, 2],                 // Root-Third-Fifth
    durations: ['h', 'h', 'h'],         // 3 halbe Noten (für 3/4)
    totalBeats: 6,                      // Passt in 2 Takte 3/4
  },
  {
    name: 'simple_updown',
    pattern: [0, 2, 0],                 // Root-Fifth-Root
    durations: ['q', 'q', 'h'],         // Einfaches Auf und Ab
    totalBeats: 4,
  },
  {
    name: 'eighth_basic',
    pattern: [0, 1, 2, 1, 0, 1, 2, 1],  // Wellenform
    durations: ['8', '8', '8', '8', '8', '8', '8', '8'],
    totalBeats: 4,
  },
  {
    name: 'root_emphasis',
    pattern: [0, 1, 0, 2, 0],           // Root wird betont (wiederholt)
    durations: ['q', 'q', 'q', 'q', 'h'],
    totalBeats: 6,                      // Für 3/4 über 2 Takte
  },
  {
    name: 'thirds_only',
    pattern: [0, 1, 0, 1],              // Nur Root und Terz (Zweiklang-Übung)
    durations: ['q', 'q', 'q', 'q'],
    totalBeats: 4,
  },
  {
    name: 'fifths_only',
    pattern: [0, 2, 0, 2],              // Nur Root und Quinte
    durations: ['q', 'q', 'q', 'q'],
    totalBeats: 4,
  },
];
```

### 3.3 Anwendungslogik

```typescript
// Wenn ein Akkord generiert wird:
const useBlockedChord = Math.random() < 0.6; // 60% geblockt, 40% gebrochen

if (useBlockedChord) {
  // Generiere Akkord als Mehrklang-Note (chord_q, chord_h etc.)
  const chordNote: Note = {
    keys: [rootKey, thirdKey, fifthKey],
    duration: 'q'
  };
} else {
  // Wähle Arpeggio-Pattern
  const pattern = pick(ARPEGGIO_PATTERNS_3);
  const chordTones = getChordTones(currentChordDegree, scaleNotes);

  // Generiere Noten-Sequenz
  const notes: Note[] = pattern.pattern.map((idx, i) => {
    const degree = chordTones[idx];
    const key = `${scaleNotes[degree]}/${octave}`;
    return { keys: [key], duration: pattern.durations[i] };
  });
}
```

---

## 4. Triolen-Patterns Stufe 3 & 4

### 4.1 Stufe 3: Minimale Triolen (5-10%)

```typescript
const TRIPLET_PATTERNS_3: Array<{
  name: string;
  durations: string[];    // '8t' = Achteltriole
  totalBeats: number;
  complexity: number;     // 1-3 (1=simpel)
}> = [
  {
    name: 'quarter_triplet_simple',
    durations: ['qt', 'qt', 'qt'],      // 3 Vierteltriolen = 2 Schläge
    totalBeats: 2,
    complexity: 1,
  },
  {
    name: 'eighth_triplet_basic',
    durations: ['8t', '8t', '8t'],      // 3 Achteltriolen = 1 Schlag
    totalBeats: 1,
    complexity: 2,
  },
  {
    name: 'mixed_triplet_easy',
    durations: ['qt', 'qt', 'qt', 'q'], // Triolen + normale Viertel
    totalBeats: 3,
    complexity: 2,
  },
];

// Anwendung: Max 5-10% der Takte
const useTripletsInBar = difficulty === 3 && Math.random() < 0.08; // 8%
```

### 4.2 Stufe 4: Erweiterte Triolen (15-25%)

```typescript
const TRIPLET_PATTERNS_4: Array<{
  name: string;
  durations: string[];
  totalBeats: number;
  complexity: number;
}> = [
  // Aus Stufe 3 übernommen
  {
    name: 'quarter_triplet_simple',
    durations: ['qt', 'qt', 'qt'],
    totalBeats: 2,
    complexity: 1
  },
  {
    name: 'eighth_triplet_basic',
    durations: ['8t', '8t', '8t'],
    totalBeats: 1,
    complexity: 2
  },

  // NEU für Stufe 4
  {
    name: 'eighth_triplet_double',
    durations: ['8t', '8t', '8t', '8t', '8t', '8t'], // 2 Triolen = 2 Schläge
    totalBeats: 2,
    complexity: 2,
  },
  {
    name: 'quarter_triplet_full_bar',
    durations: ['qt', 'qt', 'qt', 'qt', 'qt', 'qt'], // Ganzer Takt in Triolen
    totalBeats: 4,
    complexity: 3,
  },
  {
    name: 'mixed_eighth_quarter_triplet',
    durations: ['8t', '8t', '8t', 'q', 'q'],        // Triole + normale Noten
    totalBeats: 3,
    complexity: 2,
  },
  {
    name: 'syncopated_triplet',
    durations: ['qr', '8t', '8t', '8t', 'q'],       // Pause + Triole + Viertel
    totalBeats: 3,
    complexity: 3,
  },
  {
    name: 'arpeggio_triplet',
    durations: ['8t', '8t', '8t', '8t', '8t', '8t', '8t', '8t', '8t'], // 3 Triolen
    totalBeats: 3,
    complexity: 3,
  },
  {
    name: 'triplet_with_rest',
    durations: ['8t', '8t', '8tr', 'q'],            // Triole mit Pause
    totalBeats: 2,
    complexity: 2,
  },
];

// Anwendung: 15-25% der Takte
const useTripletsInBar = difficulty === 4 && Math.random() < 0.20; // 20%
```

---

## 5. Bass-Patterns Stufe 4

### 5.1 Philosophie
- **Ziel:** Vom statischen Root-Fifth-Wechsel zu lebendigen Begleitmustern
- **Alberti-Bass:** Klassisches Muster (Root-Fifth-Third-Fifth)
- **Gebrochene Oktaven:** Basssprünge für dynamische Bewegung
- **Synkopen:** Rhythmische Spannung durch Off-Beat-Betonung

### 5.2 Erweiterte Bass-Patterns (Stufe 4)

```typescript
const BASS_PATTERNS_4: Array<{
  name: string;
  getNotes: (chordDegree: ChordDegree, scaleNotes: string[], octave: number, timeSignature: string) => Note[];
}> = [
  // 1. Alberti-Bass (klassisch)
  {
    name: 'alberti_classic',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const [root, third, fifth] = getChordTones(chordDegree, scaleNotes);
      const rootKey = `${scaleNotes[root]}/${octave}`;
      const thirdKey = `${scaleNotes[third]}/${octave}`;
      const fifthKey = `${scaleNotes[fifth]}/${octave}`;

      if (timeSig === '4/4') {
        return [
          { keys: [rootKey], duration: 'q' },
          { keys: [fifthKey], duration: 'q' },
          { keys: [thirdKey], duration: 'q' },
          { keys: [fifthKey], duration: 'q' },
        ];
      }
      // 3/4: Root-Fifth-Third
      return [
        { keys: [rootKey], duration: 'q' },
        { keys: [fifthKey], duration: 'q' },
        { keys: [thirdKey], duration: 'q' },
      ];
    },
  },

  // 2. Alberti-Variation (Root-Third-Fifth-Third)
  {
    name: 'alberti_variant_1',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const [root, third, fifth] = getChordTones(chordDegree, scaleNotes);
      const rootKey = `${scaleNotes[root]}/${octave}`;
      const thirdKey = `${scaleNotes[third]}/${octave}`;
      const fifthKey = `${scaleNotes[fifth]}/${octave}`;

      if (timeSig === '4/4') {
        return [
          { keys: [rootKey], duration: 'q' },
          { keys: [thirdKey], duration: 'q' },
          { keys: [fifthKey], duration: 'q' },
          { keys: [thirdKey], duration: 'q' },
        ];
      }
      return [
        { keys: [rootKey], duration: 'q' },
        { keys: [thirdKey], duration: 'q' },
        { keys: [fifthKey], duration: 'q' },
      ];
    },
  },

  // 3. Gebrochene Oktaven (Root low - Root high)
  {
    name: 'broken_octaves',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const [root] = getChordTones(chordDegree, scaleNotes);
      const rootLow = `${scaleNotes[root]}/${octave}`;
      const rootHigh = `${scaleNotes[root]}/${octave + 1}`;

      if (timeSig === '4/4') {
        return [
          { keys: [rootLow], duration: 'q' },
          { keys: [rootHigh], duration: 'q' },
          { keys: [rootLow], duration: 'q' },
          { keys: [rootHigh], duration: 'q' },
        ];
      }
      return [
        { keys: [rootLow], duration: 'q' },
        { keys: [rootHigh], duration: 'q' },
        { keys: [rootLow], duration: 'q' },
      ];
    },
  },

  // 4. Synkopierter Bass (Off-Beat-Betonung)
  {
    name: 'syncopated_bass',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const [root, third, fifth] = getChordTones(chordDegree, scaleNotes);
      const rootKey = `${scaleNotes[root]}/${octave}`;
      const fifthKey = `${scaleNotes[fifth]}/${octave}`;

      if (timeSig === '4/4') {
        // Synkope: Viertel + Achtelpause + Achtel + Viertel + Viertel
        return [
          { keys: [rootKey], duration: 'q' },
          { keys: [rootKey], duration: '8r' },
          { keys: [fifthKey], duration: '8' },
          { keys: [rootKey], duration: 'q' },
          { keys: [fifthKey], duration: 'q' },
        ];
      }
      return [
        { keys: [rootKey], duration: 'q' },
        { keys: [fifthKey], duration: '8' },
        { keys: [rootKey], duration: '8' },
        { keys: [fifthKey], duration: 'q' },
      ];
    },
  },

  // 5. Walking Bass (stufenweise Bewegung)
  {
    name: 'walking_bass',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const rootDegree = (chordDegree - 1) % 7;
      const walkDeg1 = (rootDegree + 1) % 7;
      const walkDeg2 = (rootDegree + 2) % 7;
      const walkDeg3 = (rootDegree + 3) % 7;

      if (timeSig === '4/4') {
        return [
          { keys: [`${scaleNotes[rootDegree]}/${octave}`], duration: 'q' },
          { keys: [`${scaleNotes[walkDeg1]}/${octave}`], duration: 'q' },
          { keys: [`${scaleNotes[walkDeg2]}/${octave}`], duration: 'q' },
          { keys: [`${scaleNotes[walkDeg3]}/${octave}`], duration: 'q' },
        ];
      }
      return [
        { keys: [`${scaleNotes[rootDegree]}/${octave}`], duration: 'q' },
        { keys: [`${scaleNotes[walkDeg1]}/${octave}`], duration: 'q' },
        { keys: [`${scaleNotes[walkDeg2]}/${octave}`], duration: 'q' },
      ];
    },
  },

  // 6. Achtel-Alberti (schnellere Bewegung)
  {
    name: 'alberti_eighth',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const [root, third, fifth] = getChordTones(chordDegree, scaleNotes);
      const rootKey = `${scaleNotes[root]}/${octave}`;
      const thirdKey = `${scaleNotes[third]}/${octave}`;
      const fifthKey = `${scaleNotes[fifth]}/${octave}`;

      if (timeSig === '4/4') {
        return [
          { keys: [rootKey], duration: '8' },
          { keys: [fifthKey], duration: '8' },
          { keys: [thirdKey], duration: '8' },
          { keys: [fifthKey], duration: '8' },
          { keys: [rootKey], duration: '8' },
          { keys: [fifthKey], duration: '8' },
          { keys: [thirdKey], duration: '8' },
          { keys: [fifthKey], duration: '8' },
        ];
      }
      return [
        { keys: [rootKey], duration: '8' },
        { keys: [fifthKey], duration: '8' },
        { keys: [thirdKey], duration: '8' },
        { keys: [fifthKey], duration: '8' },
        { keys: [rootKey], duration: '8' },
        { keys: [thirdKey], duration: '8' },
      ];
    },
  },

  // 7. Arpeggio aufsteigend (Root-Third-Fifth-Octave)
  {
    name: 'arpeggio_ascending',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const [root, third, fifth] = getChordTones(chordDegree, scaleNotes);
      const rootKey = `${scaleNotes[root]}/${octave}`;
      const thirdKey = `${scaleNotes[third]}/${octave}`;
      const fifthKey = `${scaleNotes[fifth]}/${octave}`;
      const rootHighKey = `${scaleNotes[root]}/${octave + 1}`;

      if (timeSig === '4/4') {
        return [
          { keys: [rootKey], duration: 'q' },
          { keys: [thirdKey], duration: 'q' },
          { keys: [fifthKey], duration: 'q' },
          { keys: [rootHighKey], duration: 'q' },
        ];
      }
      return [
        { keys: [rootKey], duration: 'q' },
        { keys: [thirdKey], duration: 'q' },
        { keys: [fifthKey], duration: 'q' },
      ];
    },
  },

  // 8. Synkopierte Oktaven
  {
    name: 'syncopated_octaves',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const [root] = getChordTones(chordDegree, scaleNotes);
      const rootLow = `${scaleNotes[root]}/${octave}`;
      const rootHigh = `${scaleNotes[root]}/${octave + 1}`;

      if (timeSig === '4/4') {
        // Punktierte Viertel + Achtel + Halbe
        return [
          { keys: [rootLow], duration: 'qd' },
          { keys: [rootHigh], duration: '8' },
          { keys: [rootLow], duration: 'h' },
        ];
      }
      return [
        { keys: [rootLow], duration: 'qd' },
        { keys: [rootHigh], duration: '8' },
        { keys: [rootLow], duration: 'q' },
      ];
    },
  },

  // 9. Oom-Pah-Variante (Root + Chord-Block)
  {
    name: 'oom_pah_chord',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      const [root, third, fifth] = getChordTones(chordDegree, scaleNotes);
      const rootKey = `${scaleNotes[root]}/${octave}`;
      const thirdKey = `${scaleNotes[third]}/${octave}`;
      const fifthKey = `${scaleNotes[fifth]}/${octave}`;

      if (timeSig === '4/4') {
        return [
          { keys: [rootKey], duration: 'q' },
          { keys: [thirdKey, fifthKey], duration: 'q' }, // Akkord!
          { keys: [rootKey], duration: 'q' },
          { keys: [thirdKey, fifthKey], duration: 'q' },
        ];
      }
      return [
        { keys: [rootKey], duration: 'q' },
        { keys: [thirdKey, fifthKey], duration: 'q' },
        { keys: [thirdKey, fifthKey], duration: 'q' },
      ];
    },
  },

  // 10. Chromatischer Durchgang (nur für Verbindung zwischen Akkorden)
  {
    name: 'chromatic_approach',
    getNotes: (chordDegree, scaleNotes, octave, timeSig) => {
      // Verwendet chromatische Durchgangsnote zur Vorbereitung auf nächsten Akkord
      const [root, third, fifth] = getChordTones(chordDegree, scaleNotes);
      const rootKey = `${scaleNotes[root]}/${octave}`;
      const thirdKey = `${scaleNotes[third]}/${octave}`;
      const fifthKey = `${scaleNotes[fifth]}/${octave}`;

      // Beispiel: Root-Third-ChromaticNote-Fifth
      // (ChromaticNote muss zur Laufzeit berechnet werden basierend auf nächstem Akkord)
      if (timeSig === '4/4') {
        return [
          { keys: [rootKey], duration: 'q' },
          { keys: [thirdKey], duration: 'q' },
          { keys: [fifthKey], duration: 'h' }, // Vereinfacht, Chromatik würde dynamisch eingefügt
        ];
      }
      return [
        { keys: [rootKey], duration: 'q' },
        { keys: [thirdKey], duration: 'q' },
        { keys: [fifthKey], duration: 'q' },
      ];
    },
  },
];
```

### 5.3 Anwendungslogik (Stufe 4 Bass)

```typescript
// In generateHarmonicBass() für difficulty === 4:
const bassPattern = pick(BASS_PATTERNS_4);
const notes = bassPattern.getNotes(chordDegree, scaleNotes, bassOctave, timeSignature);
return { notes, lastState: calculateStateFromNotes(notes) };
```

---

## 6. Akkord-Progressionen (Stufe 3 vs 4)

### 6.1 Stufe 3: Einfache Kadenzen (langsame Wechsel)

```typescript
const CHORD_PROGRESSIONS_3: Array<{
  name: string;
  progression: ChordDegree[];
  lengthBars: number;
  description: string;
}> = [
  {
    name: 'tonic_only',
    progression: [1, 1, 1, 1],          // 4 Takte nur I (zum Akkord-Lernen)
    lengthBars: 4,
    description: 'Nur Tonika (Akkord-Fokus)',
  },
  {
    name: 'simple_cadence',
    progression: [1, 1, 5, 1],          // I-I-V-I (Kadenz über 4 Takte)
    lengthBars: 4,
    description: 'Einfache Kadenz (I-V)',
  },
  {
    name: 'subdominant_intro',
    progression: [1, 4, 1, 1],          // I-IV-I-I (Subdominante kennenlernen)
    lengthBars: 4,
    description: 'Subdominante einführen',
  },
  {
    name: 'full_cadence_slow',
    progression: [1, 1, 4, 4, 5, 5, 1, 1], // I-I-IV-IV-V-V-I-I (8 Takte, sehr langsam)
    lengthBars: 8,
    description: 'Vollständige Kadenz (langsam)',
  },
  {
    name: 'alternating_tonic_dominant',
    progression: [1, 5, 1, 5],          // I-V-I-V (Wechsel üben)
    lengthBars: 4,
    description: 'Tonika-Dominante Wechsel',
  },
];

// Anwendung: Akkordwechsel MAXIMAL alle 2 Takte
const chordChangeIntervalBars = 2; // Immer 2 Takte pro Akkord in Stufe 3
```

### 6.2 Stufe 4: Erweiterte Progressionen (schnelle Wechsel)

```typescript
const CHORD_PROGRESSIONS_4: Array<{
  name: string;
  progression: ChordDegree[];
  lengthBars: number;
  changesPerBar: number;  // Akkordwechsel pro Takt
  description: string;
}> = [
  // Standard-Kadenzen (1 Akkord pro Takt)
  {
    name: 'standard_cadence',
    progression: [1, 4, 5, 1],
    lengthBars: 4,
    changesPerBar: 1,
    description: 'I-IV-V-I (Standard-Kadenz)',
  },
  {
    name: 'pop_progression',
    progression: [1, 6, 4, 5],          // I-vi-IV-V (Pop-Standard)
    lengthBars: 4,
    changesPerBar: 1,
    description: 'Pop-Progression',
  },
  {
    name: 'jazz_turnaround',
    progression: [1, 6, 2, 5],          // I-vi-ii-V (Jazz-Turnaround)
    lengthBars: 4,
    changesPerBar: 1,
    description: 'Jazz-Turnaround',
  },

  // SCHNELLE WECHSEL (2 Akkorde pro Takt)
  {
    name: 'fast_cadence',
    progression: [1, 5, 4, 1, 5, 1, 4, 5], // Wechsel alle 2 Schläge (in 4/4)
    lengthBars: 4,
    changesPerBar: 2,                   // 2 Akkorde pro Takt!
    description: 'Schnelle Akkordwechsel',
  },
  {
    name: 'rapid_turnaround',
    progression: [1, 6, 2, 5, 1, 4, 1, 5],
    lengthBars: 4,
    changesPerBar: 2,
    description: 'Schneller Jazz-Turnaround',
  },

  // Erweiterte 8-Takt-Progressionen
  {
    name: 'extended_progression',
    progression: [1, 1, 6, 6, 4, 4, 5, 1], // Klassische 8-Takt-Periode
    lengthBars: 8,
    changesPerBar: 1,
    description: 'Erweiterte Periode',
  },
  {
    name: 'circle_of_fifths',
    progression: [1, 4, 7, 3, 6, 2, 5, 1], // Quintenzirkel-Ausschnitt
    lengthBars: 8,
    changesPerBar: 1,
    description: 'Quintenzirkel-Progression',
  },
];

// Anwendung: Akkordwechsel VARIABEL (1-2 pro Takt)
const chordChangeIntervalBars = progression.changesPerBar === 2 ? 0.5 : 1;
```

---

## 7. Intervall-Beschränkungen (Sprung-Limits)

### 7.1 Stufe 3: Konservative Sprünge

```typescript
const INTERVAL_LIMITS_3 = {
  // Melodische Bewegung (Treble, zwischen einzelnen Noten)
  melodic: {
    maxIntervalSemitones: 7,        // Max. Quinte (7 Halbtöne)
    maxIntervalScaleDegrees: 4,     // Max. 5 Skalenstufen (Quinte)
    preferredStepwise: 70,          // 70% stufenweise Bewegung (Sekunden)
    allowedThirds: 20,              // 20% Terzsprünge
    allowedFourthsFifths: 10,       // 10% Quart/Quint-Sprünge
  },

  // Achtel-Noten (NIEMALS Sprünge!)
  eighthNotes: {
    maxIntervalSemitones: 2,        // Max. Sekunde (2 Halbtöne)
    maxIntervalScaleDegrees: 1,     // Nur Sekundschritte
    preferredStepwise: 100,         // 100% stufenweise (STRIKT!)
  },

  // Akkord-interne Sprünge (zwischen Akkordtönen)
  chordJumps: {
    maxIntervalSemitones: 7,        // Max. Quinte (innerhalb Akkord)
    maxIntervalScaleDegrees: 4,
  },

  // Zwischen Akkord und Melodie (nach Akkord)
  postChord: {
    maxIntervalSemitones: 4,        // Max. Terz nach Akkord
    maxIntervalScaleDegrees: 2,     // Sanfter Übergang zur Melodie
    preferredStepwise: 80,          // 80% schrittweise nach Akkord
  },
};
```

### 7.2 Stufe 4: Erweiterte Sprünge

```typescript
const INTERVAL_LIMITS_4 = {
  // Melodische Bewegung (Treble)
  melodic: {
    maxIntervalSemitones: 9,        // Max. Sexte (9 Halbtöne)
    maxIntervalScaleDegrees: 5,     // Max. 6 Skalenstufen (Sexte)
    preferredStepwise: 40,          // 40% stufenweise Bewegung
    allowedThirds: 25,              // 25% Terzsprünge
    allowedFourthsFifths: 15,       // 15% Quart/Quint-Sprünge
    allowedSixths: 10,              // 10% Sextsprünge (NEU!)
    allowedOctaves: 5,              // 5% Oktavsprünge (nur bei Phrasengrenzen)
    allowedSevenths: 5,             // 5% Septimen (expressiv)
  },

  // Achtel-Noten (Terzen erlaubt)
  eighthNotes: {
    maxIntervalSemitones: 4,        // Max. Terz (4 Halbtöne)
    maxIntervalScaleDegrees: 2,     // Sekunden + Terzen
    preferredStepwise: 70,          // 70% stufenweise
    allowedThirds: 30,              // 30% Terzsprünge
  },

  // Akkord-interne Sprünge
  chordJumps: {
    maxIntervalSemitones: 12,       // Max. Oktave (bei Umkehrungen)
    maxIntervalScaleDegrees: 7,
  },

  // Zwischen Akkord und Melodie
  postChord: {
    maxIntervalSemitones: 7,        // Max. Quinte nach Akkord
    maxIntervalScaleDegrees: 4,
    preferredStepwise: 50,          // 50% schrittweise nach Akkord
  },

  // Bass-Sprünge (Oktaven sind idiomatisch!)
  bassJumps: {
    maxIntervalSemitones: 12,       // Oktaven erlaubt
    maxIntervalScaleDegrees: 7,
    preferredOctaves: 30,           // 30% Oktavsprünge im Bass (typisch!)
    preferredFifths: 40,            // 40% Quintsprünge (harmonisch)
    preferredStepwise: 30,          // 30% Walking Bass
  },
};
```

---

## 8. Implementierungs-Checkliste

### 8.1 Stufe 3 - Code-Änderungen

```typescript
// In exerciseGenerator.ts

// 1. Neue Rhythmus-Arrays hinzufügen
const RHYTHMIC_PATTERNS_4_4_CHORD_3 = [...]; // Siehe Abschnitt 2.2
const RHYTHMIC_PATTERNS_3_4_CHORD_3 = [...]; // Siehe Abschnitt 2.3

// 2. Arpeggio-Patterns hinzufügen
const ARPEGGIO_PATTERNS_3 = [...];           // Siehe Abschnitt 3.2

// 3. Triolen-Patterns hinzufügen (minimal!)
const TRIPLET_PATTERNS_3 = [...];            // Siehe Abschnitt 4.1

// 4. Intervall-Gewichte anpassen
INTERVAL_WEIGHTS[3] = [0, 70, 20, 8, 2, 0, 0]; // 70% Sekunden, 20% Terzen, max Quinte

// 5. Akkord-Progressionen für Stufe 3
const CHORD_PROGRESSIONS_3 = [...];          // Siehe Abschnitt 6.1

// 6. fillBar() erweitern:
// - Akkord-Platzierung: 25% Chance auf Akkord am Taktanfang
// - Wenn Akkord: 60% geblockt, 40% gebrochen (Arpeggio)
// - Nach Akkord: maxInterval = 2 (Terz) für sanften Übergang

// 7. generateNote() anpassen:
// - Achtel-Noten: STRIKT maxInterval = 1 (nur Sekunden!)
// - Post-Chord-Notes: maxInterval = 2 (Terz)

// 8. Triolen-Logik:
// - Max 5-10% der Takte
// - Nur einfache Patterns (siehe 4.1)
```

### 8.2 Stufe 4 - Code-Änderungen

```typescript
// 1. Erweiterte Bass-Patterns implementieren
const BASS_PATTERNS_4 = [...];               // Siehe Abschnitt 5.2

// 2. Triolen-Patterns erweitern
const TRIPLET_PATTERNS_4 = [...];            // Siehe Abschnitt 4.2

// 3. Intervall-Gewichte anpassen
INTERVAL_WEIGHTS[4] = [3, 40, 25, 15, 10, 7, 0]; // Mehr Sprünge, bis Sexte

// 4. Akkord-Progressionen erweitern
const CHORD_PROGRESSIONS_4 = [...];          // Siehe Abschnitt 6.2

// 5. generateHarmonicBass() erweitern:
// - Zufällige Auswahl aus BASS_PATTERNS_4
// - Oktavsprünge erlauben (max 12 Halbtöne)

// 6. fillBar() erweitern:
// - Akkord-Platzierung: 40% Chance
// - Schnellere Akkordwechsel: alle 2 Schläge möglich (changesPerBar = 2)
// - Triolen: 15-25% der Takte

// 7. generateNote() anpassen:
// - Achtel-Noten: maxInterval = 2 (Terzen erlaubt)
// - Sexten-Sprünge: 7% Wahrscheinlichkeit
// - Oktavsprünge: nur bei Phrasengrenzen (5%)

// 8. Synkopen-Logik:
// - Bass: Synkopierte Patterns in BASS_PATTERNS_4
// - Treble: Punktierte Achtel + Synkopen (bereits implementiert)
```

---

## 9. Validierungs-Regeln

### 9.1 Stufe 3 - Qualitätschecks

```typescript
function validateExerciseStufe3(exercise: Exercise): ValidationResult {
  const errors: string[] = [];

  // 1. Akkord-Häufigkeit
  const chordCount = countChordsInExercise(exercise);
  const totalBars = exercise.bars.length;
  const chordPerBarRatio = chordCount / totalBars;

  if (chordPerBarRatio > 0.5) {
    errors.push('Zu viele Akkorde für Stufe 3 (max 1 Akkord pro 2 Takte)');
  }

  // 2. Intervall-Limits (Melodie)
  exercise.bars.forEach(bar => {
    const melodicIntervals = calculateIntervals(bar.notes);
    const maxInterval = Math.max(...melodicIntervals);

    if (maxInterval > 7) { // Quinte = 7 Halbtöne
      errors.push(`Takt ${bar.number}: Intervall zu groß (${maxInterval} > 7 Halbtöne)`);
    }
  });

  // 3. Achtel-Noten: Nur Sekundschritte
  exercise.bars.forEach(bar => {
    const eighthNoteIntervals = getIntervalsForDuration(bar.notes, '8');
    const hasJumps = eighthNoteIntervals.some(i => i > 2);

    if (hasJumps) {
      errors.push(`Takt ${bar.number}: Achtel-Noten mit Sprüngen (nur Sekunden erlaubt!)`);
    }
  });

  // 4. Triolen-Häufigkeit
  const tripletBars = countTripleBarsStufe3(exercise);
  const tripletRatio = tripletBars / totalBars;

  if (tripletRatio > 0.10) {
    errors.push(`Zu viele Triolen für Stufe 3 (${tripletRatio * 100}% > 10%)`);
  }

  // 5. Akkord-Spannweite
  exercise.bars.forEach(bar => {
    const chords = findChords(bar.notes);
    chords.forEach(chord => {
      const span = calculateChordSpan(chord);
      if (span > 7) {
        errors.push(`Takt ${bar.number}: Akkord-Spannweite zu groß (${span} > 7 Halbtöne)`);
      }
    });
  });

  return { valid: errors.length === 0, errors };
}
```

### 9.2 Stufe 4 - Qualitätschecks

```typescript
function validateExerciseStufe4(exercise: Exercise): ValidationResult {
  const errors: string[] = [];

  // 1. Akkord-Wechsel-Häufigkeit
  const chordChanges = countChordChanges(exercise);
  const totalBeats = calculateTotalBeats(exercise);
  const changesPerMinute = (chordChanges / totalBeats) * exercise.tempo;

  if (changesPerMinute > 120) { // Mehr als 2 Wechsel pro Sekunde @ 76 BPM
    errors.push('Akkordwechsel zu schnell für Stufe 4');
  }

  // 2. Intervall-Limits (Melodie: max Sexte)
  exercise.bars.forEach(bar => {
    const melodicIntervals = calculateIntervals(bar.notes);
    const maxInterval = Math.max(...melodicIntervals);

    if (maxInterval > 9) { // Sexte = 9 Halbtöne
      errors.push(`Takt ${bar.number}: Intervall zu groß (${maxInterval} > 9 Halbtöne)`);
    }
  });

  // 3. Achtel-Noten: Max Terz
  exercise.bars.forEach(bar => {
    const eighthNoteIntervals = getIntervalsForDuration(bar.notes, '8');
    const hasLargeJumps = eighthNoteIntervals.some(i => i > 4); // Terz = 4 Halbtöne

    if (hasLargeJumps) {
      errors.push(`Takt ${bar.number}: Achtel-Noten mit zu großen Sprüngen (max Terz!)`);
    }
  });

  // 4. Triolen-Häufigkeit
  const tripletBars = countTripleBarsStufe4(exercise);
  const tripletRatio = tripletBars / exercise.bars.length;

  if (tripletRatio > 0.25) {
    errors.push(`Zu viele Triolen für Stufe 4 (${tripletRatio * 100}% > 25%)`);
  }

  // 5. Bass-Pattern-Vielfalt
  const bassPatterns = analyzeBassPatterns(exercise);
  const uniquePatterns = new Set(bassPatterns).size;

  if (uniquePatterns < 3 && exercise.bars.length > 8) {
    errors.push('Zu wenig Bass-Pattern-Vielfalt (min 3 verschiedene Patterns)');
  }

  return { valid: errors.length === 0, errors };
}
```

---

## 10. Zusammenfassung: Kern-Unterschiede Stufe 3 vs 4

| Aspekt | Stufe 3 | Stufe 4 |
|--------|---------|---------|
| **Akkorde** | Kennenlernen, geblockt/gebrochen 60:40 | Flüssig wechseln, mehrmals pro Takt |
| **Akkord-Wechsel** | Max. alle 2 Takte | 1-2 pro Takt |
| **Akkord-Typen** | Dur/Moll Dreiklang, Zweiklänge | + Umkehrungen, Septakkorde (selten) |
| **Melodie-Intervalle** | Max Quinte, 70% Sekunden | Max Sexte, 40% Sekunden |
| **Achtel-Intervalle** | NUR Sekunden (strikt!) | Sekunden + Terzen (70:30) |
| **Triolen** | 5-10%, einfach | 15-25%, komplex |
| **Bass-Patterns** | Root-Fifth-Wechsel | Alberti, Oktaven, Synkopen, Walking |
| **Große Sprünge** | Fast eliminiert (<5%) | Dosiert (10-15%), v.a. Oktaven im Bass |
| **Rhythmus** | Einfach, überschaubar | Punktierte Achtel, Synkopen häufig |

---

## 11. Implementierungs-Priorität

### Phase 1 (Critical Path)
1. ✅ Akkord-Typen-Definition (Abschnitt 1)
2. ✅ Rhythmische Patterns mit Akkorden (Abschnitt 2)
3. ✅ Arpeggio-Patterns (Abschnitt 3)
4. ✅ Intervall-Limits anpassen (Abschnitt 7)

### Phase 2 (Enhancement)
5. ✅ Bass-Patterns erweitern (Abschnitt 5)
6. ✅ Akkord-Progressionen (Abschnitt 6)
7. ✅ Triolen-Integration (Abschnitt 4)

### Phase 3 (Validation)
8. ✅ Validierungs-Funktionen (Abschnitt 9)
9. ✅ Quality-Tests für generierte Übungen

---

## 12. Musikalische Begründungen

### Warum keine schnellen Akkordwechsel in Stufe 3?
**Pädagogik:** Das Auge muss den Akkord als Einheit erfassen lernen (Gestalt-Erkennung). Schnelle Wechsel überfordern die visuelle Verarbeitung und führen zu "Noten-Jagen" statt zu flüssigem Lesen.

**Motorik:** Die Hand braucht Zeit, die Akkordform einzunehmen. Bei zu schnellen Wechseln wird der Fokus auf Fingersatz statt auf Notenlesen gelegt.

### Warum strikt Sekunden bei Achteln (Stufe 3)?
**Lesbarkeit:** Achtel-Noten werden oft in Balken gruppiert. Sprünge innerhalb dieser Gruppen erzeugen ein "Zickzack-Muster" im Notenbild, das schwer zu erfassen ist.

**Idiomatik:** Stufenweise Achtel-Bewegung ist das natürlichste musikalische Muster (Skalen, Arpeggien). Sprünge in schnellen Noten sind Ausnahmen und sollten erst später eingeführt werden.

### Warum Alberti-Bass in Stufe 4?
**Klassisches Muster:** Alberti-Bass ist DAS Standard-Begleitmuster der Klassik (Mozart, Haydn). Jeder Pianist muss es flüssig lesen können.

**Hand-Koordination:** Trainiert unabhängige Handbewegung: Linke Hand spielt repetitives Muster, rechte Hand spielt Melodie.

**Harmonisches Hören:** Das gebrochene Muster macht die harmonische Struktur hörbar (Root-Fifth-Third = I-V-III).

---

## Schlussworte

Diese Spezifikation ist das Ergebnis von 250 Jahren Klavierpädagogik, destilliert in maschinenlesbarer Form. Jede Entscheidung basiert auf der Erkenntnis, dass **musikalisches Lernen progressiv und kontextuell** sein muss: Neue Elemente werden einzeln eingeführt, in vertrauten Kontexten geübt und erst dann kombiniert.

Stufe 3 sagt: "Hier ist ein Akkord. Lerne ihn kennen."
Stufe 4 sagt: "Jetzt lerne, zwischen Akkorden zu tanzen."

**Vivat musica!**

---

*Erstellt von: Musiktheorie-Experte (Ludwig van Beethoven 2.0)*
*Für: ClefBuddy Sight-Reading Trainer*
*Technologie: TypeScript + VexFlow*
