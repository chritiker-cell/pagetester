# NeoKeys MVP - Task Assignment
**Erstellt:** 2026-01-26
**Projektmanager:** PM Agent
**Projektziel:** Minimales MVP für Note-Reading-Training (8-12 Takte, nur visuell)

---

## Projektübersicht

**Aktueller Status:** Projekt ist leer, noch kein Code vorhanden
**MVP-Scope:** SEHR BASIC - Fokus auf reines Frontend ohne Backend
**Ziel:** Anfänger können statische Notenblätter sehen und sich mit der Darstellung vertraut machen

**Warum kein Backend im ersten Schritt?**
- VexFlow kann direkt im Browser Noten rendern
- Statische Übungsdaten können als JSON vorliegen
- Schneller zum funktionierenden Prototyp
- Backend erst bei dynamischer Generierung nötig

---

## Aufgaben-Übersicht

### Phase 1: Foundation (Parallel ausführbar)
1. Projekt-Setup
2. Musiktheorie-Grundlagen definieren
3. UI-Design-System

### Phase 2: Implementation (Sequenziell)
4. VexFlow-Integration
5. Übungsauswahl-UI
6. Metronom (optional für MVP)

---

## Detaillierte Task-Zuweisung

### Task 1: Projekt-Setup & Grundstruktur
**Zugewiesen an:** music-webapp-frontend
**Abhängig von:** keine
**Komplexität:** S
**Priorität:** KRITISCH (Blocker für alles andere)

**Beschreibung:**
Erstelle ein minimales React + TypeScript Projekt mit Vite im Ordner `/home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/neokeys/`

**Deliverables:**
```
neokeys/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── components/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

**Technische Requirements:**
- React 19 + TypeScript + Vite
- TailwindCSS für Styling
- VexFlow als Dependency installiert
- Tone.js für späteren Audio-Support
- Zustand für State Management (optional, später)

**Akzeptanzkriterien:**
- `npm run dev` startet Development-Server
- Basis-App zeigt "Hello NeoKeys" Placeholder
- Keine Errors in Console
- TailwindCSS funktioniert (Test mit einer colored Box)

---

### Task 2: Musiktheorie-Basis definieren
**Zugewiesen an:** music-specialist
**Abhängig von:** keine (kann parallel zu Task 1)
**Komplexität:** M
**Priorität:** HOCH

**Beschreibung:**
Definiere die musikalischen Parameter für 3-5 Schwierigkeitslevel für das Basic MVP. Erstelle statische JSON-Daten für erste Übungen.

**Deliverables:**
1. Datei: `neokeys/src/data/levels.json`
   ```json
   {
     "level1": {
       "name": "Anfänger - C-Dur Fünffingerraum",
       "clef": "treble",
       "key": "C",
       "timeSignature": "4/4",
       "noteRange": ["C4", "G4"],
       "rhythms": ["q", "h"],
       "bars": 8
     }
   }
   ```

2. Datei: `neokeys/src/data/exercises.json`
   - 2-3 vorgefertigte Übungen pro Level
   - Struktur: Array von Noten mit Tonhöhe + Dauer

3. Dokumentation: `MUSIC_THEORY_SPEC.md`
   - Erklärung der Level-Parameter
   - VexFlow-Notation-Format
   - Regeln für spätere algorithmische Generierung

**Akzeptanzkriterien:**
- JSON-Daten sind syntaktisch korrekt
- Mindestens 2 Levels definiert (Anfänger, Leicht-Fortgeschritten)
- Noten sind musikalisch sinnvoll (keine unspielbaren Sprünge)
- Format ist kompatibel mit VexFlow-Syntax

---

### Task 3: UI-Design-System & Layout
**Zugewiesen an:** ui-designer
**Abhängig von:** Task 1 (braucht Basis-Projekt)
**Komplexität:** M
**Priorität:** MITTEL

**Beschreibung:**
Erstelle ein minimalistisches Design-System mit TailwindCSS und baue das Basis-Layout der App.

**Deliverables:**
1. `src/styles/design-tokens.ts`
   - Farbpalette (Light + Dark Mode)
   - Typography-Scale
   - Spacing-System

2. `src/components/Layout.tsx`
   - Header mit Logo/Titel
   - Main Content Area (für VexFlow-Canvas)
   - Sidebar für Level-Auswahl (optional ausblendbar)

3. `src/components/ui/Button.tsx`
   - Primärer Action-Button (z.B. "Neue Übung")
   - Sekundärer Button (z.B. "Zurück")

4. Dokumentation: `DESIGN_SYSTEM.md`
   - Screenshot/Mockup des Layouts
   - Component-Hierarchie

**Design-Prinzipien:**
- Viel Weißraum, um Noten hervorzuheben
- Große Touch-Targets (min. 44x44px)
- Dark Mode optional (später)
- Responsive: Mobile-First, aber Desktop-optimiert

**Akzeptanzkriterien:**
- Layout rendert korrekt in Chrome/Firefox
- Components sind wiederverwendbar
- TailwindCSS-Klassen sind konsistent
- Kein CSS-in-JS, nur TailwindCSS

---

### Task 4: VexFlow-Integration & Noten-Rendering
**Zugewiesen an:** music-webapp-frontend
**Abhängig von:** Task 1 + Task 2
**Komplexität:** L
**Priorität:** KRITISCH

**Beschreibung:**
Implementiere eine React-Komponente, die VexFlow nutzt, um Notenblätter aus JSON-Daten zu rendern.

**Deliverables:**
1. `src/components/MusicSheet.tsx`
   - Props: `exerciseData` (JSON-Objekt aus Task 2)
   - Rendert SVG mit VexFlow
   - Responsive Canvas-Größe

2. `src/utils/vexflowRenderer.ts`
   - Utility-Funktion zum Konvertieren von JSON zu VexFlow-API-Calls
   - Fehlerbehandlung für ungültige Noten

3. `src/App.tsx` Update
   - Integriere MusicSheet-Component
   - Lade Übungsdaten aus `exercises.json`
   - Button zum Wechseln zwischen Übungen

**Technische Details:**
- VexFlow-Rendering in `useEffect` Hook
- Canvas-Cleanup bei Component Unmount
- Skalierung auf Mobile (min. 2 Bars pro Zeile)

**Akzeptanzkriterien:**
- Mindestens 1 vollständige 8-Bar-Übung wird korrekt angezeigt
- Noten sind scharf und lesbar (SVG, kein Canvas-Blur)
- Wechsel zwischen Übungen funktioniert ohne Fehler
- Responsive: funktioniert auf 1920px Desktop und 768px Tablet

---

### Task 5: Übungsauswahl-Interface
**Zugewiesen an:** music-webapp-frontend
**Abhängig von:** Task 3 + Task 4
**Komplexität:** S
**Priorität:** MITTEL

**Beschreibung:**
Baue eine einfache UI, um zwischen Levels und Übungen zu wechseln.

**Deliverables:**
1. `src/components/ExerciseSelector.tsx`
   - Dropdown oder Button-Group für Level-Auswahl
   - Liste der verfügbaren Übungen im gewählten Level
   - "Neue Übung generieren" Button (zeigt vorerst zufällige Übung aus JSON)

2. State Management (Zustand oder Context)
   - Aktuelles Level
   - Aktuelle Übung
   - Exercise History (optional)

**Akzeptanzkriterien:**
- User kann zwischen Levels wechseln
- User kann spezifische Übungen aus der Liste wählen
- State-Änderungen triggern Re-Render der MusicSheet-Component
- UI ist intuitiv (keine Anleitung nötig)

---

### Task 6: Metronom-Komponente (OPTIONAL für MVP)
**Zugewiesen an:** music-webapp-frontend
**Abhängig von:** Task 4
**Komplexität:** M
**Priorität:** NIEDRIG (Nice-to-have)

**Beschreibung:**
Falls Zeit bleibt: Einfacher visueller + Audio-Metronom mit Tone.js.

**Deliverables:**
1. `src/components/Metronome.tsx`
   - BPM-Einstellung (Slider von 60-180 BPM)
   - Start/Stop Button
   - Visueller Beat-Indicator (pulsierender Kreis)
   - Audio-Click mit Tone.js

**Akzeptanzkriterien:**
- Metronom läuft stabil ohne Timing-Drift
- Audio-Latenz unter 50ms
- Kann während Notenansicht pausiert/gestartet werden

**Hinweis:** Dieses Feature kann auch in Phase 2 verschoben werden, falls die Core-Features länger dauern.

---

## Empfohlene Reihenfolge

### Woche 1
**Tag 1-2:** Task 1 (Projekt-Setup) + Task 2 (Musiktheorie) parallel
**Tag 3-4:** Task 3 (UI-Design)
**Tag 5-7:** Task 4 (VexFlow-Integration)

### Woche 2
**Tag 8-9:** Task 5 (Übungsauswahl)
**Tag 10:** Testing & Bug-Fixes
**Tag 11 (optional):** Task 6 (Metronom)

**Deadline für funktionierendes MVP:** 2 Wochen

---

## Risiken & Hinweise

### Kritische Risiken
1. **VexFlow-Lernkurve:** VexFlow-API ist komplex
   **Mitigation:** Starte mit einfachsten Beispielen aus der VexFlow-Dokumentation

2. **Responsive Rendering:** VexFlow-Canvas-Größe kann tricky sein
   **Mitigation:** Fixe Breakpoints definieren, später optimieren

3. **Browser-Kompatibilität:** Web MIDI/Audio kann Probleme machen
   **Mitigation:** Für MVP nur Chrome/Edge testen (>90% Nutzer)

### Technische Schulden (akzeptabel für MVP)
- Keine echte Notengenerierung (nur statische JSON-Daten)
- Kein User-Authentication
- Kein Progress-Tracking
- Kein Backend
- Keine Audio-Erkennung/MIDI-Input

**Diese Features kommen in Phase 2**, sobald das visuelle MVP validiert ist.

---

## Definition of Done für MVP

**Das MVP ist fertig, wenn:**
- [ ] User kann die App im Browser öffnen (localhost)
- [ ] Mindestens 2 unterschiedliche Übungen werden korrekt angezeigt
- [ ] User kann zwischen Übungen wechseln
- [ ] Noten sind lesbar und musikalisch korrekt
- [ ] Keine kritischen Bugs in Chrome
- [ ] Code ist auf GitHub gepusht
- [ ] Kann lokal deployed werden (npm run build funktioniert)

**Out of Scope für dieses MVP:**
- Backend-Integration
- User-Accounts
- Payment/Subscription
- MIDI-Input
- Audio-Recording
- Mobile App (nur Web)

---

## Nächster Schritt

**Sofort starten mit:** Task 1 - Projekt-Setup

**Agent `music-webapp-frontend` soll ausführen:**
```bash
cd /home/chris/WebseiteFTP/schule4.itcoach-wehofer.de
npm create vite@latest neokeys -- --template react-ts
cd neokeys
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install vexflow tone tonal zustand
npm run dev
```

**Dann:** Task 2 parallel von `music-specialist` bearbeiten lassen.

---

## Kommunikation zwischen Agenten

**Schnittstellen-Definitionen:**

1. **music-specialist → music-webapp-frontend**
   - Format: `exercises.json` mit festgelegter Struktur
   - Übergabe: Als statische Datei im `src/data/` Ordner

2. **ui-designer → music-webapp-frontend**
   - Format: TailwindCSS-Komponenten als `.tsx` Dateien
   - Übergabe: Direkt in `src/components/ui/`

3. **music-webapp-frontend → Alle**
   - Status-Updates: Über Git-Commits mit klaren Messages
   - Fragen: Über Task-Kommentare im Projektmanagement-Tool

---

**Ende des Task-Plans**

Bei Fragen oder Änderungswünschen kontaktiere den Projektmanager (PM Agent).
