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
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
/**
 * CancelDialog component renders a confirmation dialog.
 * It asks the user if they want to proceed with an action or stay on the current page.
 *
 * @param {Object} props - The props for the dialog component
 * @param {boolean} props.open - Controls the visibility of the dialog
 * @param {function} props.onClose - Callback function to close the dialog
 * @param {function} props.onSubmit - Callback function to proceed with the action
 * @returns {JSX.Element} Rendered dialog component
 */
const CancelDialog = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const style = ModalStyle(theme); // Apply custom modal styles

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Confirm
      </DialogTitle>

      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Typography variant="body1" color="text.secondarydark">
          Are you sure you want to perform this action?
        </Typography>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button
          onClick={onSubmit} // Action to proceed
          color="primary"
          variant="outlinedWhite"
        >
          Proceed
        </Button>

        <Button
          onClick={onClose} // Action to cancel and stay on the page
          variant="contained"
          sx={{ ml: 'auto' }}
        >
          Stay on this page
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CancelDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Validates 'open' as a required boolean
  onClose: PropTypes.func.isRequired, // Validates 'onClose' as a required function
  onSubmit: PropTypes.func.isRequired // Validates 'onSubmit' as a required function
};

export default CancelDialog;
