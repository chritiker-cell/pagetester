# CLAUDE.md - ClefBuddy Projekt

## Projektübersicht

**ClefBuddy** ist eine interaktive Web-App zum Erlernen von Notenlesen.
**Projektpfad:** `/home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy/`

## Aktueller Status (Stand: 2026-01-27)

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
│   ├── App.tsx                          # Haupt-App mit Playback-Integration
│   ├── components/
│   │   ├── Layout.tsx                   # Layout-Komponenten
│   │   ├── ExerciseSelector.tsx         # Übungsauswahl
│   │   ├── PlaybackControls.tsx         # Play/Pause/Stop/Loop Buttons
│   │   ├── TempoSlider.tsx              # Tempo-Regler (40-180 BPM)
│   │   ├── Metronome.tsx                # Visueller Beat-Indikator
│   │   ├── ui/                          # Button, Card, Select, Badge
│   │   └── notation/
│   │       └── MusicSheet.tsx           # VexFlow Noten-Rendering + Highlighting
│   ├── data/
│   │   ├── levels.json                  # 3 Schwierigkeitsstufen
│   │   └── exercises.json               # 12 Übungen (inkl. Grand Staff)
│   ├── store/
│   │   ├── useExerciseStore.ts          # Übungs-State
│   │   └── usePlaybackStore.ts          # Playback-State (Zustand)
│   ├── styles/
│   │   └── design-tokens.ts             # Farben, Typography, Spacing
│   ├── types/
│   │   ├── music.ts                     # Musik TypeScript Types
│   │   └── playback.ts                  # Playback TypeScript Types
│   └── utils/
│       ├── vexflowRenderer.ts           # VexFlow Rendering + Highlighting
│       ├── audioEngine.ts               # Tone.js PolySynth + Metronome
│       ├── playbackScheduler.ts         # Note Scheduling + Controller
│       ├── timing.ts                    # Duration-to-Seconds Berechnung
│       └── audioCompat.ts               # Browser-Kompatibilität
├── VEXFLOW_INTEGRATION.md               # VexFlow Dokumentation
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
- **State:** Zustand
- **Notensatz:** VexFlow 5.x
- **Audio:** Tone.js + Tonal.js

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

## Weitere Dokumentation

- `DESIGN_SYSTEM.md` - UI Design-System
- `VEXFLOW_INTEGRATION.md` - VexFlow Dokumentation

## Nächste Schritte (Sprint 3)

- MIDI-Keyboard Eingabe
- Pitch Detection (Mikrofon)
- Bewertungs-System
- Fortschritts-Tracking
