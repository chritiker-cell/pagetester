/**
 * Card Component
 *
 * Container component for grouping related content.
 * Used for exercise selection, settings panels, and notation display.
 */

import React from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';
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

  // Variant styles
  const variantStyles: Record<CardVariant, string> = {
    default: `
      bg-white shadow-md
    `,
    elevated: `
      bg-white shadow-lg
    `,
    outlined: `
      bg-white border-2 border-neutral-200
    `,
    flat: `
      bg-neutral-50
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
  <h3 className={`text-2xl font-semibold text-neutral-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <p className={`text-neutral-600 mt-1 ${className}`}>
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
