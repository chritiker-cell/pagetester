/**
 * Unit tests for useFavoritesStore
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore, getScaleFavoriteId } from '../useFavoritesStore';
import type { FavoriteExercise, FavoriteScale } from '../useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useFavoritesStore.setState({
      favorites: [],
      scales: [],
    });
    // Clear localStorage
    localStorage.clear();
  });

  describe('exercise favorites', () => {
    it('should start with empty favorites array', () => {
      const store = useFavoritesStore;
      expect(store.getState().favorites).toHaveLength(0);
    });

    it('should add exercise favorite', () => {
      const store = useFavoritesStore;
      const favorite: FavoriteExercise = {
        id: 'fav-1',
        name: 'Test Exercise',
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        createdAt: '2026-02-15T10:00:00Z',
      };

      store.getState().add(favorite);

      expect(store.getState().favorites).toHaveLength(1);
      expect(store.getState().favorites[0]).toEqual(favorite);
    });

    it('should add multiple exercise favorites', () => {
      const store = useFavoritesStore;
      const favorite1: FavoriteExercise = {
        id: 'fav-1',
        name: 'Test Exercise 1',
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        createdAt: '2026-02-15T10:00:00Z',
      };
      const favorite2: FavoriteExercise = {
        id: 'fav-2',
        name: 'Test Exercise 2',
        difficulty: 2,
        keyStage: 2,
        timeSignature: '3/4',
        barCount: 8,
        createdAt: '2026-02-15T10:05:00Z',
      };

      store.getState().add(favorite1);
      store.getState().add(favorite2);

      expect(store.getState().favorites).toHaveLength(2);
      expect(store.getState().favorites[0]).toEqual(favorite1);
      expect(store.getState().favorites[1]).toEqual(favorite2);
    });

    it('should remove exercise favorite by id', () => {
      const store = useFavoritesStore;
      const favorite1: FavoriteExercise = {
        id: 'fav-1',
        name: 'Test Exercise 1',
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        createdAt: '2026-02-15T10:00:00Z',
      };
      const favorite2: FavoriteExercise = {
        id: 'fav-2',
        name: 'Test Exercise 2',
        difficulty: 2,
        keyStage: 2,
        timeSignature: '3/4',
        barCount: 8,
        createdAt: '2026-02-15T10:05:00Z',
      };

      store.getState().add(favorite1);
      store.getState().add(favorite2);
      store.getState().remove('fav-1');

      expect(store.getState().favorites).toHaveLength(1);
      expect(store.getState().favorites[0].id).toBe('fav-2');
    });

    it('should do nothing when removing non-existent id', () => {
      const store = useFavoritesStore;
      const favorite: FavoriteExercise = {
        id: 'fav-1',
        name: 'Test Exercise',
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        createdAt: '2026-02-15T10:00:00Z',
      };

      store.getState().add(favorite);
      store.getState().remove('non-existent');

      expect(store.getState().favorites).toHaveLength(1);
      expect(store.getState().favorites[0]).toEqual(favorite);
    });
  });

  describe('scale favorites', () => {
    it('should start with empty scales array', () => {
      const store = useFavoritesStore;
      expect(store.getState().scales).toHaveLength(0);
    });

    it('should add scale favorite', () => {
      const store = useFavoritesStore;
      const favorite: FavoriteScale = {
        id: 'scale_C_major_ascending_1',
        key: 'C',
        scaleType: 'major',
        mode: 'ascending',
        octaves: 1,
        tempo: 80,
        showFingering: true,
        createdAt: '2026-02-15T10:00:00Z',
      };

      store.getState().addScale(favorite);

      expect(store.getState().scales).toHaveLength(1);
      expect(store.getState().scales[0]).toEqual(favorite);
    });

    it('should add multiple scale favorites', () => {
      const store = useFavoritesStore;
      const favorite1: FavoriteScale = {
        id: 'scale_C_major_ascending_1',
        key: 'C',
        scaleType: 'major',
        mode: 'ascending',
        octaves: 1,
        tempo: 80,
        showFingering: true,
        createdAt: '2026-02-15T10:00:00Z',
      };
      const favorite2: FavoriteScale = {
        id: 'scale_G_minor_descending_2',
        key: 'G',
        scaleType: 'minor',
        mode: 'descending',
        octaves: 2,
        tempo: 100,
        showFingering: false,
        createdAt: '2026-02-15T10:05:00Z',
      };

      store.getState().addScale(favorite1);
      store.getState().addScale(favorite2);

      expect(store.getState().scales).toHaveLength(2);
    });

    it('should remove scale favorite by id', () => {
      const store = useFavoritesStore;
      const favorite1: FavoriteScale = {
        id: 'scale_C_major_ascending_1',
        key: 'C',
        scaleType: 'major',
        mode: 'ascending',
        octaves: 1,
        tempo: 80,
        showFingering: true,
        createdAt: '2026-02-15T10:00:00Z',
      };
      const favorite2: FavoriteScale = {
        id: 'scale_G_minor_descending_2',
        key: 'G',
        scaleType: 'minor',
        mode: 'descending',
        octaves: 2,
        tempo: 100,
        showFingering: false,
        createdAt: '2026-02-15T10:05:00Z',
      };

      store.getState().addScale(favorite1);
      store.getState().addScale(favorite2);
      store.getState().removeScale('scale_C_major_ascending_1');

      expect(store.getState().scales).toHaveLength(1);
      expect(store.getState().scales[0].id).toBe('scale_G_minor_descending_2');
    });
  });

  describe('isScaleFavorite', () => {
    it('should return false when scale is not favorited', () => {
      const store = useFavoritesStore;
      const isFavorite = store.getState().isScaleFavorite('C', 'major', 'ascending', 1);
      expect(isFavorite).toBe(false);
    });

    it('should return true when scale is favorited', () => {
      const store = useFavoritesStore;
      const favorite: FavoriteScale = {
        id: 'scale_C_major_ascending_1',
        key: 'C',
        scaleType: 'major',
        mode: 'ascending',
        octaves: 1,
        tempo: 80,
        showFingering: true,
        createdAt: '2026-02-15T10:00:00Z',
      };

      store.getState().addScale(favorite);

      const isFavorite = store.getState().isScaleFavorite('C', 'major', 'ascending', 1);
      expect(isFavorite).toBe(true);
    });

    it('should distinguish between different scales', () => {
      const store = useFavoritesStore;
      const favorite: FavoriteScale = {
        id: 'scale_C_major_ascending_1',
        key: 'C',
        scaleType: 'major',
        mode: 'ascending',
        octaves: 1,
        tempo: 80,
        showFingering: true,
        createdAt: '2026-02-15T10:00:00Z',
      };

      store.getState().addScale(favorite);

      // Same scale - should be true
      expect(store.getState().isScaleFavorite('C', 'major', 'ascending', 1)).toBe(true);

      // Different key - should be false
      expect(store.getState().isScaleFavorite('G', 'major', 'ascending', 1)).toBe(false);

      // Different type - should be false
      expect(store.getState().isScaleFavorite('C', 'minor', 'ascending', 1)).toBe(false);

      // Different mode - should be false
      expect(store.getState().isScaleFavorite('C', 'major', 'descending', 1)).toBe(false);

      // Different octaves - should be false
      expect(store.getState().isScaleFavorite('C', 'major', 'ascending', 2)).toBe(false);
    });

    it('should return false after removing scale', () => {
      const store = useFavoritesStore;
      const favorite: FavoriteScale = {
        id: 'scale_C_major_ascending_1',
        key: 'C',
        scaleType: 'major',
        mode: 'ascending',
        octaves: 1,
        tempo: 80,
        showFingering: true,
        createdAt: '2026-02-15T10:00:00Z',
      };

      store.getState().addScale(favorite);
      expect(store.getState().isScaleFavorite('C', 'major', 'ascending', 1)).toBe(true);

      store.getState().removeScale('scale_C_major_ascending_1');
      expect(store.getState().isScaleFavorite('C', 'major', 'ascending', 1)).toBe(false);
    });
  });

  describe('getScaleFavoriteId helper', () => {
    it('should generate consistent id for same parameters', () => {
      const id1 = getScaleFavoriteId('C', 'major', 'ascending', 1);
      const id2 = getScaleFavoriteId('C', 'major', 'ascending', 1);
      expect(id1).toBe(id2);
    });

    it('should generate different ids for different parameters', () => {
      const id1 = getScaleFavoriteId('C', 'major', 'ascending', 1);
      const id2 = getScaleFavoriteId('G', 'major', 'ascending', 1);
      const id3 = getScaleFavoriteId('C', 'minor', 'ascending', 1);
      const id4 = getScaleFavoriteId('C', 'major', 'descending', 1);
      const id5 = getScaleFavoriteId('C', 'major', 'ascending', 2);

      expect(id1).not.toBe(id2);
      expect(id1).not.toBe(id3);
      expect(id1).not.toBe(id4);
      expect(id1).not.toBe(id5);
    });

    it('should generate correct format', () => {
      const id = getScaleFavoriteId('C', 'major', 'ascending', 1);
      expect(id).toBe('scale_C_major_ascending_1');
    });
  });

  describe('localStorage persistence', () => {
    it('should persist favorites to localStorage', () => {
      const store = useFavoritesStore;
      const favorite: FavoriteExercise = {
        id: 'fav-1',
        name: 'Test Exercise',
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        createdAt: '2026-02-15T10:00:00Z',
      };

      store.getState().add(favorite);

      const stored = localStorage.getItem('clefbuddy-favorites');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.favorites).toHaveLength(1);
      expect(parsed.state.favorites[0]).toEqual(favorite);
    });

    it('should persist scales to localStorage', () => {
      const store = useFavoritesStore;
      const favorite: FavoriteScale = {
        id: 'scale_C_major_ascending_1',
        key: 'C',
        scaleType: 'major',
        mode: 'ascending',
        octaves: 1,
        tempo: 80,
        showFingering: true,
        createdAt: '2026-02-15T10:00:00Z',
      };

      store.getState().addScale(favorite);

      const stored = localStorage.getItem('clefbuddy-favorites');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.scales).toHaveLength(1);
      expect(parsed.state.scales[0]).toEqual(favorite);
    });

    it('should restore favorites from localStorage on new store instance', () => {
      const store = useFavoritesStore;
      const exerciseFavorite: FavoriteExercise = {
        id: 'fav-1',
        name: 'Test Exercise',
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        createdAt: '2026-02-15T10:00:00Z',
      };
      const scaleFavorite: FavoriteScale = {
        id: 'scale_C_major_ascending_1',
        key: 'C',
        scaleType: 'major',
        mode: 'ascending',
        octaves: 1,
        tempo: 80,
        showFingering: true,
        createdAt: '2026-02-15T10:00:00Z',
      };

      // Add favorites
      store.getState().add(exerciseFavorite);
      store.getState().addScale(scaleFavorite);

      // Get stored value
      const stored = localStorage.getItem('clefbuddy-favorites');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);

      // Reset store
      store.setState({
        favorites: [],
        scales: [],
      });

      // Manually restore (simulating persist rehydration)
      store.setState({
        favorites: parsed.state.favorites,
        scales: parsed.state.scales,
      });

      expect(store.getState().favorites).toHaveLength(1);
      expect(store.getState().favorites[0]).toEqual(exerciseFavorite);
      expect(store.getState().scales).toHaveLength(1);
      expect(store.getState().scales[0]).toEqual(scaleFavorite);
    });
  });
});
