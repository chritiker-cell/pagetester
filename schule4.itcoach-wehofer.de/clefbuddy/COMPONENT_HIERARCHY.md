# ClefBuddy Komponenten-Hierarchie

## Visuelle Struktur

```
┌─────────────────────────────────────────────────────────────┐
│ Layout                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Header (sticky)                                         │ │
│ │  - Logo: "ClefBuddy"                                      │ │
│ │  - Subtitle: "Note-Reading Trainer"                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Main Content                                            │ │
│ │                                                          │ │
│ │  ┌────────────────────────────────────────────────────┐ │ │
│ │  │ LayoutSection (maxWidth: notation, 1400px)        │ │ │
│ │  │                                                     │ │ │
│ │  │  ┌──────────────────────────────────────────────┐ │ │ │
│ │  │  │ TwoColumnLayout                              │ │ │ │
│ │  │  │                                               │ │ │ │
│ │  │  │  ┌─────────────────┐  ┌──────────────────┐  │ │ │ │
│ │  │  │  │ Main (flex-1)   │  │ Sidebar (320px)  │  │ │ │ │
│ │  │  │  │                 │  │                   │  │ │ │ │
│ │  │  │  │  ┌───────────┐ │  │  ┌────────────┐  │  │ │ │ │
│ │  │  │  │  │ Card      │ │  │  │ Card       │  │  │ │ │ │
│ │  │  │  │  │ (Header)  │ │  │  │ (Controls) │  │  │ │ │ │
│ │  │  │  │  └───────────┘ │  │  │            │  │  │ │ │ │
│ │  │  │  │                 │  │  │  Select    │  │  │ │ │ │
│ │  │  │  │  ┌───────────┐ │  │  │  Buttons   │  │  │ │ │ │
│ │  │  │  │  │ Notation  │ │  │  └────────────┘  │  │ │ │ │
│ │  │  │  │  │ Area      │ │  │                   │  │ │ │ │
│ │  │  │  │  │           │ │  │  ┌────────────┐  │  │ │ │ │
│ │  │  │  │  │ VexFlow   │ │  │  │ Card       │  │  │ │ │ │
│ │  │  │  │  │           │ │  │  │ (Stats)    │  │  │ │ │ │
│ │  │  │  │  └───────────┘ │  │  └────────────┘  │  │ │ │ │
│ │  │  │  │                 │  │                   │  │ │ │ │
│ │  │  │  │  ┌───────────┐ │  │                   │  │ │ │ │
│ │  │  │  │  │ Card      │ │  │                   │  │ │ │ │
│ │  │  │  │  │ (Notes)   │ │  │                   │  │ │ │ │
│ │  │  │  │  └───────────┘ │  │                   │  │ │ │ │
│ │  │  │  │                 │  │                   │  │ │ │ │
│ │  │  │  └─────────────────┘  └──────────────────┘  │ │ │ │
│ │  │  │                                               │ │ │ │
│ │  │  └──────────────────────────────────────────────┘ │ │ │
│ │  │                                                     │ │ │
│ │  └────────────────────────────────────────────────────┘ │ │
│ │                                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Footer                                                  │ │
│ │  - Copyright / Info                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Komponenten-Baum

```
<Layout>
  └── <LayoutSection maxWidth="notation" padding="lg">
      └── <TwoColumnLayout>
          ├── main:
          │   └── <div className="space-y-6">
          │       ├── <Card variant="elevated">
          │       │   ├── <CardHeader>
          │       │   │   └── <CardTitle>
          │       │   └── <CardContent>
          │       │
          │       ├── <NotationArea>
          │       │   └── [VexFlow Content]
          │       │
          │       └── <Card variant="flat">
          │           └── <CardContent>
          │
          └── sidebar:
              └── <div className="space-y-4">
                  ├── <Card variant="default" padding="lg">
                  │   ├── <CardHeader>
                  │   │   ├── <CardTitle>
                  │   │   └── <CardDescription>
                  │   ├── <CardContent>
                  │   │   └── <Select>
                  │   └── <CardFooter>
                  │       ├── <Button variant="primary">
                  │       └── <Button variant="outline">
                  │
                  ├── <Card variant="flat">
                  │   └── [Stats Display]
                  │
                  └── <Card variant="outlined">
                      └── [Typography Demo]
```

## Responsive Verhalten

### Mobile (< 768px)
```
┌────────────────┐
│ Header         │
├────────────────┤
│ Main Content   │
│  - Cards       │
│  - Notation    │
├────────────────┤
│ Sidebar        │
│  - Controls    │
│  - Stats       │
├────────────────┤
│ Footer         │
└────────────────┘
```

### Tablet (768px - 1024px)
```
┌───────────────────────────┐
│ Header                    │
├───────────────────────────┤
│ ┌──────────┐ ┌─────────┐ │
│ │ Main     │ │ Sidebar │ │
│ │ (60%)    │ │ (320px) │ │
│ │          │ │         │ │
│ └──────────┘ └─────────┘ │
├───────────────────────────┤
│ Footer                    │
└───────────────────────────┘
```

### Desktop (> 1024px)
```
┌─────────────────────────────────────────┐
│ Header (max-width: 1400px, centered)   │
├─────────────────────────────────────────┤
│ ┌────────────────────┐ ┌──────────────┐│
│ │ Main Content       │ │ Sidebar      ││
│ │ (flexible)         │ │ (320px)      ││
│ │                    │ │              ││
│ │  Notation Area     │ │  Controls    ││
│ │  (large, centered) │ │              ││
│ │                    │ │  Stats       ││
│ └────────────────────┘ └──────────────┘│
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

## UI-Komponenten Anatomie

### Button
```
┌─────────────────────┐
│  [Icon] Text [Icon] │  ← min 44px height
└─────────────────────┘
  ← padding: 6-8px ↑
```

Varianten:
- Primary: Blauer Hintergrund, weiß
- Secondary: Grauer Hintergrund, dunkel
- Outline: Transparent, blauer Border
- Ghost: Transparent, hover grau

### Card
```
┌──────────────────────────────┐
│ ← padding: 24px (md)         │
│                              │
│  [CardHeader]                │
│    ▪ CardTitle (text-2xl)   │
│    ▪ CardDescription (text-sm)│
│                              │
│  [CardContent]               │
│    (flexible content area)   │
│                              │
│  [CardFooter]                │
│    [Button] [Button]         │
│                              │
└──────────────────────────────┘
 ↑ border-radius: 8px
 ↑ shadow: varies by variant
```

### Select
```
┌──────────────────────┐
│ Label                │ ← text-sm font-medium
├──────────────────────┤
│ Selected Item    [▼] │ ← min 44px height
└──────────────────────┘
│ Helper text          │ ← text-sm text-neutral-500
```

### NotationArea
```
┌────────────────────────────────┐
│ ← padding: 32px                │
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │    VexFlow SVG/Canvas    │ │
│  │    (centered)            │ │
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
└────────────────────────────────┘
 ↑ background: white
 ↑ shadow-lg
 ↑ min-height: 240px
 ↑ border-radius: 8px
```

## Spacing System (8pt Grid)

```
0  → 0px
1  → 4px    ■
2  → 8px    ■■
3  → 12px   ■■■
4  → 16px   ■■■■
6  → 24px   ■■■■■■
8  → 32px   ■■■■■■■■
12 → 48px   ■■■■■■■■■■■■
16 → 64px   ■■■■■■■■■■■■■■■■
```

Verwendung:
- `gap-3`: 12px zwischen Elementen
- `p-6`: 24px padding (Cards)
- `space-y-4`: 16px vertikaler Abstand (Stacks)

## Color Hierarchy

### Primary Actions
```
[primary-600] ← Main (Buttons, Links)
[primary-500] ← Hover lighter
[primary-700] ← Active darker
```

### Text Colors
```
[neutral-900] ← Headings (dunkel)
[neutral-800] ← Body Text
[neutral-600] ← Secondary Text
[neutral-500] ← Helper Text (hell)
```

### Backgrounds
```
[neutral-0]   ← White (Notation, Cards)
[neutral-50]  ← Page Background (sehr hell)
[neutral-100] ← Secondary Backgrounds
```

### Feedback
```
[success]     ← Green (richtige Note)
[error]       ← Red (falsche Note)
[warning]     ← Orange (Warnung)
```

## Z-Index Stack

```
1500  Toast Notifications
1400  Popovers
1300  Modals
1200  Overlays
1100  Sticky Elements (Header)
1000  Dropdowns (Select)
   0  Base Content
  -1  Backgrounds
```

## Import-Muster

### Design Tokens
```typescript
import { colors, typography, spacing } from '@/styles/design-tokens';
```

### UI Components
```typescript
import { Button, Card, Select, Badge } from '@/components/ui';
```

### Layout Components
```typescript
import Layout, {
  LayoutSection,
  NotationArea,
  TwoColumnLayout,
  ControlPanel
} from '@/components/Layout';
```

### Full Imports (wenn nötig)
```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui';
```

## Verwendungs-Beispiel: Practice Session

```tsx
<Layout>
  <LayoutSection maxWidth="notation" padding="lg">
    <TwoColumnLayout
      main={
        <>
          {/* Exercise Info */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{exercise.name}</CardTitle>
              <CardDescription>{exercise.description}</CardDescription>
            </CardHeader>
          </Card>

          {/* Notation Display */}
          <NotationArea>
            <VexFlowRenderer exercise={exercise} />
          </NotationArea>
        </>
      }
      sidebar={
        <>
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                label="Level"
                options={levels}
                value={level}
                onChange={setLevel}
              />
            </CardContent>
            <CardFooter>
              <Button variant="primary" fullWidth>
                Start Practice
              </Button>
            </CardFooter>
          </Card>

          {/* Stats */}
          <Card variant="flat">
            <CardContent>
              <Badge variant="success">100% Accuracy</Badge>
            </CardContent>
          </Card>
        </>
      }
    />
  </LayoutSection>
</Layout>
```

## Datei-Referenzen

| Komponente | Pfad |
|-----------|------|
| Design Tokens | `/src/styles/design-tokens.ts` |
| Layout | `/src/components/Layout.tsx` |
| Button | `/src/components/ui/Button.tsx` |
| Card | `/src/components/ui/Card.tsx` |
| Select | `/src/components/ui/Select.tsx` |
| Badge | `/src/components/ui/Badge.tsx` |
| UI Index | `/src/components/ui/index.ts` |
| Demo | `/src/components/DesignSystemDemo.tsx` |

## Nächste Integration

Diese Komponenten sind bereit für:
1. Zustand State Management (Task 4)
2. Tone.js Metronome (Task 5)
3. MIDI Input Handling
4. Practice Session Flow
5. Progress Tracking
