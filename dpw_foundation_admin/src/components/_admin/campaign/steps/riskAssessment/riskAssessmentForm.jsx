'use client';
// mui
import { Box, Button, Card, CardContent, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
const RiskForm = React.lazy(() => import('../riskForm'));
const FormSkeleton = () => (
  <Stack gap={2}>
    <Skeleton variant="text" width="60%" height={30} />
    <Skeleton variant="rectangular" width="40%" height={30} />
  </Stack>
);

RiskAssessmentForm.propTypes = {
  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isLoading' is a boolean indicating if data is currently loading
  isLoading: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the component is in approve mode
  isApprove: PropTypes.bool.isRequired
};

/**
 * RiskAssessmentForm component displays related tasks for the current campaign.
 * It conditionally renders a RiskForm component and uses a skeleton loader while the data is loading.
 *
 * @param {Object} props - Component properties
 * @param {boolean} props.isEdit - Flag indicating whether the form is in edit mode.
 * @param {boolean} props.isLoading - Flag indicating if the data is still loading.
 * @param {boolean} props.isApprove - Flag indicating if the campaign is in approve mode.
 *
 * @returns {JSX.Element} The rendered RiskAssessmentForm component.
 */
export default function RiskAssessmentForm({ isEdit, isLoading }) {
  // Accessing campaign update data from the Redux store

  // Determine the available contribution options based on the campaign type
  const { masterData } = useSelector((state) => state?.common);
  const commonData = getLabelObject(masterData, 'dpw_foundation_common_yes_no');
  const riskData = getLabelObject(masterData, 'dpw_foundation_campaign_risk');

  // Getting values and setFieldValue from Formik context to handle form state
  const { values, setFieldValue, touched, errors, handleBlur, setFieldError } = useFormikContext();

  // Component rendering logic goes here
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Stack
        gap={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={3}
      >
        <Typography variant="h6" textTransform={'uppercase'} color="text.black">
          Risk Assessment
        </Typography>
        {values?.isRiskAssessmentRequired && (
          <Button
            size="small"
            variant="contained"
            disabled={!isEdit}
            onClick={() =>
              setFieldValue('risksInvolved', [
                ...values.risksInvolved,
                {
                  riskCode: '',
                  severity: '',
                  likelyhood: '',
                  riskLevel: '',
                  riskDescription: '',
                  controlMeasure: ''
                }
              ])
            }
          >
            Add more Items
          </Button>
        )}
      </Stack>
      <Grid container spacing={2}>
        {values?.isRiskAssessmentRequired && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card variant="bordered" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondarydark">
                      Total Risks
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {values?.risksInvolved.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.isRiskAssessmentRequired && errors.isRiskAssessmentRequired}
          >
            <TextFieldSelect
              id="isRiskAssessmentRequired"
              label={
                <>
                  {' '}
                  {values?.campaignType === 'CHARITY'
                    ? 'Is there any sub task associated with this Project '
                    : 'Is risk assessment done '}
                  ?{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={values?.isRiskAssessmentRequired ? 'yes' : 'no'}
              onChange={(e) => {
                setFieldValue('isRiskAssessmentRequired', e.target.value === 'yes');
                if (e.target.value === 'yes') {
                  setFieldValue('risksInvolved', [
                    {
                      riskCode: '',
                      severity: '',
                      likelyhood: '',
                      riskLevel: '',
                      riskDescription: '',
                      controlMeasure: ''
                    }
                  ]);
                } else {
                  setFieldError('risksInvolved', null);
                  setFieldValue('risksInvolved', []);
                }
              }}
              name="isRiskAssessmentRequired"
              onBlur={handleBlur}
              itemsData={commonData?.values}
              error={touched.isRiskAssessmentRequired && errors.isRiskAssessmentRequired}
            />
          </FieldWithSkeleton>
        </Grid>

        {values?.isRiskAssessmentRequired && (
          <Grid item xs={12} md={12}>
            <Suspense fallback={<FormSkeleton />}>
              <RiskForm
                isLoading={isLoading}
                isEdit={isEdit}
                severityData={riskData}
                likelyhoodData={riskData}
                riskLevelData={riskData}
              />
            </Suspense>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
