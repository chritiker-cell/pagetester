/**
 * ArpeggiosView — main view for arpeggio practice (Setup + Practice phases)
 * Follows the same pattern as ScalesView
 */
import { useEffect, useCallback, useState, useRef } from 'react';
import { MusicSheet } from './notation/MusicSheet';
import ModeSelector, { type AppMode } from './ModeSelector';
import MidiDeviceSelector from './MidiDeviceSelector';
import PracticeVisualizer from './PracticeVisualizer';
import ResultsModal from './ResultsModal';
import ArpeggioSelector from './ArpeggioSelector';
import { getIconButtonClasses } from './ui/iconButtonStyles';
import { PlayIcon, PauseIcon, StopIcon, LoopIcon, MetronomeIcon } from './ui/PlaybackIcons';
import { useArpeggioStore } from '../store/useArpeggioStore';
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
import { generateArpeggio } from '../utils/arpeggioGenerator';
import {
  ARPEGGIO_TYPE_LABELS,
  ARPEGGIO_PATTERN_LABELS,
  ARPEGGIO_INVERSION_LABELS,
} from '../data/arpeggioData';
import type { Exercise } from '../types/music';
import type { NoteComparison } from '../types/comparison';
import type { SessionSummary } from '../types/scoring';

type Phase = 'setup' | 'practice';

export default function ArpeggiosView() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [generatedExercise, setGeneratedExercise] = useState<Exercise | null>(null);

  const arpeggioStore = useArpeggioStore();
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
    setConfig({ tempo: currentExercise.tempo, beatsPerMeasure, beatUnit });

    const exerciseConfig = {
      tempo: currentExercise.tempo, beatsPerMeasure, beatUnit,
      loop: false, metronomeEnabled: true, countIn: 0,
    };
    const notes = exerciseToScheduledNotes(currentExercise, exerciseConfig);
    setScheduledNotes(notes);

    const duration = calculateExerciseDuration(currentExercise, currentExercise.tempo);
    setTotalDuration(duration);
  }, [currentExercise]);

  const handleGenerate = useCallback(() => {
    const exercise = generateArpeggio({
      key: arpeggioStore.selectedKey,
      chordType: arpeggioStore.chordType,
      pattern: arpeggioStore.pattern,
      inversion: arpeggioStore.inversion,
      octaves: arpeggioStore.octaves,
      bars: arpeggioStore.bars,
      tempo: arpeggioStore.tempo,
      showFingering: arpeggioStore.showFingering,
      level: arpeggioStore.level,
      hand: arpeggioStore.hand,
    });
    setGeneratedExercise(exercise);
    setExercise(exercise.id);
    setPhase('practice');
  }, [arpeggioStore, setExercise]);

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

  const currentSessionSummary = sessionSummary || getSessionSummary();

  // ========================
  // SETUP PHASE
  // ========================
  if (phase === 'setup') {
    return (
      <div className="flex items-start justify-center min-h-[60vh] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl">
          <ArpeggioSelector onGenerate={handleGenerate} />

          {/* Info Panel */}
          <div className="lg:sticky lg:top-4 space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {arpeggioStore.selectedKey} {ARPEGGIO_TYPE_LABELS[arpeggioStore.chordType]}
              </h3>
              <ul className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>Umkehrung: {ARPEGGIO_INVERSION_LABELS[arpeggioStore.inversion]}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>Pattern: {ARPEGGIO_PATTERN_LABELS[arpeggioStore.pattern]}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>{arpeggioStore.octaves} Oktave(n), {arpeggioStore.bars} Takte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>Tempo: {arpeggioStore.tempo} BPM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  <span>Fingersaetze: {arpeggioStore.showFingering ? 'Ja' : 'Nein'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary-50/50 dark:bg-primary-900/10 rounded-lg p-4 border border-primary-100 dark:border-neutral-700">
              <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Hinweis
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Arpeggios sind gebrochene Akkorde, bei denen die Toene nacheinander gespielt werden.
                Uebe langsam mit Metronom und steigere das Tempo schrittweise.
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

  // Use shared iconBtn utility
  const iconBtn = getIconButtonClasses;

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Toolbar */}
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
                <button onClick={handleStopPractice} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-200 text-neutral-700 hover:bg-neutral-300">
                  Stopp
                </button>
              )}
              <button onClick={toggleMetronome} className={iconBtn('toggle', config.metronomeEnabled)} title="Metronom (M)"
                disabled={practiceState === 'playing' || practiceState === 'countdown'}>
                <MetronomeIcon />
              </button>
              <MidiDeviceSelector compact />
            </>
          )}

          <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />

          {/* Tempo */}
          {editingTempo ? (
            <input
              ref={tempoInputRef}
              type="number" min={40} max={200}
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

          {/* Mode toggle */}
          <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
          <ModeSelector
            mode={appMode}
            onModeChange={setAppMode}
            midiConnected={midiConnectionStatus === 'connected' && !!midiDeviceId}
          />

          <div className="flex-1" />

          {/* Regenerate */}
          <button
            onClick={handleGenerate}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/60"
          >
            Neu generieren
          </button>

          <button
            onClick={handleBackToSetup}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
          >
            Zurueck
          </button>
        </div>

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
