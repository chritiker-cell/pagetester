/**
 * ChordSelector — mode-based configuration panel
 */
import { useChordsStore } from '../store/useChordsStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { KEY_GROUPS, MODE_CONFIGS, ALL_MODES } from '../data/chordData';
import type { ChordMode, KeyGroup } from '../types/chords';
import Button from './ui/Button';
import FilterButton from './ui/FilterButton';
import Toggle from './ui/Toggle';

interface ChordSelectorProps {
  onGenerate: () => void;
}

export default function ChordSelector({ onGenerate }: ChordSelectorProps) {
  const store = useChordsStore();
  const modeCfg = MODE_CONFIGS[store.mode];
  const setActiveSection = useNavigationStore(state => state.setSection);

  const keyGroups: KeyGroup[] = [1, 2, 3, 4];
  const allTs: ('4/4' | '3/4' | '6/8' | 'random')[] = ['4/4', '3/4', '6/8', 'random'];
  const barCounts = [4, 8, 12, 16];

  // Auto-fix timeSignature if not valid for mode (but 'random' is always valid)
  const effectiveTs = store.timeSignature;
  if (effectiveTs !== 'random' && !modeCfg.timeSignatures.includes(effectiveTs as '4/4' | '3/4' | '6/8')) {
    store.setTimeSignature(modeCfg.timeSignatures[0]);
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg flex flex-col max-h-[80vh]">
      <div className="p-6 pb-0 space-y-5 overflow-y-auto flex-1 min-h-0">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Akkord-Training</h2>

      {/* Mode Grid */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Modus</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ALL_MODES.map((m: ChordMode) => {
            const cfg = MODE_CONFIGS[m];
            const active = store.mode === m;
            return (
              <FilterButton
                key={m}
                active={active}
                onClick={() => store.setMode(m)}
                className="p-3 text-left"
              >
                <span className="font-medium text-sm leading-tight">{cfg.name}</span>
              </FilterButton>
            );
          })}
        </div>
        {/* Cross-link to Arpeggio module when 'arpeggio' mode is selected */}
        {store.mode === 'arpeggio' && (
          <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium">Hinweis:</span> Für technische Arpeggio-Drills (1-2 Oktaven, verschiedene Umkehrungen){' '}
              <button
                onClick={() => setActiveSection('arpeggio')}
                className="underline font-medium hover:text-blue-600 dark:hover:text-blue-100 transition-colors"
              >
                Arpeggio-Menü
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Key Group */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tonart-Gruppe</label>
        <div className="flex gap-1.5 flex-wrap">
          {keyGroups.map(g => (
            <FilterButton
              key={g}
              active={store.keyGroup === g}
              onClick={() => store.setKeyGroup(g)}
              className="flex-1 min-w-0"
            >
              <span className="font-medium">{g}</span>
              <span className="hidden sm:inline text-[10px] ml-1 opacity-70">{KEY_GROUPS[g].label}</span>
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Time Signature */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Taktart</label>
        <div className="flex gap-1.5">
          {allTs.map(ts => {
            const isDisabled = ts !== 'random' && !modeCfg.timeSignatures.includes(ts as '4/4' | '3/4' | '6/8');
            return (
              <FilterButton
                key={ts}
                active={store.timeSignature === ts}
                disabled={isDisabled}
                onClick={() => !isDisabled && store.setTimeSignature(ts)}
                title={isDisabled ? `${ts} ist fuer diesen Modus nicht verfuegbar` : undefined}
                className={`flex-1 ${isDisabled ? 'opacity-30' : ''}`}
              >
                {ts === 'random' ? 'Zufall' : ts}
              </FilterButton>
            );
          })}
        </div>
      </div>

      {/* Bar Count */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Taktanzahl</label>
        <div className="flex gap-1.5">
          {barCounts.map(c => (
            <FilterButton
              key={c}
              active={store.barCount === c}
              onClick={() => store.setBarCount(c)}
              className="flex-1"
            >
              {c}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <Toggle
          label="Fingersaetze anzeigen"
          checked={store.showFingering}
          onChange={v => store.setShowFingering(v)}
        />
        <Toggle
          label="Akkordnamen anzeigen"
          checked={store.showChordNames}
          onChange={v => store.setShowChordNames(v)}
        />
      </div>
      </div>

      <div className="p-6 pt-4 border-t border-neutral-100 dark:border-neutral-700 shrink-0">
        <Button variant="primary" size="lg" onClick={onGenerate} className="w-full">
          Uebung generieren
        </Button>
      </div>
    </div>
  );
}
