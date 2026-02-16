import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty, TimeSignatureOption, KeyStage } from '../utils/exerciseGenerator';
import type { ScaleType, ScaleMode } from '../types/scales';

export interface FavoriteExercise {
  id: string;
  name: string;
  difficulty: Difficulty;
  keyStage: KeyStage;
  timeSignature: TimeSignatureOption;
  barCount: number;
  createdAt: string;
}

export interface FavoriteScale {
  id: string;
  key: string;
  scaleType: ScaleType;
  mode: ScaleMode;
  octaves: 1 | 2;
  tempo: number;
  showFingering: boolean;
  createdAt: string;
}

interface FavoritesStore {
  // NoteReader favorites
  favorites: FavoriteExercise[];
  add: (fav: FavoriteExercise) => void;
  remove: (id: string) => void;

  // Scale favorites
  scales: FavoriteScale[];
  addScale: (fav: FavoriteScale) => void;
  removeScale: (id: string) => void;
  isScaleFavorite: (key: string, scaleType: ScaleType, mode: ScaleMode, octaves: 1 | 2) => boolean;
}

function getScaleFavoriteId(key: string, scaleType: ScaleType, mode: ScaleMode, octaves: 1 | 2): string {
  return `scale_${key}_${scaleType}_${mode}_${octaves}`;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      add: (fav) => set({ favorites: [...get().favorites, fav] }),
      remove: (id) => set({ favorites: get().favorites.filter(f => f.id !== id) }),

      scales: [],
      addScale: (fav) => set({ scales: [...get().scales, fav] }),
      removeScale: (id) => set({ scales: get().scales.filter(s => s.id !== id) }),
      isScaleFavorite: (key, scaleType, mode, octaves) => {
        const id = getScaleFavoriteId(key, scaleType, mode, octaves);
        return get().scales.some(s => s.id === id);
      },
    }),
    { name: 'clefbuddy-favorites' }
  )
);

export { getScaleFavoriteId };
