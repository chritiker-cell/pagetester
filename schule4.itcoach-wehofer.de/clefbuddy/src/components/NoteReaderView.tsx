import { useEffect, useCallback, useState, useRef } from 'react';
import { MusicSheet } from './notation/MusicSheet';
import ModeSelector, { type AppMode } from './ModeSelector';
import PracticeVisualizer from './PracticeVisualizer';
import ResultsModal from './ResultsModal';
import Button from './ui/Button';
import { getIconButtonClasses } from './ui/iconButtonStyles';
import { PlayIcon, PauseIcon, StopIcon, LoopIcon, MetronomeIcon } from './ui/PlaybackIcons';
import { useExerciseStore } from '../store/useExerciseStore';
import { usePlaybackStore } from '../store/usePlaybackStore';
import { useMidiStore } from '../store/useMidiStore';
import { useScoringStore } from '../store/useScoringStore';
import {
  getPlaybackController,
  exerciseToScheduledNotes,
  calculateExerciseDuration,
} from '../utils/playbackScheduler';
import { parseTimeSignature } from '../utils/timing';
import {
  clearNoteHighlights,
  highlightNotePractice,
  clearPracticeFeedback,
  getNotePosition,
  showCursorAtPosition,
  animateCursorWithSession,
  hidePlaybackCursor,
  type CursorTimelineEntry,
} from '../utils/vexflowRenderer';
import { isWebAudioSupported, getAudioErrorMessage } from '../utils/audioCompat';
import {
  initPracticeMode,
  startPractice,
  stopPractice,
  handleMidiInput,
  getRunningAccuracy,
  type PracticeModeState,
} from '../utils/practiceMode';
import {
  generateExercise,
  DIFFICULTY_LABELS,
  DIFFICULTY_INFO,
  AVAILABLE_KEY_STAGES,
  getAllowedKeysLabel,
  type Difficulty,
  type TimeSignatureOption,
  type KeyStage,
} from '../utils/exerciseGenerator';
import type { Exercise } from '../types/music';
import type { NoteComparison } from '../types/comparison';
import type { SessionSummary } from '../types/scoring';
import NoteReaderSettings from './NoteReaderSettings';
import { useNoteReaderSettingsStore } from '../store/useNoteReaderSettingsStore';
import { useLastExerciseStore } from '../store/useLastExerciseStore';

type Phase = 'setup' | 'practice';

export default function NoteReaderView() {
  // Setup state
  const [phase, setPhase] = useState<Phase>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [keyStage, setKeyStage] = useState<KeyStage>(1);
  const [timeSignature, setTimeSignature] = useState<TimeSignatureOption>('random');
  const [barCount, setBarCount] = useState(4);
  const barCountOptions = [4, 8, 12, 16, 20, 24];
  const [generatedExercise, setGeneratedExercise] = useState<Exercise | null>(null);
  const [progressionStep, setProgressionStep] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const nrSettings = useNoteReaderSettingsStore();
  const { saveConfig } = useLastExerciseStore();

  // Tempo editing
  const [editingTempo, setEditingTempo] = useState(false);
  const [tempoInput, setTempoInput] = useState('');
  const tempoInputRef = useRef<HTMLInputElement>(null);

  // MIDI warning dismissible
  const [midiWarningDismissed, setMidiWarningDismissed] = useState(false);

  const { setExercise } = useExerciseStore();

  const {
    config,
    isReady,
    scheduledNotes,
    status,
    setReady,
    setScheduledNotes,
    setTotalDuration,
    setCurrentNoteIndex,
    setMetronomeBeat,
    setConfig,
    setTempo,
    toggleMetronome,
    toggleLoop,
    stop,
    play,
    pause,
  } = usePlaybackStore();

  const {
    connectionStatus: midiConnectionStatus,
    selectedDeviceId: midiDeviceId,
    playedNotes,
    startListening,
    stopListening,
    clearPlayedNotes,
  } = useMidiStore();

  const {
    showResults,
    recordScore,
    hideResultsModal,
    clearCurrentScore,
    getSessionSummary,
  } = useScoringStore();

  const [appMode, setAppMode] = useState<AppMode>('listen');
  const [highlightedNoteIds, setHighlightedNoteIds] = useState<string[]>([]);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [practiceState, setPracticeState] = useState<PracticeModeState>('idle');
  const [practiceAccuracy, setPracticeAccuracy] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [lastComparison, setLastComparison] = useState<NoteComparison | null>(null);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [practiceStartTime, setPracticeStartTime] = useState<number>(0);

  useEffect(() => {
    if (!isWebAudioSupported()) {
      setAudioError('Dein Browser unterstuetzt keine Audio-Wiedergabe. Bitte verwende einen modernen Browser.');
    }
  }, []);

  // Stop playback/metronome when component unmounts (e.g. tab switch to Dashboard)
  useEffect(() => {
    return () => {
      getPlaybackController().stop();
      stopPractice();
      hidePlaybackCursor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentExercise = generatedExercise;

  const initializeAudio = useCallback(async () => {
    if (isReady) return;
    const controller = getPlaybackController();
    const success = await controller.initialize();
    setReady(success);
  }, [isReady, setReady]);

  // When exercise changes, set up playback
  useEffect(() => {
    if (!currentExercise) return;
    stop();
    stopPractice();
    clearNoteHighlights();
    clearPracticeFeedback();
    setHighlightedNoteIds([]);
    setPracticeState('idle');

    const { beatsPerMeasure, beatUnit } = parseTimeSignature(currentExercise.timeSignature);
    setConfig({ tempo: currentExercise.tempo, beatsPerMeasure, beatUnit });

    const exerciseConfig = {
      tempo: currentExercise.tempo,
      beatsPerMeasure,
      beatUnit,
      loop: nrSettings.loopDefaultOn,
      metronomeEnabled: nrSettings.metronomeDefaultOn,
      countIn: 0,
    };
    const notes = exerciseToScheduledNotes(currentExercise, exerciseConfig);
    setScheduledNotes(notes);

    const duration = calculateExerciseDuration(currentExercise, currentExercise.tempo);
    setTotalDuration(duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise]);

  // Reset keyStage if not available for selected difficulty
  useEffect(() => {
    const available = AVAILABLE_KEY_STAGES[difficulty];
    if (!available.includes(keyStage)) {
      setKeyStage(available[available.length - 1] < keyStage ? available[available.length - 1] : 1);
    }
  }, [difficulty, keyStage]);

  const handleStartExercise = useCallback(() => {
    const exercise = generateExercise({ difficulty, timeSignature, keyStage, barCount, progressionStep: 0 });
    setGeneratedExercise(exercise);
    setExercise(exercise.id);
    setProgressionStep(0);
    setPhase('practice');
    // Save config to "Letzte Übungen" in Dashboard
    saveConfig({
      difficulty,
      keyStage,
      timeSignature,
      barCount,
      tempo: exercise.tempo,
    });
  }, [difficulty, timeSignature, keyStage, barCount, setExercise, saveConfig]);

  const handleBackToSetup = useCallback(() => {
    stop();
    stopPractice();
    clearNoteHighlights();
    clearPracticeFeedback();
    setHighlightedNoteIds([]);
    hidePlaybackCursor();
    setPracticeState('idle');
    setGeneratedExercise(null);
    setProgressionStep(0);
    setPhase('setup');
  }, [stop]);

  const handleNextExercise = useCallback(() => {
    hideResultsModal();
    clearCurrentScore();
    setSessionSummary(null);
    const nextStep = progressionStep + 1;
    setProgressionStep(nextStep);
    const exercise = generateExercise({ difficulty, timeSignature, keyStage, barCount, progressionStep: nextStep });
    setGeneratedExercise(exercise);
    setExercise(exercise.id);
  }, [hideResultsModal, clearCurrentScore, difficulty, timeSignature, keyStage, barCount, progressionStep, setExercise]);

  const handlePlay = useCallback(async () => {
    try {
      setAudioError(null);
      await initializeAudio();
      const { start } = await import('tone');
      await start();
      if (!currentExercise) return;

      const controller = getPlaybackController(config);
      if (!controller.isReady()) {
        setAudioError('Audio-Engine konnte nicht initialisiert werden.');
        return;
      }

      controller.loadExercise(
        currentExercise,
        (_noteId, noteIndex) => {
          setCurrentNoteIndex(noteIndex);
          // No color highlighting in listen mode — cursor line is sufficient
        },
        (beat, isDownbeat) => { setMetronomeBeat(beat, isDownbeat); },
        () => {
          // CRITICAL: Only trigger stop if still playing
          // This prevents spurious stops from timeouts that fired after user already stopped
          if (status === 'playing') {
            stop();
            setHighlightedNoteIds([]);
            hidePlaybackCursor();
          }
        }
      );

      // Build cursor timeline (times relative to music start, not count-in)
      const allScheduled = controller.getScheduledNotes();
      const trebleNotes = allScheduled
        .filter(n => n.voice === 'treble')
        .sort((a, b) => a.startTime - b.startTime);

      const timeline: CursorTimelineEntry[] = [];
      for (const n of trebleNotes) {
        const pos = getNotePosition(n.id);
        if (pos) {
          timeline.push({
            x: pos.x,
            time: n.startTime,
            lineTop: pos.lineTop,
            lineBottom: pos.lineBottom,
            lineIndex: pos.lineIndex,
            noteId: n.id,
            duration: n.durationSeconds,
          });
        }
      }

      // Show cursor at first note position (visible during count-in)
      if (timeline.length > 0) {
        showCursorAtPosition(timeline[0].x, timeline[0].lineTop, timeline[0].lineBottom);
      }

      // Set state to playing BEFORE starting playback
      // This allows stop() to be detected during async scheduling
      play();

      // Start playback (schedules count-in + notes via simplePlayback)
      await controller.play();

      // Start cursor animation using session for sync
      const session = controller.getSession();
      if (session && timeline.length > 0) {
        const exerciseDurationMs = controller.getTotalDuration() * 1000;
        animateCursorWithSession(timeline, session, exerciseDurationMs);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setAudioError(getAudioErrorMessage(error));
    }
  }, [initializeAudio, currentExercise, config, setCurrentNoteIndex, setMetronomeBeat, stop, play, status]);

  const handlePause = useCallback(() => {
    const controller = getPlaybackController();
    controller.pause();
    pause();
  }, [pause]);

  const handleStop = useCallback(() => {
    // CRITICAL: Stop store state FIRST to prevent any callbacks from triggering restart
    stop();
    // Then stop the controller (which clears timeouts and stops audio)
    const controller = getPlaybackController();
    controller.stop();
    clearNoteHighlights();
    setHighlightedNoteIds([]);
    hidePlaybackCursor();
  }, [stop, status]);

  const handlePlayPause = useCallback(() => {
    if (status === 'playing') {
      handlePause();
    } else {
      handlePlay();
    }
  }, [status, handlePlay, handlePause]);

  const handleStartPractice = useCallback(async () => {
    if (!currentExercise || scheduledNotes.length === 0) return;
    try {
      setAudioError(null);
      await initializeAudio();
      clearPracticeFeedback();
      clearPlayedNotes();
      clearCurrentScore();
      setLastComparison(null);
      setSessionSummary(null);

      initPracticeMode(scheduledNotes, {
        countdownBeats: nrSettings.countdownBeats,
        playReference: false,
        metronomeEnabled: config.metronomeEnabled,
        tempo: config.tempo,
        beatsPerMeasure: config.beatsPerMeasure,
      }, {
        onStateChange: (state) => setPracticeState(state),
        onCountdownBeat: () => {},  // Visual countdown removed, audio still plays
        onExpectedNote: (noteIndex, note) => {
          setCurrentNoteIndex(noteIndex);
          highlightNotePractice(note.id, 'current');
        },
        onUserNote: (_playedNote, comparisonState) => {
          const accuracy = getRunningAccuracy();
          setPracticeAccuracy({ correct: accuracy.correct, incorrect: accuracy.incorrect, total: accuracy.total });
          const noteStates = comparisonState.noteStates;
          const lastMatched = noteStates.filter((s) => s.matched).pop();
          if (lastMatched?.comparison) {
            setLastComparison(lastMatched.comparison);
            if (lastMatched.expectedNote) {
              highlightNotePractice(
                lastMatched.expectedNote.id,
                lastMatched.comparison.result === 'correct' ? 'correct' : 'incorrect'
              );
            }
          }
        },
        onMetronomeBeat: (beat, isDownbeat) => setMetronomeBeat(beat, isDownbeat),
        onComplete: (summary) => {
          const sessionResult = recordScore(
            summary, currentExercise.id, currentExercise.name,
            config.tempo, config.metronomeEnabled,
            (performance.now() - practiceStartTime) / 1000
          );
          setSessionSummary(sessionResult);
        },
      });

      startListening();
      setPracticeStartTime(performance.now());
      await startPractice();
    } catch (error) {
      console.error('Practice start error:', error);
      setAudioError(getAudioErrorMessage(error));
    }
  }, [currentExercise, scheduledNotes, config, initializeAudio, clearPlayedNotes, clearCurrentScore, recordScore, startListening, setCurrentNoteIndex]);

  const handleStopPractice = useCallback(() => {
    stopPractice();
    stopListening();
    setPracticeState('idle');
    clearPracticeFeedback();
  }, [stopListening]);

  const handleRetry = useCallback(() => {
    hideResultsModal();
    clearCurrentScore();
    setSessionSummary(null);
    setPracticeState('idle');
    clearPracticeFeedback();
  }, [hideResultsModal, clearCurrentScore]);

  useEffect(() => {
    if (practiceState === 'playing' && playedNotes.length > 0) {
      const latestNote = playedNotes[playedNotes.length - 1];
      if (latestNote && !latestNote.endTime) {
        handleMidiInput({
          type: 'noteon',
          note: latestNote.midiNote,
          velocity: latestNote.velocity,
          timestamp: performance.now(),
          channel: 0,
        });
      }
    }
  }, [practiceState, playedNotes]);

  useEffect(() => {
    const controller = getPlaybackController();
    controller.updateConfig({
      tempo: config.tempo,
      metronomeEnabled: config.metronomeEnabled,
      loop: config.loop,
    });
  }, [config.tempo, config.metronomeEnabled, config.loop]);

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== 'practice') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'Escape':
          e.preventDefault();
          handleStop();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          toggleLoop();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMetronome();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handlePlayPause, handleStop, toggleLoop, toggleMetronome]);

  const handleTempoClick = () => {
    setTempoInput(String(config.tempo));
    setEditingTempo(true);
    setTimeout(() => tempoInputRef.current?.select(), 0);
  };

  const commitTempo = () => {
    const val = parseInt(tempoInput, 10);
    if (!isNaN(val) && val >= 40 && val <= 200) {
      setTempo(val);
    }
    setEditingTempo(false);
  };

  const currentSessionSummary = sessionSummary || getSessionSummary();

  // ========================
  // SETUP PHASE
  // ========================
  if (phase === 'setup') {
    const tsOptions: { value: TimeSignatureOption; label: string }[] = [
      { value: 'random', label: 'Zufaellig' },
      { value: '4/4', label: '4/4' },
      { value: '3/4', label: '3/4' },
      { value: '2/4', label: '2/4' },
      { value: '6/8', label: '6/8' },
    ];

    const availableKeyStages = AVAILABLE_KEY_STAGES[difficulty];
    const diffInfo = DIFFICULTY_INFO[difficulty];

    return (
      <div className="flex items-start justify-center min-h-[60vh] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* LEFT: Selection Panel */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 space-y-5">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Neue Uebung</h2>

            {/* Difficulty - 6 vertical buttons */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Schwierigkeitsstufe</label>
              <div className="flex flex-col gap-1.5">
                {DIFFICULTY_LABELS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-left transition-colors ${
                      difficulty === opt.value
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-200 dark:border-neutral-600'
                    }`}
                  >
                    <span className="font-bold mr-2">{opt.label}.</span>{opt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tonarten: Info text for Stufe 1-5, Key Stage selector for Stufe 6 */}
            {difficulty === 6 ? (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tonart-Stufe</label>
                <div className="flex gap-1.5">
                  {([1, 2, 3, 4, 5] as KeyStage[]).map(ks => {
                    const available = availableKeyStages.includes(ks);
                    return (
                      <button
                        key={ks}
                        onClick={() => available && setKeyStage(ks)}
                        disabled={!available}
                        className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                          keyStage === ks
                            ? 'bg-primary-600 text-white'
                            : available
                              ? 'bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-200 dark:border-neutral-600'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-500 cursor-not-allowed border border-neutral-100 dark:border-neutral-700'
                        }`}
                      >
                        {ks}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tonarten</label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-700 rounded-lg px-4 py-2.5 border border-neutral-200 dark:border-neutral-600">
                  {getAllowedKeysLabel(difficulty)}
                </p>
              </div>
            )}

            {/* Time Signature - horizontal buttons */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Taktart</label>
              <div className="flex gap-1.5 flex-wrap">
                {tsOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeSignature(opt.value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      timeSignature === opt.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-200 dark:border-neutral-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Count - horizontal buttons */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Anzahl Takte</label>
              <div className="flex gap-1.5 flex-wrap">
                {barCountOptions.map(n => (
                  <button
                    key={n}
                    onClick={() => setBarCount(n)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      barCount === n
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-200 dark:border-neutral-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" size="lg" onClick={handleStartExercise} className="w-full">
              Uebung starten
            </Button>
          </div>

          {/* RIGHT: Info Panel */}
          <div className="lg:sticky lg:top-4 space-y-4">
            {/* Difficulty Info */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">{diffInfo.name}</h3>
              <ul className="space-y-1.5">
                {diffInfo.bullets.map((b, i) => (
                  <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">&#8226;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-600">
              <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Zusammenfassung</h4>
              <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                <p><span className="font-medium">Stufe:</span> {diffInfo.name}</p>
                <p><span className="font-medium">Tonarten:</span> {difficulty === 6 ? `Tonart-Stufe ${keyStage}` : getAllowedKeysLabel(difficulty)}</p>
                <p><span className="font-medium">Taktart:</span> {timeSignature === 'random' ? 'Zufaellig' : timeSignature}</p>
                <p><span className="font-medium">Takte:</span> {barCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // PRACTICE PHASE
  // ========================
  const isPlaying = status === 'playing';
  const isCompactToolbar = status === 'playing' || practiceState === 'playing' || practiceState === 'countdown';

  // Use shared iconBtn utility
  const iconBtn = getIconButtonClasses;

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Compact Toolbar */}
        <div className={`flex items-center gap-2 px-4 ${isCompactToolbar ? 'py-1' : 'py-2'} bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shrink-0 flex-wrap transition-all duration-200`}>
          {appMode === 'listen' ? (
            <>
              <button onClick={handlePlayPause} className={iconBtn('primary', isPlaying)} title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button onClick={handleStop} className={iconBtn('utility')} title="Stop (Esc)" disabled={status === 'stopped'}>
                <StopIcon />
              </button>
              {!isCompactToolbar && (
                <>
                  <button onClick={toggleLoop} className={iconBtn('toggle', config.loop)} title="Loop (L)">
                    <LoopIcon />
                  </button>
                  <button onClick={toggleMetronome} className={iconBtn('toggle', config.metronomeEnabled)} title="Metronom (M)">
                    <MetronomeIcon />
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {practiceState === 'idle' || practiceState === 'finished' ? (
                <button
                  onClick={handleStartPractice}
                  disabled={midiConnectionStatus !== 'connected' || !midiDeviceId}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {practiceState === 'finished' ? 'Nochmal' : 'Start'}
                </button>
              ) : (
                <button onClick={handleStopPractice} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-500">
                  Stopp
                </button>
              )}
              {!isCompactToolbar && (
                <>
                  <button onClick={toggleMetronome} className={iconBtn('toggle', config.metronomeEnabled)} title="Metronom (M)">
                    <MetronomeIcon />
                  </button>
                  {/* MIDI status indicator */}
                  <div className="flex items-center gap-2 ml-2" title={midiDeviceId ? 'MIDI verbunden' : 'MIDI nicht verbunden'}>
                    <div className={`w-2 h-2 rounded-full ${midiConnectionStatus === 'connected' && midiDeviceId ? 'bg-success' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
                    <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                </>
              )}
            </>
          )}

          {/* Tempo - hidden in compact mode */}
          {!isCompactToolbar && (
            <>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              {editingTempo ? (
                <input
                  ref={tempoInputRef}
                  type="number"
                  min={40}
                  max={200}
                  value={tempoInput}
                  onChange={e => setTempoInput(e.target.value)}
                  onBlur={commitTempo}
                  onKeyDown={e => { if (e.key === 'Enter') commitTempo(); if (e.key === 'Escape') setEditingTempo(false); }}
                  className="w-16 px-1 py-0.5 text-sm text-center border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                />
              ) : (
                <button onClick={handleTempoClick} className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 tabular-nums" title="Tempo aendern">
                  &#9833;= {config.tempo}
                </button>
              )}
            </>
          )}

          {/* Progression indicator - hidden in compact mode */}
          {!isCompactToolbar && progressionStep > 0 && (
            <>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Schritt {progressionStep + 1}</span>
            </>
          )}

          {/* Mode toggle - hidden in compact mode */}
          {!isCompactToolbar && (
            <>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              <ModeSelector
                mode={appMode}
                onModeChange={setAppMode}
                midiConnected={midiConnectionStatus === 'connected' && !!midiDeviceId}
              />
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Back to setup */}
          <button
            onClick={handleBackToSetup}
            className={iconBtn('utility')}
            title="Zurueck zur Auswahl"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Settings - hidden in compact mode */}
          {!isCompactToolbar && (
            <button
              onClick={() => setSettingsOpen(true)}
              className={iconBtn('utility')}
              title="Einstellungen"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.248a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          )}

          {/* Next Exercise - hidden in compact mode */}
          {!isCompactToolbar && (
            <>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              <button
                onClick={handleNextExercise}
                className={iconBtn('utility')}
                title="Naechste Uebung"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Practice visualizer (only when active - now includes countdown immediately) */}
        {appMode === 'practice' && (practiceState === 'playing' || practiceState === 'countdown') && (
          <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
            <PracticeVisualizer
              practiceState={practiceState}
              correctCount={practiceAccuracy.correct}
              incorrectCount={practiceAccuracy.incorrect}
              totalNotes={practiceAccuracy.total}
              currentNoteIndex={practiceAccuracy.correct + practiceAccuracy.incorrect}
              lastComparison={lastComparison}
            />
          </div>
        )}

        {/* Audio error */}
        {audioError && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800 shrink-0">
            <p className="text-sm text-red-700 dark:text-red-300">{audioError}
              <button onClick={() => setAudioError(null)} className="ml-2 text-xs underline">Schliessen</button>
            </p>
          </div>
        )}

        {/* MIDI warning (dismissible) */}
        {appMode === 'practice' && (midiConnectionStatus !== 'connected' || !midiDeviceId) && !midiWarningDismissed && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 shrink-0 flex items-center justify-between">
            <p className="text-sm text-amber-700 dark:text-amber-300">Bitte verbinde ein MIDI-Keyboard um zu ueben.</p>
            <button
              onClick={() => setMidiWarningDismissed(true)}
              className="ml-4 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 p-1"
              title="Warnung ausblenden"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Fullscreen Music Sheet */}
        {currentExercise && (
          <div className="flex-1 min-h-0 overflow-auto bg-white">
            <MusicSheet
              key={currentExercise.id}
              exercise={currentExercise}
              barsPerLine={4}
              highlightedNoteIds={highlightedNoteIds}
              fullscreen
            />
          </div>
        )}
      </div>

      <NoteReaderSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {showResults && currentSessionSummary && (
        <ResultsModal
          summary={currentSessionSummary}
          isOpen={showResults}
          onClose={hideResultsModal}
          onRetry={handleRetry}
          onNextExercise={handleNextExercise}
        />
      )}
    </>
  );
}
