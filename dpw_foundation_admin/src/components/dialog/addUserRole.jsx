import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import * as api from 'src/services';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';
AddUserRole.propTypes = {
  // 'open' is a boolean indicating if the modal or form is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a function to handle closing the modal or form
  onClose: PropTypes.func.isRequired,

  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};
/**
 * AddUserRole - A dialog component for adding or editing users assigned to a role.
 * This component allows users to select multiple users from a list and assign them to a role.
 *
 * @param {object} props - The props for the component.
 * @param {boolean} props.open - A flag to indicate if the dialog is open.
 * @param {function} props.onClose - Function to close the dialog.
 * @param {boolean} props.isEdit - Flag to check if the dialog is in edit mode.
 * @returns {JSX.Element} - The AddUserRole component.
 */
export default function AddUserRole({ open, onClose, isEdit }) {
  const theme = useTheme(); // Get the theme object for styling
  const { setFieldValue, values } = useFormikContext(); // Access Formik context for form state management
  const [userList, setUserList] = useState([]); // State to store the list of users
  const [temporarySelection, setTemporarySelection] = useState([]); // State to temporarily store the selected users
  const style = ModalStyle(theme); // Use custom styles

  // Fetch the list of users using react-query
  const { isLoading } = useQuery(['user'], () => api.getUsersList(''), {
    onSuccess: (response) => {
      // On successful fetch, set the user list
      setUserList(response?.data?.content);
    }
  });

  // Set the initial selection for editing an existing role
  useEffect(() => {
    if (values.assignedUserList?.length) {
      setTemporarySelection(values.assignedUserList); // Prefill selected users when in edit mode
    } else {
      setTemporarySelection([]); // Clear temporary selection if no users assigned
    }
  }, [values.assignedUserList]);

  /**
   * handleClose - Handles the closing of the dialog and resets the form state if not in edit mode.
   */
  const handleClose = () => {
    if (!isEdit) {
      setFieldValue('assignedUserList', []); // Clear assigned user list if not in edit mode
    }
    setTemporarySelection([]); // Reset temporary selection
    onClose(); // Close the dialog
  };

  /**
   * handleAddOrEdit - Updates the form field with the selected users and closes the dialog.
   */
  const handleAddOrEdit = () => {
    setFieldValue('assignedUserList', temporarySelection); // Persist selected users to Formik state
    setTemporarySelection([]); // Clear temporary selection after saving
    onClose(); // Close the dialog
  };

  return (
    <Dialog onClose={onClose} open={open}>
      {/* Dialog title */}
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        Add User to Role
      </DialogTitle>

      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      {/* Dialog content */}
      <DialogContent sx={{ pt: 1.5 }}>
        {/* Display the count of selected users */}
        {Boolean(temporarySelection?.length) && (
          <Typography variant="body1" textTransform="uppercase" pb={2} color="text.secondarydark">
            {temporarySelection.length} Users Selected
          </Typography>
        )}

        {/* User selection input */}
        <FormControl variant="standard" fullWidth>
          <Autocomplete
            multiple
            options={userList}
            value={userList.filter(
              (user) => temporarySelection.includes(user.id) // Filter out already selected users
            )}
            onChange={(event, newValue) => {
              // Update temporary selection with user IDs
              setTemporarySelection(newValue.map((user) => user.id));
            }}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName || ''}`}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  <Typography variant="body2" mb={2}>
                    Select user to this role
                  </Typography>
                }
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  style: {
                    ...params.InputProps.style,
                    height: 'auto',
                    minHeight: '2.625rem',
                    flexWrap: 'wrap'
                  },
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null} {/* Loading indicator */}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            renderOption={(props, item) => (
              <Typography component="li" {...props} key={item.id} color="text.secondarydark">
                {/* Display user full name */}
                {item.firstName + ' ' + item.lastName}
              </Typography>
            )}
          />
        </FormControl>
      </DialogContent>

      {/* Dialog actions (buttons) */}
      <DialogActions>
        {/* Cancel button to close the dialog */}
        <Button variant="outlinedWhite" onClick={handleClose} sx={{ color: 'text.primary' }} aria-label="close">
          Cancel
        </Button>

        {/* Add button to save the selection */}
        <Button variant="contained" onClick={handleAddOrEdit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
