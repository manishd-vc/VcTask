/* Core */
import { createLogger } from 'redux-logger';

/**
 * Middleware configuration for logging Redux actions and state changes.
 * This middleware logs each action and the resulting state changes in the console.
 * The logging behavior is customizable through options like `duration`, `timestamp`, and `colors`.
 */
const middleware = [
  createLogger({
    // Enable action duration logging to show how long each action takes to process
    duration: true,

    // Disable logging of timestamps for each action
    timestamp: false,

    // Collapse the logged actions for cleaner output in the console
    collapsed: true,

    // Custom colors for different parts of the log:
    // - title: Action type in blue
    // - prevState: Previous state in dark blue
    // - action: Action in green
    // - nextState: Next state in orange
    // - error: Errors in red
    colors: {
      title: () => '#139BFE',
      prevState: () => '#1C5FAF',
      action: () => '#149945',
      nextState: () => '#A47104',
      error: () => '#ff0005'
    },

    // Only enable logging in the browser environment (avoid logging during SSR)
    predicate: () => typeof window !== 'undefined'
  })
];

export { middleware };
