/**
 * ArpeggioSelector — compact configuration panel for arpeggio practice
 */
import { useArpeggioStore } from '../store/useArpeggioStore';
import { useNavigationStore } from '../store/useNavigationStore';
import {
  ARPEGGIO_LEVEL_CONFIGS,
  ARPEGGIO_TYPE_LABELS,
  ARPEGGIO_PATTERN_ICONS,
  ARPEGGIO_PATTERN_LABELS,
  ARPEGGIO_INVERSION_LABELS,
  isSeventh,
  KEY_GROUPS,
  KEY_GROUP_ORDER,
} from '../data/arpeggioData';
import type { ArpeggioType, ArpeggioPattern, ArpeggioInversion, ArpeggioHand } from '../types/arpeggio';
import Button from './ui/Button';
import FilterButton from './ui/FilterButton';
import Toggle from './ui/Toggle';
import Card, { CardContent } from './ui/Card';

interface ArpeggioSelectorProps {
  onGenerate: () => void;
}

// Hand icons for compact display
const HAND_ICONS: Record<ArpeggioHand, { icon: string; label: string }> = {
  rh: { icon: '👉', label: 'Rechts' },
  lh: { icon: '👈', label: 'Links' },
  both: { icon: '👐', label: 'Beide' },
};

// Chord type groups
const TRIAD_TYPES: ArpeggioType[] = ['major', 'minor', 'diminished', 'augmented'];
const SEVENTH_TYPES: ArpeggioType[] = ['dominant7', 'major7', 'minor7'];

export default function ArpeggioSelector({ onGenerate }: ArpeggioSelectorProps) {
  const {
    selectedKey, chordType, pattern, inversion, octaves, bars, showFingering, hand,
    setSelectedKey, setChordType, setPattern, setInversion, setOctaves, setBars, setShowFingering, setHand,
  } = useArpeggioStore();
  const setActiveSection = useNavigationStore(state => state.setSection);

  // Get config for all levels (nothing locked)
  const allChordTypes = new Set<ArpeggioType>();
  const allKeys = new Set<string>();
  const allInversions = new Set<ArpeggioInversion>();

  for (const l of [3, 4, 5, 6]) {
    const cfg = ARPEGGIO_LEVEL_CONFIGS[l];
    if (cfg) {
      cfg.chordTypes.forEach(t => allChordTypes.add(t));
      cfg.keys.forEach(k => allKeys.add(k));
      cfg.inversions.forEach(i => allInversions.add(i));
    }
  }

  // Determine current level based on selected key and chord type
  const getCurrentLevel = (): number => {
    for (const l of [3, 4, 5, 6]) {
      const cfg = ARPEGGIO_LEVEL_CONFIGS[l];
      if (cfg && cfg.keys.includes(selectedKey) && cfg.chordTypes.includes(chordType)) {
        return l;
      }
    }
    return 6;
  };

  const currentLevel = getCurrentLevel();
  const currentConfig = ARPEGGIO_LEVEL_CONFIGS[currentLevel];
  const maxOctaves: 1 | 2 = currentConfig?.maxOctaves || 1;

  const availableChordTypes = Array.from(allChordTypes);
  const availableKeys = Array.from(allKeys);
  const availableInversions = Array.from(allInversions).sort((a, b) => a - b);

  // Filter keys for current chord type
  const isMinorChord = chordType === 'minor' || chordType === 'minor7';
  const filteredKeys = availableKeys.filter(k => {
    const isMinorKey = k.endsWith('m');
    if (isMinorChord) return isMinorKey || !k.endsWith('m');
    return true;
  });

  // Validate current selection
  if (!filteredKeys.includes(selectedKey) && filteredKeys.length > 0) {
    setSelectedKey(filteredKeys[0]);
  }

  // 3rd inversion only available for 7th chords
  const validInversions = isSeventh(chordType)
    ? availableInversions
    : availableInversions.filter(i => i < 3);

  if (!validInversions.includes(inversion)) {
    setInversion(validInversions[0] || 0);
  }

  if (octaves > maxOctaves) {
    setOctaves(1);
  }

  // Patterns: 'contrary' only makes sense for both hands
  const basePatterns: ArpeggioPattern[] = ['up', 'down', 'up-down'];
  const bothHandsPatterns: ArpeggioPattern[] = ['alternating', 'contrary'];
  const allPatterns: ArpeggioPattern[] = hand === 'both'
    ? [...basePatterns, ...bothHandsPatterns]
    : basePatterns;

  if (!allPatterns.includes(pattern)) {
    setPattern('up');
  }

  // Find current key group for dropdown display
  const getCurrentKeyGroup = (): string => {
    for (const group of KEY_GROUP_ORDER) {
      if (KEY_GROUPS[group].includes(selectedKey)) {
        return group;
      }
    }
    return KEY_GROUP_ORDER[0];
  };

  // Handle key group change from dropdown
  const handleKeyGroupChange = (group: string) => {
    const keysInGroup = KEY_GROUPS[group].filter(k => filteredKeys.includes(k));
    if (keysInGroup.length > 0 && !keysInGroup.includes(selectedKey)) {
      setSelectedKey(keysInGroup[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg flex flex-col max-h-[85vh]">
      <div className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Arpeggio-Training</h2>

        {/* Cross-link to Chords module */}
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-medium">Hinweis:</span> Für Begleitfiguren (Alberti, Waltz, Broken Chords){' '}
            <button
              onClick={() => setActiveSection('chords')}
              className="underline font-medium hover:text-amber-600 dark:hover:text-amber-100 transition-colors"
            >
              Akkorde-Menü
            </button>
          </p>
        </div>

        {/* Key Selection Card */}
        <Card variant="outlined" padding="sm">
          <CardContent>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Tonart
            </label>
            <select
              value={getCurrentKeyGroup()}
              onChange={(e) => handleKeyGroupChange(e.target.value)}
              className="w-full py-2 px-3 rounded-lg text-sm bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {KEY_GROUP_ORDER.map(group => (
                <option key={group} value={group}>
                  {group} ({KEY_GROUPS[group].filter(k => filteredKeys.includes(k)).join(', ')})
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {KEY_GROUPS[getCurrentKeyGroup()]
                .filter(k => filteredKeys.includes(k))
                .map(k => (
                  <FilterButton
                    key={k}
                    active={selectedKey === k}
                    onClick={() => setSelectedKey(k)}
                  >
                    {k}
                  </FilterButton>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Chord Type Card with visual grouping */}
        <Card variant="outlined" padding="sm">
          <CardContent>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Akkord-Typ
            </label>

            {/* Dreiklaenge Group */}
            <div className="mb-3">
              <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 font-medium">
                Dreiklaenge
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TRIAD_TYPES.map(t => {
                  const available = availableChordTypes.includes(t);
                  return (
                    <FilterButton
                      key={t}
                      active={chordType === t}
                      disabled={!available}
                      onClick={() => available && setChordType(t)}
                    >
                      {ARPEGGIO_TYPE_LABELS[t]}
                    </FilterButton>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 my-2"></div>

            {/* Septakkorde Group */}
            <div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 font-medium">
                Septakkorde
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SEVENTH_TYPES.map(t => {
                  const available = availableChordTypes.includes(t);
                  return (
                    <FilterButton
                      key={t}
                      active={chordType === t}
                      disabled={!available}
                      onClick={() => available && setChordType(t)}
                    >
                      {ARPEGGIO_TYPE_LABELS[t]}
                    </FilterButton>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Card with icons + labels */}
        <Card variant="outlined" padding="sm">
          <CardContent>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Bewegungsrichtung
            </label>
            <div className="flex flex-col gap-1.5">
              {allPatterns.map(p => (
                <FilterButton
                  key={p}
                  active={pattern === p}
                  onClick={() => setPattern(p)}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">{ARPEGGIO_PATTERN_ICONS[p]}</span>
                  <span>{ARPEGGIO_PATTERN_LABELS[p]}</span>
                </FilterButton>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inversion & Octaves Card */}
        <Card variant="outlined" padding="sm">
          <CardContent>
            <div className="space-y-3">
              {/* Inversion */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Umkehrung
                </label>
                <div className="flex gap-1.5">
                  {([0, 1, 2, 3] as ArpeggioInversion[]).map(inv => {
                    const available = validInversions.includes(inv);
                    const shortLabel = inv === 0 ? 'Grund' : `${inv}.`;
                    return (
                      <FilterButton
                        key={inv}
                        active={inversion === inv}
                        disabled={!available}
                        onClick={() => available && setInversion(inv)}
                        title={ARPEGGIO_INVERSION_LABELS[inv]}
                        className="flex-1"
                      >
                        {shortLabel}
                      </FilterButton>
                    );
                  })}
                </div>
              </div>

              {/* Octaves */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Oktaven
                </label>
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
            </div>
          </CardContent>
        </Card>

        {/* Hand & Settings Card */}
        <Card variant="outlined" padding="sm">
          <CardContent>
            <div className="space-y-3">
              {/* Hand Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Hand
                </label>
                <div className="flex gap-1.5">
                  {(['rh', 'lh', 'both'] as ArpeggioHand[]).map(h => (
                    <FilterButton
                      key={h}
                      active={hand === h}
                      onClick={() => setHand(h)}
                      title={HAND_ICONS[h].label}
                      aria-label={`${HAND_ICONS[h].label} Hand`}
                      className="flex-1"
                    >
                      <span className="text-base">{HAND_ICONS[h].icon}</span>
                      <span className="text-xs ml-1">{HAND_ICONS[h].label}</span>
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Bars */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Takte
                </label>
                <div className="flex gap-1.5">
                  {([2, 4, 8] as const).map(b => (
                    <FilterButton
                      key={b}
                      active={bars === b}
                      onClick={() => setBars(b)}
                      className="flex-1"
                    >
                      {b}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Fingering Toggle */}
              <div className="pt-1">
                <Toggle
                  label="Fingersaetze anzeigen"
                  checked={showFingering}
                  onChange={setShowFingering}
                  labelClassName="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 pt-3 border-t border-neutral-100 dark:border-neutral-700 shrink-0">
        <Button variant="primary" size="md" onClick={onGenerate} className="w-full">
          Arpeggio generieren
        </Button>
      </div>
    </div>
  );
}
