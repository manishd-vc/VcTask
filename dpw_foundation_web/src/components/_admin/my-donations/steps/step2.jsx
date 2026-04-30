import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getMatchingString } from 'src/utils/util';
// Dynamically importing FieldWithSkeleton component for lazy loading
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

// Step2 Component - Donation Form
const Step2 = ({ isLoading, data }) => {
  // Extracting necessary form methods and state from Formik context
  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();

  // Accessing master data from Redux store
  const { masterData } = useSelector((state) => state?.common);

  // Extracting currency data from masterData using utility function
  const donationMethod = getLabelObject(masterData, 'dpw_foundation_donation_donation_method');
  const userPaymentChannel = getLabelObject(masterData, 'dpw_foundation_donation_payment_method');
  const currency = getLabelObject(masterData, 'dpw_foundation_currency');
  const transactionTypeData = getLabelObject(masterData, 'dpw_foundation_donation_type');
  const transacitonType = getMatchingString(transactionTypeData?.values, data?.donationType, 'code');
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      {/* Heading for the donation form */}
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Transaction Details
      </Typography>

      {/* Grid container for responsive form layout */}
      <Grid container spacing={3}>
        {/* Donation Amount Field - Text input */}
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.donationAmount && errors.donationAmount}>
            <NumericFormat
              label={
                <>
                  Intend Donation Value{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              {...getFieldProps('donationAmount')}
              error={touched.donationAmount && Boolean(errors.donationAmount)}
              onValueChange={(values) => {
                setFieldValue('donationAmount', values.floatValue || '');
              }}
              value={values.donationAmount}
              customInput={TextField}
              thousandSeparator
              variant="standard"
              fullWidth
            />
          </FieldWithSkeleton>
        </Grid>

        {/* Donation Currency Field - Dropdown Select */}
        <Grid item xs={12} sm={6} lg={4}>
          {console.log('values', values)}
          <FieldWithSkeleton isLoading={isLoading} error={touched.donationCurrency && errors.donationCurrency}>
            <TextFieldSelect
              id="donationCurrency"
              label={
                <>
                  Currency{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    * {/* Asterisk for required field */}
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={currency?.values} // Populate the dropdown with currency values
              error={Boolean(touched.donationCurrency && errors.donationCurrency)} // Show error if touched and invalid
              sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }} // Responsive label padding
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.donationMethod && errors.donationMethod}>
            <TextFieldSelect
              id="donationMethod"
              label={
                <>
                  Donation Type
                  <Box component="span" sx={{ color: 'error.main' }}>
                    * {/* Asterisk for required field */}
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={donationMethod.values} // Populate the dropdown with currency values
              error={Boolean(touched.donationMethod && errors.donationMethod)} // Show error if touched and invalid
              sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }} // Responsive label padding
            />
          </FieldWithSkeleton>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.userPaymentChannel && errors.userPaymentChannel}>
            <TextFieldSelect
              id="userPaymentChannel"
              label={
                <>
                  Select Payment Method
                  <Box component="span" sx={{ color: 'error.main' }}>
                    * {/* Asterisk for required field */}
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={userPaymentChannel.values} // Populate the dropdown with currency values
              error={Boolean(touched.userPaymentChannel && errors.userPaymentChannel)} // Show error if touched and invalid
              sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }} // Responsive label padding
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Transaction Type
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {transacitonType || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign ID/Reference
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.campaignNumericId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign Title
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.eventTitle || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Intent Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.createdOn ? fDateWithLocale(data?.createdOn) : '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.specialInstructions && errors.specialInstructions}>
            <TextField
              id="specialInstructions"
              variant="standard"
              inputProps={{ maxLength: 256 }}
              label={<>Special Instructions</>}
              fullWidth
              {...getFieldProps('specialInstructions')}
              error={Boolean(touched.specialInstructions && errors.specialInstructions)}
            />
          </FieldWithSkeleton>
        </Grid>

        {/* Donation Type Field - Radio Buttons */}
        <Grid item xs={12} md={12}>
          <FormLabel id="isActivityUpdateRequired">
            <Typography variant="body3" color="text.secondary">
              Acknowledgment Preferences
            </Typography>
          </FormLabel>
          <RadioGroup
            name="isActivityUpdateRequired"
            value={values?.isActivityUpdateRequired} // Bind value to Formik state
            onChange={(event) => {
              const value = event.target.value;
              setFieldValue('isActivityUpdateRequired', value); // Update Formik field value
            }}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Yes, I/we would like to be publicly acknowledged"
              sx={{ color: 'text.secondarydark' }}
              mb={2}
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="No, I/we prefer to remain anonymous"
              sx={{ color: 'text.secondarydark' }}
            />
          </RadioGroup>
        </Grid>

        {/* Tax Receipt Requirement - Radio Buttons */}
        <Grid item xs={12} md={12}>
          <FormLabel id="isTaxReceiptRequired">
            <Typography variant="body3" color="text.secondary">
              Tax Receipt
            </Typography>
          </FormLabel>
          <RadioGroup
            name="isTaxReceiptRequired"
            value={values?.isTaxReceiptRequired} // Bind value to Formik state
            onChange={(event) => {
              const value = event.target.value;
              setFieldValue('isTaxReceiptRequired', value); // Update Formik field value
            }}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Yes, please send a tax receipt"
              sx={{ color: 'text.secondarydark' }}
              mb={2}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="No, a tax receipt is not necessary"
              sx={{ color: 'text.secondarydark' }}
            />
          </RadioGroup>
        </Grid>

        {/* Consent Checkbox - Confirmation for form submission */}
        <Grid item xs={12} md={12}>
          <FormLabel id="isConsentProvided">
            <Typography variant="body3" color="text.secondary">
              Disclaimer
            </Typography>{' '}
            <Box component="span" sx={{ color: 'error.main' }}>
              * {/* Asterisk for required field */}
            </Box>
          </FormLabel>
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={values?.isConsentProvided} // Bind checkbox state to Formik
                onChange={(event) => {
                  const isChecked = event.target.checked; // Get the checked state
                  setFieldValue('consentProvidedOn', new Date().toISOString()); // Set timestamp for consent
                  setFieldValue('isConsentProvided', isChecked); // Update Formik field with the checked state
                }}
              />
            }
            label="I hereby confirm that the above information is accurate and consent to its use for the purposes of managing the donation and fulfilling any legal and regulatory requirements."
            sx={{ color: 'text.secondarydark', my: 2 }}
          />
          {/* Error message for consent checkbox if touched and invalid */}
          {touched.isConsentProvided && errors.isConsentProvided && (
            <FormHelperText>{errors.isConsentProvided}</FormHelperText>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

Step2.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default Step2;
