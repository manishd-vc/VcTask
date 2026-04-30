import PropTypes from 'prop-types';
// mui
import { LoadingButton } from '@mui/lab';
import { Button, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useTheme } from '@mui/material';
// icons
// api
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as beneficiaryApi from 'src/services/beneficiary';
import * as grantManagementApi from 'src/services/grantManagement';
import * as reportApi from 'src/services/moduleService';
import * as partnerManagementApi from 'src/services/partner';
import * as volunteerApi from 'src/services/volunteer';

import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';
GeneralDialog.propTypes = {
  // 'onClose' is a function to handle closing the dialog
  onClose: PropTypes.func.isRequired,

  // 'id' is an identifier, likely a string or number
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  // 'refetch' is a function to trigger data refetch
  refetch: PropTypes.func.isRequired,

  // 'endPoint' is the API endpoint, which should be a string
  endPoint: PropTypes.string.isRequired,

  // 'deleteMessage' is the message displayed when deleting, should be a string
  deleteMessage: PropTypes.string.isRequired,

  // 'btnTitle' is the text for the button, should be a string
  btnTitle: PropTypes.string.isRequired,

  // new prop for cancel button
  cancelBtnTitle: PropTypes.string,
  // 'dialogTitle' is the title of the dialog, should be a string
  dialogTitle: PropTypes.string.isRequired
};
/**
 * GeneralDialog - A reusable dialog component for performing actions (e.g., delete) on a given entity.
 * This component takes care of showing a confirmation message and performing the action (like deleting) when confirmed.
 *
 * @param {object} props - The props for the component.
 * @param {function} props.onClose - Function to close the dialog.
 * @param {string} props.id - The ID of the entity to perform the action on.
 * @param {function} props.refetch - Function to refetch data after the action is performed.
 * @param {string} props.endPoint - The API endpoint for the mutation action (e.g., delete).
 * @param {string} props.deleteMessage - The message that explains the action to be performed (e.g., delete confirmation).
 * @param {string} [props.btnTitle] - Optional custom title for the confirmation button.
 * @param {string} [props.cancelBtnTitle] - Optional custom title for the Cancel button.
 * @param {string} props.dialogTitle - The title of the dialog.
 * @returns {JSX.Element} - The GeneralDialog component.
 */
export default function GeneralDialog({
  onClose,
  id,
  refetch,
  endPoint,
  deleteMessage,
  btnTitle,
  dialogTitle,
  payload,
  apiType,
  cancelBtnTitle
}) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();

  // Using react-query's useMutation hook to handle the mutation request
  const getSelectedApi = () => {
    if (apiType === 'GRANT') {
      return grantManagementApi;
    }
    if (apiType === 'PARTNER') {
      return partnerManagementApi;
    }
    if (apiType === 'VOLUNTEER') {
      return volunteerApi;
    }
    if (apiType === 'INKIND') {
      return beneficiaryApi;
    }
    if (apiType === 'REPORT') {
      return reportApi;
    }

    return api;
  };
  const selectedApi = getSelectedApi();
  const { isLoading, mutate } = useMutation(selectedApi[endPoint], {
    // onSuccess: Refetch data and close the dialog on success
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      refetch(); // Trigger the refetch function to reload the data
      onClose(); // Close the dialog after success
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'warning' }));
    } // No specific error handling is defined for now
  });

  // Function to handle the delete action by calling mutate with the entity id
  const handleDelete = () => {
    mutate({ slug: id, payload: payload, type: apiType }); // Call the mutation function with the id and payload
    onClose(); // Trigger the mutation with the provided id
  };

  return (
    <>
      {/* Dialog title */}
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        {dialogTitle}
      </DialogTitle>

      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      {/* Dialog content with the delete message */}
      <DialogContent>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          {deleteMessage}
        </Typography>
      </DialogContent>

      {/* Dialog actions (buttons) */}
      <DialogActions>
        {/* Cancel button to close the dialog */}
        <Button onClick={onClose} variant="outlinedWhite">
          {cancelBtnTitle || 'No'}
        </Button>

        {/* Delete button to confirm the action */}
        <LoadingButton
          variant="contained"
          loading={isLoading} // Show loading state when the mutation is in progress
          onClick={handleDelete} // Trigger the delete action
        >
          {btnTitle || 'Yes'} {/* Custom button title if provided, else default to 'Yes' */}
        </LoadingButton>
      </DialogActions>
    </>
  );
}
