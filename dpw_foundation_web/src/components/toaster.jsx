// Import required Material-UI components and hooks
import { Snackbar, Typography, useTheme } from '@mui/material';

// Import Redux hooks and actions
import { useDispatch, useSelector } from 'react-redux';
import { hideToastMessage } from 'src/redux/slices/common'; // Action to hide toast message from Redux store

/**
 * Toaster Component
 * A reusable component to display toast notifications using Material-UI's Snackbar.
 * This component integrates with Redux for state management.
 *
 * @returns {JSX.Element} A Material-UI Snackbar component configured to show toast messages.
 */
export default function Toaster() {
  // Get the dispatch function to trigger Redux actions
  const dispatch = useDispatch();

  // Access the Material-UI theme object for dynamic styling
  const theme = useTheme();

  // Retrieve the `toastMessage` object from the Redux store
  const { toastMessage } = useSelector((state) => state?.common);

  /**
   * Closes the toast notification.
   * Dispatches the `hideToastMessage` action to update the Redux store.
   */
  const handleCloseToast = () => {
    dispatch(hideToastMessage());
  };

  /**
   * Determines the background color of the Snackbar based on its variant.
   * @param {string} variant - The type of toast notification (e.g., 'success', 'error').
   * @returns {string} The corresponding background color from the Material-UI theme palette.
   */
  const getSnackbarBackgroundColor = (variant) => {
    const safeVariant = variant || 'success'; // Default to 'success' if no variant is provided
    switch (safeVariant) {
      case 'success':
        return theme.palette.success.main; // Green for success messages
      case 'error':
        return theme.palette.error.main; // Red for error messages
      case 'warning':
        return theme.palette.warning.main; // Yellow for warning messages
      case 'info':
        return theme.palette.info.main; // Blue for info messages
      default:
        return theme.palette.primary.light; // Default light color
    }
  };

  /**
   * Provides a default title for the toast message based on its variant.
   * @param {string} variant - The type of toast notification (e.g., 'success', 'error').
   * @returns {string} The default title for the variant.
   */
  const getDefaultTitle = (variant) => {
    switch (variant) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return ''; // Empty string for undefined variants
    }
  };

  // Render the Snackbar component
  return (
    <Snackbar
      // Open the Snackbar if `toastMessage.show` is true
      open={toastMessage?.show}
      // Position the Snackbar at the top-right corner
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      // Automatically close the Snackbar after 5000ms (5 seconds)
      autoHideDuration={5000}
      // Trigger the `handleCloseToast` function when the Snackbar is closed
      onClose={handleCloseToast}
      // Define the content to display within the Snackbar
      message={
        <>
          {/* Display the toast title or a default title based on its variant */}
          <Typography variant="subtitle3">{toastMessage?.title || getDefaultTitle(toastMessage?.variant)}</Typography>
          {/* Display the toast message */}
          {toastMessage?.message}
        </>
      }
      // Apply custom styles to the Snackbar
      sx={{
        '.MuiSnackbarContent-root': {
          // Set the background color dynamically based on the variant
          backgroundColor: getSnackbarBackgroundColor(toastMessage?.variant)
        }
      }}
    />
  );
}
