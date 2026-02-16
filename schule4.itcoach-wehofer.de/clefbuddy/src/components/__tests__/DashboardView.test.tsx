/**
 * DashboardView.test.tsx
 * Comprehensive tests for the DashboardView component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import DashboardView from '../DashboardView';
import { useLastExerciseStore } from '../../store/useLastExerciseStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useScoringStore } from '../../store/useScoringStore';

// Mock exerciseGenerator to avoid importing the massive file
vi.mock('../../utils/exerciseGenerator', () => ({
  DIFFICULTY_LABELS: [
    { value: 1, label: '1', name: 'Anfaenger' },
    { value: 2, label: '2', name: 'Leicht' },
    { value: 3, label: '3', name: 'Fortgeschritten' },
    { value: 4, label: '4', name: 'Mittelstufe' },
    { value: 5, label: '5', name: 'Schwer' },
    { value: 6, label: '6', name: 'Experte' },
  ],
}));

// Mock FavoritesSection to isolate DashboardView
vi.mock('../dashboard/FavoritesSection', () => ({
  default: () => <div data-testid="favorites-section">FavoritesSection Mock</div>,
}));

describe('DashboardView', () => {
  beforeEach(() => {
    // Reset stores to initial state
    useLastExerciseStore.setState({ configs: [], continueDifficulty: null });
    useNavigationStore.setState({ activeSection: 'dashboard' });
    useScoringStore.setState({
      currentScore: null,
      recentScores: [],
      bestScores: new Map(),
      showResults: false,
    });
  });

  describe('Empty State', () => {
    it('shows "Noch keine Uebung gestartet" text when no configs', () => {
      render(<DashboardView />);
      expect(screen.getByText('Noch keine Uebung gestartet')).toBeInTheDocument();
    });

    it('shows "NoteReader oeffnen" button in empty state', () => {
      render(<DashboardView />);
      const button = screen.getByRole('button', { name: /NoteReader oeffnen/i });
      expect(button).toBeInTheDocument();
    });

    it('"NoteReader oeffnen" button calls setSection("notereader")', async () => {
      const user = userEvent.setup();
      const setSection = vi.fn();
      useNavigationStore.setState({ setSection });

      render(<DashboardView />);
      const button = screen.getByRole('button', { name: /NoteReader oeffnen/i });
      await user.click(button);

      expect(setSection).toHaveBeenCalledWith('notereader');
      expect(setSection).toHaveBeenCalledTimes(1);
    });
  });

  describe('Exercise Cards', () => {
    beforeEach(() => {
      // Setup mock configs
      useLastExerciseStore.setState({
        configs: [
          {
            difficulty: 1,
            keyStage: 1,
            timeSignature: '4/4',
            barCount: 4,
            tempo: 80,
          },
          {
            difficulty: 3,
            keyStage: 3,
            timeSignature: 'random',
            barCount: 8,
            tempo: 120,
          },
        ],
      });
    });

    it('renders a card per config when configs exist', () => {
      render(<DashboardView />);

      // Should show both difficulty names
      expect(screen.getByText('Anfaenger')).toBeInTheDocument();
      expect(screen.getByText('Fortgeschritten')).toBeInTheDocument();
    });

    it('displays level name, difficulty, time signature, and bar count for each config', () => {
      render(<DashboardView />);

      // Check difficulty 1 config details
      expect(screen.getByText('Stufe 1')).toBeInTheDocument();
      expect(screen.getByText('4/4')).toBeInTheDocument();
      expect(screen.getByText('4 Takte')).toBeInTheDocument();

      // Check difficulty 3 config details
      expect(screen.getByText('Stufe 3')).toBeInTheDocument();
      expect(screen.getByText('Zufaellig')).toBeInTheDocument();
      expect(screen.getByText('8 Takte')).toBeInTheDocument();
    });

    it('play button calls setShouldContinue then setSection("notereader")', async () => {
      const user = userEvent.setup();
      const setShouldContinue = vi.fn();
      const setSection = vi.fn();
      useLastExerciseStore.setState({ setShouldContinue });
      useNavigationStore.setState({ setSection });

      render(<DashboardView />);

      // Click the first play button (difficulty 1)
      const playButtons = screen.getAllByRole('button', { name: /Weiter ueben/i });
      await user.click(playButtons[0]);

      expect(setShouldContinue).toHaveBeenCalledWith(1);
      expect(setSection).toHaveBeenCalledWith('notereader');
      expect(setShouldContinue).toHaveBeenCalledTimes(1);
      expect(setSection).toHaveBeenCalledTimes(1);
    });

    it('delete button calls removeConfig with correct difficulty', async () => {
      const user = userEvent.setup();
      const removeConfig = vi.fn();
      useLastExerciseStore.setState({ removeConfig });

      render(<DashboardView />);

      // Click the first delete button (difficulty 1)
      const deleteButtons = screen.getAllByRole('button', { name: /Loeschen/i });
      await user.click(deleteButtons[0]);

      expect(removeConfig).toHaveBeenCalledWith(1);
      expect(removeConfig).toHaveBeenCalledTimes(1);
    });

    it('settings button navigates to notereader', async () => {
      const user = userEvent.setup();
      const setSection = vi.fn();
      useNavigationStore.setState({ setSection });

      render(<DashboardView />);

      const settingsButtons = screen.getAllByRole('button', { name: /Einstellungen/i });
      await user.click(settingsButtons[0]);

      expect(setSection).toHaveBeenCalledWith('notereader');
    });
  });

  describe('Level Dot Colors', () => {
    it('applies correct CSS classes for difficulty levels', () => {
      useLastExerciseStore.setState({
        configs: [
          { difficulty: 1, keyStage: 1, timeSignature: '4/4', barCount: 4, tempo: 80 },
          { difficulty: 2, keyStage: 2, timeSignature: '3/4', barCount: 4, tempo: 80 },
          { difficulty: 3, keyStage: 3, timeSignature: '4/4', barCount: 4, tempo: 80 },
          { difficulty: 4, keyStage: 4, timeSignature: '4/4', barCount: 4, tempo: 80 },
          { difficulty: 5, keyStage: 5, timeSignature: '4/4', barCount: 4, tempo: 80 },
          { difficulty: 6, keyStage: 6, timeSignature: '4/4', barCount: 4, tempo: 80 },
        ],
      });

      const { container } = render(<DashboardView />);

      // Check that all color classes are present in the document
      expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument(); // difficulty 1
      expect(container.querySelector('.bg-blue-500')).toBeInTheDocument(); // difficulty 2
      expect(container.querySelector('.bg-amber-500')).toBeInTheDocument(); // difficulty 3
      expect(container.querySelector('.bg-orange-500')).toBeInTheDocument(); // difficulty 4
      expect(container.querySelector('.bg-red-500')).toBeInTheDocument(); // difficulty 5
      expect(container.querySelector('.bg-purple-500')).toBeInTheDocument(); // difficulty 6
    });
  });

  describe('Tab Switching', () => {
    beforeEach(() => {
      useLastExerciseStore.setState({
        configs: [
          { difficulty: 1, keyStage: 1, timeSignature: '4/4', barCount: 4, tempo: 80 },
        ],
      });
    });

    it('renders "Letzte Uebungen" and "Fortschritt" tabs', () => {
      render(<DashboardView />);
      expect(screen.getByRole('button', { name: /Letzte Uebungen/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Fortschritt/i })).toBeInTheDocument();
    });

    it('starts with "Letzte Uebungen" tab active by default', () => {
      render(<DashboardView />);
      const practiceTab = screen.getByRole('button', { name: /Letzte Uebungen/i });

      // Active tab has different text color class
      expect(practiceTab).toHaveClass('text-neutral-900');
    });

    it('switches to "Fortschritt" tab when clicked', async () => {
      const user = userEvent.setup();

      // Mock getStatsByDifficulty to return some stats
      const getStatsByDifficulty = vi.fn(() => ({
        completedCount: 5,
        averageScore: 75,
        averageStars: 3.5,
      }));
      useScoringStore.setState({ getStatsByDifficulty });

      render(<DashboardView />);

      const progressTab = screen.getByRole('button', { name: /Fortschritt/i });
      await user.click(progressTab);

      // Should now show progress stats
      expect(screen.getByText('5 Uebungen')).toBeInTheDocument();
      expect(screen.getByText('75% Genauigkeit')).toBeInTheDocument();
      expect(screen.getByText('3.5 Sterne')).toBeInTheDocument();
    });

    it('shows practice details in practice tab', () => {
      render(<DashboardView />);

      // Practice tab shows config details
      expect(screen.getByText('Stufe 1')).toBeInTheDocument();
      expect(screen.getByText('4/4')).toBeInTheDocument();
      expect(screen.getByText('4 Takte')).toBeInTheDocument();
    });
  });

  describe('Progress Tab', () => {
    beforeEach(() => {
      useLastExerciseStore.setState({
        configs: [
          { difficulty: 1, keyStage: 1, timeSignature: '4/4', barCount: 4, tempo: 80 },
          { difficulty: 3, keyStage: 3, timeSignature: '4/4', barCount: 8, tempo: 100 },
        ],
      });
    });

    it('displays stats from getStatsByDifficulty', async () => {
      const user = userEvent.setup();

      const getStatsByDifficulty = vi.fn((difficulty) => {
        if (difficulty === 1) {
          return { completedCount: 10, averageScore: 85, averageStars: 4.2 };
        }
        if (difficulty === 3) {
          return { completedCount: 3, averageScore: 60, averageStars: 2.0 };
        }
        return { completedCount: 0, averageScore: 0, averageStars: 0 };
      });
      useScoringStore.setState({ getStatsByDifficulty });

      render(<DashboardView />);

      // Switch to progress tab
      const progressTab = screen.getByRole('button', { name: /Fortschritt/i });
      await user.click(progressTab);

      // Check difficulty 1 stats
      expect(screen.getByText('10 Uebungen')).toBeInTheDocument();
      expect(screen.getByText('85% Genauigkeit')).toBeInTheDocument();
      expect(screen.getByText('4.2 Sterne')).toBeInTheDocument();

      // Check difficulty 3 stats
      expect(screen.getByText('3 Uebungen')).toBeInTheDocument();
      expect(screen.getByText('60% Genauigkeit')).toBeInTheDocument();
      expect(screen.getByText('2.0 Sterne')).toBeInTheDocument();
    });
  });

  describe('FavoritesSection', () => {
    it('renders FavoritesSection component', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('favorites-section')).toBeInTheDocument();
    });

    it('FavoritesSection is displayed below exercise cards', () => {
      useLastExerciseStore.setState({
        configs: [
          { difficulty: 1, keyStage: 1, timeSignature: '4/4', barCount: 4, tempo: 80 },
        ],
      });

      const { container } = render(<DashboardView />);

      // Get the favorites section element
      const favoritesSection = screen.getByTestId('favorites-section');

      // Check it has the mt-16 class (margin-top for spacing)
      expect(favoritesSection.parentElement).toHaveClass('mt-16');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing difficulty label gracefully', () => {
      useLastExerciseStore.setState({
        configs: [
          { difficulty: 99 as any, keyStage: 1, timeSignature: '4/4', barCount: 4, tempo: 80 },
        ],
      });

      const { container } = render(<DashboardView />);

      // Should still render the card even with unknown difficulty
      expect(container.querySelector('.bg-white')).toBeInTheDocument();
    });

    it('handles multiple clicks on play button without errors', async () => {
      const user = userEvent.setup();
      const setShouldContinue = vi.fn();
      const setSection = vi.fn();
      useLastExerciseStore.setState({
        configs: [
          { difficulty: 1, keyStage: 1, timeSignature: '4/4', barCount: 4, tempo: 80 },
        ],
        setShouldContinue,
      });
      useNavigationStore.setState({ setSection });

      render(<DashboardView />);

      const playButton = screen.getByRole('button', { name: /Weiter ueben/i });

      // Click multiple times
      await user.click(playButton);
      await user.click(playButton);
      await user.click(playButton);

      // Should be called 3 times
      expect(setShouldContinue).toHaveBeenCalledTimes(3);
      expect(setSection).toHaveBeenCalledTimes(3);
    });
  });
});
