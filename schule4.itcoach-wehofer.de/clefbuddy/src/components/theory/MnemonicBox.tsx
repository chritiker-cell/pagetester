interface MnemonicBoxProps {
  title: string;
  children: React.ReactNode;
  variant?: 'blue' | 'green';
}

export default function MnemonicBox({ title, children, variant = 'blue' }: MnemonicBoxProps) {
  const colors = variant === 'blue'
    ? 'bg-neutral-100 border-neutral-300 dark:bg-neutral-800/50 dark:border-neutral-700'
    : 'bg-neutral-100 border-neutral-300 dark:bg-neutral-800/50 dark:border-neutral-700';
  const titleColor = variant === 'blue'
    ? 'text-neutral-900 dark:text-neutral-100'
    : 'text-neutral-900 dark:text-neutral-100';
  const iconColor = variant === 'blue'
    ? 'text-neutral-600 dark:text-neutral-400'
    : 'text-neutral-600 dark:text-neutral-400';
  const icon = variant === 'blue' ? '♪' : '♫';

  return (
    <div className={`rounded-xl border p-5 ${colors} shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start gap-3">
        <span className={`text-2xl leading-none ${iconColor} mt-0.5`}>{icon}</span>
        <div className="flex-1">
          <p className={`text-sm font-semibold mb-2.5 ${titleColor} tracking-wide`}>{title}</p>
          <div className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
