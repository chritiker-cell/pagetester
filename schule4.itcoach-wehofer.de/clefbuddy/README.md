# ClefBuddy - Interaktiver Musiktheorie-Trainer

Ein modernes React-basiertes Musiktheorie-Lern-Tool mit interaktiver Notendarstellung und Audio-Playback.

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **TailwindCSS** - Styling
- **VexFlow 5.0** - Musiknotation-Rendering
- **Tone.js** - Audio Engine & Metronome
- **Tonal** - Musiktheorie-Berechnungen
- **Zustand** - State Management

## Entwicklung

```bash
# Dependencies installieren
npm install

# Dev-Server starten (http://localhost:5173)
npm run dev

# Production Build
npm run build

# Build Preview
npm run preview

# Linting
npm run lint
```

## Projektstruktur

```
clefbuddy/
├── src/
│   ├── components/
│   │   ├── ui/          # Wiederverwendbare UI-Komponenten
│   │   └── notation/    # VexFlow-basierte Notationskomponenten
│   ├── data/            # JSON-Übungsdaten
│   ├── store/           # Zustand State Management
│   ├── types/           # TypeScript Type Definitions
│   ├── utils/           # Utility Functions
│   ├── App.tsx          # Haupt-App-Komponente
│   ├── main.tsx         # App Entry Point
│   └── index.css        # Global Styles (TailwindCSS)
├── public/              # Statische Assets
└── index.html           # HTML Template
```

## Status

- [x] Projekt-Setup (React 19 + TypeScript + Vite)
- [x] TailwindCSS Integration
- [x] Dependencies installiert (VexFlow, Tone.js, Tonal, Zustand)
- [x] Basis-Ordnerstruktur
- [x] VexFlow Integration
- [x] Zustand State Management
- [x] UI-Komponenten
- [x] Audio-Playback (Tone.js PolySynth + Metronom)
- [x] Übungsdaten (12 Übungen, 3 Levels)
- [x] MIDI-Eingabe & Bewertung
- [x] Navigation & Zufalls-Übungsgenerator
