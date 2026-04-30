import { Snackbar, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import { useDispatch, useSelector } from 'react-redux';
import { hideToastMessage } from 'src/redux/slices/common';

export default function Toaster() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { toastMessage } = useSelector((state) => state?.common);

  // State to track if the component has mounted on the client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Set hasMounted to true once the component mounts on the client
    setHasMounted(true);
  }, []);

  const handleCloseToast = () => {
    dispatch(hideToastMessage());
  };

  const getSnackbarBackgroundColor = (variant) => {
    const safeVariant = variant || 'success';
    switch (safeVariant) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.light;
    }
  };

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
        return '';
    }
  };

  // Only render the Snackbar if hasMounted is true (i.e., on the client)
  if (!hasMounted) {
    return null;
  }

  return (
    <Snackbar
      open={toastMessage?.show}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={5000}
      onClose={handleCloseToast}
      message={
        <>
          <Typography variant="subtitle3">{toastMessage?.title || getDefaultTitle(toastMessage?.variant)}</Typography>
          {toastMessage?.message}
        </>
      }
      sx={{
        '.MuiSnackbarContent-root': {
          backgroundColor: getSnackbarBackgroundColor(toastMessage?.variant)
        }
      }}
    />
  );
}
