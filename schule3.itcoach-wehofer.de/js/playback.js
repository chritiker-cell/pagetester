// Playback module using Tone.js

const Playback = {
    synth: null,
    piano: null,
    pianoLoaded: false,
    isPlaying: false,
    isLooping: false,
    tempo: 80,
    scheduledEvents: [],
    currentPiece: null,
    onNotePlay: null,
    onNoteEnd: null,
    onPlaybackEnd: null,
    onPositionUpdate: null,
    animationFrame: null,

    // Initialize the synthesizer
    init() {
        if (this.synth) return;

        // Create a polyphonic synth as fallback
        this.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: 'triangle'
            },
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 0.8
            }
        }).toDestination();

        // Add a limiter to prevent clipping
        const limiter = new Tone.Limiter(-6).toDestination();
        this.synth.connect(limiter);
    },

    // Load piano samples
    async loadPiano() {
        if (this.piano) return;

        return new Promise((resolve) => {
            this.piano = new Tone.Sampler({
                urls: {
                    'A0': 'A0.mp3',
                    'C1': 'C1.mp3',
                    'D#1': 'Ds1.mp3',
                    'F#1': 'Fs1.mp3',
                    'A1': 'A1.mp3',
                    'C2': 'C2.mp3',
                    'D#2': 'Ds2.mp3',
                    'F#2': 'Fs2.mp3',
                    'A2': 'A2.mp3',
                    'C3': 'C3.mp3',
                    'D#3': 'Ds3.mp3',
                    'F#3': 'Fs3.mp3',
                    'A3': 'A3.mp3',
                    'C4': 'C4.mp3',
                    'D#4': 'Ds4.mp3',
                    'F#4': 'Fs4.mp3',
                    'A4': 'A4.mp3',
                    'C5': 'C5.mp3',
                    'D#5': 'Ds5.mp3',
                    'F#5': 'Fs5.mp3',
                    'A5': 'A5.mp3',
                    'C6': 'C6.mp3',
                    'D#6': 'Ds6.mp3',
                    'F#6': 'Fs6.mp3',
                    'A6': 'A6.mp3',
                    'C7': 'C7.mp3',
                    'D#7': 'Ds7.mp3',
                    'F#7': 'Fs7.mp3',
                    'A7': 'A7.mp3',
                    'C8': 'C8.mp3'
                },
                release: 1,
                baseUrl: 'https://tonejs.github.io/audio/salamander/',
                onload: () => {
                    this.pianoLoaded = true;
                    console.log('Piano samples loaded');
                    resolve();
                }
            }).toDestination();
        });
    },

    // Get the active instrument (piano if loaded, otherwise synth)
    getInstrument() {
        return this.pianoLoaded && this.piano ? this.piano : this.synth;
    },

    // Set the tempo
    setTempo(bpm) {
        this.tempo = bpm;
        Tone.Transport.bpm.value = bpm;
    },

    // Load a piece for playback
    loadPiece(piece) {
        this.currentPiece = piece;
        this.setTempo(piece.tempo || CONFIG.playback.defaultTempo);
    },

    // Start playback
    async play() {
        if (this.isPlaying) return;

        // Initialize Tone.js audio context
        await Tone.start();

        this.init();

        // Try to load piano samples (non-blocking)
        if (!this.pianoLoaded) {
            this.loadPiano().catch(e => console.warn('Could not load piano:', e));
        }

        this.isPlaying = true;

        // Clear any existing scheduled events
        this.clearSchedule();

        // Get all notes for playback
        const playbackNotes = PieceGenerator.getPlaybackNotes(this.currentPiece);

        if (playbackNotes.length === 0) {
            this.stop();
            return;
        }

        // Calculate total duration
        const lastNote = playbackNotes[playbackNotes.length - 1];
        const totalBeats = lastNote.startTime + CONFIG.noteDurations[lastNote.duration];
        const secondsPerBeat = 60 / this.tempo;
        this.totalDuration = totalBeats * secondsPerBeat;

        // Schedule all notes
        playbackNotes.forEach(note => {
            const startTimeSeconds = note.startTime * secondsPerBeat;
            const durationSeconds = CONFIG.noteDurations[note.duration] * secondsPerBeat * 0.9;

            // Get pitches (single note or chord)
            const pitches = note.keys || [note.pitch];

            // Convert to Tone.js format (e.g., "C4" -> "C4")
            const tonePitches = pitches.map(p => this.convertPitchForTone(p));

            // Schedule the note
            const eventId = Tone.Transport.schedule(time => {
                // Play the note(s) using piano or synth
                const instrument = this.getInstrument();
                instrument.triggerAttackRelease(tonePitches, durationSeconds, time);

                // Callback for visual highlighting
                if (this.onNotePlay) {
                    Tone.Draw.schedule(() => {
                        this.onNotePlay(note.measureIndex, note.noteIndex, note.hand);
                    }, time);
                }

                // Schedule note end callback
                if (this.onNoteEnd) {
                    Tone.Draw.schedule(() => {
                        this.onNoteEnd(note.measureIndex, note.noteIndex, note.hand);
                    }, time + durationSeconds);
                }
            }, startTimeSeconds);

            this.scheduledEvents.push(eventId);
        });

        // Schedule end of playback
        const endEventId = Tone.Transport.schedule(time => {
            Tone.Draw.schedule(() => {
                if (this.isLooping) {
                    // Restart from beginning
                    Tone.Transport.position = 0;
                } else {
                    this.stop();
                    if (this.onPlaybackEnd) {
                        this.onPlaybackEnd();
                    }
                }
            }, time);
        }, this.totalDuration + 0.1);

        this.scheduledEvents.push(endEventId);

        // Start position tracking animation
        this.startPositionTracking();

        // Start transport
        Tone.Transport.start();
    },

    // Track playback position for visual indicator
    startPositionTracking() {
        const updatePosition = () => {
            if (!this.isPlaying) return;

            const position = Tone.Transport.seconds;
            const progress = position / this.totalDuration;

            if (this.onPositionUpdate) {
                this.onPositionUpdate(progress, position);
            }

            this.animationFrame = requestAnimationFrame(updatePosition);
        };
        updatePosition();
    },

    stopPositionTracking() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    },

    // Pause playback
    pause() {
        if (!this.isPlaying) return;

        Tone.Transport.pause();
        this.isPlaying = false;
    },

    // Resume playback
    resume() {
        if (this.isPlaying) return;

        Tone.Transport.start();
        this.isPlaying = true;
    },

    // Stop playback
    stop() {
        Tone.Transport.stop();
        Tone.Transport.position = 0;
        this.isPlaying = false;

        this.clearSchedule();
        this.stopPositionTracking();

        // Release any held notes
        if (this.synth) {
            this.synth.releaseAll();
        }
        if (this.piano) {
            this.piano.releaseAll();
        }

        // Clear all highlights and playback line
        NotationRenderer.clearHighlights();
        NotationRenderer.hidePlaybackLine();

        // Reset position
        if (this.onPositionUpdate) {
            this.onPositionUpdate(0, 0);
        }
    },

    // Toggle loop mode
    toggleLoop() {
        this.isLooping = !this.isLooping;
        return this.isLooping;
    },

    // Set loop state
    setLoop(enabled) {
        this.isLooping = enabled;
    },

    // Clear scheduled events
    clearSchedule() {
        this.scheduledEvents.forEach(id => {
            Tone.Transport.clear(id);
        });
        this.scheduledEvents = [];
    },

    // Convert pitch to Tone.js format
    convertPitchForTone(pitch) {
        // Tone.js uses scientific pitch notation like "C4"
        // Our format is already compatible, but we need to handle sharps/flats
        if (!pitch) return 'C4';

        // Replace sharp symbol if needed
        return pitch.replace('#', '#').replace('b', 'b');
    },

    // Play a preview note (for testing)
    async playNote(pitch, duration = '8n') {
        await Tone.start();
        this.init();

        const tonePitch = this.convertPitchForTone(pitch);
        this.synth.triggerAttackRelease(tonePitch, duration);
    },

    // Get current playback state
    getState() {
        return {
            isPlaying: this.isPlaying,
            isLooping: this.isLooping,
            tempo: this.tempo,
            position: Tone.Transport.position
        };
    },

    // Set callbacks
    setCallbacks(onNotePlay, onNoteEnd, onPlaybackEnd, onPositionUpdate) {
        this.onNotePlay = onNotePlay;
        this.onNoteEnd = onNoteEnd;
        this.onPlaybackEnd = onPlaybackEnd;
        this.onPositionUpdate = onPositionUpdate;
    },

    // Cleanup
    dispose() {
        this.stop();
        if (this.synth) {
            this.synth.dispose();
            this.synth = null;
        }
    }
};
