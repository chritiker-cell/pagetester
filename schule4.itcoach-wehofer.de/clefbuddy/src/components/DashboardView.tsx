import { useNavigationStore } from '../store/useNavigationStore';
import { useScoringStore } from '../store/useScoringStore';
import Button from './ui/Button';

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: 'bg-blue-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', bar: 'bg-orange-500' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500' },
};

export default function DashboardView() {
  const { setSection } = useNavigationStore();
  const { recentScores, getLevelProgress } = useScoringStore();

  const levelProgress = getLevelProgress();

  // Calculate stats
  const totalExercises = recentScores.length;
  const avgAccuracy = totalExercises > 0
    ? Math.round(recentScores.reduce((sum, s) => sum + s.breakdown.overall, 0) / totalExercises)
    : 0;

  // Get recent scores
  const recentDisplay = recentScores.slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-1">Willkommen bei ClefBuddy</h2>
        <p className="text-neutral-500">Dein interaktiver Musiktheorie-Trainer fuer Blattlesen.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Gesamte Uebungen</div>
          <div className="text-3xl font-bold text-neutral-900">{totalExercises}</div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Durchschnittliche Genauigkeit</div>
          <div className="text-3xl font-bold text-neutral-900">
            {totalExercises > 0 ? `${avgAccuracy}%` : '–'}
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="flex gap-3 mb-6">
        <Button variant="primary" onClick={() => setSection('notereader')}>
          NoteReader oeffnen
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSection('notereader');
          }}
        >
          Zufaellige Uebung
        </Button>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Level-Fortschritt</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {levelProgress.map((lp) => {
            const colors = COLOR_MAP[lp.color] || COLOR_MAP.emerald;
            const progress = lp.totalRequired > 0
              ? Math.min(lp.completedExercises / lp.totalRequired, 1)
              : 0;

            return (
              <div
                key={lp.levelId}
                className={`rounded-xl border p-4 shadow-sm ${
                  lp.isUnlocked ? `${colors.bg} ${colors.border}` : 'bg-neutral-50 border-neutral-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${lp.isUnlocked ? colors.text : 'text-neutral-400'}`}>
                    {lp.levelId}. {lp.levelName}
                  </span>
                  {!lp.isUnlocked && (
                    <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {lp.isCompleted && (
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white/60 rounded-full mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${colors.bar}`}
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={lp.isUnlocked ? 'text-neutral-600' : 'text-neutral-400'}>
                    {lp.completedExercises}/{lp.totalRequired} Uebungen
                  </span>
                  {lp.averageScore > 0 && (
                    <span className={lp.isUnlocked ? 'text-neutral-600' : 'text-neutral-400'}>
                      {lp.averageScore}% / {lp.averageStars.toFixed(1)} &#9733;
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Exercises */}
      {recentDisplay.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Letzte Uebungen</h3>
          <div className="space-y-2">
            {recentDisplay.map((score, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div>
                  <span className="text-sm font-medium text-neutral-900">{score.exerciseName}</span>
                  <span className="ml-2 text-xs text-neutral-500">{score.breakdown.overall}%</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <svg
                      key={j}
                      className={`w-4 h-4 ${j < score.stars ? 'text-yellow-400' : 'text-neutral-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
