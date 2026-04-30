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
 * ApprovalEditDialog component renders a confirmation dialog.
 * It asks the user if they want to proceed with an action or stay on the current page.
 *
 * @param {Object} props - The props for the dialog component
 * @param {boolean} props.open - Controls the visibility of the dialog
 * @param {function} props.onClose - Callback function to close the dialog
 * @param {function} props.onSubmit - Callback function to proceed with the action
 * @returns {JSX.Element} Rendered dialog component
 */
const ApprovalEditDialog = ({ open, onClose, onSubmit, row }) => {
  const theme = useTheme();
  const style = ModalStyle(theme); // Apply custom modal styles
  const title = row?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign ';
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
          Are you sure you want to edit the {title} details? Once edited, the {title} will enter the approval process
          and will be hidden from the public portal until approval is granted.
        </Typography>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button
          onClick={onClose} // Action to proceed
          color="primary"
          variant="outlinedWhite"
        >
          Cancel
        </Button>

        <Button
          onClick={onSubmit} // Action to cancel and stay on the page
          variant="contained"
          sx={{ ml: 'auto' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ApprovalEditDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Validates 'open' as a required boolean
  onClose: PropTypes.func.isRequired, // Validates 'onClose' as a required function
  onSubmit: PropTypes.func.isRequired // Validates 'onSubmit' as a required function
};

export default ApprovalEditDialog;
