# Design System Integration Guide

So integrierst du das neue ClefBuddy Design System in die bestehende App.

## Aktueller Status

Das Design System ist vollständig implementiert und getestet:
- Design Tokens definiert
- UI-Komponenten erstellt (Button, Card, Select)
- Layout-Komponenten fertig
- TailwindCSS konfiguriert
- Build erfolgreich getestet

## Schnellstart

### 1. Design System Demo anzeigen

Um alle Komponenten zu sehen, ersetze temporär den Import in `src/main.tsx`:

```tsx
// main.tsx
import DesignSystemDemo from './components/DesignSystemDemo'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesignSystemDemo />
  </StrictMode>,
)
```

### 2. Layout in bestehende App integrieren

Ersetze das äußere `<div>` in `src/App.tsx` mit dem neuen Layout:

```tsx
import Layout, { LayoutSection, NotationArea } from './components/Layout';

function App() {
  return (
    <Layout>
      <LayoutSection maxWidth="notation" padding="lg">
        {/* Bestehender Content hier */}

        <NotationArea>
          <MusicSheet
            exercise={demoExercise}
            width={900}
            barsPerLine={4}
          />
        </NotationArea>

      </LayoutSection>
    </Layout>
  );
}
```

### 3. UI-Komponenten verwenden

Ersetze HTML-Elemente mit Design System Komponenten:

```tsx
import { Button, Card, CardHeader, CardTitle, Select } from './components/ui';

// Alt:
<button className="bg-blue-500 ...">Starten</button>

// Neu:
<Button variant="primary" size="lg">Starten</Button>
```

### 4. Farben anpassen

Ersetze Tailwind-Farben mit dem neuen Farbschema:

```tsx
// Alt:
className="bg-slate-900 text-slate-600"

// Neu:
className="bg-neutral-900 text-neutral-600"
```

## Beispiel: Vollständige Integration

Hier ist ein Beispiel, wie die aktuelle App aussehen könnte:

```tsx
import { useState } from 'react';
import Layout, { LayoutSection, NotationArea, TwoColumnLayout } from './components/Layout';
import { Button, Card, CardHeader, CardTitle, CardContent, Select } from './components/ui';
import { MusicSheet } from './components/notation/MusicSheet';
import exercisesData from './data/exercises.json';
import type { Exercise } from './types/music';

function App() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const demoExercise = exercisesData.exercises[currentExerciseIndex] as Exercise;

  const exerciseOptions = exercisesData.exercises.map((ex, idx) => ({
    value: idx.toString(),
    label: ex.name,
  }));

  return (
    <Layout>
      <LayoutSection maxWidth="notation" padding="lg">
        <TwoColumnLayout
          main={
            <div className="space-y-6">
              {/* Header Card */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>{demoExercise.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6 text-sm text-neutral-600">
                    <div>
                      <span className="font-semibold">Taktart:</span> {demoExercise.timeSignature}
                    </div>
                    <div>
                      <span className="font-semibold">Tonart:</span> {demoExercise.keySignature}-Dur
                    </div>
                    <div>
                      <span className="font-semibold">Tempo:</span> {demoExercise.tempo} BPM
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notation */}
              <NotationArea>
                <MusicSheet
                  exercise={demoExercise}
                  width={900}
                  barsPerLine={4}
                />
              </NotationArea>

              {/* Pedagogical Notes */}
              {demoExercise.pedagogicalNotes && (
                <Card variant="flat">
                  <CardContent>
                    <div className="text-sm font-semibold text-primary-700 mb-1">
                      Pädagogischer Hinweis
                    </div>
                    <p className="text-sm text-neutral-700">
                      {demoExercise.pedagogicalNotes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          }
          sidebar={
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Übung wählen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    label="Übung"
                    options={exerciseOptions}
                    value={currentExerciseIndex.toString()}
                    onChange={(val) => setCurrentExerciseIndex(parseInt(val))}
                    fullWidth
                  />
                  <Button variant="primary" size="lg" fullWidth>
                    Übung starten
                  </Button>
                  <Button variant="outline" fullWidth>
                    Einstellungen
                  </Button>
                </CardContent>
              </Card>
            </div>
          }
        />
      </LayoutSection>
    </Layout>
  );
}

export default App;
```

## Komponenten-Referenz

### Button

```tsx
<Button variant="primary" size="lg" fullWidth>
  Text
</Button>
```

Props:
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `disabled`: boolean

### Card

```tsx
<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Titel</CardTitle>
  </CardHeader>
  <CardContent>
    Inhalt
  </CardContent>
</Card>
```

Props:
- `variant`: 'default' | 'elevated' | 'outlined' | 'flat'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hoverable`: boolean
- `onClick`: () => void

### Select

```tsx
<Select
  label="Label"
  options={options}
  value={value}
  onChange={setValue}
  fullWidth
/>
```

Props:
- `label`: string
- `options`: Array<{ value: string, label: string }>
- `value`: string
- `onChange`: (value: string) => void
- `placeholder`: string
- `error`: string
- `helperText`: string
- `fullWidth`: boolean

### Layout

```tsx
<Layout>
  <LayoutSection maxWidth="notation" padding="lg">
    Content
  </LayoutSection>
</Layout>
```

### NotationArea

```tsx
<NotationArea>
  {/* VexFlow content */}
</NotationArea>
```

### TwoColumnLayout

```tsx
<TwoColumnLayout
  main={<div>Main content</div>}
  sidebar={<div>Sidebar</div>}
  sidebarPosition="right"
/>
```

## Farbpalette

Ersetze alle Slate-Farben mit Neutral-Farben:

| Alt            | Neu           | Verwendung              |
|----------------|---------------|-------------------------|
| slate-50       | neutral-50    | Hintergrund             |
| slate-100      | neutral-100   | Sekundärer Hintergrund  |
| slate-600      | neutral-600   | Sekundärer Text         |
| slate-800/900  | neutral-800   | Primärer Text           |
| blue-500/600   | primary-500   | Aktionen, Links         |

## VexFlow-Styling

Für VexFlow-Integration, nutze die Notation-Farben:

```typescript
import { colors } from './styles/design-tokens';

const vexflowStyle = {
  fillStyle: colors.notation.noteFill,
  strokeStyle: colors.notation.noteStroke,
};

// Notenlinien
context.setFillStyle(colors.notation.staffLine);
```

## Schrittweise Migration

1. **Phase 1**: Layout ersetzen
   - Import Layout-Komponenten
   - Äußeres `<div>` durch `<Layout>` ersetzen
   - Content in `<LayoutSection>` wrappen

2. **Phase 2**: Notation-Bereich stylen
   - VexFlow-Container mit `<NotationArea>` umgeben
   - Prüfen, ob Sizing noch passt

3. **Phase 3**: UI-Komponenten
   - Buttons durch `<Button>` ersetzen
   - Cards hinzufügen für Gruppierung
   - Selects für Übungsauswahl

4. **Phase 4**: Farben anpassen
   - Slate → Neutral
   - Blaue Farben → Primary
   - Feedback-Farben hinzufügen (Success/Error)

## Testing

Nach jeder Änderung:

```bash
npm run dev    # Development-Server
npm run build  # Production-Build testen
```

## Hilfe

Bei Fragen siehe:
- `DESIGN_SYSTEM.md` - Vollständige Dokumentation
- `src/components/DesignSystemDemo.tsx` - Live-Beispiele
- `src/styles/design-tokens.ts` - Alle Design-Tokens

## Nächste Steps

Nach erfolgreicher Integration:
- [ ] Zustand State Management integrieren (Task 4)
- [ ] Tone.js Metronome einbauen (Task 5)
- [ ] MIDI-Input mit Feedback-Farben verbinden
- [ ] Dark Mode Toggle implementieren
