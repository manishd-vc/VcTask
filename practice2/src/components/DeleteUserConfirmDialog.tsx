import { useEffect, useRef } from 'react'

type DeleteUserConfirmDialogProps = {
  open: boolean
  userName: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteUserConfirmDialog({
  open,
  userName,
  onClose,
  onConfirm,
}: DeleteUserConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) {
      if (!el.open) el.showModal()
    } else {
      el.close()
    }
  }, [open])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const onCancel = () => onClose()
    el.addEventListener('cancel', onCancel)
    return () => el.removeEventListener('cancel', onCancel)
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      className="fixed left-1/2 top-1/2 z-1000 m-0 box-border w-[min(calc(100vw-2rem),28rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-0 shadow-xl"
      onClose={onClose}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-900">Delete user</h2>
        <p className="mt-2 text-sm text-slate-600">
          Remove <span className="font-medium text-slate-800">{userName}</span>{' '}
          from the list? This only updates local data.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            onClick={() => onConfirm()}
          >
            Delete
          </button>
        </div>
      </div>
    </dialog>
  )
}
