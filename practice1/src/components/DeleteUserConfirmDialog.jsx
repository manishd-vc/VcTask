import { useId } from 'react'

/**
 * @param {{
 *   isOpen: boolean
 *   userName: string
 *   onCancel: () => void
 *   onConfirm: () => void
 * }} props
 */
export function DeleteUserConfirmDialog({ isOpen, userName, onCancel, onConfirm }) {
  const titleId = useId()
  const descId = useId()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h2
          id={titleId}
          className="text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          Delete user?
        </h2>
        <p id={descId} className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          This will remove <span className="font-medium text-slate-800 dark:text-slate-200">{userName}</span>{' '}
          from the table. This demo only uses local data.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete user
          </button>
        </div>
      </div>
    </div>
  )
}
