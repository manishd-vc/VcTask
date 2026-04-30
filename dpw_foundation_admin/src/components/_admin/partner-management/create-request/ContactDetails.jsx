import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useFormikContext } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerManagementApi from 'src/services/partner';
import { defaultCountry, preferredCountries } from 'src/utils/constants';

export default function ContactDetails() {
  const { values, getFieldProps, errors, touched, setFieldValue, handleBlur } = useFormikContext();
  const { partnershipRequestLoading, partnershipRequestData } = useSelector((state) => state?.partner);
  const dispatch = useDispatch();
  const [contactPersonList, setContactPersonList] = useState([]);
  const [personDetails, setPersonDetails] = useState({});
  const { mutate } = useMutation(partnerManagementApi.getContactPersonList, {
    onSuccess: (data) => {
      if (data?.content?.length > 0) {
        setContactPersonList(data?.content);
        // If there are existing contacts, default to "No" (select existing)
        // If no existing contacts, default to "Yes" (add new)
        if (!values?.addNewPartnershipContact && values?.addNewPartnershipContact !== false) {
          setFieldValue('addNewPartnershipContact', false);
        }
      } else {
        // If no existing contacts, automatically set to add new contact
        setFieldValue('addNewPartnershipContact', true);
      }
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      // If API fails, default to add new contact
      setFieldValue('addNewPartnershipContact', true);
    }
  });

  useEffect(() => {
    if (partnershipRequestData?.partnerId) {
      mutate({ partnerId: partnershipRequestData?.partnerId });
    }
  }, [partnershipRequestData?.partnerId]);

  useEffect(() => {
    if (values?.partnerContactId) {
      const personDetails = contactPersonList?.find((v) => v?.id === values?.partnerContactId);
      setPersonDetails(personDetails || {});
    }
  }, [contactPersonList, values?.partnerContactId]);

  const handleContactPersonChange = (id) => {
    setFieldValue('partnerContactId', id);
    const personDetails = contactPersonList?.find((v) => v?.id === id);
    setPersonDetails(personDetails || {});
  };

  const handleAddNewPartnershipContactChange = (value) => {
    const isAddingNew = value === 'true';
    setFieldValue('addNewPartnershipContact', isAddingNew);

    if (isAddingNew) {
      // Reset existing contact selection when switching to "Yes"
      setFieldValue('partnerContactId', '');
      setPersonDetails({});
    } else {
      // Reset new contact form fields when switching to "No"
      setFieldValue('contactPersonEmail', '');
      setFieldValue('contactPersonName', '');
      setFieldValue('contactPersonDesignation', '');
      setFieldValue('contactPhoneNumber', '');
      setFieldValue('isPrimaryContact', false);
    }
  };

  // Determine if we should show the radio buttons (only when there are existing contacts with valid emails)
  const shouldShowRadioButtons =
    contactPersonList.length > 0 &&
    contactPersonList.some((contact) => contact.contactPersonEmail && contact.contactPersonEmail.trim() !== '');

  // Determine if we should show the new contact form
  const shouldShowNewContactForm = !shouldShowRadioButtons || values?.addNewPartnershipContact;

  // Determine if we should show the existing contact selection
  const shouldShowExistingContactSelection = shouldShowRadioButtons && !values?.addNewPartnershipContact;

  return (
    <>
      <Typography
        variant="subtitle6"
        component="h4"
        textTransform={'uppercase'}
        color="primary.main"
        sx={{ pb: 2, mt: 3 }}
      >
        Partnership Contact Details
      </Typography>
      <Grid container spacing={3}>
        {shouldShowRadioButtons && (
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel id="addNewPartnershipContact-radio-buttons-group-label" sx={{ mb: 1 }}>
                <Typography variant="body3" color="text.secondary">
                  Do you want to add new Partnership Contact Details?
                </Typography>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="addNewPartnershipContact-radio-buttons-group-label"
                name="addNewPartnershipContact"
                value={values?.addNewPartnershipContact ? 'true' : 'false'}
                onChange={(e) => handleAddNewPartnershipContactChange(e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}

        {shouldShowNewContactForm && (
          <>
            <Grid item xs={12} sm={6}>
              <FieldWithSkeleton
                isLoading={partnershipRequestLoading}
                error={touched.contactPersonEmail && errors.contactPersonEmail}
              >
                <TextField
                  id="contactPersonEmail"
                  variant="standard"
                  fullWidth
                  {...getFieldProps('contactPersonEmail')}
                  label={
                    <>
                      Contact Person Email ID{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  inputProps={{ maxLength: 255 }}
                  value={values?.contactPersonEmail}
                  onChange={(e) => setFieldValue('contactPersonEmail', e.target.value)}
                  error={Boolean(touched?.contactPersonEmail && errors?.contactPersonEmail)}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldWithSkeleton
                isLoading={partnershipRequestLoading}
                error={touched.contactPersonName && errors.contactPersonName}
              >
                <TextField
                  id="contactPersonName"
                  variant="standard"
                  fullWidth
                  {...getFieldProps('contactPersonName')}
                  label={
                    <>
                      Contact Person Name{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  inputProps={{ maxLength: 255 }}
                  value={values?.contactPersonName}
                  onChange={(e) => setFieldValue('contactPersonName', e.target.value)}
                  error={Boolean(touched?.contactPersonName && errors?.contactPersonName)}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldWithSkeleton
                isLoading={partnershipRequestLoading}
                error={touched.contactPersonDesignation && errors.contactPersonDesignation}
              >
                <TextField
                  id="contactPersonDesignation"
                  variant="standard"
                  fullWidth
                  {...getFieldProps('contactPersonDesignation')}
                  label={
                    <>
                      Contact Person Designation{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  inputProps={{ maxLength: 255 }}
                  value={values?.contactPersonDesignation}
                  onChange={(e) => setFieldValue('contactPersonDesignation', e.target.value)}
                  error={Boolean(touched?.contactPersonDesignation && errors?.contactPersonDesignation)}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldWithSkeleton isLoading={partnershipRequestLoading}>
                <MuiTelInput
                  label={
                    <>
                      Contact Person Phone Number{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  id="phone"
                  preferredCountries={preferredCountries}
                  defaultCountry={defaultCountry}
                  fullWidth
                  value={values?.contactPhoneNumber}
                  onChange={(value) => {
                    const cleanedValue = value ? value.replace(/\s/g, '') : '';
                    setFieldValue('contactPhoneNumber', cleanedValue);
                  }}
                  onBlur={handleBlur('contactPhoneNumber')} // Make sure this is present
                  variant="standard"
                  error={touched.contactPhoneNumber && Boolean(errors.contactPhoneNumber)}
                  helperText={touched.contactPhoneNumber && errors.contactPhoneNumber}
                  sx={{
                    '& .MuiInputAdornment-root .MuiButtonBase-root': {
                      right: 6
                    }
                  }}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel id="isPrimaryContact-radio-buttons-group-label" sx={{ mb: 1 }}>
                  <Typography variant="body3" color="text.secondary">
                    Is Primary Contact?
                  </Typography>
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="isPrimaryContact-radio-buttons-group-label"
                  name="isPrimaryContact"
                  value={values?.isPrimaryContact ? 'true' : 'false'}
                  onChange={(e) => setFieldValue('isPrimaryContact', e.target.value === 'true')}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </>
        )}

        {shouldShowExistingContactSelection && (
          <>
            <Grid item xs={12} sm={6}>
              <FieldWithSkeleton
                isLoading={partnershipRequestLoading}
                error={touched.partnerContactId && errors.partnerContactId}
              >
                <TextField
                  label={
                    <>
                      Contact Person Email ID{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  value={values?.partnerContactId ?? ''}
                  onChange={(e) => handleContactPersonChange(e.target.value)}
                  select
                  fullWidth
                  variant="standard"
                  sx={{ '.MuiSelect-select': { paddingRight: '35px!important' } }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 400, // Restrict dropdown height to 200px
                          overflowY: 'auto' // Enable vertical scrolling for overflow
                        }
                      }
                    }
                  }}
                  error={Boolean(touched?.partnerContactId && errors?.partnerContactId)}
                >
                  {contactPersonList
                    ?.filter((v) => v?.contactPersonEmail && v?.contactPersonEmail.trim() !== '')
                    ?.map((v) => (
                      <MenuItem value={v?.id} key={v?.id}>
                        {v?.contactPersonEmail}
                      </MenuItem>
                    ))}
                </TextField>
              </FieldWithSkeleton>
            </Grid>
            {Object?.keys(personDetails).length > 0 && (
              <>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Contact Person Name
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {personDetails?.contactPersonName}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Contact Person Designation
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {personDetails?.contactPersonDesignation}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Contact Person Phone Number
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {personDetails?.contactPhoneNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Is Primary Contact?
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {personDetails?.isPrimaryContact ? 'Yes' : 'No'}
                    </Typography>
                  </Stack>
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
}
