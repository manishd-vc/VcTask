import { useMemo, useState } from 'react'
import { DeleteUserConfirmDialog } from '../components/DeleteUserConfirmDialog'
import { TableUserFormModal } from '../components/TableUserFormModal'
import { MOCK_TABLE_USERS } from '../data/mockTableUsers'

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

export default function TableDataPage() {
  const [users, setUsers] = useState(() => [...MOCK_TABLE_USERS])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [addModalKey, setAddModalKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return users.slice(start, start + pageSize)
  }, [users, currentPage, pageSize])

  const rangeStart = users.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const rangeEnd = users.length === 0 ? 0 : Math.min(currentPage * pageSize, users.length)

  function openAdd() {
    setEditingUser(null)
    setAddModalKey((k) => k + 1)
    setFormOpen(true)
  }

  function openEdit(user) {
    setEditingUser(user)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingUser(null)
  }

  function handleFormSubmit(values) {
    if (editingUser) {
      setUsers((list) =>
        list.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: values.name, role: values.role, experience: values.experience }
            : u,
        ),
      )
    } else {
      setUsers((list) => {
        const id =
          list.length === 0 ? 1 : Math.max(...list.map((u) => u.id)) + 1
        return [...list, { id, ...values }]
      })
    }
    closeForm()
  }

  function confirmDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setUsers((list) => list.filter((u) => u.id !== id))
    setDeleteTarget(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Table data
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Mock dataset with pagination and local add / edit / delete.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Add user
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="shrink-0 font-medium">Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing{' '}
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {rangeStart}–{rangeEnd}
              </span>{' '}
              of <span className="font-medium text-slate-900 dark:text-slate-200">{users.length}</span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[640px] table-fixed text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 w-[7%]">
                  ID
                </th>
                <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 w-[28%]">
                  Name
                </th>
                <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 w-[30%]">
                  Role
                </th>
                <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 w-[15%]">
                  Experience
                </th>
                <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 w-[20%] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    No rows on this page.
                  </td>
                </tr>
              ) : (
                pageSlice.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
                  >
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{user.role}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {user.experience} {user.experience === 1 ? 'yr' : 'yrs'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(user)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                          aria-label={`Edit ${user.name}`}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                          aria-label={`Delete ${user.name}`}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <nav
          className="mt-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center"
          aria-label="Pagination"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Page{' '}
            <span className="font-medium text-slate-900 dark:text-slate-200">{currentPage}</span> of{' '}
            <span className="font-medium text-slate-900 dark:text-slate-200">{totalPages}</span>
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                setPage((p) => {
                  const at = Math.min(Math.max(1, p), totalPages)
                  return Math.max(1, at - 1)
                })
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((p) => {
                  const at = Math.min(Math.max(1, p), totalPages)
                  return Math.min(totalPages, at + 1)
                })
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </nav>
      </main>

      <TableUserFormModal
        key={editingUser ? `edit-${editingUser.id}` : `add-${addModalKey}`}
        isOpen={formOpen}
        onClose={closeForm}
        user={editingUser}
        onSubmit={handleFormSubmit}
      />

      <DeleteUserConfirmDialog
        isOpen={Boolean(deleteTarget)}
        userName={deleteTarget?.name ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
