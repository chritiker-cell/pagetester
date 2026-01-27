/**
 * Design System Demo Component
 *
 * Showcases the ClefBuddy design system components.
 * This can be integrated into App.tsx or used as a separate demo page.
 */

import { useState } from 'react';
import Layout, { LayoutSection, NotationArea, TwoColumnLayout } from './Layout';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Select } from './ui';

const DesignSystemDemo = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const levelOptions = [
    { value: 'beginner', label: 'Anfänger - Ganze & Halbe Noten' },
    { value: 'intermediate', label: 'Fortgeschritten - Viertelnoten' },
    { value: 'advanced', label: 'Experte - Gemischte Rhythmen' },
  ];

  return (
    <Layout>
      <LayoutSection maxWidth="notation" padding="lg">
        <TwoColumnLayout
          main={
            <div className="space-y-6">
              {/* Notation Display Area */}
              <NotationArea>
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-24 w-24 text-neutral-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                    Notenbereich
                  </h2>
                  <p className="text-neutral-500">
                    Hier erscheinen die Noten für die Blattlese-Übung
                  </p>
                  <p className="text-sm text-neutral-400 mt-2">
                    VexFlow-Integration ist bereits aktiv in App.tsx
                  </p>
                </div>
              </NotationArea>

              {/* Button Variants Demo */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Button-Komponenten</CardTitle>
                  <CardDescription>
                    Verschiedene Button-Varianten für unterschiedliche Aktionen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary">Primary Button</Button>
                      <Button variant="secondary">Secondary Button</Button>
                      <Button variant="outline">Outline Button</Button>
                      <Button variant="ghost">Ghost Button</Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" size="sm">Small</Button>
                      <Button variant="primary" size="md">Medium</Button>
                      <Button variant="primary" size="lg">Large</Button>
                    </div>
                    <div>
                      <Button variant="primary" fullWidth>Full Width Button</Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" disabled>Disabled</Button>
                      <Button variant="secondary" disabled>Disabled Secondary</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Variants Demo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="text-lg">Default Card</CardTitle>
                    <CardDescription>
                      Standard Card mit shadow-md
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600">
                      Für normale Inhalte und Gruppierungen.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Elevated Card</CardTitle>
                    <CardDescription>
                      Card mit shadow-lg für Emphasis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600">
                      Für hervorgehobene Elemente.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle className="text-lg">Outlined Card</CardTitle>
                    <CardDescription>
                      Card mit Border statt Shadow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600">
                      Für flachere Designs.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="flat">
                  <CardHeader>
                    <CardTitle className="text-lg">Flat Card</CardTitle>
                    <CardDescription>
                      Card ohne Shadow oder Border
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600">
                      Für minimale Designs.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Color Palette Demo */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Farbpalette</CardTitle>
                  <CardDescription>
                    ClefBuddy Farbsystem mit Dark Mode Support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                        Primary (Indigo)
                      </h4>
                      <div className="flex gap-2">
                        <div className="w-12 h-12 bg-primary-400 rounded shadow-sm"></div>
                        <div className="w-12 h-12 bg-primary-500 rounded shadow-sm"></div>
                        <div className="w-12 h-12 bg-primary-600 rounded shadow-sm"></div>
                        <div className="w-12 h-12 bg-primary-700 rounded shadow-sm"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                        Feedback-Farben
                      </h4>
                      <div className="flex gap-2">
                        <div className="flex-1 p-3 bg-success text-white rounded font-medium text-sm text-center">
                          Success
                        </div>
                        <div className="flex-1 p-3 bg-error text-white rounded font-medium text-sm text-center">
                          Error
                        </div>
                        <div className="flex-1 p-3 bg-warning text-white rounded font-medium text-sm text-center">
                          Warning
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          }
          sidebar={
            <div className="space-y-4">
              {/* Control Panel Card */}
              <Card variant="default" padding="lg">
                <CardHeader>
                  <CardTitle className="text-xl">Übungs-Setup</CardTitle>
                  <CardDescription>
                    Wähle dein Level und starte
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Level Selection */}
                  <Select
                    label="Schwierigkeitsgrad"
                    options={levelOptions}
                    value={selectedLevel}
                    onChange={setSelectedLevel}
                    placeholder="Level wählen..."
                    helperText="Wähle basierend auf deiner Erfahrung"
                    fullWidth
                  />

                  {/* Tempo Control Demo */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Tempo</span>
                      <span className="font-medium text-neutral-900">60 BPM</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full">
                      <div className="w-1/3 h-full bg-primary-500 rounded-full transition-all duration-250"></div>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Interaktiver Slider folgt in Task 5
                    </p>
                  </div>

                  {/* Metronome Colors Demo */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                      Metronom-Beats
                    </h4>
                    <div className="flex justify-between items-end gap-2">
                      <div className="flex-1 h-12 bg-error rounded-t-lg flex items-end justify-center pb-1">
                        <span className="text-xs font-medium text-white">1</span>
                      </div>
                      <div className="flex-1 h-8 bg-primary-400 rounded-t-lg flex items-end justify-center pb-1">
                        <span className="text-xs font-medium text-white">2</span>
                      </div>
                      <div className="flex-1 h-10 bg-warning rounded-t-lg flex items-end justify-center pb-1">
                        <span className="text-xs font-medium text-white">3</span>
                      </div>
                      <div className="flex-1 h-6 bg-neutral-300 rounded-t-lg flex items-end justify-center pb-1">
                        <span className="text-xs font-medium text-neutral-700">4</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      Downbeat (rot), Strong (orange), Weak (blau), Inactive (grau)
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!selectedLevel}
                  >
                    Übung starten
                  </Button>
                  <Button variant="outline" size="md" fullWidth>
                    Einstellungen
                  </Button>
                </CardFooter>
              </Card>

              {/* Stats Card */}
              <Card variant="flat" padding="md">
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                  Heute
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">0</div>
                    <div className="text-xs text-neutral-500">Übungen</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">0%</div>
                    <div className="text-xs text-neutral-500">Genauigkeit</div>
                  </div>
                </div>
              </Card>

              {/* Typography Demo */}
              <Card variant="outlined" padding="md">
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                  Typographie
                </h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-neutral-900">Heading 2XL</div>
                  <div className="text-xl font-semibold text-neutral-800">Heading XL</div>
                  <div className="text-base text-neutral-700">Body Text (Base)</div>
                  <div className="text-sm text-neutral-600">Small Text</div>
                  <div className="text-xs text-neutral-500">Extra Small Text</div>
                </div>
              </Card>
            </div>
          }
        />
      </LayoutSection>
    </Layout>
  );
};

export default DesignSystemDemo;
