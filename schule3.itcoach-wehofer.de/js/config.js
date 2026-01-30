// Configuration for Sight Reading Trainer

const CONFIG = {
    // Key signatures with VexFlow key notation
    keys: {
        easy: [
            { name: 'C-Dur', vexKey: 'C', sharps: 0 },
            { name: 'G-Dur', vexKey: 'G', sharps: 1 },
            { name: 'D-Dur', vexKey: 'D', sharps: 2 },
            { name: 'F-Dur', vexKey: 'F', flats: 1 },
            { name: 'E-Dur', vexKey: 'E', sharps: 4 }
        ],
        hard: [
            { name: 'A-Dur', vexKey: 'A', sharps: 3 },
            { name: 'H-Dur', vexKey: 'B', sharps: 5 },
            { name: 'Fis-Dur', vexKey: 'F#', sharps: 6 },
            { name: 'B-Dur', vexKey: 'Bb', flats: 2 },
            { name: 'Es-Dur', vexKey: 'Eb', flats: 3 },
            { name: 'As-Dur', vexKey: 'Ab', flats: 4 },
            { name: 'Des-Dur', vexKey: 'Db', flats: 5 },
            { name: 'Ges-Dur', vexKey: 'Gb', flats: 6 }
        ]
    },

    // Level configurations
    levels: {
        beginner: {
            name: 'Anfaenger',
            description: 'Immer nur eine Hand, nie gleichzeitig',
            noteValues: ['w', 'h', 'q'], // whole, half, quarter
            rightHandRange: { low: 'C4', high: 'G4' }, // One hand position (5 notes)
            leftHandRange: { low: 'C3', high: 'G3' },  // One hand position (5 notes)
            allowChords: false,
            bothHandsSimultaneous: false,
            maxNotesPerChord: 1
        },
        intermediate: {
            name: 'Fortgeschritten',
            description: 'Beide Haende + einfache Akkorde',
            noteValues: ['w', 'h', 'q', '8'], // + eighth
            rightHandRange: { low: 'C4', high: 'C6' },
            leftHandRange: { low: 'C2', high: 'G4' },
            allowChords: true,
            bothHandsSimultaneous: true,
            maxNotesPerChord: 3
        },
        expert: {
            name: 'Experte',
            description: 'Komplexe Akkorde, Polyrhythmen',
            noteValues: ['w', 'h', 'q', '8', '16'], // + sixteenth
            rightHandRange: { low: 'A3', high: 'C7' },
            leftHandRange: { low: 'A1', high: 'C5' },
            allowChords: true,
            bothHandsSimultaneous: true,
            maxNotesPerChord: 4
        }
    },

    // Time signatures
    timeSignatures: {
        '4/4': { beats: 4, beatValue: 4 },
        '3/4': { beats: 3, beatValue: 4 },
        '2/4': { beats: 2, beatValue: 4 }
    },

    // Note durations in quarter notes
    noteDurations: {
        'w': 4,   // whole note
        'h': 2,   // half note
        'q': 1,   // quarter note
        '8': 0.5, // eighth note
        '16': 0.25 // sixteenth note
    },

    // VexFlow duration notation
    vexDurations: {
        'w': 'w',
        'h': 'h',
        'q': 'q',
        '8': '8',
        '16': '16'
    },

    // Note names for pitch generation (chromatic scale)
    noteNames: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],

    // Diatonic scales for each key (major scale notes)
    scales: {
        'C':  ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        'G':  ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
        'D':  ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
        'A':  ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
        'E':  ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
        'B':  ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
        'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
        'F':  ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
        'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
        'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
        'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
        'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
        'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']
    },

    // Fingering patterns for scales (ascending, right hand)
    fingeringPatterns: {
        rightAscending: [1, 2, 3, 1, 2, 3, 4, 5],
        rightDescending: [5, 4, 3, 2, 1, 3, 2, 1],
        leftAscending: [5, 4, 3, 2, 1, 3, 2, 1],
        leftDescending: [1, 2, 3, 1, 2, 3, 4, 5]
    },

    // Display settings
    display: {
        measuresPerLine: 4,
        staveWidth: 250,
        staveSpacing: 120
    },

    // Playback defaults
    playback: {
        defaultTempo: 80,
        minTempo: 40,
        maxTempo: 160
    }
};

// Helper function to get random item from array
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to get random key based on difficulty
function getRandomKey(difficulty) {
    // Fallback to 'easy' if difficulty is invalid
    const validDifficulty = (difficulty === 'easy' || difficulty === 'hard') ? difficulty : 'easy';
    const keys = CONFIG.keys[validDifficulty];
    return getRandomItem(keys);
}

// Helper function to parse note (e.g., "C4" -> { note: "C", octave: 4 })
function parseNote(noteString) {
    const match = noteString.match(/^([A-G]#?)(\d)$/);
    if (match) {
        return { note: match[1], octave: parseInt(match[2]) };
    }
    return null;
}

// Helper function to compare notes (returns -1, 0, or 1)
function compareNotes(note1, note2) {
    const parsed1 = parseNote(note1);
    const parsed2 = parseNote(note2);
    if (!parsed1 || !parsed2) return 0;

    if (parsed1.octave !== parsed2.octave) {
        return parsed1.octave - parsed2.octave;
    }

    const noteIndex1 = CONFIG.noteNames.indexOf(parsed1.note.charAt(0));
    const noteIndex2 = CONFIG.noteNames.indexOf(parsed2.note.charAt(0));
    return noteIndex1 - noteIndex2;
}

// Helper function to convert note to MIDI number for pitch ordering
function noteToMidi(noteString) {
    const parsed = parseNote(noteString);
    if (!parsed) return 0;

    const noteIndex = CONFIG.noteNames.indexOf(parsed.note.charAt(0));
    const sharpOffset = parsed.note.includes('#') ? 1 : 0;

    // MIDI: C4 = 60
    return (parsed.octave + 1) * 12 + [0, 2, 4, 5, 7, 9, 11][noteIndex] + sharpOffset;
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem('sightReadingSettings', JSON.stringify(settings));
}

// Load settings from localStorage
function loadSettings() {
    const defaults = {
        level: 'beginner',
        keyDifficulty: 'easy',
        timeSignature: '4/4',
        measureCount: 8,
        tempo: 80
    };

    const saved = localStorage.getItem('sightReadingSettings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Merge with defaults and validate
            return {
                level: ['beginner', 'intermediate', 'expert'].includes(parsed.level) ? parsed.level : defaults.level,
                keyDifficulty: ['easy', 'hard'].includes(parsed.keyDifficulty) ? parsed.keyDifficulty : defaults.keyDifficulty,
                timeSignature: ['4/4', '3/4', '2/4'].includes(parsed.timeSignature) ? parsed.timeSignature : defaults.timeSignature,
                measureCount: (parsed.measureCount >= 8 && parsed.measureCount <= 12) ? parsed.measureCount : defaults.measureCount,
                tempo: (parsed.tempo >= 40 && parsed.tempo <= 160) ? parsed.tempo : defaults.tempo
            };
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }
    return defaults;
}
