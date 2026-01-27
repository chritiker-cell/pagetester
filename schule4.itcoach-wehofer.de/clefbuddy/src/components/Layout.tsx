/**
 * Layout Component
 *
 * Main application layout with header, content area, and sidebar/controls.
 * Responsive design optimized for desktop practice and tablet use.
 */

import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                ClefBuddy
              </h1>
              <span className="ml-3 text-sm text-neutral-500 hidden sm:inline">
                Note-Reading Trainer
              </span>
            </div>

            {/* Header Actions - Placeholder for future settings/profile */}
            <div className="flex items-center gap-3">
              {/* Placeholder for future features like settings icon */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer - Optional */}
      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-neutral-500">
            ClefBuddy - Musiktheorie-Trainer für Blattlesen
          </p>
        </div>
      </footer>
    </div>
  );
};

/**
 * LayoutSection Component
 *
 * Container for major sections within the layout.
 * Handles max-width and spacing consistently.
 */
export const LayoutSection: React.FC<{
  children: React.ReactNode;
  maxWidth?: 'notation' | 'content' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  children,
  maxWidth = 'content',
  padding = 'md',
  className = '',
}) => {
  const maxWidthStyles = {
    notation: 'max-w-[1400px]',
    content: 'max-w-[1200px]',
    full: 'max-w-full',
  };

  const paddingStyles = {
    none: '',
    sm: 'px-4 py-4',
    md: 'px-4 sm:px-6 lg:px-8 py-6',
    lg: 'px-4 sm:px-6 lg:px-8 py-8',
  };

  return (
    <div
      className={`
        ${maxWidthStyles[maxWidth]}
        ${paddingStyles[padding]}
        mx-auto
        w-full
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {children}
    </div>
  );
};

/**
 * NotationArea Component
 *
 * Specialized container for the music notation display.
 * White background, optimal dimensions, centered focus.
 */
export const NotationArea: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white
        rounded-lg
        shadow-lg
        p-8
        min-h-notation
        flex
        items-center
        justify-center
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {children}
    </div>
  );
};

/**
 * ControlPanel Component
 *
 * Container for practice controls (metronome, tempo, level selection).
 * Can be positioned as sidebar or bottom bar.
 */
export const ControlPanel: React.FC<{
  children: React.ReactNode;
  position?: 'sidebar' | 'bottom';
  className?: string;
}> = ({ children, position = 'bottom', className = '' }) => {
  const positionStyles = {
    sidebar: `
      w-full lg:w-80
      lg:sticky lg:top-20
      lg:self-start
    `,
    bottom: `
      w-full
    `,
  };

  return (
    <aside
      className={`
        ${positionStyles[position]}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {children}
    </aside>
  );
};

/**
 * TwoColumnLayout Component
 *
 * Helper layout for pages with main content + sidebar.
 * Main content takes priority on smaller screens.
 */
export const TwoColumnLayout: React.FC<{
  main: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  className?: string;
}> = ({
  main,
  sidebar,
  sidebarPosition = 'right',
  className = '',
}) => {
  return (
    <div
      className={`
        flex
        flex-col lg:flex-row
        gap-6
        ${sidebarPosition === 'left' ? 'lg:flex-row-reverse' : ''}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {/* Main Content - Grows to fill space */}
      <div className="flex-1 min-w-0">
        {main}
      </div>

      {/* Sidebar - Fixed width on desktop */}
      <div className="lg:w-80 lg:flex-shrink-0">
        {sidebar}
      </div>
    </div>
  );
};

export default Layout;
