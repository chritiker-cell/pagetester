/**
 * Mode Selector Component
 *
 * Allows switching between Listen (playback) and Practice (MIDI input) modes.
 */

import React from 'react';

export type AppMode = 'listen' | 'practice';

interface ModeSelectorProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  midiConnected?: boolean;
  className?: string;
}

// Icons
const HeadphonesIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
  </svg>
);

const KeyboardIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" />
  </svg>
);

const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onModeChange,
  midiConnected = false,
  className = '',
}) => {
  return (
    <div className={`flex bg-neutral-100 p-1 rounded-xl ${className}`}>
      {/* Listen Mode */}
      <button
        onClick={() => onModeChange('listen')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          mode === 'listen'
            ? 'bg-white text-primary-700 shadow-sm'
            : 'text-neutral-600 hover:text-neutral-900'
        }`}
      >
        <HeadphonesIcon className="w-4 h-4" />
        <span>Anhören</span>
      </button>

      {/* Practice Mode */}
      <button
        onClick={() => onModeChange('practice')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          mode === 'practice'
            ? 'bg-white text-primary-700 shadow-sm'
            : 'text-neutral-600 hover:text-neutral-900'
        }`}
      >
        <KeyboardIcon className="w-4 h-4" />
        <span>Üben</span>
        {mode !== 'practice' && midiConnected && (
          <span className="w-2 h-2 bg-success rounded-full" />
        )}
      </button>
    </div>
  );
};

export default ModeSelector;
