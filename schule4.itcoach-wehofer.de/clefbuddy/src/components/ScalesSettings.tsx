/**
 * ScalesSettings — slide-in settings panel for the scales module
 */
import { useScalesStore } from '../store/useScalesStore';
import Toggle from './ui/Toggle';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScalesSettings({ isOpen, onClose }: Props) {
  const store = useScalesStore();

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
          {/* Visuelle Hilfen */}
          <section>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Anzeige</h4>
            <div className="space-y-3">
              <Toggle
                label="Fingersatz anzeigen"
                checked={store.showFingering}
                onChange={store.setShowFingering}
              />
              <Toggle
                label="Tonart-Badge anzeigen"
                checked={store.showKeyOnSheet}
                onChange={store.setShowKeyOnSheet}
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
                onChange={store.setMetronomeDefaultOn}
              />
              <Toggle
                label="Loop standardmaessig an"
                checked={store.loopDefaultOn}
                onChange={store.setLoopDefaultOn}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
