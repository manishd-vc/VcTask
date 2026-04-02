export function UserCard({ user, onEdit, onDelete, busy }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {user.name}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
      <a
        href={`mailto:${user.email}`}
        className="mt-3 break-all text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        {user.email}
      </a>
      {user.phone ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{user.phone}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEdit(user)}
          disabled={busy}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(user)}
          disabled={busy}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
