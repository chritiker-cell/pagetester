# NeoKeys - Projektstatus

**Letzte Aktualisierung:** 2026-01-26
**Aktueller Sprint:** Sprint 1 - Foundation

---

## Gesamtfortschritt

### Sprint 1: Foundation (2-3 Wochen)
- [x] **Task 1:** Projekt-Setup (React 19 + TypeScript + Vite + TailwindCSS) - `music-webapp-frontend` ✓
- [x] **Task 2:** Musiktheorie-Basis (levels.json, exercises.json) - `music-specialist` ✓
- [x] **Task 3:** UI-Design-System & Layout - `ui-designer` ✓
- [x] **Task 4:** VexFlow-Integration für Notendarstellung - `music-webapp-frontend` ✓
- [ ] **Task 5:** Übungsauswahl-Interface - `music-webapp-frontend` - **NÄCHSTER SCHRITT**
- [ ] **Task 6:** Metronom (optional) - `music-webapp-frontend`

### Sprint 2: Backend + Notengenerierung (3-4 Wochen)
- [ ] FastAPI-Backend auf Railway deployen
- [ ] Music21 Notengenerator-Algorithmus
- [ ] API-Endpoints für Übungsgenerierung
- [ ] Supabase-Setup (DB + Auth)
- [ ] Level-System (5 Schwierigkeitsstufen)

### Sprint 3: MIDI + Audio (3-4 Wochen)
- [ ] Web MIDI API Integration
- [ ] Echtzeit-Notenvergleich mit Farbcodierung
- [ ] Metronom mit Count-In
- [ ] Virtuelles Keyboard-Overlay

### Sprint 4: MVP-Polish (2-3 Wochen)
- [ ] Konfiguration: Tonart, Taktart, Ambitus
- [ ] Supabase Auth Integration
- [ ] Basis Progress-Tracking
- [ ] Performance-Optimierung
- [ ] Testing & Bug-Fixes

---

## Nächster Schritt

**Task 5: Übungsauswahl-Interface** - `music-webapp-frontend`

- Level-Dropdown (3 Levels)
- Übungsliste pro Level
- State Management mit Zustand
- Wechsel zwischen Übungen

**Projekt starten:**
```bash
cd /home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/neokeys
npm run dev
```

## Erstellte Dateien

| Datei | Beschreibung |
|-------|--------------|
| `neokeys/` | Vite-Projekt (React 19 + TS) |
| `neokeys/src/data/levels.json` | 3 Schwierigkeitsstufen |
| `neokeys/src/data/exercises.json` | 9 Übungen (3 pro Level) |
| `MUSIC_THEORY_SPEC.md` | Musiktheorie-Dokumentation |
| `TASK_ASSIGNMENT.md` | Aufgabenverteilung |

---

## Tech-Stack (Entschieden)

| Bereich | Technologie |
|---------|-------------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | TailwindCSS |
| State | Zustand |
| Notensatz | VexFlow |
| Audio | Tone.js + Tonal.js |
| MIDI | Web MIDI API |
| Backend | FastAPI + Music21 |
| Datenbank | Supabase (PostgreSQL) |
| Auth | Supabase Auth |

---

## Deployment-Ziel

- **Frontend:** Vercel (kostenlos)
- **Backend:** Railway (~$5/Monat)
- **DB/Auth:** Supabase (kostenlos bis 500MB)

---

## Wichtige Dateien

- `Projekt-Spezifikation.md` - Detaillierte Anforderungen
- `Plan/` - Planungsdokumente
