export default function GridSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-surface-variant/60 rounded-xl w-1/4"></div>
        <div className="h-4 bg-surface-variant/40 rounded-lg w-1/3"></div>
      </div>
      <div className="h-10 bg-surface-variant/50 rounded-xl w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="glass-card rounded-2xl p-6 h-48 space-y-4">
            <div className="h-6 bg-surface-variant/60 rounded w-2/3"></div>
            <div className="h-4 bg-surface-variant/45 rounded w-1/2"></div>
            <div className="border-t border-surface-variant/30 pt-3 space-y-2">
              <div className="h-4 bg-surface-variant/30 rounded"></div>
              <div className="h-4 bg-surface-variant/30 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
