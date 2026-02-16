import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    html.style.colorScheme = 'dark';
  } else {
    html.classList.remove('dark');
    html.style.colorScheme = 'light';
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark' as Theme,
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: 'clefbuddy-theme',
      onRehydrateStorage: () => (state, error) => {
        if (state && !error) {
          applyTheme(state.theme);
        } else if (!error) {
          // No saved value — default to dark
          applyTheme('dark');
          useThemeStore.setState({ theme: 'dark' });
        }
      },
    }
  )
);

export function initializeTheme() {
  const { theme } = useThemeStore.getState();
  applyTheme(theme);
}
