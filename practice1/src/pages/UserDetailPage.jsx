import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AddEditModal } from '../components/AddEditModal'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Loader } from '../components/ui/Loader'
import { useUserDetail, useUserMutations } from '../hooks/useUsers'

export default function UserDetailPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const userQuery = useUserDetail(userId)
  const { updateMutation, deleteMutation } = useUserMutations()

  const [modalOpen, setModalOpen] = useState(false)

  const idNum = Number(userId)
  const invalidId = !Number.isFinite(idNum) || idNum <= 0

  const openEditModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const mutationBusy = updateMutation.isPending || deleteMutation.isPending
  const user = userQuery.data

  async function handleSave(values) {
    if (!user?.id) return
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        payload: values,
      })
      toast.success('User updated successfully')
      setModalOpen(false)
    } catch (err) {
      toast.error(err?.message ?? 'Something went wrong')
      throw err
    }
  }

  async function handleDelete() {
    if (!user?.id) return
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return
    try {
      await deleteMutation.mutateAsync(user.id)
      toast.success('User deleted successfully')
      navigate('/users', { replace: true })
    } catch (err) {
      toast.error(err?.message ?? 'Delete failed')
    }
  }

  if (invalidId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-slate-100 dark:bg-slate-950">
        <main className="mx-auto w-full max-w-2xl px-4 py-10">
          <ErrorMessage
            title="Invalid user link"
            message="This URL does not point to a valid user id."
          />
          <p className="mt-4">
            <Link
              to="/users"
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Back to users
            </Link>
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
          <p>
            <Link
              to="/users"
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              ← Users
            </Link>
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {userQuery.isSuccess ? user.name : 'User'}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Profile and actions (same edit modal and delete confirm as the list).
              </p>
            </div>
            {userQuery.isSuccess ? (
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openEditModal}
                  disabled={mutationBusy}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={mutationBusy}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <QueryErrorResetBoundary>
          {({ reset }) => {
            if (userQuery.isLoading) {
              return <Loader label="Loading user…" className="py-12" />
            }
            if (userQuery.isError) {
              return (
                <ErrorMessage
                  title="Could not load user"
                  message={userQuery.error?.message ?? String(userQuery.error)}
                  onRetry={() => {
                    reset()
                    userQuery.refetch()
                  }}
                />
              )
            }
            if (!user) return null
            return (
              <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <dl className="grid gap-4 sm:grid-cols-1">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Username
                    </dt>
                    <dd className="mt-1 text-slate-900 dark:text-slate-100">@{user.username}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${user.email}`}
                        className="break-all text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        {user.email}
                      </a>
                    </dd>
                  </div>
                  {user.phone ? (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Phone
                      </dt>
                      <dd className="mt-1 text-slate-900 dark:text-slate-100">{user.phone}</dd>
                    </div>
                  ) : null}
                  {user.website ? (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Website
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={
                            user.website.startsWith('http')
                              ? user.website
                              : `https://${user.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          {user.website}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            )
          }}
        </QueryErrorResetBoundary>
      </main>

      {user?.id ? (
        <AddEditModal
          key={modalOpen ? `edit-${user.id}` : `closed-${user.id}`}
          isOpen={modalOpen}
          onClose={() => {
            if (!mutationBusy) setModalOpen(false)
          }}
          user={user}
          onSubmit={handleSave}
          isPending={updateMutation.isPending}
        />
      ) : null}
    </div>
  )
}
