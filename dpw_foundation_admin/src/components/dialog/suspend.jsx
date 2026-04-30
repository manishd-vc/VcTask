import { LoadingButton } from '@mui/lab';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

SuspendDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  confirmText: PropTypes.string.isRequired,
  isDelete: PropTypes.bool
};

export default function SuspendDialog({ onClose, id, refetch, confirmText, isDelete = false }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [reason, setReason] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { mutate, isLoading } = useMutation(api.suspendUser, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      onClose();
      refetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(api.deleteExternalUser, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      onClose();
      refetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const handleSubmit = () => {
    const payload = {
      sourceUserId: id,
      reason,
      updatedBy: user?.userId
    };
    if (isDelete) {
      deleteMutate(payload);
    } else {
      mutate(payload);
    }
  };

  return (
    <>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Confirm
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          {confirmText}
        </Typography>

        <TextField
          label={isDelete ? 'Delete Reason' : 'Suspension Reason'}
          fullWidth
          variant="standard"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlinedWhite" onClick={onClose}>
          No
        </Button>
        <LoadingButton
          disabled={!reason}
          loading={isDelete ? deleteLoading : isLoading}
          variant="contained"
          onClick={handleSubmit}
        >
          Yes
        </LoadingButton>
      </DialogActions>
    </>
  );
}
