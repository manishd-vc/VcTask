/**
 * @file AdminDialog.js
 * @description A custom dialog component for displaying a welcome message and guiding users to register as an admin.
 * The dialog utilizes Material-UI components for styling and includes a close button, success icon, and registration button.
 */

'use client'; // Enables client-side rendering in Next.js
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import * as React from 'react';

// mui imports
import { IconButton, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';

// asset imports
import { SuccessPopupIcon } from 'src/assets';

// icon imports
import { IoClose } from 'react-icons/io5';

// style imports
import ModalStyle from './dialog.style';

/**
 * PropTypes validation for AdminDialog
 * @param {boolean} isOpen - Determines whether the dialog is open.
 */
AdminDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

/**
 * AdminDialog Component
 * @description Displays a styled dialog box with a welcome message and a call-to-action button to register as an admin.
 * The dialog dynamically responds to the `isOpen` prop.
 *
 * @param {Object} props - React props
 * @param {boolean} props.isOpen - Boolean flag to control the dialog's visibility.
 * @returns {JSX.Element} A dialog component.
 */
export default function AdminDialog({ isOpen }) {
  const [open, setOpen] = React.useState(false); // Local state to manage dialog visibility
  const router = useRouter(); // Next.js router for navigation
  const theme = useTheme(); // Access Material-UI theme
  const style = ModalStyle(theme); // Custom styles for the dialog

  /**
   * Closes the dialog without redirection
   */
  const handlePopupClose = () => {
    setOpen(false);
  };

  /**
   * Closes the dialog and redirects the user to the registration page
   */
  const handleClose = () => {
    router.push('/auth/register'); // Navigate to the register page
    setOpen(false);
  };

  /**
   * Effect to open the dialog when the `isOpen` prop changes
   */
  React.useEffect(() => {
    if (isOpen) {
      setOpen(true);
    }
  }, [isOpen]);

  return (
    <React.Fragment>
      {isOpen && (
        <Dialog
          open={open}
          keepMounted
          onClose={handlePopupClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            '& .MuiPaper-root': {
              display: 'flex',
              alignItems: 'center',
              padding: { md: 8, xs: 2 },
              background: theme.palette.background.paper,
              maxWidth: '535px !important',
              position: 'relative'
            }
          }}
        >
          {/* Close button */}
          <IconButton aria-label="close" sx={style.closeModal} onClick={handlePopupClose}>
            <IoClose />
          </IconButton>

          {/* Success icon */}
          <SuccessPopupIcon />

          {/* Dialog content */}
          <Stack spacing={2} sx={{ width: '100%', mt: 1 }}>
            <DialogTitle
              sx={{
                fontSize: 24,
                fontWeight: 700,
                padding: '0 !important',
                lineHeight: 0
              }}
              textAlign="center"
            >
              WELCOME TO DPW Foundation
            </DialogTitle>
            <Typography variant="body1" textAlign="center" color="GrayText">
              Attention: Please ensure all necessary environment variables are set.
            </Typography>

            {/* Dialog actions */}
            <DialogActions sx={{ width: '100% !important', padding: '0 !important' }}>
              <Button variant="contained" size="large" onClick={handleClose} fullWidth>
                Register as Admin
              </Button>
            </DialogActions>
          </Stack>
        </Dialog>
      )}
    </React.Fragment>
  );
}
