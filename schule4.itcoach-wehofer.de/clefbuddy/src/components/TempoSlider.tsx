/**
 * TempoSlider Component
 *
 * Slider control for adjusting playback tempo (BPM).
 * Shows current tempo value and allows keyboard adjustment.
 */

import React, { useCallback } from 'react';
import { usePlaybackStore } from '../store/usePlaybackStore';

interface TempoSliderProps {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

const TempoSlider: React.FC<TempoSliderProps> = ({
  min = 40,
  max = 200,
  step = 5,
  disabled = false,
  className = '',
}) => {
  const { config, setTempo } = usePlaybackStore();
  const tempo = config.tempo;

  // Handle slider change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTempo = parseInt(e.target.value, 10);
      setTempo(newTempo);
    },
    [setTempo]
  );

  // Handle keyboard fine-tuning
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      let newTempo = tempo;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          e.preventDefault();
          newTempo = Math.min(tempo + 1, max);
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          e.preventDefault();
          newTempo = Math.max(tempo - 1, min);
          break;
        case 'PageUp':
          e.preventDefault();
          newTempo = Math.min(tempo + 10, max);
          break;
        case 'PageDown':
          e.preventDefault();
          newTempo = Math.max(tempo - 10, min);
          break;
        case 'Home':
          e.preventDefault();
          newTempo = min;
          break;
        case 'End':
          e.preventDefault();
          newTempo = max;
          break;
        default:
          return;
      }

      setTempo(newTempo);
    },
    [tempo, min, max, setTempo]
  );

  // Preset tempo buttons
  const presets = [
    { label: 'Slow', bpm: 60 },
    { label: 'Medium', bpm: 90 },
    { label: 'Fast', bpm: 120 },
  ];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor="tempo-slider"
          className="text-sm font-medium text-neutral-700"
        >
          Tempo
        </label>
        <span className="text-lg font-semibold text-primary-600 tabular-nums">
          {tempo} <span className="text-sm font-normal text-neutral-500">BPM</span>
        </span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          id="tempo-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={tempo}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-primary-600
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:bg-primary-600
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer
          `}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={tempo}
          aria-valuetext={`${tempo} beats per minute`}
        />

        {/* Tick marks */}
        <div className="flex justify-between text-xs text-neutral-400 mt-1 px-1">
          <span>{min}</span>
          <span>{Math.round((min + max) / 2)}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2 mt-1">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setTempo(preset.bpm)}
            disabled={disabled}
            className={`
              flex-1 px-2 py-1 text-xs font-medium rounded-md
              transition-colors duration-150
              ${
                tempo === preset.bpm
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TempoSlider;
