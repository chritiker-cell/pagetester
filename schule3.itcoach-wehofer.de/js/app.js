// Main Application - Sight Reading Trainer

const App = {
    // Current state
    currentView: 'home',
    currentPiece: null,
    settings: null,

    // Initialize the application
    init() {
        console.log('Initializing Sight Reading Trainer...');

        // Load settings
        this.settings = loadSettings();

        // Set up event listeners
        this.setupNavigation();
        this.setupHomeView();
        this.setupPracticeView();

        // Apply saved settings to UI
        this.applySettingsToUI();

        console.log('App initialized successfully');
    },

    // Set up navigation between views
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;
                if (view) {
                    this.showView(view);
                }
            });
        });
    },

    // Show a specific view
    showView(viewName) {
        // Stop playback when switching views
        if (viewName !== 'practice') {
            Playback.stop();
        }

        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        // Show target view
        const targetView = document.getElementById('view-' + viewName);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }

        // Update nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active', link.dataset.view === viewName);
        });
    },

    // Set up home view event listeners
    setupHomeView() {
        // Level buttons
        this.setupOptionButtons('level-buttons', 'level', (value) => {
            this.settings.level = value;
            saveSettings(this.settings);
        });

        // Key difficulty buttons
        this.setupOptionButtons('key-difficulty-buttons', 'keyDifficulty', (value) => {
            this.settings.keyDifficulty = value;
            saveSettings(this.settings);
        });

        // Time signature buttons
        this.setupOptionButtons('time-sig-buttons', 'timeSig', (value) => {
            this.settings.timeSignature = value;
            saveSettings(this.settings);
        });

        // Measure count slider
        const measureSlider = document.getElementById('measure-count');
        const measureDisplay = document.getElementById('measure-count-display');

        measureSlider.addEventListener('input', () => {
            measureDisplay.textContent = measureSlider.value;
            this.settings.measureCount = parseInt(measureSlider.value);
            saveSettings(this.settings);
        });

        // Generate piece button
        document.getElementById('generate-piece').addEventListener('click', () => {
            this.generateAndShowPiece();
        });
    },

    // Helper to set up option button groups
    setupOptionButtons(containerId, dataAttr, callback) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const value = btn.dataset[dataAttr];
                if (callback) callback(value);
            });
        });
    },

    // Set up practice view event listeners
    setupPracticeView() {
        // Back button
        document.getElementById('back-to-home').addEventListener('click', () => {
            Playback.stop();
            this.showView('home');
        });

        // Tempo slider
        const tempoSlider = document.getElementById('tempo-slider');
        const tempoDisplay = document.getElementById('tempo-display');

        tempoSlider.addEventListener('input', () => {
            const tempo = parseInt(tempoSlider.value);
            tempoDisplay.textContent = tempo;
            this.settings.tempo = tempo;
            Playback.setTempo(tempo);
            saveSettings(this.settings);
        });

        // Play button
        document.getElementById('btn-play').addEventListener('click', async () => {
            const playBtn = document.getElementById('btn-play');

            if (Playback.isPlaying) {
                Playback.pause();
                playBtn.classList.remove('active');
                playBtn.querySelector('.play-icon').innerHTML = '&#9654;'; // Play symbol
            } else {
                await Playback.play();
                playBtn.classList.add('active');
                playBtn.querySelector('.play-icon').innerHTML = '&#10074;&#10074;'; // Pause symbol
            }
        });

        // Stop button
        document.getElementById('btn-stop').addEventListener('click', () => {
            Playback.stop();
            document.getElementById('btn-play').classList.remove('active');
            document.getElementById('btn-play').querySelector('.play-icon').innerHTML = '&#9654;';
        });

        // Loop button
        document.getElementById('btn-loop').addEventListener('click', () => {
            const loopBtn = document.getElementById('btn-loop');
            const isLooping = Playback.toggleLoop();
            loopBtn.classList.toggle('active', isLooping);
        });

        // New piece button
        document.getElementById('new-piece').addEventListener('click', () => {
            Playback.stop();
            document.getElementById('btn-play').classList.remove('active');
            document.getElementById('btn-play').querySelector('.play-icon').innerHTML = '&#9654;';
            this.generateAndShowPiece();
        });

        // Set up playback callbacks
        Playback.setCallbacks(
            // On note play
            (measureIndex, noteIndex, hand) => {
                NotationRenderer.highlightNote(measureIndex, noteIndex, hand);
            },
            // On note end
            (measureIndex, noteIndex, hand) => {
                NotationRenderer.unhighlightNote(measureIndex, noteIndex, hand);
            },
            // On playback end
            () => {
                document.getElementById('btn-play').classList.remove('active');
                document.getElementById('btn-play').querySelector('.play-icon').innerHTML = '&#9654;';
            },
            // On position update
            (progress, seconds) => {
                NotationRenderer.updatePlaybackPosition(progress);
            }
        );
    },

    // Apply settings to UI elements
    applySettingsToUI() {
        // Level
        const levelBtn = document.querySelector(`[data-level="${this.settings.level}"]`);
        if (levelBtn) {
            document.querySelectorAll('#level-buttons .option-btn').forEach(b => b.classList.remove('active'));
            levelBtn.classList.add('active');
        }

        // Key difficulty
        const keyDiffBtn = document.querySelector(`[data-key-difficulty="${this.settings.keyDifficulty}"]`);
        if (keyDiffBtn) {
            document.querySelectorAll('#key-difficulty-buttons .option-btn').forEach(b => b.classList.remove('active'));
            keyDiffBtn.classList.add('active');
        }

        // Time signature
        const timeSigBtn = document.querySelector(`[data-time-sig="${this.settings.timeSignature}"]`);
        if (timeSigBtn) {
            document.querySelectorAll('#time-sig-buttons .option-btn').forEach(b => b.classList.remove('active'));
            timeSigBtn.classList.add('active');
        }

        // Measure count
        const measureSlider = document.getElementById('measure-count');
        const measureDisplay = document.getElementById('measure-count-display');
        if (measureSlider) {
            measureSlider.value = this.settings.measureCount;
            measureDisplay.textContent = this.settings.measureCount;
        }

        // Tempo
        const tempoSlider = document.getElementById('tempo-slider');
        const tempoDisplay = document.getElementById('tempo-display');
        if (tempoSlider) {
            tempoSlider.value = this.settings.tempo;
            tempoDisplay.textContent = this.settings.tempo;
        }
    },

    // Generate a new piece and show the practice view
    generateAndShowPiece() {
        // Show loading state
        const notationDisplay = document.getElementById('notation-display');
        notationDisplay.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Generiere Stueck...</p></div>';

        // Switch to practice view
        this.showView('practice');

        // Update practice info
        this.updatePracticeInfo();

        // Generate piece after a short delay (for UI feedback)
        setTimeout(() => {
            try {
                // Generate the piece
                this.currentPiece = PieceGenerator.generate(this.settings);

                // Load into playback
                Playback.loadPiece(this.currentPiece);

                // Render the piece
                NotationRenderer.render(this.currentPiece, this.settings);

            } catch (error) {
                console.error('Error generating piece:', error);
                notationDisplay.innerHTML = `<div class="error-message">Fehler beim Generieren: ${error.message}</div>`;
            }
        }, 100);
    },

    // Update practice view info badges
    updatePracticeInfo() {
        // Level name
        const levelNames = {
            'beginner': 'Anfaenger',
            'intermediate': 'Fortgeschritten',
            'expert': 'Experte'
        };
        document.getElementById('current-level').textContent = levelNames[this.settings.level] || this.settings.level;

        // Key (will be updated after generation)
        document.getElementById('current-key').textContent = 'Generiere...';

        // Time signature
        document.getElementById('current-time-sig').textContent = this.settings.timeSignature;

        // Update key after piece is generated
        setTimeout(() => {
            if (this.currentPiece && this.currentPiece.key) {
                document.getElementById('current-key').textContent = this.currentPiece.key.name;
            }
        }, 150);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
