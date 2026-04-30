import PropTypes from 'prop-types';
// mui
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

/**
 * DeleteDialog - A dialog component for confirming role updates.
 * @param {object} props - The component props.
 * @param {function} props.onClose - Callback to close the dialog.
 * @param {boolean} props.open - Boolean to control the visibility of the dialog.
 * @param {function} props.onClick - Callback to confirm the action.
 * @param {boolean} props.loading - Boolean to control the loading state of the button.
 * @returns {JSX.Element} - DeleteDialog component.
 */
export default function DeleteDialog({ onClose, open, onClick, loading }) {
  return (
    <Dialog onClose={onClose} open={open}>
      {/* Dialog title with warning icon */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
        <WarningRoundedIcon sx={{ mr: 1 }} /> Update role
      </DialogTitle>

      {/* Dialog content with confirmation message */}
      <DialogContent>
        <DialogContentText>Are you sure want to update the role for this user.</DialogContentText>
      </DialogContent>

      {/* Dialog actions with Cancel and Confirm buttons */}
      <DialogActions>
        <Button onClick={onClose}> cancel </Button>
        {/* Loading button to trigger the confirmation action */}
        <LoadingButton variant="contained" loading={loading} onClick={onClick}>
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

// Prop validation for the component
DeleteDialog.propTypes = {
  onClose: PropTypes.func.isRequired, // Function to close the dialog
  open: PropTypes.bool.isRequired, // Boolean to control dialog visibility
  onClick: PropTypes.func.isRequired, // Function to handle the confirmation click
  loading: PropTypes.bool.isRequired // Boolean to indicate loading state of the button
};
