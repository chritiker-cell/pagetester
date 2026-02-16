/**
 * Card Component
 *
 * Container component for grouping related content.
 * Used for exercise selection, settings panels, and notation display.
 */

import React from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  onClick,
  hoverable = false,
}) => {
  // Base styles
  const baseStyles = 'rounded-lg transition-all duration-250 ease-musical';

  // Variant styles — Elevation system:
  // Level 0: none (flat)
  // Level 1: shadow-md (default, content cards)
  // Level 2: shadow-lg (elevated, selector panels)
  // Level 3: shadow-xl (hover/active states)
  const variantStyles: Record<CardVariant, string> = {
    default: `
      bg-white dark:bg-neutral-800 shadow-md
    `,
    elevated: `
      bg-white dark:bg-neutral-800 shadow-lg
    `,
    outlined: `
      bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700
    `,
    flat: `
      bg-neutral-50 dark:bg-neutral-900
    `,
    interactive: `
      bg-white dark:bg-neutral-800 shadow-md border border-neutral-200 dark:border-neutral-700
      hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600
      cursor-pointer
    `,
  };

  // Padding styles
  const paddingStyles: Record<CardPadding, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Interactive styles
  const interactiveStyles = onClick || hoverable
    ? `
      cursor-pointer
      hover:shadow-xl hover:-translate-y-0.5
      active:translate-y-0
    `
    : '';

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${interactiveStyles}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={combinedStyles} onClick={onClick}>
      {children}
    </div>
  );
};

// Card sub-components for better composition
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-neutral-900 dark:text-neutral-100 ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <p className={`text-neutral-600 dark:text-neutral-300 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mt-6 flex gap-3 ${className}`}>
    {children}
  </div>
);

export default Card;
