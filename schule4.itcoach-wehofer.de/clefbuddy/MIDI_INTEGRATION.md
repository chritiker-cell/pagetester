# MIDI Integration - ClefBuddy

## Übersicht

ClefBuddy unterstützt MIDI-Keyboards über die Web MIDI API für interaktives Üben.

## Browser-Unterstützung

| Browser | Unterstützt |
|---------|-------------|
| Chrome | ✓ Ja |
| Edge | ✓ Ja |
| Opera | ✓ Ja |
| Firefox | ✗ Nein (kein Web MIDI) |
| Safari | ✗ Nein (kein Web MIDI) |

> **Hinweis:** Web MIDI erfordert HTTPS oder localhost.

## Architektur

### Dateien

```
src/
├── types/
│   ├── midi.ts           # MIDI TypeScript Types
│   ├── comparison.ts     # Note Comparison Types
│   └── scoring.ts        # Scoring Types
├── store/
│   ├── useMidiStore.ts   # MIDI State Management
│   └── useScoringStore.ts # Score State (persistiert)
├── utils/
│   ├── midiEngine.ts     # Web MIDI API Wrapper
│   ├── midiCompat.ts     # Browser-Kompatibilität
│   ├── noteComparison.ts # Vergleichs-Algorithmus
│   ├── practiceMode.ts   # Practice Controller
│   └── scoringEngine.ts  # Bewertungs-Algorithmus
└── components/
    ├── ModeSelector.tsx       # Listen/Practice Umschalter
    ├── MidiDeviceSelector.tsx # Gerät-Auswahl
    ├── PracticeVisualizer.tsx # Echtzeit-Feedback
    ├── ResultsModal.tsx       # Ergebnis-Anzeige
    └── ScoreBreakdown.tsx     # Score-Details
```

### Flow

```
MIDI Keyboard → midiEngine → useMidiStore → practiceMode → noteComparison → scoringEngine → UI
```

## MIDI Engine API

```typescript
import {
  initMIDIEngine,
  connectToDevice,
  disconnectFromDevice,
  onNoteOn,
  onNoteOff,
  midiNoteToName,
  midiNoteToVexFlow,
} from './utils/midiEngine';

// Initialisierung
const devices = await initMIDIEngine();

// Gerät verbinden
connectToDevice(deviceId);

// Events registrieren
onNoteOn((event) => {
  console.log(`Note On: ${event.note} (${midiNoteToName(event.note)})`);
});

onNoteOff((event) => {
  console.log(`Note Off: ${event.note}`);
});
```

## MIDI Store API

```typescript
import { useMidiStore } from './store/useMidiStore';

// In React Component
const {
  connectionStatus,    // 'disconnected' | 'requesting' | 'connected' | 'error' | 'unsupported'
  availableDevices,    // MIDIDevice[]
  selectedDeviceId,    // string | null
  activeNotes,         // Map<number, PlayedNote>
  playedNotes,         // PlayedNote[]
  isListening,         // boolean
  error,               // string | null

  // Actions
  requestAccess,       // () => Promise<boolean>
  selectDevice,        // (deviceId: string) => boolean
  disconnect,          // () => void
  startListening,      // () => void
  stopListening,       // () => void
  clearPlayedNotes,    // () => void
} = useMidiStore();
```

## Note Comparison

### Algorithmus

1. **Pitch-Vergleich**: Prüft ob gespielte MIDI-Note mit erwarteter Note übereinstimmt
2. **Timing-Vergleich**: Berechnet zeitliche Abweichung (ms)
3. **Dauer-Vergleich**: Vergleicht Notenlänge mit erwartetem Wert

### Timing-Toleranzen

| Bewertung | Toleranz |
|-----------|----------|
| Perfect | ±50ms |
| Good | ±100ms |
| Acceptable | ±200ms |
| Early/Late | >200ms |

### Score-Gewichtung

| Kategorie | Gewicht |
|-----------|---------|
| Pitch | 50% |
| Timing | 30% |
| Rhythm | 20% |

### Stern-Bewertung

| Sterne | Punktzahl |
|--------|-----------|
| ★★★★★ | ≥95% |
| ★★★★☆ | ≥85% |
| ★★★☆☆ | ≥70% |
| ★★☆☆☆ | ≥50% |
| ★☆☆☆☆ | <50% |

## Practice Mode

### States

```
idle → countdown → playing → finished
              ↑       ↓
              └── paused
```

### API

```typescript
import {
  initPracticeMode,
  startPractice,
  pausePractice,
  resumePractice,
  stopPractice,
  resetPractice,
  handleMidiInput,
  getPracticeState,
  getRunningAccuracy,
} from './utils/practiceMode';

// Initialisieren
initPracticeMode(scheduledNotes, {
  countdownBeats: 4,
  tempo: 80,
  metronomeEnabled: true,
}, {
  onStateChange: (state) => console.log(state),
  onCountdownBeat: (beat, total) => console.log(`${beat}/${total}`),
  onExpectedNote: (index, note) => highlightNote(note.id),
  onUserNote: (playedNote, comparisonState) => updateUI(comparisonState),
  onComplete: (summary) => showResults(summary),
});

// Starten
await startPractice();

// MIDI-Input verarbeiten
handleMidiInput(midiEvent);
```

## Visual Feedback

### CSS-Klassen

```css
.note-current   /* Blau pulsierend - aktuelle Note */
.note-correct   /* Grün - richtig gespielt */
.note-incorrect /* Rot - falsch gespielt */
.note-missed    /* Orange - verpasst */
```

### Usage

```typescript
import {
  highlightNotePractice,
  clearPracticeFeedback,
} from './utils/vexflowRenderer';

// Feedback setzen
highlightNotePractice(noteId, 'correct');
highlightNotePractice(noteId, 'incorrect');
highlightNotePractice(noteId, 'current');

// Alles zurücksetzen
clearPracticeFeedback();
```

## Scoring Store

```typescript
import { useScoringStore } from './store/useScoringStore';

const {
  currentScore,    // PracticeScore | null
  recentScores,    // PracticeScore[] (letzte 10)
  bestScores,      // Map<exerciseId, ExerciseBestScore>
  showResults,     // boolean

  // Actions
  recordScore,     // (summary, exerciseId, ...) => SessionSummary
  showResultsModal,
  hideResultsModal,
  getBestScore,    // (exerciseId) => ExerciseBestScore | null
} = useScoringStore();
```

## Troubleshooting

### "MIDI wird nicht unterstützt"
- Browser wechseln zu Chrome, Edge oder Opera
- HTTPS verwenden (oder localhost)

### "Kein MIDI-Gerät gefunden"
1. MIDI-Keyboard anschließen
2. Seite neu laden
3. Auf "Aktualisieren" klicken

### "MIDI-Zugriff verweigert"
- Browser-Berechtigungen prüfen
- Seite mit Cmd/Ctrl+Shift+R neu laden

### Timing-Probleme
- USB-MIDI bevorzugen (niedrigere Latenz)
- Andere USB-Geräte trennen
- Audio-Buffer-Größe reduzieren
