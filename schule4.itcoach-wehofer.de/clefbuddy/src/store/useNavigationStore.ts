import { create } from 'zustand';

export type Section = 'dashboard' | 'notereader' | 'theory' | 'scales' | 'arpeggio' | 'chords';

interface NavigationState {
  activeSection: Section;
  setSection: (section: Section) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'dashboard',
  setSection: (section) => set({ activeSection: section }),
}));
