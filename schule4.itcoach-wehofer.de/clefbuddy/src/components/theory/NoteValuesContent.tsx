import { Section, DiagramBox } from './shared';
import MnemonicBox from './MnemonicBox';
import NoteValueOverview from './diagrams/NoteValueOverview';
import RestSymbols from './diagrams/RestSymbols';
import DottedNotes from './diagrams/DottedNotes';

export default function NoteValuesContent() {
  return (
    <div className="space-y-8">
      {/* Section 1: Ganze & Halbe Noten */}
      <Section title="Ganze & Halbe Noten">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
          Die <strong>ganze Note</strong> dauert 4 Schlaege und ist die laengste Grundnote.
          Sie hat einen offenen Notenkopf ohne Hals. Die <strong>halbe Note</strong> ist
          halb so lang (2 Schlaege) und hat ebenfalls einen offenen Kopf, aber mit einem Hals.
        </p>
        <DiagramBox>
          <NoteValueOverview />
        </DiagramBox>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
          Lange Noten geben der Musik Raum zum Atmen. Sie sind besonders wichtig fuer
          langsame, ausdrucksvolle Stuecke.
        </p>
      </Section>

      {/* Section 2: Viertel & Achtel */}
      <Section title="Viertel & Achtel">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
          Die <strong>Viertelnote</strong> (1 Schlag) hat einen ausgefuellten Notenkopf
          mit Hals. Sie ist der "Grundschlag" in den meisten Stuecken. Die{' '}
          <strong>Achtelnote</strong> (½ Schlag) ist noch kuerzer und hat zusaetzlich
          ein Faehnchen am Hals.
        </p>
        <MnemonicBox title="Merkspruch" variant="blue">
          Ganze → Halbe → Viertel → Achtel — jede halb so lang!
        </MnemonicBox>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
          <strong>Wichtig:</strong> Mehrere Achtelnoten werden oft mit einem Balken
          verbunden statt einzelner Faehnchen. Das macht die Noten leichter lesbar.
        </p>
      </Section>

      {/* Section 3: Punktierung */}
      <Section title="Punktierung">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
          Ein <strong>Punkt</strong> hinter einer Note verlaengert sie um die Haelfte
          ihres Wertes. Eine punktierte halbe Note dauert also 2 + 1 = <strong>3 Schlaege</strong>.
        </p>
        <DiagramBox>
          <DottedNotes />
        </DiagramBox>
        <MnemonicBox title="Merkspruch" variant="green">
          Punkt = Plus die Haelfte!
        </MnemonicBox>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
          Punktierte Noten erzeugen einen eleganten, schwingenden Rhythmus. Sie sind
          sehr haeufig in Walzern (3/4-Takt) und vielen Melodien.
        </p>
      </Section>

      {/* Section 4: Pausen */}
      <Section title="Pausen">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
          Pausen sind genauso wichtig wie Noten! Jeder Notenwert hat ein entsprechendes
          Pausenzeichen mit der gleichen Dauer. Die <strong>ganze Pause</strong> haengt
          unter einer Linie, die <strong>halbe Pause</strong> sitzt auf einer Linie.
        </p>
        <DiagramBox>
          <RestSymbols />
        </DiagramBox>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
          <strong>Musiktipp:</strong> Pausen sind keine "Luecken", sondern aktive Momente
          der Stille. Zaehle sie genau wie Noten mit, um im Rhythmus zu bleiben!
        </p>
      </Section>
    </div>
  );
}
