import { UserCard } from './UserCard'
import { ErrorMessage } from './ui/ErrorMessage'
import { Loader, UserGridSkeleton } from './ui/Loader'

export function UserList({
  isLoading,
  isFetching,
  error,
  onRetry,
  users,
  onEdit,
  onDelete,
  hasActiveSearch,
  busy,
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Loader label="Fetching users…" className="py-8" />
        <UserGridSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Could not load users"
        message={error.message || String(error)}
        onRetry={onRetry}
      />
    )
  }

  if (!users.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-900/40">
        <p className="text-slate-600 dark:text-slate-300">
          {hasActiveSearch
            ? 'No users match your search.'
            : 'No users to show.'}
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {isFetching ? (
        <p className="mb-3 text-center text-xs text-slate-500 dark:text-slate-400">Updating…</p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            busy={busy}
          />
        ))}
      </div>
    </div>
  )
}
