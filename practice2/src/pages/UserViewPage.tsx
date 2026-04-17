import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUsersContext } from '../context/usersContextBase'
import { PageHeading } from '../components/PageHeading'
import { DeleteUserConfirmDialog } from '../components/DeleteUserConfirmDialog'

export function UserViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getUserById, deleteUser } = useUsersContext()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const numericId = Number(id)
  const user = useMemo(
    () => (Number.isFinite(numericId) ? getUserById(numericId) : undefined),
    [getUserById, numericId],
  )

  if (!user) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center">
        <p className="font-medium text-amber-900">User not found</p>
        <Link
          to="/users"
          className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline"
        >
          Back to users
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <PageHeading
        title={user.name}
        subtitle={`ID ${user.id} · @${user.username}`}
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <Link
              to={`/users/${user.id}/edit`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Contact
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Detail label="Email" value={user.email} />
            <Detail label="Phone" value={user.phone} />
            <Detail label="Website" value={user.website} />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Address
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Detail label="Street" value={user.address.street} />
            <Detail label="Suite" value={user.address.suite} />
            <Detail label="City" value={user.address.city} />
            <Detail label="Zip" value={user.address.zipcode} />
            <Detail
              label="Geo"
              value={`${user.address.geo.lat}, ${user.address.geo.lng}`}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Company
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Detail label="Name" value={user.company.name} />
            <Detail label="Catch phrase" value={user.company.catchPhrase} />
            <Detail label="BS" value={user.company.bs} />
          </dl>
        </section>
      </div>

      <DeleteUserConfirmDialog
        open={deleteOpen}
        userName={user.name}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteUser(user.id)
          setDeleteOpen(false)
          navigate('/users')
        }}
      />
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-900">{value}</dd>
    </div>
  )
}
