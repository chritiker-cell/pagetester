/**
 * Select Component
 *
 * Styled dropdown for level selection and other options.
 * Accessible with keyboard navigation.
 */

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Wählen...',
  disabled = false,
  error,
  helperText,
  fullWidth = false,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Wrapper styles
  const wrapperStyles = fullWidth ? 'w-full' : '';

  // Select base styles
  const selectBaseStyles = `
    appearance-none
    bg-white
    border-2 rounded-lg
    px-4 py-3
    pr-10
    text-neutral-900
    font-medium
    transition-all duration-250 ease-musical
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50
    cursor-pointer
    min-h-touch
  `;

  // Border color based on state
  const borderStyles = error
    ? 'border-error hover:border-error-dark'
    : 'border-neutral-300 hover:border-neutral-400';

  // Combined select styles
  const selectStyles = `
    ${selectBaseStyles}
    ${borderStyles}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={wrapperStyles}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      {/* Select container with custom arrow */}
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={selectStyles}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Helper text or error message */}
      {(helperText || error) && (
        <p
          className={`mt-2 text-sm ${
            error ? 'text-error' : 'text-neutral-500'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
