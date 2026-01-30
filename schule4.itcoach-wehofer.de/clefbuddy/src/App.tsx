import './App.css';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import NoteReaderView from './components/NoteReaderView';
import ComingSoonView from './components/ComingSoonView';
import { LayoutSection } from './components/Layout';
import { useNavigationStore } from './store/useNavigationStore';

function App() {
  const { activeSection } = useNavigationStore();

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-neutral-900">ClefBuddy</h1>
              <span className="ml-3 text-sm text-neutral-500 hidden sm:inline">
                Interaktiver Musiktheorie-Trainer
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <LayoutSection maxWidth="notation" padding="lg">
        {activeSection === 'dashboard' && <DashboardView />}
        {activeSection === 'notereader' && <NoteReaderView />}
        {activeSection === 'scales' && (
          <ComingSoonView title="Scales" description="Tonleitern ueben in allen Tonarten und Modi." />
        )}
        {activeSection === 'arpeggio' && (
          <ComingSoonView title="Arpeggio" description="Arpeggien und gebrochene Akkorde trainieren." />
        )}
        {activeSection === 'chords' && (
          <ComingSoonView title="Chords" description="Akkorderkennung und Umkehrungen lernen." />
        )}
      </LayoutSection>

      {/* Footer */}
      <footer className="mt-6 pb-6 text-center text-neutral-400 text-sm">
        ClefBuddy - Musiktheorie-Trainer fuer Blattlesen
      </footer>
    </div>
  );
}

export default App;
