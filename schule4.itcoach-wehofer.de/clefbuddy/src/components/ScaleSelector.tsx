/**
 * ScaleSelector — configuration panel for scale practice
 */
import { useScalesStore } from '../store/useScalesStore';
import {
  AVAILABLE_MODES,
  MAX_OCTAVES,
  SCALE_TYPE_LABELS,
  MODE_LABELS,
  KEY_GROUP_LABELS,
  POLYRHYTHM_VARIANT_LABELS,
  THIRDS_VARIANT_LABELS,
  getKeysForGroup,
  type KeyGroup,
} from '../data/scaleData';
import type { ScaleType, ScaleMode, PolyrhythmVariant, ThirdsVariant } from '../types/scales';
import Button from './ui/Button';
import FilterButton from './ui/FilterButton';
import Toggle from './ui/Toggle';

interface ScaleSelectorProps {
  onGenerate: () => void;
}

export default function ScaleSelector({ onGenerate }: ScaleSelectorProps) {
  const {
    selectedKey, scaleType, mode, octaves, showFingering, showKeyOnSheet,
    selectedKeyGroup, keyGroupIndex, polyrhythmVariant, thirdsVariant,
    setSelectedKey, setScaleType, setMode, setOctaves, setShowFingering, setShowKeyOnSheet,
    setSelectedKeyGroup, setKeyGroupIndex, setPolyrhythmVariant, setThirdsVariant,
  } = useScalesStore();

  const availableModes = AVAILABLE_MODES[3] || ['parallel'];
  const maxOctaves = MAX_OCTAVES[3] || 1;

  // Get keys for the current group and scale type
  const availableKeys = getKeysForGroup(scaleType, selectedKeyGroup);

  // All scale types are now available
  const availableTypes: ScaleType[] = ['major', 'naturalMinor', 'harmonicMinor', 'melodicMinor'];

  // Sync selectedKey with group when key is not in current group
  if (!availableKeys.includes(selectedKey) && availableKeys.length > 0) {
    const newIndex = 0;
    setKeyGroupIndex(newIndex);
    setSelectedKey(availableKeys[newIndex]);
  }

  // Reset mode if not available
  if (!availableModes.includes(mode)) {
    setMode(availableModes[0]);
  }

  // Reset octaves if exceeds max
  if (octaves > maxOctaves) {
    setOctaves(1);
  }

  // Handle key selection - update index to match
  const handleKeySelect = (key: string) => {
    const index = availableKeys.indexOf(key);
    if (index !== -1) {
      setKeyGroupIndex(index);
      setSelectedKey(key);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg flex flex-col max-h-[80vh]">
      <div className="p-6 pb-0 space-y-5 overflow-y-auto flex-1 min-h-0">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Skalen-Training</h2>

      {/* Scale Type */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Skalen-Typ</label>
        <div className="flex flex-col gap-1.5">
          {(['major', 'naturalMinor', 'harmonicMinor', 'melodicMinor'] as ScaleType[]).map(t => {
            const available = availableTypes.includes(t);
            return (
              <FilterButton
                key={t}
                active={scaleType === t}
                disabled={!available}
                onClick={() => available && setScaleType(t)}
                className="w-full text-left"
              >
                {SCALE_TYPE_LABELS[t]}
              </FilterButton>
            );
          })}
        </div>
      </div>

      {/* Key Group */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tonart-Stufe</label>
        <div className="flex gap-1.5">
          {([1, 2, 3, 'all'] as KeyGroup[]).map(g => (
            <FilterButton
              key={String(g)}
              active={selectedKeyGroup === g}
              onClick={() => setSelectedKeyGroup(g)}
              className="flex-1"
            >
              {KEY_GROUP_LABELS[g]}
            </FilterButton>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {selectedKeyGroup === 'all'
            ? `Alle ${scaleType === 'major' ? '12 Dur' : '10 Moll'}-Tonarten`
            : `${availableKeys.length} Tonarten (${selectedKeyGroup === 1 ? '0-1' : selectedKeyGroup === 2 ? '2-3' : '4-6'} Vorzeichen)`
          }
        </p>
      </div>

      {/* Key */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tonart</label>
        <div className="flex gap-1.5 flex-wrap">
          {availableKeys.map((k, idx) => (
            <FilterButton
              key={k}
              active={selectedKey === k}
              onClick={() => handleKeySelect(k)}
            >
              {k}{keyGroupIndex === idx && selectedKey === k ? '' : ''}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Modus</label>
        <div className="flex flex-col gap-1.5">
          {(['parallel', 'contraryMotion', 'rhythmicVariance', 'thirds'] as ScaleMode[]).map(m => {
            const available = availableModes.includes(m);
            return (
              <FilterButton
                key={m}
                active={mode === m}
                disabled={!available}
                onClick={() => available && setMode(m)}
                className="w-full text-left"
              >
                {MODE_LABELS[m]}
              </FilterButton>
            );
          })}
        </div>
      </div>

      {/* Polyrhythm Variant (only when mode is rhythmicVariance) */}
      {mode === 'rhythmicVariance' && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Variante</label>
          <div className="flex gap-1.5">
            {(['2:1-rh', '2:1-lh', '2:1-auto'] as PolyrhythmVariant[]).map(v => (
              <FilterButton
                key={v}
                active={polyrhythmVariant === v}
                onClick={() => setPolyrhythmVariant(v)}
                className="flex-1"
              >
                {POLYRHYTHM_VARIANT_LABELS[v]}
              </FilterButton>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            {polyrhythmVariant === '2:1-rh' && 'Rechte Hand spielt Achtel, linke Hand Viertel'}
            {polyrhythmVariant === '2:1-lh' && 'Linke Hand spielt Achtel, rechte Hand Viertel'}
            {polyrhythmVariant === '2:1-auto' && 'Haende wechseln bei jeder Wiederholung'}
          </p>
        </div>
      )}

      {/* Thirds Variant (only when mode is thirds) */}
      {mode === 'thirds' && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Variante</label>
          <div className="flex gap-1.5">
            {(['harmonic', 'melodic'] as ThirdsVariant[]).map(v => (
              <FilterButton
                key={v}
                active={thirdsVariant === v}
                onClick={() => setThirdsVariant(v)}
                className="flex-1"
              >
                {THIRDS_VARIANT_LABELS[v]}
              </FilterButton>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            {thirdsVariant === 'harmonic' && 'Beide Toene gleichzeitig (Akkord)'}
            {thirdsVariant === 'melodic' && 'Toene nacheinander (Melodie) — COMING SOON'}
          </p>
        </div>
      )}

      {/* Octaves */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Oktaven</label>
        <div className="flex gap-1.5">
          {([1, 2] as const).map(o => (
            <FilterButton
              key={o}
              active={octaves === o}
              disabled={o > maxOctaves}
              onClick={() => o <= maxOctaves && setOctaves(o)}
              className="flex-1"
            >
              {o}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Fingering toggle */}
      <Toggle
        label="Fingersaetze anzeigen"
        checked={showFingering}
        onChange={setShowFingering}
      />

      {/* Key on sheet toggle */}
      <Toggle
        label="Tonart am Notenblatt anzeigen"
        checked={showKeyOnSheet}
        onChange={setShowKeyOnSheet}
      />

      </div>

      <div className="p-6 pt-4 border-t border-neutral-100 dark:border-neutral-700 shrink-0">
        <Button variant="primary" size="lg" onClick={onGenerate} className="w-full">
          Skala generieren
        </Button>
      </div>
    </div>
  );
}
