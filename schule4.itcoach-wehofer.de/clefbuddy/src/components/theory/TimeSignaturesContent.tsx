import React from 'react';
import { Section, DiagramBox } from './shared';
import MnemonicBox from './MnemonicBox';
import { TimeSignatureExplained } from './diagrams/TimeSignatureExplained';
import { CommonTimeSignatures } from './diagrams/CommonTimeSignatures';
import { CountingPractice } from './diagrams/CountingPractice';

const TimeSignaturesContent: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Section 1: Was ist ein Takt? */}
      <Section title="Was ist ein Takt?">
        <p className="mb-4">
          Ein <strong>Takt</strong> ist eine rhythmische Einheit in der Musik. Er teilt die Musik
          in gleichmäßige Abschnitte, die durch <strong>Taktstriche</strong> (vertikale Linien)
          voneinander getrennt sind.
        </p>
        <p className="mb-4">
          Die <strong>Taktart</strong> steht am Anfang eines Musikstücks und besteht aus zwei Zahlen
          übereinander. Sie zeigt an, wie viele Schläge in einen Takt passen und welcher Notenwert
          einen Schlag bekommt.
        </p>

        <DiagramBox>
          <TimeSignatureExplained />
        </DiagramBox>

        <MnemonicBox title="Merkspruch" variant="blue">
          Oben = Zahl der Schlaege, Unten = welcher Notenwert
        </MnemonicBox>
      </Section>

      {/* Section 2: Die Taktart lesen */}
      <Section title="Die Taktart lesen">
        <p className="mb-4">
          Die <strong>obere Zahl</strong> gibt an, wie viele Schläge (Zählzeiten) in einem Takt sind.
          Eine 3 bedeutet "drei Schläge pro Takt", eine 4 bedeutet "vier Schläge pro Takt".
        </p>
        <p className="mb-4">
          Die <strong>untere Zahl</strong> gibt an, welcher Notenwert einen Schlag bekommt:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
          <li><strong>4</strong> = Viertelnote bekommt einen Schlag</li>
          <li><strong>8</strong> = Achtelnote bekommt einen Schlag</li>
          <li><strong>2</strong> = Halbe Note bekommt einen Schlag (selten)</li>
        </ul>
        <p className="mb-4">
          Beispiel: <strong>3/4</strong> bedeutet "drei Viertelnoten pro Takt" oder
          "drei Schläge, wobei die Viertel einen Schlag bekommt".
        </p>
      </Section>

      {/* Section 3: Häufige Taktarten */}
      <Section title="Häufige Taktarten">
        <p className="mb-4">
          Die drei wichtigsten Taktarten haben jeweils einen eigenen Charakter:
        </p>

        <DiagramBox>
          <CommonTimeSignatures />
        </DiagramBox>

        <div className="space-y-3 mt-4">
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">4/4-Takt (Viervierteltakt)</h4>
            <p className="text-sm text-neutral-800 dark:text-neutral-200">
              Der "Marschtakt" — vier gleichmäßige Schläge. Der erste Schlag ist betont.
              Wird auch als "C" (Common Time) geschrieben.
            </p>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-1">3/4-Takt (Dreivierteltakt)</h4>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Der "Walzertakt" — drei Schläge mit Betonung auf dem ersten.
              Typisch für Walzer und viele Volkslieder.
            </p>
          </div>

          <div className="p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">6/8-Takt (Sechsachteltakt)</h4>
            <p className="text-sm text-neutral-800 dark:text-neutral-200">
              Wiegender, fließender Charakter — sechs Achtel in zwei Gruppen zu je drei.
              Hauptbetonungen auf Schlag 1 und 4.
            </p>
          </div>
        </div>

        <MnemonicBox title="Walzer-Takt" variant="green">
          EINS-zwei-drei, EINS-zwei-drei — Walzer!
        </MnemonicBox>
      </Section>

      {/* Section 4: Zählen lernen */}
      <Section title="Zählen lernen">
        <p className="mb-4">
          Beim Üben ist es wichtig, die Schläge <strong>laut zu zählen</strong>. So entwickelst
          du ein sicheres Rhythmusgefühl:
        </p>

        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
          <li>
            <strong>Viertelnoten:</strong> Zähle 1, 2, 3, 4 (jede Zahl ist ein Schlag)
          </li>
          <li>
            <strong>Halbe Noten:</strong> Halte zwei Schläge lang (1 — 2 —)
          </li>
          <li>
            <strong>Achtelnoten:</strong> Zähle 1-und, 2-und, 3-und, 4-und
            (das "und" ist der Zwischenschlag)
          </li>
          <li>
            <strong>Ganze Note:</strong> Halte vier Schläge lang im 4/4-Takt (1 — — —)
          </li>
        </ul>

        <DiagramBox>
          <CountingPractice />
        </DiagramBox>

        <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Übungstipp
          </h4>
          <p className="text-sm text-neutral-800 dark:text-neutral-200">
            Klatsche den Rhythmus, während du zählst! Halte bei langen Noten die Hände
            zusammen. Bei Achtelnoten klatsche auf die Zahlen und sage das "und" ohne zu klatschen —
            oder klatsche zweimal schnell.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default TimeSignaturesContent;
