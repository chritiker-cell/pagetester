// Music piece generator

const PieceGenerator = {
    // Generate a complete piece based on settings
    generate(settings) {
        // Validate and get level config with fallback
        const level = settings.level || 'beginner';
        const levelConfig = CONFIG.levels[level] || CONFIG.levels.beginner;

        const key = getRandomKey(settings.keyDifficulty);
        const timeSig = CONFIG.timeSignatures[settings.timeSignature] || CONFIG.timeSignatures['4/4'];
        const measureCount = settings.measureCount || 8;

        const piece = {
            key: key,
            timeSignature: settings.timeSignature,
            measureCount: measureCount,
            trebleNotes: [],
            bassNotes: [],
            tempo: settings.tempo || CONFIG.playback.defaultTempo
        };

        // Store the scale for this key for pitch generation
        this.currentScale = CONFIG.scales[key.vexKey] || CONFIG.scales['C'];

        // Generate notes based on level
        if (level === 'beginner') {
            this.generateBeginnerPiece(piece, levelConfig, timeSig);
        } else if (level === 'intermediate') {
            this.generateIntermediatePiece(piece, levelConfig, timeSig);
        } else {
            this.generateExpertPiece(piece, levelConfig, timeSig);
        }

        return piece;
    },

    // Beginner: Alternating hands, never simultaneous
    generateBeginnerPiece(piece, config, timeSig) {
        const beatsPerMeasure = timeSig.beats;
        let currentTime = 0;
        let useRightHand = true; // Start with right hand
        let measuresPerHand = Math.ceil(piece.measureCount / 4); // Switch hands every few measures

        for (let m = 0; m < piece.measureCount; m++) {
            // Switch hands every few measures
            if (m > 0 && m % measuresPerHand === 0) {
                useRightHand = !useRightHand;
            }

            const measureStartTime = currentTime;
            const notes = this.generateMeasureNotes(config, timeSig, useRightHand, false);

            // Assign notes to correct hand, rests to the other
            if (useRightHand) {
                piece.trebleNotes[m] = this.assignTimings(notes, measureStartTime);
                piece.bassNotes[m] = this.createRestMeasure(timeSig, measureStartTime);
            } else {
                piece.trebleNotes[m] = this.createRestMeasure(timeSig, measureStartTime);
                piece.bassNotes[m] = this.assignTimings(notes, measureStartTime);
            }

            currentTime += beatsPerMeasure;
        }

        // Add fingerings
        this.addFingerings(piece, 'beginner');
    },

    // Intermediate: Both hands, simple patterns
    generateIntermediatePiece(piece, config, timeSig) {
        const beatsPerMeasure = timeSig.beats;
        let currentTime = 0;

        for (let m = 0; m < piece.measureCount; m++) {
            const measureStartTime = currentTime;

            // Right hand: melody
            const melodyNotes = this.generateMeasureNotes(config, timeSig, true, false);
            piece.trebleNotes[m] = this.assignTimings(melodyNotes, measureStartTime);

            // Left hand: accompaniment pattern
            const accompNotes = this.generateAccompaniment(config, timeSig, measureStartTime);
            piece.bassNotes[m] = accompNotes;

            currentTime += beatsPerMeasure;
        }

        // Add fingerings
        this.addFingerings(piece, 'intermediate');
    },

    // Expert: Complex patterns, both hands independent
    generateExpertPiece(piece, config, timeSig) {
        const beatsPerMeasure = timeSig.beats;
        let currentTime = 0;

        for (let m = 0; m < piece.measureCount; m++) {
            const measureStartTime = currentTime;

            // Right hand: melody with possible chords
            const melodyNotes = this.generateMeasureNotes(config, timeSig, true, true);
            piece.trebleNotes[m] = this.assignTimings(melodyNotes, measureStartTime);

            // Left hand: independent pattern with chords
            const bassNotes = this.generateMeasureNotes(config, timeSig, false, true);
            piece.bassNotes[m] = this.assignTimings(bassNotes, measureStartTime);

            currentTime += beatsPerMeasure;
        }

        // Add fingerings
        this.addFingerings(piece, 'expert');
    },

    // Generate notes for one measure
    generateMeasureNotes(config, timeSig, isRightHand, allowChords) {
        const notes = [];
        const beatsPerMeasure = timeSig.beats;
        let remainingBeats = beatsPerMeasure;
        const range = isRightHand ? config.rightHandRange : config.leftHandRange;

        while (remainingBeats > 0) {
            // Choose a duration that fits
            const duration = this.chooseDuration(config.noteValues, remainingBeats);
            const durationBeats = CONFIG.noteDurations[duration];

            // Generate pitch(es)
            const pitch = this.generatePitch(range);

            const noteData = {
                pitch: pitch,
                duration: duration,
                isRest: false
            };

            // Maybe make it a chord
            if (allowChords && config.maxNotesPerChord > 1 && Math.random() < 0.3) {
                const chordPitches = this.generateChord(pitch, config.maxNotesPerChord, range);
                noteData.keys = chordPitches;
            }

            notes.push(noteData);
            remainingBeats -= durationBeats;
        }

        return notes;
    },

    // Generate accompaniment pattern for left hand
    generateAccompaniment(config, timeSig, startTime) {
        const notes = [];
        const beatsPerMeasure = timeSig.beats;
        const range = config.leftHandRange;
        let currentTime = startTime;

        // Simple patterns: whole note, or quarter notes
        if (beatsPerMeasure === 4) {
            // Pattern: bass note + chord + bass note + chord (Alberti-like)
            const bassNote = this.generatePitch(range);

            if (Math.random() < 0.5) {
                // Whole note
                notes.push({
                    pitch: bassNote,
                    duration: 'w',
                    isRest: false,
                    startTime: currentTime
                });
            } else {
                // Quarter note pattern
                for (let i = 0; i < 4; i++) {
                    notes.push({
                        pitch: this.generatePitch(range),
                        duration: 'q',
                        isRest: false,
                        startTime: currentTime + i
                    });
                }
            }
        } else if (beatsPerMeasure === 3) {
            // 3/4: dotted half or quarters
            if (Math.random() < 0.5) {
                notes.push({
                    pitch: this.generatePitch(range),
                    duration: 'h',
                    dotted: true,
                    isRest: false,
                    startTime: currentTime
                });
            } else {
                for (let i = 0; i < 3; i++) {
                    notes.push({
                        pitch: this.generatePitch(range),
                        duration: 'q',
                        isRest: false,
                        startTime: currentTime + i
                    });
                }
            }
        } else {
            // 2/4
            notes.push({
                pitch: this.generatePitch(range),
                duration: 'h',
                isRest: false,
                startTime: currentTime
            });
        }

        return notes;
    },

    // Create a measure of rests
    createRestMeasure(timeSig, startTime) {
        const beatsPerMeasure = timeSig.beats;

        if (beatsPerMeasure === 4) {
            return [{
                duration: 'w',
                isRest: true,
                startTime: startTime
            }];
        } else if (beatsPerMeasure === 3) {
            return [{
                duration: 'h',
                isRest: true,
                dotted: true,
                startTime: startTime
            }];
        } else {
            return [{
                duration: 'h',
                isRest: true,
                startTime: startTime
            }];
        }
    },

    // Choose a duration that fits remaining beats
    chooseDuration(allowedDurations, remainingBeats) {
        // Filter durations that fit
        const fitting = allowedDurations.filter(d => CONFIG.noteDurations[d] <= remainingBeats);

        if (fitting.length === 0) {
            return 'q'; // Fallback
        }

        // Prefer longer notes for simpler reading
        const weighted = [];
        fitting.forEach(d => {
            const duration = CONFIG.noteDurations[d];
            // Weight longer notes more heavily
            const weight = duration >= 1 ? 3 : (duration >= 0.5 ? 2 : 1);
            for (let i = 0; i < weight; i++) {
                weighted.push(d);
            }
        });

        return getRandomItem(weighted);
    },

    // Generate a random pitch within range using only diatonic notes
    generatePitch(range) {
        const scale = this.currentScale || ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        // Build list of all diatonic notes within range
        const lowParsed = parseNote(range.low);
        const highParsed = parseNote(range.high);

        if (!lowParsed || !highParsed) {
            return 'C4';
        }

        const availableNotes = [];

        // Iterate through octaves
        for (let octave = lowParsed.octave; octave <= highParsed.octave; octave++) {
            for (const noteName of scale) {
                const pitch = noteName + octave;
                const midi = this.noteNameToMidi(noteName, octave);
                const lowMidi = noteToMidi(range.low);
                const highMidi = noteToMidi(range.high);

                if (midi >= lowMidi && midi <= highMidi) {
                    availableNotes.push(pitch);
                }
            }
        }

        if (availableNotes.length === 0) {
            return 'C4';
        }

        return getRandomItem(availableNotes);
    },

    // Convert note name and octave to MIDI number
    noteNameToMidi(noteName, octave) {
        const baseNotes = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
        const baseLetter = noteName.charAt(0).toUpperCase();
        let semitone = baseNotes[baseLetter] || 0;

        // Handle accidentals
        if (noteName.includes('#')) {
            semitone += 1;
        } else if (noteName.includes('b') && noteName.length > 1) {
            semitone -= 1;
        }

        // Handle Cb (which is B of previous octave) and similar edge cases
        if (semitone < 0) {
            semitone += 12;
            octave -= 1;
        } else if (semitone > 11) {
            semitone -= 12;
            octave += 1;
        }

        return (octave + 1) * 12 + semitone;
    },

    // Convert MIDI number to note string (using current scale)
    midiToNote(midi) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midi / 12) - 1;
        const noteIndex = midi % 12;
        return noteNames[noteIndex] + octave;
    },

    // Generate a simple chord
    generateChord(rootPitch, maxNotes, range) {
        const rootMidi = noteToMidi(rootPitch);
        const pitches = [rootPitch];

        // Add third (3 or 4 semitones)
        const third = Math.random() < 0.7 ? 4 : 3; // Major third more common
        const thirdMidi = rootMidi + third;

        // Add fifth (7 semitones)
        const fifthMidi = rootMidi + 7;

        const highMidi = noteToMidi(range.high);

        if (thirdMidi <= highMidi && pitches.length < maxNotes) {
            pitches.push(this.midiToNote(thirdMidi));
        }

        if (fifthMidi <= highMidi && pitches.length < maxNotes) {
            pitches.push(this.midiToNote(fifthMidi));
        }

        return pitches;
    },

    // Assign timing information to notes
    assignTimings(notes, measureStartTime) {
        let currentTime = measureStartTime;

        return notes.map(note => {
            const noteCopy = { ...note };
            noteCopy.startTime = currentTime;
            currentTime += CONFIG.noteDurations[note.duration] || 1;
            return noteCopy;
        });
    },

    // Add fingerings to the piece
    addFingerings(piece, level) {
        // Add fingerings to treble notes
        piece.trebleNotes.forEach((measure, mIdx) => {
            if (!measure) return;

            let prevPitch = null;
            measure.forEach((note, nIdx) => {
                if (note.isRest) return;

                const pitch = note.keys ? note.keys[0] : note.pitch;
                note.fingering = this.calculateFingering(pitch, prevPitch, true, level);
                prevPitch = pitch;
            });
        });

        // Add fingerings to bass notes
        piece.bassNotes.forEach((measure, mIdx) => {
            if (!measure) return;

            let prevPitch = null;
            measure.forEach((note, nIdx) => {
                if (note.isRest) return;

                const pitch = note.keys ? note.keys[0] : note.pitch;
                note.fingering = this.calculateFingering(pitch, prevPitch, false, level);
                prevPitch = pitch;
            });
        });
    },

    // Calculate fingering for a note
    calculateFingering(pitch, prevPitch, isRightHand, level) {
        // Simple fingering rules
        if (!prevPitch) {
            // First note: use thumb or middle finger
            return isRightHand ? 1 : 5;
        }

        const currentMidi = noteToMidi(pitch);
        const prevMidi = noteToMidi(prevPitch);
        const interval = currentMidi - prevMidi;

        if (isRightHand) {
            // Right hand ascending
            if (interval > 0) {
                if (interval <= 2) return Math.min(5, Math.max(1, 2 + Math.floor(Math.random() * 2)));
                if (interval <= 4) return Math.min(5, 3);
                return 5;
            }
            // Right hand descending
            else if (interval < 0) {
                if (interval >= -2) return Math.max(1, 3 - Math.floor(Math.random() * 2));
                if (interval >= -4) return 2;
                return 1;
            }
            // Same note
            return 3;
        } else {
            // Left hand ascending
            if (interval > 0) {
                if (interval <= 2) return Math.max(1, 4 - Math.floor(Math.random() * 2));
                if (interval <= 4) return 2;
                return 1;
            }
            // Left hand descending
            else if (interval < 0) {
                if (interval >= -2) return Math.min(5, 2 + Math.floor(Math.random() * 2));
                if (interval >= -4) return 4;
                return 5;
            }
            // Same note
            return 3;
        }
    },

    // Get all notes in playback order
    getPlaybackNotes(piece) {
        const allNotes = [];

        // Combine treble and bass notes with their timings
        piece.trebleNotes.forEach((measure, mIdx) => {
            if (!measure) return;
            measure.forEach((note, nIdx) => {
                if (!note.isRest) {
                    allNotes.push({
                        ...note,
                        measureIndex: mIdx,
                        noteIndex: nIdx,
                        hand: 'right'
                    });
                }
            });
        });

        piece.bassNotes.forEach((measure, mIdx) => {
            if (!measure) return;
            measure.forEach((note, nIdx) => {
                if (!note.isRest) {
                    allNotes.push({
                        ...note,
                        measureIndex: mIdx,
                        noteIndex: nIdx,
                        hand: 'left'
                    });
                }
            });
        });

        // Sort by start time
        allNotes.sort((a, b) => a.startTime - b.startTime);

        return allNotes;
    }
};
