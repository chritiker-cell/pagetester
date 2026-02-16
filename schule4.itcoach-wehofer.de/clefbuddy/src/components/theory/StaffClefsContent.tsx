import EmptyStaff from './diagrams/EmptyStaff';
import TrebleClefStaff from './diagrams/TrebleClefStaff';
import BassClefStaff from './diagrams/BassClefStaff';
import GrandStaffDiagram from './diagrams/GrandStaffDiagram';
import LedgerLinesDiagram from './diagrams/LedgerLinesDiagram';
import MnemonicBox from './MnemonicBox';
import { Section, DiagramBox } from './shared';

export default function StaffClefsContent() {
  return (
    <div>
      {/* 1. Die Notenzeile */}
      <Section title="Die Notenzeile">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-5 text-base">
          Musik wird auf fuenf waagerechten Linien notiert. Die Linien werden von unten nach oben gezaehlt (1-5).
          Zwischen den Linien liegen vier Zwischenraeume. Jede Position steht fuer einen bestimmten Ton.
        </p>
        <DiagramBox><EmptyStaff /></DiagramBox>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed my-5 text-base">
          Reichen fuenf Linien nicht aus, werden kurze Hilfslinien ueber oder unter dem System ergaenzt.
        </p>
        <DiagramBox><LedgerLinesDiagram /></DiagramBox>
      </Section>

      {/* 2. Der Violinschluessel */}
      <Section title="Der Violinschluessel">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-5 text-base">
          Der Violinschluessel (auch G-Schluessel) steht am Anfang des oberen Systems.
          Er legt fest, dass die 2. Linie den Ton G darstellt. Er wird fuer die rechte Hand am Klavier verwendet.
        </p>
        <DiagramBox><TrebleClefStaff /></DiagramBox>
        <div className="space-y-4 mt-6">
          <MnemonicBox title="Merkspruch Linien (E-G-H-D-F)" variant="blue">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">E</span>in <span className="font-bold text-neutral-900 dark:text-neutral-100">G</span>uter <span className="font-bold text-neutral-900 dark:text-neutral-100">H</span>und <span className="font-bold text-neutral-900 dark:text-neutral-100">D</span>er <span className="font-bold text-neutral-900 dark:text-neutral-100">F</span>ressen will
          </MnemonicBox>
          <MnemonicBox title="Merkspruch Zwischenraeume (F-A-C-E)" variant="green">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">F</span>ritz <span className="font-bold text-neutral-900 dark:text-neutral-100">A</span>ss <span className="font-bold text-neutral-900 dark:text-neutral-100">C</span>ola-<span className="font-bold text-neutral-900 dark:text-neutral-100">E</span>is
          </MnemonicBox>
        </div>
      </Section>

      {/* 3. Der Bassschluessel */}
      <Section title="Der Bassschluessel">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-5 text-base">
          Der Bassschluessel (auch F-Schluessel) steht am Anfang des unteren Systems.
          Er legt fest, dass die 4. Linie den Ton F darstellt. Er wird fuer die linke Hand am Klavier verwendet.
        </p>
        <DiagramBox><BassClefStaff /></DiagramBox>
        <div className="space-y-4 mt-6">
          <MnemonicBox title="Merkspruch Linien (G-H-D-F-A)" variant="blue">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">G</span>ute <span className="font-bold text-neutral-900 dark:text-neutral-100">H</span>unde <span className="font-bold text-neutral-900 dark:text-neutral-100">D</span>uerfen <span className="font-bold text-neutral-900 dark:text-neutral-100">F</span>ressen <span className="font-bold text-neutral-900 dark:text-neutral-100">A</span>lles
          </MnemonicBox>
          <MnemonicBox title="Merkspruch Zwischenraeume (A-C-E-G)" variant="green">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">A</span>lle <span className="font-bold text-neutral-900 dark:text-neutral-100">C</span>oolen <span className="font-bold text-neutral-900 dark:text-neutral-100">E</span>sel <span className="font-bold text-neutral-900 dark:text-neutral-100">G</span>aloppieren
          </MnemonicBox>
        </div>
      </Section>

      {/* 4. Das Klaviersystem */}
      <Section title="Das Klaviersystem (Grand Staff)">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-5 text-base">
          Beide Systeme zusammen bilden das Klaviersystem. Sie sind durch eine geschweifte Klammer (Akkolade) verbunden.
          Das mittlere C liegt genau zwischen beiden Systemen auf einer Hilfslinie.
        </p>
        <DiagramBox><GrandStaffDiagram /></DiagramBox>
      </Section>
    </div>
  );
}
