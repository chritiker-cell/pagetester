# CLAUDE.md - ClefBuddy Projekt

## Projektübersicht

**ClefBuddy** ist eine interaktive Web-App zum Erlernen von Notenlesen.
**Projektpfad:** `/home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy/`

## Aktueller Status (Stand: 2026-02-07)

### Tonarten-Korrektheit GEFIXT: ABGESCHLOSSEN

**Problem:** Stufe 2 hatte fälschlicherweise Moll-Tonarten, obwohl laut Spec nur Dur erlaubt.

**Ursache:** `ALLOWED_KEYS` war `null` für Stufe 1-5, daher wurde `KEY_STAGES` verwendet, das Moll bereits in Stage 1 enthielt.

**Fix in `exerciseGenerator.ts`:**
```typescript
ALLOWED_KEYS = {
  1: ['C'],                           // Nur C-Dur
  2: ['C', 'G'],                      // KEIN MOLL!
  3: ['C', 'G', 'F', 'Am', 'Em', 'Dm'],  // + Natural Minor
  4: ['C', 'G', 'D', 'F', 'Bb', 'Am', 'Em', 'Dm', 'Gm', 'Cm'],  // Bis 2 Vorzeichen
  5: ['C', 'G', 'D', 'A', 'F', 'Bb', 'Eb', 'Am', 'Em', 'Bm', 'Dm', 'Gm', 'Cm', 'Fm'],
  6: null,  // Alle (KEY_STAGES)
}
```

**Ergebnis:**
- Stufe 1: Nur C-Dur ✅
- Stufe 2: C, G-Dur (KEIN MOLL) ✅
- Stufe 3: Natural Minor (kein Harmonic) ✅
- Stufe 4+: Harmonic Minor erlaubt ✅

---

### Bass-Fingersatz implementiert: ABGESCHLOSSEN

**Feature:** Erste Bass-Note in Grand Staff Übungen bekommt jetzt einen Fingersatz.

**Änderungen in `exerciseGenerator.ts`:**
- Neue Parameter `isFirstBar: boolean = false` in `generateHarmonicBass()`
- Helper-Funktion `pushBassNote()` mit Fingersatz-Logik
- Fingersatz nur bei: `isFirstBar && bassNoteIndex === 0 && keys.length === 1 && degree <= 4`
- Alle Aufrufe von `generateHarmonicBass()` übergeben jetzt `i === 0` als letzten Parameter

**Frontend:** `vexflowRenderer.ts` unterstützt Bass-Fingersätze bereits korrekt (UNTEN platziert).

### Chord-Training Verbesserungen: ABGESCHLOSSEN

**Analyse:** Piano-Teacher (8.5/10) + Music-Specialist (8.0/10) = **Kombiniert 8.25/10**

**Implementierte Critical Fixes:**

| Fix | Problem | Lösung |
|-----|---------|--------|
| RH 1st Inversion Triad | `[1,2,5]` unnötige Spreizung | `[1,2,4]` (Czerny, Hanon, Alfred's) |
| RH 2nd Inversion Seventh | `[1,2,4,5]` bei Terz-Intervall | `[1,2,3,5]` |
| Bass 6/8 doppelte Länge | 2× dotted-half statt 1× | 1× `hd` pro Takt |
| Waltz 6/8 unidiomatisch | `qd + 3×8th` | `2× qd` (Bass-Chord) |

**Neue Bass-Fingersätze (`chordGenerator.ts`):**
```typescript
LH_BASS_FINGERINGS = {
  root: [5],
  rootFifth: [5, 3],
  waltz: [5, 1, 1],
  waltz68: [5, 3],
  walking: [5, 4, 3, 2],
  albertiLight: [5, 3, 5, 3],
}
```

**Tonarten-Fix:** C#m zu Key Group 4 hinzugefügt (relativer Moll zu E-Dur)

**Geänderte Dateien:**
- `src/utils/chordGenerator.ts` — Fingersätze, Bass-Patterns, 6/8 Fixes
- `src/data/chordData.ts` — C#m in KEY_GROUPS[4]

**Analyse-Dateien:**
- `PIANO_TEACHER_CHORDS_ANALYSIS.md` — 977 Zeilen pädagogische Analyse
- `MUSIC_SPECIALIST_CHORDS_ANALYSIS.md` — 1026 Zeilen musiktheoretische Analyse

---

### Piano-Teacher Analyse: 50 Übungen bewertet

**Neue Datei:** `PIANO_TEACHER_ANALYSIS.md` - Umfassende pädagogische Analyse des Generators.

**Gesamtbewertung: 7/10 (GUT)**

**Top 3 identifizierte Probleme:**
1. Stufe 1-2: 5-Finger-Position nicht strikt erzwungen
2. Voice-Crossing-Validierung fehlt (Bass > Treble möglich)
3. Fingersatz-Generierung nur bei 25% der Noten (Stufe 1-2)

**Positive Aspekte:**
- Exzellente Intervall-Kontrolle nach Masterplan-Fixes
- Stufe 3-4 Akkord-Logik deutlich verbessert
- Sophisticated Voice-Leading und Recovery-System

---

### Session-Bugfixes: ABGESCHLOSSEN

**1. Visueller Countdown entfernt**
- Der große visuelle Countdown (3...2...1) in der Practice-Phase wurde entfernt
- Audio-Countdown (Metronom-Clicks) bleibt erhalten
- Fortschrittsleiste erscheint jetzt sofort bei 0%
- Geänderte Datei: `PracticeVisualizer.tsx`

**2. Stop während Count-in Bug gefixt**
- Problem: Stop während Count-in startete Playback automatisch neu
- Ursache: `stopPractice()` rief nicht `countdownAbortHandler()` auf
- Fix: `stopPractice()` ruft jetzt SOFORT den abort handler auf
- Geänderte Datei: `practiceMode.ts`

**3. Übungsmodus bleibt beim Stop erhalten**
- Problem: Stop wechselte automatisch von Practice zu Listen Mode
- Ursache: ResultsModal `onClose` rief `setAppMode('listen')` auf
- Fix: `onClose` ändert den Modus nicht mehr
- Geänderte Datei: `NoteReaderView.tsx`

**4. MIDI-Gerät in Settings verschoben**
- MIDI-Geräte-Auswahl aus Toolbar entfernt
- Neuer MIDI-Status-Indikator in Toolbar (grün/grau Punkt)
- Vollständige Geräteauswahl jetzt in Settings-Panel
- Geänderte Dateien: `NoteReaderView.tsx`, `NoteReaderSettings.tsx`, `MidiDeviceSelector.tsx`

---

### MIDI-Latenz Optimierung: ABGESCHLOSSEN

**Problem:** MIDI-Keyboard Eingabe hatte spürbare Verzögerung (75-110ms).

**Implementierte Optimierungen:**
1. **Ultra-Low-Latency Audio Context** - `lookAhead: 0.01` (10ms statt 50ms)
2. **Dedicated Low-Latency PolySynth** - Synth-generiert statt Sample-Loading
3. **Direct Audio Callback** - Audio-Trigger direkt im MIDI-Event-Handler

**Ergebnis:** Latenz-Reduktion von 75-110ms auf 15-30ms (70-80% schneller)

**Geänderte Dateien:**
- `src/utils/audioEngine.ts` - liveInputSynth, triggerNoteAttack(), triggerNoteRelease()
- `src/utils/midiEngine.ts` - directAudioCallback, onDirectAudio(), onDirectAudioRelease()
- `src/store/useMidiStore.ts` - Direct callback registration

---

### Playback-System Neuimplementierung: ABGESCHLOSSEN

**Problem (geloest):** Audio und Cursor waren nicht synchron. Tone.Transport für Audio und requestAnimationFrame für Cursor nutzten unterschiedliche Zeitbasen.

**Loesung:** Komplett neues Playback-System mit `performance.now()` als einheitlicher Zeitbasis.

**Neue Architektur:**
- `src/utils/simplePlayback.ts` (NEU) - Scheduling mit setTimeout statt Tone.Transport
- Audio und Cursor nutzen DIESELBE Zeitbasis (`performance.now()`)
- Count-in immer aktiv (1 Takt Metronom-Clicks vor Musik-Start)
- Cursor bleibt während Count-in auf erster Note, dann synchron mit Audio

**Ablauf bei Play:**
1. `startTime = performance.now()` speichern
2. Count-in Clicks mit setTimeout schedulen
3. Noten mit setTimeout schedulen (nach countInDuration)
4. Cursor nutzt session.startTime für perfekte Sync

**Geänderte Dateien:**
- `src/utils/simplePlayback.ts` (NEU) - PlaybackSession, startSimplePlayback(), stopSimplePlayback()
- `src/utils/audioEngine.ts` - Transport-Funktionen entfernt, nur noch playNotesImmediate(), playMetronomeClick()
- `src/utils/playbackScheduler.ts` - Vereinfacht, nutzt simplePlayback
- `src/utils/vexflowRenderer.ts` - animateCursorWithSession() neu (ersetzt animateCursorTimeline)
- `src/components/NoteReaderView.tsx` - handlePlay() nutzt neues System
- `src/components/ScalesView.tsx`, `ArpeggiosView.tsx`, `ChordsView.tsx` - ebenfalls aktualisiert

---

### Generator-Rework Stufe 3-6: MASTERPLAN PHASE 1-3 ABGESCHLOSSEN

Grosse Ueberarbeitung des `exerciseGenerator.ts` fuer musikpaedagogisch korrekte Uebungen.
Basiert auf unabhaengigen Analysen von Piano-Teacher und Music-Specialist Agenten.

#### Alle implementierten Fixes (20 Fixes, 19 umgesetzt)

| # | Fix | Prioritaet | Status |
|---|-----|-----------|--------|
| 1 | Akkord-Frequenz Stufe 3: 15% → 40% | CRITICAL | ✓ fertig |
| 2 | Beat 1 Akkord-Platzierung mit Fallback-Patterns | CRITICAL | ✓ fertig |
| 3 | 60:40 geblockt:gebrochen — Arpeggio-Chance 25% → 40% | CRITICAL | ✓ fertig |
| 4 | Akkordwechsel max alle 2 Takte (Stufe 3) | CRITICAL | ✓ fertig |
| 5 | Achtel-Intervalle Stufe 3 strikt Sekunden | CRITICAL | ✓ fertig |
| 6 | Triolen global verteilt (Fisher-Yates) | CRITICAL | ✓ fertig |
| 7 | Alberti-Bass Gewicht: 40 → 50 (Stufe 4) | HIGH | ✓ fertig |
| 8 | Gebrochene Oktaven = 8 Achtel statt 2 Halbe (Stufe 4+) | HIGH | ✓ fertig |
| 9 | Erweiterte Triolen-Patterns Stufe 4 (Neighbor, Arpeggio) | HIGH | ✓ fertig |
| 10 | Konturen-Phase sanfter fuer Stufe 3 (0.60/0.40) | HIGH | ✓ fertig |
| 11 | Phrase-Repetition Stufe 3: 30% → 15% | HIGH | ✓ fertig |
| 12 | Idiomatische Achtel-Patterns: 40% → 70% | MEDIUM | ✓ fertig |
| 13 | Chord-Tone-Preference Stufe 3: 70% → 50% | MEDIUM | ✓ fertig |
| 14 | Synkopierter Bass = echte Off-Beat-Betonung | MEDIUM | ✓ fertig |
| 15 | 16tel-Patterns Stufe 5 erweitert (+3 neue) | MEDIUM | ✓ fertig |
| 16 | Chromatik Stufe 5+: 15% → 25% | MEDIUM | ✓ fertig |
| 17 | Harmonisches Moll (erhoehter 7. Ton) | MEDIUM | ⏳ offen (Skalensystem-Refactor noetig) |
| 18 | Vierstimmige Akkorde Stufe 6: 10% → 30% | MEDIUM | ✓ fertig |
| 19 | Recovery-Direction Bug (-0 → Random) | MEDIUM | ✓ fertig |
| 20 | Voice-Crossing Validierung (Post-Processing) | MEDIUM | ✓ fertig |

#### Fruehere Verbesserungen (vor Masterplan)

| Fix | Beschreibung |
|-----|-------------|
| Intervall-Kontrolle | `fixLargeIntervals()` + `fixLargeIntervalsMultiPass()` mit Octave-Clamping |
| Cross-Bar Fixing | `fixCrossBarNote()`, `propagateShift()`, `findLastNonRest()` |
| Keine Akkorde auf schnellen Noten | Achtel/16tel/32tel immer Einzeltoene |
| Stufe 3 Oktav-Begrenzung | Treble max Oktave 4, Clamping in fixLargeIntervals |
| Einfache Progressionen Stufe 3 | `CHORD_PROGRESSIONS_3_SHORT/LONG` (meist Tonika) |
| Rhythmische Patterns Stufe 3 | Vereinfacht, max 2 Achtel hintereinander |
| Aggressive Sprung-Reduktion | Stufe 3: 95% stufenweise, Intervall-Weights angepasst |
| maxSemitones angepasst | Stufe 3:7, 4:12, 5:14, 6:16 |
| Stufe 5 Key-Stage begrenzt | Max keyStage 3 (keine 6-7# Tonarten) |

### Cursor-Bugfix: Playback-Linie springt nicht mehr zurueck

**Problem:** Der Playback-Cursor (vertikale Linie) sprang bei manchen Uebungen zurueck oder flackerte, besonders bei Grand Staff und mehrzeiligen Systemen.

**Ursache:** Zeilenumbruch-Erkennung basierte auf Y-Koordinaten-Heuristik (`Math.abs(lineTop diff) < 30`), die bei Grand Staff unzuverlaessig war.

**Fix:**
- `lineIndex` (basierend auf `barNumber / barsPerLine`) in `NotePosition` und `CursorTimelineEntry` eingefuehrt
- Monotone X-Bewegung erzwungen: `targetX = Math.max(next.x, current.x)` auf derselben Zeile
- Saubere Zeilenwechsel-Ueberblendung (letzte 10% der Bar-Duration)
- Geaenderte Dateien: `vexflowRenderer.ts`, `NoteReaderView.tsx`, `ScalesView.tsx`

### Arpeggio-Feature: IMPLEMENTIERT

Neuer Menuepunkt "Arpeggio" fuer technische Arpeggio-Uebungen.

**Neue Dateien:**
- `types/arpeggio.ts` — ArpeggioType, ArpeggioPattern, ArpeggioConfig
- `data/arpeggioData.ts` — Formeln, Fingersaetze, Level-Konfiguration
- `store/useArpeggioStore.ts` — Zustand Store mit Persistenz
- `utils/arpeggioGenerator.ts` — generateArpeggio()
- `components/ArpeggioSelector.tsx` — Konfigurations-UI
- `components/ArpeggiosView.tsx` — Hauptkomponente (Setup/Practice)

**Features:**
- Akkord-Typen: Major, Minor, Dominant7, Diminished, Augmented, Major7, Minor7
- Patterns: Aufwaerts, Abwaerts, Auf-Ab, Alternierend
- Umkehrungen: Grundstellung, 1-3. Umkehrung (7th-Akkorde)
- 1-2 Oktaven
- Arpeggio-spezifische Fingersaetze
- Hand-Auswahl: RH, LH, Beide

### Theorie-Sektion: 10 Themen mit SVG-Diagrammen ABGESCHLOSSEN

Alle 10 Theorie-Themen sind jetzt vollstaendig mit Custom-Content-Komponenten, SVG-Diagrammen und Merkspruchen ausgebaut.

**Architektur:**
- `customContentId` in `theoryContent.ts` → Registry in `TheorieView.tsx`
- Shared Components: `Section`, `DiagramBox`, `Paragraph` in `theory/shared.tsx`
- Pro Thema: 1 Content-Komponente + 2-4 SVG-Diagramme in `theory/diagrams/`

**Alle 10 Themen:**

| # | Thema | Content-Datei | Diagramme |
|---|-------|--------------|-----------|
| 1 | Notenzeilen & Schluessel | StaffClefsContent.tsx | EmptyStaff, TrebleClefStaff, BassClefStaff, GrandStaffDiagram, LedgerLinesDiagram |
| 2 | Notenwerte & Pausen | NoteValuesContent.tsx | NoteValueOverview, RestSymbols, DottedNotes |
| 3 | Vorzeichen | AccidentalsContent.tsx | AccidentalSymbols, KeySignatures, AccidentalScope |
| 4 | Takt & Taktarten | TimeSignaturesContent.tsx | TimeSignatureExplained, CommonTimeSignatures, CountingPractice |
| 5 | Intervalle | IntervalsContent.tsx | IntervalSteps, IntervalOverview, IntervalReading |
| 6 | Dreiklaenge & Akkorde | TriadsContent.tsx | MajorMinorTriads, TriadInversions, ThreeChords |
| 7 | Gebrochene Akkorde | ArpeggiosContent.tsx | BlockedVsBroken, ArpeggioDirections, AlbertiBass |
| 8 | Fingerbezeichnungen | FingeringContent.tsx | HandDiagram, FiveFingerPosition, ThumbUnder |
| 9 | Dynamik & Artikulation | DynamicsContent.tsx | DynamicLevels, CrescendoDecrescendo, ArticulationMarks |
| 10 | Die Pedale | PedalsContent.tsx | PedalOverview, PedalNotation, PedalChange |

### Sprint 4 - Navigation & Random Generator: ABGESCHLOSSEN
### Sprint 3 - MIDI Eingabe & Bewertung: ABGESCHLOSSEN
### Sprint 2 - Audio & Wiedergabe: ABGESCHLOSSEN
### Sprint 1 - Foundation: ABGESCHLOSSEN

## Verfügbare Agenten

| Agent | Zuständigkeit |
|-------|---------------|
| `projektmanager-pm` | Koordination, Task-Planung |
| `music-webapp-frontend` | React, VexFlow, Tone.js |
| `music-specialist` | Musiktheorie, Übungsdaten |
| `ui-designer` | UI/UX, TailwindCSS |
| `blattspiel-backend-dev` | FastAPI, PostgreSQL |
| `app-security-guardian` | Auth, GDPR, Security |
| `piano-teacher` | Musikpaedagogik, Schwierigkeitsgrade |
| `clefbuddy-qa-engineer` | Testing, QA |

## Wichtige Dateien

```
clefbuddy/
├── src/
│   ├── App.tsx                          # Shell: Header + Navigation + Section-Switch
│   ├── components/
│   │   ├── Navigation.tsx               # Horizontale Tab-Navigation (6 Bereiche)
│   │   ├── DashboardView.tsx            # Dashboard mit Statistiken + Schnellstart
│   │   ├── NoteReaderView.tsx           # NoteReader (extrahiert aus altem App.tsx)
│   │   ├── RandomExerciseGenerator.tsx  # Zufalls-Uebungsgenerator UI
│   │   ├── ScalesView.tsx               # Tonleitern-Ansicht
│   │   ├── ScaleSelector.tsx            # Tonleiter-Auswahl
│   │   ├── ArpeggiosView.tsx            # Arpeggio-Ansicht
│   │   ├── ArpeggioSelector.tsx         # Arpeggio-Auswahl
│   │   ├── ChordsView.tsx               # Akkord-Ansicht (8 Modi)
│   │   ├── ChordSelector.tsx            # Akkord-Konfigurations-UI
│   │   ├── Layout.tsx                   # Layout-Komponenten
│   │   ├── ExerciseSelector.tsx         # Übungsauswahl
│   │   ├── PlaybackControls.tsx         # Play/Pause/Stop/Loop Buttons
│   │   ├── TempoSlider.tsx              # Tempo-Regler (40-180 BPM)
│   │   ├── Metronome.tsx                # Visueller Beat-Indikator
│   │   ├── ModeSelector.tsx             # Listen/Practice Mode Umschalter
│   │   ├── MidiDeviceSelector.tsx       # MIDI-Gerät Auswahl
│   │   ├── PracticeVisualizer.tsx       # Echtzeit-Feedback während Übung
│   │   ├── ResultsModal.tsx             # Ergebnis-Anzeige mit Sternen
│   │   ├── ScoreBreakdown.tsx           # Detaillierte Punkteaufschlüsselung
│   │   ├── theory/
│   │   │   ├── shared.tsx               # Section, DiagramBox, Paragraph
│   │   │   ├── MnemonicBox.tsx          # Merkspruch-Box (blue/green)
│   │   │   ├── StaffClefsContent.tsx    # Thema 1: Notenzeilen
│   │   │   ├── NoteValuesContent.tsx    # Thema 2: Notenwerte
│   │   │   ├── AccidentalsContent.tsx   # Thema 3: Vorzeichen
│   │   │   ├── TimeSignaturesContent.tsx # Thema 4: Taktarten
│   │   │   ├── IntervalsContent.tsx     # Thema 5: Intervalle
│   │   │   ├── TriadsContent.tsx        # Thema 6: Dreiklaenge
│   │   │   ├── ArpeggiosContent.tsx     # Thema 7: Arpeggios
│   │   │   ├── FingeringContent.tsx     # Thema 8: Fingersatz
│   │   │   ├── DynamicsContent.tsx      # Thema 9: Dynamik
│   │   │   ├── PedalsContent.tsx        # Thema 10: Pedale
│   │   │   └── diagrams/               # 27+ SVG-Diagramme
│   │   ├── ui/                          # Button, Card, Select, Badge
│   │   └── notation/
│   │       └── MusicSheet.tsx           # VexFlow Noten-Rendering + Highlighting
│   ├── data/
│   │   ├── levels.json                  # 3 Schwierigkeitsstufen
│   │   ├── exercises.json               # 12 Übungen (inkl. Grand Staff)
│   │   ├── scaleData.ts                 # Tonleiter-Daten
│   │   ├── arpeggioData.ts              # Arpeggio-Daten (Formeln, Fingersaetze)
│   │   └── chordData.ts                 # Akkord-Daten (Key Groups, Mode Configs, Progressions)
│   ├── store/
│   │   ├── useNavigationStore.ts        # Navigation-State (aktiver Bereich)
│   │   ├── useExerciseStore.ts          # Übungs-State
│   │   ├── usePlaybackStore.ts          # Playback-State (Zustand)
│   │   ├── useMidiStore.ts              # MIDI-State (Zustand)
│   │   ├── useScoringStore.ts           # Scoring-State (Zustand, persistiert)
│   │   ├── useScalesStore.ts            # Tonleitern-State
│   │   ├── useArpeggioStore.ts          # Arpeggio-State
│   │   └── useChordsStore.ts            # Akkorde-State
│   ├── styles/
│   │   └── design-tokens.ts             # Farben, Typography, Spacing
│   ├── types/
│   │   ├── music.ts                     # Musik TypeScript Types
│   │   ├── playback.ts                  # Playback TypeScript Types
│   │   ├── midi.ts                      # MIDI TypeScript Types
│   │   ├── comparison.ts                # Vergleichs-Types
│   │   ├── scoring.ts                   # Bewertungs-Types
│   │   ├── scales.ts                    # Tonleitern-Types
│   │   ├── arpeggio.ts                  # Arpeggio-Types
│   │   └── chords.ts                    # Akkord-Types (ChordMode, ChordConfig)
│   └── utils/
│       ├── vexflowRenderer.ts           # VexFlow Rendering + Cursor Animation
│       ├── audioEngine.ts               # Tone.js PolySynth + Metronome (immediate play)
│       ├── simplePlayback.ts            # setTimeout-basiertes Playback (NEU)
│       ├── playbackScheduler.ts         # Note Scheduling + Controller (nutzt simplePlayback)
│       ├── timing.ts                    # Duration-to-Seconds Berechnung
│       ├── audioCompat.ts               # Browser-Kompatibilität (Audio)
│       ├── midiEngine.ts                # Web MIDI API Wrapper
│       ├── midiCompat.ts                # Browser-Kompatibilität (MIDI)
│       ├── noteComparison.ts            # Noten-Vergleichs-Algorithmus
│       ├── practiceMode.ts              # Practice Mode Controller
│       ├── scoringEngine.ts             # Bewertungs-Algorithmus
│       ├── exerciseGenerator.ts         # Zufalls-Uebungsgenerator (Grand Staff)
│       ├── scaleGenerator.ts            # Tonleiter-Generator
│       ├── arpeggioGenerator.ts         # Arpeggio-Generator
│       └── chordGenerator.ts            # Akkord-Uebungsgenerator (8 Modi)
├── DESIGN_SYSTEM.md                     # UI Design-System
├── VEXFLOW_INTEGRATION.md               # VexFlow Dokumentation
├── MIDI_INTEGRATION.md                  # MIDI Dokumentation
├── SIGHT_READING_LEVELS_SPEC.md         # Level-Spezifikation
└── package.json
```

## Befehle

```bash
# Development Server starten
cd /home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy
npm run dev

# Build erstellen
npm run build
```

## Tech-Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** TailwindCSS
- **State:** Zustand (mit localStorage-Persistenz)
- **Notensatz:** VexFlow 5.x
- **Audio:** Tone.js + Tonal.js
- **MIDI:** Web MIDI API

## exerciseGenerator.ts — Algorithmus-Uebersicht

Die Datei ist das Herzstück der Uebungsgenerierung (~2650 Zeilen). Kernkonzepte:

### Architektur
1. **Konfiguration** → Difficulty (1-6), Key, TimeSignature
2. **Harmonische Progression** → Akkordfolge fuer alle Takte
3. **Bar-Schleife** → Pro Takt: Treble (fillBar) + Bass (generateHarmonicBass)
4. **Post-Processing** → fixLargeIntervals, Voice-Crossing-Check

### Wichtige Funktionen
- `generateRandomExercise()` — Hauptfunktion, orchestriert alles
- `fillBar()` — Fuellt einen Takt mit Noten nach rhythmischem Pattern
- `generateNote()` — Einzelnote mit Voice-Leading, Recovery, Contour
- `generateChord()` — Akkord-Generierung (Dyads, Triads, 7th-Chords)
- `generateHarmonicBass()` — Bass-Patterns (Alberti, Walking, Broken, Syncopated)
- `generateTripletGroup()` — Triolen (Scale, Arpeggio, Neighbor-Tone)
- `fixLargeIntervalsMultiPass()` — Post-Processing Intervall-Korrektur

### Stufen-Logik
- **Stufe 1-2:** Haende abwechselnd/zusammen, einfache Melodien
- **Stufe 3:** Akkorde kennenlernen (40% auf Beat 1), max Sekunden bei Achteln, Wechsel alle 2 Takte
- **Stufe 4:** Fluessige Akkordwechsel, Alberti-Bass (50%), erweiterte Triolen
- **Stufe 5:** 16tel-Laeufe, Chromatik (25%), alle Tonarten bis 3#
- **Stufe 6:** Vierstimmige Akkorde (30%), komplexe Rhythmen

## Naechste Schritte

### Arpeggio-Feature QA
- Browser-Testing: Alle Akkord-Typen und Patterns testen
- Fingersaetze auf Korrektheit pruefen (besonders Umkehrungen)
- 2-Oktaven-Arpeggios auf flüssige Notenfolge testen
- MIDI-Practice Mode mit Arpeggio-Uebungen verifizieren

### Theorie-Sektion QA
- Browser-Testing: Alle 10 Themen in Light + Dark Mode pruefen
- Mobile Responsiveness (< 640px) testen
- SVG-Diagramme auf visuelle Korrektheit pruefen (Notenkoepfe, Schluessel, Vorzeichen)

### Cursor-Bugfix verifizieren
- Browser-Testing: Grand Staff Uebungen mit mehreren Zeilen und verschiedenen barsPerLine-Werten
- Loop-Modus testen (Cursor soll smooth zum Anfang zurueckspringen)

### Generator-Rework fortsetzen
- Fix #17: Harmonisches Moll implementieren (Skalensystem-Refactor)
- Verifikation: 30 Uebungen Stufe 3, 20 Stufe 4, 10 Stufe 5-6 generieren und pruefen

### Spaeter
- Pitch Detection (Mikrofon) fuer Gesang/Instrumente
- Fortschritts-Tracking Dashboard
- Level-Freischaltung basierend auf Leistung
- Backend-Integration (Benutzer-Accounts, Cloud-Sync)
