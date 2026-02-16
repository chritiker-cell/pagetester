import AccidentalSymbols from './diagrams/AccidentalSymbols';
import KeySignatures from './diagrams/KeySignatures';
import AccidentalScope from './diagrams/AccidentalScope';
import MnemonicBox from './MnemonicBox';
import { Section, DiagramBox, Paragraph } from './shared';

export default function AccidentalsContent() {
  return (
    <div>
      {/* 1. Kreuz erhoeht */}
      <Section title="Kreuz erhoeht">
        <Paragraph>
          Das Kreuz (♯) erhoeht einen Ton um einen Halbton. Ein Fis (F♯) liegt
          also einen Halbton hoeher als F. Auf dem Klavier ist das die naechste
          Taste rechts - meist eine schwarze Taste.
        </Paragraph>
        <DiagramBox>
          <AccidentalSymbols />
        </DiagramBox>
      </Section>

      {/* 2. Be erniedrigt */}
      <Section title="Be erniedrigt">
        <Paragraph>
          Das Be (♭) erniedrigt einen Ton um einen Halbton. Ein B (H♭) liegt
          also einen Halbton tiefer als H. Auf dem Klavier ist das die naechste
          Taste links - meist eine schwarze Taste.
        </Paragraph>
        <Paragraph>
          Merke: Im deutschen Notensystem heisst H♭ einfach nur "B", waehrend das
          englische B bei uns "H" heisst. Das kann am Anfang verwirrend sein.
        </Paragraph>
      </Section>

      {/* 3. Aufloesung und Geltungsbereich */}
      <Section title="Aufloesung und Geltungsbereich">
        <Paragraph>
          Das Aufloesezeichen (♮) hebt ein Kreuz oder Be wieder auf und stellt
          den urspruenglichen Ton wieder her. Es gibt zwei Arten von Vorzeichen
          mit unterschiedlichem Geltungsbereich:
        </Paragraph>
        <DiagramBox>
          <AccidentalScope />
        </DiagramBox>
        <Paragraph>
          Ein <strong>Versetzungszeichen</strong> steht direkt vor einer Note und
          gilt nur fuer diesen einen Takt. Danach ist es wieder aufgehoben.
          Ein <strong>Generalvorzeichen</strong> steht am Anfang nach dem Notenschluessel
          und gilt fuer das gesamte Stueck (oder bis zur naechsten Tonartwechsel).
        </Paragraph>
      </Section>

      {/* 4. Generalvorzeichen (Tonarten) */}
      <Section title="Generalvorzeichen (Tonarten)">
        <Paragraph>
          Jede Tonart hat eine feste Anzahl von Vorzeichen. C-Dur hat keine,
          G-Dur hat ein Kreuz (Fis), F-Dur hat ein Be (B). Die Vorzeichen erscheinen
          immer in einer festen Reihenfolge:
        </Paragraph>
        <DiagramBox>
          <KeySignatures />
        </DiagramBox>

        <div className="space-y-4 mt-6">
          <MnemonicBox title="Kreuz-Reihenfolge (F-C-G-D-A-E-H)" variant="blue">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">F</span>rische{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">C</span>roissants{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">G</span>ibts{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">D</span>ienstags{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">A</span>uch{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">E</span>xtra{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">H</span>eute
          </MnemonicBox>

          <MnemonicBox title="Be-Reihenfolge (H-E-A-D-G-C-F)" variant="green">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">H</span>eute{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">E</span>ssen{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">A</span>lle{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">D</span>eutschen{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">G</span>uten{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">C</span>orn{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">F</span>lakes
          </MnemonicBox>
        </div>

        <Paragraph>
          Die Be-Reihenfolge ist einfach die Kreuz-Reihenfolge rueckwaerts.
          Mit jeder neuen Tonart kommt ein weiteres Vorzeichen hinzu:
          G-Dur (1♯), D-Dur (2♯), A-Dur (3♯) usw.
        </Paragraph>
      </Section>
    </div>
  );
}
