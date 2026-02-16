import React from 'react';
import { Section, DiagramBox, Paragraph } from './shared';
import MnemonicBox from './MnemonicBox';
import { MajorMinorTriads } from './diagrams/MajorMinorTriads';
import { TriadInversions } from './diagrams/TriadInversions';
import { ThreeChords } from './diagrams/ThreeChords';

const TriadsContent: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Section 1: Was ist ein Dreiklang? */}
      <Section title="Was ist ein Dreiklang?">
        <Paragraph>
          Ein <strong>Dreiklang</strong> (englisch: triad) ist ein Akkord aus drei Tönen,
          die in Terzen übereinander geschichtet sind. Er besteht immer aus:
        </Paragraph>

        <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-700 dark:text-neutral-300">
          <li><strong>Grundton</strong> - der tiefste Ton und Namensgeber des Akkords</li>
          <li><strong>Terz</strong> - der mittlere Ton, eine Terz über dem Grundton</li>
          <li><strong>Quinte</strong> - der höchste Ton, eine Quinte über dem Grundton</li>
        </ul>

        <MnemonicBox title="Dreiklang-Aufbau" variant="blue">
          <strong>Grundton</strong>, <strong>Terz</strong>, <strong>Quinte</strong> —
          Jeder Dreiklang braucht drei Zutaten!
        </MnemonicBox>

        <Paragraph>
          Diese drei Töne bilden die Grundlage fast aller westlichen Musik.
          Ob Pop, Rock, Klassik oder Jazz - überall findest du Dreiklänge!
        </Paragraph>
      </Section>

      {/* Section 2: Dur und Moll */}
      <Section title="Dur und Moll">
        <Paragraph>
          Die beiden wichtigsten Dreiklang-Typen sind <strong>Dur</strong> (major) und <strong>Moll</strong> (minor).
          Der Unterschied liegt in der Terz:
        </Paragraph>

        <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li><strong>Dur-Dreiklang:</strong> Grundton + grosse Terz + reine Quinte</li>
          <li><strong>Moll-Dreiklang:</strong> Grundton + kleine Terz + reine Quinte</li>
        </ul>

        <DiagramBox>
          <MajorMinorTriads />
        </DiagramBox>

        <MnemonicBox title="Dur vs. Moll" variant="green">
          <strong>Dur</strong> = hell und froehlich, <strong>Moll</strong> = dunkel und nachdenklich
        </MnemonicBox>

        <Paragraph>
          Die kleine Terz liegt einen Halbton tiefer als die grosse Terz.
          Diese winzige Änderung verändert den gesamten Charakter des Akkords!
        </Paragraph>
      </Section>

      {/* Section 3: Umkehrungen */}
      <Section title="Umkehrungen">
        <Paragraph>
          Ein Dreiklang muss nicht immer mit dem Grundton als tiefsten Ton gespielt werden.
          Du kannst die Töne auch umschichten - das nennt man <strong>Umkehrungen</strong> (inversions):
        </Paragraph>

        <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li><strong>Grundstellung:</strong> Grundton - Terz - Quinte (z.B. C-E-G)</li>
          <li><strong>1. Umkehrung:</strong> Terz - Quinte - Grundton (z.B. E-G-C)</li>
          <li><strong>2. Umkehrung:</strong> Quinte - Grundton - Terz (z.B. G-C-E)</li>
        </ul>

        <DiagramBox>
          <TriadInversions />
        </DiagramBox>

        <Paragraph>
          Alle drei Umkehrungen klingen nach demselben C-Dur Akkord - nur die Reihenfolge der Töne ändert sich.
          Umkehrungen machen die Musik fließender, weil du nicht immer große Sprünge machen musst.
        </Paragraph>
      </Section>

      {/* Section 4: Drei Akkorde reichen! */}
      <Section title="Drei Akkorde reichen!">
        <Paragraph>
          Mit nur drei Dreiklängen kannst du tausende von Songs spielen!
          In jeder Tonart gibt es drei Hauptakkorde, die auf den Stufen <strong>I</strong>, <strong>IV</strong> und <strong>V</strong>
          der Tonleiter gebaut werden:
        </Paragraph>

        <DiagramBox>
          <ThreeChords />
        </DiagramBox>

        <Paragraph>
          In C-Dur sind das:
        </Paragraph>

        <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-700 dark:text-neutral-300">
          <li><strong>I - C-Dur (Tonika):</strong> Der "Heimat"-Akkord, klingt stabil und ruhig</li>
          <li><strong>IV - F-Dur (Subdominante):</strong> Baut Spannung auf, will zur Tonika zurück</li>
          <li><strong>V - G-Dur (Dominante):</strong> Größte Spannung, zieht stark zur Tonika</li>
        </ul>

        <Paragraph>
          Die klassische Akkordfolge <strong>I-IV-V-I</strong> (z.B. C-F-G-C)
          ist das Rückgrat unzähliger Pop- und Rocksongs. Von "Twist and Shout" der Beatles
          bis zu "Wild Thing" von The Troggs - drei Akkorde können Musikgeschichte schreiben!
        </Paragraph>

        <MnemonicBox title="Drei-Akkorde-Trick" variant="blue">
          Viele Hits brauchen nur drei Akkorde: <strong>I-IV-V</strong>.
          Probier es aus — du wirst staunen, was alles moeglich ist!
        </MnemonicBox>
      </Section>
    </div>
  );
};

export default TriadsContent;
