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
import { Formik } from 'formik';
import { useParams } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getNumberColor } from 'src/utils/getNumberColor';
import * as Yup from 'yup';
import FieldWithSkeleton from '../FieldWithSkeleton';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

export default function UpdatePostProjectDetails({ open, onClose, data, refetchCampaignApi, isSingleDistribution }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const dispatch = useDispatch();
  const params = useParams();
  const { mutate, isLoading } = useMutation(
    'productImpactForManager',
    isSingleDistribution ? api.productImpactForSingleManager : api.productImpactForManager,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
        onClose();
        refetchCampaignApi();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const validationSchema = () => {
    return Yup.object().shape({
      impactUnit: Yup.string()
        .matches(/^[a-zA-Z0-9]{1,15}$/, 'Must be alphanumeric with up to 15 characters')
        .required('Impact Unit is required'),

      targetImpactValue: Yup.number()
        .typeError('Must be a valid number')
        .test(
          'len',
          'Must be a number with up to 15 digits',
          (val) => val !== undefined && val !== null && val.toString().replace('.', '').length <= 15
        )
        .required('Target Impact Number is required'),

      actualImpactValue: Yup.number()
        .typeError('Must be a valid number')
        .test(
          'len',
          'Must be a number with up to 15 digits',
          (val) => val !== undefined && val !== null && val.toString().replace('.', '').length <= 15
        )
        .required('Actual Impact Number is required'),

      impactDescription: Yup.string()
        .required('Impact Description is required')
        .max(250, 'Impact Description not more than 250 characters')
    });
  };

  const calculateSuccessRate = (target, actual) => {
    if (target && actual) {
      return (actual / target) * 100;
    }
    return 0;
  };
  const fCurrency = useCurrencyFormatter('AED');

  return (
    <Dialog aria-label="add-in-kind" onClose={onClose} open={open} maxWidth={'md'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Update Impact Details
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={{
          impactDescription: data?.impactDescription || '',
          impactUnit: data?.impactUnit || '',
          targetImpactValue: data?.targetImpactValue || '',
          actualImpactValue: data?.actualImpactValue || ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const payload = {
            id: data?.id,
            successRate: calculateSuccessRate(values.targetImpactValue, values.actualImpactValue),
            ...values
          };
          mutate({ payload: payload, id: params.id });
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, values }) => {
          return (
            <form id="updatePostProjectDetails">
              <DialogContent>
                <Grid container spacing={3}>
                  {!isSingleDistribution && (
                    <>
                      <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="body3" color="text.secondary">
                          Sector Name
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {getLabelByCode(masterData, 'dpw_foundation_campaign_category', data?.distributionCategory) ||
                            '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="body3" color="text.secondary">
                          Est Distribution Value (AED)
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {data?.estimatedDistributionValue?.toLocaleString()
                            ? fCurrency(data?.estimatedDistributionValue?.toLocaleString())
                            : '0:00'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="body3" color="text.secondary">
                          Actual Distribution Value (AED)
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {data?.actualDistributionValue ? fCurrency(data?.actualDistributionValue) : '0.00'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="body3" color="text.secondary">
                          Target Beneficiary
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {data?.targetBeneficiaryNo || '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="body3" color="text.secondary">
                          Actual Benefited
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {data?.actualDistributionValue || '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="body3" color="text.secondary">
                          Target Distribution Date
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {(data?.distributionStartTime && fDateWithLocale(data?.distributionStartTime, true)) || '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="body3" color="text.secondary">
                          Actual Distribution Date
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {(data?.actualDistributionStartTime &&
                            fDateWithLocale(data?.actualDistributionStartTime, true)) ||
                            '-' ||
                            '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="body3" color="text.secondary">
                          Success Rate
                        </Typography>
                        <Typography
                          variant="subtitle4"
                          color={getNumberColor(
                            calculateSuccessRate(values.targetImpactValue, values.actualImpactValue)
                          )}
                        >
                          {calculateSuccessRate(values.targetImpactValue, values.actualImpactValue) ||
                            data?.successRate ||
                            0}
                          %
                        </Typography>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="impactDescription"
                        variant="standard"
                        inputProps={{ maxLength: 250 }}
                        label={
                          <>
                            Impact Description{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('impactDescription')}
                        error={touched.impactDescription && !!errors.impactDescription}
                        helperText={touched.impactDescription && errors.impactDescription}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="impactUnit"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Impact Unit /Measure{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('impactUnit')}
                        error={Boolean(touched.impactUnit && errors.impactUnit)}
                        helperText={touched.impactUnit && errors.impactUnit}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="targetImpactValue"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Target Impact Number{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        type="number"
                        {...getFieldProps('targetImpactValue')}
                        error={Boolean(touched.targetImpactValue && errors.targetImpactValue)}
                        helperText={touched.targetImpactValue && errors.targetImpactValue}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="actualImpactValue"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Actual Impact Number{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('actualImpactValue')}
                        error={Boolean(touched.actualImpactValue && errors.actualImpactValue)}
                        helperText={touched.actualImpactValue && errors.actualImpactValue}
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
                  form="updatePostProjectDetails" // The form to be submitted
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
