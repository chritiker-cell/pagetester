import { Section, DiagramBox, Paragraph } from './shared';
import MnemonicBox from './MnemonicBox';
import { DynamicLevels } from './diagrams/DynamicLevels';
import { CrescendoDecrescendo } from './diagrams/CrescendoDecrescendo';
import { ArticulationMarks } from './diagrams/ArticulationMarks';

export default function DynamicsContent() {
  return (
    <div>
      <Section title="Laut und Leise">
        <Paragraph>
          Dynamik beschreibt die Lautstaerke der Musik. Von ganz leise (pianissimo) bis sehr laut (fortissimo)
          gibt es sechs wichtige Stufen, die mit Buchstaben abgekuerzt werden.
        </Paragraph>
        <DiagramBox><DynamicLevels /></DiagramBox>
        <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 my-5">
          <li><strong>pp</strong> (pianissimo) = sehr leise</li>
          <li><strong>p</strong> (piano) = leise</li>
          <li><strong>mp</strong> (mezzopiano) = mittelleise</li>
          <li><strong>mf</strong> (mezzoforte) = mittellaut</li>
          <li><strong>f</strong> (forte) = laut</li>
          <li><strong>ff</strong> (fortissimo) = sehr laut</li>
        </ul>
        <MnemonicBox title="Merkhilfe" variant="blue">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">P</span>iano ={' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">P</span>leise,{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">F</span>orte ={' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">F</span>est
        </MnemonicBox>
      </Section>

      <Section title="Crescendo und Decrescendo">
        <Paragraph>
          Musik wird nicht nur in festen Lautstaerken gespielt — sie kann auch allmaehlich lauter oder leiser werden.
          Das <strong>Crescendo</strong> (lauter werden) und <strong>Decrescendo</strong> (leiser werden) werden
          als spitze Klammern (Hairpins) unter den Noten geschrieben.
        </Paragraph>
        <DiagramBox><CrescendoDecrescendo /></DiagramBox>
      </Section>

      <Section title="Staccato und Legato">
        <Paragraph>
          Artikulation beschreibt, <em>wie</em> du die Toene spielst. Die zwei wichtigsten Spielweisen sind
          <strong> Staccato</strong> (kurz, getrennt — Punkt ueber der Note) und <strong>Legato</strong> (weich
          verbunden — Bindebogen ueber den Noten).
        </Paragraph>
        <DiagramBox><ArticulationMarks /></DiagramBox>
        <MnemonicBox title="Merkhilfe" variant="green">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">S</span>taccato = Kurz und knackig,{' '}
          <span className="font-bold text-neutral-900 dark:text-neutral-100">L</span>egato = Lang und geschmeidig
        </MnemonicBox>
      </Section>

      <Section title="Akzente und Ausdruck">
        <Paragraph>
          Der <strong>Akzent</strong> (&gt;) markiert besonders betonte Toene. <strong>Tenuto</strong> (waagerechter
          Strich) bedeutet: halte die Note fuer ihre volle Laenge aus. <strong>Sforzato</strong> (sfz) ist eine
          ploetzliche, starke Betonung auf einer einzelnen Note.
        </Paragraph>
        <Paragraph>
          Dynamik und Artikulation machen dein Spiel erst lebendig. Ohne sie wuerde Musik sehr eintoengig klingen —
          sie sind wie die Betonung und Sprechmelodie in der Sprache.
        </Paragraph>
      </Section>
    </div>
  );
}
