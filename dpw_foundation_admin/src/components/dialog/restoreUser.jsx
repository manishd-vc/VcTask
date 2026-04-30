import { LoadingButton } from '@mui/lab';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

RestoreUser.propTypes = {
  // 'id' is either a string or number, representing the role's identifier
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  // 'handleClose' is a function to close the dialog or perform some action
  onClose: PropTypes.func.isRequired
};
/**
 * RestoreUser - A dialog component for confirming the restoration of a user.
 * @param {object} props - The component props.
 * @param {number} props.id - The ID of the user to restore.
 * @param {function} props.onClose - Callback to close the dialog.
 * @returns {JSX.Element} - RestoreUser component.
 */
export default function RestoreUser({ id, onClose, isExternalUser = false, refetch }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const queryClient = useQueryClient();

  // Mutation hook for restoring the user
  const { mutate, isLoading } = useMutation(api.restoreUser, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      onClose();
      refetch();
      // Dispatch success message and invalidate queries
      queryClient.invalidateQueries('user');
    },
    onError: (error) => {
      // Dispatch error message if the mutation fails
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: externalUser, isLoading: externalUserLoading } = useMutation(api.restoreExternalUser, {
    onSuccess: (response) => {
      refetch();
      // Dispatch success message and invalidate queries
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      onClose();
    },
    onError: (error) => {
      // Dispatch error message if the mutation fails
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const handleSubmit = () => {
    if (isExternalUser) {
      externalUser(id);
    } else {
      mutate({ id });
    }
  };

  return (
    <>
      {/* Dialog title with uppercase text */}
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Confirm
      </DialogTitle>

      {/* Close button for the dialog */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      {/* Dialog content with the confirmation message */}
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" color="text.secondarydark">
            Are you sure you want to restore this user?
          </Typography>
        </DialogContentText>
      </DialogContent>

      {/* Dialog actions with "No" and "Yes" buttons */}
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          No
        </Button>
        {/* Button to trigger the restore user mutation */}
        <LoadingButton
          loading={isExternalUser ? externalUserLoading : isLoading}
          onClick={handleSubmit}
          variant="contained"
        >
          Yes
        </LoadingButton>
      </DialogActions>
    </>
  );
}
