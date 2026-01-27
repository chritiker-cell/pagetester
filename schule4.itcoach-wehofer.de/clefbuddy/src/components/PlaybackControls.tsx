/**
 * PlaybackControls Component
 *
 * Transport controls for audio playback: Play/Pause, Stop, Loop.
 * Includes keyboard shortcuts for accessibility.
 */

import React, { useEffect, useCallback } from 'react';
import { usePlaybackStore } from '../store/usePlaybackStore';
import Button from './ui/Button';

interface PlaybackControlsProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  disabled?: boolean;
  className?: string;
}

// SVG Icons as components
const PlayIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const StopIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const LoopIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
  </svg>
);

const MetronomeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1.5c-.55 0-1 .45-1 1v1.09C7.72 4.09 5 7.12 5 10.5c0 3.87 2.69 7.12 6.31 7.91L10 22h4l-1.31-3.59C16.31 17.62 19 14.37 19 10.5c0-3.38-2.72-6.41-6-6.91V2.5c0-.55-.45-1-1-1zm0 5c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1z" />
  </svg>
);

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  onPlay,
  onPause,
  onStop,
  disabled = false,
  className = '',
}) => {
  const { status, config, togglePlayPause, stop, toggleLoop, toggleMetronome, isReady } =
    usePlaybackStore();

  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';
  const isStopped = status === 'stopped';

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
    togglePlayPause();
  }, [isPlaying, onPlay, onPause, togglePlayPause]);

  // Handle stop
  const handleStop = useCallback(() => {
    stop();
    onStop?.();
  }, [stop, onStop]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case ' ': // Space - Play/Pause
          e.preventDefault();
          handlePlayPause();
          break;
        case 'Escape': // Escape - Stop
          e.preventDefault();
          handleStop();
          break;
        case 'l': // L - Toggle Loop
        case 'L':
          e.preventDefault();
          toggleLoop();
          break;
        case 'm': // M - Toggle Metronome
        case 'M':
          e.preventDefault();
          toggleMetronome();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleStop, toggleLoop, toggleMetronome]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Play/Pause Button */}
      <Button
        variant="primary"
        size="md"
        onClick={handlePlayPause}
        disabled={disabled || !isReady}
        aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isPlaying ? (
          <>
            <PauseIcon className="w-5 h-5 mr-2" />
            Pause
          </>
        ) : (
          <>
            <PlayIcon className="w-5 h-5 mr-2" />
            {isPaused ? 'Resume' : 'Play'}
          </>
        )}
      </Button>

      {/* Stop Button */}
      <Button
        variant="secondary"
        size="md"
        onClick={handleStop}
        disabled={disabled || isStopped}
        aria-label="Stop (Escape)"
        title="Stop (Escape)"
      >
        <StopIcon className="w-5 h-5 mr-2" />
        Stop
      </Button>

      {/* Loop Toggle */}
      <Button
        variant={config.loop ? 'primary' : 'outline'}
        size="md"
        onClick={toggleLoop}
        disabled={disabled}
        aria-label="Loop (L)"
        title="Loop (L)"
        aria-pressed={config.loop}
      >
        <LoopIcon className="w-5 h-5" />
      </Button>

      {/* Metronome Toggle */}
      <Button
        variant={config.metronomeEnabled ? 'primary' : 'outline'}
        size="md"
        onClick={toggleMetronome}
        disabled={disabled}
        aria-label="Metronome (M)"
        title="Metronome (M)"
        aria-pressed={config.metronomeEnabled}
      >
        <MetronomeIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default PlaybackControls;
