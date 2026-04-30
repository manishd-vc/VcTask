'use client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
import StepperStyle from '../stepper.styles';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

TargetForm.propTypes = {
  // 'isLoading' is a boolean indicating the loading state
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating if the form is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the form is in approve mode
  isApprove: PropTypes.bool.isRequired
};

/**
 * TargetForm component handles the form for managing campaign beneficiaries.
 * It retrieves master data for beneficiary types and calculates the total number
 * of beneficiaries based on the form values. Formik is used for form handling.
 *
 * @param {boolean} isLoading - Indicates if the form data is currently loading.
 * @param {boolean} isEdit - Indicates if the form is in edit mode.
 * @param {boolean} isApprove - Indicates if the form is in approval mode.
 */
export default function TargetForm({ isLoading, isEdit, isApprove }) {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue, getFieldProps } = useFormikContext();
  const theme = useTheme();
  const { masterData } = useSelector((state) => state?.common);
  const styles = StepperStyle(theme);
  const currency = getLabelObject(masterData, 'dpw_foundation_currency');
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <>
        <Stack
          gap={3}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Campaign Targets
          </Typography>
          {!isApprove && (
            <Button
              variant="contained"
              size="small"
              disabled={!isEdit}
              onClick={() =>
                setFieldValue('campaignTargets', [
                  ...values.campaignTargets,
                  {
                    targetUnit: '',
                    targetNumber: '0',
                    targetDescription: ''
                  }
                ])
              }
            >
              Add Targets
            </Button>
          )}
        </Stack>
        {values?.campaignTargets?.length > 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card variant="bordered" sx={{ my: 3 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondarydark">
                    Total Targets
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {values?.campaignTargets?.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.fundraisingTarget && errors.fundraisingTarget}>
            <TextField
              id="fundraisingTarget"
              label={
                <>
                  Set Fundraising Target
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              {...getFieldProps('fundraisingTarget')}
              error={touched.fundraisingTarget && Boolean(errors.fundraisingTarget)}
              fullWidth
              variant="standard"
              onChange={(e) => {
                const value = e.target.value;
                if (!isNaN(value)) {
                  setFieldValue('fundraisingTarget', Number(value)); // Store as a number
                }
              }}
              type="number"
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.fundraisingTargetCurrency && errors.fundraisingTargetCurrency}
          >
            <TextFieldSelect
              id="fundraisingTargetCurrency"
              label={
                <>
                  Currency{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={currency?.values}
              error={Boolean(touched.fundraisingTargetCurrency && errors.fundraisingTargetCurrency)}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
      <Box>
        <FieldArray name="campaignTargets">
          {({ remove }) => (
            <>
              {values.campaignTargets.map((_, index) => (
                <Box sx={{ ...styles.moreBox }} key={values.campaignTargets[index]?.id ?? `target-${index}`}>
                  <Grid container rowSpacing={2} spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={
                          touched.campaignTargets?.[index]?.targetDescription &&
                          !!errors.campaignTargets?.[index]?.targetDescription
                        }
                      >
                        <TextField
                          fullWidth
                          variant="standard"
                          name={`campaignTargets[${index}].targetDescription`}
                          value={values.campaignTargets[index].targetDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.campaignTargets?.[index]?.targetDescription &&
                            !!errors.campaignTargets?.[index]?.targetDescription
                          }
                          disabled={!isEdit}
                          helperText={
                            touched.campaignTargets?.[index]?.targetDescription &&
                            errors.campaignTargets?.[index]?.targetDescription
                          }
                          label={
                            <>
                              Target Description{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={
                          touched.campaignTargets?.[index]?.targetUnit && !!errors.campaignTargets?.[index]?.targetUnit
                        }
                      >
                        <TextField
                          fullWidth
                          variant="standard"
                          name={`campaignTargets[${index}].targetUnit`}
                          value={values.campaignTargets[index].targetUnit}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.campaignTargets?.[index]?.targetUnit &&
                            !!errors.campaignTargets?.[index]?.targetUnit
                          }
                          disabled={!isEdit}
                          helperText={
                            touched.campaignTargets?.[index]?.targetUnit && errors.campaignTargets?.[index]?.targetUnit
                          }
                          label={
                            <>
                              Target Unit{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={
                          touched.campaignTargets?.[index]?.targetNumber &&
                          !!errors.campaignTargets?.[index]?.targetNumber
                        }
                      >
                        <TextField
                          fullWidth
                          name={`campaignTargets[${index}].targetNumber`}
                          value={values.campaignTargets[index].targetNumber?.toString()}
                          onBlur={handleBlur}
                          error={
                            touched.campaignTargets?.[index]?.targetNumber &&
                            !!errors.campaignTargets?.[index]?.targetNumber
                          }
                          helperText={
                            touched.campaignTargets?.[index]?.targetNumber &&
                            errors.campaignTargets?.[index]?.targetNumber
                          }
                          variant="standard"
                          label={
                            <>
                              Target Number{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value)) {
                              setFieldValue(`campaignTargets[${index}].targetNumber`, Number(value)); // Store as a number
                            }
                          }}
                          type="number"
                          disabled={!isEdit}
                        />
                      </FieldWithSkeleton>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Box sx={styles.deleteIcon}>
                        {values.campaignTargets.length > 1 && (
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
