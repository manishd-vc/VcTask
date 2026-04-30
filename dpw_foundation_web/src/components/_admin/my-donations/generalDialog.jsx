// WithdrawDialog.jsx
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

export default function GeneralDialog({ open, onClose, row, refetch, endpoint, textTitle, btnTitle, onSubmit }) {
  const theme = useTheme(); // Use the theme hook to access the theme object (e.g., colors, typography)
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const handleWithdraw = (id) => {
    const payload = {
      id: [id]
    };
    withDraw({ id, payload });
  };

  const { mutate: withDraw } = useMutation(api[endpoint], {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' })); // Show success toast message
      onClose();
      refetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' })); // Show error toast message
    }
  });
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        CONFIRM
      </DialogTitle>

      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Typography variant="body1" color="text.secondarydark">
          {textTitle}
        </Typography>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlinedWhite">
          Cancel
        </Button>
        <Button
          onClick={() => (onSubmit ? onSubmit(row) : handleWithdraw(row?.id))}
          variant="contained"
          sx={{ ml: 'auto' }}
        >
          {btnTitle || 'Yes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

GeneralDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  row: PropTypes.object.isRequired
};
