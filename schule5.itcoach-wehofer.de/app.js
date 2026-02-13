/* ===== KI-Lernabenteuer - App Logic ===== */
'use strict';

/* ── Storage ── */
const Storage = {
  key: 'kiLern',
  load() {
    try {
      const d = localStorage.getItem(this.key);
      return d ? JSON.parse(d) : this.getDefault();
    } catch { return this.getDefault(); }
  },
  save(d) {
    try { d.lastVisit = new Date().toISOString(); localStorage.setItem(this.key, JSON.stringify(d)); } catch(e) { console.warn('localStorage error', e); }
  },
  getDefault() {
    return {
      progress: {
        grundlagen:    { completed: false, quizScore: 0, interactiveDone: false },
        alltag:        { completed: false, quizScore: 0, interactiveDone: false },
        kreativitaet:  { completed: false, quizScore: 0, interactiveDone: false },
        mobilitaet:    { completed: false, quizScore: 0, interactiveDone: false },
        industrie:     { completed: false, quizScore: 0, interactiveDone: false },
        ethik:         { completed: false, quizScore: 0, interactiveDone: false }
      },
      totalPoints: 0,
      badges: [],
      currentSection: 'home',
      lastVisit: new Date().toISOString(),
      finalQuizScore: 0,
      finalQuizDone: false
    };
  },
  reset() {
    if (confirm('Wirklich alle Fortschritte loeschen?')) {
      localStorage.removeItem(this.key);
      location.reload();
    }
  }
};

/* ── Sound Manager ── */
const SoundMgr = {
  enabled: true,
  ctx: null,
  getCtx() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { /* silent */ }
    }
    return this.ctx;
  },
  play(type) {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.15;
      const now = ctx.currentTime;
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(200, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
      } else if (type === 'complete') {
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.12);
        osc.frequency.setValueAtTime(784, now + 0.24);
        osc.frequency.setValueAtTime(1047, now + 0.36);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now); osc.stop(now + 0.6);
      } else if (type === 'badge') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.1);
        osc.frequency.setValueAtTime(659, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now); osc.stop(now + 0.7);
      }
    } catch(e) { /* silent fail */ }
  },
  toggle() {
    this.enabled = !this.enabled;
    const btn = document.getElementById('sound-toggle');
    if (btn) btn.classList.toggle('muted', !this.enabled);
    const icon = document.getElementById('sound-icon');
    if (icon) icon.textContent = this.enabled ? '🔊' : '🔇';
  }
};

/* ── Quiz Data ── */
const QUIZ_DATA = {
  grundlagen: [
    {
      q: 'Was bedeutet "Kuenstliche Intelligenz" am ehesten?',
      opts: [
        'Ein Computer, der so schlau ist wie ein Mensch',
        'Ein Programm, das aus Daten lernt und Muster erkennt',
        'Ein Roboter, der Gefuehle hat',
        'Ein sehr schneller Taschenrechner'
      ],
      correct: 1,
      feedback: {
        correct: 'Genau! KI lernt aus Beispielen und erkennt Muster \u2013 genau wie du beim Lernen, nur mit Daten statt mit Erfahrungen.',
        wrong: [
          'Nope \u2013 KI ist nicht "schlau" wie ein Mensch. Sie kann keine Gefuehle haben oder etwas wirklich verstehen. Die richtige Antwort ist B.',
          null,
          'Das waere Science-Fiction! KI hat keine Gefuehle. Richtig ist B.',
          'Ein Taschenrechner ist kein KI-System. KI lernt selbst aus Daten. Richtig ist B.'
        ]
      }
    },
    {
      q: 'Wie lernt eine KI?',
      opts: [
        'Ein Mensch erklaert ihr alles Schritt fuer Schritt',
        'Sie analysiert viele Beispiele und findet selbst Muster',
        'Sie googelt alles, was sie wissen muss',
        'Sie kopiert einfach andere Programme'
      ],
      correct: 1,
      feedback: {
        correct: 'Bingo! KI bekommt viele Beispiele und findet selbst heraus, was gemeinsam ist. Das nennt man "Training".',
        wrong: ['KI lernt nicht durch Erklaerungen, sondern durch Beispiele. Richtig ist B.', null, 'KI lernt durch Beispiele, nicht durchs Googeln. Richtig ist B.', 'KI kopiert nicht \u2013 sie findet eigene Muster. Richtig ist B.']
      }
    },
    {
      q: 'Was kann eine KI NICHT?',
      opts: [
        'Gesichter auf Fotos erkennen',
        'Schach besser spielen als Menschen',
        'Echte Gefuehle empfinden',
        'Sprache uebersetzen'
      ],
      correct: 2,
      feedback: {
        correct: 'Exakt! KI kann krasse Sachen, aber Gefuehle hat sie nicht. Sie versteht nicht, warum jemand gluecklich ist.',
        wrong: ['Das kann KI tatsaechlich! Aber echte Gefuehle? Nein. Richtig ist C.', 'Das kann KI! Aber Gefuehle hat sie nicht. Richtig ist C.', null, 'Uebersetzen kann KI gut! Aber Gefuehle fehlen ihr. Richtig ist C.']
      }
    },
    {
      q: 'Welches Beispiel ist KEINE KI?',
      opts: [
        'Netflix schlaegt dir eine Serie vor',
        'Dein Handy erkennt dein Gesicht',
        'Ein Taschenrechner rechnet 234 + 567 aus',
        'Alexa versteht deine Frage und antwortet'
      ],
      correct: 2,
      feedback: {
        correct: 'Richtig! Ein Taschenrechner fuehrt nur Befehle aus. Er lernt nicht und erkennt keine Muster.',
        wrong: ['Das ist KI! Ein Taschenrechner dagegen nicht. Richtig ist C.', 'Das ist KI! Ein Taschenrechner dagegen nicht. Richtig ist C.', null, 'Alexa ist KI! Ein Taschenrechner dagegen nicht. Richtig ist C.']
      }
    },
    {
      q: 'Warum nennt man KI manchmal "schwach" und manchmal "stark"?',
      opts: [
        'Schwache KI kann eine Sache gut, starke KI koennte alles wie ein Mensch',
        'Schwache KI macht viele Fehler, starke KI nicht',
        'Schwache KI ist langsam, starke KI ist schnell',
        'Das sind nur Marketing-Begriffe ohne Bedeutung'
      ],
      correct: 0,
      feedback: {
        correct: 'Perfekt! Schwache KI = spezialisiert auf eine Aufgabe. Starke KI = koennte alles wie ein Mensch \u2013 gibt es aber noch nicht!',
        wrong: [null, '"Schwach" und "stark" hat nichts mit Fehlern zu tun. Richtig ist A.', 'Geschwindigkeit ist nicht gemeint. Richtig ist A.', 'Die Begriffe haben eine echte Bedeutung! Richtig ist A.']
      }
    }
  ],
  alltag: [
    {
      q: 'Warum zeigt dir TikTok Videos, die genau dein Ding sind?',
      opts: [
        'TikTok fragt deine Freunde, was du magst',
        'Eine KI analysiert, welche Videos du lange anschaust',
        'Du hast beim Erstellen des Accounts angegeben, was du magst',
        'Reiner Zufall'
      ],
      correct: 1,
      feedback: {
        correct: 'Genau! TikTok trackt jede Sekunde: Wie lange schaust du ein Video? Likest du es? Daraus lernt die KI.',
        wrong: ['TikTok beobachtet dich selbst \u2013 aus Daten lernt die KI. Richtig ist B.', null, 'Account-Angaben helfen, aber die KI trackt viel mehr. Richtig ist B.', 'Kein Zufall! Die KI kennt dich. Richtig ist B.']
      }
    },
    {
      q: 'Was macht die Autokorrektur auf deinem Handy?',
      opts: [
        'Sie erraet, welches Wort du meinst, basierend auf Mustern',
        'Sie fragt Google, was das richtige Wort ist',
        'Sie hat eine Liste mit allen Tippfehlern der Welt',
        'Sie korrigiert nichts, das bildest du dir nur ein'
      ],
      correct: 0,
      feedback: {
        correct: 'Korrekt! Autokorrektur nutzt KI, um Muster zu erkennen. Manchmal liegt sie aber auch daneben!',
        wrong: [null, 'Sie nutzt KI, um lokal Muster zu erkennen. Richtig ist A.', 'Keine fertige Liste \u2013 sie lernt aus Mustern. Richtig ist A.', 'Doch, sie korrigiert wirklich! Mit KI. Richtig ist A.']
      }
    },
    {
      q: 'Wie weiss Spotify, welche Songs dir gefallen?',
      opts: [
        'Spotify hoert mit, wenn du singst',
        'Eine KI analysiert, welche Songs du oft hoerst, skippst oder likest',
        'Deine Freunde sagen Spotify, was du magst',
        'Spotify zeigt allen die gleichen Empfehlungen'
      ],
      correct: 1,
      feedback: {
        correct: 'Richtig! Spotify trackt alles: Welche Songs hoerst du zu Ende? Welche skippst du? Daraus lernt die KI.',
        wrong: ['Spotify analysiert dein Hoerverhalten selbst. Richtig ist B.', null, 'Deine Freunde sind nicht der Grund. Richtig ist B.', 'Jeder bekommt andere Empfehlungen! Richtig ist B.']
      }
    },
    {
      q: 'Was ist KEINE KI-Funktion in deinem Alltag?',
      opts: [
        'Google sucht automatisch nach verwandten Begriffen',
        'Dein Handy entsperrt sich per Gesichtserkennung',
        'Dein Wecker klingelt um 7:00 Uhr',
        'Instagram schlaegt dir Accounts vor'
      ],
      correct: 2,
      feedback: {
        correct: 'Richtig! Ein Wecker ist einfach nur ein Timer. Kein Lernen, keine Muster, keine KI.',
        wrong: ['Das ist KI! Ein Wecker dagegen nicht. Richtig ist C.', 'Das ist KI! Ein Wecker dagegen nicht. Richtig ist C.', null, 'Das ist KI! Ein Wecker dagegen nicht. Richtig ist C.']
      }
    },
    {
      q: 'Warum ist es praktisch, aber auch ein bisschen creepy, dass KI dich analysiert?',
      opts: [
        'Praktisch: bessere Empfehlungen. Creepy: Jemand weiss viel ueber dich.',
        'Es ist nur praktisch, kein Grund zur Sorge',
        'Es ist nur creepy, hat aber keine Vorteile',
        'KI analysiert dich gar nicht'
      ],
      correct: 0,
      feedback: {
        correct: 'Genau! KI macht dein Leben einfacher \u2013 aber sie sammelt dafuer auch Daten ueber dich.',
        wrong: [null, 'KI sammelt viele Daten \u2013 das kann sich komisch anfuehlen. Richtig ist A.', 'KI ist auch praktisch! Richtig ist A.', 'Doch, KI analysiert dich staendig. Richtig ist A.']
      }
    }
  ],
  kreativitaet: [
    {
      q: 'Was kann eine KI in Sachen Kunst wirklich?',
      opts: [
        'Bilder erstellen, die aussehen wie von einem Menschen gemalt',
        'Echte Gefuehle in ihre Kunst stecken',
        'Nur kopieren, nie etwas Neues erschaffen',
        'Keine Kunst machen, das geht nur mit Haenden'
      ],
      correct: 0,
      feedback: {
        correct: 'Richtig! KI kann Bilder erzeugen, die taeuschend echt aussehen. Aber sie "fuehlt" nichts dabei.',
        wrong: [null, 'KI hat keine Gefuehle \u2013 sie kombiniert nur Muster. Richtig ist A.', 'KI kann durchaus neue Kombinationen erstellen. Richtig ist A.', 'KI kann tatsaechlich Bilder digital erzeugen. Richtig ist A.']
      }
    },
    {
      q: 'Wie erstellt eine KI ein Bild?',
      opts: [
        'Sie malt mit einem Roboterarm auf eine Leinwand',
        'Sie analysiert Millionen Bilder und lernt Muster, die sie neu kombiniert',
        'Sie kopiert einfach ein bestehendes Bild',
        'Ein Mensch malt es und die KI nimmt den Credit'
      ],
      correct: 1,
      feedback: {
        correct: 'Genau! KI-Bildgeneratoren wie DALL-E wurden mit Millionen Bildern trainiert und kombinieren Muster neu.',
        wrong: ['KI erstellt Bilder digital, nicht mit Pinsel. Richtig ist B.', null, 'KI kopiert nicht 1:1, sie kombiniert Gelerntes neu. Richtig ist B.', 'Die KI macht die Arbeit selbst! Richtig ist B.']
      }
    },
    {
      q: 'Was ist ein Problem von KI-Kunst?',
      opts: [
        'Sie sieht immer schlecht aus',
        'Sie kostet zu viel Geld',
        'Sie kann keine echten Emotionen ausdruecken',
        'Sie ist illegal'
      ],
      correct: 2,
      feedback: {
        correct: 'Richtig! KI kann technisch perfekte Bilder erstellen \u2013 aber sie versteht nicht, was sie malt.',
        wrong: ['KI-Kunst sieht oft beeindruckend aus! Richtig ist C.', 'Kosten sind nicht das Hauptproblem. Richtig ist C.', null, 'KI-Kunst ist nicht pauschal illegal. Richtig ist C.']
      }
    },
    {
      q: 'Darf man ein von KI erstelltes Bild einfach verwenden?',
      opts: [
        'Ja, immer \u2013 KI-Bilder haben kein Urheberrecht',
        'Nein, nie \u2013 sie gehoeren der KI',
        'Es kommt drauf an \u2013 die Rechtslage ist noch unklar',
        'Nur wenn man die KI bezahlt'
      ],
      correct: 2,
      feedback: {
        correct: 'Das ist tatsaechlich kompliziert! In vielen Laendern ist die Rechtslage unklar. Ein heisses Thema!',
        wrong: ['So einfach ist es leider nicht. Richtig ist C.', 'KI kann kein Urheberrecht besitzen. Richtig ist C.', null, 'So funktioniert das nicht. Richtig ist C.']
      }
    },
    {
      q: 'Warum ist KI-Kunst manchmal umstritten?',
      opts: [
        'Weil sie oft besser aussieht als menschliche Kunst',
        'Weil Kuenstler Angst haben, ihre Jobs zu verlieren',
        'Weil sie zu teuer ist',
        'Weil sie nicht in Museen ausgestellt werden darf'
      ],
      correct: 1,
      feedback: {
        correct: 'Genau! Viele Illustratoren fragen sich: Warum soll jemand mich bezahlen, wenn eine KI es in 10 Sekunden kann?',
        wrong: ['Das ist nicht der Hauptgrund. Richtig ist B.', null, 'Kosten sind nicht das Problem. Richtig ist B.', 'KI-Kunst darf durchaus ausgestellt werden. Richtig ist B.']
      }
    }
  ],
  mobilitaet: [
    {
      q: 'Wie "sieht" ein selbstfahrendes Auto die Strasse?',
      opts: [
        'Mit normalen Kameras, wie ein Mensch',
        'Mit Kameras, Radar, Lidar und GPS zusammen',
        'Es raet einfach, wo die Strasse ist',
        'Es folgt Kabeln im Boden'
      ],
      correct: 1,
      feedback: {
        correct: 'Perfekt! Kameras sehen, Radar misst Entfernungen, Lidar erstellt 3D-Karten, GPS weiss wo das Auto ist.',
        wrong: ['Kameras allein reichen nicht \u2013 es braucht auch Radar, Lidar und GPS. Richtig ist B.', null, 'Raten waere gefaehrlich! Richtig ist B.', 'Das war frueher bei Strassenbahnen so. Richtig ist B.']
      }
    },
    {
      q: 'Wie viele Stufen des autonomen Fahrens gibt es?',
      opts: [
        '3 (ein bisschen, mittel, voll)',
        '5 (von Level 0 bis Level 5)',
        '10 (von Anfaenger bis Profi)',
        'Nur "autonom" oder "nicht autonom"'
      ],
      correct: 1,
      feedback: {
        correct: 'Richtig! Level 0 = kein Autopilot, Level 5 = Auto faehrt ueberall ohne Mensch. Meistens Level 2-3 heute.',
        wrong: ['Es gibt 5 offizielle Stufen. Richtig ist B.', null, 'Nicht 10, sondern 5 Stufen. Richtig ist B.', 'Es gibt feinere Abstufungen. Richtig ist B.']
      }
    },
    {
      q: 'Was ist das groesste Problem von selbstfahrenden Autos?',
      opts: [
        'Sie sind zu langsam',
        'Sie muessen in unvorhersehbaren Situationen Entscheidungen treffen',
        'Sie verbrauchen zu viel Benzin',
        'Sie sehen nicht gut aus'
      ],
      correct: 1,
      feedback: {
        correct: 'Genau! Was wenn ploetzlich ein Ball auf die Strasse rollt? Die KI muss in Millisekunden entscheiden.',
        wrong: ['Geschwindigkeit ist nicht das Problem. Richtig ist B.', null, 'Verbrauch ist nicht das Hauptproblem. Richtig ist B.', 'Das Design ist nebensaechlich. Richtig ist B.']
      }
    },
    {
      q: 'Wer ist schuld, wenn ein selbstfahrendes Auto einen Unfall baut?',
      opts: [
        'Der Mensch im Auto',
        'Die Firma, die das Auto gebaut hat',
        'Das ist rechtlich noch unklar',
        'Die KI selbst \u2013 sie wird "bestraft"'
      ],
      correct: 2,
      feedback: {
        correct: 'Aktuell noch unklar! Hersteller? Mensch? Die Rechtslage wird noch verhandelt.',
        wrong: ['So einfach ist es leider nicht. Richtig ist C.', 'Teilweise, aber nicht immer. Richtig ist C.', null, 'KIs koennen nicht bestraft werden! Richtig ist C.']
      }
    },
    {
      q: 'Warum koennten selbstfahrende Autos die Welt besser machen?',
      opts: [
        'Weniger Unfaelle, weil KI nicht muede oder abgelenkt wird',
        'Sie fahren schneller als Menschen',
        'Sie brauchen keinen Sprit',
        'Sie machen keine Fehler'
      ],
      correct: 0,
      feedback: {
        correct: 'Richtig! Menschen bauen Unfaelle wegen Muedigkeit oder Ablenkung. KI hat diese Probleme nicht.',
        wrong: [null, 'Schnelligkeit ist nicht der Hauptvorteil. Richtig ist A.', 'Manche brauchen trotzdem Energie. Richtig ist A.', 'Auch KI kann Fehler machen! Richtig ist A.']
      }
    }
  ],
  industrie: [
    {
      q: 'Was ist ein grosser Vorteil von Robotern in Fabriken?',
      opts: [
        'Sie sind billiger als Menschen und arbeiten 24/7',
        'Sie sind netter als Menschen',
        'Sie brauchen weniger Platz',
        'Sie machen die Produkte teurer'
      ],
      correct: 0,
      feedback: {
        correct: 'Genau! Roboter brauchen keine Pause, keinen Urlaub, kein Gehalt. Rund um die Uhr arbeiten!',
        wrong: [null, 'Nettigkeit ist kein Faktor. Richtig ist A.', 'Platz ist nicht der Hauptvorteil. Richtig ist A.', 'Roboter machen Produkte eher billiger. Richtig ist A.']
      }
    },
    {
      q: 'Was ist ein Nachteil von Robotern in der Arbeitswelt?',
      opts: [
        'Sie sind zu langsam',
        'Menschen verlieren ihre Jobs',
        'Sie sind zu teuer fuer Firmen',
        'Sie machen zu viele Fehler'
      ],
      correct: 1,
      feedback: {
        correct: 'Richtig! Wenn ein Roboter deinen Job machen kann, braucht die Firma dich vielleicht nicht mehr.',
        wrong: ['Roboter sind oft schneller als Menschen! Richtig ist B.', null, 'Langfristig sparen Firmen mit Robotern. Richtig ist B.', 'Roboter machen meist weniger Fehler. Richtig ist B.']
      }
    },
    {
      q: 'Was bedeutet "Industrie 4.0"?',
      opts: [
        'Die vierte Version einer Fabrik-Software',
        'Die vierte industrielle Revolution mit KI und Robotern',
        'Eine neue Fabrik in der 4. Strasse',
        'Ein Videospiel ueber Fabriken'
      ],
      correct: 1,
      feedback: {
        correct: 'Perfekt! Industrie 4.0 = digitale Transformation: KI, Roboter, vernetzte Maschinen.',
        wrong: ['Keine Software-Version, sondern eine Revolution! Richtig ist B.', null, 'Das waere lustig, stimmt aber nicht. Richtig ist B.', 'Kein Videospiel! Richtig ist B.']
      }
    },
    {
      q: 'Welche Jobs koennten durch KI und Roboter verschwinden?',
      opts: [
        'Kassierer, Fliessband-Arbeiter, LKW-Fahrer',
        'Aerzte, Lehrer, Kuenstler',
        'Alle Jobs',
        'Keine Jobs, das ist Panikmache'
      ],
      correct: 0,
      feedback: {
        correct: 'Richtig! Repetitive, regelbasierte Jobs sind am staerksten gefaehrdet.',
        wrong: [null, 'Kreative und soziale Jobs sind (noch) sicherer. Richtig ist A.', 'Nicht alle, aber viele repetitive Jobs. Richtig ist A.', 'Es verschwinden tatsaechlich schon Jobs. Richtig ist A.']
      }
    },
    {
      q: 'Entstehen durch KI auch neue Jobs?',
      opts: [
        'Nein, nur alte Jobs verschwinden',
        'Ja, z.B. KI-Entwickler, Roboter-Wartungstechniker, Datenanalysten',
        'Ja, aber nur fuer Genies',
        'Das weiss niemand'
      ],
      correct: 1,
      feedback: {
        correct: 'Genau! Es braucht Leute, die Roboter bauen, programmieren und reparieren.',
        wrong: ['Doch, es entstehen neue Jobs! Richtig ist B.', null, 'Nicht nur fuer Genies \u2013 viele koennen umschulen. Richtig ist B.', 'Wir wissen es durchaus! Richtig ist B.']
      }
    }
  ],
  ethik: [
    {
      q: 'Was ist ein "Deepfake"?',
      opts: [
        'Ein Video oder Bild, das mit KI gefaelscht wurde',
        'Ein besonders tiefgruendiger Fakt',
        'Ein Fehler in einer KI',
        'Ein Film ueber KI'
      ],
      correct: 0,
      feedback: {
        correct: 'Genau! Deepfakes sind Videos oder Bilder, die so echt aussehen, dass man den Unterschied nicht erkennt.',
        wrong: [null, 'Nein \u2013 Deepfakes sind KI-generierte Faelschungen. Richtig ist A.', 'Das ist kein Fehler-Begriff. Richtig ist A.', 'Kein Film, sondern eine Technologie. Richtig ist A.']
      }
    },
    {
      q: 'Warum kann KI manchmal rassistisch oder sexistisch sein?',
      opts: [
        'Weil die Programmierer das wollten',
        'Weil sie mit unfairen Daten trainiert wurde',
        'Weil KI von Natur aus boese ist',
        'KI kann nicht rassistisch sein'
      ],
      correct: 1,
      feedback: {
        correct: 'Richtig! KI lernt aus Daten. Wenn die Daten unfair sind, wird die KI auch unfair. Das nennt man "Bias".',
        wrong: ['Meistens ist es nicht Absicht, sondern schlechte Daten. Richtig ist B.', null, 'KI ist nicht boese \u2013 aber ihre Daten koennen unfair sein. Richtig ist B.', 'Doch, indirekt schon \u2013 durch unfaire Daten. Richtig ist B.']
      }
    },
    {
      q: 'Was ist das "Social Credit System"?',
      opts: [
        'Ein System, bei dem dein Verhalten ueberwacht und bewertet wird',
        'Ein System fuer gute Noten',
        'Ein Social-Media-Punktesystem',
        'Ein Kreditkarten-System'
      ],
      correct: 0,
      feedback: {
        correct: 'Richtig! In China ueberwacht ein System dein Verhalten. Hohe Punktzahl = Vorteile, niedrige = Einschraenkungen.',
        wrong: [null, 'Es geht nicht um Noten, sondern um Verhalten im Alltag. Richtig ist A.', 'Es hat mit Social Media nichts zu tun. Richtig ist A.', 'Kein Kreditkarten-System! Richtig ist A.']
      }
    },
    {
      q: 'Was ist das groesste ethische Problem von KI?',
      opts: [
        'Sie ist zu langsam',
        'Sie kann missbraucht werden (Ueberwachung, Manipulation, Diskriminierung)',
        'Sie ist zu teuer',
        'Sie sieht nicht gut aus'
      ],
      correct: 1,
      feedback: {
        correct: 'Genau! KI ist ein Werkzeug \u2013 und wie jedes Werkzeug kann man es fuer Gutes oder Schlechtes nutzen.',
        wrong: ['Geschwindigkeit ist nicht das Problem. Richtig ist B.', null, 'Kosten sind nicht das ethische Hauptproblem. Richtig ist B.', 'Aussehen ist nebensaechlich. Richtig ist B.']
      }
    },
    {
      q: 'Wer sollte entscheiden, wie KI eingesetzt wird?',
      opts: [
        'Nur Tech-Firmen',
        'Nur die Regierung',
        'Die Gesellschaft als Ganzes \u2013 durch Gesetze, Diskussionen, Regeln',
        'Niemand \u2013 KI sollte frei sein'
      ],
      correct: 2,
      feedback: {
        correct: 'Richtig! KI betrifft uns alle. Deshalb sollten wir alle mitreden.',
        wrong: ['Nicht nur Firmen, alle! Richtig ist C.', 'Nicht nur die Regierung, alle! Richtig ist C.', null, 'Ohne Regeln waere es gefaehrlich. Richtig ist C.']
      }
    }
  ]
};

const FINAL_QUIZ_DATA = [
  {
    q: 'Eine KI wird mit tausenden Bewerbungen trainiert, in denen fast nur Maenner eingestellt wurden. Was passiert, wenn diese KI jetzt neue Bewerber beurteilt?',
    opts: ['Sie wird fair entscheiden, weil KI neutral ist', 'Sie wird Frauen benachteiligen, weil ihre Trainingsdaten unfair waren', 'Sie wird nur Frauen einstellen, um den Fehler auszugleichen', 'Sie wird gar nicht funktionieren'],
    correct: 1,
    feedback: {
      correct: 'Genau! Das ist "Bias" in Aktion: Wenn die Trainingsdaten unfair sind, wird auch die KI unfair. Das ist ein riesiges ethisches Problem.',
      wrong: ['KI ist nicht automatisch neutral \u2013 sie lernt aus Daten, und die koennen unfair sein. Richtig ist B.', null, 'KI gleicht nicht automatisch aus \u2013 sie kopiert Muster aus den Daten. Richtig ist B.', 'Die KI funktioniert schon, aber eben falsch. Richtig ist B.']
    }
  },
  {
    q: 'Dein Handy hat einen Beschleunigungssensor, einen GPS-Sensor und eine Kamera. Selbstfahrende Autos haben Lidar, Radar und Kameras. Was haben beide gemeinsam?',
    opts: ['Beide nutzen Sensoren, deren Daten von KI ausgewertet werden', 'Beide fahren autonom', 'Beide haben die gleichen Sensoren', 'Beide brauchen Internet, um zu funktionieren'],
    correct: 0,
    feedback: {
      correct: 'Richtig! Ob Handy oder Auto \u2013 KI braucht Sensordaten als Input, um smarte Entscheidungen zu treffen. Das Prinzip ist gleich, nur die Sensoren sind anders.',
      wrong: [null, 'Dein Handy faehrt nicht autonom! Aber beide nutzen Sensoren + KI. Richtig ist A.', 'Die Sensoren sind unterschiedlich, aber das Prinzip (Daten sammeln + KI) ist gleich. Richtig ist A.', 'Vieles funktioniert auch offline. Richtig ist A.']
    }
  },
  {
    q: 'Ein KI-Roboter in einer Autofabrik und ein KI-Bildgenerator wie Midjourney \u2013 was haben sie gemeinsam?',
    opts: ['Beide sind "starke KI", die alles koennen', 'Beide sind "schwache KI", die jeweils nur eine Aufgabe beherrschen', 'Beide ersetzen komplett die Arbeit von Menschen', 'Beide funktionieren ohne Training'],
    correct: 1,
    feedback: {
      correct: 'Genau! Der Schweisskopf-Roboter kann nur schweissen, Midjourney kann nur Bilder machen. Beides ist schwache KI \u2013 Spezialisten fuer eine Sache. Starke KI, die alles kann, gibt es noch nicht.',
      wrong: ['Starke KI gibt es noch gar nicht! Beide sind Spezialisten. Richtig ist B.', null, 'Sie unterstuetzen Menschen, ersetzen sie aber nicht komplett. Richtig ist B.', 'Jede KI braucht Training mit Daten! Richtig ist B.']
    }
  },
  {
    q: 'Warum zeigt dir TikTok immer mehr Videos zum gleichen Thema, wenn du eines davon laenger anschaust?',
    opts: ['Zufall \u2013 TikTok zeigt allen die gleichen Videos', 'Der Algorithmus merkt sich dein Verhalten und empfiehlt aehnliche Inhalte', 'Deine Freunde haben die Videos fuer dich ausgewaehlt', 'TikTok liest deine Gedanken'],
    correct: 1,
    feedback: {
      correct: 'Richtig! Der TikTok-Algorithmus ist eine KI, die aus deinem Verhalten lernt: Watchtime, Likes, Shares \u2013 alles wird analysiert, um deinen Feed zu personalisieren.',
      wrong: ['Definitiv kein Zufall! Jeder Feed ist individuell. Richtig ist B.', null, 'Nein, das macht ein Algorithmus automatisch. Richtig ist B.', 'Gedankenlesen kann KI (noch) nicht \u2013 aber dein Scroll-Verhalten auswerten! Richtig ist B.']
    }
  },
  {
    q: 'Stell dir vor, du siehst nur noch TikToks und YouTube-Videos, die deine Meinung bestaetigen. Wie nennt man dieses Problem?',
    opts: ['Social Credit', 'Filterblase', 'Deepfake', 'Industrie 4.0'],
    correct: 1,
    feedback: {
      correct: 'Genau! Wenn KI-Algorithmen dir nur noch zeigen, was du eh schon magst, entsteht eine "Filterblase". Du bekommst keine anderen Meinungen mehr mit \u2013 das ist gefaehrlich fuer die Demokratie.',
      wrong: ['Social Credit ist ein Ueberwachungssystem. Das gesuchte Problem heisst Filterblase. Richtig ist B.', null, 'Deepfakes sind gefaelschte Videos. Hier geht es um einseitige Empfehlungen. Richtig ist B.', 'Industrie 4.0 ist die digitale Revolution in Fabriken. Richtig ist B.']
    }
  },
  {
    q: 'Ein selbstfahrendes Auto muss entscheiden: Geradeaus fahren und einen Fussgaenger gefaehrden, oder ausweichen und die Insassen gefaehrden. Wer sollte diese Entscheidung programmieren?',
    opts: ['Nur die Autofirma allein', 'Nur die KI selbst \u2013 sie ist schlauer als Menschen', 'Die Gesellschaft gemeinsam \u2013 durch Gesetze und Diskussionen', 'Niemand \u2013 solche Autos sollte es nicht geben'],
    correct: 2,
    feedback: {
      correct: 'Richtig! Das ist das beruehmt-beruechtigte "Trolley-Problem". Solche ethischen Fragen betreffen alle \u2013 deshalb muss die Gesellschaft gemeinsam Regeln festlegen, nicht nur eine Firma.',
      wrong: ['Ethische Entscheidungen duerfen nicht nur von einer Firma getroffen werden. Richtig ist C.', 'KI hat kein moralisches Urteil \u2013 sie braucht Regeln von Menschen. Richtig ist C.', null, 'Die Technik existiert bereits. Wir muessen Regeln dafuer finden. Richtig ist C.']
    }
  },
  {
    q: 'In einer Fabrik ersetzt ein KI-System 50 Fliessband-Arbeiter. Gleichzeitig werden 10 neue Stellen fuer KI-Wartung und Datenanalyse geschaffen. Was ist daran problematisch?',
    opts: ['Gar nichts \u2013 es entstehen ja neue Jobs', 'Die neuen Jobs brauchen andere Qualifikationen \u2013 nicht jeder Fliessband-Arbeiter kann Datenanalyst werden', 'Die Roboter werden bald auch die neuen Jobs uebernehmen', 'Es werden immer mehr neue Jobs als alte entstehen'],
    correct: 1,
    feedback: {
      correct: 'Genau! Das grosse Problem: Repetitive Jobs verschwinden, dafuer braucht man IT-Spezialisten. Aber nicht jeder kann sich einfach umschulen. Das ist eine riesige gesellschaftliche Herausforderung.',
      wrong: ['Es entstehen deutlich weniger neue Jobs, und die brauchen andere Skills. Richtig ist B.', null, 'Kreative und technische Jobs sind (noch) sicher. Richtig ist B.', 'Meistens verschwinden mehr alte Jobs als neue entstehen. Richtig ist B.']
    }
  },
  {
    q: 'Jemand erstellt mit KI ein Deepfake-Video eines Politikers, der etwas sagt, das er nie gesagt hat. Welche Bereiche sind hier betroffen?',
    opts: ['Nur Ethik \u2013 es ist halt ein Fake', 'Kreativitaet und Ethik \u2013 die KI-Technologie wird missbraucht', 'Nur Technologie \u2013 es ist ja nur ein Video', 'Nur Politik \u2013 hat mit KI nichts zu tun'],
    correct: 1,
    feedback: {
      correct: 'Genau! Die gleiche KI-Technologie, die coole Kunst und Videos erstellt, kann auch fuer Manipulation missbraucht werden. Kreativitaet und Ethik haengen hier eng zusammen.',
      wrong: ['Es geht auch um die kreative Technologie dahinter \u2013 die gleiche KI macht Kunst UND Fakes. Richtig ist B.', null, 'Es ist viel mehr als "nur ein Video" \u2013 es kann Wahlen beeinflussen. Richtig ist B.', 'Deepfakes sind ein direktes Produkt von KI-Technologie. Richtig ist B.']
    }
  },
  {
    q: 'Wie koennte unsere Welt in 20 Jahren aussehen, wenn sich KI so weiterentwickelt wie bisher?',
    opts: ['KI uebernimmt die Weltherrschaft wie in Science-Fiction-Filmen', 'Roboter erledigen viele repetitive Jobs, Menschen arbeiten mehr kreativ und sozial, aber wir brauchen strenge Regeln fuer KI', 'Alles bleibt wie heute \u2013 KI ist nur ein Hype', 'KI wird abgeschaltet, weil sie zu gefaehrlich ist'],
    correct: 1,
    feedback: {
      correct: 'Richtig! Die wahrscheinlichste Zukunft: KI uebernimmt monotone Arbeit, Menschen konzentrieren sich auf Kreativitaet, Empathie und Zusammenarbeit. Aber dafuer brauchen wir faire Regeln \u2013 und Leute wie dich, die verstehen, wie KI funktioniert!',
      wrong: ['Das ist Science-Fiction, nicht Realitaet. KI ist ein Werkzeug, kein boeses Wesen. Richtig ist B.', null, 'KI veraendert schon jetzt massiv unsere Welt \u2013 das ist kein Hype. Richtig ist B.', 'Dafuer ist KI zu nuetzlich. Wir brauchen Regeln, kein Abschalten. Richtig ist B.']
    }
  },
  {
    q: 'Netflix empfiehlt dir Filme, Spotify empfiehlt dir Songs, Amazon empfiehlt dir Produkte, und in Fabriken optimiert KI die Produktion. Was ist das gemeinsame Grundprinzip?',
    opts: ['Alle nutzen starke KI, die wie ein Mensch denkt', 'Alle nutzen schwache KI, die aus Daten Muster erkennt und Vorhersagen trifft', 'Alle nutzen die gleiche Software', 'Alle wurden von der gleichen Firma entwickelt'],
    correct: 1,
    feedback: {
      correct: 'Genau! Ob Entertainment, Shopping oder Industrie \u2013 das Prinzip ist immer gleich: KI analysiert riesige Datenmengen, erkennt Muster und trifft daraus Vorhersagen. Dieses Grundprinzip zieht sich durch ALLE Bereiche.',
      wrong: ['Starke KI gibt es noch nicht! All diese Systeme sind spezialisierte schwache KI. Richtig ist B.', null, 'Jede Firma baut ihre eigene KI, aber das Grundprinzip ist gleich. Richtig ist B.', 'Netflix, Spotify und Amazon sind verschiedene Firmen. Richtig ist B.']
    }
  }
];

/* ── Interactive Game Data ── */

/* Bereich 1: Drag & Drop items */
const DRAG_DROP_ITEMS = [
  { id: 'dd1', text: 'Taschenrechner', answer: 'no-ki', feedback: 'Ein Taschenrechner fuehrt nur feste Rechenregeln aus \u2013 kein Lernen, keine Muster.' },
  { id: 'dd2', text: 'Spotify-Empfehlungen', answer: 'ki', feedback: 'Spotify analysiert dein Hoerverhalten und lernt deinen Geschmack \u2013 das ist KI!' },
  { id: 'dd3', text: 'Programmierbarer Staubsauger', answer: 'no-ki', feedback: 'Ein normaler Saugroboter folgt nur einem Programm \u2013 keine KI.' },
  { id: 'dd4', text: 'Staubsauger mit Hinderniserkennung', answer: 'ki', feedback: 'Er erkennt Hindernisse und lernt deine Wohnung kennen \u2013 KI!' },
  { id: 'dd5', text: 'Excel-Formel', answer: 'no-ki', feedback: 'Eine Formel rechnet nur nach festen Regeln \u2013 keine KI.' },
  { id: 'dd6', text: 'ChatGPT', answer: 'ki', feedback: 'ChatGPT versteht Sprache und generiert Text \u2013 KI pur!' },
  { id: 'dd7', text: 'Klassischer Thermostat', answer: 'no-ki', feedback: 'Er schaltet bei fester Temperatur \u2013 kein Lernen, keine KI.' },
  { id: 'dd8', text: 'Smartes Thermostat (lernt Gewohnheiten)', answer: 'ki', feedback: 'Es lernt, wann du es warm haben willst \u2013 das ist KI!' },
  { id: 'dd9', text: 'Ampel mit festem Timer', answer: 'no-ki', feedback: 'Fester Timer = festes Programm, keine KI.' },
  { id: 'dd10', text: 'Ampel, die Verkehr analysiert', answer: 'ki', feedback: 'Sie analysiert Verkehr und passt sich an \u2013 KI!' }
];

/* Bereich 2: Smartphone apps */
const APP_DATA = [
  { key: 'tiktok', name: 'TikTok', emoji: '🎵', color: '#ff0050', level: 3, text: 'TikTok ist KI-Power pur! Der "For You"-Algorithmus analysiert jedes Video, das du ansiehst \u2013 nicht nur ob du likest, sondern auch wie lange du schaust. Scrollst du nach 2 Sekunden weiter? "Nicht ihr Ding." Schaust du es bis zum Ende? "Jackpot, mehr davon!"' },
  { key: 'camera', name: 'Kamera', emoji: '📷', color: '#333', level: 2, text: 'Wenn du ein Selfie machst und dein Gesicht automatisch erkannt und scharfgestellt wird \u2013 das ist KI. Oder wenn die Kamera "Portraet-Modus" macht und den Hintergrund verschwimmen laesst \u2013 KI muss erkennen, wo dein Kopf aufhoert und die Wand anfaengt.' },
  { key: 'whatsapp', name: 'WhatsApp', emoji: '💬', color: '#25d366', level: 1, text: 'Autokorrektur und Texterkennung nutzen KI. Wenn du "Treffen eir uns" schreibst und WhatsApp "wir" vorschlaegt, hat eine KI erkannt, dass du dich wahrscheinlich vertippt hast.' },
  { key: 'netflix', name: 'Netflix', emoji: '🎬', color: '#e50914', level: 3, text: '"Weil du XY geschaut hast, empfehlen wir..." \u2013 das ist KI. Netflix analysiert, was du schaust, wann du pausierst, wann du weiterspulst. Deine Startseite sieht deshalb anders aus als die deiner Eltern.' },
  { key: 'maps', name: 'Maps', emoji: '🗺️', color: '#4285f4', level: 2, text: 'Google Maps berechnet die schnellste Route mit KI. Sie analysiert Echtzeit-Verkehrsdaten von Millionen Handys und sagt dir, wo Stau ist \u2013 bevor du im Stau stehst.' },
  { key: 'youtube', name: 'YouTube', emoji: '▶️', color: '#ff0000', level: 3, text: 'YouTubes Empfehlungs-Algorithmus ist so gut, dass du immer "nur noch ein Video" klickst. Die KI merkt sich, was du schaust, und zeigt dir immer genau das, was dich fesselt.' }
];

/* Bereich 3: Human or AI */
const HUMAN_AI_ITEMS = [
  { type: 'image', label: 'Portraet einer Person (fotorealistisch)', creator: 'ki', explanation: 'Das sieht mega echt aus, aber KI hat oft Probleme mit Details wie Ohren oder zu vielen Fingern. Erstellt mit Midjourney.' },
  { type: 'image', label: 'Abstraktes Gemaelde mit wilden Farbklecksen', creator: 'mensch', explanation: 'Das koennte KI sein \u2013 ist es aber nicht! Abstrakte Kunst ist fuer beide schwer zu unterscheiden. Dieses Werk ist von einem Menschen.' },
  { type: 'text', content: '"Der Mond scheint hell in stiller Nacht,\nDie Sterne haben Wache gehalten und Licht gebracht,\nEin Traum zieht leise durch das Land,\nUnd legt sich sanft auf jeden Strand."', creator: 'ki', explanation: 'Klingt poetisch, aber es ist ein bisschen... generisch. KI kann reimen, aber oft fehlt die Tiefe eines menschlichen Dichters.' },
  { type: 'image', label: 'Hyperrealistisches Gemaelde einer Strassenszene', creator: 'mensch', explanation: 'Sieht aus wie ein Foto, ist aber mit Pinsel und Farbe gemalt \u2013 von einem Menschen! Das hat Wochen gedauert.' },
  { type: 'music', content: 'Ein ruhiges Klavierstueck, das an einen Regentag erinnert', creator: 'ki', explanation: 'Es klingt schoen, aber irgendwie... vorhersehbar. KI komponiert nach gelernten Mustern. Menschen brechen manchmal bewusst Regeln \u2013 das macht Musik spannend.' },
  { type: 'image', label: 'Surreales Bild (fliegende Fische, umgekehrte Wasserfaelle)', creator: 'mensch', explanation: 'Surrealismus ist die Koenigsdisziplin \u2013 aber das ist von einem Menschen! KI kann auch surreal, aber dieses Werk hat eine bewusste "Story".' },
  { type: 'text', content: '"Warum vertrauen Wissenschaftler Atomen nicht? Weil sie alles erfinden!"', creator: 'mensch', explanation: 'Wortwitze sind eine Schwaeche von KI. Sie versteht oft nicht, warum etwas lustig ist. Menschen haben ein besseres Gespuer fuer Humor.' },
  { type: 'image', label: 'Ein Comic-Panel (gezeichneter Charakter, Sprechblase)', creator: 'mensch', explanation: 'Comics brauchen konsistente Charaktere ueber mehrere Panels. Das ist aktuell noch eine Schwaeche von KI.' }
];

/* Bereich 4: Mobility scenarios */
const MOBILITY_SCENARIOS = [
  {
    title: 'Das Fussgaenger-Dilemma',
    text: 'Dein selbstfahrendes Auto faehrt mit 50 km/h. Ploetzlich rennt ein Kind auf die Strasse. Bremsen ist zu spaet.',
    options: [
      'Geradeaus fahren \u2013 das Kind wird verletzt.',
      'Ausweichen auf den Gehweg \u2013 dort stehen drei aeltere Menschen.'
    ],
    explanation: 'Keine Antwort ist "richtig". Das ist die beruehmte Moral-Machine-Frage: Soll eine KI ein Leben opfern, um mehrere zu retten? Menschen sind sich da nicht einig \u2013 wie soll es eine KI sein? In echt versucht die KI, so frueh wie moeglich zu bremsen.'
  },
  {
    title: 'Der Raser',
    text: 'Du bist in einem Robotaxi. Das Auto faehrt 50 km/h (erlaubt). Hinter dir draengelt ein Auto, hupt, faehrt riskant dicht auf.',
    options: [
      'Beschleunigen auf 60 km/h, um den Raser loszuwerden (aber Tempolimit brechen).',
      '50 km/h weiterfahren, das Gesetz einhalten, auch wenn der Raser nervt.'
    ],
    explanation: 'Option B ist die "richtige" Antwort \u2013 technisch. Aber: In der Praxis provoziert das vielleicht einen Unfall. Soll eine KI manchmal Regeln brechen, wenn es sicherer ist? Aktuell halten selbstfahrende Autos immer die Gesetze ein. Immer.'
  },
  {
    title: 'Die Baustelle',
    text: 'Dein Auto erkennt eine Baustelle. GPS sagt: Links ist die offizielle Umleitung (5 km laenger). Rechts ist eine Abkuerzung (1 km), aber eigentlich fuer Anwohner gesperrt.',
    options: [
      'Offizielle Umleitung (5 km).',
      'Abkuerzung (1 km, aber verboten).'
    ],
    explanation: 'Option A ist korrekt. Menschen wuerden oft die Abkuerzung nehmen, weil "stoert ja niemanden". KI dagegen haelt sich immer an Regeln. Das macht sie berechenbar \u2013 aber auch starr. Ist das gut oder schlecht?'
  }
];

/* Bereich 5: Industrie Timeline */
const INDUSTRIE_TIMELINE = [
  {
    title: 'Amazon-Lager',
    vorher: 'Frueher liefen Lager-Mitarbeiter bis zu 20 Kilometer am Tag durch riesige Hallen, um Produkte aus Regalen zu holen. Sie scannten jedes Paket einzeln, trugen schwere Kisten und mussten sich den Standort von tausenden Produkten merken.',
    options: ['Roboter fahren die Regale zu den Menschen, statt Menschen zu den Regalen', 'Drohnen fliegen Pakete direkt zum Kunden', 'KI bestellt die Produkte automatisch, ohne dass Kunden etwas tun muessen'],
    correct: 0,
    nachher: 'Heute fahren ueber eine Million orangefarbene Roboter autonom durchs Lager und bringen ganze Regale zu den Mitarbeitern. Die Menschen muessen nicht mehr laufen \u2013 die Regale kommen zu ihnen! Ein Roboter schafft es, ein Regal in unter einer Minute zur Packstation zu bringen.',
    stat: 'Amazon hat ueber 1 Million Lager-Roboter \u2013 fast einen Roboter pro menschlichen Mitarbeiter!'
  },
  {
    title: 'Auto-Fabrik',
    vorher: 'In den 1970ern schweissten Menschen in Autofabriken jedes einzelne Blechteil per Hand zusammen. Schwere Schutzausruestung, extreme Hitze, Funkenregen \u2013 und trotzdem waren die Schweissnaehte nie perfekt gleichmaessig. Ein Auto brauchte Tage zur Fertigstellung.',
    options: ['Roboter-Arme schweissen jetzt jedes Auto in unter einer Minute zusammen', 'Autos werden heute mit 3D-Druckern gedruckt statt geschweisst', 'Menschen steuern die Roboter per Videospiel-Controller'],
    correct: 0,
    nachher: 'In Teslas Gigafactory Shanghai ist die Schweisskammer zu fast 100% automatisiert. Roboter-Arme setzen 1.400 Schweisspunkte pro Auto \u2013 alle 60 Sekunden rollt ein fertiges Fahrzeug vom Band. Praeziser, schneller und sicherer als jeder Mensch.',
    stat: 'Teslas Gigafactory Shanghai ist zu 95% automatisiert \u2013 alle 60 Sekunden ein fertiges Auto!'
  },
  {
    title: 'Fast-Food-Restaurant',
    vorher: 'Ein Koch in einem Fast-Food-Restaurant stand frueher stundenlang am heissen Grill, wendete hunderte Burger, frittierte Pommes und musste gleichzeitig auf Hygiene und Timing achten. Bei Stress passierten schnell Fehler \u2013 verbrannte Burger, rohe Patties.',
    options: ['Ein Roboter namens "Flippy" bratet und wendet die Burger automatisch', 'Kunden muessen ihre Burger jetzt selbst braten', 'KI bestellt das Essen bei einem anderen Restaurant'],
    correct: 0,
    nachher: 'Der Roboter "Flippy" bratet Burger, frittiert Pommes und Chicken Nuggets \u2013 vollautomatisch. Er erkennt mit Sensoren, wann das Fleisch perfekt durch ist, und wendet es im genau richtigen Moment. Und er braucht weder Pause noch Mittagessen.',
    stat: 'Flippy schafft bis zu 2.000 Burger am Tag \u2013 doppelt so schnell wie ein Mensch!'
  },
  {
    title: 'Krankenhaus-OP',
    vorher: 'Bei komplizierten Operationen mussten Chirurgen frueher grosse Schnitte machen, um ueberhaupt an die richtige Stelle zu kommen. Ihre Haende mussten absolut ruhig sein \u2013 schon ein minimales Zittern konnte gefaehrlich werden. Patienten brauchten danach oft Wochen zur Erholung.',
    options: ['Ein OP-Roboter operiert mit winzigen Instrumenten durch mini-kleine Schnitte', 'KI ersetzt den Chirurgen komplett und operiert alleine', 'Patienten werden mit Laserstrahlen operiert, ganz ohne Instrumente'],
    correct: 0,
    nachher: 'Der da-Vinci-Roboter operiert durch Schnitte, die kleiner als ein Zentimeter sind. Der Chirurg steuert den Roboter mit Joysticks, und der Roboter filtert jedes Handzittern heraus. Ergebnis: weniger Blutung, weniger Schmerzen, schnellere Heilung.',
    stat: 'Ueber 14 Millionen Operationen wurden weltweit mit dem da-Vinci-Roboter durchgefuehrt!'
  },
  {
    title: 'Qualitaetskontrolle',
    vorher: 'In Fabriken sassen frueher Menschen an Fliessbaendern und prueften jedes einzelne Produkt per Auge: Ist der Lack gleichmaessig? Hat die Schraube einen Kratzer? Bei hunderten Teilen pro Stunde uebersahen sie bis zu 30% aller Fehler \u2013 einfach weil Augen muede werden.',
    options: ['KI-Kameras scannen jedes Produkt und erkennen Fehler, die Menschen uebersehen', 'Kunden pruefen die Qualitaet jetzt selbst zu Hause', 'Produkte werden einfach nicht mehr kontrolliert'],
    correct: 0,
    nachher: 'Heute scannen KI-Kameras jedes einzelne Produkt in Millisekunden. Bei BMW hat die KI-Qualitaetskontrolle die Fehlerrate um 30% gesenkt. Die KI erkennt winzige Kratzer, falsche Farben und minimale Massabweichungen \u2013 Dinge, die kein menschliches Auge sehen wuerde.',
    stat: 'KI-Systeme erreichen bis zu 99% Erkennungsrate \u2013 Menschen nur 70-80%!'
  }
];

/* Bereich 6: Ethics scenarios */
const ETHICS_SCENARIOS = [
  {
    title: 'Gesichtserkennung an Schulen',
    text: 'Deine Schule ueberlegt, Gesichtserkennungs-Kameras zu installieren. Damit koennte man sehen, wer wann in der Schule ist. Sicherer, sagen die Lehrer. Ueberwachung, sagen manche Schueler.',
    options: ['Gute Idee \u2013 macht die Schule sicherer', 'Schlechte Idee \u2013 das ist Ueberwachung', 'Kommt drauf an \u2013 unter welchen Bedingungen?'],
    explanation: 'Manche sagen: Wenn du nichts zu verbergen hast, ist Ueberwachung kein Problem. Andere sagen: Privatsphaere ist ein Grundrecht. In China ist Gesichtserkennung ueberall, in San Francisco verboten. Es gibt keine einfache Antwort.'
  },
  {
    title: 'Deepfakes',
    text: 'Dein Freund zeigt dir ein Video: Der Bundeskanzler sagt live im TV, dass morgen alle Schulen geschlossen werden. Alle flippen aus. Spaeter stellt sich raus: Das Video war ein Deepfake.',
    options: ['Deepfakes sollten komplett verboten werden', 'Deepfakes sind okay, wenn sie als "Fake" gekennzeichnet sind', 'Jeder sollte selbst checken, ob ein Video echt ist'],
    explanation: 'Deepfakes sind ein riesiges Problem. Sie koennen Wahlen manipulieren und Ruf zerstoeren. Aber: Wie verbietet man sie? KI-Tools sind frei verfuegbar. Es ist ein Wettrennen: Deepfake-Ersteller vs. Deepfake-Detektoren.'
  },
  {
    title: 'Voreingenommene KI',
    text: 'Eine KI entscheidet, wer zum Bewerbungsgespraech eingeladen wird. Spaeter stellt sich raus: Die KI bevorzugt Maenner, weil sie mit Daten trainiert wurde, in denen hauptsaechlich Maenner eingestellt wurden.',
    options: ['Die KI abschalten und Menschen entscheiden lassen', 'Die KI mit besseren, faireren Daten neu trainieren', 'Weitermachen \u2013 Menschen sind auch voreingenommen'],
    explanation: 'KI lernt aus der Vergangenheit \u2013 und wenn die Vergangenheit unfair war, wird die KI es auch sein. Die Loesung? Bessere Daten, diverse Teams, und regelmaessige Checks. Aber das ist schwer.'
  },
  {
    title: 'Social Credit System',
    text: 'In einem Land gibt es ein System: Gutes Verhalten = Punkte = Vorteile. Schlechtes Verhalten = Minuspunkte = Einschraenkungen. Eine KI ueberwacht alles.',
    options: ['Gute Idee \u2013 belohnt gutes Verhalten', 'Schlechte Idee \u2013 totale Ueberwachung', 'Kommt drauf an, wie es umgesetzt wird'],
    explanation: 'Das gibt es wirklich \u2013 in China. Manche finden es gut: Es motiviert. Andere finden es dystopisch: Der Staat kontrolliert dein ganzes Leben. Was, wenn die KI einen Fehler macht? Was, wenn du Punkte verlierst fuer eine regierungskritische Meinung?'
  }
];

/* ── Badge Definitions ── */
const BADGES = {
  'first-steps':  { name: 'Erste Schritte',   icon: '🎯', desc: 'Ersten Bereich abgeschlossen',        check: s => Object.values(s.progress).some(p => p.completed) },
  'quiz-master':  { name: 'Quiz-Master',       icon: '🏆', desc: 'Ein Quiz mit 5/5 geloest',            check: s => Object.values(s.progress).some(p => p.quizScore >= 5) },
  'explorer':     { name: 'KI-Entdecker',      icon: '🔍', desc: 'Alle interaktiven Elemente gemacht',  check: s => Object.values(s.progress).every(p => p.interactiveDone) },
  'graduate':     { name: 'KI-Experte',        icon: '🎓', desc: 'Alle 6 Bereiche abgeschlossen',       check: s => Object.values(s.progress).every(p => p.completed) },
  'perfectionist':{ name: 'Perfektionist',     icon: '💎', desc: 'Ueber 250 Punkte erreicht',           check: s => s.totalPoints >= 250 },
  'speed-runner': { name: 'Speedrunner',       icon: '⚡', desc: 'Alle Bereiche an einem Tag',          check: s => { const t = new Date().toDateString(); return t === new Date(s.lastVisit).toDateString() && Object.values(s.progress).every(p => p.completed); } }
};

/* ══════════════════════════════════════════════
   APP INIT
   ══════════════════════════════════════════════ */

const SECTIONS = ['home','grundlagen','alltag','kreativitaet','mobilitaet','industrie','ethik','abschluss'];
const AREA_SECTIONS = ['grundlagen','alltag','kreativitaet','mobilitaet','industrie','ethik'];

let currentSection = 'home';
let quizInstances = {};
let gameInstances = {};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSoundToggle();
  updateUI();

  // Restore last section
  const state = Storage.load();
  if (state.currentSection && state.currentSection !== 'home') {
    navigateTo(state.currentSection, false);
  }

  // Hash navigation
  const hash = location.hash.slice(1);
  if (hash && SECTIONS.includes(hash)) navigateTo(hash, false);
  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    if (h && SECTIONS.includes(h)) navigateTo(h, false);
  });
});

/* ── Navigation ── */
function initNav() {
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
  });
  document.querySelectorAll('.area-card[data-area]').forEach(card => {
    card.addEventListener('click', () => navigateTo(card.dataset.area));
  });
}

function navigateTo(sectionId, animate = true) {
  if (sectionId === currentSection) return;
  if (!SECTIONS.includes(sectionId)) return;

  const oldEl = document.getElementById('section-' + currentSection);
  const newEl = document.getElementById('section-' + sectionId);
  if (!newEl) return;

  // Update hash without scrolling
  history.replaceState(null, '', '#' + sectionId);

  if (animate && typeof gsap !== 'undefined') {
    if (oldEl) {
      gsap.to(oldEl, {
        opacity: 0, y: -20, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
          oldEl.classList.remove('active');
          showSection(newEl, sectionId);
        }
      });
    } else {
      showSection(newEl, sectionId);
    }
  } else {
    if (oldEl) oldEl.classList.remove('active');
    showSection(newEl, sectionId);
  }
}

function showSection(el, sectionId) {
  el.classList.add('active');
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  currentSection = sectionId;

  // Save
  const state = Storage.load();
  state.currentSection = sectionId;
  Storage.save(state);

  // Update nav
  document.querySelectorAll('[data-nav]').forEach(n => {
    n.classList.toggle('active', n.dataset.nav === sectionId);
  });

  // Animate in
  if (typeof gsap !== 'undefined') {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  } else {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Init section games lazily
  initSectionGames(sectionId);
}

function initSectionGames(id) {
  if (id === 'grundlagen' && !gameInstances.grundlagen) gameInstances.grundlagen = initDragDropGame();
  if (id === 'alltag' && !gameInstances.alltag) gameInstances.alltag = initSmartphoneGame();
  if (id === 'kreativitaet' && !gameInstances.kreativitaet) gameInstances.kreativitaet = initHumanAIGame();
  if (id === 'mobilitaet' && !gameInstances.mobilitaet) gameInstances.mobilitaet = initMobilityGame();
  if (id === 'industrie' && !gameInstances.industrie) gameInstances.industrie = initTimelineGame();
  if (id === 'ethik' && !gameInstances.ethik) gameInstances.ethik = initEthicsGame();

  // Init quiz if not done
  if (AREA_SECTIONS.includes(id) && !quizInstances[id]) {
    quizInstances[id] = initQuiz(id);
  }
  if (id === 'abschluss' && !quizInstances.final) {
    quizInstances.final = initFinalQuiz();
  }
}

/* ── Sound Toggle ── */
function initSoundToggle() {
  const btn = document.getElementById('sound-toggle');
  if (btn) btn.addEventListener('click', () => SoundMgr.toggle());
}

/* ── Update UI ── */
function updateUI() {
  const state = Storage.load();
  // Points
  const ptEl = document.getElementById('points-value');
  if (ptEl) ptEl.textContent = state.totalPoints;

  // Sidebar progress
  const completed = Object.values(state.progress).filter(p => p.completed).length;
  const pct = Math.round((completed / 6) * 100);
  const fill = document.getElementById('sidebar-progress-fill');
  if (fill) fill.style.width = pct + '%';
  const compText = document.getElementById('completed-count');
  if (compText) compText.textContent = completed;

  // Home progress bar
  const homeFill = document.getElementById('home-progress-fill');
  if (homeFill) homeFill.style.width = pct + '%';
  const homeLabel = document.getElementById('home-progress-label');
  if (homeLabel) homeLabel.textContent = completed + ' von 6 Bereichen abgeschlossen';

  // Nav checkmarks
  AREA_SECTIONS.forEach(key => {
    const navs = document.querySelectorAll(`[data-nav="${key}"]`);
    navs.forEach(n => {
      if (state.progress[key] && state.progress[key].completed) {
        n.classList.add('completed');
      } else {
        n.classList.remove('completed');
      }
    });
  });

  // Area cards badges
  AREA_SECTIONS.forEach(key => {
    const badge = document.getElementById('badge-' + key);
    if (!badge) return;
    const p = state.progress[key];
    if (p.completed) {
      badge.className = 'area-badge done';
      badge.textContent = '✓ Abgeschlossen';
    } else if (p.quizScore > 0 || p.interactiveDone) {
      badge.className = 'area-badge in-progress';
      badge.textContent = '⏳ Gestartet';
    } else {
      badge.className = 'area-badge not-started';
      badge.textContent = 'Noch nicht begonnen';
    }
  });

  // Badges display
  updateBadgesDisplay();
}

function updateBadgesDisplay() {
  const state = Storage.load();
  const container = document.getElementById('badges-display');
  if (!container) return;
  container.innerHTML = '';
  Object.entries(BADGES).forEach(([key, badge]) => {
    const unlocked = state.badges.includes(key);
    const chip = document.createElement('span');
    chip.className = 'badge-chip ' + (unlocked ? 'unlocked' : 'locked');
    chip.innerHTML = (unlocked ? badge.icon : '🔒') + ' ' + badge.name;
    container.appendChild(chip);
  });
}

function addPoints(pts, areaKey) {
  const state = Storage.load();
  state.totalPoints += pts;
  if (areaKey) {
    // Check area completion
    const p = state.progress[areaKey];
    if (p.quizScore > 0 && p.interactiveDone && !p.completed) {
      p.completed = true;
      state.totalPoints += 20; // Bereich-Bonus
    }
  }
  Storage.save(state);
  updateUI();
  checkBadges();

  // Animate points
  const ptEl = document.getElementById('points-value');
  if (ptEl && typeof gsap !== 'undefined') {
    gsap.fromTo(ptEl, { scale: 1.4, color: '#39ff14' }, { scale: 1, color: '#00d4ff', duration: 0.5 });
  }
}

/* ── Badges ── */
function checkBadges() {
  const state = Storage.load();
  const newBadges = [];
  Object.entries(BADGES).forEach(([key, badge]) => {
    if (!state.badges.includes(key) && badge.check(state)) {
      state.badges.push(key);
      newBadges.push(badge);
    }
  });
  if (newBadges.length > 0) {
    Storage.save(state);
    updateBadgesDisplay();
    newBadges.forEach(b => showBadgeModal(b));
  }
}

function showBadgeModal(badge) {
  const overlay = document.getElementById('badge-modal');
  if (!overlay) return;
  document.getElementById('badge-modal-icon').textContent = badge.icon;
  document.getElementById('badge-modal-name').textContent = badge.name;
  document.getElementById('badge-modal-desc').textContent = badge.desc;
  overlay.classList.add('active');
  SoundMgr.play('badge');
  createConfetti();
  if (typeof gsap !== 'undefined') {
    gsap.from('#badge-modal-icon', { scale: 0, rotation: 360, duration: 0.8, ease: 'elastic.out(1,0.5)' });
  }
}
function closeBadgeModal() {
  document.getElementById('badge-modal').classList.remove('active');
}

function createConfetti() {
  const c = document.createElement('div');
  c.className = 'confetti-container';
  document.body.appendChild(c);
  const colors = ['#00d4ff','#b026ff','#39ff14','#ffd700','#ff1744'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDelay = (Math.random() * 2) + 's';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = (4 + Math.random() * 6) + 'px';
    p.style.height = (4 + Math.random() * 6) + 'px';
    c.appendChild(p);
  }
  setTimeout(() => c.remove(), 5000);
}

/* ══════════════════════════════════════════════
   QUIZ ENGINE
   ══════════════════════════════════════════════ */

function initQuiz(sectionKey) {
  const data = QUIZ_DATA[sectionKey];
  if (!data) return null;
  const container = document.getElementById('quiz-' + sectionKey);
  if (!container) return null;

  let idx = 0, score = 0, answered = false;

  function render() {
    if (idx >= data.length) {
      showQuizResult(container, sectionKey, score, data.length);
      return;
    }
    const q = data[idx];
    answered = false;
    container.innerHTML = `
      <div class="quiz-progress">Frage ${idx + 1} von ${data.length}</div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options">${q.opts.map((o, i) =>
        `<button class="quiz-option" data-idx="${i}">${String.fromCharCode(65 + i)}) ${o}</button>`
      ).join('')}</div>
      <div id="qfb-${sectionKey}" class="hidden"></div>
    `;
    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn, q, parseInt(btn.dataset.idx)));
    });
  }

  function handleAnswer(btn, q, chosenIdx) {
    if (answered) return;
    answered = true;
    const isCorrect = chosenIdx === q.correct;
    if (isCorrect) score++;

    // Highlight
    container.querySelectorAll('.quiz-option').forEach((b, i) => {
      if (i === q.correct) b.classList.add('correct');
      else if (i === chosenIdx && !isCorrect) b.classList.add('wrong');
      if (i !== chosenIdx) b.classList.add('dimmed');
      b.classList.add('disabled');
    });

    // Feedback
    const fbEl = document.getElementById('qfb-' + sectionKey);
    let fbText = '';
    if (isCorrect) {
      fbText = q.feedback.correct;
      SoundMgr.play('correct');
    } else {
      fbText = q.feedback.wrong[chosenIdx] || q.feedback.wrong.find(f => f) || 'Leider falsch.';
      SoundMgr.play('wrong');
    }
    fbEl.className = 'quiz-feedback ' + (isCorrect ? 'correct-fb' : 'wrong-fb');
    fbEl.innerHTML = `<p>${fbText}</p>`;
    fbEl.classList.remove('hidden');

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary btn-sm quiz-next-btn';
    nextBtn.textContent = idx < data.length - 1 ? 'Naechste Frage →' : 'Ergebnis anzeigen';
    nextBtn.addEventListener('click', () => { idx++; render(); });
    fbEl.appendChild(nextBtn);

    if (typeof gsap !== 'undefined') {
      gsap.from(fbEl, { y: -10, opacity: 0, duration: 0.3, ease: 'power2.out' });
    }
  }

  render();
  return { getScore: () => score };
}

function showQuizResult(container, sectionKey, score, total) {
  const pct = Math.round((score / total) * 100);
  let cls = 'low', msg = 'Kein Stress \u2013 vielleicht nochmal lesen?';
  if (pct === 100) { cls = 'perfect'; msg = 'WOW! Perfekt! Du bist ein Profi!'; }
  else if (pct >= 80) { cls = 'good'; msg = 'Super! Das sitzt!'; }
  else if (pct >= 60) { cls = 'ok'; msg = 'Solide! Du weisst schon eine Menge.'; }

  container.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-progress">Quiz abgeschlossen!</div>
      <div class="score-big ${cls}">${score} / ${total}</div>
      <p style="color:#a0aec0;font-size:16px;margin-bottom:16px;">${msg}</p>
      ${score === total ? '<p style="color:#39ff14;font-weight:600;">+5 Bonus fuer perfektes Quiz!</p>' : ''}
    </div>
  `;

  // Save score
  const state = Storage.load();
  const pts = score * 2 + (score === total ? 5 : 0);
  if (sectionKey !== 'final') {
    state.progress[sectionKey].quizScore = score;
    Storage.save(state);
    addPoints(pts, sectionKey);
  }
  SoundMgr.play('complete');
}

/* ── Final Quiz ── */
function initFinalQuiz() {
  const container = document.getElementById('quiz-final');
  if (!container) return null;

  const data = FINAL_QUIZ_DATA;
  let idx = 0, score = 0, answered = false;

  function render() {
    if (idx >= data.length) {
      showFinalResult(container, score, data.length);
      return;
    }
    const q = data[idx];
    answered = false;
    container.innerHTML = `
      <div class="quiz-progress">Abschluss-Quiz: Frage ${idx + 1} von ${data.length}</div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options">${q.opts.map((o, i) =>
        `<button class="quiz-option" data-idx="${i}">${String.fromCharCode(65 + i)}) ${o}</button>`
      ).join('')}</div>
      <div id="qfb-final" class="hidden"></div>
    `;
    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => handleFinalAnswer(btn, q, parseInt(btn.dataset.idx)));
    });
  }

  function handleFinalAnswer(btn, q, chosenIdx) {
    if (answered) return;
    answered = true;
    const isCorrect = chosenIdx === q.correct;
    if (isCorrect) score++;

    container.querySelectorAll('.quiz-option').forEach((b, i) => {
      if (i === q.correct) b.classList.add('correct');
      else if (i === chosenIdx && !isCorrect) b.classList.add('wrong');
      if (i !== chosenIdx) b.classList.add('dimmed');
      b.classList.add('disabled');
    });

    const fbEl = document.getElementById('qfb-final');
    let fbText = isCorrect ? q.feedback.correct : (q.feedback.wrong[chosenIdx] || q.feedback.wrong.find(f => f) || 'Leider falsch.');
    fbEl.className = 'quiz-feedback ' + (isCorrect ? 'correct-fb' : 'wrong-fb');
    fbEl.innerHTML = `<p>${fbText}</p>`;
    fbEl.classList.remove('hidden');
    SoundMgr.play(isCorrect ? 'correct' : 'wrong');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary btn-sm quiz-next-btn';
    nextBtn.textContent = idx < data.length - 1 ? 'Naechste Frage →' : 'Ergebnis anzeigen';
    nextBtn.addEventListener('click', () => { idx++; render(); });
    fbEl.appendChild(nextBtn);
  }

  render();
  return { getScore: () => score };
}

function showFinalResult(container, score, total) {
  let emoji = '🚀', msg = 'Kein Stress \u2013 vielleicht nochmal durchgehen?';
  if (score === 10) { emoji = '🏆'; msg = 'Wow! Du bist eine KI-Legende!'; }
  else if (score >= 7) { emoji = '🌟'; msg = 'Krass! Du hast echt aufgepasst!'; }
  else if (score >= 4) { emoji = '💪'; msg = 'Solide! Du weisst schon eine Menge.'; }

  container.innerHTML = `
    <div class="quiz-result">
      <div style="font-size:64px;margin-bottom:16px;">${emoji}</div>
      <h2 style="font-size:24px;color:#ffd700;margin-bottom:8px;">Abschluss-Quiz Ergebnis</h2>
      <div class="score-big ${score >= 7 ? 'good' : score >= 4 ? 'ok' : 'low'}">${score} / ${total}</div>
      <p style="color:#a0aec0;font-size:16px;margin-bottom:24px;">${msg}</p>
      <button class="btn btn-primary" onclick="navigateTo('home')">Zurueck zur Startseite</button>
    </div>
  `;

  const state = Storage.load();
  state.finalQuizScore = score;
  state.finalQuizDone = true;
  const pts = score * 2;
  state.totalPoints += pts;
  Storage.save(state);
  updateUI();
  checkBadges();
  SoundMgr.play('complete');

  // All done bonus
  if (Object.values(state.progress).every(p => p.completed)) {
    setTimeout(() => {
      const s2 = Storage.load();
      if (!s2.allDoneBonus) {
        s2.totalPoints += 50;
        s2.allDoneBonus = true;
        Storage.save(s2);
        updateUI();
        checkBadges();
      }
    }, 1000);
  }
}

/* ══════════════════════════════════════════════
   INTERACTIVE GAMES
   ══════════════════════════════════════════════ */

/* ── Bereich 1: Drag & Drop ── */
function initDragDropGame() {
  const container = document.getElementById('game-grundlagen');
  if (!container) return null;

  const pool = container.querySelector('.items-pool');
  const kiZone = container.querySelector('[data-zone="ki"]');
  const noKiZone = container.querySelector('[data-zone="no-ki"]');
  const feedbackEl = document.getElementById('dd-feedback');
  const checkBtn = document.getElementById('dd-check-btn');
  let checked = false;

  // Shuffle items
  const shuffled = [...DRAG_DROP_ITEMS].sort(() => Math.random() - 0.5);
  pool.innerHTML = '';
  shuffled.forEach(item => {
    const el = document.createElement('div');
    el.className = 'draggable-item';
    el.id = item.id;
    el.textContent = item.text;
    el.draggable = true;
    el.dataset.answer = item.answer;
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'listitem');
    pool.appendChild(el);
  });

  // Desktop drag events
  container.querySelectorAll('.draggable-item').forEach(el => {
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', el.id);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));

    // Touch support
    let touchClone = null;
    let startParent = null;
    el.addEventListener('touchstart', e => {
      startParent = el.parentElement;
      touchClone = el.cloneNode(true);
      touchClone.style.position = 'fixed';
      touchClone.style.pointerEvents = 'none';
      touchClone.style.opacity = '0.7';
      touchClone.style.zIndex = '999';
      touchClone.style.width = el.offsetWidth + 'px';
      document.body.appendChild(touchClone);
      moveTouchClone(touchClone, e.touches[0]);
      el.classList.add('dragging');
    }, { passive: true });
    el.addEventListener('touchmove', e => {
      e.preventDefault();
      if (touchClone) moveTouchClone(touchClone, e.touches[0]);
    }, { passive: false });
    el.addEventListener('touchend', e => {
      el.classList.remove('dragging');
      if (touchClone) {
        const t = e.changedTouches[0];
        touchClone.style.display = 'none';
        const under = document.elementFromPoint(t.clientX, t.clientY);
        touchClone.remove();
        touchClone = null;
        const zone = under ? under.closest('.drop-zone') : null;
        if (zone) {
          zone.querySelector('.zone-items').appendChild(el);
        }
      }
    });

    // Keyboard: press Enter to cycle zones
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const parent = el.parentElement;
        if (parent === pool || parent.classList.contains('items-pool')) {
          kiZone.querySelector('.zone-items').appendChild(el);
        } else if (parent.closest('[data-zone="ki"]')) {
          noKiZone.querySelector('.zone-items').appendChild(el);
        } else {
          pool.appendChild(el);
        }
        el.focus();
      }
    });
  });

  function moveTouchClone(clone, touch) {
    clone.style.left = (touch.clientX - 60) + 'px';
    clone.style.top = (touch.clientY - 20) + 'px';
  }

  [kiZone, noKiZone].forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      const item = document.getElementById(id);
      if (item) zone.querySelector('.zone-items').appendChild(item);
    });
  });

  // Also allow dropping back to pool
  pool.addEventListener('dragover', e => e.preventDefault());
  pool.addEventListener('drop', e => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const item = document.getElementById(id);
    if (item) pool.appendChild(item);
  });

  checkBtn.addEventListener('click', () => {
    if (checked) return;
    let correct = 0;
    container.querySelectorAll('.draggable-item').forEach(el => {
      const zone = el.parentElement.closest('.drop-zone');
      el.classList.remove('correct-item', 'wrong-item');
      if (zone) {
        if (zone.dataset.zone === el.dataset.answer) {
          el.classList.add('correct-item');
          correct++;
        } else {
          el.classList.add('wrong-item');
        }
      }
    });

    const total = DRAG_DROP_ITEMS.length;
    if (correct === total) {
      checked = true;
      feedbackEl.innerHTML = '<div class="quiz-feedback correct-fb"><p><strong>Perfekt!</strong> Alle ' + total + ' richtig zugeordnet! 🎉</p></div>';
      feedbackEl.classList.remove('hidden');
      SoundMgr.play('complete');
      const state = Storage.load();
      state.progress.grundlagen.interactiveDone = true;
      Storage.save(state);
      addPoints(10, 'grundlagen');
    } else {
      feedbackEl.innerHTML = '<div class="quiz-feedback wrong-fb"><p><strong>' + correct + ' von ' + total + ' richtig.</strong> Gruen = richtig, Rot = falsch. Verschiebe die roten Kaertchen und probiers nochmal!</p></div>';
      feedbackEl.classList.remove('hidden');
    }
  });

  return true;
}

/* ── Bereich 2: Smartphone Game ── */
function initSmartphoneGame() {
  const container = document.getElementById('game-alltag');
  if (!container) return null;

  const found = new Set();
  const countEl = document.getElementById('alltag-found-count');
  const modal = document.getElementById('app-modal');

  container.querySelectorAll('.app-icon[data-app]').forEach(icon => {
    icon.addEventListener('click', () => {
      const key = icon.dataset.app;
      const app = APP_DATA.find(a => a.key === key);
      if (!app) return;

      // Show modal
      document.getElementById('app-modal-emoji').textContent = app.emoji;
      document.getElementById('app-modal-name').textContent = app.name;
      document.getElementById('app-modal-level').innerHTML = Array(3).fill(0).map((_, i) =>
        `<span class="flame ${i < app.level ? '' : 'inactive'}">🔥</span>`
      ).join('');
      document.getElementById('app-modal-text').textContent = app.text;
      modal.classList.add('active');

      if (!found.has(key)) {
        found.add(key);
        icon.classList.add('found');
        if (countEl) countEl.textContent = found.size;

        if (typeof gsap !== 'undefined') {
          gsap.from(icon, { scale: 1.3, duration: 0.4, ease: 'elastic.out(1,0.5)' });
        }

        if (found.size === APP_DATA.length) {
          setTimeout(() => {
            SoundMgr.play('complete');
            const state = Storage.load();
            state.progress.alltag.interactiveDone = true;
            Storage.save(state);
            addPoints(10, 'alltag');
          }, 500);
        }
      }
    });
  });

  return true;
}

function closeAppModal() {
  document.getElementById('app-modal').classList.remove('active');
}

/* ── Bereich 3: Human or AI ── */
function initHumanAIGame() {
  const container = document.getElementById('game-kreativitaet');
  if (!container) return null;

  let idx = 0, score = 0;
  const items = [...HUMAN_AI_ITEMS].sort(() => Math.random() - 0.5);
  const displayEl = container.querySelector('.game-display');
  const btnHuman = document.getElementById('hai-btn-human');
  const btnAI = document.getElementById('hai-btn-ai');
  const fbEl = document.getElementById('hai-feedback');
  const countEl = document.getElementById('hai-count');
  const scoreEl = document.getElementById('hai-score');
  let waiting = false;

  function showItem() {
    if (idx >= items.length) { showHAIResult(); return; }
    waiting = false;
    fbEl.classList.add('hidden');
    btnHuman.disabled = false; btnAI.disabled = false;
    const item = items[idx];
    countEl.textContent = (idx + 1) + ' / ' + items.length;

    if (item.type === 'text') {
      displayEl.innerHTML = `<div><span class="display-label">Text</span><p class="display-text">"${item.content}"</p></div>`;
    } else if (item.type === 'music') {
      displayEl.innerHTML = `<div><span class="display-label">Musik</span><p class="display-text">🎵 ${item.content}</p></div>`;
    } else {
      displayEl.innerHTML = `<div><span class="display-label">Bild</span><p class="display-text">🖼️ ${item.label}</p></div>`;
    }
  }

  function guess(choice) {
    if (waiting) return;
    waiting = true;
    btnHuman.disabled = true; btnAI.disabled = true;
    const item = items[idx];
    const isCorrect = choice === item.creator;
    if (isCorrect) score++;
    scoreEl.textContent = score;

    const label = item.creator === 'mensch' ? '👤 Mensch' : '🤖 KI';
    fbEl.innerHTML = `
      <div class="quiz-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'}">
        <p><strong>${isCorrect ? '✅ Richtig!' : '❌ Knapp daneben!'}</strong></p>
        <p style="margin:8px 0"><strong>Erstellt von:</strong> ${label}</p>
        <p style="font-size:13px;color:#a0aec0">${item.explanation}</p>
        <button class="btn btn-primary btn-sm mt-4" id="hai-next-btn">${idx < items.length - 1 ? 'Weiter →' : 'Ergebnis'}</button>
      </div>
    `;
    fbEl.classList.remove('hidden');
    SoundMgr.play(isCorrect ? 'correct' : 'wrong');
    document.getElementById('hai-next-btn').addEventListener('click', () => { idx++; showItem(); });
  }

  function showHAIResult() {
    const pct = Math.round((score / items.length) * 100);
    let msg = 'Schwierig, oder? KI und Mensch sind schwer zu unterscheiden!';
    if (pct === 100) msg = 'Wow! Du bist ein KI-Detektiv! 🔍';
    else if (pct >= 75) msg = 'Sehr gut! Du erkennst KI meistens! 👏';
    else if (pct >= 50) msg = 'Nicht schlecht! KI wird immer besser... 🤔';

    container.innerHTML = `
      <div class="quiz-result">
        <h3 style="font-size:20px;color:#b026ff;margin-bottom:12px;">MENSCH ODER MASCHINE \u2013 Ergebnis</h3>
        <div class="score-big ${pct >= 75 ? 'good' : 'ok'}">${score} / ${items.length}</div>
        <p style="color:#a0aec0;margin-bottom:16px;">${msg}</p>
      </div>
    `;
    SoundMgr.play('complete');
    const state = Storage.load();
    state.progress.kreativitaet.interactiveDone = true;
    Storage.save(state);
    addPoints(10, 'kreativitaet');
  }

  btnHuman.addEventListener('click', () => guess('mensch'));
  btnAI.addEventListener('click', () => guess('ki'));
  showItem();
  return true;
}

/* ── Bereich 4: Mobility Scenarios ── */
function initMobilityGame() {
  const container = document.getElementById('game-mobilitaet');
  if (!container) return null;

  let idx = 0;
  const dotsEl = container.querySelector('.ethics-progress');
  const scenarioEl = document.getElementById('mob-scenario');
  const fbEl = document.getElementById('mob-feedback');

  function showScenario() {
    if (idx >= MOBILITY_SCENARIOS.length) {
      container.innerHTML = `
        <div class="quiz-result">
          <p style="font-size:18px;color:#ffd700;margin-bottom:8px;">Alle 3 Szenarien durchgespielt!</p>
          <p style="color:#a0aec0;">Es gibt keine einfachen Antworten \u2013 und genau das macht autonomes Fahren so spannend und kompliziert.</p>
        </div>
      `;
      SoundMgr.play('complete');
      const state = Storage.load();
      state.progress.mobilitaet.interactiveDone = true;
      Storage.save(state);
      addPoints(10, 'mobilitaet');
      return;
    }

    // Update dots
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < MOBILITY_SCENARIOS.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'ethics-dot' + (i < idx ? ' done' : i === idx ? ' active' : '');
        dotsEl.appendChild(dot);
      }
    }

    const s = MOBILITY_SCENARIOS[idx];
    fbEl.classList.add('hidden');
    scenarioEl.innerHTML = `
      <div class="scenario-card">
        <div class="scenario-title">${s.title}</div>
        <p class="scenario-text">${s.text}</p>
        <div class="scenario-options">
          ${s.options.map((o, i) => `<button class="scenario-option" data-idx="${i}"><strong>Option ${String.fromCharCode(65 + i)}:</strong> ${o}</button>`).join('')}
        </div>
      </div>
    `;
    scenarioEl.querySelectorAll('.scenario-option').forEach(btn => {
      btn.addEventListener('click', () => handleScenarioChoice(s, btn));
    });
  }

  function handleScenarioChoice(s, btn) {
    scenarioEl.querySelectorAll('.scenario-option').forEach(b => {
      b.classList.add('disabled');
      b.style.pointerEvents = 'none';
    });
    btn.classList.add('selected');
    fbEl.innerHTML = `<div class="scenario-explanation"><p>${s.explanation}</p><button class="btn btn-primary btn-sm mt-4" id="mob-next">${idx < MOBILITY_SCENARIOS.length - 1 ? 'Naechstes Szenario →' : 'Abschliessen'}</button></div>`;
    fbEl.classList.remove('hidden');
    document.getElementById('mob-next').addEventListener('click', () => { idx++; showScenario(); });
  }

  showScenario();
  return true;
}

/* ── Bereich 5: Timeline Game (Industrie) ── */
function initTimelineGame() {
  const container = document.getElementById('game-industrie');
  if (!container) return null;

  let idx = 0;
  const dotsEl = container.querySelector('.timeline-progress');
  const scenarioEl = document.getElementById('timeline-scenario');
  const fbEl = document.getElementById('timeline-feedback');

  function showScenario() {
    if (idx >= INDUSTRIE_TIMELINE.length) {
      container.innerHTML = `
        <div class="quiz-result">
          <p style="font-size:18px;color:#ffd700;margin-bottom:8px;">Alle 5 Branchen durchgespielt!</p>
          <p style="color:#a0aec0;">Du hast gesehen, wie KI und Roboter die Arbeitswelt komplett veraendern \u2013 schneller, praeziser, aber auch mit grossen Fragen fuer die Zukunft.</p>
        </div>
      `;
      SoundMgr.play('complete');
      const state = Storage.load();
      state.progress.industrie.interactiveDone = true;
      Storage.save(state);
      addPoints(10, 'industrie');
      return;
    }

    // Update dots
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < INDUSTRIE_TIMELINE.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'timeline-dot' + (i < idx ? ' done' : i === idx ? ' active' : '');
        dotsEl.appendChild(dot);
      }
    }

    const s = INDUSTRIE_TIMELINE[idx];
    fbEl.classList.add('hidden');
    fbEl.innerHTML = '';
    scenarioEl.innerHTML = `
      <div class="scenario-card">
        <div class="scenario-title">${s.title}</div>
        <span class="vorher-label before">VORHER</span>
        <p class="scenario-text">${s.vorher}</p>
        <p style="font-size:15px;font-weight:600;color:#ffd700;margin-bottom:12px;">Was hat sich veraendert?</p>
        <div class="scenario-options">
          ${s.options.map((o, i) => `<button class="scenario-option" data-idx="${i}">${String.fromCharCode(65 + i)}) ${o}</button>`).join('')}
        </div>
      </div>
    `;
    scenarioEl.querySelectorAll('.scenario-option').forEach(btn => {
      btn.addEventListener('click', () => handleTimelineChoice(s, btn, parseInt(btn.dataset.idx)));
    });
  }

  function handleTimelineChoice(s, btn, chosenIdx) {
    const isCorrect = chosenIdx === s.correct;

    // Disable alle Buttons
    scenarioEl.querySelectorAll('.scenario-option').forEach((b, i) => {
      b.classList.add('disabled');
      b.style.pointerEvents = 'none';
      if (i === s.correct) b.classList.add('correct');
      else if (i === chosenIdx && !isCorrect) b.classList.add('wrong');
    });

    SoundMgr.play(isCorrect ? 'correct' : 'wrong');

    // Nachher-Reveal mit Feedback
    let fbHTML = '';
    if (!isCorrect) {
      fbHTML += `<div class="quiz-feedback wrong-fb" style="margin-bottom:16px;"><p>Nicht ganz! Die richtige Antwort ist ${String.fromCharCode(65 + s.correct)}.</p></div>`;
    }
    fbHTML += `
      <div class="nachher-reveal">
        <span class="vorher-label after">NACHHER</span>
        <p>${s.nachher}</p>
      </div>
      <div class="stat-reveal" id="stat-reveal-${idx}">${s.stat}</div>
      <div style="text-align:center;margin-top:16px;">
        <button class="btn btn-primary btn-sm" id="timeline-next">${idx < INDUSTRIE_TIMELINE.length - 1 ? 'Weiter \u2192' : 'Abschliessen'}</button>
      </div>
    `;
    fbEl.innerHTML = fbHTML;
    fbEl.classList.remove('hidden');

    // GSAP Animation fuer Stat-Reveal
    const statEl = document.getElementById('stat-reveal-' + idx);
    if (statEl && typeof gsap !== 'undefined') {
      gsap.from(statEl, { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.3 });
    }

    document.getElementById('timeline-next').addEventListener('click', () => { idx++; showScenario(); });
  }

  showScenario();
  return true;
}

/* ── Bereich 6: Ethics Scenarios ── */
function initEthicsGame() {
  const container = document.getElementById('game-ethik');
  if (!container) return null;

  let idx = 0;
  const dotsEl = container.querySelector('.ethics-progress');
  const scenarioEl = document.getElementById('eth-scenario');
  const fbEl = document.getElementById('eth-feedback');

  function showScenario() {
    if (idx >= ETHICS_SCENARIOS.length) {
      container.innerHTML = `
        <div class="quiz-result">
          <p style="font-size:18px;color:#ffd700;margin-bottom:8px;">Alle 4 Szenarien durchgespielt!</p>
          <p style="color:#a0aec0;">Ethische Fragen haben selten eine einfache Antwort. Wichtig ist, dass du dir Gedanken machst!</p>
        </div>
      `;
      SoundMgr.play('complete');
      const state = Storage.load();
      state.progress.ethik.interactiveDone = true;
      Storage.save(state);
      addPoints(10, 'ethik');
      return;
    }

    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < ETHICS_SCENARIOS.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'ethics-dot' + (i < idx ? ' done' : i === idx ? ' active' : '');
        dotsEl.appendChild(dot);
      }
    }

    const s = ETHICS_SCENARIOS[idx];
    fbEl.classList.add('hidden');
    scenarioEl.innerHTML = `
      <div class="scenario-card">
        <div class="scenario-title">${s.title}</div>
        <p class="scenario-text">${s.text}</p>
        <p style="font-size:15px;font-weight:600;color:#b026ff;margin-bottom:12px;">Was denkst du?</p>
        <div class="scenario-options">
          ${s.options.map((o, i) => `<button class="scenario-option" data-idx="${i}">${String.fromCharCode(65 + i)}) ${o}</button>`).join('')}
        </div>
      </div>
    `;
    scenarioEl.querySelectorAll('.scenario-option').forEach(btn => {
      btn.addEventListener('click', () => {
        scenarioEl.querySelectorAll('.scenario-option').forEach(b => { b.classList.add('disabled'); b.style.pointerEvents = 'none'; });
        btn.classList.add('selected');
        fbEl.innerHTML = `<div class="scenario-explanation"><p>${s.explanation}</p><button class="btn btn-primary btn-sm mt-4" id="eth-next">${idx < ETHICS_SCENARIOS.length - 1 ? 'Naechstes Szenario →' : 'Abschliessen'}</button></div>`;
        fbEl.classList.remove('hidden');
        document.getElementById('eth-next').addEventListener('click', () => { idx++; showScenario(); });
      });
    });
  }

  showScenario();
  return true;
}

/* ── Reflection Form ── */
function submitReflection() {
  const btn = document.getElementById('reflection-submit');
  if (btn) {
    btn.textContent = 'Danke fuer dein Feedback! 🙌';
    btn.disabled = true;
    btn.style.background = '#39ff14';
    btn.style.color = '#0a0e27';
  }
}

/* ── Keyboard Navigation ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
});
