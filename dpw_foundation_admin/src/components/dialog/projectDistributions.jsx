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
  Typography,
  useTheme
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale } from 'src/utils/formatTime';
import * as Yup from 'yup';
import DatePickers from '../datePicker';
import FieldWithSkeleton from '../FieldWithSkeleton';
import { CloseIcon } from '../icons';
import TextFieldSelect from '../TextFieldSelect';
import ModalStyle from './dialog.style';

ProjectDistributions.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default function ProjectDistributions({
  open,
  onClose,
  distributionData,
  refetchCampaignApi,
  isSingleDistribution = false
}) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const params = useParams();

  const distributionStatus = getLabelObject(masterData, 'dpw_foundation_campaign_distribution_status');

  const { mutate, isLoading } = useMutation('multiDistributionForSupervisor', api.multiDistributionForSupervisor, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      onClose();
      refetchCampaignApi();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const validationSchema = () => {
    return Yup.object().shape({
      actualDistributionValue: Yup.string()
        .matches(/^\d{1,15}$/, 'Must be a number with up to 15 digits')
        .required('Actual Distribution Value is required'),
      actualBeneficiaryNo: Yup.string()
        .matches(/^\d{1,15}$/, 'Must be a number with up to 15 digits')
        .required('Actual Beneficiary No is required'),
      actualDistributionStartTime: Yup.string().required('Actual Distribution Start Time is required'),
      actualDistributionEndTime: Yup.string().required('Actual Distribution End Time is required'),
      status: Yup.string().required('Status is required')
    });
  };

  const handleSubmitFinal = (values) => {
    const payload = {
      id: distributionData?.id,
      ...values
    };
    mutate({ id: params?.id, payload: payload, isType: isSingleDistribution });
  };

  return (
    <Dialog aria-label="projectDistributions" onClose={onClose} open={open} maxWidth={'lg'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Update Project Distributions
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={{
          actualDistributionValue: isSingleDistribution
            ? distributionData?.actualDistributionValue
            : distributionData?.actualDistributionValue || '',
          actualBeneficiaryNo: isSingleDistribution
            ? distributionData?.actualBeneficiaryNo
            : distributionData?.actualBeneficiaryNo || '',
          actualDistributionStartTime: isSingleDistribution
            ? distributionData?.actualDistributionStartTime
            : distributionData?.actualDistributionStartTime || '',
          actualDistributionEndTime: isSingleDistribution
            ? distributionData?.actualDistributionEndTime
            : distributionData?.actualDistributionEndTime || '',
          status: isSingleDistribution ? distributionData?.distributionStatus : distributionData?.status || ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmitFinal(values);
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, values, setFieldValue }) => {
          return (
            <Form id="distributionForm">
              <DialogContent>
                <Grid container spacing={3}>
                  {!isSingleDistribution && (
                    <>
                      <Grid item xs={2} md={4} lg={4}>
                        <Typography variant="body3" color="text.secondary">
                          Sector
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {getLabelByCode(
                            masterData,
                            'dpw_foundation_campaign_category',
                            distributionData?.distributionCategory
                          ) || '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} md={4} lg={4}>
                        <Typography variant="body3" color="text.secondary">
                          Target Beneficiaries
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {distributionData?.targetBeneficiaryNo || '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} md={4} lg={4}>
                        <Typography variant="body3" color="text.secondary">
                          Target Distribution Date
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {(distributionData?.distributionStartTime &&
                            fDateWithLocale(distributionData?.distributionStartTime, true)) ||
                            '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} md={4} lg={4}>
                        <Typography variant="body3" color="text.secondary">
                          Est. Distribution Value
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {distributionData?.estimatedDistributionValue || '-'}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="actualDistributionValue"
                        variant="standard"
                        inputProps={{ maxLength: 15, inputMode: 'numeric', pattern: '[0-9]*' }}
                        label={
                          <>
                            Actual Distribution Value{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        type="number"
                        {...getFieldProps('actualDistributionValue')}
                        error={touched.actualDistributionValue && !!errors.actualDistributionValue}
                        helperText={touched.actualDistributionValue && errors.actualDistributionValue}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="actualBeneficiaryNo"
                        variant="standard"
                        inputProps={{ maxLength: 15, inputMode: 'numeric', pattern: '[0-9]*' }}
                        label={
                          <>
                            Actual Benefited{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        type="number"
                        {...getFieldProps('actualBeneficiaryNo')}
                        error={Boolean(touched.actualBeneficiaryNo && errors.actualBeneficiaryNo)}
                        helperText={touched.actualBeneficiaryNo && errors.actualBeneficiaryNo}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <DatePickers
                      label={
                        <>
                          Actual Distribution Start Date{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      inputFormat={'yyyy-MM-dd'}
                      onChange={(newFromDate) => {
                        setFieldValue('actualDistributionStartTime', newFromDate);
                      }}
                      value={values?.actualDistributionStartTime}
                      handleClear={() => {
                        setFieldValue('actualDistributionStartTime', null);
                      }}
                      error={Boolean(touched.actualDistributionStartTime && errors.actualDistributionStartTime)}
                      helperText={touched.actualDistributionStartTime && errors.actualDistributionStartTime}
                    />
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <DatePickers
                      label={
                        <>
                          Actual Distribution End Date{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      inputFormat={'yyyy-MM-dd'}
                      onChange={(newFromDate) => {
                        setFieldValue('actualDistributionEndTime', newFromDate);
                      }}
                      value={values?.actualDistributionEndTime}
                      handleClear={() => {
                        setFieldValue('actualDistributionEndTime', null);
                      }}
                      error={Boolean(touched.actualDistributionEndTime && errors.actualDistributionEndTime)}
                      helperText={touched.actualDistributionEndTime && errors.actualDistributionEndTime}
                    />
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextFieldSelect
                        id="status"
                        label={
                          <>
                            Status{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        getFieldProps={getFieldProps}
                        itemsData={distributionStatus?.values}
                        error={Boolean(touched.status && errors.status)}
                        helperText={touched.status && errors.status}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button variant="outlinedWhite" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  form="distributionForm" // The form to be submitted
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
