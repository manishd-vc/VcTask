import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-100'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  ].join(' ')

/**
 * Shell for multiple assessment pages — add NavLinks here as you add routes.
 */
export function AppLayout() {
  return (
    <div className="min-h-svh flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Assessments
          </p>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Assessment pages">
            <NavLink to="/users" className={linkClass} end>
              User list
            </NavLink>
            <NavLink to="/to-do-operation" className={linkClass}>
              To-do operation
            </NavLink>
            <NavLink to="/table-data" className={linkClass}>
              Table data
            </NavLink>
          </nav>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
