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
import { useEffect } from 'react';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import * as Yup from 'yup';
/**
 * Validation schema for the AFE Number form
 *
 * Uses Yup to validate the form fields, ensuring that AEF Number, Funds Required, and Funds Alloted are provided,
 * with specific checks for non-negative values for the fund fields.
 *
 * @returns {Object} The validation schema for the form.
 */
const getValidationSchema = () => {
  return Yup.object({
    aefNumber: Yup.string()
      .required('AEF Number is required')
      .min(0, 'AFE Number cannot be negative.')
      .max(50, 'AFE Number must be at most 50 Characters.'),
    fundsRequired: Yup.string().required('Funds id required').min(0, 'Funds required cannot be negative'),
    fundsAlloted: Yup.string()
      .required('Funds alloted is required')
      .min(0, 'Funds required cannot be negative')
      .max(50, 'Funds must be at most 50 letters')
  });
};

/**
 * AFENumberForm component
 *
 * A form to handle the AFE Number input, along with the required funds and allotted funds.
 * This form includes validation and submission logic, and it is displayed in a modal.
 *
 * @component
 * @example
 * return <AFENumberForm open={true} onClose={handleClose} onSubmit={handleSubmit} isLoading={false} row={data} />;
 *
 * @param {Object} props - The props passed to the component.
 * @param {boolean} props.open - Whether the dialog is open or not.
 * @param {function} props.onClose - Function to close the dialog.
 * @param {function} props.onSubmit - Function to handle form submission.
 * @param {boolean} props.isLoading - Indicates if the form submission is in progress.
 * @param {Object} props.row - The data for the current row, used to populate the form fields.
 */
const AFENumberForm = ({ open, onClose, onSubmit, isLoading, row }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);

  // Formik hook to handle form state and validation
  const formik = useFormik({
    initialValues: {
      aefNumber: '', // Initial value for AEF Number
      fundsRequired: row?.campaignTargetRequired || '0', // Initial value for Funds Required (from row data)
      fundsAlloted: '0' // Initial value for Funds Allotted
    },
    validationSchema: getValidationSchema(),
    onSubmit: (values) => {
      onSubmit(values, formik); // Submit form values
    }
  });

  // Effect to update form field when row data changes
  useEffect(() => {
    if (row) {
      formik.setFieldValue('fundsRequired', row?.campaignTargetRequired || '0');
    }
  }, [row]); // Runs whenever the row data changes

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Enter AFE Number
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={
                <>
                  Enter AFE Number{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              variant="standard"
              name="aefNumber"
              value={formik.values.aefNumber}
              onChange={formik.handleChange}
              error={formik.touched.aefNumber && Boolean(formik.errors.aefNumber)}
              helperText={formik.touched.aefNumber && formik.errors.aefNumber}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={
                <>
                  Allocate Funds{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              variant="standard"
              name="fundsRequired"
              value={formik.values.fundsRequired}
              onChange={formik.handleChange}
              error={formik.touched.fundsRequired && Boolean(formik.errors.fundsRequired)}
              helperText={formik.touched.fundsRequired && formik.errors.fundsRequired}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Funds Allotted"
              variant="standard"
              name="fundsAlloted"
              value={formik.values.fundsAlloted}
              onChange={formik.handleChange}
              error={formik.touched.fundsAlloted && Boolean(formik.errors.fundsAlloted)}
              helperText={formik.touched.fundsAlloted && formik.errors.fundsAlloted}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <LoadingButton loading={isLoading} onClick={formik.handleSubmit} variant="contained" color="primary">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

AFENumberForm.propTypes = {
  // 'open' is a boolean that determines whether the form is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a required function to handle form closure
  onClose: PropTypes.func.isRequired,

  // 'onSubmit' is a required function for form submission
  onSubmit: PropTypes.func.isRequired,

  // 'isLoading' is an optional boolean indicating the loading state
  isLoading: PropTypes.bool,

  // 'row' is an object containing specific properties
  row: PropTypes.shape({
    campaignTargetRequired: PropTypes.string // 'campaignTargetRequired' is a string
  })
};

// Default props for optional properties
AFENumberForm.defaultProps = {
  isLoading: false, // Default to not loading
  row: null // Default to no row data
};
export default AFENumberForm;
