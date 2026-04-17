import { NavLink, Outlet } from 'react-router-dom'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-800'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

export function AppLayout() {
  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-56 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Dashboard
          </span>
          <p className="mt-1 text-base font-semibold text-slate-900">Users</p>
        </div>
        <nav className="flex-1 p-3" aria-label="Main">
          <NavLink to="/users" className={navClass} end={false}>
            Users
          </NavLink>
        </nav>
      </aside>
      <main className="h-full overflow-hidden pl-56">
        <div className="mx-auto box-border flex h-full max-w-6xl flex-col overflow-hidden px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
