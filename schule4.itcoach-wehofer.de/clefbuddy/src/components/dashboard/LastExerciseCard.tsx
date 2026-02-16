import { useLastExerciseStore } from '../../store/useLastExerciseStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { DIFFICULTY_LABELS } from '../../utils/exerciseGenerator';

const LEVEL_DOT_COLORS: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-blue-500',
  3: 'bg-amber-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
  6: 'bg-purple-500',
};

export default function LastExerciseCard() {
  const { configs, setShouldContinue } = useLastExerciseStore();
  const config = configs[0] || null;
  const { setSection } = useNavigationStore();

  const handleContinue = () => {
    if (config) {
      setShouldContinue(config.difficulty);
      setSection('notereader');
    }
  };

  const handleSettings = () => {
    setSection('notereader');
  };

  if (!config) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm rounded-lg px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">Noch keine Uebung gestartet</p>
        <button
          onClick={() => setSection('notereader')}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          NoteReader oeffnen
        </button>
      </div>
    );
  }

  const dotColor = LEVEL_DOT_COLORS[config.difficulty] || LEVEL_DOT_COLORS[1];
  const diffLabel = DIFFICULTY_LABELS.find(d => d.value === config.difficulty);
  const tsLabel = config.timeSignature === 'random' ? 'Zufaellig' : config.timeSignature;

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm rounded-lg px-4 py-3 flex items-center gap-4">
      {/* Level name */}
      <div className="flex items-center gap-2 shrink-0">
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {diffLabel?.name}
        </span>
      </div>

      {/* Separator */}
      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-600 shrink-0" />

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
        <span>Stufe {config.difficulty}</span>
        <span>{tsLabel}</span>
        <span>{config.barCount} Takte</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleSettings}
          className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          Einstellungen
        </button>
        <button
          onClick={handleContinue}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          Weiter ueben
        </button>
      </div>
    </div>
  );
}
