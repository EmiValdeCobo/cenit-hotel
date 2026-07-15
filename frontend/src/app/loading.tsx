export default function DashboardLoading() {
  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-8 bg-surface-variant/60 rounded-xl w-1/4"></div>
        <div className="h-4 bg-surface-variant/40 rounded-lg w-1/6"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card rounded-2xl p-6 h-36 space-y-4">
            <div className="h-6 bg-surface-variant/60 rounded w-1/3"></div>
            <div className="h-10 bg-surface-variant/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] h-[300px]">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6"></div>
        <div className="lg:col-span-1 glass-card rounded-2xl p-6"></div>
      </div>
    </main>
  );
}
