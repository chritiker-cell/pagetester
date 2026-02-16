import { useNoteReaderSettingsStore } from '../store/useNoteReaderSettingsStore';
import MidiDeviceSelector from './MidiDeviceSelector';
import Toggle from './ui/Toggle';
import FilterButton from './ui/FilterButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ButtonGroup<T extends string | number>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map(opt => (
        <FilterButton
          key={String(opt.value)}
          active={value === opt.value}
          onClick={() => onChange(opt.value)}
          className="py-1.5 px-3 text-xs"
        >
          {opt.label}
        </FilterButton>
      ))}
    </div>
  );
}

export default function NoteReaderSettings({ isOpen, onClose }: Props) {
  const store = useNoteReaderSettingsStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-neutral-800 shadow-xl z-50 overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Einstellungen</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* MIDI-Gerät */}
          <section>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">MIDI-Geraet</h4>
            <MidiDeviceSelector minimal />
          </section>

          {/* Visuelle Hilfen */}
          <section>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Visuelle Hilfen</h4>
            <div className="space-y-3">
              <Toggle
                label="Akkordnamen anzeigen"
                checked={store.showChordSymbols}
                onChange={v => store.setSetting('showChordSymbols', v)}
              />
              <Toggle
                label="Fingersatz bei erster Note"
                checked={store.showFingeringFirstNote}
                onChange={v => store.setSetting('showFingeringFirstNote', v)}
              />
              <Toggle
                label="Fingersatz bei Positionswechsel"
                checked={store.showFingeringOnPositionChange}
                onChange={v => store.setSetting('showFingeringOnPositionChange', v)}
              />
            </div>
          </section>

          {/* Wiedergabe */}
          <section>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Wiedergabe</h4>
            <div className="space-y-3">
              <Toggle
                label="Metronom standardmaessig an"
                checked={store.metronomeDefaultOn}
                onChange={v => store.setSetting('metronomeDefaultOn', v)}
              />
              <Toggle
                label="Loop standardmaessig an"
                checked={store.loopDefaultOn}
                onChange={v => store.setSetting('loopDefaultOn', v)}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Countdown-Schlaege</label>
                <ButtonGroup
                  options={[
                    { value: 2 as 2 | 4 | 8, label: '2' },
                    { value: 4 as 2 | 4 | 8, label: '4' },
                    { value: 8 as 2 | 4 | 8, label: '8' },
                  ]}
                  value={store.countdownBeats}
                  onChange={v => store.setSetting('countdownBeats', v)}
                />
              </div>
            </div>
          </section>

          {/* Reset */}
          <button
            onClick={store.resetDefaults}
            className="w-full py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Auf Standardwerte zuruecksetzen
          </button>
        </div>
      </div>
    </>
  );
}
