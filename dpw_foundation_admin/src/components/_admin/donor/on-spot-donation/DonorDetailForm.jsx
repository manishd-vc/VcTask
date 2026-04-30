import { Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import TextFieldSelect from 'src/components/TextFieldSelect';
import DocumentDetail from './DocumentDetail';
import PaymentThrough from './PaymentThrough';

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

/**
 * Component for rendering the donor detail form.
 * @param {Object} props - Props for the component.
 * @returns {JSX.Element} Rendered component.
 */
function DonorDetailForm(props) {
  const {
    userLoading,
    isExistingUser,
    genders,
    country,
    projectStateData,
    citiesData,
    currencyData,
    userDetail,
    documentTypesData,
    setFileDetail,
    maxPhotoSizeKB,
    uploadCount,
    isEdit,
    formFieldReadOnly,
    fileDetail,
    showUploadError,
    errorPaymentOption,
    setErrorPaymentOption
  } = props;
  const { errors, getFieldProps, touched, setFieldValue, values } = useFormikContext();

  const enableFormField = (field) => (isExistingUser && formFieldReadOnly?.[field]) || isEdit;

  /**
   * Render a text field with validation.
   * @param {string} id - Field ID.
   * @param {string} label - Field label.
   * @param {string} field - Field name.
   * @param {boolean} isRequired - Whether the field is required.
   * @param {boolean} isReadOnly - Whether the field is read-only.
   * @param {number} maxLength - max length of input.
   * @returns {JSX.Element} Rendered text field.
   */
  const renderTextField = (id, label, field, isRequired = false, isReadOnly = false, maxLength = 35) => (
    <FieldWithSkeleton isLoading={userLoading} error={touched[field] && errors[field]}>
      <TextField
        id={id}
        variant="standard"
        label={label}
        inputProps={{ maxLength: maxLength }}
        required={isRequired}
        fullWidth
        {...getFieldProps(field)}
        error={Boolean(touched[field] && errors[field])}
        InputProps={{ readOnly: isReadOnly }}
      />
    </FieldWithSkeleton>
  );

  /**
   * Render a select field with validation.
   * @param {string} id - Field ID.
   * @param {string} label - Field label.
   * @param {string} field - Field name.
   * @param {Array} itemsData - Items for the select field.
   * @param {boolean} isRequired - Whether the field is required.
   * @returns {JSX.Element} Rendered select field.
   */
  const renderSelectField = (id, label, field, itemsData, isRequired = false, isReadOnly = false) => (
    <FieldWithSkeleton isLoading={userLoading} error={touched[field] && errors[field]}>
      <TextFieldSelect
        id={id}
        label={label}
        getFieldProps={getFieldProps}
        itemsData={itemsData}
        value={values[field]}
        required={isRequired}
        error={Boolean(touched[field] && errors[field])}
        InputProps={{ readOnly: isReadOnly }}
      />
    </FieldWithSkeleton>
  );

  const donationText = 'Purpose of Donation';
  return (
    <Paper sx={{ p: 3, mt: 2, mb: 5 }}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
            Donor Information Form
          </Typography>
        </Grid>

        {/* Render fields */}
        <Grid item xs={12} md={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {values?.accountType || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Email ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {values?.email || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary" textTransform="capitalize">
              First Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {values?.firstName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary" textTransform="capitalize">
              Second Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {values?.lastName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {values?.mobile || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSelectField('gender', 'Select Gender', 'gender', genders?.values, true, enableFormField('gender'))}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSelectField(
            'currentCountryOfResidence',
            'Select Country',
            'currentCountryOfResidence',
            country,
            true,
            enableFormField('currentCountryOfResidence')
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSelectField(
            'state',
            'Select State/Province',
            'state',
            projectStateData,
            true,
            enableFormField('state')
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSelectField('city', 'Select City', 'city', citiesData, true, enableFormField('city'))}
        </Grid>
        <Grid item xs={12} md={4}>
          <NumericFormat
            id="donationAmount"
            label="Donation Amount Pledged"
            customInput={TextField}
            variant="standard"
            fullWidth
            required
            allowNegative={false}
            thousandSeparator
            inputProps={{ maxLength: 15 }}
            value={values.donationAmount}
            onValueChange={(val) => {
              setFieldValue('donationAmount', val.value);
            }}
            error={Boolean(touched.donationAmount && errors.donationAmount)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          {renderSelectField(
            'currency',
            'Currency',
            'currency',
            currencyData?.values,
            true,
            enableFormField('currency')
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          {renderTextField('intentDescription', donationText, 'intentDescription', true, isEdit, 256)}
        </Grid>

        {/* Additional Components */}
        <DocumentDetail
          userDetail={userDetail}
          userLoading={userLoading}
          documentTypesData={documentTypesData}
          setFileDetail={setFileDetail}
          maxPhotoSizeKB={maxPhotoSizeKB}
          uploadCount={uploadCount}
          isEdit={isEdit}
          fileDetail={fileDetail}
          showUploadError={showUploadError}
        />
        <PaymentThrough
          isEdit={isEdit}
          errorPaymentOption={errorPaymentOption}
          setErrorPaymentOption={setErrorPaymentOption}
        />
      </Grid>
    </Paper>
  );
}

DonorDetailForm.propTypes = {
  userLoading: PropTypes.bool.isRequired,
  isExistingUser: PropTypes.bool.isRequired,
  genders: PropTypes.object.isRequired,
  country: PropTypes.array.isRequired,
  projectStateData: PropTypes.array.isRequired,
  citiesData: PropTypes.array.isRequired,
  currencyData: PropTypes.object.isRequired,
  userDetail: PropTypes.object.isRequired,
  documentTypesData: PropTypes.object.isRequired,
  setFileDetail: PropTypes.func.isRequired,
  maxPhotoSizeKB: PropTypes.number.isRequired,
  uploadCount: PropTypes.number.isRequired,
  isEdit: PropTypes.bool,
  formFieldReadOnly: PropTypes.object,
  setOpenModal: PropTypes.bool,
  fileDetail: PropTypes.object,
  showUploadError: PropTypes.string,
  errorPaymentOption: PropTypes.bool,
  setErrorPaymentOption: PropTypes.bool
};

export default DonorDetailForm;
