import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsersContext } from '../context/usersContextBase'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { PageHeading } from '../components/PageHeading'
import { UserCard } from '../components/UserCard'
import { DeleteUserConfirmDialog } from '../components/DeleteUserConfirmDialog'
import type { User } from '../types/user'

const PAGE_SIZE = 5

type UserListResultsProps = {
  filtered: User[]
}

function UserListResults({ filtered }: UserListResultsProps) {
  const navigate = useNavigate()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const { deleteUser } = useUsersContext()

  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  )

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length))
  }, [filtered.length])

  useEffect(() => {
    const root = scrollRef.current
    const el = sentinelRef.current
    if (!root || !el || visibleCount >= filtered.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { root, rootMargin: '80px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, visibleCount, filtered.length])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {visible.length === 0 ? (
        <p className="text-sm text-slate-600">No users match your search.</p>
      ) : (
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex w-full flex-col gap-4">
            {visible.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onView={() => navigate(`/users/${user.id}/view`)}
                onEdit={() => navigate(`/users/${user.id}/edit`)}
                onDelete={() => setDeleteTarget(user)}
              />
            ))}
            {visibleCount < filtered.length ? (
              <div ref={sentinelRef} className="h-2 w-full shrink-0" aria-hidden />
            ) : null}
          </div>
        </div>
      )}

      <DeleteUserConfirmDialog
        open={deleteTarget !== null}
        userName={deleteTarget?.name ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteUser(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}

export function UserListPage() {
  const { users, isRemoteLoading, isRemoteError, remoteError } =
    useUsersContext()

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.name.toLowerCase().includes(q))
  }, [users, debouncedSearch])

  if (isRemoteLoading && users.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-slate-600">Loading users…</p>
      </div>
    )
  }

  if (isRemoteError) {
    return (
      <div
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        role="alert"
      >
        {remoteError?.message ?? 'Could not load users.'}
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden">
      <div className="shrink-0">
        <PageHeading
          title="Users"
          subtitle="Search, view, and manage your local copy of the directory."
        />

        <div className="mb-6">
          <label htmlFor="user-search" className="sr-only">
            Search by name
          </label>
          <input
            id="user-search"
            type="search"
            placeholder="Search by name…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <UserListResults key={debouncedSearch} filtered={filtered} />
    </div>
  )
}
