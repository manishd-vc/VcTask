/* Core */
import { createLogger } from 'redux-logger';

/**
 * Middleware configuration for redux-logger.
 * @type {Array}
 * @property {Function} createLogger - Creates a logger middleware for Redux.
 * @returns {Array} The middleware array with redux-logger configuration.
 */
const middleware = [
  createLogger({
    duration: true, // Enables logging of action duration.
    timestamp: false, // Disables timestamp in the log.
    collapsed: true, // Collapses the logs for better readability.
    colors: {
      title: () => '#139BFE', // Color for the action title in the log.
      prevState: () => '#1C5FAF', // Color for the previous state in the log.
      action: () => '#149945', // Color for the action type in the log.
      nextState: () => '#A47104', // Color for the next state in the log.
      error: () => '#ff0005' // Color for errors in the log.
    },
    predicate: () => typeof window !== 'undefined' // Ensures logging only happens on the client-side (browser).
  })
];

export { middleware };
