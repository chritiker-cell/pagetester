import { Section, DiagramBox } from './shared';
import MnemonicBox from './MnemonicBox';
import { IntervalSteps } from './diagrams/IntervalSteps';
import { IntervalOverview } from './diagrams/IntervalOverview';
import { IntervalReading } from './diagrams/IntervalReading';

export default function IntervalsContent() {
  return (
    <div className="space-y-8">
      {/* Section 1: Was ist ein Intervall? */}
      <Section title="Was ist ein Intervall?">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
          Ein <strong>Intervall</strong> ist der Abstand zwischen zwei Tönen. Intervalle werden
          gezählt, indem man beide Töne mitzählt – der erste Ton ist „1", der zweite „2" usw.
        </p>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
          Beim Blattspiel hilft es, Intervalle schnell zu erkennen: Liegen die Noten dicht
          beieinander oder weit auseinander? Das Auge erfasst diese Muster sofort.
        </p>

        <DiagramBox>
          <IntervalSteps />
        </DiagramBox>

        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-6">
          <strong>Zählweise:</strong> Von C bis D sind es 2 Schritte (C=1, D=2) → <strong>Sekunde</strong>.
          Von C bis E sind es 3 Schritte → <strong>Terz</strong>. Von C bis G sind es 5 Schritte → <strong>Quinte</strong>.
        </p>
      </Section>

      {/* Section 2: Kleine Intervalle */}
      <Section title="Kleine Intervalle (1-4)">
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100">Prime (1):</strong> Zwei gleiche Töne.
            Kein Abstand – beide Noten übereinander oder direkt nebeneinander.
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100">Sekunde (2):</strong> Ein Schritt.
            Die Noten liegen auf benachbarten Linien oder Zwischenräumen (z.B. C→D, E→F).
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100">Terz (3):</strong> Ein Sprung über eine Note.
            Entweder beide auf Linien oder beide in Zwischenräumen (z.B. C→E, D→F).
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100">Quarte (4):</strong> Etwas größerer Sprung.
            Vom Zwischenraum zur Linie oder umgekehrt (z.B. C→F, G→C).
          </div>
        </div>

        <MnemonicBox
          variant="blue"
          title="Intervall-Lieder"
        >
          <p>
            <strong>Sekunde</strong> = Alle meine Entchen, <strong>Terz</strong> = Kuckuck, Kuckuck,
            <strong>Quarte</strong> = Ein Männlein steht im Walde, <strong>Quinte</strong> = Morgen kommt der Weihnachtsmann,
            <strong>Oktave</strong> = Irgendwo über dem Regenbogen
          </p>
          <p className="text-sm mt-2 opacity-90">
            Diese bekannten Melodien beginnen mit den jeweiligen Intervallen – so kannst du sie dir merken!
          </p>
        </MnemonicBox>
      </Section>

      {/* Section 3: Große Intervalle */}
      <Section title="Große Intervalle (5-8)">
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100">Quinte (5):</strong> Ein großer Sprung.
            Wichtig in der Harmonielehre – der Ton „in der Mitte" zwischen zwei Oktaven (z.B. C→G).
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100">Sexte (6):</strong> Noch größerer Sprung.
            Überspringt vier Töne (z.B. C→A).
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100">Septime (7):</strong> Fast eine Oktave.
            Nur noch ein Schritt fehlt zum achten Ton (z.B. C→H).
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100">Oktave (8):</strong> Derselbe Ton, nur höher oder tiefer.
            Der Abstand von einem C zum nächsten C (z.B. C→C').
          </div>
        </div>

        <DiagramBox>
          <IntervalOverview />
        </DiagramBox>

        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-6">
          <strong>Tipp:</strong> Große Intervalle (Quinte aufwärts) sind beim Blattspiel am Notenbild
          leicht zu erkennen – sie „springen" im Notensystem deutlich nach oben oder unten.
        </p>
      </Section>

      {/* Section 4: Intervalle beim Blattspiel */}
      <Section title="Intervalle beim Blattspiel">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
          Beim Vom-Blatt-Spielen musst du Intervalle <strong>nicht genau zählen</strong>.
          Es reicht, wenn du erkennst:
        </p>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex items-start gap-3">
            <span className="text-neutral-600 text-xl">→</span>
            <div>
              <strong className="text-neutral-800 dark:text-neutral-200">Schritt:</strong>
              <span className="text-neutral-700 dark:text-neutral-300"> Noten sind direkt nebeneinander (Sekunde)</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-neutral-600 text-xl">→</span>
            <div>
              <strong className="text-neutral-800 dark:text-neutral-200">Sprung:</strong>
              <span className="text-neutral-700 dark:text-neutral-300"> Eine Note wird übersprungen (Terz, Quarte)</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-neutral-600 text-xl">→</span>
            <div>
              <strong className="text-neutral-800 dark:text-neutral-200">Großer Sprung:</strong>
              <span className="text-neutral-700 dark:text-neutral-300"> Mehrere Noten Abstand (Quinte, Sexte, Oktave)</span>
            </div>
          </div>
        </div>

        <DiagramBox>
          <IntervalReading />
        </DiagramBox>

        <MnemonicBox
          title="Blattspiel-Tipp"
          variant="green"
        >
          <p className="text-center font-semibold text-lg">
            Schritt = nah, Sprung = weit — das Auge sieht den Unterschied!
          </p>
        </MnemonicBox>

        <div className="bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-lg p-5 mt-6">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Übe-Strategie für Intervalle
          </h4>
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-neutral-700 dark:text-neutral-300 font-bold">1.</span>
              <span>Schaue dir vor dem Spielen die Melodie an: Wo sind Schritte, wo Sprünge?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-700 dark:text-neutral-300 font-bold">2.</span>
              <span>Bei großen Sprüngen: Kurz die Ziel-Note checken, dann spielen.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-700 dark:text-neutral-300 font-bold">3.</span>
              <span>Bei Schritten: Flüssig weiterspielen – die Finger „wissen" den nächsten Ton.</span>
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
