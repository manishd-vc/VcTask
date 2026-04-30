import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import DatePickers from 'src/components/datePicker';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import * as Yup from 'yup';
/**
 * Returns the validation schema based on IACAD approval status.
 *
 * @param {string} iacadApproval - The current IACAD approval status (either 'IACAD_APPROVED' or 'IACAD_REJECTED').
 * @returns {Yup.ObjectSchema} The validation schema based on the approval status.
 */
const getValidationSchema = (iacadApproval) => {
  return Yup.object({
    approvalStatus: Yup.string().required('Status is required'),
    iacadPermitId:
      iacadApproval === 'IACAD_APPROVED'
        ? Yup.string().required('Permit Number is required')
        : Yup.string().notRequired(),
    iacadRequestId:
      iacadApproval === 'IACAD_REJECTED' ? Yup.string().required('Request ID is required') : Yup.string().notRequired(),
    responseDate: Yup.string().required('Response date is required')
  });
};

/**
 * IcadApprovalForm component is used to capture and update the IACAD response details.
 *
 * @param {object} props - The component props
 * @param {boolean} props.open - Determines if the modal is open or closed
 * @param {function} props.onClose - Callback function to handle modal close
 * @param {function} props.onSubmit - Callback function to submit the form data
 * @param {string} props.type - Type of the form (approval or rejection)
 * @param {boolean} props.isLoading - Determines if the submit button is in loading state
 *
 * @returns {JSX.Element} The rendered IcadApprovalForm dialog
 */
const IcadApprovalForm = ({ open, onClose, onSubmit, isLoading }) => {
  const [iacadApprovalValue, setIacadApprovalValue] = React.useState('');
  const theme = useTheme();
  const style = ModalStyle(theme);

  const formik = useFormik({
    initialValues: {
      approvalStatus: '',
      iacadRequestId: '',
      iacadPermitId: '',
      responseDate: new Date()
    },
    validationSchema: getValidationSchema(iacadApprovalValue),
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    }
  });

  /**
   * Handles the change in the approval status (approved/rejected).
   *
   * @param {object} event - The event triggered by the radio button change
   */
  const handleIacadApprovalChange = (event) => {
    formik.setFieldValue('approvalStatus', event.target.value);
    setIacadApprovalValue(event.target.value);

    if (event.target.value === 'IACAD_APPROVED') {
      formik.setFieldValue('iacadRequestId', '');
    } else {
      formik.setFieldValue('iacadPermitId', '');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: '765px !important'
        }
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          Capture IACAD Response
        </DialogTitle>
        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="body1" color="text.secondarydark">
            Is this request requires IACAD Approval ?
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="approvalStatus"
              name="approvalStatus"
              value={formik.values.approvalStatus}
              onChange={handleIacadApprovalChange}
              row
              sx={{ my: 2 }}
            >
              <FormControlLabel
                value="IACAD_APPROVED"
                control={<Radio />}
                label={
                  <Typography variant="body2" color="text.secondarydark">
                    Approved by IACAD
                  </Typography>
                }
                sx={{ mr: 3, color: 'text.secondarydark' }}
              />
              <FormControlLabel
                value="IACAD_REJECTED"
                control={<Radio />}
                label={
                  <Typography variant="body2" color="text.secondarydark">
                    Rejected By IACAD
                  </Typography>
                }
                sx={{ color: 'text.secondarydark' }}
              />
            </RadioGroup>
            {formik.touched.approvalStatus && formik.errors.approvalStatus && (
              <p style={{ color: '#0f0f19' }}>{formik.errors.approvalStatus}</p>
            )}
          </FormControl>
          <Grid container spacing={3}>
            {iacadApprovalValue === 'IACAD_APPROVED' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="standard"
                  id="iacadPermitId"
                  name="iacadPermitId"
                  label={
                    <>
                      IACAD Permit Number{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  value={formik.values.iacadPermitId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.iacadPermitId && Boolean(formik.errors.iacadPermitId)}
                  helperText={formik.touched.iacadPermitId && formik.errors.iacadPermitId}
                  placeholder="IACAD APR-2323"
                />
              </Grid>
            )}
            {iacadApprovalValue === 'IACAD_REJECTED' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="standard"
                  id="iacadRequestId"
                  name="iacadRequestId"
                  label={
                    <>
                      IACAD Request ID{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  value={formik.values.iacadRequestId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.iacadRequestId && Boolean(formik.errors.iacadRequestId)}
                  helperText={formik.touched.iacadRequestId && formik.errors.iacadRequestId}
                  placeholder="Request ID"
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <DatePickers
                label={
                  <>
                    Response Date{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputFormat={'yyyy-MM-dd'}
                onChange={(value) => formik.setFieldValue('responseDate', value)}
                handleClear={() => formik.setFieldValue('responseDate', null)}
                value={formik.values.responseDate}
                error={formik.touched.responseDate && Boolean(formik.errors.responseDate)}
                helperText={formik.touched.responseDate && formik.errors.responseDate}
                type="date"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="outlinedWhite">
            No
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} sx={{ ml: 'auto' }}>
            Update against campaign request
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

IcadApprovalForm.propTypes = {
  // 'open' is a boolean indicating if the form is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a required function to handle closing the form
  onClose: PropTypes.func.isRequired,

  // 'onSubmit' is a required function to handle form submission
  onSubmit: PropTypes.func.isRequired,

  // 'isLoading' is an optional boolean indicating the loading state
  isLoading: PropTypes.bool
};

// Default props for optional properties
IcadApprovalForm.defaultProps = {
  isLoading: false // Default to not loading
};
export default IcadApprovalForm;
