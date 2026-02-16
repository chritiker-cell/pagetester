/**
 * ScalesView — main view for scale practice (Setup + Practice phases)
 * Follows the same pattern as NoteReaderView
 */
import { useEffect, useCallback, useState, useRef } from 'react';
import { MusicSheet } from './notation/MusicSheet';
import ModeSelector, { type AppMode } from './ModeSelector';
import MidiDeviceSelector from './MidiDeviceSelector';
import PracticeVisualizer from './PracticeVisualizer';
import ResultsModal from './ResultsModal';
import ScaleSelector from './ScaleSelector';
import ScalesSettings from './ScalesSettings';
import { getIconButtonClasses } from './ui/iconButtonStyles';
import { PlayIcon, PauseIcon, StopIcon, LoopIcon, MetronomeIcon } from './ui/PlaybackIcons';
import { useScalesStore } from '../store/useScalesStore';
import { useExerciseStore } from '../store/useExerciseStore';
import { usePlaybackStore } from '../store/usePlaybackStore';
import { useMidiStore } from '../store/useMidiStore';
import { useScoringStore } from '../store/useScoringStore';
import { useFavoritesStore, getScaleFavoriteId } from '../store/useFavoritesStore';
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
import { generateScale } from '../utils/scaleGenerator';
import { SCALE_TYPE_LABELS, MODE_LABELS, getNextKeyInGroup, getKeysForGroup } from '../data/scaleData';
import type { Exercise } from '../types/music';
import type { NoteComparison } from '../types/comparison';
import type { SessionSummary } from '../types/scoring';

type Phase = 'setup' | 'practice';

export default function ScalesView() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [generatedExercise, setGeneratedExercise] = useState<Exercise | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const scalesStore = useScalesStore();
  const { setExercise } = useExerciseStore();

  const {
    config, isReady, scheduledNotes, status,
    setReady, setScheduledNotes, setTotalDuration, setCurrentNoteIndex,
    setMetronomeBeat, setConfig, setTempo: setPlaybackTempo,
    toggleMetronome, toggleLoop, stop, play, pause,
  } = usePlaybackStore();

  const {
    connectionStatus: midiConnectionStatus,
    selectedDeviceId: midiDeviceId,
    playedNotes, startListening, stopListening, clearPlayedNotes,
  } = useMidiStore();

  const {
    showResults, recordScore, hideResultsModal, clearCurrentScore, getSessionSummary,
  } = useScoringStore();

  const { addScale, removeScale, isScaleFavorite } = useFavoritesStore();

  const [appMode, setAppMode] = useState<AppMode>('listen');
  const [highlightedNoteIds, setHighlightedNoteIds] = useState<string[]>([]);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [practiceState, setPracticeState] = useState<PracticeModeState>('idle');
  const [practiceAccuracy, setPracticeAccuracy] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [midiWarningDismissed, setMidiWarningDismissed] = useState(false);
  const [lastComparison, setLastComparison] = useState<NoteComparison | null>(null);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [practiceStartTime, setPracticeStartTime] = useState<number>(0);

  // Tempo editing
  const [editingTempo, setEditingTempo] = useState(false);
  const [tempoInput, setTempoInput] = useState('');
  const tempoInputRef = useRef<HTMLInputElement>(null);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isWebAudioSupported()) {
      setAudioError('Dein Browser unterstuetzt keine Audio-Wiedergabe.');
    }
  }, []);

  useEffect(() => {
    return () => {
      getPlaybackController().stop();
      stopPractice();
      hidePlaybackCursor();
    };
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
    setConfig({
      tempo: currentExercise.tempo,
      beatsPerMeasure,
      beatUnit,
      loop: scalesStore.loopDefaultOn,
      metronomeEnabled: scalesStore.metronomeDefaultOn,
    });

    const exerciseConfig = {
      tempo: currentExercise.tempo, beatsPerMeasure, beatUnit,
      loop: scalesStore.loopDefaultOn, metronomeEnabled: scalesStore.metronomeDefaultOn, countIn: 0,
    };
    const notes = exerciseToScheduledNotes(currentExercise, exerciseConfig);
    setScheduledNotes(notes);

    const duration = calculateExerciseDuration(currentExercise, currentExercise.tempo);
    setTotalDuration(duration);
  }, [currentExercise]);

  const handleGenerate = useCallback(() => {
    const exercise = generateScale({
      key: scalesStore.selectedKey,
      scaleType: scalesStore.scaleType,
      mode: scalesStore.mode,
      octaves: scalesStore.octaves,
      tempo: config.tempo,
      showFingering: scalesStore.showFingering,
      level: scalesStore.level,
      polyrhythmVariant: scalesStore.polyrhythmVariant,
      thirdsVariant: scalesStore.thirdsVariant,
    });
    setGeneratedExercise(exercise);
    setExercise(exercise.id);
    setPhase('practice');
  }, [scalesStore, config.tempo, setExercise]);

  // Navigate to next key in the current group (sequential, wraps around)
  const handleNextInGroup = useCallback(() => {
    const { key, nextIndex } = getNextKeyInGroup(
      scalesStore.scaleType,
      scalesStore.selectedKeyGroup,
      scalesStore.keyGroupIndex
    );
    scalesStore.setKeyGroupIndex(nextIndex);
    scalesStore.setSelectedKey(key);
    // Generate exercise with new key
    const exercise = generateScale({
      key,
      scaleType: scalesStore.scaleType,
      mode: scalesStore.mode,
      octaves: scalesStore.octaves,
      tempo: config.tempo,
      showFingering: scalesStore.showFingering,
      level: scalesStore.level,
      polyrhythmVariant: scalesStore.polyrhythmVariant,
      thirdsVariant: scalesStore.thirdsVariant,
    });
    setGeneratedExercise(exercise);
    setExercise(exercise.id);
  }, [scalesStore, config.tempo, setExercise]);

  // Check if we have more than one key in the current group
  const keysInGroup = getKeysForGroup(scalesStore.scaleType, scalesStore.selectedKeyGroup);
  const hasMultipleKeys = keysInGroup.length > 1;

  // Favorites logic
  const isFavorite = isScaleFavorite(
    scalesStore.selectedKey,
    scalesStore.scaleType,
    scalesStore.mode,
    scalesStore.octaves
  );

  const handleToggleFavorite = useCallback(() => {
    const { selectedKey, scaleType, mode, octaves, showFingering } = scalesStore;
    if (isFavorite) {
      const id = getScaleFavoriteId(selectedKey, scaleType, mode, octaves);
      removeScale(id);
    } else {
      const id = getScaleFavoriteId(selectedKey, scaleType, mode, octaves);
      addScale({
        id,
        key: selectedKey,
        scaleType,
        mode,
        octaves,
        tempo: config.tempo,
        showFingering,
        createdAt: new Date().toISOString(),
      });
    }
  }, [scalesStore, config.tempo, isFavorite, addScale, removeScale]);

  const handleBackToSetup = useCallback(() => {
    stop();
    stopPractice();
    clearNoteHighlights();
    clearPracticeFeedback();
    setHighlightedNoteIds([]);
    hidePlaybackCursor();
    setPracticeState('idle');
    setGeneratedExercise(null);
    setPhase('setup');
  }, [stop]);

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
        (_noteId, noteIndex) => { setCurrentNoteIndex(noteIndex); },
        (beat, isDownbeat) => { setMetronomeBeat(beat, isDownbeat); },
        () => { stop(); setHighlightedNoteIds([]); hidePlaybackCursor(); }
      );

      // Build cursor timeline (times relative to music start, not count-in)
      const allScheduled = controller.getScheduledNotes();
      const trebleNotes = allScheduled.filter(n => n.voice === 'treble').sort((a, b) => a.startTime - b.startTime);

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
            duration: n.durationSeconds
          });
        }
      }

      // Show cursor at first note position (visible during count-in)
      if (timeline.length > 0) {
        showCursorAtPosition(timeline[0].x, timeline[0].lineTop, timeline[0].lineBottom);
      }

      // Start playback (schedules count-in + notes via simplePlayback)
      await controller.play();
      play();

      // Start cursor animation using session for sync
      // Note: If toolbar resize triggers MusicSheet re-render, cursor is auto-restored
      const session = controller.getSession();
      if (session && timeline.length > 0) {
        const exerciseDurationMs = controller.getTotalDuration() * 1000;
        animateCursorWithSession(timeline, session, exerciseDurationMs);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setAudioError(getAudioErrorMessage(error));
    }
  }, [initializeAudio, currentExercise, config, setCurrentNoteIndex, setMetronomeBeat, stop, play]);

  const handlePause = useCallback(() => {
    getPlaybackController().pause();
    pause();
  }, [pause]);

  const handleStop = useCallback(() => {
    // CRITICAL: Stop store state FIRST to prevent any callbacks from triggering restart
    stop();
    // Then stop the controller (which clears timeouts and stops audio)
    getPlaybackController().stop();
    clearNoteHighlights();
    setHighlightedNoteIds([]);
    hidePlaybackCursor();
  }, [stop]);

  const handlePlayPause = useCallback(() => {
    if (status === 'playing') handlePause(); else handlePlay();
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
        countdownBeats: 4,
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

  // MIDI input forwarding
  useEffect(() => {
    if (practiceState === 'playing' && playedNotes.length > 0) {
      const latestNote = playedNotes[playedNotes.length - 1];
      if (latestNote && !latestNote.endTime) {
        handleMidiInput({
          type: 'noteon', note: latestNote.midiNote, velocity: latestNote.velocity,
          timestamp: performance.now(), channel: 0,
        });
      }
    }
  }, [practiceState, playedNotes]);

  // Config sync
  useEffect(() => {
    getPlaybackController().updateConfig({
      tempo: config.tempo, metronomeEnabled: config.metronomeEnabled, loop: config.loop,
    });
  }, [config.tempo, config.metronomeEnabled, config.loop]);

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== 'practice') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ': e.preventDefault(); handlePlayPause(); break;
        case 'Escape': e.preventDefault(); handleStop(); break;
        case 'l': case 'L': e.preventDefault(); toggleLoop(); break;
        case 'm': case 'M': e.preventDefault(); toggleMetronome(); break;
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
    if (!isNaN(val) && val >= 40 && val <= 200) setPlaybackTempo(val);
    setEditingTempo(false);
  };

  const adjustTempo = (delta: number) => {
    const newTempo = Math.max(40, Math.min(200, config.tempo + delta));
    setPlaybackTempo(newTempo);
  };

  const currentSessionSummary = sessionSummary || getSessionSummary();

  // ========================
  // SETUP PHASE
  // ========================
  if (phase === 'setup') {
    return (
      <div className="flex items-start justify-center min-h-[60vh] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl">
          <ScaleSelector onGenerate={handleGenerate} />

          {/* Info Panel */}
          <div className="lg:sticky lg:top-4 space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {scalesStore.selectedKey}-{SCALE_TYPE_LABELS[scalesStore.scaleType]}
              </h3>
              <ul className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>Modus: {MODE_LABELS[scalesStore.mode]}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>{scalesStore.octaves} Oktave(n)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>Tempo: {config.tempo} BPM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>Fingersaetze: {scalesStore.showFingering ? 'Ja' : 'Nein'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary-50/50 dark:bg-primary-900/10 rounded-lg p-4 border border-primary-100 dark:border-neutral-700">
              <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                Hinweis
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Die Skala wird als Klaviersystem (Grand Staff) mit rechter und linker Hand angezeigt.
                Aufwaerts und abwaerts in einem Durchgang.
              </p>
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

  // Local icon for mobile menu (not shared)
  const MoreIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
  );

  // Use shared iconBtn utility
  const iconBtn = getIconButtonClasses;

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Desktop Toolbar */}
        <div className={`hidden md:flex items-center gap-2 px-4 ${isCompactToolbar ? 'py-1' : 'py-2'} bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shrink-0 transition-all duration-200`}>
          {appMode === 'listen' ? (
            <>
              <button onClick={handlePlayPause} className={iconBtn('primary', isPlaying)} title={isPlaying ? 'Pause (Space)' : 'Play (Space)'} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button onClick={handleStop} className={iconBtn('utility')} title="Stop (Esc)" disabled={status === 'stopped'} aria-label="Stop">
                <StopIcon />
              </button>
              {!isCompactToolbar && (
                <>
                  <button onClick={toggleLoop} className={iconBtn('toggle', config.loop)} title="Loop (L)" aria-label="Loop">
                    <LoopIcon />
                  </button>
                  <button onClick={toggleMetronome} className={iconBtn('toggle', config.metronomeEnabled)} title="Metronom (M)" aria-label="Metronom">
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
                <button onClick={handleStopPractice} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-600 dark:text-neutral-200">
                  Stopp
                </button>
              )}
              {!isCompactToolbar && (
                <>
                  <button onClick={toggleMetronome} className={iconBtn('toggle', config.metronomeEnabled)} title="Metronom (M)"
                    disabled={['playing', 'countdown'].includes(practiceState)} aria-label="Metronom">
                    <MetronomeIcon />
                  </button>
                  <MidiDeviceSelector compact />
                </>
              )}
            </>
          )}

          <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />

          {/* Tempo - Enhanced with better affordance */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600">
            {editingTempo ? (
              <>
                <button
                  onClick={() => adjustTempo(-5)}
                  className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded text-neutral-500 dark:text-neutral-400"
                  aria-label="Tempo verringern"
                >
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="5" width="8" height="2" /></svg>
                </button>
                <input
                  ref={tempoInputRef}
                  type="number" min={40} max={200}
                  value={tempoInput}
                  onChange={e => setTempoInput(e.target.value)}
                  onBlur={commitTempo}
                  onKeyDown={e => { if (e.key === 'Enter') commitTempo(); if (e.key === 'Escape') setEditingTempo(false); }}
                  className="w-12 text-sm text-center bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
                <button
                  onClick={() => adjustTempo(5)}
                  className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded text-neutral-500 dark:text-neutral-400"
                  aria-label="Tempo erhoehen"
                >
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M5 2h2v3h3v2H7v3H5V7H2V5h3V2z" /></svg>
                </button>
              </>
            ) : (
              <button onClick={handleTempoClick} className="flex items-center gap-2 group" title="Tempo aendern (klicken zum Bearbeiten)">
                <span className="text-lg text-neutral-600 dark:text-neutral-400">&#9833;</span>
                <span className="font-mono font-medium tabular-nums text-neutral-700 dark:text-neutral-300">{config.tempo}</span>
                <svg className="w-3 h-3 text-neutral-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>

          {/* Mode toggle - hidden in compact mode */}
          {!isCompactToolbar && (
            <>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Modus</span>
                <ModeSelector
                  mode={appMode}
                  onModeChange={setAppMode}
                  midiConnected={midiConnectionStatus === 'connected' && !!midiDeviceId}
                />
              </div>
            </>
          )}

          <div className="flex-1" />

          {/* Favorite toggle - hidden in compact mode */}
          {!isCompactToolbar && (
            <button
              onClick={handleToggleFavorite}
              className={iconBtn('toggle', isFavorite)}
              title={isFavorite ? 'Favorit entfernen' : 'Als Favorit speichern'}
              aria-label={isFavorite ? 'Favorit entfernen' : 'Als Favorit speichern'}
            >
              {isFavorite ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              )}
            </button>
          )}

          {/* Back to setup */}
          <button
            onClick={handleBackToSetup}
            className={iconBtn('utility')}
            title="Zurueck zur Auswahl"
            aria-label="Zurueck zur Auswahl"
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
              aria-label="Einstellungen"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          )}

          {/* Next key button - hidden in compact mode */}
          {!isCompactToolbar && hasMultipleKeys && (
            <>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              <button onClick={handleNextInGroup} className={iconBtn('utility')} title="Naechste Tonart" aria-label="Naechste Tonart">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Mobile Toolbar */}
        <div className={`flex md:hidden items-center gap-2 px-3 ${isCompactToolbar ? 'py-1' : 'py-2'} bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shrink-0 transition-all duration-200`}>
          {appMode === 'listen' ? (
            <>
              <button onClick={handlePlayPause} className={iconBtn('primary', isPlaying)} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button onClick={handleStop} className={iconBtn('utility')} disabled={status === 'stopped'} aria-label="Stop">
                <StopIcon />
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
                <button onClick={handleStopPractice} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-600 dark:text-neutral-200">
                  Stopp
                </button>
              )}
            </>
          )}

          {/* Compact tempo display */}
          <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">&#9833;{config.tempo}</span>

          <div className="flex-1" />

          {/* Back button */}
          <button onClick={handleBackToSetup} className={iconBtn('utility')} aria-label="Zurueck">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* More menu button */}
          {!isCompactToolbar && (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={iconBtn('utility')} aria-label="Mehr Optionen">
              <MoreIcon />
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && !isCompactToolbar && (
          <div className="md:hidden absolute top-16 right-3 z-50 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 p-2 min-w-48">
            <div className="space-y-1">
              {appMode === 'listen' && (
                <>
                  <button
                    onClick={() => { toggleLoop(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${config.loop ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'}`}
                  >
                    <LoopIcon />
                    <span>Loop</span>
                    {config.loop && <span className="ml-auto text-xs">An</span>}
                  </button>
                  <button
                    onClick={() => { toggleMetronome(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${config.metronomeEnabled ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'}`}
                  >
                    <MetronomeIcon />
                    <span>Metronom</span>
                    {config.metronomeEnabled && <span className="ml-auto text-xs">An</span>}
                  </button>
                </>
              )}

              <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-2" />

              <div className="px-3 py-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Modus</span>
                <div className="mt-1">
                  <ModeSelector
                    mode={appMode}
                    onModeChange={(m) => { setAppMode(m); setMobileMenuOpen(false); }}
                    midiConnected={midiConnectionStatus === 'connected' && !!midiDeviceId}
                  />
                </div>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-2" />

              <button
                onClick={() => { handleToggleFavorite(); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isFavorite ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'}`}
              >
                {isFavorite ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                )}
                <span>{isFavorite ? 'Favorit entfernen' : 'Als Favorit speichern'}</span>
              </button>

              <button
                onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                <span>Einstellungen</span>
              </button>

              {hasMultipleKeys && (
                <button
                  onClick={() => { handleNextInGroup(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  <span>Naechste Tonart</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Backdrop for mobile menu */}
        {mobileMenuOpen && !isCompactToolbar && (
          <div
            className="md:hidden fixed inset-0 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Practice visualizer */}
        {appMode === 'practice' && (practiceState === 'playing' || practiceState === 'countdown') && (
          <div className="px-4 py-1.5 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
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

        {audioError && (
          <div className="px-4 py-2 bg-red-50/50 border-b border-red-200 shrink-0">
            <p className="text-xs text-red-700">{audioError}
              <button onClick={() => setAudioError(null)} className="ml-2 text-xs underline">&times;</button>
            </p>
          </div>
        )}

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

        {/* Music Sheet */}
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

      <ScalesSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {showResults && currentSessionSummary && (
        <ResultsModal
          summary={currentSessionSummary}
          isOpen={showResults}
          onClose={() => { hideResultsModal(); setAppMode('listen'); }}
          onRetry={handleRetry}
          onNextExercise={handleGenerate}
        />
      )}
    </>
  );
}
