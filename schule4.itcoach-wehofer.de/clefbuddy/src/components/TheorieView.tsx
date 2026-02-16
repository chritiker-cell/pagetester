import { useState, type ComponentType } from 'react';
import { theoryContents, theoryOrder } from '../data/theoryContent';
import StaffClefsContent from './theory/StaffClefsContent';
import NoteValuesContent from './theory/NoteValuesContent';
import AccidentalsContent from './theory/AccidentalsContent';
import TimeSignaturesContent from './theory/TimeSignaturesContent';
import IntervalsContent from './theory/IntervalsContent';
import TriadsContent from './theory/TriadsContent';
import ArpeggiosContent from './theory/ArpeggiosContent';
import FingeringContent from './theory/FingeringContent';
import DynamicsContent from './theory/DynamicsContent';
import PedalsContent from './theory/PedalsContent';

const customContentRegistry: Record<string, ComponentType> = {
  'staff-clefs': StaffClefsContent,
  'note-values': NoteValuesContent,
  'accidentals': AccidentalsContent,
  'time-signatures': TimeSignaturesContent,
  'intervals': IntervalsContent,
  'triads': TriadsContent,
  'arpeggios': ArpeggiosContent,
  'fingering': FingeringContent,
  'dynamics': DynamicsContent,
  'pedals': PedalsContent,
};

interface TopicMeta {
  id: string;
  icon: string;
  color: string;
}

const topicMeta: Record<string, TopicMeta> = {
  'staff-clefs':     { id: 'staff-clefs',     icon: '🎼', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:border-blue-800 dark:hover:bg-blue-900/40' },
  'note-values':     { id: 'note-values',     icon: '🎵', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/40 dark:border-purple-800 dark:hover:bg-purple-900/40' },
  'accidentals':     { id: 'accidentals',     icon: '♯',  color: 'bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-800 dark:hover:bg-amber-900/40' },
  'time-signatures': { id: 'time-signatures', icon: '⏱',  color: 'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950/40 dark:border-green-800 dark:hover:bg-green-900/40' },
  'intervals':       { id: 'intervals',       icon: '↕',  color: 'bg-teal-50 border-teal-200 hover:bg-teal-100 dark:bg-teal-950/40 dark:border-teal-800 dark:hover:bg-teal-900/40' },
  'triads':          { id: 'triads',          icon: '🔶', color: 'bg-rose-50 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:border-rose-800 dark:hover:bg-rose-900/40' },
  'arpeggios':       { id: 'arpeggios',       icon: '🌊', color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:border-cyan-800 dark:hover:bg-cyan-900/40' },
  'fingering':       { id: 'fingering',       icon: '✋', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/40 dark:border-orange-800 dark:hover:bg-orange-900/40' },
  'dynamics':        { id: 'dynamics',        icon: '🔊', color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-800 dark:hover:bg-indigo-900/40' },
  'pedals':          { id: 'pedals',          icon: '🦶', color: 'bg-stone-50 border-stone-200 hover:bg-stone-100 dark:bg-stone-950/40 dark:border-stone-800 dark:hover:bg-stone-900/40' },
};

export default function TheorieView() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topic = selectedTopic ? theoryContents[selectedTopic] : null;
  if (topic) {
    const currentIndex = theoryOrder.indexOf(topic.id);
    const prevId = currentIndex > 0 ? theoryOrder[currentIndex - 1] : null;
    const nextId = currentIndex < theoryOrder.length - 1 ? theoryOrder[currentIndex + 1] : null;
    const CustomContent = topic.customContentId ? customContentRegistry[topic.customContentId] : null;

    return (
      <div className="max-w-3xl mx-auto py-6 px-4">
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Uebersicht
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{topicMeta[topic.id]?.icon}</span>
          <div>
            <span className="text-xs text-neutral-400 font-medium">
              {currentIndex + 1} / {theoryOrder.length}
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{topic.title}</h2>
          </div>
        </div>
        <p className="text-neutral-500 mb-8">{topic.subtitle}</p>

        {CustomContent ? (
          <CustomContent />
        ) : (
          <>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">{topic.intro}</p>

            <ul className="space-y-3 mb-8">
              {topic.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                  <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Praxis-Tipp</p>
                  <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed">{topic.tip}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
              <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3">So sieht das aus:</p>
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-8 text-center border border-dashed border-neutral-300 dark:border-neutral-600">
                <p className="text-neutral-400 text-sm">Interaktives Notenbeispiel folgt</p>
                <p className="text-neutral-300 dark:text-neutral-500 text-xs mt-2">{topic.exampleDescription}</p>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
          {prevId ? (
            <button
              onClick={() => setSelectedTopic(prevId)}
              className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              ← {theoryContents[prevId]?.title}
            </button>
          ) : <span />}
          {nextId ? (
            <button
              onClick={() => setSelectedTopic(nextId)}
              className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
            >
              {theoryContents[nextId]?.title} →
            </button>
          ) : <span />}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Musiktheorie</h2>
        <p className="text-neutral-500 mt-1">Die wichtigsten Grundlagen kurz erklaert. Waehle ein Thema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {theoryOrder.map((id, index) => {
          const content = theoryContents[id];
          const meta = topicMeta[id];
          if (!content || !meta) return null;

          return (
            <button
              key={id}
              onClick={() => setSelectedTopic(id)}
              className={`text-left p-5 rounded-xl border transition-all ${meta.color} group`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{meta.icon}</span>
                <div>
                  <span className="text-xs text-neutral-400 font-medium">{index + 1} / {theoryOrder.length}</span>
                  <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                    {content.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">{content.subtitle}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
