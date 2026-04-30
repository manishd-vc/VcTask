import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
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
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import * as api from 'src/services';
import * as Yup from 'yup';
/**
 * SendToForm component
 *
 * This form component is used for sending a campaign for approval, allowing the user to select an approver
 * and provide a justification. It includes form validation, user search functionality, and form submission.
 *
 * @component
 * @param {boolean} open - Flag indicating if the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onSubmit - Function to handle form submission.
 * @param {boolean} isLoading - Flag indicating if the form is in a loading state.
 * @example
 * return <SendToForm open={true} onClose={handleClose} onSubmit={handleSubmit} isLoading={false} />;
 */

const getValidationSchema = () => {
  return Yup.object({
    userId: Yup.object().required('Approver is required'),
    justification: Yup.string().required('Justification is required')
  });
};

const SendToForm = ({ open, onClose, onSubmit, isLoading }) => {
  const theme = useTheme();
  const router = useRouter();
  const style = ModalStyle(theme);

  const { data: roleSupervisor, isLoading: userListingLoading } = useQuery(['role-supervisor'], () =>
    api.getRoleSuperVisorList('fund_manage_approve_reject')
  );

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      userId: '', // Initial value for approver selection
      justification: '' // Initial value for justification
    },
    validationSchema: getValidationSchema(), // Validation schema for the form fields
    enableReinitialize: true, // Ensure form values are reinitialized when props change
    onSubmit: (values) => {
      // On form submission, pass selected userId and justification to the onSubmit handler
      onSubmit({
        userId: values.userId.id, // Extract user ID from the selected approver
        justification: values.justification
      });

      formik.resetForm(); // Reset the form fields after submission
      router.back(); // Navigate to the campaign approval page
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <Grid>
          <DialogTitle
            sx={{ textTransform: 'uppercase' }}
            id="customized-dialog-title"
            variant="h5"
            color="primary.main"
          >
            Send for another Approver
          </DialogTitle>
          <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <DialogContent>
          <Autocomplete
            options={roleSupervisor?.content}
            value={formik.values.userId}
            onChange={(event, newValue) => {
              formik.setFieldValue('userId', newValue);
            }}
            getOptionLabel={(option) => (option && option?.firstName + ' ' + option?.lastName) || ''}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  <>
                    Select Another campaign approver{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                variant="standard"
                error={formik.touched.assignedUserList && Boolean(formik.errors.assignedUserList)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {userListingLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            renderOption={(props, item) => (
              <li {...props} key={item.id}>
                {item.firstName + ' ' + item.lastName}
              </li>
            )}
          />
          <TextField
            sx={{ mt: 3 }}
            fullWidth
            multiline
            rows={3}
            variant="standard"
            id="justification"
            name="justification"
            label="Enter Justification "
            value={formik.values.justification}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.justification && Boolean(formik.errors.justification)}
            helperText={formik.touched.justification && formik.errors.justification}
            placeholder="General justification around the donation"
          />
        </DialogContent>
        <DialogActions sx={{ display: 'flex' }}>
          <Button onClick={onClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} sx={{ ml: 'auto' }}>
            Assign
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

SendToForm.propTypes = {
  open: PropTypes.bool.isRequired, // Validates 'open' as a required boolean
  onClose: PropTypes.func.isRequired, // Validates 'onClose' as a required function
  onSubmit: PropTypes.func.isRequired, // Validates 'onSubmit' as a required function
  isLoading: PropTypes.bool // Validates 'isLoading' as an optional boolean
};

export default SendToForm;
