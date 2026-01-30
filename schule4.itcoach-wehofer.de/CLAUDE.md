# CLAUDE.md - ClefBuddy Projekt

## Projektübersicht

**ClefBuddy** ist eine interaktive Web-App zum Erlernen von Notenlesen.
**Projektpfad:** `/home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy/`

## Aktueller Status (Stand: 2026-01-28)

### Sprint 4 - Navigation & Random Generator: IN ARBEIT

| Task | Status |
|------|--------|
| 1. useNavigationStore.ts | ✓ fertig |
| 2. Navigation.tsx (5 Tabs: Dashboard, NoteReader, Scales, Arpeggio, Chords) | ✓ fertig |
| 3. NoteReaderView.tsx (extrahiert aus App.tsx) | ✓ fertig |
| 4. App.tsx umgebaut (Navigation + Section-Switch) | ✓ fertig |
| 5. ComingSoonView.tsx (Platzhalter) | ✓ fertig |
| 6. exerciseGenerator.ts (Zufalls-Noten-Algorithmus, Grand Staff) | ✓ fertig |
| 7. RandomExerciseGenerator.tsx (UI: Schwierigkeit/Taktart/Tonart-Stufe) | ✓ fertig |
| 8. DashboardView.tsx (Statistiken, Schnellstart, letzte Uebungen) | ✓ fertig |
| 9. Build erfolgreich (npm run build) | ✓ fertig |
| 10. Manuelles Testen im Browser | ✓ fertig |
| 11. Feinschliff / Bugfixes nach Test | ✓ fertig |

**Hinweis:** Alle Dateien erstellt und Build laeuft durch. Naechster Schritt: manuelles Testen im Browser (npm run dev), dann ggf. Bugfixes.

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

## Nächste Schritte (Sprint 4)

- Pitch Detection (Mikrofon) für Gesang/Instrumente
- Fortschritts-Tracking Dashboard
- Level-Freischaltung basierend auf Leistung
- Backend-Integration (Benutzer-Accounts, Cloud-Sync)
