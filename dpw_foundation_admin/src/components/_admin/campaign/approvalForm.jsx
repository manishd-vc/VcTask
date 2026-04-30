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
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import * as Yup from 'yup';
/**
 * Get validation schema based on the IACAD approval status.
 *
 * @param {string} iacadApproval - The IACAD approval status ('yes' or 'no').
 * @returns {Yup.ObjectSchema} - The dynamic validation schema based on IACAD approval.
 */
const getValidationSchema = (iacadApproval) => {
  return Yup.object({
    iacadApproval: Yup.string().required('Approval decision is required'),
    justification:
      iacadApproval === 'no'
        ? Yup.string().required('Justification is required when IACAD approval is not required')
        : Yup.string().notRequired()
  });
};

const ApprovalForm = ({ open, onClose, onSubmit, isLoading }) => {
  const [iacadApprovalValue, setIacadApprovalValue] = useState('yes');
  const theme = useTheme();
  const style = ModalStyle(theme);

  // Formik hook for form management
  const formik = useFormik({
    initialValues: {
      iacadApproval: 'yes',
      justification: ''
    },
    validationSchema: getValidationSchema(iacadApprovalValue),
    enableReinitialize: true, // Reinitialize formik values when iacadApprovalValue changes
    onSubmit: (values) => {
      onSubmit(values); // Pass form values to the parent onSubmit handler
    }
  });

  // Handle change of IACAD approval radio button
  const handleIacadApprovalChange = (event) => {
    const { value } = event.target;
    formik.setFieldValue('iacadApproval', value); // Update Formik field value
    setIacadApprovalValue(value); // Update local state
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          IACAD Approval
        </DialogTitle>
        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="body1" color="text.secondarydark">
            Is this request requires IACAD Approval ?
          </Typography>
          <FormControl component="fieldset" sx={{ mb: 1, color: 'text.secondarydark' }}>
            <RadioGroup
              aria-label="iacadApproval"
              name="iacadApproval"
              value={formik.values.iacadApproval}
              onChange={handleIacadApprovalChange}
              row
              sx={{ mt: 2 }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          {formik.values.iacadApproval === 'no' && (
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="standard"
              id="justification"
              name="justification"
              label={
                <>
                  Justification{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={formik.values.justification}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.justification && Boolean(formik.errors.justification)}
              helperText={formik.touched.justification && formik.errors.justification}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlinedWhite">
            No
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} sx={{ ml: 'auto' }}>
            Send
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Default props for optional properties
ApprovalForm.defaultProps = {
  isLoading: false // Default to not loading
};

ApprovalForm.propTypes = {
  // 'open' is a boolean indicating if the form is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a required function to handle closing the form
  onClose: PropTypes.func.isRequired,

  // 'onSubmit' is a required function to handle form submission
  onSubmit: PropTypes.func.isRequired,

  // 'isLoading' is an optional boolean indicating the loading state
  isLoading: PropTypes.bool
};

export default ApprovalForm;
