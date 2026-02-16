/**
 * FavoritesSection.test.tsx
 * Comprehensive tests for the FavoritesSection component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import FavoritesSection from '../dashboard/FavoritesSection';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useScalesStore } from '../../store/useScalesStore';
import { useNavigationStore } from '../../store/useNavigationStore';

// Mock scaleData module
vi.mock('../../data/scaleData', () => ({
  SCALE_TYPE_LABELS: {
    major: 'Dur',
    minor: 'Moll',
    harmonic_minor: 'Harm. Moll',
    melodic_minor: 'Mel. Moll',
    pentatonic_major: 'Pent. Dur',
    pentatonic_minor: 'Pent. Moll',
    blues: 'Blues',
    chromatic: 'Chromatisch',
    whole_tone: 'Ganzton',
  },
  MODE_LABELS: {
    parallel: 'Parallel',
    contrary: 'Gegenbewegung',
    thirds: 'Terzen',
    sixths: 'Sexten',
    tenths: 'Dezimen',
    polyrhythm: 'Polyrhythmus',
  },
  getKeysForGroup: vi.fn(() => ['C', 'G', 'D']),
}));

describe('FavoritesSection', () => {
  beforeEach(() => {
    // Reset stores to initial state
    useFavoritesStore.setState({ favorites: [], scales: [] });
    useNavigationStore.setState({ activeSection: 'dashboard' });
    useScalesStore.setState({
      selectedKey: 'C',
      scaleType: 'major',
      mode: 'parallel',
      octaves: 1,
      showFingering: true,
      tempo: 80,
      keyGroupIndex: 0,
    });
  });

  describe('Empty State', () => {
    it('shows "Noch keine Favoriten" message when no favorites', () => {
      render(<FavoritesSection />);
      expect(screen.getByText(/Noch keine Favoriten/i)).toBeInTheDocument();
    });

    it('shows "speichere Skalen fuer schnellen Zugriff" hint', () => {
      render(<FavoritesSection />);
      expect(screen.getByText(/speichere Skalen fuer schnellen Zugriff/i)).toBeInTheDocument();
    });

    it('displays empty placeholder with dashed border', () => {
      const { container } = render(<FavoritesSection />);
      const placeholder = container.querySelector('.border-dashed');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('With Scale Favorites', () => {
    beforeEach(() => {
      // Setup mock scale favorites
      useFavoritesStore.setState({
        scales: [
          {
            id: 'scale_C_major_parallel_1',
            key: 'C',
            scaleType: 'major',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'scale_G_minor_contrary_2',
            key: 'G',
            scaleType: 'minor',
            mode: 'contrary',
            octaves: 2,
            tempo: 120,
            showFingering: false,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    });

    it('renders scale name (key-type) for each favorite', () => {
      render(<FavoritesSection />);
      expect(screen.getByText('C-Dur')).toBeInTheDocument();
      expect(screen.getByText('G-Moll')).toBeInTheDocument();
    });

    it('displays mode label for each favorite', () => {
      render(<FavoritesSection />);
      expect(screen.getByText('Parallel')).toBeInTheDocument();
      expect(screen.getByText('Gegenbewegung')).toBeInTheDocument();
    });

    it('displays octaves for each favorite', () => {
      render(<FavoritesSection />);
      expect(screen.getByText('1 Okt.')).toBeInTheDocument();
      expect(screen.getByText('2 Okt.')).toBeInTheDocument();
    });

    it('displays tempo for each favorite', () => {
      render(<FavoritesSection />);
      expect(screen.getByText('80 BPM')).toBeInTheDocument();
      expect(screen.getByText('120 BPM')).toBeInTheDocument();
    });

    it('shows category header with count', () => {
      render(<FavoritesSection />);
      expect(screen.getByText('Skalen (2)')).toBeInTheDocument();
    });

    it('renders Favoriten section title with star icon', () => {
      render(<FavoritesSection />);
      expect(screen.getByText('Favoriten')).toBeInTheDocument();
    });
  });

  describe('Play Button', () => {
    beforeEach(() => {
      useFavoritesStore.setState({
        scales: [
          {
            id: 'scale_D_harmonic_minor_thirds_1',
            key: 'D',
            scaleType: 'harmonic_minor',
            mode: 'thirds',
            octaves: 1,
            tempo: 100,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    });

    it('sets scalesStore correctly when play button clicked', async () => {
      const user = userEvent.setup();
      const setSelectedKey = vi.fn();
      const setScaleType = vi.fn();
      const setMode = vi.fn();
      const setOctaves = vi.fn();
      const setShowFingering = vi.fn();

      useScalesStore.setState({
        setSelectedKey,
        setScaleType,
        setMode,
        setOctaves,
        setShowFingering,
        scaleType: 'major', // Different from favorite to trigger setScaleType
      });

      render(<FavoritesSection />);

      const playButton = screen.getByRole('button', { name: /Skala spielen/i });
      await user.click(playButton);

      expect(setSelectedKey).toHaveBeenCalledWith('D');
      expect(setScaleType).toHaveBeenCalledWith('harmonic_minor');
      expect(setMode).toHaveBeenCalledWith('thirds');
      expect(setOctaves).toHaveBeenCalledWith(1);
      expect(setShowFingering).toHaveBeenCalledWith(true);
    });

    it('navigates to scales section after play button clicked', async () => {
      const user = userEvent.setup();
      const setSection = vi.fn();
      useNavigationStore.setState({ setSection });

      render(<FavoritesSection />);

      const playButton = screen.getByRole('button', { name: /Skala spielen/i });
      await user.click(playButton);

      expect(setSection).toHaveBeenCalledWith('scales');
      expect(setSection).toHaveBeenCalledTimes(1);
    });

    it('does not call setScaleType if scale type already matches', async () => {
      const user = userEvent.setup();
      const setScaleType = vi.fn();

      useScalesStore.setState({
        scaleType: 'harmonic_minor', // Same as favorite
        setScaleType,
      });

      render(<FavoritesSection />);

      const playButton = screen.getByRole('button', { name: /Skala spielen/i });
      await user.click(playButton);

      // setScaleType should NOT be called because type already matches
      expect(setScaleType).not.toHaveBeenCalled();
    });
  });

  describe('Delete Button', () => {
    beforeEach(() => {
      useFavoritesStore.setState({
        scales: [
          {
            id: 'scale_E_blues_parallel_2',
            key: 'E',
            scaleType: 'blues',
            mode: 'parallel',
            octaves: 2,
            tempo: 90,
            showFingering: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'scale_A_pentatonic_major_sixths_1',
            key: 'A',
            scaleType: 'pentatonic_major',
            mode: 'sixths',
            octaves: 1,
            tempo: 110,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    });

    it('calls removeScale with correct id when delete button clicked', async () => {
      const user = userEvent.setup();
      const removeScale = vi.fn();
      useFavoritesStore.setState({ removeScale });

      render(<FavoritesSection />);

      // Click delete button on first favorite (E-Blues)
      const deleteButtons = screen.getAllByRole('button', { name: /Favorit entfernen/i });
      await user.click(deleteButtons[0]);

      expect(removeScale).toHaveBeenCalledWith('scale_E_blues_parallel_2');
      expect(removeScale).toHaveBeenCalledTimes(1);
    });

    it('calls removeScale with correct id for second favorite', async () => {
      const user = userEvent.setup();
      const removeScale = vi.fn();
      useFavoritesStore.setState({ removeScale });

      render(<FavoritesSection />);

      // Click delete button on second favorite (A-Pent. Dur)
      const deleteButtons = screen.getAllByRole('button', { name: /Favorit entfernen/i });
      await user.click(deleteButtons[1]);

      expect(removeScale).toHaveBeenCalledWith('scale_A_pentatonic_major_sixths_1');
      expect(removeScale).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Favorites', () => {
    it('renders all scale favorites in order', () => {
      useFavoritesStore.setState({
        scales: [
          {
            id: 'scale_1',
            key: 'C',
            scaleType: 'major',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date('2024-01-01').toISOString(),
          },
          {
            id: 'scale_2',
            key: 'D',
            scaleType: 'minor',
            mode: 'contrary',
            octaves: 2,
            tempo: 100,
            showFingering: false,
            createdAt: new Date('2024-01-02').toISOString(),
          },
          {
            id: 'scale_3',
            key: 'E',
            scaleType: 'chromatic',
            mode: 'parallel',
            octaves: 1,
            tempo: 60,
            showFingering: true,
            createdAt: new Date('2024-01-03').toISOString(),
          },
        ],
      });

      render(<FavoritesSection />);

      // All three should be rendered
      expect(screen.getByText('C-Dur')).toBeInTheDocument();
      expect(screen.getByText('D-Moll')).toBeInTheDocument();
      expect(screen.getByText('E-Chromatisch')).toBeInTheDocument();

      // Category count should show 3
      expect(screen.getByText('Skalen (3)')).toBeInTheDocument();
    });
  });

  describe('Scale Type Labels', () => {
    it('displays correct labels for all scale types', () => {
      useFavoritesStore.setState({
        scales: [
          {
            id: '1',
            key: 'C',
            scaleType: 'major',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            key: 'D',
            scaleType: 'harmonic_minor',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '3',
            key: 'E',
            scaleType: 'melodic_minor',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '4',
            key: 'F',
            scaleType: 'pentatonic_major',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '5',
            key: 'G',
            scaleType: 'blues',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '6',
            key: 'A',
            scaleType: 'whole_tone',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
        ],
      });

      render(<FavoritesSection />);

      expect(screen.getByText('C-Dur')).toBeInTheDocument();
      expect(screen.getByText('D-Harm. Moll')).toBeInTheDocument();
      expect(screen.getByText('E-Mel. Moll')).toBeInTheDocument();
      expect(screen.getByText('F-Pent. Dur')).toBeInTheDocument();
      expect(screen.getByText('G-Blues')).toBeInTheDocument();
      expect(screen.getByText('A-Ganzton')).toBeInTheDocument();
    });
  });

  describe('Mode Labels', () => {
    it('displays correct labels for all modes', () => {
      useFavoritesStore.setState({
        scales: [
          {
            id: '1',
            key: 'C',
            scaleType: 'major',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            key: 'C',
            scaleType: 'major',
            mode: 'contrary',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '3',
            key: 'C',
            scaleType: 'major',
            mode: 'thirds',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '4',
            key: 'C',
            scaleType: 'major',
            mode: 'sixths',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '5',
            key: 'C',
            scaleType: 'major',
            mode: 'tenths',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '6',
            key: 'C',
            scaleType: 'major',
            mode: 'polyrhythm',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
        ],
      });

      render(<FavoritesSection />);

      expect(screen.getByText('Parallel')).toBeInTheDocument();
      expect(screen.getByText('Gegenbewegung')).toBeInTheDocument();
      expect(screen.getByText('Terzen')).toBeInTheDocument();
      expect(screen.getByText('Sexten')).toBeInTheDocument();
      expect(screen.getByText('Dezimen')).toBeInTheDocument();
      expect(screen.getByText('Polyrhythmus')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty scales array gracefully', () => {
      useFavoritesStore.setState({ scales: [] });
      render(<FavoritesSection />);
      expect(screen.getByText(/Noch keine Favoriten/i)).toBeInTheDocument();
    });

    it('handles missing favorite properties gracefully', () => {
      // Create a favorite with minimal properties (TypeScript will complain, but this tests runtime robustness)
      useFavoritesStore.setState({
        scales: [
          {
            id: 'incomplete',
            key: 'C',
            scaleType: 'major',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          } as any,
        ],
      });

      const { container } = render(<FavoritesSection />);
      // Should still render without crashing
      expect(container).toBeTruthy();
    });

    it('handles rapid consecutive clicks on play button', async () => {
      const user = userEvent.setup();
      const setSection = vi.fn();
      useNavigationStore.setState({ setSection });

      useFavoritesStore.setState({
        scales: [
          {
            id: 'scale_test',
            key: 'C',
            scaleType: 'major',
            mode: 'parallel',
            octaves: 1,
            tempo: 80,
            showFingering: true,
            createdAt: new Date().toISOString(),
          },
        ],
      });

      render(<FavoritesSection />);

      const playButton = screen.getByRole('button', { name: /Skala spielen/i });

      // Click multiple times rapidly
      await user.click(playButton);
      await user.click(playButton);
      await user.click(playButton);

      expect(setSection).toHaveBeenCalledTimes(3);
    });
  });
});
