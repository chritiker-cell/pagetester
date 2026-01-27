/**
 * Metronome Component
 *
 * Visual beat indicator with animated pulses.
 * Shows beat position within a measure.
 */

import React from 'react';
import { usePlaybackStore } from '../store/usePlaybackStore';

interface MetronomeProps {
  className?: string;
}

const Metronome: React.FC<MetronomeProps> = ({ className = '' }) => {
  const { config, metronome, status } = usePlaybackStore();
  const { beatsPerMeasure } = config;
  const { currentBeat, isActive } = metronome;

  // Generate beat indicators
  const beats = Array.from({ length: beatsPerMeasure }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-neutral-600 mr-2">Beat:</span>
      <div className="flex items-center gap-2">
        {beats.map((beat) => {
          const isCurrentBeat = status === 'playing' && currentBeat === beat;
          const isDownbeat = beat === 1;

          // Determine beat styling
          let bgColor = 'bg-neutral-200';
          let ringColor = '';
          let scale = 'scale-100';

          if (isCurrentBeat) {
            if (isDownbeat) {
              bgColor = 'bg-red-500';
              ringColor = 'ring-2 ring-red-300 ring-offset-1';
            } else {
              bgColor = 'bg-primary-500';
              ringColor = 'ring-2 ring-primary-300 ring-offset-1';
            }
            scale = 'scale-110';
          } else if (isDownbeat) {
            bgColor = 'bg-neutral-400';
          }

          return (
            <div
              key={beat}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center
                transition-all duration-150 ease-out
                ${bgColor} ${ringColor} ${scale}
              `}
            >
              {isDownbeat && (
                <span
                  className={`
                    text-xs font-bold
                    ${isCurrentBeat ? 'text-white' : 'text-neutral-100'}
                  `}
                >
                  1
                </span>
              )}
            </div>
          );
        })}
      </div>
      {config.metronomeEnabled && (
        <span
          className={`
            ml-2 text-xs font-medium px-2 py-0.5 rounded-full
            ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'}
          `}
        >
          {isActive ? 'ON' : 'OFF'}
        </span>
      )}
    </div>
  );
};

export default Metronome;
