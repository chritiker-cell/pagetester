import { useState } from 'react';
import Button from './ui/Button';
import {
  generateExercise,
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

  const { setExercise, addExercise, setLevel, selectedLevel } = useExerciseStore();

  const handleGenerate = () => {
    const exercise = generateExercise({ difficulty, timeSignature, keyStage });
    if (exercise.level !== selectedLevel) {
      setLevel(exercise.level);
    }
    addExercise(exercise);
    setExercise(exercise.id);
    onGenerated?.(exercise);
  };

  const difficultyOptions: { value: Difficulty; label: string }[] = [
    { value: 1, label: 'Leicht' },
    { value: 2, label: 'Mittel' },
    { value: 3, label: 'Schwer' },
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
    { value: 3, label: 'Stufe 3', desc: 'E, Ab, B, Db, F# (4-6 Vorzeichen)' },
  ];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">Zufalls-Generator</h3>

      {/* Difficulty */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Schwierigkeit</label>
        <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
          {difficultyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                difficulty === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Signature */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Taktart</label>
        <select
          value={timeSignature}
          onChange={(e) => setTimeSignature(e.target.value as TimeSignatureOption)}
          className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {timeSignatureOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Key Stage */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Tonart-Stufe</label>
        <div className="space-y-1.5">
          {keyStageOptions.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                keyStage === opt.value
                  ? 'border-primary-300 bg-primary-50/50'
                  : 'border-transparent hover:bg-neutral-50'
              }`}
            >
              <input
                type="radio"
                name="keyStage"
                checked={keyStage === opt.value}
                onChange={() => setKeyStage(opt.value)}
                className="mt-0.5 accent-primary-600"
              />
              <div>
                <span className="text-xs font-medium text-neutral-900">{opt.label}</span>
                <span className="block text-xs text-neutral-500">{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button variant="primary" fullWidth onClick={handleGenerate}>
        Uebung generieren
      </Button>
    </div>
  );
}
