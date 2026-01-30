import { useEffect, useCallback, useState } from 'react';
import { MusicSheet } from './notation/MusicSheet';
import ExerciseSelector from './ExerciseSelector';
import { TwoColumnLayout } from './Layout';
import PlaybackControls from './PlaybackControls';
import TempoSlider from './TempoSlider';
import Metronome from './Metronome';
import ModeSelector, { type AppMode } from './ModeSelector';
import MidiDeviceSelector from './MidiDeviceSelector';
import PracticeVisualizer from './PracticeVisualizer';
import ResultsModal from './ResultsModal';
import RandomExerciseGenerator from './RandomExerciseGenerator';
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
import type { NoteComparison } from '../types/comparison';
import type { SessionSummary } from '../types/scoring';

export default function NoteReaderView() {
  const {
    selectedExerciseId,
    filteredExercises,
    setExercise,
    getSelectedExercise,
  } = useExerciseStore();

  const {
    config,
    isReady,
    scheduledNotes,
    setReady,
    setScheduledNotes,
    setTotalDuration,
    setCurrentNoteIndex,
    setMetronomeBeat,
    setConfig,
    toggleMetronome,
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
      setAudioError(
        'Dein Browser unterstuetzt keine Audio-Wiedergabe. Bitte verwende einen modernen Browser wie Chrome, Firefox oder Safari.'
      );
    }
  }, []);

  const currentExercise = getSelectedExercise();

  const initializeAudio = useCallback(async () => {
    if (isReady) return;
    const controller = getPlaybackController();
    const success = await controller.initialize();
    setReady(success);
  }, [isReady, setReady]);

  useEffect(() => {
    if (!selectedExerciseId && filteredExercises.length > 0) {
      setExercise(filteredExercises[0].id);
    }
  }, [selectedExerciseId, filteredExercises, setExercise]);

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
      loop: false,
      metronomeEnabled: false,
      countIn: 0,
    };
    const notes = exerciseToScheduledNotes(currentExercise, exerciseConfig);
    setScheduledNotes(notes);

    const duration = calculateExerciseDuration(currentExercise, currentExercise.tempo);
    setTotalDuration(duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise]);

  const handlePlay = useCallback(async () => {
    try {
      setAudioError(null);
      await initializeAudio();
      const { start } = await import('tone');
      await start();
      if (!currentExercise) return;

      const controller = getPlaybackController(config);
      if (!controller.isReady()) {
        setAudioError('Audio-Engine konnte nicht initialisiert werden. Bitte versuche es erneut.');
        return;
      }

      controller.loadExercise(
        currentExercise,
        (noteId, noteIndex) => {
          // Find all notes with the same startTime (treble + bass in grand staff)
          const allScheduled = controller.getScheduledNotes();
          const thisNote = allScheduled.find(n => n.id === noteId);
          if (thisNote) {
            const siblingIds = allScheduled
              .filter(n => Math.abs(n.startTime - thisNote.startTime) < 0.001 && n.toneNotes.length > 0)
              .map(n => n.id);
            setHighlightedNoteIds(siblingIds);
          } else {
            setHighlightedNoteIds([noteId]);
          }
          setCurrentNoteIndex(noteIndex);
        },
        (beat, isDownbeat) => { setMetronomeBeat(beat, isDownbeat); },
        () => { stop(); setHighlightedNoteIds([]); }
      );

      await controller.play();
      play();
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
  }, [stop]);

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

  const handleNextExercise = useCallback(() => {
    hideResultsModal();
    clearCurrentScore();
    setSessionSummary(null);
    const currentIndex = filteredExercises.findIndex((e) => e.id === currentExercise?.id);
    if (currentIndex >= 0 && currentIndex < filteredExercises.length - 1) {
      setExercise(filteredExercises[currentIndex + 1].id);
    }
  }, [hideResultsModal, clearCurrentScore, filteredExercises, currentExercise, setExercise]);

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

  const currentSessionSummary = sessionSummary || getSessionSummary();

  return (
    <>
      <TwoColumnLayout
        sidebarPosition="left"
        main={
          <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
            {currentExercise ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neutral-900">{currentExercise.name}</h2>
                    <span className="text-lg font-semibold text-neutral-700">{currentExercise.tempo} BPM</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">Level {currentExercise.level}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">{currentExercise.timeSignature}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">{currentExercise.keySignature}-Dur</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">{currentExercise.bars.length} Takte</span>
                  </div>
                </div>

                <div className="mb-4">
                  <ModeSelector
                    mode={appMode}
                    onModeChange={setAppMode}
                    midiConnected={midiConnectionStatus === 'connected' && !!midiDeviceId}
                    className="mb-3"
                  />
                </div>
                <div className="mb-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  {appMode === 'listen' ? (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <PlaybackControls onPlay={handlePlay} onPause={handlePause} onStop={handleStop} disabled={!currentExercise} />
                        <Metronome />
                      </div>
                      <div className="mt-4 max-w-xs">
                        <TempoSlider min={40} max={180} step={5} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {practiceState === 'idle' || practiceState === 'finished' ? (
                            <Button
                              variant="primary"
                              onClick={handleStartPractice}
                              disabled={!currentExercise || midiConnectionStatus !== 'connected' || !midiDeviceId}
                            >
                              {practiceState === 'finished' ? 'Nochmal' : 'Uebung starten'}
                            </Button>
                          ) : (
                            <Button variant="secondary" onClick={handleStopPractice}>Stoppen</Button>
                          )}
                          {(practiceState === 'playing' || practiceState === 'countdown') && (
                            <Metronome isActive={true} />
                          )}
                        </div>
                        <MidiDeviceSelector compact />
                      </div>

                      {(practiceState === 'playing' || practiceState === 'countdown') && (
                        <PracticeVisualizer
                          practiceState={practiceState}
                          correctCount={practiceAccuracy.correct}
                          incorrectCount={practiceAccuracy.incorrect}
                          totalNotes={practiceAccuracy.total}
                          countdownBeat={countdownBeat}
                          countdownTotal={4}
                          currentNoteIndex={practiceAccuracy.correct + practiceAccuracy.incorrect}
                          lastComparison={lastComparison}
                          className="mt-4"
                        />
                      )}

                      {(midiConnectionStatus !== 'connected' || !midiDeviceId) && (
                        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                          <p className="text-sm text-warning-dark">Bitte verbinde ein MIDI-Keyboard um zu ueben.</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-end gap-4">
                        <div className="max-w-xs flex-1">
                          <TempoSlider min={40} max={180} step={5} />
                        </div>
                        <Button
                          variant={config.metronomeEnabled ? 'primary' : 'outline'}
                          size="md"
                          onClick={toggleMetronome}
                          disabled={practiceState === 'playing' || practiceState === 'countdown'}
                          title="Metronom ein/aus"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1.5c-.55 0-1 .45-1 1v1.09C7.72 4.09 5 7.12 5 10.5c0 3.87 2.69 7.12 6.31 7.91L10 22h4l-1.31-3.59C16.31 17.62 19 14.37 19 10.5c0-3.38-2.72-6.41-6-6.91V2.5c0-.55-.45-1-1-1zm0 5c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1z" />
                          </svg>
                        </Button>
                      </div>
                    </>
                  )}

                  {audioError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{audioError}</p>
                      <button onClick={() => setAudioError(null)} className="mt-2 text-xs text-red-600 hover:text-red-800 underline">Schliessen</button>
                    </div>
                  )}

                  {appMode === 'listen' && !isReady && !audioError && (
                    <p className="mt-3 text-xs text-neutral-500 italic">Klicke auf Play, um die Audio-Engine zu starten</p>
                  )}
                </div>

                <MusicSheet
                  key={currentExercise.id}
                  exercise={currentExercise}
                  width={900}
                  barsPerLine={4}
                  highlightedNoteIds={highlightedNoteIds}
                  className="shadow-sm"
                />

                {currentExercise.pedagogicalNotes && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-semibold text-blue-900 mb-1">Paedagogischer Hinweis</div>
                    <p className="text-sm text-blue-800">{currentExercise.pedagogicalNotes}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-neutral-500">
                Waehle eine Uebung aus der Liste
              </div>
            )}
          </div>
        }
        sidebar={
          <div className="space-y-4">
            <RandomExerciseGenerator />
            <ExerciseSelector />
            {appMode === 'practice' && <MidiDeviceSelector />}
          </div>
        }
      />

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
