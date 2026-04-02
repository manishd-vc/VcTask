import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info.componentStack)
  }

  handleReset() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-slate-50 px-4 dark:bg-slate-950">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Something went wrong
          </h1>
          <p className="max-w-md text-center text-sm text-slate-600 dark:text-slate-400">
            {this.state.error?.message || 'An unexpected error occurred in the UI.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
