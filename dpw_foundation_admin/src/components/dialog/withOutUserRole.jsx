import { LoadingButton } from '@mui/lab';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { BackArrow, CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

WithOutUserRole.propTypes = {
  // 'handleClose' is a function to close the dialog or perform some action
  handleClose: PropTypes.func.isRequired,

  // 'setIsConfirm' is a function to set the confirmation state
  setIsConfirm: PropTypes.func.isRequired,

  // 'handleDeleteRole' is a function to handle the role deletion
  handleDeleteRole: PropTypes.func.isRequired,

  // 'deleteLoading' is a boolean indicating if the delete operation is in progress
  deleteLoading: PropTypes.bool.isRequired,

  // 'isConfirm' is a boolean that determines if confirmation is needed
  isConfirm: PropTypes.bool.isRequired,

  // 'setStep' is a function to set the current step in the process
  setStep: PropTypes.func.isRequired,

  // 'step' is a number representing the current step in the process
  step: PropTypes.number.isRequired
};

/**
 * WithOutUserRole - A dialog component that confirms the action to delete or archive a role.
 * @param {object} props - The component props.
 * @param {function} props.handleClose - Callback function to close the modal.
 * @param {function} props.setIsConfirm - Callback to set confirmation value (Yes/No).
 * @param {function} props.handleDeleteRole - Callback to handle the deletion action.
 * @param {boolean} props.deleteLoading - Boolean to show loading state for the delete action.
 * @param {boolean} props.isConfirm - Boolean value for confirmation state (Yes/No).
 * @param {function} props.setStep - Callback function to set the current step in the modal.
 * @param {number} props.step - The current step of the modal (used for navigation).
 * @returns {JSX.Element} - WithOutUserRole component.
 */
export default function WithOutUserRole({
  handleClose,
  setIsConfirm,
  handleDeleteRole,
  deleteLoading,
  isConfirm,
  setStep,
  step
}) {
  // Using MUI's useTheme hook to get the current theme
  const theme = useTheme();
  const style = ModalStyle(theme); // Custom styles for the modal

  return (
    <>
      {/* Step 1: Back button to navigate to the previous step */}
      {step === 1 && (
        <Button variant="text" sx={style.backBtn} startIcon={<BackArrow />} onClick={() => setStep(0)}>
          Back
        </Button>
      )}

      {/* Dialog title */}
      <DialogTitle sx={style.modalTitle}>
        <Typography variant="h5" textTransform="uppercase" color="primary.main">
          Confirm
        </Typography>
      </DialogTitle>

      {/* Close button to close the modal */}
      <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      {/* Dialog content with radio buttons for confirming the action */}
      <DialogContent sx={{ p: 0 }}>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue=""
            name="radio-buttons-group"
            onChange={(e) => setIsConfirm(e.target.value)} // Update confirmation state
            sx={{ pl: 2 }}
          >
            {/* Option to archive the role */}
            <FormControlLabel
              value="yes"
              control={<Radio sx={{ color: theme.palette.text.primary }} />}
              label="I want to Archive the Role"
              sx={{ color: theme.palette.text.secondarydark }}
            />
            {/* Option to delete the role */}
            <FormControlLabel
              value="No"
              control={<Radio sx={{ color: theme.palette.text.primary }} />}
              label="I want to Delete the Role"
              sx={{ color: theme.palette.text.secondarydark }}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>

      {/* Dialog actions with confirmation buttons */}
      <DialogActions>
        {/* 'No' button to close the modal */}
        <Button variant="outlinedWhite" onClick={handleClose}>
          No
        </Button>

        {/* 'Yes' button to confirm the action */}
        <LoadingButton loading={deleteLoading} variant="contained" onClick={handleDeleteRole} disabled={!isConfirm}>
          Yes
        </LoadingButton>
      </DialogActions>
    </>
  );
}
