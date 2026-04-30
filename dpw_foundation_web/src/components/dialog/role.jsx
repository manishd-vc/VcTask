/**
 * @file DeleteDialog.js
 * @description A dialog component for confirming role updates. It includes a warning icon, confirmation message,
 * and buttons to either cancel or confirm the update. The confirm button shows a loading state when processing.
 */

import React from 'react';
import PropTypes from 'prop-types';
// mui imports
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { LoadingButton } from '@mui/lab';

/**
 * DeleteDialog Component
 * @description A dialog box that asks the user to confirm the action of updating a user's role.
 * Includes a loading button that shows a progress indicator when the action is being processed.
 *
 * @param {Object} props - React props
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {function} props.onClose - Function to close the dialog when the "Cancel" button is clicked.
 * @param {function} props.onClick - Function to confirm and process the role update when the "Confirm" button is clicked.
 * @param {boolean} props.loading - Indicates if the action is being processed and should show the loading state.
 * @returns {JSX.Element} A dialog component with cancel and confirm buttons.
 */
export default function DeleteDialog({ onClose, open, onClick, loading }) {
  return (
    <Dialog onClose={onClose} open={open}>
      {/* Dialog title with a warning icon */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
        <WarningRoundedIcon sx={{ mr: 1 }} /> Update role
      </DialogTitle>

      {/* Dialog content containing the confirmation message */}
      <DialogContent>
        <DialogContentText>Are you sure to update the role for this user?</DialogContentText>
      </DialogContent>

      {/* Dialog actions with cancel and confirm buttons */}
      <DialogActions>
        {/* Cancel button that closes the dialog */}
        <Button onClick={onClose}>Cancel</Button>

        {/* Confirm button with a loading indicator */}
        <LoadingButton variant="contained" loading={loading} onClick={onClick}>
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

/**
 * PropTypes validation for DeleteDialog component
 * Ensures the required props are passed with the correct types.
 */
DeleteDialog.propTypes = {
  onClose: PropTypes.func.isRequired, // Function to close the dialog
  open: PropTypes.bool.isRequired, // Controls the visibility of the dialog
  onClick: PropTypes.func.isRequired, // Function to handle the confirmation action
  loading: PropTypes.bool.isRequired // Boolean indicating the loading state for the confirm button
};
