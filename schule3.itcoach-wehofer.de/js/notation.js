// Notation rendering with VexFlow

const NotationRenderer = {
    VF: null,
    renderer: null,
    context: null,
    staveNotes: [], // Store note elements for playback highlighting
    playbackLine: null,
    svgElement: null,
    notationWidth: 0,
    notationHeight: 0,
    measurePositions: [], // Store x positions for each measure

    init() {
        // Get VexFlow from global scope
        this.VF = Vex.Flow;
    },

    // Clear the display
    clear() {
        const container = document.getElementById('notation-display');
        container.innerHTML = '';
        this.staveNotes = [];
        this.playbackLine = null;
        this.svgElement = null;
        this.measurePositions = [];
        this.keyScale = null;
    },

    // Main render function for a piece
    render(piece, settings) {
        this.clear();
        this.init();

        const container = document.getElementById('notation-display');
        const containerWidth = container.clientWidth || 1000;

        // Calculate dimensions
        const measuresPerLine = CONFIG.display.measuresPerLine;
        const staveWidth = Math.min(
            CONFIG.display.staveWidth,
            Math.floor((containerWidth - 80) / measuresPerLine)
        );
        const lineCount = Math.ceil(piece.measureCount / measuresPerLine);
        const grandStaffHeight = 200; // Height for treble + bass + spacing
        const lineSpacing = 40;

        const totalHeight = lineCount * (grandStaffHeight + lineSpacing) + 50;
        const totalWidth = measuresPerLine * staveWidth + 80;

        this.notationWidth = totalWidth;
        this.notationHeight = totalHeight;
        this.piece = piece;
        this.lineCount = lineCount;
        this.measuresPerLine = measuresPerLine;
        this.grandStaffHeight = grandStaffHeight;
        this.lineSpacing = lineSpacing;
        this.staveWidth = staveWidth;

        // Store the key signature notes for accidental handling
        this.keyScale = CONFIG.scales[piece.key.vexKey] || CONFIG.scales['C'];

        // Create SVG renderer
        this.renderer = new this.VF.Renderer(container, this.VF.Renderer.Backends.SVG);
        this.renderer.resize(totalWidth, totalHeight);
        this.context = this.renderer.getContext();

        // Get the SVG element for playback line
        this.svgElement = container.querySelector('svg');

        // Render each line of measures
        for (let line = 0; line < lineCount; line++) {
            const startMeasure = line * measuresPerLine;
            const endMeasure = Math.min(startMeasure + measuresPerLine, piece.measureCount);
            const yOffset = line * (grandStaffHeight + lineSpacing) + 20;

            this.renderLine(piece, settings, startMeasure, endMeasure, yOffset, staveWidth, line === 0);
        }

        // Create playback line (hidden initially)
        this.createPlaybackLine();
    },

    // Create the playback position line
    createPlaybackLine() {
        if (!this.svgElement) return;

        // Create line element
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('id', 'playback-line');
        line.setAttribute('x1', '50');
        line.setAttribute('y1', '0');
        line.setAttribute('x2', '50');
        line.setAttribute('y2', this.notationHeight.toString());
        line.setAttribute('stroke', '#666666');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-opacity', '0.7');
        line.style.display = 'none';

        this.svgElement.appendChild(line);
        this.playbackLine = line;
    },

    // Update playback line position based on progress (0-1)
    updatePlaybackPosition(progress) {
        if (!this.playbackLine || !this.piece) return;

        // Show the line
        this.playbackLine.style.display = 'block';

        // Calculate which measure and position within measure
        const totalMeasures = this.piece.measureCount;
        const currentMeasureFloat = progress * totalMeasures;
        const currentMeasure = Math.floor(currentMeasureFloat);
        const measureProgress = currentMeasureFloat - currentMeasure;

        // Calculate which line the measure is on
        const lineIndex = Math.floor(currentMeasure / this.measuresPerLine);
        const measureInLine = currentMeasure % this.measuresPerLine;

        // Calculate x position
        const firstMeasureExtra = 40; // Extra width for first measure (clef, key sig)
        let xPos = 10; // Start position

        // Add width for measures before current
        for (let i = 0; i < measureInLine; i++) {
            if (i === 0 && lineIndex === 0) {
                xPos += this.staveWidth + firstMeasureExtra;
            } else {
                xPos += this.staveWidth;
            }
        }

        // Add progress within current measure
        const currentMeasureWidth = (measureInLine === 0 && lineIndex === 0)
            ? this.staveWidth + firstMeasureExtra
            : this.staveWidth;
        xPos += measureProgress * currentMeasureWidth;

        // Calculate y position (top and bottom of the current line's grand staff)
        const yTop = lineIndex * (this.grandStaffHeight + this.lineSpacing) + 20;
        const yBottom = yTop + this.grandStaffHeight - 15;

        // Update line position
        this.playbackLine.setAttribute('x1', xPos.toString());
        this.playbackLine.setAttribute('x2', xPos.toString());
        this.playbackLine.setAttribute('y1', yTop.toString());
        this.playbackLine.setAttribute('y2', yBottom.toString());
    },

    // Hide the playback line
    hidePlaybackLine() {
        if (this.playbackLine) {
            this.playbackLine.style.display = 'none';
        }
    },

    // Render a single line of measures (grand staff)
    renderLine(piece, settings, startMeasure, endMeasure, yOffset, staveWidth, isFirstLine) {
        const xStart = 10;
        const trebleY = yOffset;
        const bassY = yOffset + 85;

        let currentX = xStart;

        for (let m = startMeasure; m < endMeasure; m++) {
            const isFirstMeasure = (m === startMeasure);
            const measureWidth = staveWidth + (isFirstMeasure && isFirstLine ? 40 : 0);

            // Create treble stave
            const trebleStave = new this.VF.Stave(currentX, trebleY, measureWidth);

            // Add clef and time signature on first measure of first line
            if (isFirstMeasure && isFirstLine) {
                trebleStave.addClef('treble');
                trebleStave.addKeySignature(piece.key.vexKey);
                trebleStave.addTimeSignature(settings.timeSignature);
            } else if (isFirstMeasure) {
                // Just add clef on first measure of subsequent lines
                trebleStave.addClef('treble');
            }

            trebleStave.setContext(this.context).draw();

            // Create bass stave
            const bassStave = new this.VF.Stave(currentX, bassY, measureWidth);

            if (isFirstMeasure && isFirstLine) {
                bassStave.addClef('bass');
                bassStave.addKeySignature(piece.key.vexKey);
                bassStave.addTimeSignature(settings.timeSignature);
            } else if (isFirstMeasure) {
                bassStave.addClef('bass');
            }

            bassStave.setContext(this.context).draw();

            // Draw brace on first measure of each line
            if (isFirstMeasure) {
                const brace = new this.VF.StaveConnector(trebleStave, bassStave);
                brace.setType(this.VF.StaveConnector.type.BRACE);
                brace.setContext(this.context).draw();

                const lineLeft = new this.VF.StaveConnector(trebleStave, bassStave);
                lineLeft.setType(this.VF.StaveConnector.type.SINGLE_LEFT);
                lineLeft.setContext(this.context).draw();
            }

            // Draw barline at end
            const lineRight = new this.VF.StaveConnector(trebleStave, bassStave);
            lineRight.setType(this.VF.StaveConnector.type.SINGLE_RIGHT);
            lineRight.setContext(this.context).draw();

            // Get notes for this measure
            const trebleNotes = this.createVexNotes(piece.trebleNotes[m] || [], 'treble');
            const bassNotes = this.createVexNotes(piece.bassNotes[m] || [], 'bass');

            // Create voices and add notes
            if (trebleNotes.length > 0) {
                try {
                    const trebleVoice = new this.VF.Voice({
                        num_beats: settings.timeSignature.split('/')[0],
                        beat_value: settings.timeSignature.split('/')[1]
                    }).setStrict(false);
                    trebleVoice.addTickables(trebleNotes);

                    new this.VF.Formatter()
                        .joinVoices([trebleVoice])
                        .format([trebleVoice], measureWidth - 40);

                    trebleVoice.draw(this.context, trebleStave);

                    // Store notes for playback highlighting
                    trebleNotes.forEach((note, idx) => {
                        if (piece.trebleNotes[m] && piece.trebleNotes[m][idx]) {
                            this.staveNotes.push({
                                element: note,
                                measureIndex: m,
                                noteIndex: idx,
                                hand: 'right',
                                startTime: piece.trebleNotes[m][idx].startTime
                            });
                        }
                    });
                } catch (e) {
                    console.warn('Error rendering treble measure', m, e);
                }
            }

            if (bassNotes.length > 0) {
                try {
                    const bassVoice = new this.VF.Voice({
                        num_beats: settings.timeSignature.split('/')[0],
                        beat_value: settings.timeSignature.split('/')[1]
                    }).setStrict(false);
                    bassVoice.addTickables(bassNotes);

                    new this.VF.Formatter()
                        .joinVoices([bassVoice])
                        .format([bassVoice], measureWidth - 40);

                    bassVoice.draw(this.context, bassStave);

                    // Store notes for playback highlighting
                    bassNotes.forEach((note, idx) => {
                        if (piece.bassNotes[m] && piece.bassNotes[m][idx]) {
                            this.staveNotes.push({
                                element: note,
                                measureIndex: m,
                                noteIndex: idx,
                                hand: 'left',
                                startTime: piece.bassNotes[m][idx].startTime
                            });
                        }
                    });
                } catch (e) {
                    console.warn('Error rendering bass measure', m, e);
                }
            }

            currentX += measureWidth;
        }
    },

    // Create VexFlow StaveNote objects from note data
    createVexNotes(notes, clef) {
        if (!notes || notes.length === 0) {
            return [];
        }

        return notes.map(noteData => {
            // Handle rests
            if (noteData.isRest) {
                const rest = new this.VF.StaveNote({
                    clef: clef,
                    keys: [clef === 'treble' ? 'b/4' : 'd/3'],
                    duration: noteData.duration + 'r'
                });
                return rest;
            }

            // Handle notes (possibly chords)
            const keys = noteData.keys || [noteData.pitch];
            const vexKeys = keys.map(k => this.convertToVexKey(k));

            const staveNote = new this.VF.StaveNote({
                clef: clef,
                keys: vexKeys,
                duration: noteData.duration,
                auto_stem: true
            });

            // Add accidentals only if NOT already in key signature
            vexKeys.forEach((key, idx) => {
                const notePart = key.split('/')[0].toLowerCase();
                const noteUpper = notePart.charAt(0).toUpperCase() + notePart.slice(1);

                // Check if this note (with accidental) is in the key signature
                const isInKeySignature = this.keyScale && this.keyScale.some(
                    scaleNote => scaleNote.toLowerCase() === notePart ||
                                 scaleNote === noteUpper
                );

                // Only add accidental if NOT in key signature
                if (!isInKeySignature) {
                    if (key.includes('#')) {
                        staveNote.addModifier(new this.VF.Accidental('#'), idx);
                    } else if (key.includes('b') && notePart.length > 1) {
                        staveNote.addModifier(new this.VF.Accidental('b'), idx);
                    }
                }
            });

            // Add dots for dotted notes
            if (noteData.dotted) {
                staveNote.addDot(0);
            }

            // Add fingering annotation
            if (noteData.fingering !== undefined && noteData.fingering !== null) {
                const fingeringText = noteData.fingering.toString();
                const annotation = new this.VF.Annotation(fingeringText)
                    .setVerticalJustification(
                        clef === 'treble'
                            ? this.VF.Annotation.VerticalJustify.TOP
                            : this.VF.Annotation.VerticalJustify.BOTTOM
                    )
                    .setFont('Arial', 12, 'bold');
                staveNote.addModifier(annotation, 0);
            }

            return staveNote;
        });
    },

    // Convert pitch like "C4" to VexFlow format "c/4"
    convertToVexKey(pitch) {
        if (!pitch) return 'c/4';

        // Handle format like "C#4" or "Bb3"
        const match = pitch.match(/^([A-Ga-g])([#b]?)(\d)$/);
        if (match) {
            let note = match[1].toLowerCase();
            const accidental = match[2];
            const octave = match[3];

            if (accidental) {
                note += accidental;
            }

            return `${note}/${octave}`;
        }

        return 'c/4';
    },

    // Highlight a note during playback
    highlightNote(measureIndex, noteIndex, hand) {
        // Find the note element
        const noteInfo = this.staveNotes.find(n =>
            n.measureIndex === measureIndex &&
            n.noteIndex === noteIndex &&
            n.hand === hand
        );

        if (noteInfo && noteInfo.element) {
            const svgElement = noteInfo.element.getSVGElement();
            if (svgElement) {
                svgElement.classList.add('playing');
            }
        }
    },

    // Remove highlight from a note
    unhighlightNote(measureIndex, noteIndex, hand) {
        const noteInfo = this.staveNotes.find(n =>
            n.measureIndex === measureIndex &&
            n.noteIndex === noteIndex &&
            n.hand === hand
        );

        if (noteInfo && noteInfo.element) {
            const svgElement = noteInfo.element.getSVGElement();
            if (svgElement) {
                svgElement.classList.remove('playing');
            }
        }
    },

    // Clear all highlights
    clearHighlights() {
        this.staveNotes.forEach(noteInfo => {
            if (noteInfo.element) {
                const svgElement = noteInfo.element.getSVGElement();
                if (svgElement) {
                    svgElement.classList.remove('playing');
                }
            }
        });
    },

    // Get all note elements for playback scheduling
    getNoteElements() {
        return this.staveNotes;
    }
};
