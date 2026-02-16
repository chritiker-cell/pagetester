/**
 * FavoritesSection — displays saved favorites categorized by type
 * Categories: Scales (future: Exercises, Arpeggios, Chords)
 */
import { useFavoritesStore, type FavoriteScale } from '../../store/useFavoritesStore';
import { useScalesStore } from '../../store/useScalesStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { SCALE_TYPE_LABELS, MODE_LABELS } from '../../data/scaleData';

function PlayIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

interface FavoriteScaleRowProps {
  favorite: FavoriteScale;
  onPlay: () => void;
  onDelete: () => void;
}

function FavoriteScaleRow({ favorite, onPlay, onDelete }: FavoriteScaleRowProps) {
  const scaleName = `${favorite.key}-${SCALE_TYPE_LABELS[favorite.scaleType]}`;

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm rounded-lg px-4 py-3 flex items-center gap-4 min-h-[56px]">
      {/* Dot + Name */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-primary-500" />
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{scaleName}</span>
      </div>

      {/* Separator */}
      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-600 shrink-0" />

      {/* Details inline */}
      <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
        <span>{MODE_LABELS[favorite.mode]}</span>
        <span>{favorite.octaves} Okt.</span>
        <span>{favorite.tempo} BPM</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onPlay}
          className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          title="Skala spielen"
        >
          <PlayIcon />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Favorit entfernen"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function EmptyPlaceholder() {
  return (
    <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg p-8 flex flex-col items-center text-center">
      <svg className="w-6 h-6 text-neutral-300 dark:text-neutral-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
      <p className="text-sm text-neutral-400 dark:text-neutral-500">
        Noch keine Favoriten — speichere Skalen fuer schnellen Zugriff
      </p>
    </div>
  );
}

export default function FavoritesSection() {
  const { scales, removeScale } = useFavoritesStore();
  const scalesStore = useScalesStore();
  const { setSection } = useNavigationStore();

  const handlePlayScale = (fav: FavoriteScale) => {
    // Set store with favorite config
    scalesStore.setSelectedKey(fav.key);
    // Note: setScaleType resets keyGroupIndex, so we call it first
    if (scalesStore.scaleType !== fav.scaleType) {
      scalesStore.setScaleType(fav.scaleType);
    }
    scalesStore.setMode(fav.mode);
    scalesStore.setOctaves(fav.octaves);
    scalesStore.setShowFingering(fav.showFingering);
    // Navigate to scales section
    setSection('scales');
  };

  const hasAnyFavorites = scales.length > 0;

  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
        <StarIcon />
        <span>Favoriten</span>
      </h3>

      {!hasAnyFavorites ? (
        <EmptyPlaceholder />
      ) : (
        <div className="space-y-4">
          {/* Scales category */}
          {scales.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                Skalen ({scales.length})
              </h4>
              <div className="space-y-2">
                {scales.map((fav) => (
                  <FavoriteScaleRow
                    key={fav.id}
                    favorite={fav}
                    onPlay={() => handlePlayScale(fav)}
                    onDelete={() => removeScale(fav.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Future categories: Exercises, Arpeggios, Chords would go here */}
        </div>
      )}
    </div>
  );
}
