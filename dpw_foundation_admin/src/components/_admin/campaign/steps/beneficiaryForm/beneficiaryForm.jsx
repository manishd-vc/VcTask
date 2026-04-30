'use client';
import { Box, Button, Chip, Grid, IconButton, Paper, Stack, TextField, Typography, useTheme } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
import StepperStyle from '../stepper.styles';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

BeneficiaryForm.propTypes = {
  // 'isLoading' is a boolean indicating the loading state
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating if the form is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the form is in approve mode
  isApprove: PropTypes.bool.isRequired
};

/**
 * BeneficiaryForm component handles the form for managing campaign beneficiaries.
 * It retrieves master data for beneficiary types and calculates the total number
 * of beneficiaries based on the form values. Formik is used for form handling.
 *
 * @param {boolean} isLoading - Indicates if the form data is currently loading.
 * @param {boolean} isEdit - Indicates if the form is in edit mode.
 * @param {boolean} isApprove - Indicates if the form is in approval mode.
 */
export default function BeneficiaryForm({ isLoading, isEdit, isApprove }) {
  const { masterData } = useSelector((state) => state?.common);
  const campaignBeneficiaries = getLabelObject(masterData, 'dpw_foundation_campaign_benificiary_type');

  const { values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormikContext();
  const theme = useTheme();
  const styles = StepperStyle(theme);
  const totalBeneficiariesCount = useMemo(() => {
    return values.campaignBeneficiaries.reduce(
      (total, { targetBeneficiaryNo }) => total + (Number(targetBeneficiaryNo) || 0),
      0
    );
  }, [values.campaignBeneficiaries]);

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Box sx={{ pb: 2 }}>
        <Stack
          gap={3}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ pb: 3 }}
        >
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Beneficiary Details
          </Typography>
          {!isApprove && (
            <Button
              variant="contained"
              size="small"
              disabled={!isEdit}
              onClick={() =>
                setFieldValue('campaignBeneficiaries', [
                  ...values.campaignBeneficiaries,
                  {
                    beneficiaryType: '',
                    targetBeneficiaryNo: '0',
                    targetBeneficiaryDescription: ''
                  }
                ])
              }
            >
              Add More Beneficiaries
            </Button>
          )}
        </Stack>
        <Stack gap={2} justifyContent="flex-start" flexDirection="row" alignItems="center">
          <Typography variant="subtitle2" textTransform={'uppercase'} color="text.black">
            Total Beneficiaries:
          </Typography>
          <Chip label={totalBeneficiariesCount} variant="grey" size="small" />
        </Stack>
      </Box>
      <Box>
        <FieldArray name="campaignBeneficiaries">
          {({ remove }) => (
            <>
              {values.campaignBeneficiaries.map((_, index) => (
                <Box sx={{ ...styles.moreBox }} key={values?.campaignBeneficiaries[index].beneficiaryType}>
                  <Grid container rowSpacing={2} spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={
                          touched.campaignBeneficiaries?.[index]?.beneficiaryType &&
                          errors.campaignBeneficiaries?.[index]?.beneficiaryType
                        }
                      >
                        <TextFieldSelect
                          id={`campaignBeneficiaries-${index}-beneficiaryType`}
                          label={
                            <>
                              Type of Beneficiary{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                          name={`campaignBeneficiaries[${index}].beneficiaryType`}
                          value={values?.campaignBeneficiaries[index].beneficiaryType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.campaignBeneficiaries?.[index]?.beneficiaryType &&
                            errors.campaignBeneficiaries?.[index]?.beneficiaryType
                          }
                          itemsData={campaignBeneficiaries?.values}
                          disabled={!isEdit}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={
                          touched.campaignBeneficiaries?.[index]?.targetBeneficiaryNo &&
                          !!errors.campaignBeneficiaries?.[index]?.targetBeneficiaryNo
                        }
                      >
                        <TextField
                          fullWidth
                          name={`campaignBeneficiaries[${index}].targetBeneficiaryNo`}
                          value={values.campaignBeneficiaries[index].targetBeneficiaryNo?.toString()}
                          onBlur={handleBlur}
                          error={
                            touched.campaignBeneficiaries?.[index]?.targetBeneficiaryNo &&
                            !!errors.campaignBeneficiaries?.[index]?.targetBeneficiaryNo
                          }
                          helperText={
                            touched.campaignBeneficiaries?.[index]?.targetBeneficiaryNo &&
                            errors.campaignBeneficiaries?.[index]?.targetBeneficiaryNo
                          }
                          variant="standard"
                          label={
                            <>
                              No of Target Beneficiaries{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value)) {
                              setFieldValue(`campaignBeneficiaries[${index}].targetBeneficiaryNo`, Number(value)); // Store as a number
                            }
                          }}
                          type="number"
                          disabled={!isEdit}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={
                          touched.campaignBeneficiaries?.[index]?.targetBeneficiaryDescription &&
                          !!errors.campaignBeneficiaries?.[index]?.targetBeneficiaryDescription
                        }
                      >
                        <TextField
                          fullWidth
                          variant="standard"
                          name={`campaignBeneficiaries[${index}].targetBeneficiaryDescription`}
                          value={values.campaignBeneficiaries[index].targetBeneficiaryDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.campaignBeneficiaries?.[index]?.targetBeneficiaryDescription &&
                            !!errors.campaignBeneficiaries?.[index]?.targetBeneficiaryDescription
                          }
                          disabled={!isEdit}
                          helperText={
                            touched.campaignBeneficiaries?.[index]?.targetBeneficiaryDescription &&
                            errors.campaignBeneficiaries?.[index]?.targetBeneficiaryDescription
                          }
                          label={
                            <>
                              Target Beneficiary Description{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                        />
                      </FieldWithSkeleton>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Box sx={styles.deleteIcon}>
                        {values.campaignBeneficiaries.length > 1 && (
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
      </Box>
    </Paper>
  );
}
