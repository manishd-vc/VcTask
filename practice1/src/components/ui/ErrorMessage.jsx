export function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center dark:border-red-900/50 dark:bg-red-950/40"
      role="alert"
    >
      <p className="font-medium text-red-900 dark:text-red-200">{title}</p>
      {message ? (
        <p className="mt-2 text-sm text-red-800/90 dark:text-red-300/90">{message}</p>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
