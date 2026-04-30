'use client';
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
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Form, Formik } from 'formik';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { MuiTelInput } from 'mui-tel-input';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnershipApi from 'src/services/partner';
import { defaultCountry, preferredCountries } from 'src/utils/constants';
import * as Yup from 'yup';

const phoneValidation = (label, isRequired = true) => {
  let schema = Yup.string().test('is-valid-phone', `Please enter a valid ${label}`, function (value) {
    if (!value) return true;
    try {
      const isValid = isValidPhoneNumber(value);
      if (!isValid) {
        return this.createError({
          message: `The ${label} is not valid.`
        });
      }
      return true;
    } catch (error) {
      return this.createError({
        message: 'Invalid phone number format.'
      });
    }
  });

  if (isRequired) {
    schema = schema.required(`${label} is required`);
  }

  return schema;
};

const validationSchema = Yup.object({
  contactPersonEmail: Yup.string().email('Enter a valid email').required('Contact Person Email ID is required'),
  contactPersonName: Yup.string()
    .required('Contact Person Name is required')
    .min(2, 'Name must be at least 2 characters'),
  contactPersonDesignation: Yup.string().required('Contact Person Designation is required'),
  contactPhoneNumber: phoneValidation('Contact Person Phone Number', true),
  isPrimaryContact: Yup.boolean().required('Please select if this is a primary contact')
});

export default function AddContactModal({ open, onClose, partnerId, onSuccess, editData = null }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();

  const { mutate: addContact, isLoading } = useMutation('addPartnerContact', partnershipApi.addUpdatePartnerContact, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error.response?.data?.message || 'Failed to add contact',
          variant: 'error'
        })
      );
    }
  });

  const isEdit = !!editData;

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      contactPhoneNumber: values.contactPhoneNumber.replace(/\s/g, ''), // Remove spaces
      ...(isEdit && { id: editData.id }) // Include ID when editing
    };
    addContact({ partnerId, payload });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        {isEdit ? 'EDIT CONTACT detail' : 'ADD CONTACT detail'}
      </DialogTitle>

      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <Formik
        enableReinitialize
        initialValues={{
          contactPersonEmail: editData?.contactPersonEmail || editData?.emailId || '',
          contactPersonName: editData?.contactPersonName || '',
          contactPersonDesignation: editData?.contactPersonDesignation || '',
          contactPhoneNumber: editData?.contactPhoneNumber || editData?.phoneNumber || '',
          isPrimaryContact: editData?.isPrimaryContact || false
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, getFieldProps, touched, errors, values, handleChange, handleBlur, setFieldValue }) => (
          <Form id="addContactForm">
            <DialogContent>
              <Grid container spacing={3}>
                {/* Contact Person Email ID */}
                <Grid item xs={12} sm={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched.contactPersonEmail && !!errors.contactPersonEmail}
                  >
                    <TextField
                      id="contactPersonEmail"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label={
                        <>
                          Contact Person Email ID{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      fullWidth
                      {...getFieldProps('contactPersonEmail')}
                      error={touched.contactPersonEmail && !!errors.contactPersonEmail}
                      helperText={touched.contactPersonEmail && errors.contactPersonEmail}
                    />
                  </FieldWithSkeleton>
                </Grid>

                {/* Contact Person Name */}
                <Grid item xs={12} sm={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched.contactPersonName && !!errors.contactPersonName}
                  >
                    <TextField
                      id="contactPersonName"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label={
                        <>
                          Contact Person Name{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      fullWidth
                      {...getFieldProps('contactPersonName')}
                      error={touched.contactPersonName && !!errors.contactPersonName}
                      helperText={touched.contactPersonName && errors.contactPersonName}
                    />
                  </FieldWithSkeleton>
                </Grid>

                {/* Contact Person Designation */}
                <Grid item xs={12} sm={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched.contactPersonDesignation && !!errors.contactPersonDesignation}
                  >
                    <TextField
                      id="contactPersonDesignation"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label={
                        <>
                          Contact Person Designation{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      fullWidth
                      {...getFieldProps('contactPersonDesignation')}
                      error={touched.contactPersonDesignation && !!errors.contactPersonDesignation}
                      helperText={touched.contactPersonDesignation && errors.contactPersonDesignation}
                    />
                  </FieldWithSkeleton>
                </Grid>

                {/* Contact Person Phone Number */}
                <Grid item xs={12} sm={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched.contactPhoneNumber && !!errors.contactPhoneNumber}
                  >
                    <MuiTelInput
                      id="contactPhoneNumber"
                      label={
                        <>
                          Contact Person Phone Number{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      preferredCountries={preferredCountries}
                      defaultCountry={defaultCountry}
                      fullWidth
                      value={values.contactPhoneNumber}
                      onChange={(value) => {
                        const cleanedValue = value ? value.replace(/\s/g, '') : '';
                        setFieldValue('contactPhoneNumber', cleanedValue);
                      }}
                      onBlur={handleBlur('contactPhoneNumber')}
                      variant="standard"
                      error={touched.contactPhoneNumber && !!errors.contactPhoneNumber}
                      helperText={touched.contactPhoneNumber && errors.contactPhoneNumber}
                      sx={{
                        '& .MuiInputAdornment-root .MuiButtonBase-root': {
                          right: 6
                        }
                      }}
                    />
                  </FieldWithSkeleton>
                </Grid>

                {/* Is Primary Contact */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1 }}>
                      <Typography variant="body3" color="text.secondary">
                        Is Primary Contact?
                      </Typography>
                    </FormLabel>
                    <RadioGroup
                      row
                      name="isPrimaryContact"
                      value={values.isPrimaryContact}
                      onChange={(e) => setFieldValue('isPrimaryContact', e.target.value === 'true')}
                    >
                      <FormControlLabel value={true} control={<Radio color="primary" />} label="Yes" sx={{ mr: 3 }} />
                      <FormControlLabel value={false} control={<Radio color="primary" />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button variant="outlinedWhite" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                color="primary"
                form="addContactForm"
                onClick={handleSubmit}
                disabled={isLoading}
                loading={isLoading}
              >
                Save
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
