export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-5 tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

export function DiagramBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-2xl border border-neutral-300 p-8 my-6 flex justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{
        // Force light mode colors for SVG diagrams
        '--svg-notation-primary': '#1a1a1a',
        '--svg-notation-secondary': '#666666',
        '--svg-staff-line': '#333333',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-5 text-base">
      {children}
    </p>
  );
}
