# ClefBuddy Design System

Minimalistisches Design-System für die ClefBuddy Note-Reading App, optimiert für Musikübungen und Blattlesen.

## Übersicht

Das ClefBuddy Design-System folgt diesen Prinzipien:

1. **Musik zuerst** - Die Notation steht immer im Mittelpunkt
2. **Viel Weißraum** - Reduzierte Ablenkung für fokussierte Praxis
3. **Touch-freundlich** - Mindestens 44x44px Touch-Targets
4. **Dark Mode Ready** - Farben für zukünftigen Dark Mode vorbereitet
5. **Responsive** - Mobile-First, Desktop-optimiert

## Verzeichnisstruktur

```
src/
├── styles/
│   └── design-tokens.ts          # Zentrale Design-Tokens
├── components/
│   ├── Layout.tsx                # Haupt-Layout-Komponenten
│   └── ui/
│       ├── index.ts              # Export-Hub
│       ├── Button.tsx            # Button-Komponente
│       ├── Card.tsx              # Card-Komponente
│       └── Select.tsx            # Select/Dropdown-Komponente
└── DesignSystemDemo.tsx          # Demo aller Komponenten
```

## Design Tokens

### Farben

#### Primary (Indigo)
- **Verwendung**: Hauptaktionen, Links, aktive Zustände
- **Werte**: `primary-400` bis `primary-700`
- **Hauptfarbe**: `primary-600` (#4f46e5)

#### Neutral (Slate)
- **Verwendung**: Texte, Hintergründe, Trennlinien
- **Werte**: `neutral-0` (weiß) bis `neutral-900` (fast schwarz)
- **Hintergrund**: `neutral-50` (#f8fafc)
- **Text**: `neutral-800` (#1e293b)

#### Feedback-Farben
- **Success**: `#22c55e` - Richtige Noten, positive Aktionen
- **Error**: `#ef4444` - Falsche Noten, Fehler
- **Warning**: `#f59e0b` - Warnungen, fast-richtige Noten
- **Info**: `#3b82f6` - Informative Hinweise

#### Notation-spezifische Farben
```typescript
notation: {
  staffLine: '#475569',      // Notenlinien
  noteFill: '#0f172a',       // Notenköpfe
  accidental: '#0f172a',     // Vorzeichen
  barline: '#334155',        // Taktstriche
}
```

#### Metronom-Farben
```typescript
metronome: {
  beat1: '#ef4444',          // Downbeat (rot)
  beatStrong: '#f59e0b',     // Starke Beats (orange)
  beatWeak: '#6366f1',       // Schwache Beats (primary)
  inactive: '#cbd5e1',       // Inaktive Beats
}
```

### Typographie

#### Font Families
- **Sans**: Inter, system-ui (UI-Text)
- **Mono**: JetBrains Mono, Monaco (Code, Counts)
- **Musical**: Bravura (SMuFL-Symbole, falls verfügbar)

#### Font Sizes
- `xs`: 12px - Helper-Text
- `sm`: 14px - Labels
- `base`: 16px - Body-Text
- `lg`: 18px - Hervorgehobener Text
- `xl`: 20px - Subheadings
- `2xl`: 24px - Section-Titel
- `3xl`: 30px - Page-Titel
- `5xl`: 48px - Hero/Logo

#### Font Weights
- `normal`: 400 - Body-Text
- `medium`: 500 - Labels
- `semibold`: 600 - Subheadings
- `bold`: 700 - Headings

### Spacing

Basiert auf 8-Punkt-Grid-System (Base: 4px):
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px
- `6`: 24px
- `8`: 32px
- `12`: 48px
- `16`: 64px

### Shadows

```css
sm: Subtiler Schatten für kleine Elemente
DEFAULT: Standard-Schatten für Cards
md: Mittlerer Schatten für erhöhte Cards
lg: Großer Schatten für Modals
xl: Extra großer Schatten für Overlays

/* Farbige Schatten für Feedback */
shadow-success: Grüner Glüh-Effekt
shadow-error: Roter Glüh-Effekt
shadow-primary: Blauer Glüh-Effekt
```

## Komponenten

### Button

Vielseitige Button-Komponente mit 4 Varianten und 3 Größen.

```tsx
import { Button } from './components/ui';

// Varianten
<Button variant="primary">Primärer Button</Button>
<Button variant="secondary">Sekundärer Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Größen
<Button size="sm">Klein</Button>
<Button size="md">Mittel (Standard)</Button>
<Button size="lg">Groß</Button>

// Props
<Button fullWidth>Volle Breite</Button>
<Button disabled>Deaktiviert</Button>
```

**Touch Targets**: Alle Buttons haben mindestens 44px Höhe (WCAG 2.5.5).

### Card

Container-Komponente für gruppierte Inhalte.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './components/ui';

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent>
    Inhalt hier
  </CardContent>
  <CardFooter>
    <Button>Aktion</Button>
  </CardFooter>
</Card>
```

**Varianten**:
- `default`: Standard Card mit mittlerem Schatten
- `elevated`: Card mit großem Schatten für Emphasis
- `outlined`: Card mit Border statt Schatten
- `flat`: Flache Card ohne Schatten

**Padding**:
- `none`: Kein Padding (für Bilder etc.)
- `sm`: 16px
- `md`: 24px (Standard)
- `lg`: 32px

### Select

Gestylte Dropdown-Auswahl.

```tsx
import { Select } from './components/ui';

const options = [
  { value: 'beginner', label: 'Anfänger' },
  { value: 'advanced', label: 'Fortgeschritten' },
];

<Select
  label="Schwierigkeitsgrad"
  options={options}
  value={selectedLevel}
  onChange={setSelectedLevel}
  placeholder="Wählen..."
  helperText="Hilfetext"
  fullWidth
/>
```

**Props**:
- `label`: Label über dem Select
- `options`: Array von `{ value, label, disabled? }`
- `value`: Ausgewählter Wert
- `onChange`: Callback bei Änderung
- `error`: Fehlermeldung (zeigt roten Border)
- `helperText`: Hilfetext unter dem Select
- `fullWidth`: Volle Breite des Containers

## Layout-Komponenten

### Layout

Haupt-Layout mit Header, Footer und Content-Area.

```tsx
import Layout from './components/Layout';

<Layout>
  <LayoutSection maxWidth="notation" padding="lg">
    {/* Content */}
  </LayoutSection>
</Layout>
```

### NotationArea

Spezieller Container für Notenbereich (weißer Hintergrund, optimale Abmessungen).

```tsx
import { NotationArea } from './components/Layout';

<NotationArea>
  {/* VexFlow Rendering hier */}
</NotationArea>
```

**Features**:
- Weißer Hintergrund (#ffffff)
- Schatten für Elevation
- `min-h-notation` (240px minimum)
- Zentrierter Content

### TwoColumnLayout

Helper für Seiten mit Hauptinhalt + Sidebar.

```tsx
import { TwoColumnLayout } from './components/Layout';

<TwoColumnLayout
  main={<div>Hauptinhalt</div>}
  sidebar={<div>Sidebar</div>}
  sidebarPosition="right"
/>
```

**Responsive Verhalten**:
- Mobile: Spalten untereinander
- Desktop (lg+): Zweispaltig, Sidebar 320px breit

### ControlPanel

Container für Übungs-Controls (Metronom, Tempo, Level).

```tsx
import { ControlPanel } from './components/Layout';

<ControlPanel position="sidebar">
  {/* Controls */}
</ControlPanel>
```

## Responsive Breakpoints

```css
sm:  640px   - Mobile Landscape
md:  768px   - Tablet Portrait
lg:  1024px  - Tablet Landscape / Small Desktop
xl:  1280px  - Desktop
2xl: 1536px  - Large Desktop
```

## Verwendung

### 1. Import Design Tokens

```typescript
import { colors, typography, spacing } from './styles/design-tokens';

// Verwendung in Komponenten
const myColor = colors.primary[600];
const mySpacing = spacing[4];
```

### 2. Tailwind-Klassen verwenden

```tsx
<div className="bg-neutral-50 p-6 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-neutral-900">
    Titel
  </h1>
</div>
```

### 3. Komponenten importieren

```tsx
import { Button, Card, Select } from './components/ui';
import Layout, { NotationArea } from './components/Layout';
```

## Dark Mode (Vorbereitet)

Alle Farben haben Dark-Mode-Varianten definiert. Für Dark Mode:

1. `notation.dark.*` Farben für VexFlow verwenden
2. Tailwind `dark:` Prefix nutzen
3. Design Tokens unterstützen bereits Dark Mode

```tsx
// Beispiel
<div className="bg-white dark:bg-neutral-900">
  <h1 className="text-neutral-900 dark:text-neutral-50">
    Titel
  </h1>
</div>
```

## VexFlow-Integration

### Styling für VexFlow

```typescript
import { colors } from './styles/design-tokens';

const vexflowStyle = {
  fillStyle: colors.notation.noteFill,
  strokeStyle: colors.notation.noteStroke,
};

// Für Dark Mode
const vexflowDarkStyle = {
  fillStyle: colors.notation.dark.noteFill,
  strokeStyle: colors.notation.dark.noteStroke,
};
```

### Container für VexFlow

```tsx
<NotationArea>
  <div id="vexflow-container" />
</NotationArea>
```

## Barrierefreiheit

- **Touch Targets**: Minimum 44x44px (WCAG 2.5.5)
- **Farbkontraste**: Alle Text-Farben erfüllen WCAG AA
- **Keyboard Navigation**: Alle interaktiven Elemente fokussierbar
- **Focus Rings**: Sichtbare Focus-Indikatoren auf allen Controls

## Performance

- **CSS-only**: Keine JS-basierte Styles
- **Tailwind JIT**: Nur verwendete Klassen im Bundle
- **Transitions**: Optimiert für 60fps (`ease-musical` Timing)

## Demo

Die vollständige Demo aller Komponenten ist in `src/components/DesignSystemDemo.tsx` verfügbar.

Um die Demo zu sehen:

```tsx
// In App.tsx oder main.tsx
import DesignSystemDemo from './components/DesignSystemDemo';

// Komponente rendern
<DesignSystemDemo />
```

## Nächste Schritte

- [ ] Dark Mode Toggle implementieren
- [ ] Metronome-Komponente mit Animation
- [ ] Piano-Keyboard-Selector für Range-Auswahl
- [ ] Toast/Notification-System für Feedback
- [ ] Modal/Dialog-Komponente
- [ ] Loading-States und Skeletons
