import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUsersContext } from '../context/usersContextBase'
import { PageHeading } from '../components/PageHeading'
import type { User } from '../types/user'

type UserEditFormProps = {
  user: User
}

function UserEditForm({ user: initial }: UserEditFormProps) {
  const navigate = useNavigate()
  const { updateUser } = useUsersContext()
  const [form, setForm] = useState<User>(() => structuredClone(initial))

  const setField = (path: string, value: string) => {
    setForm((prev) => {
      const next = structuredClone(prev) as User
      const parts = path.split('.')
      let cur: Record<string, unknown> = next as unknown as Record<
        string,
        unknown
      >
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]] as Record<string, unknown>
      }
      cur[parts[parts.length - 1]] = value
      return next
    })
  }

  const inputClass =
    'mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault()
        updateUser(form)
        navigate(`/users/${form.id}/view`)
      }}
    >
      <fieldset className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Profile
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-600">
            ID (read-only)
            <input
              className={`${inputClass} bg-slate-50`}
              readOnly
              value={String(form.id)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Name
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Username
            <input
              className={inputClass}
              value={form.username}
              onChange={(e) => setField('username', e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Email
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Phone
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Website
            <input
              className={inputClass}
              value={form.website}
              onChange={(e) => setField('website', e.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Address
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-600 sm:col-span-2">
            Street
            <input
              className={inputClass}
              value={form.address.street}
              onChange={(e) => setField('address.street', e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Suite
            <input
              className={inputClass}
              value={form.address.suite}
              onChange={(e) => setField('address.suite', e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            City
            <input
              className={inputClass}
              value={form.address.city}
              onChange={(e) => setField('address.city', e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Zip
            <input
              className={inputClass}
              value={form.address.zipcode}
              onChange={(e) => setField('address.zipcode', e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Latitude
            <input
              className={inputClass}
              value={form.address.geo.lat}
              onChange={(e) => setField('address.geo.lat', e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Longitude
            <input
              className={inputClass}
              value={form.address.geo.lng}
              onChange={(e) => setField('address.geo.lng', e.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Company
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-600 sm:col-span-2">
            Name
            <input
              className={inputClass}
              value={form.company.name}
              onChange={(e) => setField('company.name', e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600 sm:col-span-2">
            Catch phrase
            <input
              className={inputClass}
              value={form.company.catchPhrase}
              onChange={(e) =>
                setField('company.catchPhrase', e.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium text-slate-600 sm:col-span-2">
            BS
            <input
              className={inputClass}
              value={form.company.bs}
              onChange={(e) => setField('company.bs', e.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={() => navigate(`/users/${initial.id}/view`)}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Discard
        </button>
      </div>
    </form>
  )
}

export function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getUserById } = useUsersContext()

  const numericId = Number(id)
  const existing =
    Number.isFinite(numericId) ? getUserById(numericId) : undefined

  if (!existing) {
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
        title="Edit user"
        subtitle={existing.name}
        actions={
          <button
            type="button"
            onClick={() => navigate(`/users/${existing.id}/view`)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
        }
      />

      <UserEditForm key={existing.id} user={existing} />
    </div>
  )
}
