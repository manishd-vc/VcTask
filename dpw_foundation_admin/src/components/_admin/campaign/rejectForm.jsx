import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
/**
 * RejectForm component
 *
 * This form component is used for rejecting a campaign, allowing the user to provide a rejection reason.
 * It includes form validation and handles form submission.
 *
 * @component
 * @param {boolean} open - Flag indicating if the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onSubmit - Function to handle form submission with the rejection reason.
 * @param {boolean} isLoading - Flag indicating if the form is in a loading state.
 * @example
 * return <RejectForm open={true} onClose={handleClose} onSubmit={handleReject} isLoading={false} />;
 */
const RejectForm = ({ open, onClose, onSubmit, isLoading }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      reason: '' // Initial value for the rejection reason input
    },
    validationSchema: Yup.object({
      // Validation schema to ensure the reason is not empty
      reason: Yup.string().required('Rejection reason is required')
    }),
    onSubmit: (values) => {
      // On form submission, pass the rejection reason to the onSubmit handler
      onSubmit(values);
      formik.resetForm(); // Reset the form fields after submission
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          Reject Request
        </DialogTitle>
        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="standard"
            id="reason"
            name="reason"
            label={
              <>
                Rejection Reason{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            value={formik.values.reason}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
            helperText={formik.touched.reason && formik.errors.reason}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlinedWhite" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton variant="contained" loading={isLoading} type="submit">
            Reject
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
RejectForm.propTypes = {
  open: PropTypes.bool.isRequired, // Validates 'open' as a required boolean
  onClose: PropTypes.func.isRequired, // Validates 'onClose' as a required function
  onSubmit: PropTypes.func.isRequired, // Validates 'onSubmit' as a required function
  isLoading: PropTypes.bool // Validates 'isLoading' as an optional boolean
};

export default RejectForm;
