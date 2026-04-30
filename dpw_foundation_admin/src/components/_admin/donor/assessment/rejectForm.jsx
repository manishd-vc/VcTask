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
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
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
 * @param {function} onSubmit - Function to handle form submission with the rejection reason.
 * @param {boolean} isLoading - Flag indicating if the form is in a loading state.
 * @example
 * return <RejectForm open={true} onClose={handleClose} onSubmit={handleReject} isLoading={false} />;
 */
const RejectForm = ({ open, onClose, onSubmit, isLoading, donationPledgeId, type }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const currentDate = format(new Date(), 'd/M/yyyy');

  const renderTypeStatus = () => {
    switch (type) {
      case 'admin':
        return 'ASSESSMENT_REJECTED';
      case 'assessment':
        return 'ASSESSMENT_REJECTED';
      case 'hod':
        return 'DOCUMENT_REJECTED';
      case 'grant_manager':
        return 'REJECTED';
      case 'partner_manager':
        return 'REJECTED';
      case 'volunteer_manager':
        return 'REJECTED';
      case 'enrollment_manager':
        return 'REGRETTED';
      default:
        return 'ASSESSMENT_REJECTED';
    }
  };

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
      const value = { ...values };
      value.status = renderTypeStatus();
      onSubmit(value);
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  {type === 'grant_manager' ||
                  type === 'partner_manager' ||
                  type === 'volunteer_manager' ||
                  type === 'contribution_manage'
                    ? 'ID'
                    : 'Donation ID'}
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {donationPledgeId || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Rejection Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {currentDate}
                </Typography>
              </Stack>
            </Grid>
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
  onClose: PropTypes.func.isRequired, // Validates 'onClose' as a required function
  onSubmit: PropTypes.func.isRequired, // Validates 'onSubmit' as a required function
  isLoading: PropTypes.bool // Validates 'isLoading' as an optional boolean
};

export default RejectForm;
