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
RestoreRole.propTypes = {
  // 'id' is either a string or number, representing the role's identifier
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  // 'handleClose' is a function to close the dialog or perform some action
  handleClose: PropTypes.func.isRequired
};
/**
 * RestoreRole - A dialog component for confirming the restoration of a role.
 * @param {object} props - The component props.
 * @param {number} props.id - The ID of the role to restore.
 * @param {function} props.handleClose - Callback to close the dialog.
 * @returns {JSX.Element} - RestoreRole component.
 */
export default function RestoreRole({ id, handleClose }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const queryClient = useQueryClient();

  // Mutation hook for restoring the role
  const { mutate, isLoading } = useMutation(api.restoreRoles, {
    onSuccess: (response) => {
      // Dispatch success message and invalidate queries
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      handleClose();
      queryClient.invalidateQueries('userRoles');
    },
    onError: (error) => {
      // Dispatch error message if the mutation fails
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  return (
    <>
      {/* Dialog title with uppercase text */}
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Confirm
      </DialogTitle>

      {/* Close button for the dialog */}
      <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      {/* Dialog content with the confirmation message */}
      <DialogContent sx={{ pb: '16px !important' }}>
        <DialogContentText>
          <Typography variant="body1" color="text.secondarydark">
            Are you sure you want to restore this role?
          </Typography>
        </DialogContentText>
      </DialogContent>

      {/* Dialog actions with "No" and "Yes" buttons */}
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          No
        </Button>
        {/* Button to trigger the restore role mutation */}
        <LoadingButton loading={isLoading} onClick={() => mutate({ id })} variant="contained">
          Yes
        </LoadingButton>
      </DialogActions>
    </>
  );
}
