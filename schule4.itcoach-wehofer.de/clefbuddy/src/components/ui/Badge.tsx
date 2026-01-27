/**
 * Badge Component
 *
 * Small label for status indicators, difficulty levels, etc.
 */

import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'error' | 'warning';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-full
    whitespace-nowrap
  `;

  // Variant styles
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
  };

  // Size styles
  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  // Combine styles
  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <span className={combinedStyles}>
      {children}
    </span>
  );
};

export default Badge;
