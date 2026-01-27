# Test-Anleitung für VexFlow Integration

## Quick Start

```bash
cd /home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy
npm run dev
```

Öffne Browser: **http://localhost:5173/**

## Was du sehen solltest

### 1. Header-Bereich
- Titel: "ClefBuddy"
- Untertitel: "Interaktiver Musiktheorie-Trainer"
- 4 Tech-Badges: VexFlow, Tone.js, Tonal, Zustand

### 2. Übungs-Informationen
- **Übungsname**: "Erste Schritte"
- **Beschreibung**: "Aufsteigende Tonleiter im Fünffingerraum"
- **Level**: 1
- **Difficulty**: beginner
- **Taktart**: 4/4
- **Tonart**: C-Dur
- **Tempo**: 60 BPM
- **Takte**: 4

### 3. Notenblatt (VexFlow Rendering)

Du solltest ein professionelles Notenblatt sehen mit:

**Takt 1:**
- Violinschlüssel (am Anfang)
- 4/4 Taktart (am Anfang)
- 4 Viertelnoten: C-D-E-F

**Takt 2:**
- 4 Viertelnoten: G-F-E-D

**Takt 3:**
- 2 halbe Noten: C-E

**Takt 4:**
- 2 halbe Noten: G-C

**Layout:**
- Alle 4 Takte auf einer Zeile
- Weiße Box mit grauem Rahmen
- Saubere SVG-Darstellung

### 4. Pädagogischer Hinweis (Blauer Kasten)
- Text: "Einführung der fünf Grundtöne mit stufenweiser Bewegung. Symmetrische Phrasenstruktur (Auf-Ab-Kadenz)."

### 5. Footer
- Text: "VexFlow Integration Test - 9 Übungen verfügbar"

## Visuelle Checks

### Notenqualität
- [ ] Notenköpfe sind klar und rund
- [ ] Notenhälse haben die richtige Länge
- [ ] Taktstriche sind sichtbar
- [ ] Violinschlüssel ist korrekt geformt
- [ ] 4/4 Taktart ist lesbar

### Layout
- [ ] Alles ist zentriert
- [ ] Keine Überlappungen
- [ ] Responsive Design funktioniert
- [ ] Padding ist konsistent

### Fehlerfreiheit
- [ ] Keine roten Fehler in der Console
- [ ] Keine Layout-Shifts beim Laden
- [ ] SVG rendert sofort

## Browser-Tests

Teste in:
- [ ] Chrome/Edge (empfohlen)
- [ ] Firefox
- [ ] Safari (Mac)

## Erweiterte Tests

### Andere Übungen testen

Ändere in `src/App.tsx` Zeile 7:
```typescript
const demoExercise = exercisesData.exercises[0] as Exercise
```

Zu:
```typescript
const demoExercise = exercisesData.exercises[6] as Exercise // Level 3, Punktierte Rhythmen
```

Du solltest dann sehen:
- **Übungsname**: "Punktierte Rhythmen"
- **Taktart**: 4/4
- Punktierte halbe Noten (3 Schläge) + Viertelnoten

### Responsive Test

1. Öffne Browser DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Teste verschiedene Größen:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

Das Notenblatt sollte sich anpassen, aber lesbar bleiben.

## Console Output

Bei erfolgreichem Start solltest du sehen:
```
  VITE v6.4.1  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

**Keine Fehler** in der Browser-Console!

## Build Test

```bash
npm run build
```

Erwartete Ausgabe:
```
✓ XX modules transformed.
✓ built in X.XXs
```

**Warning über chunk size ist normal** (VexFlow ist groß).

## Troubleshooting

### Problem: Leerer Bildschirm
- Check Browser Console für Fehler
- Stelle sicher dass `npm install` ausgeführt wurde
- Prüfe ob Port 5173 frei ist

### Problem: Noten werden nicht angezeigt
- Öffne Browser DevTools
- Check Console für VexFlow-Fehler
- Stelle sicher dass `exercises.json` existiert

### Problem: TypeScript Fehler
- Führe `npm run build` aus um Details zu sehen
- Check `tsconfig.app.json` für `resolveJsonModule: true`

## Next Steps

Nach erfolgreichem Test kannst du:
1. Task 5: Tone.js Audio-Playback hinzufügen
2. Task 4: Zustand State Management implementieren
3. Weitere Übungen aus `exercises.json` testen
