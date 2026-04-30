import { Box, Card, CardContent, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { addDays, format } from 'date-fns';
import { useFormikContext } from 'formik';

import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';

import { getLabelObject } from 'src/utils/extractLabelValues';
import Distributions from './distributions';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
TimeLine.propTypes = {
  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};
/**
 * TimeLine component handles the timeline details for the campaign.
 * It provides form handling through Formik for managing the form state and validation.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isEdit - Flag to indicate whether the component is in edit mode.
 *
 * @returns {JSX.Element} The rendered TimeLine component.
 */
export default function TimeLine({ isEdit, isLoading, onDistribution }) {
  // Accessing Formik's methods and form state
  const { masterData } = useSelector((state) => state?.common);
  const { touched, errors, getFieldProps, setFieldError, handleBlur, setFieldValue, values } = useFormikContext();
  const campaignCategory = getLabelObject(masterData, 'dpw_foundation_campaign_category');
  const campaignCoverage = getLabelObject(masterData, 'dpw_foundation_campaign_coverage');
  const campaignBeneficiaries = getLabelObject(masterData, 'dpw_foundation_campaign_benificiary_type');
  const fCurrency = useCurrencyFormatter('AED');

  // Component logic goes here
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        {values?.campaignType === 'CHARITY' ? 'Project Distributions ' : 'Campaign Distribution '}
      </Typography>
      {values?.campaignType === 'CHARITY' && values?.campaignCategory && values?.campaignCategory !== 'GE' && (
        <Grid container spacing={2} item xs={12} sm={12} sx={{ pb: 3 }}>
          <Grid item xs={12} sm={6} md={3} display="flex">
            <Stack display="flex" flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
              <Card variant="bordered" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondarydark">
                    Total Target Beneficiaries
                  </Typography>
                  <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                    {values?.targetBeneficiaryNo || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3} display="flex">
            <Stack display="flex" flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
              <Card variant="bordered" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondarydark">
                    Estimated Distribution Value (AED)
                  </Typography>
                  <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                    {values?.estimatedDistributionValue ? fCurrency(values?.estimatedDistributionValue) : '0.00'}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.campaignCategory && errors.campaignCategory}>
            <TextFieldSelect
              id="campaignCategory"
              label={
                <>
                  Sector / Focus Area{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              value={values?.campaignCategory}
              onChange={(e) => {
                setFieldValue('campaignCategory', e.target.value);
                onDistribution(e.target.value);
                setFieldValue('distributions', []);
                if (e.target.value !== 'GE') {
                  setFieldError('distributions', null);
                }
              }}
              name="isKindContributionRequired"
              onBlur={handleBlur}
              itemsData={campaignCategory?.values}
              error={Boolean(touched.campaignCategory && errors.campaignCategory)}
              disabled={!isEdit}
              sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.campaignCoverage && errors.campaignCoverage}>
            <TextFieldSelect
              id="campaignCoverage"
              label={
                <>
                  {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '} Coverage{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={campaignCoverage?.values}
              error={Boolean(touched.campaignCoverage && errors.campaignCoverage)}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>

        {values?.campaignType === 'CHARITY' && values?.campaignCategory && values?.campaignCategory === 'GE' && (
          <Grid item xs={12} sm={12} lg={12}>
            <Distributions />
          </Grid>
        )}
        {values?.campaignType === 'CHARITY' && values?.campaignCategory && values?.campaignCategory !== 'GE' && (
          <>
            <Grid item xs={12} lg={12}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={touched.estimatedDistributionDescription && errors.estimatedDistributionDescription}
              >
                <TextField
                  id="estimatedDistributionDescription"
                  label={<>Sector Distribution Description </>}
                  {...getFieldProps('estimatedDistributionDescription')}
                  error={touched.estimatedDistributionDescription && Boolean(errors.estimatedDistributionDescription)}
                  fullWidth
                  variant="standard"
                  disabled={!isEdit}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={4}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={touched.estimatedDistributionValue && errors.estimatedDistributionValue}
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
                  {...getFieldProps('estimatedDistributionValue')}
                  error={touched.estimatedDistributionValue && Boolean(errors.estimatedDistributionValue)}
                  fullWidth
                  variant="standard"
                  disabled={!isEdit}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={4}>
              <FieldWithSkeleton isLoading={isLoading} error={touched.beneficiaryType && errors.beneficiaryType}>
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
                  getFieldProps={getFieldProps}
                  itemsData={campaignBeneficiaries?.values}
                  error={Boolean(touched.beneficiaryType && errors.beneficiaryType)}
                  disabled={!isEdit}
                  sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={4}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={touched.targetBeneficiaryNo && errors.targetBeneficiaryNo}
              >
                <TextField
                  id="targetBeneficiaryNo"
                  label={
                    <>
                      No Of Beneficiaries{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  {...getFieldProps('targetBeneficiaryNo')}
                  error={touched.targetBeneficiaryNo && Boolean(errors.targetBeneficiaryNo)}
                  fullWidth
                  variant="standard"
                  disabled={!isEdit}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} lg={12}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={touched.targetBeneficiaryDescription && errors.targetBeneficiaryDescription}
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
                  {...getFieldProps('targetBeneficiaryDescription')}
                  error={touched.targetBeneficiaryDescription && Boolean(errors.targetBeneficiaryDescription)}
                  fullWidth
                  variant="standard"
                  disabled={!isEdit}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <DatePickers
                label={
                  <>
                    Estimated distribution start date{' '}
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
                      setFieldValue('estimatedDistributionStartDate', formattedValue);
                    } catch (error) {
                      console.error('Invalid date value:', error);
                      setFieldValue('estimatedDistributionStartDate', null);
                    }
                  } else {
                    setFieldValue('estimatedDistributionStartDate', null);
                  }
                }}
                value={values?.estimatedDistributionStartDate ? new Date(values.estimatedDistributionStartDate) : null}
                type="date"
                fullWidth
                readOnly={true}
                disabled={!isEdit}
                error={touched.estimatedDistributionStartDate && Boolean(errors.estimatedDistributionStartDate)}
                helperText={touched.estimatedDistributionStartDate && errors.estimatedDistributionStartDate}
                minDate={new Date()}
                handleClear={() => {
                  setFieldValue('estimatedDistributionStartDate', null);
                  setFieldValue('estimatedDistributionEndDate', null);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <DatePickers
                label={
                  <>
                    Estimated distribution end date{' '}
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
                      setFieldValue('estimatedDistributionEndDate', formattedValue);
                    } catch (error) {
                      console.error('Invalid date value:', error);
                      setFieldValue('estimatedDistributionEndDate', null);
                    }
                  } else {
                    setFieldValue('estimatedDistributionEndDate', null);
                  }
                }}
                value={values?.estimatedDistributionEndDate || null}
                type="date"
                fullWidth
                minDate={
                  values.estimatedDistributionStartDate
                    ? addDays(new Date(values.estimatedDistributionStartDate), 1)
                    : new Date()
                }
                disabled={!isEdit}
                error={touched.estimatedDistributionEndDate && Boolean(errors.estimatedDistributionEndDate)}
                helperText={touched.estimatedDistributionEndDate && errors.estimatedDistributionEndDate}
                handleClear={() => setFieldValue('estimatedDistributionEndDate', null)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}
