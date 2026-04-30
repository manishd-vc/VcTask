'use client';
import { Box, Grid, IconButton, TextField, useTheme } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import StepperStyle from './stepper.styles';

// Lazy loading FieldWithSkeleton to reduce initial bundle size
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
RiskForm.propTypes = {
  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the component is in approve mode
  isLoading: PropTypes.bool.isRequired
};
export default function RiskForm({
  isLoading = false,
  isEdit = false,
  formName = 'risksInvolved',
  severityData,
  likelyhoodData,
  riskLevelData
}) {
  const theme = useTheme(); // Using MUI theme for styling
  const styles = StepperStyle(theme); // Assuming StepperStyle handles stepper-specific styles

  // Getting formik context values, handleChange, handleBlur, etc.
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();
  return (
    <FieldArray name={formName}>
      {({ remove }) => (
        <>
          {(values[formName] || [])?.map((item, index) => (
            <Box sx={{ ...styles.moreBox, pb: 1 }} key={item.id || `${formName}-${index}`}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched[`${formName}[${index}].riskCode`] && errors[formName]?.[index]?.riskCode}
                  >
                    <TextField
                      variant="standard"
                      fullWidth
                      label={
                        <>
                          Risk Code{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`${formName}[${index}].riskCode`}
                      value={values[formName][index].riskCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched[`${formName}[${index}].riskCode`] && !!errors[formName]?.[index]?.riskCode}
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched[`${formName}[${index}].severity`] && errors[formName]?.[index]?.severity}
                  >
                    <TextFieldSelect
                      id={`${formName}[${index}].severity`}
                      label={
                        <>
                          Severity{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`${formName}[${index}].severity`}
                      value={values[formName][index].severity}
                      itemsData={severityData?.values || []}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched[`${formName}[${index}].severity`] && errors[formName]?.[index]?.severity}
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched[`${formName}[${index}].likelyhood`] && !!errors[formName]?.[index]?.likelyhood}
                  >
                    <TextFieldSelect
                      id={`${formName}[${index}].likelyhood`}
                      label={
                        <>
                          Likelyhood{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`${formName}[${index}].likelyhood`}
                      value={values[formName][index].likelyhood}
                      itemsData={likelyhoodData?.values || []}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched[`${formName}[${index}].likelyhood`] && !!errors[formName]?.[index]?.likelyhood}
                      helperText={touched[`${formName}[${index}].likelyhood`] && errors[formName]?.[index]?.likelyhood}
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched[`${formName}[${index}].riskLevel`] && !!errors[formName]?.[index]?.riskLevel}
                  >
                    <TextFieldSelect
                      id={`${formName}[${index}].riskLevel`}
                      label={
                        <>
                          Risk Level{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`${formName}[${index}].riskLevel`}
                      value={values[formName][index].riskLevel}
                      itemsData={riskLevelData?.values || []}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched[`${formName}[${index}].riskLevel`] && !!errors[formName]?.[index]?.riskLevel}
                      helperText={touched[`${formName}[${index}].riskLevel`] && errors[formName]?.[index]?.riskLevel}
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FieldWithSkeleton isLoading={isLoading}>
                    <TextField
                      variant="standard"
                      fullWidth
                      label={<>Risk Description</>}
                      name={`${formName}[${index}].riskDescription`}
                      value={values[formName][index].riskDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched[formName]?.[index]?.controlMeasure && !!errors[formName]?.[index]?.controlMeasure}
                  >
                    <TextField
                      variant="standard"
                      fullWidth
                      label={<>Control Measure</>}
                      name={`${formName}[${index}].controlMeasure`}
                      value={values[formName][index].controlMeasure}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched[formName]?.[index]?.controlMeasure && !!errors[formName]?.[index]?.controlMeasure}
                      helperText={
                        touched[formName]?.[index]?.controlMeasure && errors[formName]?.[index]?.controlMeasure
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={styles.deleteIcon}>
                    {values[formName].length > 1 && isEdit && (
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
  );
}
