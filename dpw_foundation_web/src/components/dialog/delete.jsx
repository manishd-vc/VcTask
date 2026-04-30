/**
 * @file DeleteDialog.js
 * @description This component renders a dialog that confirms the deletion of a user account.
 * It handles the decision to either transfer the user's associated records to another user or to delete the user and archive their records.
 */

import PropTypes from 'prop-types';
// MUI components
import { LoadingButton } from '@mui/lab';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
// Icons
import { CloseIcon } from '../icons';
// API calls
import * as api from 'src/services';
// React hooks and Redux
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
// Styles
import ModalStyle from './dialog.style';

DeleteDialog.propTypes = {
  onClose: PropTypes.func.isRequired, // Function to close the dialog
  id: PropTypes.string.isRequired // User ID to delete
};

/**
 * Component for the Delete Dialog
 * Handles user deletion with optional record transfer to another user.
 */
export default function DeleteDialog({ onClose, id }) {
  const queryClient = useQueryClient(); // React-query client for data fetching and cache invalidation
  const theme = useTheme(); // Access to Material UI theme for styling
  const style = ModalStyle(theme); // Custom modal styles
  const dispatch = useDispatch(); // Redux dispatch for toast notifications
  const [decisionFlag, setDecisionFlag] = useState(''); // State to track the user's decision (transfer records or delete)
  const [destinationUserId, setDestinationUserId] = useState(''); // State for the user ID to transfer records to

  // Mutation to handle user deletion with transfer option
  const { mutate, isLoading } = useMutation(api.deleteBackOfficeUser, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' })); // Show success toast message
      onClose(); // Close the dialog
      queryClient.invalidateQueries('user'); // Invalidate the 'user' query to refresh data
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' })); // Show error toast message
    }
  });

  // Query to fetch the list of users to transfer records to, only if decisionFlag is 'true'
  const { data: roleMatchingList } = useQuery(['getRoleMatchingList', id], () => api.getRoleMatchingList(id), {
    enabled: decisionFlag === 'true', // Only fetch if the user chooses to transfer records
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error toast message if fetching fails
    }
  });

  // Function to handle the deletion process based on the decision
  const handleDelete = () => {
    mutate({
      sourceUserId: id,
      destinationUserId: destinationUserId,
      decisionFlag: decisionFlag === 'true'
    });
  };

  // Handle the user's decision on whether to transfer records
  const handleSelectDecision = (event) => {
    setDecisionFlag(event.target.value);
  };

  // Handle the change in destination user selection
  const handleOnChange = (event) => {
    setDestinationUserId(event.target.value);
  };

  return (
    <>
      {/* Dialog Title */}
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Confirm
      </DialogTitle>

      {/* Close Icon Button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      {/* Dialog Content */}
      <DialogContent>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          Are you sure you want to delete the account ?
        </Typography>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          There will be some records associated with this user, do you want to transfer these activities to another user
          before deleting this user?
        </Typography>

        {/* Radio Group for decision */}
        <FormControl fullWidth>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={decisionFlag}
            onChange={handleSelectDecision}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Yes, I want to transfer the associated records to another user"
              sx={{ color: 'text.secondarydark' }}
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="No - Delete the users and archive their records"
              sx={{ color: 'text.secondarydark' }}
            />
          </RadioGroup>
        </FormControl>

        {/* User Selection for record transfer (only shown if decisionFlag is 'true') */}
        {decisionFlag === 'true' && (
          <TextField
            select
            label="Select user to transfer associated records"
            value={destinationUserId}
            fullWidth
            required
            onChange={handleOnChange}
            variant="standard"
          >
            {roleMatchingList?.map((role) => (
              <MenuItem value={role?.id} key={role?.id}>
                {role?.firstName + ' ' + role?.lastName}
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>

      {/* Dialog Actions (buttons) */}
      <DialogActions>
        <Button variant="outlinedWhite" onClick={onClose}>
          No
        </Button>
        <LoadingButton
          disabled={decisionFlag === '' && !destinationUserId} // Disable button if no decision or user is selected
          variant="contained"
          loading={isLoading} // Show loading state during the API call
          onClick={handleDelete}
          color="error"
        >
          Yes
        </LoadingButton>
      </DialogActions>
    </>
  );
}
