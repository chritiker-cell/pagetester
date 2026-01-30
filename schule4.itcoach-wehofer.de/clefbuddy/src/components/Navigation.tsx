import React from 'react';
import { useNavigationStore, type Section } from '../store/useNavigationStore';

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: 'notereader',
    label: 'NoteReader',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
      </svg>
    ),
  },
  {
    id: 'scales',
    label: 'Scales',
    disabled: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 18m0 0L12 13.5m4.5 4.5V6" />
      </svg>
    ),
  },
  {
    id: 'arpeggio',
    label: 'Arpeggio',
    disabled: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    id: 'chords',
    label: 'Chords',
    disabled: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-1.007.662-1.862 1.573-2.143" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const { activeSection, setSection } = useNavigationStore();

  return (
    <nav aria-label="Hauptnavigation" className="bg-white border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 -mb-px overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && setSection(item.id)}
                disabled={isDisabled}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${isActive
                    ? 'text-primary-700 bg-primary-50/50 border-primary-600'
                    : isDisabled
                      ? 'text-neutral-400 cursor-not-allowed opacity-60 border-transparent'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-transparent'
                  }
                `.replace(/\s+/g, ' ').trim()}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
                {isDisabled && (
                  <span className="hidden sm:inline text-xs bg-neutral-100 text-neutral-400 px-1.5 py-0.5 rounded-full">
                    Bald
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
