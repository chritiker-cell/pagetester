/**
 * SongSelector — card-grid UI to browse and select songs
 */
import { useState } from 'react';
import { SONGS, CATEGORY_LABELS, DIFFICULTY_LABELS } from '../data/songData';
import Badge from './ui/Badge';
import FilterButton from './ui/FilterButton';
import type { Song, SongCategory } from '../types/songs';

type CategoryFilter = 'all' | SongCategory;
type DifficultyFilter = 'all' | 'beginner' | 'easy' | 'elementary';

interface SongSelectorProps {
  onSelectSong: (song: Song) => void;
}

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'kinderlieder', label: 'Kinderlieder' },
  { id: 'klassiker', label: 'Klassiker' },
  { id: 'internationale', label: 'Internationale' },
];

const DIFFICULTY_FILTERS: { id: DifficultyFilter; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'beginner', label: 'Anfaenger' },
  { id: 'easy', label: 'Leicht' },
  { id: 'elementary', label: 'Elementar' },
];

const DIFFICULTY_BADGE_VARIANT: Record<string, 'success' | 'primary' | 'warning'> = {
  beginner: 'success',
  easy: 'primary',
  elementary: 'warning',
};

export default function SongSelector({ onSelectSong }: SongSelectorProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  const filteredSongs = SONGS.filter(song => {
    if (categoryFilter !== 'all' && song.songMeta.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && song.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Songs</h2>

      {/* Category filter tabs */}
      <div className="flex gap-1.5 mb-3">
        {CATEGORY_FILTERS.map(f => (
          <FilterButton
            key={f.id}
            active={categoryFilter === f.id}
            onClick={() => setCategoryFilter(f.id)}
          >
            {f.label}
          </FilterButton>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex gap-1.5 mb-5">
        {DIFFICULTY_FILTERS.map(f => (
          <FilterButton
            key={f.id}
            active={difficultyFilter === f.id}
            onClick={() => setDifficultyFilter(f.id)}
          >
            {f.label}
          </FilterButton>
        ))}
      </div>

      {/* Song cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map(song => (
          <button
            key={song.id}
            onClick={() => onSelectSong(song)}
            className="text-left bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-5 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-tight">
                {song.name}
              </h3>
              <Badge variant={DIFFICULTY_BADGE_VARIANT[song.difficulty] || 'default'} size="sm">
                {DIFFICULTY_LABELS[song.difficulty] || song.difficulty}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              <span>{CATEGORY_LABELS[song.songMeta.category]}</span>
              <span>•</span>
              <span>{song.keySignature}-Dur</span>
              <span>•</span>
              <span>{song.timeSignature}</span>
              <span>•</span>
              <span>{song.bars.length} Takte</span>
            </div>

            {song.songMeta.composer !== 'Traditional' && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 italic">
                {song.songMeta.composer}
              </p>
            )}

            {song.songMeta.lyrics && (
              <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                {song.songMeta.lyrics}
              </p>
            )}
          </button>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          Keine Songs fuer diese Filter gefunden.
        </div>
      )}
    </div>
  );
}
