/**
 * FilterButton — unified toggle/filter button used across all selectors.
 * Replaces 3+ inline button-styling patterns with a single component.
 */
import React from 'react';

interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  children: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  active,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const base = 'py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98]';

  const variant = active
    ? 'bg-primary-600 text-white'
    : disabled
      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 cursor-not-allowed border border-neutral-100 dark:border-neutral-700'
      : 'bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-200 dark:border-neutral-600';

  return (
    <button
      className={`${base} ${variant} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default FilterButton;
