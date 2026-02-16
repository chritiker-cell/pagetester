import { Section, DiagramBox, Paragraph } from './shared';
import MnemonicBox from './MnemonicBox';
import { BlockedVsBroken } from './diagrams/BlockedVsBroken';
import { ArpeggioDirections } from './diagrams/ArpeggioDirections';
import { AlbertiBass } from './diagrams/AlbertiBass';

export default function ArpeggiosContent() {
  return (
    <div>
      <Section title="Was ist ein Arpeggio?">
        <Paragraph>
          Ein <strong>Arpeggio</strong> (auch <em>gebrochener Akkord</em> genannt) entsteht, wenn die Toene
          eines Akkords nicht gleichzeitig, sondern nacheinander gespielt werden. Waehrend ein Block-Akkord
          alle Toene auf einmal erklingen laesst, verteilt das Arpeggio die gleichen Toene ueber die Zeit.
        </Paragraph>
        <DiagramBox><BlockedVsBroken /></DiagramBox>
        <MnemonicBox title="Merke" variant="green">
          Arpeggio = Akkord in Zeitlupe
        </MnemonicBox>
      </Section>

      <Section title="Richtungen">
        <Paragraph>
          Arpeggios koennen in verschiedenen Richtungen gespielt werden: <strong>aufwaerts</strong> (vom tiefsten
          zum hoechsten Ton), <strong>abwaerts</strong> (vom hoechsten zum tiefsten) oder in gemischten Mustern
          wie dem Alberti-Bass.
        </Paragraph>
        <DiagramBox><ArpeggioDirections /></DiagramBox>
      </Section>

      <Section title="Der Alberti-Bass">
        <Paragraph>
          Der <strong>Alberti-Bass</strong> ist ein beruehmtes Arpeggio-Muster, benannt nach dem italienischen
          Komponisten Domenico Alberti. Es folgt dem Schema: <strong>tief - hoch - mittel - hoch</strong>.
          Dieses Pattern war besonders in der Klassik beliebt (Mozart, Haydn) und schafft eine fliessende,
          elegante Begleitung fuer die rechte Hand.
        </Paragraph>
        <DiagramBox><AlbertiBass /></DiagramBox>
        <MnemonicBox title="Alberti-Bass" variant="blue">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">T</span>ief{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">H</span>och{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">M</span>ittel{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">H</span>och — das ist Alberti!
        </MnemonicBox>
      </Section>

      <Section title="Uebung">
        <Paragraph>
          Spiele zuerst den Akkord als Block (alle Toene gleichzeitig), um die Harmonie zu verinnerlichen.
          Dann zerlege ihn langsam in Viertelnoten: C - E - G - C'. Uebe in beide Richtungen und probiere
          verschiedene Notenwerte (Achtel, Triolen). Zum Schluss uebe das Alberti-Muster: C-G-E-G.
        </Paragraph>
        <div className="bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <p className="text-neutral-900 dark:text-neutral-100 text-sm leading-relaxed">
              <strong>Praxis-Tipp:</strong> Uebe Arpeggios langsam und gleichmaessig. Jeder Ton sollte
              gleich laut sein. Mit der Zeit wird die Bewegung fliessend.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
