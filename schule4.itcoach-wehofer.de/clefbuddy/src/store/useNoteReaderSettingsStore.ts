import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NoteReaderSettings {
  // Visuelle Hilfen
  showChordSymbols: boolean;
  showFingeringFirstNote: boolean;
  showFingeringOnPositionChange: boolean;

  // Wiedergabe
  metronomeDefaultOn: boolean;
  loopDefaultOn: boolean;
  countdownBeats: 2 | 4 | 8;
}

interface NoteReaderSettingsStore extends NoteReaderSettings {
  setSetting: <K extends keyof NoteReaderSettings>(key: K, value: NoteReaderSettings[K]) => void;
  resetDefaults: () => void;
}

const defaults: NoteReaderSettings = {
  showChordSymbols: false,
  showFingeringFirstNote: true,
  showFingeringOnPositionChange: true,
  metronomeDefaultOn: true,
  loopDefaultOn: true,
  countdownBeats: 4,
};

export const useNoteReaderSettingsStore = create<NoteReaderSettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      setSetting: (key, value) => set({ [key]: value }),
      resetDefaults: () => set(defaults),
    }),
    { name: 'clefbuddy-notereader-settings' }
  )
);
