import { useEffect, useCallback, useState, useRef } from 'react';
import { MusicSheet } from './notation/MusicSheet';
import ModeSelector, { type AppMode } from './ModeSelector';
import MidiDeviceSelector from './MidiDeviceSelector';
import PracticeVisualizer from './PracticeVisualizer';
import ResultsModal from './ResultsModal';
import Button from './ui/Button';
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
  animateCursorTimeline,
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
  KEY_STAGE_INFO,
  AVAILABLE_KEY_STAGES,
  type Difficulty,
  type TimeSignatureOption,
  type KeyStage,
} from '../utils/exerciseGenerator';
import type { Exercise } from '../types/music';
import type { NoteComparison } from '../types/comparison';
import type { SessionSummary } from '../types/scoring';
import NoteReaderSettings from './NoteReaderSettings';
import { useNoteReaderSettingsStore } from '../store/useNoteReaderSettingsStore';

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

  // Tempo editing
  const [editingTempo, setEditingTempo] = useState(false);
  const [tempoInput, setTempoInput] = useState('');
  const tempoInputRef = useRef<HTMLInputElement>(null);

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
  const [countdownBeat, setCountdownBeat] = useState(0);
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
  }, [difficulty, timeSignature, keyStage, barCount, setExercise]);

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
    const ts = (nrSettings.timeSignature || timeSignature) as TimeSignatureOption;
    const bc = nrSettings.barCount || barCount;
    const exercise = generateExercise({ difficulty, timeSignature: ts, keyStage, barCount: bc, progressionStep: nextStep });
    setGeneratedExercise(exercise);
    setExercise(exercise.id);
  }, [hideResultsModal, clearCurrentScore, difficulty, timeSignature, keyStage, barCount, progressionStep, setExercise, nrSettings.timeSignature, nrSettings.barCount]);

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
        () => { stop(); setHighlightedNoteIds([]); hidePlaybackCursor(); }
      );

      // Build cursor timeline from ALL treble notes (including rests) in time order
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
            noteId: n.id,
            duration: n.durationSeconds,
          });
        }
      }

      // Show cursor at first note position immediately (before count-in)
      if (timeline.length > 0) {
        showCursorAtPosition(timeline[0].x, timeline[0].lineTop, timeline[0].lineBottom);
      }

      // Play (includes count-in) - cursor stays still during count-in
      await controller.play();
      play();

      // NOW start cursor animation - music has just begun
      if (timeline.length > 0) {
        const totalDuration = controller.getTotalDuration();
        animateCursorTimeline(timeline, totalDuration, config.loop);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setAudioError(getAudioErrorMessage(error));
    }
  }, [initializeAudio, currentExercise, config, setCurrentNoteIndex, setMetronomeBeat, stop, play]);

  const handlePause = useCallback(() => {
    const controller = getPlaybackController();
    controller.pause();
    pause();
  }, [pause]);

  const handleStop = useCallback(() => {
    const controller = getPlaybackController();
    controller.stop();
    stop();
    clearNoteHighlights();
    setHighlightedNoteIds([]);
    hidePlaybackCursor();
  }, [stop]);

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
        onCountdownBeat: (beat) => setCountdownBeat(beat),
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
    const ksInfo = KEY_STAGE_INFO[keyStage];

    return (
      <div className="flex items-start justify-center min-h-[60vh] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* LEFT: Selection Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-neutral-900">Neue Uebung</h2>

            {/* Difficulty - 6 vertical buttons */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Schwierigkeitsstufe</label>
              <div className="flex flex-col gap-1.5">
                {DIFFICULTY_LABELS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-left transition-colors ${
                      difficulty === opt.value
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    <span className="font-bold mr-2">{opt.label}.</span>{opt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Stage - horizontal */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Tonart-Stufe</label>
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
                            ? 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                            : 'bg-neutral-100 text-neutral-300 cursor-not-allowed border border-neutral-100'
                      }`}
                    >
                      {ks}
                    </button>
                  );
                })}
              </div>
              {!availableKeyStages.includes(4 as KeyStage) && (
                <p className="text-xs text-neutral-400 mt-1">Stufen 4-5 ab Schwierigkeit 5 verfuegbar</p>
              )}
            </div>

            {/* Time Signature - horizontal buttons */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Taktart</label>
              <div className="flex gap-1.5 flex-wrap">
                {tsOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeSignature(opt.value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      timeSignature === opt.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Count - horizontal buttons */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Anzahl Takte</label>
              <div className="flex gap-1.5 flex-wrap">
                {barCountOptions.map(n => (
                  <button
                    key={n}
                    onClick={() => setBarCount(n)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      barCount === n
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
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
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">{diffInfo.name}</h3>
              <ul className="space-y-1.5">
                {diffInfo.bullets.map((b, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">&#8226;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Stage Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">{ksInfo.name}</h3>
              <ul className="space-y-1.5">
                {ksInfo.bullets.map((b, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">&#8226;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Zusammenfassung</h4>
              <div className="text-sm text-neutral-700 space-y-1">
                <p><span className="font-medium">Stufe:</span> {diffInfo.name}</p>
                <p><span className="font-medium">Tonart:</span> {ksInfo.name}</p>
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

  const PlayIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  );
  const PauseIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
  );
  const StopIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z" /></svg>
  );
  const LoopIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" /></svg>
  );
  const MetronomeIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5c-.55 0-1 .45-1 1v1.09C7.72 4.09 5 7.12 5 10.5c0 3.87 2.69 7.12 6.31 7.91L10 22h4l-1.31-3.59C16.31 17.62 19 14.37 19 10.5c0-3.38-2.72-6.41-6-6.91V2.5c0-.55-.45-1-1-1zm0 5c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1z" /></svg>
  );

  const iconBtn = (active: boolean) =>
    `p-2 rounded-lg transition-colors ${active ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`;

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Compact Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-neutral-200 shrink-0 flex-wrap">
          {appMode === 'listen' ? (
            <>
              <button onClick={handlePlayPause} className={iconBtn(isPlaying)} title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button onClick={handleStop} className={iconBtn(false)} title="Stop (Esc)" disabled={status === 'stopped'}>
                <StopIcon />
              </button>
              <button onClick={toggleLoop} className={iconBtn(config.loop)} title="Loop (L)">
                <LoopIcon />
              </button>
              <button onClick={toggleMetronome} className={iconBtn(config.metronomeEnabled)} title="Metronom (M)">
                <MetronomeIcon />
              </button>
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
                <button onClick={handleStopPractice} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-200 text-neutral-700 hover:bg-neutral-300">
                  Stopp
                </button>
              )}
              <button onClick={toggleMetronome} className={iconBtn(config.metronomeEnabled)} title="Metronom (M)"
                disabled={practiceState === 'playing' || practiceState === 'countdown'}>
                <MetronomeIcon />
              </button>
              <MidiDeviceSelector compact />
            </>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-neutral-200 mx-1" />

          {/* Tempo */}
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
              className="w-16 px-1 py-0.5 text-sm text-center border border-neutral-300 rounded"
            />
          ) : (
            <button onClick={handleTempoClick} className="text-sm text-neutral-700 hover:text-primary-600 tabular-nums" title="Tempo aendern">
              &#9833;= {config.tempo}
            </button>
          )}

          {/* Progression indicator */}
          {progressionStep > 0 && (
            <>
              <div className="w-px h-6 bg-neutral-200 mx-1" />
              <span className="text-xs text-neutral-500">Schritt {progressionStep + 1}</span>
            </>
          )}

          {/* Mode toggle */}
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <ModeSelector
            mode={appMode}
            onModeChange={setAppMode}
            midiConnected={midiConnectionStatus === 'connected' && !!midiDeviceId}
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
            title="Einstellungen"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.248a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>

          {/* Next Exercise */}
          <button
            onClick={handleNextExercise}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200"
          >
            Naechste Uebung
          </button>

          {/* Back to setup */}
          <button
            onClick={handleBackToSetup}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          >
            Zurueck
          </button>
        </div>

        {/* Practice visualizer (only when active) */}
        {appMode === 'practice' && (practiceState === 'playing' || practiceState === 'countdown') && (
          <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200 shrink-0">
            <PracticeVisualizer
              practiceState={practiceState}
              correctCount={practiceAccuracy.correct}
              incorrectCount={practiceAccuracy.incorrect}
              totalNotes={practiceAccuracy.total}
              countdownBeat={countdownBeat}
              countdownTotal={4}
              currentNoteIndex={practiceAccuracy.correct + practiceAccuracy.incorrect}
              lastComparison={lastComparison}
            />
          </div>
        )}

        {/* Audio error */}
        {audioError && (
          <div className="px-4 py-2 bg-red-50 border-b border-red-200 shrink-0">
            <p className="text-sm text-red-700">{audioError}
              <button onClick={() => setAudioError(null)} className="ml-2 text-xs underline">Schliessen</button>
            </p>
          </div>
        )}

        {/* MIDI warning */}
        {appMode === 'practice' && (midiConnectionStatus !== 'connected' || !midiDeviceId) && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 shrink-0">
            <p className="text-sm text-amber-700">Bitte verbinde ein MIDI-Keyboard um zu ueben.</p>
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
          onClose={() => { hideResultsModal(); setAppMode('listen'); }}
          onRetry={handleRetry}
          onNextExercise={handleNextExercise}
        />
      )}
    </>
  );
}
