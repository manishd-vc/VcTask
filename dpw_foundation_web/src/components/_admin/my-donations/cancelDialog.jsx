// Import necessary components and utilities from Material UI and other libraries
import {
  Button, // Button component from Material UI
  Dialog, // Dialog component from Material UI for modal functionality
  DialogActions, // Actions container for dialog buttons
  DialogContent, // Content area of the dialog
  DialogTitle, // Title of the dialog
  IconButton, // Icon button component for clickable icons
  Typography, // Typography component for text styling
  useTheme // Hook to access the theme from Material UI
} from '@mui/material';
import PropTypes from 'prop-types';
// Import a custom styling object for the modal from a local component
import ModalStyle from 'src/components/dialog/dialog.style';

// Import the CloseIcon component to close the dialog
import { CloseIcon } from 'src/components/icons';

// Define the CancelDialog component which represents a confirmation modal
const CancelDialog = ({ open, onClose, onSubmit }) => {
  const theme = useTheme(); // Use the theme hook to access the theme object (e.g., colors, typography)
  const style = ModalStyle(theme); // Apply the modal-specific styles based on the theme

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Confirm
      </DialogTitle>
      {/* Icon button to close the dialog */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {/* Typography to display the confirmation message */}
        <Typography variant="body1" color="initial">
          Are you sure you want to perform this action?
        </Typography>
      </DialogContent>
      <DialogActions>
        {/* Button to proceed with the action */}
        <Button onClick={onSubmit} color="primary" variant="outlinedWhite">
          Proceed
        </Button>

        {/* Button to stay on the current page (cancel the action) */}
        <Button onClick={onClose} variant="contained" sx={{ ml: 'auto' }}>
          Stay on this page
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CancelDialog.propTypes = {
  // 'open' determines if the dialog is visible
  open: PropTypes.bool.isRequired,

  // 'onClose' is a callback function triggered when closing the dialog
  onClose: PropTypes.func.isRequired,

  // 'onSubmit' is a callback function triggered when confirming the cancel action
  onSubmit: PropTypes.func.isRequired
};
// Export the CancelDialog component for use in other parts of the application
export default CancelDialog;
