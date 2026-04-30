import PropTypes from 'prop-types';
// mui components
import { LoadingButton } from '@mui/lab';
import { alpha, Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// icons
import { IoWarning } from 'react-icons/io5';
// api
import { useMutation } from 'react-query';
import * as api from 'src/services';

/**
 * ResetPasswordDialog - A dialog component for confirming and sending a password reset link.
 * @param {object} props - The component props.
 * @param {function} props.onClose - Callback to close the dialog.
 * @param {string} props.email - The email address for sending the reset link.
 * @returns {JSX.Element} - ResetPasswordDialog component.
 */
ResetPasswordDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired
};

export default function ResetPasswordDialog({ onClose, email }) {
  // Mutation hook for sending the password reset link
  const { mutate, isLoading } = useMutation(api.forgetPassword, {
    onSuccess: (response) => {
      // Dispatch success message and close the dialog
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      onClose();
    },
    onError: (err) => {
      // Dispatch error message if the mutation fails
      const message = JSON.stringify(err.response.data.message);
      dispatch(setToastMessage({ message: message ? JSON.parse(message) : 'Something went wrong!', variant: 'error' }));
    }
  });

  // Handler to trigger the password reset mutation
  const handleSend = () => {
    mutate({ email: email, origin: window.location.origin });
  };

  return (
    <>
      {/* Dialog title with warning icon */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1
        }}
      >
        <Box
          sx={{
            height: 40,
            width: 40,
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.2),
            borderRadius: '50px',
            color: (theme) => theme.palette.error.main,
            mr: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IoWarning size={24} />
        </Box>
        Warning
      </DialogTitle>

      {/* Dialog content with the confirmation message */}
      <DialogContent sx={{ pb: '16px !important' }}>
        <DialogContentText>Are you sure want to send the password reset link to your email?</DialogContentText>
      </DialogContent>

      {/* Dialog actions with "Cancel" and "Send" buttons */}
      <DialogActions sx={{ pt: '8px !important' }}>
        <Button onClick={onClose}> cancel </Button>
        {/* Button to trigger the password reset mutation */}
        <LoadingButton variant="contained" loading={isLoading} onClick={handleSend} color="error">
          Send
        </LoadingButton>
      </DialogActions>
    </>
  );
}
