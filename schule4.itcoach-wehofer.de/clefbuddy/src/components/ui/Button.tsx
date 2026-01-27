/**
 * Button Component
 *
 * Accessible, touch-friendly button with multiple variants.
 * Minimum 44x44px touch target for mobile usability.
 */

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled = false,
  ...props
}) => {
  // Base styles - Always applied
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-250 ease-musical
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    select-none
  `;

  // Variant styles
  const variantStyles: Record<ButtonVariant, string> = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 active:bg-primary-800
      shadow-md hover:shadow-lg hover:shadow-primary
      disabled:hover:bg-primary-600 disabled:hover:shadow-md
    `,
    secondary: `
      bg-neutral-100 text-neutral-900
      hover:bg-neutral-200 active:bg-neutral-300
      shadow-sm hover:shadow-md
      disabled:hover:bg-neutral-100 disabled:hover:shadow-sm
    `,
    outline: `
      bg-transparent text-primary-700 border-2 border-primary-600
      hover:bg-primary-50 active:bg-primary-100
      disabled:hover:bg-transparent
    `,
    ghost: `
      bg-transparent text-neutral-700
      hover:bg-neutral-100 active:bg-neutral-200
      disabled:hover:bg-transparent
    `,
  };

  // Size styles - Ensuring minimum touch target
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm min-h-touch',        // 44px min height
    md: 'px-6 py-3 text-base min-h-touch',      // 44px min height
    lg: 'px-8 py-4 text-lg min-h-[52px]',       // 52px comfortable height
  };

  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyle}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      className={combinedStyles}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
