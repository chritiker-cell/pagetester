# CLAUDE.md - ClefBuddy Projekt

## Projektübersicht

**ClefBuddy** ist eine interaktive Web-App zum Erlernen von Notenlesen.
**Projektpfad:** `/home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy/`

## Aktueller Status (Stand: 2026-01-31)

### Generator-Rework Stufe 3-5: IN ARBEIT

Grosse Ueberarbeitung des `exerciseGenerator.ts` fuer musikpaedagogisch korrekte Uebungen.

**Ziel:** 50 Iterationen zur Verbesserung der Musikalitaet (siehe Plan: `enumerated-prancing-hellman.md`)

#### Implementierte Verbesserungen

| Fix | Beschreibung | Status |
|-----|-------------|--------|
| Intervall-Kontrolle | `fixLargeIntervals()` + `fixLargeIntervalsMultiPass()` mit Octave-Clamping | ✓ fertig |
| Cross-Bar Fixing | `fixCrossBarNote()`, `propagateShift()`, `findLastNonRest()` | ✓ fertig |
| Akkord-Frequenz Stufe 3 | 92% Chance auf Akkord bei non-beat-1 (Ziel ~51% gesamt) | ✓ fertig |
| Akkord-Frequenz Stufe 4 | 50% Chance auf Akkord bei non-beat-1 (Ziel ~33% gesamt) | ✓ fertig |
| Stufe 3 Oktav-Begrenzung | Treble max Oktave 4, Clamping in fixLargeIntervals | ✓ fertig |
| Einfache Progressionen Stufe 3 | `CHORD_PROGRESSIONS_3_SHORT/LONG` (meist Tonika) | ✓ fertig |
| Pattern-Validierung Stufe 3 | Beat 1 muss Akkord-taugliche Dauer haben (h/hd/q/w) | ✓ fertig |
| Rhythmische Patterns Stufe 3 | Vereinfacht, max 2 Achtel hintereinander | ✓ fertig |
| Gewichtete Bass-Patterns | Alberti dominant bei Stufe 4 (40%) | ✓ fertig |
| Aggressive Sprung-Reduktion | Stufe 3: 95% stufenweise, Intervall-Weights angepasst | ✓ fertig |
| Akkord-Wechsel Stufe 3 | Maximal alle 2 Takte (`Math.floor(i/2)`) | ✓ fertig |
| maxSemitones angepasst | Stufe 3:7, 4:12, 5:14, 6:16 | ✓ fertig |

#### Aktuelle Metriken (200 Uebungen je Stufe)

| Metrik | Stufe 3 | Stufe 4 | Stufe 5 |
|--------|---------|---------|---------|
| Akkorde | 51.1% | 33.0% | 2.3% |
| Triolen | 5.4% | 7.6% | 0% |
| Spruenge >7 Halbtoene | 8.4% | 16.5% | 18.2% |
| Spruenge >12 Halbtoene | ~0% | ~0% | 5% |
| Max Sprung | 14st | 15st | 31st |

#### Offene Fixes aus STUFE_3_4_CODE_FIXES.md

| Fix# | Beschreibung | Prioritaet |
|------|-------------|------------|
| #2 | 60:40 Ratio geblockt:gebrochen enforced | Critical |
| #4 | Globale Triolen-Verteilung (nicht pro-Takt-Zufall) | Critical |
| #6 | Achtel-Intervalle Stufe 3 strikt Sekunden | High |
| #7 | Bass-Pattern Variationen Stufe 3 | High |
| #9 | Fortgeschrittene Triolen-Patterns Stufe 4 | High |
| #14 | Gebrochene Oktaven Stufe 4 Bass | Medium |
| #15-20 | Diverse Feinschliff-Fixes | Medium |

#### Analyse-Dokumente (von Agenten erstellt)

- `STUFE_3_4_REWORK_PLAN.md` — PM-Plan mit 5 Phasen
- `STUFE_3_4_MUSIC_SPEC.md` — Musikpaedagogische Spezifikation (Akkord-Typen, Patterns, Bass)
- `STUFE_3_4_CODE_FIXES.md` — 20 priorisierte Code-Fixes mit Zeilennummern
- `GENERATOR_ANALYSIS.md` — Fruehe Analyse
- `GENERATOR_IMPROVEMENTS.md` — Aeltere Verbesserungen

#### Naechste Schritte

1. Offene Fixes #2, #4, #6, #7, #9 implementieren
2. 50-Iterationen-Analyse: je Stufe 20-30 Uebungen generieren und einzeln pruefen
3. Browser-Testing der aktuellen Version
4. Stufe 5-6 Feinschliff (16tel-Laeufe, Chromatik, Dreiklang-Umkehrungen)

### Sprint 4 - Navigation & Random Generator: ABGESCHLOSSEN

| Task | Status |
|------|--------|
| 1. useNavigationStore.ts | ✓ fertig |
| 2. Navigation.tsx (5 Tabs) | ✓ fertig |
| 3. NoteReaderView.tsx | ✓ fertig |
| 4. App.tsx umgebaut | ✓ fertig |
| 5. ComingSoonView.tsx | ✓ fertig |
| 6. exerciseGenerator.ts | ✓ fertig |
| 7. RandomExerciseGenerator.tsx | ✓ fertig |
| 8. DashboardView.tsx | ✓ fertig |
| 9. Build erfolgreich | ✓ fertig |
| 10. Manuelles Testen | ✓ fertig |
| 11. Feinschliff / Bugfixes | ✓ fertig |

### Sprint 3 - MIDI Eingabe & Bewertung: ABGESCHLOSSEN

| Phase | Tasks | Status |
|-------|-------|--------|
| 1. MIDI Foundation | Web MIDI API, MIDI Store, Device Selector | ✓ fertig |
| 2. Recording & Comparison | Note Comparison Engine, Practice Mode, Visual Feedback | ✓ fertig |
| 3. Bewertungs-System | Scoring Algorithm, Results UI, Scoring Store | ✓ fertig |
| 4. Integration | App Integration, Error Handling, Documentation | ✓ fertig |

### Sprint 2 - Audio & Wiedergabe: ABGESCHLOSSEN

| Phase | Tasks | Status |
|-------|-------|--------|
| 1. Foundation | TypeScript Types, Playback Store, Audio Engine | ✓ fertig |
| 2. Timing & Scheduling | Timing-Berechnung, Playback Scheduler | ✓ fertig |
| 3. Metronome | Audio + Visual | ✓ fertig |
| 4. UI Controls | PlaybackControls, TempoSlider | ✓ fertig |
| 5. Note Highlighting | VexFlow SVG Highlighting | ✓ fertig |
| 6. Integration | App Integration, Error Handling | ✓ fertig |

### Sprint 1 - Foundation: ABGESCHLOSSEN

| Task | Agent | Status |
|------|-------|--------|
| 1. Projekt-Setup | `music-webapp-frontend` | ✓ fertig |
| 2. Musiktheorie-Basis | `music-specialist` | ✓ fertig |
| 3. UI-Design-System | `ui-designer` | ✓ fertig |
| 4. VexFlow-Integration | `music-webapp-frontend` | ✓ fertig |
| 5. Übungsauswahl-UI | `music-webapp-frontend` | ✓ fertig |
| 6. Grand Staff (Klaviersystem) | `music-webapp-frontend` | ✓ fertig |

## Verfügbare Agenten

| Agent | Zuständigkeit |
|-------|---------------|
| `projektmanager-pm` | Koordination, Task-Planung |
| `music-webapp-frontend` | React, VexFlow, Tone.js |
| `music-specialist` | Musiktheorie, Übungsdaten |
| `ui-designer` | UI/UX, TailwindCSS |
| `blattspiel-backend-dev` | FastAPI, PostgreSQL |
| `app-security-guardian` | Auth, GDPR, Security |

## Wichtige Dateien

```
clefbuddy/
├── src/
│   ├── App.tsx                          # Shell: Header + Navigation + Section-Switch
│   ├── components/
│   │   ├── Navigation.tsx               # Horizontale Tab-Navigation (5 Bereiche)
│   │   ├── DashboardView.tsx            # Dashboard mit Statistiken + Schnellstart
│   │   ├── NoteReaderView.tsx           # NoteReader (extrahiert aus altem App.tsx)
│   │   ├── ComingSoonView.tsx           # Platzhalter fuer Scales/Arpeggio/Chords
│   │   ├── RandomExerciseGenerator.tsx  # Zufalls-Uebungsgenerator UI
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
│   │   ├── ui/                          # Button, Card, Select, Badge
│   │   └── notation/
│   │       └── MusicSheet.tsx           # VexFlow Noten-Rendering + Highlighting
│   ├── data/
│   │   ├── levels.json                  # 3 Schwierigkeitsstufen
│   │   └── exercises.json               # 12 Übungen (inkl. Grand Staff)
│   ├── store/
│   │   ├── useNavigationStore.ts        # Navigation-State (aktiver Bereich)
│   │   ├── useExerciseStore.ts          # Übungs-State
│   │   ├── usePlaybackStore.ts          # Playback-State (Zustand)
│   │   ├── useMidiStore.ts              # MIDI-State (Zustand)
│   │   └── useScoringStore.ts           # Scoring-State (Zustand, persistiert)
│   ├── styles/
│   │   └── design-tokens.ts             # Farben, Typography, Spacing
│   ├── types/
│   │   ├── music.ts                     # Musik TypeScript Types
│   │   ├── playback.ts                  # Playback TypeScript Types
│   │   ├── midi.ts                      # MIDI TypeScript Types
│   │   ├── comparison.ts                # Vergleichs-Types
│   │   └── scoring.ts                   # Bewertungs-Types
│   └── utils/
│       ├── vexflowRenderer.ts           # VexFlow Rendering + Practice Feedback
│       ├── audioEngine.ts               # Tone.js PolySynth + Metronome
│       ├── playbackScheduler.ts         # Note Scheduling + Controller
│       ├── timing.ts                    # Duration-to-Seconds Berechnung
│       ├── audioCompat.ts               # Browser-Kompatibilität (Audio)
│       ├── midiEngine.ts                # Web MIDI API Wrapper
│       ├── midiCompat.ts                # Browser-Kompatibilität (MIDI)
│       ├── noteComparison.ts            # Noten-Vergleichs-Algorithmus
│       ├── practiceMode.ts              # Practice Mode Controller
│       ├── scoringEngine.ts             # Bewertungs-Algorithmus
│       └── exerciseGenerator.ts         # Zufalls-Uebungsgenerator (Grand Staff)
├── VEXFLOW_INTEGRATION.md               # VexFlow Dokumentation
├── MIDI_INTEGRATION.md                  # MIDI Dokumentation
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

## Features

### Notendarstellung
- Violin- und Bassschlüssel (einzeln und als Klaviersystem/Grand Staff)
- 12 progressive Übungen über 3 Schwierigkeitsstufen
- Übungsauswahl mit Level-Filter
- Responsive Notendarstellung

### Audio-Wiedergabe (Sprint 2)
- Play/Pause/Stop Transport-Steuerung
- Loop-Modus für wiederholtes Üben
- Tempo-Slider (40-180 BPM)
- Klavier-Sound via Tone.js PolySynth
- Optionales Metronom (Audio + Visual)
- Noten-Highlighting während Wiedergabe
- Keyboard Shortcuts: Space (Play/Pause), Esc (Stop), L (Loop), M (Metronom)
- Browser-Kompatibilitätsprüfung

### MIDI-Eingabe & Bewertung (Sprint 3)
- Web MIDI API Integration (Chrome, Edge, Opera)
- MIDI-Gerät Auswahl und Verbindung
- Listen-Modus (Anhören) / Practice-Modus (Üben)
- Countdown vor Übungsstart
- Echtzeit-Feedback während des Spielens
  - Noten-Highlighting (grün/rot/orange)
  - Laufende Genauigkeitsanzeige
- Bewertungs-System:
  - Pitch-Genauigkeit (50%)
  - Timing-Genauigkeit (30%)
  - Rhythmus-Genauigkeit (20%)
- 5-Sterne-Rating:
  - 5★ ≥95%, 4★ ≥85%, 3★ ≥70%, 2★ ≥50%, 1★ <50%
- Ergebnis-Modal mit:
  - Stern-Animation
  - Score-Aufschlüsselung
  - Statistiken (richtig/falsch/verpasst)
  - Verbesserungs-Indikator
- Persönliche Bestleistungen (localStorage)

## Weitere Dokumentation

- `DESIGN_SYSTEM.md` - UI Design-System
- `VEXFLOW_INTEGRATION.md` - VexFlow Dokumentation
- `MIDI_INTEGRATION.md` - MIDI Dokumentation
- `STUFE_3_4_REWORK_PLAN.md` - PM-Plan Generator-Rework
- `STUFE_3_4_MUSIC_SPEC.md` - Musikpaedagogische Spezifikation
- `STUFE_3_4_CODE_FIXES.md` - 20 Code-Fixes mit Prioritaeten
- `GENERATOR_ANALYSIS.md` - Generator-Analyse (Phase 1)
- `GENERATOR_IMPROVEMENTS.md` - Generator-Verbesserungen Log
- `SIGHT_READING_LEVELS_SPEC.md` - Level-Spezifikation

## Naechste Schritte

### Generator-Rework fortsetzen
- Offene Fixes #2, #4, #6, #7, #9 aus `STUFE_3_4_CODE_FIXES.md`
- 50 Iterationen: Einzelanalyse generierter Uebungen
- Stufe 5-6 Feinschliff

### Spaeter
- Pitch Detection (Mikrofon) fuer Gesang/Instrumente
- Fortschritts-Tracking Dashboard
- Level-Freischaltung basierend auf Leistung
- Backend-Integration (Benutzer-Accounts, Cloud-Sync)
