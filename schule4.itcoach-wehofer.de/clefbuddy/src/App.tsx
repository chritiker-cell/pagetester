import { useEffect, useCallback, useState } from 'react';
import './App.css';
import { MusicSheet } from './components/notation/MusicSheet';
import ExerciseSelector from './components/ExerciseSelector';
import { TwoColumnLayout, LayoutSection } from './components/Layout';
import PlaybackControls from './components/PlaybackControls';
import TempoSlider from './components/TempoSlider';
import Metronome from './components/Metronome';
import { useExerciseStore } from './store/useExerciseStore';
import { usePlaybackStore } from './store/usePlaybackStore';
import {
  getPlaybackController,
  exerciseToScheduledNotes,
  calculateExerciseDuration,
} from './utils/playbackScheduler';
import { parseTimeSignature } from './utils/timing';
import { clearNoteHighlights } from './utils/vexflowRenderer';
import { isWebAudioSupported, getAudioErrorMessage } from './utils/audioCompat';

function App() {
  // Get state and actions from exercise store
  const {
    selectedExerciseId,
    filteredExercises,
    setExercise,
    getSelectedExercise,
  } = useExerciseStore();

  // Get state and actions from playback store
  const {
    config,
    isReady,
    setReady,
    setScheduledNotes,
    setTotalDuration,
    setCurrentNoteIndex,
    setMetronomeBeat,
    setConfig,
    stop,
    play,
    pause,
  } = usePlaybackStore();

  // Track the currently highlighted note ID
  const [highlightedNoteId, setHighlightedNoteId] = useState<string | null>(null);

  // Audio error state
  const [audioError, setAudioError] = useState<string | null>(null);

  // Check browser compatibility on mount
  useEffect(() => {
    if (!isWebAudioSupported()) {
      setAudioError(
        'Dein Browser unterstützt keine Audio-Wiedergabe. Bitte verwende einen modernen Browser wie Chrome, Firefox oder Safari.'
      );
    }
  }, []);

  // Get current exercise
  const currentExercise = getSelectedExercise();

  // Initialize audio engine on first user interaction
  const initializeAudio = useCallback(async () => {
    if (isReady) return;

    const controller = getPlaybackController();
    const success = await controller.initialize();
    setReady(success);
  }, [isReady, setReady]);

  // Select first exercise on mount if none selected
  useEffect(() => {
    if (!selectedExerciseId && filteredExercises.length > 0) {
      setExercise(filteredExercises[0].id);
    }
  }, [selectedExerciseId, filteredExercises, setExercise]);

  // Load exercise into playback controller when exercise changes
  useEffect(() => {
    if (!currentExercise) return;

    // Stop any current playback
    stop();
    clearNoteHighlights();
    setHighlightedNoteId(null);

    // Parse time signature for config
    const { beatsPerMeasure, beatUnit } = parseTimeSignature(
      currentExercise.timeSignature
    );

    // Update config with exercise settings
    setConfig({
      tempo: currentExercise.tempo,
      beatsPerMeasure,
      beatUnit,
    });

    // Schedule notes with exercise-specific config
    const exerciseConfig = {
      tempo: currentExercise.tempo,
      beatsPerMeasure,
      beatUnit,
      loop: false,
      metronomeEnabled: false,
      countIn: 0,
    };
    const scheduledNotes = exerciseToScheduledNotes(currentExercise, exerciseConfig);
    setScheduledNotes(scheduledNotes);

    // Calculate and set total duration
    const duration = calculateExerciseDuration(
      currentExercise,
      currentExercise.tempo
    );
    setTotalDuration(duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise]);

  // Handle play action
  const handlePlay = useCallback(async () => {
    try {
      setAudioError(null);
      await initializeAudio();

      if (!currentExercise) return;

      const controller = getPlaybackController(config);

      // Check if initialization was successful
      if (!controller.isReady()) {
        setAudioError('Audio-Engine konnte nicht initialisiert werden. Bitte versuche es erneut.');
        return;
      }

      // Load exercise with callbacks
      controller.loadExercise(
        currentExercise,
        // onNoteChange callback
        (noteId, noteIndex) => {
          setHighlightedNoteId(noteId);
          setCurrentNoteIndex(noteIndex);
        },
        // onBeatChange callback
        (beat, isDownbeat) => {
          setMetronomeBeat(beat, isDownbeat);
        },
        // onPlaybackEnd callback
        () => {
          stop();
          setHighlightedNoteId(null);
        }
      );

      controller.play();
      play();
    } catch (error) {
      console.error('Playback error:', error);
      setAudioError(getAudioErrorMessage(error));
    }
  }, [
    initializeAudio,
    currentExercise,
    config,
    setCurrentNoteIndex,
    setMetronomeBeat,
    stop,
    play,
  ]);

  // Handle pause action
  const handlePause = useCallback(() => {
    const controller = getPlaybackController();
    controller.pause();
    pause();
  }, [pause]);

  // Handle stop action
  const handleStop = useCallback(() => {
    const controller = getPlaybackController();
    controller.stop();
    stop();
    clearNoteHighlights();
    setHighlightedNoteId(null);
  }, [stop]);

  // Update controller config when tempo or metronome changes
  useEffect(() => {
    const controller = getPlaybackController();
    controller.updateConfig({
      tempo: config.tempo,
      metronomeEnabled: config.metronomeEnabled,
      loop: config.loop,
    });
  }, [config.tempo, config.metronomeEnabled, config.loop]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">ClefBuddy</h1>
              <span className="ml-3 text-sm text-slate-400 hidden sm:inline">
                Interaktiver Musiktheorie-Trainer
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <LayoutSection maxWidth="notation" padding="lg">
        <TwoColumnLayout
          sidebarPosition="left"
          main={
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
              {currentExercise ? (
                <>
                  {/* Exercise Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {currentExercise.name}
                        </h2>
                        <p className="text-slate-600 mt-1">
                          {currentExercise.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">
                          Level {currentExercise.level}
                        </div>
                        <div className="text-xs text-slate-400">
                          {currentExercise.difficulty}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6 text-sm text-slate-600 mb-4">
                      <div>
                        <span className="font-semibold">Taktart:</span>{' '}
                        {currentExercise.timeSignature}
                      </div>
                      <div>
                        <span className="font-semibold">Tonart:</span>{' '}
                        {currentExercise.keySignature}-Dur
                      </div>
                      <div>
                        <span className="font-semibold">Tempo:</span>{' '}
                        {currentExercise.tempo} BPM
                      </div>
                      <div>
                        <span className="font-semibold">Takte:</span>{' '}
                        {currentExercise.bars.length}
                      </div>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Transport Controls */}
                      <PlaybackControls
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onStop={handleStop}
                        disabled={!currentExercise}
                      />

                      {/* Metronome Indicator */}
                      <Metronome />
                    </div>

                    {/* Tempo Slider */}
                    <div className="mt-4 max-w-xs">
                      <TempoSlider min={40} max={180} step={5} />
                    </div>

                    {/* Audio Error Message */}
                    {audioError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{audioError}</p>
                        <button
                          onClick={() => setAudioError(null)}
                          className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                        >
                          Schliessen
                        </button>
                      </div>
                    )}

                    {/* Audio Init Hint */}
                    {!isReady && !audioError && (
                      <p className="mt-3 text-xs text-slate-500 italic">
                        Klicke auf Play, um die Audio-Engine zu starten
                      </p>
                    )}
                  </div>

                  {/* Music Sheet */}
                  <MusicSheet
                    key={currentExercise.id}
                    exercise={currentExercise}
                    width={900}
                    barsPerLine={4}
                    highlightedNoteId={highlightedNoteId}
                    className="shadow-sm"
                  />

                  {/* Pedagogical Notes */}
                  {currentExercise.pedagogicalNotes && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-semibold text-blue-900 mb-1">
                        Pädagogischer Hinweis
                      </div>
                      <p className="text-sm text-blue-800">
                        {currentExercise.pedagogicalNotes}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  Wähle eine Übung aus der Liste
                </div>
              )}
            </div>
          }
          sidebar={<ExerciseSelector />}
        />
      </LayoutSection>

      {/* Footer */}
      <footer className="mt-6 pb-6 text-center text-slate-400 text-sm">
        ClefBuddy - Musiktheorie-Trainer für Blattlesen
      </footer>
    </div>
  );
}

export default App;
