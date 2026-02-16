/**
 * Shared icon button styles utility
 * Used across NoteReaderView, ScalesView, ArpeggiosView, ChordsView
 */

export type IconButtonCategory = 'primary' | 'toggle' | 'utility';

/**
 * Get Tailwind classes for icon buttons based on category and active state
 */
export function getIconButtonClasses(
  category: IconButtonCategory,
  active: boolean = false
): string {
  const base = 'p-2.5 rounded-lg transition-all duration-150';

  if (category === 'primary') {
    return `${base} ${active
      ? 'bg-primary-600 text-white shadow-md'
      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'}`;
  }

  if (category === 'toggle') {
    return `${base} ${active
      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-600'
      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'}`;
  }

  // utility
  return `${base} bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600`;
}
