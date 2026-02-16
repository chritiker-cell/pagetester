import { useScoringStore } from '../store/useScoringStore';
import { useLastExerciseStore } from '../store/useLastExerciseStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { DIFFICULTY_LABELS } from '../utils/exerciseGenerator';
import type { Difficulty } from '../utils/exerciseGenerator';
import FavoritesSection from './dashboard/FavoritesSection';

const LEVEL_DOT_COLORS: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-blue-500',
  3: 'bg-amber-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
  6: 'bg-purple-500',
};

function StarDisplay({ stars }: { stars: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= stars ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function DashboardView() {
  const { configs, setShouldContinue, removeConfig } = useLastExerciseStore();
  const { setSection } = useNavigationStore();
  const { getStatsByDifficulty } = useScoringStore();

  const handleContinue = (difficulty: Difficulty) => {
    setShouldContinue(difficulty);
    setSection('notereader');
  };

  const handleSettings = () => {
    setSection('notereader');
  };

  const handleDelete = (difficulty: Difficulty) => {
    removeConfig(difficulty);
  };

  const handleFirstExercise = () => {
    setSection('notereader');
  };

  const hasConfigs = configs.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight mb-8 text-center">NoteReading</h2>

      {/* Content */}
      {!hasConfigs ? (
        /* Welcome CTA for first-time users */
        <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-lg rounded-xl px-8 py-10 text-center">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Willkommen bei ClefBuddy!
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Lerne Notenlesen Schritt fuer Schritt.
          </p>
          <button
            onClick={handleFirstExercise}
            className="px-8 py-3 rounded-xl text-base font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm"
          >
            Erste Uebung starten (Stufe 1)
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {configs.map((cfg) => {
            const dotColor = LEVEL_DOT_COLORS[cfg.difficulty] || LEVEL_DOT_COLORS[1];
            const diffLabel = DIFFICULTY_LABELS.find(d => d.value === cfg.difficulty);
            const stats = getStatsByDifficulty(cfg.difficulty);

            return (
              <div
                key={cfg.difficulty}
                className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-md rounded-lg px-4 py-3 flex items-center gap-4 min-h-[56px]"
              >
                {/* Level name */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {diffLabel?.name}
                  </span>
                </div>

                {/* Separator */}
                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-600 shrink-0" />

                {/* Combined stats + config info */}
                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-300 flex-wrap min-w-0">
                  {stats.completedCount > 0 ? (
                    <>
                      <span>{stats.completedCount} Uebungen</span>
                      <span>{stats.averageScore}%</span>
                      <StarDisplay stars={Math.round(stats.averageStars)} />
                    </>
                  ) : (
                    <span className="text-neutral-400 dark:text-neutral-500">Noch kein Ergebnis</span>
                  )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Actions: Play, Settings, Delete */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleContinue(cfg.difficulty)}
                    className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    title="Weiter ueben"
                    aria-label="Weiter ueben"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleSettings}
                    className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    title="Einstellungen"
                    aria-label="Einstellungen"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cfg.difficulty)}
                    className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Loeschen"
                    aria-label="Loeschen"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Favorites */}
      <div className="mt-16">
        <FavoritesSection />
      </div>
    </div>
  );
}
