import PropTypes from 'prop-types';
// mui
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
// icons
// api
import * as api from 'src/services';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

/**
 * DeleteDialog - A modal dialog for confirming the deletion of a user account.
 * It handles the deletion process and optional transfer of associated records to another user.
 *
 * @param {object} props - The props for the component.
 * @param {function} props.onClose - Function to close the modal.
 * @param {string} props.id - The ID of the user to be deleted.
 * @param {string} props.endPoint - The API endpoint for deleting the user (not used in the current implementation).
 * @param {string} props.type - The type of entity being deleted (not used in the current implementation).
 * @param {string} props.deleteMessage - The delete confirmation message (not used in the current implementation).
 * @returns {JSX.Element} - The DeleteDialog component.
 */
DeleteDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default function DeleteDialog({ onClose, id }) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();

  // State for decision flag and selected user for transferring records
  const [decisionFlag, setDecisionFlag] = useState('');
  const [destinationUserId, setDestinationUserId] = useState('');

  // Mutation for deleting the user
  const { mutate, isLoading } = useMutation(api.deleteBackOfficeUser, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      onClose();
      queryClient.invalidateQueries('user');
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  // Fetching the list of users to transfer records to
  const { data: roleMatchingList } = useQuery(['getRoleMatchingList', id], () => api.getRoleMatchingList(id), {
    enabled: decisionFlag === 'true', // Only fetch if decisionFlag is "true"
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  /**
   * handleDelete - Triggers the deletion of the user with the selected transfer options.
   * Sends the request with the source user, destination user, and the decision flag (whether to transfer records).
   */
  const handleDelete = () => {
    mutate({
      sourceUserId: id,
      destinationUserId: destinationUserId,
      decisionFlag: decisionFlag === 'true' // Convert decisionFlag string to boolean
    });
  };

  /**
   * handleSelectDecision - Updates the decisionFlag state when a radio button is selected.
   * @param {object} event - The event triggered by the radio button change.
   */
  const handleSelectDecision = (event) => {
    setDecisionFlag(event.target.value);
  };

  /**
   * handleOnChange - Updates the destinationUserId state when the user selects a destination user.
   * @param {object} event - The event triggered by the user selection.
   */
  const handleOnChange = (event) => {
    setDestinationUserId(event.target.value);
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
          Are you sure you want to delete the account?
        </Typography>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          There will be some records associated with this user. Do you want to transfer these activities to another user
          before deleting?
        </Typography>

        {/* Radio buttons for decision flag */}
        <FormControl fullWidth>
          <RadioGroup
            aria-labelledby="decision-radio-group-label"
            name="decision-radio-group"
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
              label="No - Delete the user and archive their records"
              sx={{ color: 'text.secondarydark' }}
            />
          </RadioGroup>
        </FormControl>

        {/* Only show the user selection if the decision is to transfer records */}
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
      <DialogActions>
        <Button variant="outlinedWhite" onClick={onClose}>
          No
        </Button>
        <LoadingButton
          disabled={decisionFlag === '' && !destinationUserId} // Disable if no decision or destination user selected
          variant="contained"
          loading={isLoading}
          onClick={handleDelete}
        >
          Yes
        </LoadingButton>
      </DialogActions>
    </>
  );
}
