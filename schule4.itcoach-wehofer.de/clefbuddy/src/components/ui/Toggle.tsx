/**
 * Toggle — reusable switch component extracted from NoteReaderSettings.
 */
import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  labelClassName?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, labelClassName }) => {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className={labelClassName || 'text-sm font-medium text-neutral-700 dark:text-neutral-300'}>{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
          checked ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
};

export default Toggle;
