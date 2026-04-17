import type { User } from '../types/user'

type UserCardProps = {
  user: User
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function UserCard({ user, onView, onEdit, onDelete }: UserCardProps) {
  return (
    <article className="flex w-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-slate-500">ID</dt>
            <dd className="text-slate-800">{user.id}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-slate-500">Company</dt>
            <dd className="text-slate-800">{user.company.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-slate-500">Email</dt>
            <dd className="truncate text-slate-800" title={user.email}>
              {user.email}
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onView}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-200"
        >
          View
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
