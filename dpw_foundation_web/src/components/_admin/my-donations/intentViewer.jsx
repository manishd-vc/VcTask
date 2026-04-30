// Importing necessary MUI components, custom style, and icons
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import ModalStyle from 'src/components/dialog/dialog.style'; // Import custom modal styles
import { CloseIcon } from 'src/components/icons'; // Import close icon
import IntentDetail from './intentDetail'; // Import custom component for displaying intent details

// IntentViewer component for viewing and pledging intent
const IntentViewer = ({ open, onClose, row }) => {
  // Accessing the theme object for theming support
  const theme = useTheme();

  // Generating custom styles for the modal using the current theme
  const style = ModalStyle(theme);

  return (
    // Dialog component to show a modal popup
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Dialog Title with custom text and styles */}
      <DialogTitle
        sx={{ textTransform: 'uppercase' }}
        id="customized-dialog-title"
        variant="h5"
        color="primary.main" // Sets title color to primary theme color
      >
        MAKE A PLEDGE
      </DialogTitle>

      {/* Close button for the dialog */}
      <IconButton
        aria-label="close"
        onClick={onClose} // Trigger onClose callback when clicked
        sx={style.closeModal} // Apply custom style for the close button
      >
        <CloseIcon /> {/* Custom CloseIcon component */}
      </IconButton>

      {/* Dialog Content */}
      <DialogContent>
        {/* Informational message inside the dialog */}
        <Typography variant="body1" color="text.secondarydark" mb={3}>
          Make a pledge of cash or in-kind donation and a rep from DPWF will reach you for further process
        </Typography>
        {/* IntentDetail component to display detailed data */}
        <IntentDetail data={row} /> {/* Passing the row data as a prop to IntentDetail */}
      </DialogContent>
    </Dialog>
  );
};

IntentViewer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.object.isRequired
};
export default IntentViewer;
