import { useId, useState } from 'react'

const emptyForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
}

function initialFormFromUser(user) {
  if (user?.id) {
    return {
      name: user.name ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      website: user.website ?? '',
    }
  }
  return { ...emptyForm }
}

export function AddEditModal({ isOpen, onClose, user, onSubmit, isPending }) {
  const titleId = useId()
  const isEdit = Boolean(user?.id)
  const [form, setForm] = useState(() => initialFormFromUser(user))

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    await onSubmit({
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      website: form.website.trim(),
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
        onClick={() => !isPending && onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h2 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {isEdit ? 'Edit user' : 'Add user'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Name
            </label>
            <input
              id="user-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="user-username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>
            <input
              id="user-username"
              required
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="user-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="user-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Phone
            </label>
            <input
              id="user-phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="user-website" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Website
            </label>
            <input
              id="user-website"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => !isPending && onClose()}
              disabled={isPending}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
