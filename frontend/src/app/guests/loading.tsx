export default function TableSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-surface-variant/60 rounded-xl w-1/4"></div>
        <div className="h-4 bg-surface-variant/40 rounded-lg w-1/3"></div>
      </div>
      <div className="flex gap-4 w-full justify-between items-center">
        <div className="h-10 bg-surface-variant/50 rounded-xl w-1/3"></div>
        <div className="h-10 bg-surface-variant/50 rounded-xl w-32"></div>
      </div>
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="h-8 bg-surface-variant/60 rounded-lg"></div>
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="h-12 bg-surface-variant/30 rounded-lg"></div>
        ))}
      </div>
    </main>
  );
}
