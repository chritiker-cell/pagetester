**Projekt-Spezifikation: "NeoKeys – Die intelligente Noten- \& Harmonielehre App"**

1\. Projekt-Vision

Entwicklung einer interaktiven Web-Applikation, die den Prozess des Notenlesens und das Verständnis von Harmonielehre radikal vereinfacht. Die App kombiniert algorithmisch generierte Blattspiel-Übungen mit einem tiefgehenden, interaktiven Training für Akkorde, Skalen und Arpeggios über den gesamten Klavierumfang.

2\. Kernfunktionen (Features)

A. Dynamisches Notenlese-Training (Sight-Reading)



&nbsp;   Level-System: Didaktischer Aufbau von Anfänger (Einzelnoten im Fünffingerraum) bis Fortgeschrittene (komplexe Polyrhythmik, Vorzeichenwechsel).

&nbsp;   VexFlow-Rendering: Gestochen scharfe Notendarstellung, die sich dynamisch an die Bildschirmgröße anpasst.

&nbsp;   Echtzeit-Feedback: Überprüfung des gespielten Tons (via MIDI oder Mikrofon) mit sofortiger visueller Rückmeldung (Grün/Rot) direkt in der Note.



B. Harmonielehre \& Klavier-Mastery



&nbsp;   Akkord-Modul: Systematisches Erlernen von Triaden (Dreiklängen) und Vierklängen in allen Umkehrungen (Inversions).

&nbsp;   Arpeggio-Trainer: Training von gebrochenen Akkorden über mehrere Oktaven, um das gesamte Klavier-Layout zu verinnerlichen.

&nbsp;   Skalen-Zentrum: Interaktive Visualisierung von Dur- und Moll-Tonleitern (natürlich, harmonisch, melodisch) über das gesamte Keyboard.

&nbsp;   Interaktives Keyboard-Overlay: Ein virtuelles Klavier am unteren Bildschirmrand zeigt die korrekten Fingersätze und Tastenpositionen synchron zur Notation an.



3\. Zielgruppen



&nbsp;   Anfänger: Fokus auf Orientierung im Liniensystem und einfache C-Dur-Muster.

&nbsp;   Wiedereinsteiger: Fokus auf Auffrischung der Theorie und Unabhängigkeit der Hände.

&nbsp;   Fortgeschrittene: Fokus auf Schnelligkeit beim Erkennen von komplexen Akkord-Strukturen und Arpeggios.



4\. Technische Anforderungen \& Stack (2026)

Bereich	Technologie / Tools

Frontend	React.js oder Vue.js (für reaktive UI-Komponenten).

Notensatz	VexFlow (SVG-Rendering der Noten).

Audio/Theorie	Tone.js für Audio-Playback; Tonal.js für Skalen-Logik.

Backend-Logik	Python mit Music21 für die algorithmische Notengenerierung.

API	FastAPI für schnelle Datenübertragung der Notendaten.

Sicherheit	Auth0 für User-Profile und Stripe für Abonnements.



5\. Spezifische Rollenanforderungen für das Team

Musik-Theorie Agent:



&nbsp;   Muss Algorithmen erstellen, die Intervalle und Chord-Voicings logisch korrekt generieren.

&nbsp;   Fokus auf progressive Schwierigkeitsgrade beim Notenlesen.



UI/UX Designer:



&nbsp;   Entwurf eines "Fokus-Modus" für das Üben am Klavier.

&nbsp;   Gestaltung eines intuitiven Switchers zwischen Notenansicht und dem virtuellen Keyboard.



Frontend Developer:



&nbsp;   Implementierung der MIDI-Schnittstelle (Web MIDI API), damit Nutzer ihr E-Piano anschließen können.

&nbsp;   Synchronisation von VexFlow-Noten und dem virtuellen Klavier-Highlighting.



Backend Developer:



&nbsp;   Bereitstellung einer Datenbank für Fortschrittstracking (Welche Akkorde beherrscht der Nutzer bereits?).

&nbsp;   Sicherstellung, dass die Generierung von Arpeggio-Übungen keine unspielbaren Sprünge enthält.



6\. Erfolgskriterien (KPIs)



&nbsp;   Latenz: Die Zeit von der Generierungs-Anfrage bis zum Erscheinen der Noten muss unter 200ms liegen.

&nbsp;   Genauigkeit: 100% korrekte musikalische Notation gemäß Standard-Regeln.

&nbsp;   User Retention: Motivation durch tägliche "Streaks" und sichtbare Fortschrittskurven im Harmonielehre-Modul.





**Aufbau Web-APP**

Für eine WebApp im Jahr 2026, die sowohl das

Blattspiel (Sight-Reading) als auch die Harmonielehre abdeckt, empfehle ich einen Aufbau, der zwischen "Üben" (Tun) und "Lernen" (Verstehen) unterscheidet. Das Design sollte minimalistisch sein, um nicht von den Noten abzulenken.

Hier ist der strategische Aufbau der Webseite:

1\. Die Navigationsstruktur (Header)

Das Menü sollte klar nach Lernzielen getrennt sein:



&nbsp;   \[Sight-Reading]: Der Kern-Algorithmus (ähnlich wie SightReadingFactory).

&nbsp;   \[Chords \& Arpeggios]: Fokus auf vertikale Harmonik und technische Geläufigkeit.

&nbsp;   \[Scales]: Fokus auf horizontale Melodik und das gesamte Klavier-Layout.

&nbsp;   \[My Progress]: Dashboard mit Statistiken und "Level-Up"-Anzeigen.

&nbsp;   \[Settings]: MIDI-Setup, Audio-Kalibrierung und Dark-Mode.



2\. Seiten-Layouts \& Funktionen

A. Der "Sight-Reading" Bereich (Notenlesen)



&nbsp;   Sidebar (Konfiguration): Auswahl von Level, Taktart, Tonart und Ambitus.

&nbsp;   Main Stage: Ein großes VexFlow-Canvas.

&nbsp;   Interaktive Steuerung:

&nbsp;       Einzähler-Metronom (visuell \& auditiv).

&nbsp;       Virtual Keyboard Overlay: Kann ein- oder ausgeblendet werden.

&nbsp;       Feedback-Modus: Noten werden bei korrekter MIDI-Eingabe in Echtzeit grün.



B. Das "Chords \& Arpeggios" Modul



&nbsp;   Modus-Umschalter: Auswahl zwischen Static (Akkorde erkennen) und Flow (Arpeggios spielen).

&nbsp;   Inversion-Trainer: Spezieller Bereich, um Umkehrungen zu üben. Die App zeigt einen Akkord (z.B. C-Dur Grundstellung) und verlangt dann per Zufall die 1. oder 2. Umkehrung.

&nbsp;   Arpeggio-Builder: Visualisierung über 2-4 Oktaven. Das Backend generiert flüssige Übergänge, um das "Greifen" über das ganze Klavier zu trainieren.



C. Das "Scales" Zentrum (Skalen)



&nbsp;   Interaktiver Quintenzirkel: Als grafisches Auswahl-Tool für die Tonarten.

&nbsp;   Full-Keyboard-View: Ein langes, horizontales Klavier-Display, das die gesamte Skala beleuchtet, während man die Noten oben im System liest.

&nbsp;   Varianten-Wähler: Schneller Wechsel zwischen Dur, Moll (natürlich, harmonisch, melodisch) und Pentatonik.



3\. Innovative Zusatz-Features für 2026



&nbsp;   "Daily Quest" (Gamification): Jeden Tag eine kleine Übung aus jedem Bereich (1x Skala, 1x Akkordfolge, 1x Notenzeile lesen).

&nbsp;   Hands-Free Mode: Unterstützung für Bluetooth-Fußpedale, um neue Übungen zu generieren, ohne die Hände von den Tasten zu nehmen.

&nbsp;   AI-Coach (Feedback-Agent): Eine kleine Anzeige, die analysiert: "Du hast Schwierigkeiten mit dem dritten Finger bei Ab-Dur Arpeggios. Sollen wir das gezielt üben?"



4\. Technischer Aufbau-Vorschlag (Sitemap)



&nbsp;   Landingpage: Kurze Demo, "Start-Button", Login.

&nbsp;   Dashboard: Übersicht über den aktuellen "Skill-Tree" (z.B. "C-Dur Level 5 erreicht").

&nbsp;   Übungs-Workspace: Das Herzstück (Single Page Application - SPA).

&nbsp;       Oben: Fortschrittsbalken \& Metronom.

&nbsp;       Mitte: Dynamische Notenanzeige (VexFlow).

&nbsp;       Unten: Interaktives Klavier (Tone.js für Sound).



5\. Empfehlung für das UI-Design

Verwende ein "Clean Classroom" Design:



&nbsp;   Viel Weißraum (oder tiefes Dunkelblau für den Dark Mode).

&nbsp;   Keine unnötigen Animationen, die vom Rhythmus ablenken könnten.

&nbsp;   Große, gut lesbare Notenköpfe, die sich auf Tablets (wie dem iPad Pro) automatisch auf die volle Breite skalieren.



Dieses Setup stellt sicher, dass die App professionell wirkt und für ernsthafte Klavierschüler sowie Hobby-Musiker gleichermaßen effizient ist.



