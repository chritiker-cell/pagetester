import { useState, useEffect } from 'react';
import Button from './ui/Button';
import {
  generateExercise,
  AVAILABLE_KEY_STAGES,
  getAllowedKeysLabel,
  type Difficulty,
  type TimeSignatureOption,
  type KeyStage,
} from '../utils/exerciseGenerator';
import { useExerciseStore } from '../store/useExerciseStore';
import type { Exercise } from '../types/music';

interface Props {
  onGenerated?: (exercise: Exercise) => void;
}

export default function RandomExerciseGenerator({ onGenerated }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [timeSignature, setTimeSignature] = useState<TimeSignatureOption>('4/4');
  const [keyStage, setKeyStage] = useState<KeyStage>(1);
  const [barCount, setBarCount] = useState<number>(8);

  const { setExercise, addExercise, setLevel, selectedLevel } = useExerciseStore();

  const handleGenerate = () => {
    const exercise = generateExercise({ difficulty, timeSignature, keyStage, barCount });
    if (exercise.level !== selectedLevel) {
      setLevel(exercise.level);
    }
    addExercise(exercise);
    setExercise(exercise.id);
    onGenerated?.(exercise);
  };

  const difficultyOptions: { value: Difficulty; label: string }[] = [
    { value: 1, label: 'Anfaenger' },
    { value: 2, label: 'Elementar' },
    { value: 3, label: 'Fortgeschritten I' },
    { value: 4, label: 'Fortgeschritten II' },
    { value: 5, label: 'Experte I' },
    { value: 6, label: 'Experte II' },
  ];

  const timeSignatureOptions: { value: TimeSignatureOption; label: string }[] = [
    { value: '4/4', label: '4/4' },
    { value: '3/4', label: '3/4' },
    { value: '2/4', label: '2/4' },
    { value: '6/8', label: '6/8' },
    { value: 'random', label: 'Zufall' },
  ];

  const keyStageOptions: { value: KeyStage; label: string; desc: string }[] = [
    { value: 1, label: 'Stufe 1', desc: 'C, G, F (0-1 Vorzeichen)' },
    { value: 2, label: 'Stufe 2', desc: 'D, Bb, A, Eb (2-3 Vorzeichen)' },
    { value: 3, label: 'Stufe 3', desc: 'E, Ab, B, Db (4-5 Vorzeichen)' },
    { value: 4, label: 'Stufe 4', desc: 'F#, Gb, C# (5-7 Vorzeichen)' },
    { value: 5, label: 'Stufe 5', desc: 'Alle Tonarten + enharmonisch' },
  ];

  const showKeyStageSelector = difficulty === 6;
  const availableKeyStages = AVAILABLE_KEY_STAGES[difficulty];

  // Reset keyStage if current selection is not available for the difficulty
  useEffect(() => {
    if (!availableKeyStages.includes(keyStage)) {
      setKeyStage(availableKeyStages[availableKeyStages.length - 1]);
    }
  }, [difficulty, keyStage, availableKeyStages]);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 shadow-md">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Zufalls-Generator</h3>

      {/* Difficulty */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Schwierigkeit</label>
        <div className="grid grid-cols-3 gap-1.5">
          {difficultyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                difficulty === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tonarten Info (Stufe 1-5) or Key Stage Selector (Stufe 6) */}
      {showKeyStageSelector ? (
        <div className="mb-3">
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Tonart-Stufe</label>
          <div className="space-y-1.5">
            {keyStageOptions.map((opt) => {
              const isAvailable = availableKeyStages.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`flex items-start gap-2 p-2 rounded-lg border transition-colors ${
                    !isAvailable
                      ? 'opacity-40 cursor-not-allowed border-transparent'
                      : keyStage === opt.value
                        ? 'border-primary-300 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 cursor-pointer'
                        : 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="keyStage"
                    checked={keyStage === opt.value}
                    onChange={() => isAvailable && setKeyStage(opt.value)}
                    disabled={!isAvailable}
                    className="mt-0.5 accent-primary-600"
                  />
                  <div>
                    <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">{opt.label}</span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">{opt.desc}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Tonarten</label>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-700 rounded-lg px-3 py-2">
            {getAllowedKeysLabel(difficulty)}
          </p>
        </div>
      )}

      {/* Time Signature */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Taktart</label>
        <select
          value={timeSignature}
          onChange={(e) => setTimeSignature(e.target.value as TimeSignatureOption)}
          className="w-full px-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {timeSignatureOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Bar Count */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
          Anzahl Takte: {barCount}
        </label>
        <input
          type="range"
          min="4"
          max="24"
          step="2"
          value={barCount}
          onChange={(e) => setBarCount(Number(e.target.value))}
          className="w-full accent-primary-600"
        />
        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>4</span>
          <span>24</span>
        </div>
      </div>

      {/* Generate Button */}
      <Button variant="primary" fullWidth onClick={handleGenerate}>
        Uebung generieren
      </Button>
    </div>
  );
}
