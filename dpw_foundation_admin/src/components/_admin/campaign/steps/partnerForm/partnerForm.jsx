'use client';
import { Box, Button, Card, CardContent, Grid, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as partnershipApi from 'src/services/partner';
import { getLabelObject } from 'src/utils/extractLabelValues';
import StepperStyle from '../stepper.styles';

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
PartnerForm.propTypes = {
  // 'isLoading' is a boolean indicating whether data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating whether the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};
/**
 * PartnerForm component is used for managing the partner-related information in the form.
 * It includes form fields for partner details, with validation and dynamic updates based on form values.
 *
 * @param {Object} props - Component properties
 * @param {boolean} props.isLoading - Flag indicating if data is currently being loaded.
 * @param {boolean} props.isEdit - Flag indicating whether the form is in edit mode.
 *
 * @returns {JSX.Element} The rendered PartnerForm component.
 */
export default function PartnerForm({ isLoading, isEdit }) {
  // Accessing master data from the Redux store
  const { masterData } = useSelector((state) => state?.common);
  // Extracting common "Yes/No" options from master data
  const commonYesNo = getLabelObject(masterData, 'dpw_foundation_common_yes_no');

  // Accessing form context values and methods using Formik
  const { values, handleBlur, touched, errors, setFieldValue, setFieldError } = useFormikContext();

  // Using Material-UI's theme and creating custom styles
  const theme = useTheme();
  const styles = StepperStyle(theme);

  const initPartnerObject = {
    partnerId: '',
    userId: ''
  };

  const { data: partnerListData } = useQuery(
    ['partnerNameEmail'],
    () =>
      partnershipApi.approvedPartnersPagination({
        page: 1,
        rows: 1000,
        sort: '',
        payload: {
          keyword: '',
          statuses: [],
          createdDate: {
            fromDate: '',
            toDate: ''
          },
          datePattern: 'M/d/yyyy'
        }
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      select: (data) => {
        const fetchedList = data?.data?.content || [];
        return fetchedList.map((partner) => ({
          ...partner,
          label: `${partner?.organizationName} (${partner?.email})`,
          code: partner?.id
        }));
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response?.data?.message, variant: 'error' }));
      }
    }
  );

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Stack
        gap={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ pb: 3 }}
      >
        <Typography variant="h6" textTransform={'uppercase'} color="text.black">
          Partner Requirement
        </Typography>
        {values?.isPartnerRequired && (
          <Button
            size="small"
            variant="contained"
            disabled={!isEdit}
            onClick={() => setFieldValue('campaignPartners', [...values.campaignPartners, { ...initPartnerObject }])}
          >
            Add More partners
          </Button>
        )}
      </Stack>
      <Grid container spacing={2}>
        {values?.isPartnerRequired && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card variant="bordered" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondarydark">
                      Total Partners
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {values?.campaignPartners?.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.isPartnerRequired && errors.isPartnerRequired}>
            <TextFieldSelect
              id="isPartnerRequired"
              label={
                <>
                  Partners Required for This {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '}?{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={values?.isPartnerRequired ? 'yes' : 'no'}
              onChange={(e) => {
                setFieldValue('isPartnerRequired', e.target.value === 'yes');
                if (e.target.value === 'yes') {
                  setFieldValue('campaignPartners', [{ ...initPartnerObject }]);
                } else {
                  setFieldError('campaignPartners', null);
                  setFieldValue('campaignPartners', []);
                }
              }}
              name="isPartnerRequired"
              onBlur={handleBlur}
              itemsData={commonYesNo?.values}
              error={touched.isPartnerRequired && errors.isPartnerRequired}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>

        {values?.isPartnerRequired && (
          <Grid item xs={12}>
            <FieldArray name="campaignPartners">
              {({ remove }) => (
                <>
                  {values.campaignPartners.map((_, index) => (
                    <Box
                      sx={{ ...styles.moreBox, pb: 1 }}
                      key={`${values.campaignPartners?.[index]?.partnerId || 'partner-' + index}`}
                    >
                      <Grid container rowSpacing={2} gap={4}>
                        <Grid item xs={12} sm={8} lg={5}>
                          <FieldWithSkeleton
                            isLoading={isLoading}
                            error={
                              touched.campaignPartners?.[index]?.partnerId &&
                              errors.campaignPartners?.[index]?.partnerId
                            }
                          >
                            <TextFieldSelect
                              id={`campaignPartners[${index}].partnerId`}
                              name={`campaignPartners[${index}].partnerId`}
                              label={
                                <>
                                  Partner Organization Name with Email ID{' '}
                                  <Box component="span" sx={{ color: 'error.main' }}>
                                    *
                                  </Box>
                                </>
                              }
                              onChange={(e) => {
                                let selectedPartner = (partnerListData || []).find(
                                  (partner) => partner.code === e.target.value
                                );
                                if (selectedPartner) {
                                  selectedPartner = {
                                    ...selectedPartner,
                                    partnerId: selectedPartner.code
                                  };
                                  setFieldValue(`campaignPartners[${index}]`, selectedPartner);
                                }
                              }}
                              itemsData={partnerListData || []}
                              value={values?.campaignPartners[index].partnerId || ''}
                              disabled={!isEdit}
                              errors={
                                touched.campaignPartners?.[index]?.partnerId &&
                                errors.campaignPartners?.[index]?.partnerId
                              }
                            />
                          </FieldWithSkeleton>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Stack direction="column" gap={0.5}>
                              <Typography variant="body3" color="text.secondary">
                                Partner Company Name{' '}
                              </Typography>
                              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                                {values?.campaignPartners[index]?.organizationName || '-'}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Stack direction="column" gap={0.5}>
                              <Typography variant="body3" color="text.secondary">
                                Contact Name{' '}
                              </Typography>
                              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                                {(values?.campaignPartners[index]?.firstName &&
                                  values?.campaignPartners[index]?.lastName &&
                                  values?.campaignPartners[index]?.firstName +
                                    ' ' +
                                    values?.campaignPartners[index]?.lastName) ||
                                  '-'}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Stack direction="column" gap={0.5}>
                              <Typography variant="body3" color="text.secondary">
                                Contact Number
                              </Typography>
                              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                                {values?.campaignPartners[index]?.phoneNumber || '-'}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Stack direction="column" gap={0.5}>
                            <Typography variant="body3" color="text.secondary">
                              Email ID{' '}
                            </Typography>
                            <Typography variant="subtitle4" color="text.secondarydark" textTransform="lowercase">
                              {values?.campaignPartners[index]?.email || '-'}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={styles.deleteIcon}>
                            {values.campaignPartners.length > 1 && (
                              <IconButton onClick={() => remove(index)}>
                                <DeleteIconRed />
                              </IconButton>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </>
              )}
            </FieldArray>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
