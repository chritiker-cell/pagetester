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
neokeys/
├── src/
│   ├── components/
│   │   ├── ui/          # Wiederverwendbare UI-Komponenten
│   │   └── notation/    # VexFlow-basierte Notationskomponenten
│   ├── data/            # JSON-Übungsdaten
│   ├── stores/          # Zustand State Management
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
- [ ] VexFlow Integration
- [ ] Zustand State Management
- [ ] UI-Komponenten
- [ ] Audio-Playback
- [ ] Übungsdaten

## Nächste Schritte

1. VexFlow Notations-Rendering implementieren
2. Zustand Stores für Übungsparameter erstellen
3. UI-Komponenten für Controls entwickeln
4. Tone.js Integration für Audio-Playback
5. Übungsgenerierungs-Logik
