'use client';
// mui
import { Box, Button, Card, CardContent, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
// api

// yup
// formik
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';

ContributionSection.propTypes = {
  // 'isLoading' is a boolean indicating whether the data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating whether the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};

const InKindForm = React.lazy(() => import('../inKindForm'));
const FormSkeleton = () => (
  <Stack gap={2}>
    <Skeleton variant="text" width="60%" height={30} />
    <Skeleton variant="rectangular" width="40%" height={30} />
  </Stack>
);

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
/**
 * ContributionSection component handles the display and management of contribution-related fields within the campaign form.
 * It adjusts the available contribution options based on the selected campaign type.
 *
 * @param {boolean} isEdit - Indicates if the component is in edit mode.
 * @param {boolean} isLoading - Indicates if the component is currently loading data.
 */
export default function ContributionSection({ isEdit, isLoading }) {
  const { handleBlur, setFieldError, setFieldValue, touched, errors, values } = useFormikContext();

  // Determine the available contribution options based on the campaign type
  const { masterData } = useSelector((state) => state?.common);
  const commonData = getLabelObject(masterData, 'dpw_foundation_common_yes_no');
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Stack
        gap={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" pb={3}>
          In Kind Contributions
        </Typography>
        {values?.isKindContributionRequired && (
          <Button
            size="small"
            variant="contained"
            disabled={!isEdit}
            onClick={() =>
              setFieldValue('campaignInKindContributions', [
                ...values.campaignInKindContributions,
                {
                  inKindItem: '',
                  inKindItemCode: '',
                  inKindItemDescription: '',
                  inKindUnit: '',
                  inKindType: '',
                  targetQuantity: ''
                }
              ])
            }
          >
            Add more Items
          </Button>
        )}
      </Stack>
      <Grid container spacing={2}>
        {values?.isKindContributionRequired && (
          <Grid item xs={12} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card variant="bordered">
                  <CardContent>
                    <Typography variant="body2" color="text.secondarydark">
                      Total In-Kind Contribution
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {values?.campaignInKindContributions.length || 0}
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
            error={touched.isKindContributionRequired && errors.isKindContributionRequired}
          >
            <TextFieldSelect
              id="isKindContributionRequired"
              label={
                <>
                  Is in-kind contribution required?{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={values?.isKindContributionRequired ? 'yes' : 'no'}
              onChange={(e) => {
                setFieldValue('isKindContributionRequired', e.target.value === 'yes');
                if (e.target.value === 'yes') {
                  setFieldValue('campaignInKindContributions', [
                    {
                      inKindItem: '',
                      inKindItemCode: '',
                      inKindItemDescription: '',
                      inKindUnit: '',
                      inKindType: '',
                      targetQuantity: ''
                    }
                  ]);
                } else {
                  setFieldError('campaignInKindContributions', null);
                  setFieldValue('campaignInKindContributions', []);
                }
              }}
              name="isKindContributionRequired"
              onBlur={handleBlur}
              itemsData={commonData?.values}
              error={touched.isKindContributionRequired && errors.isKindContributionRequired}
            />
          </FieldWithSkeleton>
        </Grid>
        {values?.isKindContributionRequired && (
          <Grid item xs={12} md={12}>
            <Suspense fallback={<FormSkeleton />}>
              <InKindForm isLoading={isLoading} isEdit={isEdit} />
            </Suspense>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
