import './App.css';
import { lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';
import { LayoutSection } from './components/Layout';
import { useNavigationStore } from './store/useNavigationStore';

const DashboardView = lazy(() => import('./components/DashboardView'));
const NoteReaderView = lazy(() => import('./components/NoteReaderView'));
const ScalesView = lazy(() => import('./components/ScalesView'));
const ChordsView = lazy(() => import('./components/ChordsView'));
const ArpeggiosView = lazy(() => import('./components/ArpeggiosView'));
const SongsView = lazy(() => import('./components/SongsView'));
const TheorieView = lazy(() => import('./components/TheorieView'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600 dark:border-neutral-300" />
    </div>
  );
}

function App() {
  const { activeSection } = useNavigationStore();

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <img src="/clefbuddylogo.jpg" alt="ClefBuddy Logo" className="h-12 w-12 mr-2 rounded" />
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">ClefBuddy</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <LayoutSection maxWidth="notation" padding={activeSection === 'notereader' ? 'none' : 'lg'}>
        <Suspense fallback={<LoadingFallback />}>
          {activeSection === 'dashboard' && <DashboardView />}
          {activeSection === 'notereader' && <NoteReaderView />}
          {activeSection === 'scales' && <ScalesView />}
          {activeSection === 'chords' && <ChordsView />}
          {activeSection === 'arpeggio' && <ArpeggiosView />}
          {activeSection === 'songs' && <SongsView />}
          {activeSection === 'theory' && <TheorieView />}
        </Suspense>
      </LayoutSection>

      {/* Footer */}
      <footer className="mt-6 pb-6 text-center text-neutral-400 dark:text-neutral-500 text-xs">
        ClefBuddy &copy; 2026
      </footer>
    </div>
  );
}

export default App;
