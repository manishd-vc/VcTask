import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

// mui
import { useTheme } from '@mui/material/styles';

/**
 * Providers Component
 * A wrapper component that integrates the ProgressBar and applies theme-based styling.
 *
 * @returns {JSX.Element} The Providers component that renders the ProgressBar with customized height and color.
 */
const Providers = () => {
  // Use MUI's theme hook to access theme variables
  const theme = useTheme();

  return (
    /**
     * ProgressBar Component
     * Displays a progress bar with a height of 3px and color based on the primary color from the theme.
     * The spinner is hidden, and shallow routing is enabled to minimize full-page reloads.
     *
     * @param {string} height - Specifies the height of the progress bar.
     * @param {string} color - The color of the progress bar, derived from the primary theme color.
     * @param {object} options - Options for the progress bar, including disabling the spinner.
     * @param {boolean} shallowRouting - Enables shallow routing to avoid full page reloads when navigating.
     */
    <ProgressBar
      height="3px" // Sets the progress bar's height to 3px
      color={theme.palette.primary.main} // Sets the color of the progress bar based on the theme's primary color
      options={{ showSpinner: false }} // Hides the spinner on the progress bar
      shallowRouting // Enables shallow routing to prevent full page reloads
    />
  );
};

export default Providers;
