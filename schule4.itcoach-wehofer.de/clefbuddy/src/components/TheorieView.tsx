import { useState } from 'react';
import { theoryContents, theoryOrder } from '../data/theoryContent';

interface TopicMeta {
  id: string;
  icon: string;
  color: string;
}

const topicMeta: Record<string, TopicMeta> = {
  'staff-clefs':     { id: 'staff-clefs',     icon: '🎼', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  'note-values':     { id: 'note-values',     icon: '🎵', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
  'accidentals':     { id: 'accidentals',     icon: '♯',  color: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  'time-signatures': { id: 'time-signatures', icon: '⏱',  color: 'bg-green-50 border-green-200 hover:bg-green-100' },
  'intervals':       { id: 'intervals',       icon: '↕',  color: 'bg-teal-50 border-teal-200 hover:bg-teal-100' },
  'triads':          { id: 'triads',          icon: '🔶', color: 'bg-rose-50 border-rose-200 hover:bg-rose-100' },
  'arpeggios':       { id: 'arpeggios',       icon: '🌊', color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100' },
  'fingering':       { id: 'fingering',       icon: '✋', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
  'dynamics':        { id: 'dynamics',        icon: '🔊', color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
  'pedals':          { id: 'pedals',          icon: '🦶', color: 'bg-stone-50 border-stone-200 hover:bg-stone-100' },
};

export default function TheorieView() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topic = selectedTopic ? theoryContents[selectedTopic] : null;
  if (topic) {
    const currentIndex = theoryOrder.indexOf(topic.id);
    const prevId = currentIndex > 0 ? theoryOrder[currentIndex - 1] : null;
    const nextId = currentIndex < theoryOrder.length - 1 ? theoryOrder[currentIndex + 1] : null;

    return (
      <div className="max-w-3xl mx-auto py-6 px-4">
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors"
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
            <h2 className="text-2xl font-bold text-neutral-900">{topic.title}</h2>
          </div>
        </div>
        <p className="text-neutral-500 mb-8">{topic.subtitle}</p>

        <p className="text-neutral-700 leading-relaxed mb-6">{topic.intro}</p>

        <ul className="space-y-3 mb-8">
          {topic.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
              <span className="text-neutral-700 leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Praxis-Tipp</p>
              <p className="text-amber-900 text-sm leading-relaxed">{topic.tip}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <p className="text-sm font-semibold text-neutral-600 mb-3">So sieht das aus:</p>
          <div className="bg-neutral-50 rounded-lg p-8 text-center border border-dashed border-neutral-300">
            <p className="text-neutral-400 text-sm">Interaktives Notenbeispiel folgt</p>
            <p className="text-neutral-300 text-xs mt-2">{topic.exampleDescription}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          {prevId ? (
            <button
              onClick={() => setSelectedTopic(prevId)}
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              ← {theoryContents[prevId]?.title}
            </button>
          ) : <span />}
          {nextId ? (
            <button
              onClick={() => setSelectedTopic(nextId)}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
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
        <h2 className="text-2xl font-bold text-neutral-900">Musiktheorie</h2>
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
                  <h3 className="text-base font-semibold text-neutral-800 mt-0.5 group-hover:text-neutral-900">
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
