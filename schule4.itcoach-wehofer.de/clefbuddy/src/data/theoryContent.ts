/**
 * ClefBuddy - Theorie-Inhalte (Deutsch)
 *
 * Didaktische Texte fuer die Theorie-Sektion.
 * Aufbau: Intro -> Stichpunkte -> Praxis-Tipp -> Beispiel-Beschreibung
 */

export interface TheoryContent {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  bullets: string[];
  tip: string;
  exampleDescription: string;
  customContentId?: string;
}

export const theoryContents: Record<string, TheoryContent> = {
  'staff-clefs': {
    id: 'staff-clefs',
    title: 'Notenzeilen & Schluessel',
    subtitle: 'Die Grundlage der Notenschrift',
    intro: 'Musik wird auf einem Notensystem aufgeschrieben. Das sind fuenf waagerechte Linien mit vier Zwischenraeumen dazwischen. Jede Linie und jeder Zwischenraum steht fuer einen bestimmten Ton.',
    bullets: [
      'Die fuenf Linien werden von unten nach oben gezaehlt: 1., 2., 3., 4., 5. Linie',
      'Der Violinschluessel (G-Schluessel) zeigt hohe Toene an. Er wird fuer die rechte Hand am Klavier verwendet',
      'Der Bassschluessel (F-Schluessel) zeigt tiefe Toene an. Er wird fuer die linke Hand am Klavier verwendet',
      'Beide Systeme zusammen bilden das Klaviersystem (Grand Staff). Sie sind durch eine geschweifte Klammer verbunden',
      'Merkhilfe Violinschluessel-Linien: E-G-H-D-F. Merkhilfe Zwischenraeume: F-A-C-E',
      'Noten koennen auch ueber oder unter dem System liegen. Dann bekommen sie kleine Hilfslinien',
    ],
    tip: 'Praege dir zuerst nur die Linien-Toene ein. Die Zwischenraeume liegen immer genau dazwischen und sind leichter abzuleiten.',
    exampleDescription: 'Das Beispiel zeigt beide Notensysteme: oben der Violinschluessel mit den Toenen E-G-H-D-F auf den Linien, unten der Bassschluessel mit G-H-D-F-A.',
    customContentId: 'staff-clefs',
  },

  'note-values': {
    id: 'note-values',
    title: 'Notenwerte & Pausen',
    subtitle: 'Wie lange ein Ton klingt',
    intro: 'Jede Note hat nicht nur eine Tonhoehe, sondern auch eine bestimmte Laenge. Diese Laenge wird durch die Form der Note gezeigt. Pausen zeigen an, wann nichts gespielt wird — sie sind genauso wichtig wie die Toene selbst.',
    bullets: [
      'Die Ganze Note (offener Kopf ohne Hals) dauert am laengsten — sie bekommt vier Schlaege',
      'Die Halbe Note (offener Kopf mit Hals) dauert halb so lang — zwei Schlaege',
      'Die Viertel Note (gefuellter Kopf mit Hals) dauert einen Schlag. Sie ist die Grundeinheit beim Zaehlen',
      'Die Achtel Note (gefuellter Kopf mit Hals und Faehnchen) dauert einen halben Schlag. Zwei Achtel werden oft mit einem Balken verbunden',
      'Ein Punkt hinter der Note macht sie 50 Prozent laenger. Eine punktierte Halbe dauert also drei Schlaege',
      'Jeder Notenwert hat eine passende Pause mit der gleichen Laenge. Pausen bedeuten Stille und gehoeren zur Musik dazu',
    ],
    tip: 'Klopfe die Rhythmen auf dem Tisch, bevor du sie spielst. So verinnerlichst du das Gefuehl fuer Notenwerte schneller.',
    exampleDescription: 'Das Beispiel zeigt die wichtigsten Notenwerte: Ganze, Halbe, zwei Viertel, vier Achtel. Darunter die entsprechenden Pausen.',
    customContentId: 'note-values',
  },

  'accidentals': {
    id: 'accidentals',
    title: 'Vorzeichen',
    subtitle: 'Toene erhoehen und erniedrigen',
    intro: 'Vorzeichen veraendern die Tonhoehe einer Note. Sie stehen entweder direkt vor einer einzelnen Note oder ganz am Anfang der Notenzeile. Dann gelten sie fuer das ganze Stueck.',
    bullets: [
      'Das Kreuz (♯) erhoeht einen Ton um einen Halbtonschritt. Aus C wird Cis, aus F wird Fis',
      'Das Be (♭) erniedrigt einen Ton um einen Halbtonschritt. Aus H wird B, aus E wird Es',
      'Das Aufloesungszeichen (♮) hebt ein Vorzeichen auf. Der Ton wird wieder zum normalen Stammton',
      'Vorzeichen am Zeilenanfang (nach dem Schluessel) gelten fuer das ganze Stueck. Sie zeigen die Tonart an',
      'Vorzeichen direkt vor einer Note gelten nur fuer diese Note und nur innerhalb des Taktes',
      'Auf dem Klavier sind die schwarzen Tasten die erhoehten und erniedrigten Toene. Zwischen E-F und H-C gibt es keine schwarze Taste',
    ],
    tip: 'Spiele auf dem Klavier eine Tonleiter mit schwarzen Tasten. So hoerst du sofort, wie Vorzeichen die Musik veraendern.',
    exampleDescription: 'Das Beispiel zeigt drei kurze Melodien: eine ohne Vorzeichen, eine mit Kreuzen und eine mit Bes. Die letzte Zeile zeigt ein Aufloesungszeichen in Aktion.',
    customContentId: 'accidentals',
  },

  'time-signatures': {
    id: 'time-signatures',
    title: 'Takt & Taktarten',
    subtitle: 'Der rhythmische Rahmen',
    intro: 'Die Taktart steht am Anfang eines Stuecks und sieht aus wie ein Bruch mit zwei Zahlen uebereinander. Sie bestimmt, wie viele Schlaege in einen Takt passen und welcher Notenwert einen Schlag bekommt. Taktstriche teilen die Musik in gleich lange Abschnitte.',
    bullets: [
      'Die obere Zahl zeigt, wie viele Schlaege in einen Takt passen. Bei 3/4 sind es drei Schlaege',
      'Die untere Zahl zeigt, welcher Notenwert einen Schlag bekommt. Die 4 steht fuer Viertel-Noten',
      'Im 4/4-Takt passen vier Viertel-Noten in einen Takt. Das ist die haeufigste Taktart',
      'Im 3/4-Takt gibt es drei Schlaege pro Takt. Das ist typisch fuer einen Walzer mit betontem ersten Schlag',
      'Der 6/8-Takt hat sechs Achtel-Noten pro Takt. Er wird in zwei Gruppen zu je drei Achteln geteilt',
      'Der erste Schlag im Takt ist meist betont. Zaehle laut mit: EINS-zwei-drei-vier im 4/4-Takt',
    ],
    tip: 'Hoere Musik und klatsche den Grundschlag mit. Versuche zu erkennen, ob es ein 3er- oder 4er-Takt ist.',
    exampleDescription: 'Das Beispiel zeigt drei verschiedene Taktarten: 4/4 (haeufigster Takt), 3/4 (Walzer) und 6/8 (fliessende Achtel-Bewegung).',
    customContentId: 'time-signatures',
  },

  'intervals': {
    id: 'intervals',
    title: 'Intervalle',
    subtitle: 'Abstaende zwischen Toenen',
    intro: 'Ein Intervall ist der Abstand zwischen zwei Toenen. Intervalle haben Namen, die zeigen, wie weit die Toene auseinander liegen. Sie sind wichtig, um Melodien zu verstehen und vom Blatt zu spielen.',
    bullets: [
      'Die Prime bedeutet: beide Toene sind gleich. Der Abstand ist null',
      'Die Sekunde ist ein Schritt auf der Tonleiter. Von C zu D oder von E zu F',
      'Die Terz ueberspringt einen Ton. Von C zu E oder von D zu F. Sie klingt harmonisch',
      'Die Quarte umfasst vier Tonstufen. Von C zu F. Sie klingt offen und stark',
      'Die Quinte umfasst fuenf Tonstufen. Von C zu G. Sie ist sehr stabil und wird oft in Begleitungen verwendet',
      'Die Oktave ist der gleiche Ton, nur hoeher oder tiefer. Von C zu C. Sie klingt wie eine Wiederholung',
    ],
    tip: 'Singe bekannte Lieder und erkenne die Intervalle am Anfang. „Alle meine Entchen" startet mit Sekundschritten.',
    exampleDescription: 'Das Beispiel zeigt aufsteigende Intervalle von der Prime bis zur Oktave, jeweils als Melodie und als Zweiklang.',
    customContentId: 'intervals',
  },

  'triads': {
    id: 'triads',
    title: 'Dreiklaenge & Akkorde',
    subtitle: 'Mehrere Toene gleichzeitig spielen',
    intro: 'Ein Akkord entsteht, wenn du drei oder mehr Toene gleichzeitig spielst. Die wichtigsten Akkorde sind Dreiklaenge. Sie bestehen aus genau drei Toenen und bilden die Grundlage der meisten Klaviermusik.',
    bullets: [
      'Ein Dreiklang besteht aus drei Toenen: Grundton, Terz und Quinte',
      'Dur-Dreiklaenge klingen hell und froehlich (z.B. C-E-G fuer C-Dur)',
      'Moll-Dreiklaenge klingen dunkler und nachdenklicher (z.B. C-Es-G fuer C-Moll)',
      'Der Unterschied liegt im Abstand zwischen Grundton und Terz',
      'Umkehrungen entstehen, wenn du die Toene anders anordnest',
      'Mit nur drei Akkorden kannst du schon viele Lieder begleiten',
    ],
    tip: 'Spiele erst jeden Ton einzeln nacheinander, dann alle zusammen. So hoerst du besser, ob alle Finger richtig auf den Tasten liegen.',
    exampleDescription: 'Das Beispiel zeigt C-Dur (C-E-G) und C-Moll (C-Es-G) als geblockte Dreiklaenge. Hoere den Unterschied zwischen Dur und Moll.',
    customContentId: 'triads',
  },

  'arpeggios': {
    id: 'arpeggios',
    title: 'Gebrochene Akkorde',
    subtitle: 'Akkordtoene nacheinander spielen',
    intro: 'Ein Arpeggio ist ein gebrochener Akkord. Statt alle Toene gleichzeitig zu spielen, spielst du sie nacheinander. Das klingt fliessend und elegant und wird oft in Begleitungen verwendet.',
    bullets: [
      'Die Toene eines Akkords werden einzeln gespielt, nicht zusammen',
      'Die Reihenfolge kann aufwaerts, abwaerts oder gemischt sein',
      'Der Alberti-Bass ist ein beruehmtes Arpeggio-Muster: tief-hoch-mittel-hoch',
      'Arpeggios klingen weicher und bewegter als geblockte Akkorde',
      'In der linken Hand sorgen sie fuer rhythmische Begleitung',
      'In der rechten Hand koennen sie melodisch klingen',
    ],
    tip: 'Uebe Arpeggios langsam und gleichmaessig. Jeder Ton sollte gleich laut sein. Mit der Zeit wird die Bewegung fliessend.',
    exampleDescription: 'Das Beispiel zeigt den C-Dur-Akkord als Arpeggio: erst C, dann E, dann G, dann wieder E. Das ist das klassische Alberti-Bass-Muster.',
    customContentId: 'arpeggios',
  },

  'fingering': {
    id: 'fingering',
    title: 'Fingerbezeichnungen',
    subtitle: 'Welcher Finger spielt welche Taste?',
    intro: 'Am Klavier hat jeder Finger eine Nummer: Der Daumen ist Nummer 1, der Zeigefinger ist 2, und so weiter bis zum kleinen Finger mit der 5. Diese Nummern gelten fuer beide Haende.',
    bullets: [
      'Daumen = 1, Zeigefinger = 2, Mittelfinger = 3, Ringfinger = 4, kleiner Finger = 5',
      'Die Nummern sind fuer die linke und rechte Hand gleich',
      'In Noten stehen oft kleine Zahlen ueber oder unter den Noten',
      'Ein guter Fingersatz macht das Spielen leichter und fluessiger',
      'Die 5-Finger-Position ist der Ausgangspunkt: C-D-E-F-G mit den Fingern 1-2-3-4-5',
      'Spaeter lernst du Lagenwechsel, um auch weiter entfernte Tasten zu erreichen',
    ],
    tip: 'Halte dich am Anfang genau an die vorgegebenen Fingersaetze. Sie sind so gewaehlt, dass deine Hand in einer natuerlichen Position bleibt.',
    exampleDescription: 'Das Beispiel zeigt die 5-Finger-Position: C-D-E-F-G mit den Fingernummern 1-2-3-4-5 ueber den Noten.',
    customContentId: 'fingering',
  },

  'dynamics': {
    id: 'dynamics',
    title: 'Dynamik & Artikulation',
    subtitle: 'Laut, leise und wie die Toene klingen',
    intro: 'Musik wird erst lebendig, wenn sie nicht immer gleich laut ist. Dynamik bedeutet, wie laut oder leise du spielst. Artikulation beschreibt, wie du die Toene anschlaegst: kurz und getrennt oder weich verbunden.',
    bullets: [
      'p (piano) = leise, f (forte) = laut, mf (mezzoforte) = mittellaut, mp (mezzopiano) = mittelleise',
      'Crescendo bedeutet lauter werden, Decrescendo oder Diminuendo leiser werden',
      'Staccato sind kurze, abgehackte Toene (kleiner Punkt ueber der Note)',
      'Legato sind weich verbundene Toene (Bindebogen)',
      'Akzente (>) markieren besonders betonte Toene',
      'Gute Dynamik macht dein Spiel ausdrucksvoll und interessant',
    ],
    tip: 'Uebe Stuecke erst ohne Dynamik in mittlerer Lautstaerke. Wenn die Noten sicher sitzen, fuege piano und forte hinzu.',
    exampleDescription: 'Das Beispiel zeigt eine einfache Tonleiter: erst leise (piano), dann lauter werdend (crescendo) bis laut (forte).',
    customContentId: 'dynamics',
  },

  'pedals': {
    id: 'pedals',
    title: 'Die Pedale',
    subtitle: 'Klangfarbe und Nachhall steuern',
    intro: 'Die meisten Klaviere haben drei Pedale. Das rechte Pedal ist das wichtigste: Es laesst die Toene laenger nachklingen und verbindet sie weich. Die anderen beiden Pedale brauchst du erst spaeter.',
    bullets: [
      'Das rechte Pedal (Haltepedal oder Sustain-Pedal) laesst alle Toene nachklingen',
      'Du trittst es mit dem rechten Fuss, die Ferse bleibt am Boden',
      'Druecke das Pedal meist nach dem Anschlag, nicht davor',
      'Das linke Pedal (Una Corda) macht den Klang leiser und weicher',
      'Das mittlere Pedal (Sostenuto) haelt nur bestimmte Toene, wird sehr selten benutzt',
      'Zu viel Pedal klingt matschig, zu wenig klingt trocken',
    ],
    tip: 'Uebe das Pedaltreten zuerst ohne Haende: Tritt das Pedal langsam und gleichmaessig. Spaeter uebst du, es mit bestimmten Noten zu koordinieren.',
    exampleDescription: 'Spiele einen C-Dur-Akkord ohne Pedal (kurzer Klang), dann mit gedruecktem rechtem Pedal (langer Nachhall).',
    customContentId: 'pedals',
  },
};

/**
 * Liste aller Theorie-IDs in didaktischer Reihenfolge
 */
export const theoryOrder = [
  'staff-clefs',
  'note-values',
  'accidentals',
  'time-signatures',
  'intervals',
  'triads',
  'arpeggios',
  'fingering',
  'dynamics',
  'pedals',
];

export function getTheoryContent(id: string): TheoryContent | undefined {
  return theoryContents[id];
}
