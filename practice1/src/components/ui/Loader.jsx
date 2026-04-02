export function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"
        aria-hidden
      />
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  )
}

/** Placeholder grid while the users query resolves */
export function UserGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/50"
        />
      ))}
    </div>
  )
}
