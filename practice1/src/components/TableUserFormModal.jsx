import { useId, useState } from 'react'

const emptyForm = { name: '', role: '', experience: '' }

function formFromUser(user) {
  if (user) {
    return {
      name: user.name ?? '',
      role: user.role ?? '',
      experience: String(user.experience ?? ''),
    }
  }
  return { ...emptyForm }
}

/**
 * @param {{
 *   isOpen: boolean
 *   onClose: () => void
 *   user: { id: number; name: string; role: string; experience: number } | null
 *   onSubmit: (values: { name: string; role: string; experience: number }) => void
 * }} props
 */
export function TableUserFormModal({ isOpen, onClose, user, onSubmit }) {
  const titleId = useId()
  const isEdit = Boolean(user)
  const [form, setForm] = useState(() => formFromUser(user))

  if (!isOpen) return null

  function handleSubmit(e) {
    e.preventDefault()
    const exp = Number(form.experience)
    if (!Number.isFinite(exp) || exp < 0) return
    onSubmit({
      name: form.name.trim(),
      role: form.role.trim(),
      experience: Math.floor(exp),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h2
          id={titleId}
          className="text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          {isEdit ? 'Edit user' : 'Add user'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {isEdit ? (
            <div>
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                ID
              </span>
              <p className="mt-1 text-slate-900 dark:text-slate-100">{user.id}</p>
            </div>
          ) : null}
          <div>
            <label
              htmlFor="table-user-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Name
            </label>
            <input
              id="table-user-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label
              htmlFor="table-user-role"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Role
            </label>
            <input
              id="table-user-role"
              required
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label
              htmlFor="table-user-exp"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Experience (years)
            </label>
            <input
              id="table-user-exp"
              type="number"
              required
              min={0}
              step={1}
              value={form.experience}
              onChange={(e) =>
                setForm((f) => ({ ...f, experience: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {isEdit ? 'Save changes' : 'Add user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
