/**
 * SongsView — main view for song practice (Setup + Practice phases)
 * Follows the same pattern as ScalesView
 */
import { useEffect, useCallback, useState, useRef } from 'react';
import { MusicSheet } from './notation/MusicSheet';
import ModeSelector, { type AppMode } from './ModeSelector';
import MidiDeviceSelector from './MidiDeviceSelector';
import PracticeVisualizer from './PracticeVisualizer';
import ResultsModal from './ResultsModal';
import SongSelector from './SongSelector';
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
import type { Song } from '../types/songs';
import type { NoteComparison } from '../types/comparison';
import type { SessionSummary } from '../types/scoring';

type Phase = 'setup' | 'practice';

export default function SongsView() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

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

  const currentExercise = selectedSong;

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
      loop: false,
      metronomeEnabled: true,
    });

    const exerciseConfig = {
      tempo: currentExercise.tempo, beatsPerMeasure, beatUnit,
      loop: false, metronomeEnabled: true, countIn: 0,
    };
    const notes = exerciseToScheduledNotes(currentExercise, exerciseConfig);
    setScheduledNotes(notes);

    const duration = calculateExerciseDuration(currentExercise, currentExercise.tempo);
    setTotalDuration(duration);
  }, [currentExercise]);

  const handleSelectSong = useCallback((song: Song) => {
    setSelectedSong(song);
    setExercise(song.id);
    setPhase('practice');
  }, [setExercise]);

  const handleBackToSetup = useCallback(() => {
    stop();
    stopPractice();
    clearNoteHighlights();
    clearPracticeFeedback();
    setHighlightedNoteIds([]);
    hidePlaybackCursor();
    setPracticeState('idle');
    setSelectedSong(null);
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

      // Build cursor timeline
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
            duration: n.durationSeconds,
          });
        }
      }

      if (timeline.length > 0) {
        showCursorAtPosition(timeline[0].x, timeline[0].lineTop, timeline[0].lineBottom);
      }

      await controller.play();
      play();

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
    stop();
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
        onCountdownBeat: () => {},
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
        <SongSelector onSelectSong={handleSelectSong} />
      </div>
    );
  }

  // ========================
  // PRACTICE PHASE
  // ========================
  const isPlaying = status === 'playing';
  const isCompactToolbar = status === 'playing' || practiceState === 'playing' || practiceState === 'countdown';

  const MoreIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
  );

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

          {/* Tempo */}
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

          {/* Mode toggle */}
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

          {/* Song title in toolbar */}
          {selectedSong && !isCompactToolbar && (
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate max-w-48">
              {selectedSong.name}
            </span>
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

      {showResults && currentSessionSummary && (
        <ResultsModal
          summary={currentSessionSummary}
          isOpen={showResults}
          onClose={() => { hideResultsModal(); setAppMode('listen'); }}
          onRetry={handleRetry}
          onNextExercise={handleBackToSetup}
        />
      )}
    </>
  );
}
