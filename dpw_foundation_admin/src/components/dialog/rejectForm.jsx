import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as logActivity from 'src/services/logActivity';
import * as Yup from 'yup';
/**
 * RejectForm component
 *
 * This form component is used for rejecting a campaign, allowing the user to provide a rejection reason.
 * It includes form validation and handles form submission.
 *
 * @component
 * @param {boolean} open - Flag indicating if the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @example
 * return <RejectForm open={true} onClose={handleClose} onSubmit={handleReject} isLoading={false} />;
 */
const RejectForm = ({ open, onClose, enrolledId, logHourId }) => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const style = ModalStyle(theme);

  const { mutate, isLoading } = useMutation(
    ({ enrolledId, logHourId, payload }) => logActivity.rejectLogActivity({ enrolledId, logHourId, payload }),
    {
      onSuccess: (response) => {
        console.log('response', response);
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        onClose();
      },
      onError: (err) => {
        onClose();
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      reason: '' // Initial value for the rejection reason input
    },
    validationSchema: Yup.object({
      // Validation schema to ensure the reason is not empty
      reason: Yup.string().required('Rejection reason is required')
    }),
    onSubmit: ({ reason }) => {
      const payload = {
        rejectionReason: reason
      };
      mutate({ enrolledId: enrolledId, logHourId: logHourId, payload });
      formik.resetForm(); // Reset the form fields after submission
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          Reject
        </DialogTitle>
        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
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
  onClose: PropTypes.func.isRequired // Validates 'onClose' as a required function
};

export default RejectForm;
