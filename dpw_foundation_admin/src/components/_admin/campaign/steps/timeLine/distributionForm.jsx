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
import { addDays, format } from 'date-fns';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import ModalStyle from 'src/components/dialog/dialog.style';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { CloseIcon } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as Yup from 'yup';
/**
 * DistributionForm component
 *
 * This form component is used for creating or editing purchase orders. It includes file upload functionality,
 * validation, and handles form submission. It also integrates with API calls for file upload/download and
 * displays success/error messages through a toast notification.
 *
 * @component
 * @param {boolean} open - Flag indicating if the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onSubmit - Function to handle form submission with the purchase order data.
 * @param {boolean} isLoading - Flag indicating if the form is in a loading state.
 * @example
 * return <DistributionForm open={true} onClose={handleClose} onSubmit={handleSubmit} isLoading={false} />;
 */
const DistributionForm = ({ open, onClose, onSubmit, isLoading, distribution }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const campaignProjectSource = getLabelObject(masterData, 'dpw_foundation_project_fund_source');
  const campaignCategory = getLabelObject(masterData, 'dpw_foundation_campaign_category');
  const campaignBeneficiaries = getLabelObject(masterData, 'dpw_foundation_campaign_benificiary_type');

  const getInitialValues = (value, defaultValue) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value : defaultValue;
    }
    return value != null ? value : defaultValue;
  };

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      distributionCategory: getInitialValues(distribution?.distributionCategory, ''),
      estimatedDistributionValue: getInitialValues(distribution?.estimatedDistributionValue, ''),
      distributionDescription: getInitialValues(distribution?.distributionDescription, ''),
      distributionSource: getInitialValues(distribution?.distributionSource, ''),
      distributionStartTime: getInitialValues(distribution?.distributionStartTime, ''),
      distributionEndTime: getInitialValues(distribution?.distributionEndTime, ''),
      beneficiaryType: getInitialValues(distribution?.beneficiaryType, ''),
      targetBeneficiaryNo: getInitialValues(distribution?.targetBeneficiaryNo, ''),
      targetBeneficiaryDescription: getInitialValues(distribution?.targetBeneficiaryDescription, '')
    },
    validationSchema: Yup.object({
      distributionCategory: Yup.string().required('Sector is required'),
      estimatedDistributionValue: Yup.number()
        .required('Estimated distribution value is required')
        .positive('Value must be a positive number')
        .typeError('Please enter a valid number'),
      distributionSource: Yup.string().required('Source is required'),
      distributionDescription: Yup.string().required('Description is required'),
      distributionStartTime: Yup.string().required('Start time is required'),
      distributionEndTime: Yup.string().required('End time is required'),
      beneficiaryType: Yup.string().required('Type is required'),
      targetBeneficiaryNo: Yup.number()
        .required('Beneficiary No is required')
        .positive('Value must be a positive number')
        .typeError('Please enter a valid number'),
      targetBeneficiaryDescription: Yup.string().required('Beneficiary Description is required')
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values); // Pass the payload to the parent onSubmit handler
      formik.resetForm(); // Reset the form after submission
    }
  });

  // Handle modal close and form reset
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          Create Distribution
        </DialogTitle>
        <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={formik.touched.distributionCategory && formik.errors.distributionCategory}
              >
                <TextFieldSelect
                  id="distributionCategory"
                  label={
                    <>
                      Sector / Focus Area{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  getFieldProps={formik.getFieldProps}
                  itemsData={campaignCategory?.values?.filter((item) => item.code !== 'GE')}
                  error={Boolean(formik.touched.distributionCategory && formik.errors.distributionCategory)}
                  sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={4}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={formik.touched.estimatedDistributionValue && formik.errors.estimatedDistributionValue}
              >
                <TextField
                  id="estimatedDistributionValue"
                  label={
                    <>
                      Estimated Distribution Value{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  {...formik.getFieldProps('estimatedDistributionValue')}
                  error={formik.touched.estimatedDistributionValue && Boolean(formik.errors.estimatedDistributionValue)}
                  fullWidth
                  variant="standard"
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={4}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={formik.touched.distributionSource && formik.errors.distributionSource}
              >
                <TextFieldSelect
                  id="distributionSource"
                  label={
                    <>
                      Project Fund Source{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  getFieldProps={formik.getFieldProps}
                  itemsData={campaignProjectSource?.values}
                  error={Boolean(formik.touched.distributionSource && formik.errors.distributionSource)}
                  sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={12}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={formik.touched.distributionDescription && formik.errors.distributionDescription}
              >
                <TextField
                  id="distributionDescription"
                  label={<>Sector Distribution Description </>}
                  {...formik.getFieldProps('distributionDescription')}
                  error={formik.touched.distributionDescription && Boolean(formik.errors.distributionDescription)}
                  fullWidth
                  variant="standard"
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={12}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={formik.touched.targetBeneficiaryDescription && formik.errors.targetBeneficiaryDescription}
              >
                <TextField
                  id="targetBeneficiaryDescription"
                  label={
                    <>
                      Target Beneficiary Description{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  {...formik.getFieldProps('targetBeneficiaryDescription')}
                  error={
                    formik.touched.targetBeneficiaryDescription && Boolean(formik.errors.targetBeneficiaryDescription)
                  }
                  fullWidth
                  variant="standard"
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={formik.touched.beneficiaryType && formik.errors.beneficiaryType}
              >
                <TextFieldSelect
                  id="beneficiaryType"
                  label={
                    <>
                      Type Of Beneficiary{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  getFieldProps={formik.getFieldProps}
                  itemsData={campaignBeneficiaries?.values}
                  error={Boolean(formik.touched.beneficiaryType && formik.errors.beneficiaryType)}
                  sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={formik.touched.targetBeneficiaryNo && formik.errors.targetBeneficiaryNo}
              >
                <TextField
                  id="targetBeneficiaryNo"
                  label={
                    <>
                      No Of Target Beneficiaries{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  {...formik.getFieldProps('targetBeneficiaryNo')}
                  error={formik.touched.targetBeneficiaryNo && Boolean(formik.errors.targetBeneficiaryNo)}
                  fullWidth
                  variant="standard"
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <DatePickers
                label={
                  <>
                    Estimated Distribution Start Date{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputFormat={'yyyy-MM-dd'}
                onChange={(value) => {
                  if (value) {
                    // Ensure the value is a valid date before formatting
                    try {
                      const formattedValue = format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss");
                      formik.setFieldValue('distributionStartTime', formattedValue);
                    } catch (error) {
                      console.error('Invalid date value:', error);
                      formik.setFieldValue('distributionStartTime', null);
                    }
                  } else {
                    formik.setFieldValue('distributionStartTime', null);
                  }
                }}
                value={formik.values?.distributionStartTime ? new Date(formik.values.distributionStartTime) : null}
                type="date"
                fullWidth
                readOnly={true}
                error={formik.touched.distributionStartTime && Boolean(formik.errors.distributionStartTime)}
                helperText={formik.touched.distributionStartTime && formik.errors.distributionStartTime}
                minDate={new Date()}
                handleClear={() => {
                  formik.setFieldValue('distributionStartTime', null);
                  formik.setFieldValue('distributionEndTime', null);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <DatePickers
                label={
                  <>
                    Estimated Distribution End Date{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputFormat={'yyyy-MM-dd'}
                onChange={(value) => {
                  if (value) {
                    try {
                      const formattedValue = format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss");
                      formik.setFieldValue('distributionEndTime', formattedValue);
                    } catch (error) {
                      console.error('Invalid date value:', error);
                      formik.setFieldValue('distributionEndTime', null);
                    }
                  } else {
                    formik.setFieldValue('distributionEndTime', null);
                  }
                }}
                value={formik.values?.distributionEndTime || null}
                type="date"
                fullWidth
                minDate={
                  formik.values.distributionStartTime
                    ? addDays(new Date(formik.values.distributionStartTime), 1)
                    : new Date()
                }
                error={formik.touched.distributionEndTime && Boolean(formik.errors.distributionEndTime)}
                helperText={formik.touched.distributionEndTime && formik.errors.distributionEndTime}
                handleClear={() => formik.setFieldValue('distributionEndTime', null)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlinedWhite">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} sx={{ ml: 'auto' }}>
            Create
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
DistributionForm.propTypes = {
  open: PropTypes.bool.isRequired, // Validates 'open' as a required boolean
  onClose: PropTypes.func.isRequired, // Validates 'onClose' as a required function
  onSubmit: PropTypes.func.isRequired, // Validates 'onSubmit' as a required function
  isLoading: PropTypes.bool // Validates 'isLoading' as an optional boolean
};
export default DistributionForm;
