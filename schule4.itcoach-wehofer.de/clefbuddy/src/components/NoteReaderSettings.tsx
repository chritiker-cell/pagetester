import { useNoteReaderSettingsStore } from '../store/useNoteReaderSettingsStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-sm text-neutral-700">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-neutral-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
    </label>
  );
}

function ButtonGroup<T extends string | number>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map(opt => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
            value === opt.value
              ? 'bg-primary-600 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {opt.label}
        </button>
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
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900">Einstellungen</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Uebungs-Parameter */}
          <section>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Uebung</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Anzahl Takte</label>
                <ButtonGroup
                  options={[4, 8, 12, 16, 20, 24].map(n => ({ value: n, label: String(n) }))}
                  value={store.barCount}
                  onChange={v => store.setSetting('barCount', v)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Taktart</label>
                <ButtonGroup
                  options={[
                    { value: 'random', label: 'Zufaellig' },
                    { value: '4/4', label: '4/4' },
                    { value: '3/4', label: '3/4' },
                    { value: '2/4', label: '2/4' },
                    { value: '6/8', label: '6/8' },
                  ]}
                  value={store.timeSignature}
                  onChange={v => store.setSetting('timeSignature', v)}
                />
              </div>
            </div>
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
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Countdown-Schlaege</label>
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
            className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Auf Standardwerte zuruecksetzen
          </button>
        </div>
      </div>
    </>
  );
}
