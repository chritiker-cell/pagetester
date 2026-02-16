import { Section, DiagramBox, Paragraph } from './shared';
import MnemonicBox from './MnemonicBox';
import { PedalOverview } from './diagrams/PedalOverview';
import { PedalNotation } from './diagrams/PedalNotation';
import { PedalChange } from './diagrams/PedalChange';

export default function PedalsContent() {
  return (
    <div>
      <Section title="Die drei Pedale">
        <Paragraph>
          Ein Klavier hat drei Pedale unter der Tastatur. Das <strong>rechte Pedal</strong> (Haltepedal) laesst
          alle Toene nachklingen und ist das wichtigste. Das <strong>linke Pedal</strong> (Una Corda) macht den
          Klang leiser und weicher. Das <strong>mittlere Pedal</strong> (Sostenuto) haelt nur bestimmte Toene
          und wird sehr selten benutzt.
        </Paragraph>
        <DiagramBox><PedalOverview /></DiagramBox>
        <MnemonicBox title="Merke" variant="blue">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">E</span>rst{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">S</span>pielen,{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">D</span>ann{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">P</span>edal!
        </MnemonicBox>
      </Section>

      <Section title="Das Haltepedal in der Notation">
        <Paragraph>
          In Noten wird das Haltepedal mit speziellen Symbolen unter dem System notiert: <strong>"Ped."</strong> zeigt
          an, wo das Pedal gedrueckt werden soll, und ein <strong>Stern (✱)</strong> markiert, wo es losgelassen wird.
          Manchmal wird auch eine Klammer-Notation verwendet.
        </Paragraph>
        <DiagramBox><PedalNotation /></DiagramBox>
      </Section>

      <Section title="Wann Pedal wechseln?">
        <Paragraph>
          Der richtige Zeitpunkt fuer einen Pedalwechsel ist entscheidend. Bei jedem <strong>Akkordwechsel</strong> muss
          das Pedal gewechselt werden, damit sich die Harmonien nicht vermischen. Die Technik: altes Pedal loslassen
          und sofort neues Pedal druecken, genau im Moment des neuen Tastenanschlags.
        </Paragraph>
        <DiagramBox><PedalChange /></DiagramBox>
        <MnemonicBox title="Merke" variant="green">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">A</span>kkord-Wechsel ={' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">P</span>edal-Wechsel
        </MnemonicBox>
      </Section>

      <Section title="Haeufige Fehler">
        <Paragraph>
          <strong>Zu viel Pedal</strong> klingt matschig — alle Toene vermischen sich. <strong>Gar kein Pedal</strong> klingt
          zu trocken und abgehackt. <strong>Pedal vor dem Anschlag</strong> haelt ungewollte Toene. Der Pedalwechsel
          muss genau mit dem neuen Tastenanschlag synchronisiert werden.
        </Paragraph>
        <div className="bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <p className="text-neutral-900 dark:text-neutral-100 text-sm leading-relaxed">
              <strong>Praxis-Tipp:</strong> Uebe Pedalwechsel langsam und bewusst. Hoere genau auf die
              Klangveraenderung. Mit der Zeit wird die Bewegung automatisch.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
