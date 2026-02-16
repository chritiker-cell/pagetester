import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteReaderView from '../NoteReaderView';
import { usePlaybackStore } from '../../store/usePlaybackStore';
import { useMidiStore } from '../../store/useMidiStore';
import { useScoringStore } from '../../store/useScoringStore';
import { useLastExerciseStore } from '../../store/useLastExerciseStore';

// ============================================================================
// MOCKS
// ============================================================================

// Use vi.hoisted() for variables referenced inside vi.mock() factories
const { mockGenerateExercise, mockPlaybackController, mockStartPractice, mockStopPractice } = vi.hoisted(() => ({
  mockGenerateExercise: vi.fn(() => ({
    id: 'random-diff1-1234',
    name: 'Test Exercise',
    difficulty: 1,
    timeSignature: '4/4',
    tempo: 80,
    bars: [
      {
        treble: [{ keys: ['C/4'], duration: 'q', id: 'n1' }],
        bass: [{ keys: ['C/3'], duration: 'w', id: 'b1' }],
      },
    ],
    keySignature: 'C',
  })),
  mockPlaybackController: {
    initialize: vi.fn().mockResolvedValue(true),
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    stop: vi.fn(),
    isReady: vi.fn().mockReturnValue(true),
    loadExercise: vi.fn(),
    getScheduledNotes: vi.fn().mockReturnValue([]),
    getSession: vi.fn().mockReturnValue(null),
    getTotalDuration: vi.fn().mockReturnValue(10),
    updateConfig: vi.fn(),
  },
  mockStartPractice: vi.fn().mockResolvedValue(undefined),
  mockStopPractice: vi.fn(),
}));

vi.mock('../../utils/exerciseGenerator', () => ({
  generateExercise: mockGenerateExercise,
  DIFFICULTY_LABELS: [
    { value: 1, label: '1', name: 'Anfaenger' },
    { value: 2, label: '2', name: 'Leicht' },
    { value: 3, label: '3', name: 'Fortgeschritten' },
    { value: 4, label: '4', name: 'Mittelstufe' },
    { value: 5, label: '5', name: 'Schwer' },
    { value: 6, label: '6', name: 'Experte' },
  ],
  DIFFICULTY_INFO: {
    1: { name: 'Anfaenger', bullets: ['5-Finger-Position', 'Nur C-Dur'] },
    2: { name: 'Leicht', bullets: ['Einfache Melodien'] },
    3: { name: 'Fortgeschritten', bullets: ['Akkorde'] },
    4: { name: 'Mittelstufe', bullets: ['Alberti-Bass'] },
    5: { name: 'Schwer', bullets: ['16tel'] },
    6: { name: 'Experte', bullets: ['Komplex'] },
  },
  AVAILABLE_KEY_STAGES: {
    1: [1],
    2: [1],
    3: [1, 2],
    4: [1, 2, 3],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5],
  },
  getEffectiveKeysLabel: vi.fn(() => 'C-Dur'),
  getAllowedKeysLabel: vi.fn(() => 'C-Dur'),
}));

vi.mock('../../utils/playbackScheduler', () => ({
  getPlaybackController: vi.fn(() => mockPlaybackController),
  exerciseToScheduledNotes: vi.fn(() => []),
  calculateExerciseDuration: vi.fn(() => 10),
}));

vi.mock('../../utils/vexflowRenderer', () => ({
  clearNoteHighlights: vi.fn(),
  highlightNotePractice: vi.fn(),
  clearPracticeFeedback: vi.fn(),
  getNotePosition: vi.fn(),
  showCursorAtPosition: vi.fn(),
  animateCursorWithSession: vi.fn(),
  hidePlaybackCursor: vi.fn(),
}));

vi.mock('../../utils/audioCompat', () => ({
  isWebAudioSupported: vi.fn(() => true),
  getAudioErrorMessage: vi.fn((e: Error) => e.message),
}));

vi.mock('../../utils/practiceMode', () => ({
  initPracticeMode: vi.fn(),
  startPractice: mockStartPractice,
  stopPractice: mockStopPractice,
  handleMidiInput: vi.fn(),
  getRunningAccuracy: vi.fn(() => ({ correct: 0, incorrect: 0, total: 0 })),
}));

vi.mock('../../utils/timing', () => ({
  parseTimeSignature: vi.fn(() => ({ beatsPerMeasure: 4, beatUnit: 4 })),
}));

vi.mock('../../utils/scoringEngine', () => ({
  generateSessionSummary: vi.fn(() => null),
  getEncouragingMessage: vi.fn(() => 'Gut gemacht!'),
}));

vi.mock('tone', () => ({
  start: vi.fn().mockResolvedValue(undefined),
}));

// Mock child components
vi.mock('../notation/MusicSheet', () => ({
  MusicSheet: ({ exercise }: any) => <div data-testid="music-sheet">{exercise?.name}</div>,
}));

vi.mock('../ModeSelector', () => ({
  default: ({ mode, onModeChange }: any) => (
    <div data-testid="mode-selector">
      <button onClick={() => onModeChange('practice')}>Practice</button>
      <button onClick={() => onModeChange('listen')}>Listen</button>
      <span>{mode}</span>
    </div>
  ),
}));

vi.mock('../PracticeVisualizer', () => ({
  default: () => <div data-testid="practice-visualizer">PracticeVisualizer</div>,
}));

vi.mock('../ResultsModal', () => ({
  default: ({ isOpen, onClose, onRetry, onNextExercise, summary }: any) =>
    isOpen ? (
      <div data-testid="results-modal">
        <span data-testid="stars-count">{summary?.score?.stars} Sterne</span>
        <button onClick={onClose}>Schliessen</button>
        <button onClick={onRetry}>Nochmal</button>
        {onNextExercise && summary?.score?.stars >= 3 && <button onClick={onNextExercise}>Naechste</button>}
      </div>
    ) : null,
}));

vi.mock('../NoteReaderSettings', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? <div data-testid="settings-panel"><button onClick={onClose}>Close Settings</button></div> : null,
}));

vi.mock('../ui/Button', () => ({
  default: ({ children, onClick, variant, size, disabled, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('../ui/iconButtonStyles', () => ({
  getIconButtonClasses: vi.fn((variant?: string) => `icon-btn ${variant || ''}`),
}));

vi.mock('../ui/PlaybackIcons', () => ({
  PlayIcon: () => <span>Play</span>,
  PauseIcon: () => <span>Pause</span>,
  StopIcon: () => <span>Stop</span>,
  LoopIcon: () => <span>Loop</span>,
  MetronomeIcon: () => <span>Metronome</span>,
}));

// ============================================================================
// HELPERS
// ============================================================================

/** Find difficulty buttons by pattern "N.Name" (span + text, no whitespace) */
function getDifficultyButtons() {
  return screen.getAllByRole('button').filter(btn =>
    btn.textContent?.match(/^[1-6]\./)
  );
}

/** Find the keyStage button group container */
function getKeyStageContainer() {
  const label = screen.getByText('Tonart-Stufe');
  // The label and buttons are inside a wrapper div
  // label is <label> inside <div>, buttons are in a sibling <div class="flex gap-1.5">
  return label.parentElement!;
}

function getKeyStageButtons() {
  const container = getKeyStageContainer();
  // The buttons are inside <div class="flex gap-1.5"> which is after the label
  const buttonContainer = container.querySelector('.flex.gap-1\\.5');
  return buttonContainer!.querySelectorAll('button');
}

/** Find bar count buttons by scoping to the "Anzahl Takte" section */
function getBarCountContainer() {
  const label = screen.getByText('Anzahl Takte');
  return label.parentElement!;
}

// ============================================================================
// TESTS
// ============================================================================

describe('NoteReaderView', () => {
  beforeEach(() => {
    // Reset all stores to initial state
    usePlaybackStore.setState({
      status: 'stopped',
      config: {
        tempo: 120,
        loop: false,
        metronomeEnabled: true,
        countIn: 0,
        beatsPerMeasure: 4,
        beatUnit: 4,
      },
      isReady: false,
      scheduledNotes: [],
      currentNoteIndex: -1,
      totalDuration: 0,
      currentTime: 0,
      currentBeat: 0,
      currentMeasure: 1,
      error: null,
    });

    useMidiStore.setState({
      connectionStatus: 'disconnected',
      selectedDeviceId: null,
      playedNotes: [],
    });

    useScoringStore.setState({
      currentScore: null,
      recentScores: [],
      bestScores: new Map(),
      showResults: false,
    });

    useLastExerciseStore.setState({
      configs: [],
      continueDifficulty: null,
    });

    // Reset all mock functions
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================================================
  // SETUP PHASE TESTS
  // ==========================================================================

  describe('Setup Phase', () => {
    it('renders 6 difficulty buttons with difficulty 1 selected by default', () => {
      render(<NoteReaderView />);

      const difficultyButtons = getDifficultyButtons();
      expect(difficultyButtons).toHaveLength(6);

      // First button (difficulty 1) should have primary background
      expect(difficultyButtons[0]).toHaveClass('bg-primary-600');
    });

    it('clicking different difficulty changes selection', async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);

      const difficultyButtons = getDifficultyButtons();
      const diff2Button = difficultyButtons[1];
      await user.click(diff2Button);

      expect(diff2Button).toHaveClass('bg-primary-600');
      expect(difficultyButtons[0]).not.toHaveClass('bg-primary-600');
    });

    it('keyStage buttons are disabled when not available for chosen difficulty', async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);

      // Difficulty 1 only has keyStage 1 available
      let keyStageButtons = getKeyStageButtons();
      expect(keyStageButtons[0]).not.toBeDisabled(); // KeyStage 1
      expect(keyStageButtons[1]).toBeDisabled(); // KeyStage 2

      // Switch to difficulty 3 (has stages 1 and 2)
      const difficultyButtons = getDifficultyButtons();
      await user.click(difficultyButtons[2]);

      // Re-query after state change
      keyStageButtons = getKeyStageButtons();
      expect(keyStageButtons[0]).not.toBeDisabled(); // KeyStage 1
      expect(keyStageButtons[1]).not.toBeDisabled(); // KeyStage 2
      expect(keyStageButtons[2]).toBeDisabled(); // KeyStage 3
    });

    it('"Uebung starten" button calls generateExercise and switches to practice phase', async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);

      const startButton = screen.getByRole('button', { name: /Uebung starten/i });
      await user.click(startButton);

      expect(mockGenerateExercise).toHaveBeenCalledOnce();
      expect(screen.getByTestId('music-sheet')).toBeInTheDocument();
      expect(screen.getByText('Test Exercise')).toBeInTheDocument();

      // Setup UI should be hidden
      expect(getDifficultyButtons()).toHaveLength(0);
    });

    it('difficulty change resets keyStage if current keyStage not available', async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);

      // Select difficulty 3 (has keyStages 1, 2)
      const difficultyButtons = getDifficultyButtons();
      await user.click(difficultyButtons[2]);

      // Select keyStage 2
      let keyStageButtons = getKeyStageButtons();
      await user.click(keyStageButtons[1]);

      // Switch to difficulty 1 (only has keyStage 1)
      await user.click(difficultyButtons[0]);

      // KeyStage 1 should be selected, KeyStage 2 disabled
      keyStageButtons = getKeyStageButtons();
      expect(keyStageButtons[0]).toHaveClass('bg-primary-600');
      expect(keyStageButtons[1]).toBeDisabled();
    });

    it('time signature buttons work', async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);

      const randomButton = screen.getByRole('button', { name: /Zufaellig/i });
      expect(randomButton).toHaveClass('bg-primary-600');

      const threeFourButton = screen.getByRole('button', { name: '3/4' });
      await user.click(threeFourButton);

      expect(threeFourButton).toHaveClass('bg-primary-600');
      expect(randomButton).not.toHaveClass('bg-primary-600');
    });

    it('bar count buttons work', async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);

      // Scope to the "Anzahl Takte" section to avoid conflicts with keyStage "4"
      const barSection = getBarCountContainer();
      const barButtons = within(barSection).getAllByRole('button');

      // Default bar count is 4 — first button should be selected
      expect(barButtons[0]).toHaveClass('bg-primary-600');
      expect(barButtons[0].textContent).toBe('4');

      // Click 8
      await user.click(barButtons[1]);
      expect(barButtons[1]).toHaveClass('bg-primary-600');
      expect(barButtons[0]).not.toHaveClass('bg-primary-600');
    });

    it('info panel shows DIFFICULTY_INFO for selected difficulty', () => {
      render(<NoteReaderView />);

      // The info panel is the right-side card with h3 heading
      expect(screen.getByText(/5-Finger-Position/)).toBeInTheDocument();
      expect(screen.getByText(/Nur C-Dur/)).toBeInTheDocument();
    });

    it('summary panel shows current config', () => {
      render(<NoteReaderView />);

      const summaryHeading = screen.getByText(/Zusammenfassung/i);
      const summaryPanel = summaryHeading.closest('div[class*="rounded"]')!;
      const summary = within(summaryPanel as HTMLElement);

      expect(summary.getByText(/Stufe:/)).toBeInTheDocument();
      expect(summary.getByText(/Tonarten:/)).toBeInTheDocument();
      expect(summary.getByText(/C-Dur/)).toBeInTheDocument();
      expect(summary.getByText(/Taktart:/)).toBeInTheDocument();
      expect(summary.getByText(/Takte:/)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // PRACTICE PHASE TESTS
  // ==========================================================================

  describe('Practice Phase', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);
      const startButton = screen.getByRole('button', { name: /Uebung starten/i });
      await user.click(startButton);
    });

    it('MusicSheet renders with generated exercise', () => {
      expect(screen.getByTestId('music-sheet')).toBeInTheDocument();
      expect(screen.getByText('Test Exercise')).toBeInTheDocument();
    });

    it('Play button is shown and clicking it triggers handlePlay', async () => {
      const user = userEvent.setup();

      const playButton = screen.getByRole('button', { name: /Play/i });
      expect(playButton).toBeInTheDocument();

      await user.click(playButton);
      expect(mockPlaybackController.play).toHaveBeenCalled();
    });

    it('Stop button exists', () => {
      const stopButton = screen.getByRole('button', { name: /Stop/i });
      expect(stopButton).toBeInTheDocument();
    });

    it('back-to-setup button works (clicking returns to setup phase)', async () => {
      const user = userEvent.setup();

      const backButton = screen.getByTitle(/Zurueck zur Auswahl/i);
      await user.click(backButton);

      // Should be back in setup phase
      expect(getDifficultyButtons()).toHaveLength(6);
      expect(screen.queryByTestId('music-sheet')).not.toBeInTheDocument();
    });

    it('settings button opens settings panel', async () => {
      const user = userEvent.setup();

      const settingsButton = screen.getByTitle(/Einstellungen/i);
      await user.click(settingsButton);

      expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
    });

    it('tempo display shows current tempo value', () => {
      // Exercise useEffect sets tempo to exercise.tempo (80)
      const tempoButton = screen.getByTitle(/Tempo aendern/i);
      expect(tempoButton.textContent).toContain('80');
    });

    it('component unmount calls controller.stop() and stopPractice()', () => {
      const { unmount } = render(<NoteReaderView />);
      unmount();

      expect(mockPlaybackController.stop).toHaveBeenCalled();
      expect(mockStopPractice).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // MODE SWITCHING TESTS
  // ==========================================================================

  describe('Mode Switching', () => {
    it('switching from listen to practice mode works', async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);

      const startButton = screen.getByRole('button', { name: /Uebung starten/i });
      await user.click(startButton);

      const modeSelector = screen.getByTestId('mode-selector');
      expect(within(modeSelector).getByText('listen')).toBeInTheDocument();

      const practiceModeButton = within(modeSelector).getByRole('button', { name: /Practice/i });
      await user.click(practiceModeButton);

      expect(within(modeSelector).getByText('practice')).toBeInTheDocument();
    });

    it('practice mode changes appMode state', async () => {
      const user = userEvent.setup();
      render(<NoteReaderView />);

      const startButton = screen.getByRole('button', { name: /Uebung starten/i });
      await user.click(startButton);

      // Switch to practice mode
      const modeSelector = screen.getByTestId('mode-selector');
      const practiceModeButton = within(modeSelector).getByRole('button', { name: /Practice/i });
      await user.click(practiceModeButton);

      // In practice mode, the toolbar should show practice controls instead of listen controls
      // (Start/Stopp button instead of Play/Pause)
      // PracticeVisualizer only shows when practiceState is 'playing' or 'countdown',
      // which requires MIDI + clicking Start. We verify mode changed via modeSelector text.
      expect(within(modeSelector).getByText('practice')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // RESULTS MODAL TESTS
  // ==========================================================================

  describe('Results Modal', () => {
    it('does not show results modal initially', () => {
      render(<NoteReaderView />);
      expect(screen.queryByTestId('results-modal')).not.toBeInTheDocument();
    });
  });
});
