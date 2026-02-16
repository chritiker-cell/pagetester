import { Section, DiagramBox, Paragraph } from './shared';
import MnemonicBox from './MnemonicBox';
import { HandDiagram } from './diagrams/HandDiagram';
import { FiveFingerPosition } from './diagrams/FiveFingerPosition';
import { ThumbUnder } from './diagrams/ThumbUnder';

export default function FingeringContent() {
  return (
    <div>
      <Section title="Finger-Nummern">
        <Paragraph>
          Beim Klavierspielen hat jeder Finger eine Nummer. Diese Nummern sind fuer beide Haende gleich
          und helfen dir, die richtige Technik zu lernen.
        </Paragraph>
        <DiagramBox><HandDiagram /></DiagramBox>
        <MnemonicBox title="Die fuenf Finger" variant="blue">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">D</span>aumen 1,{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">Z</span>eige 2,{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">M</span>ittel 3,{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">R</span>ing 4,{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">K</span>leiner 5
        </MnemonicBox>
      </Section>

      <Section title="Die 5-Finger-Position">
        <Paragraph>
          Die <strong>5-Finger-Position</strong> ist die Grundstellung fuer Anfaenger. Jeder Finger liegt auf
          einer eigenen Taste (C-D-E-F-G mit den Fingern 1-2-3-4-5), und du kannst fuenf aufeinanderfolgende
          Toene spielen, ohne die Hand zu bewegen.
        </Paragraph>
        <DiagramBox><FiveFingerPosition /></DiagramBox>
      </Section>

      <Section title="Untersetzen">
        <Paragraph>
          Wenn du mehr als fuenf Toene hintereinander spielen moechtest (z.B. eine Tonleiter), reicht die
          5-Finger-Position nicht aus. Beim <strong>Untersetzen</strong> bewegst du den Daumen unter die Hand,
          um die naechste Note zu spielen. Bei der C-Dur-Tonleiter spielst du C-D-E mit Fingern 1-2-3, dann
          setzt der Daumen unter und spielt F, danach geht es weiter mit 2-3-4-5.
        </Paragraph>
        <DiagramBox><ThumbUnder /></DiagramBox>
      </Section>

      <Section title="Warum ist der Fingersatz wichtig?">
        <Paragraph>
          Ein guter Fingersatz sorgt dafuer, dass deine Haende entspannt bleiben und du keine unnoetigen
          Bewegungen machst. Das verhindert Verspannungen und ermoet licht schnelleres Spielen.
          Mit dem richtigen Fingersatz fliessen die Noten geschmeidiger ineinander.
        </Paragraph>
        <MnemonicBox title="Merke" variant="green">
          Guter Fingersatz = Fluessiges Spiel!
        </MnemonicBox>
        <div className="bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl p-5 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <p className="text-neutral-900 dark:text-neutral-100 text-sm leading-relaxed">
              <strong>Praxis-Tipp:</strong> Halte dich am Anfang genau an die vorgegebenen Fingersaetze.
              Sie sind so gewaehlt, dass deine Hand in einer natuerlichen Position bleibt.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
