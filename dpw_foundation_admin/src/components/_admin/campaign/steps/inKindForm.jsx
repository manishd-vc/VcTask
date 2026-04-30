'use client';
import { Box, Grid, IconButton, TextField, useTheme } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
import StepperStyle from './stepper.styles';

/**
 * InKindForm component for managing and displaying the in-kind donation form.
 * Utilizes lazy loading for the FieldWithSkeleton component to optimize performance.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isLoading - Flag indicating if the form is in a loading state.
 * @param {boolean} props.isEdit - Flag indicating if the component is in edit mode.
 *
 * @returns {JSX.Element} The rendered InKindForm component.
 */
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

InKindForm.propTypes = {
  // 'isLoading' is a boolean indicating whether data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating whether the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};
export default function InKindForm({ isLoading, isEdit }) {
  // Access the Material-UI theme for custom styling
  const theme = useTheme();
  const { masterData } = useSelector((state) => state?.common);
  const unitData = getLabelObject(masterData, 'dpw_foundation_campaign_inkind_unit');
  const typeData = getLabelObject(masterData, 'dpw_foundation_campaign_inkind_type');

  // Define styles using a custom StepperStyle hook
  const styles = StepperStyle(theme);

  // Retrieve formik context values for managing form state and validation errors
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();

  // JSX and form logic for the InKindForm component
  return (
    <FieldArray name="campaignInKindContributions">
      {({ remove }) => (
        <>
          {values.campaignInKindContributions.map((_, index) => (
            <Grid
              sx={{ ...styles.moreBox, mt: 2 }}
              container
              rowSpacing={2}
              gap={1}
              key={values.campaignInKindContributions[index]?.id ?? `ik-${index}`}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={
                      touched.campaignInKindContributions?.[index]?.inKindItemCode &&
                      !!errors.campaignInKindContributions?.[index]?.inKindItemCode
                    }
                  >
                    <TextField
                      variant="standard"
                      fullWidth
                      label={
                        <>
                          Item Code{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`campaignInKindContributions[${index}].inKindItemCode`}
                      value={values.campaignInKindContributions[index].inKindItemCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.campaignInKindContributions?.[index]?.inKindItemCode &&
                        !!errors.campaignInKindContributions?.[index]?.inKindItemCode
                      }
                      helperText={
                        touched.campaignInKindContributions?.[index]?.inKindItemCode &&
                        errors.campaignInKindContributions?.[index]?.inKindItemCode
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={
                      touched.campaignInKindContributions?.[index]?.inKindItem &&
                      !!errors.campaignInKindContributions?.[index]?.inKindItem
                    }
                  >
                    <TextField
                      variant="standard"
                      fullWidth
                      label={
                        <>
                          Item Name{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`campaignInKindContributions[${index}].inKindItem`}
                      value={values.campaignInKindContributions[index].inKindItem}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.campaignInKindContributions?.[index]?.inKindItem &&
                        !!errors.campaignInKindContributions?.[index]?.inKindItem
                      }
                      helperText={
                        touched.campaignInKindContributions?.[index]?.inKindItem &&
                        errors.campaignInKindContributions?.[index]?.inKindItem
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={
                      touched.campaignInKindContributions?.[index]?.inKindUnit &&
                      !!errors.campaignInKindContributions?.[index]?.inKindUnit
                    }
                  >
                    <TextFieldSelect
                      id={`campaignInKindContributions[${index}].inKindUnit`}
                      label={
                        <>
                          Required Unit
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`campaignInKindContributions[${index}].inKindUnit`}
                      value={values.campaignInKindContributions[index].inKindUnit}
                      itemsData={unitData?.values || []}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        touched.campaignInKindContributions?.[index]?.inKindUnit &&
                        !!errors.campaignInKindContributions?.[index]?.inKindUnit
                      }
                      helperText={
                        touched.campaignInKindContributions?.[index]?.inKindUnit &&
                        errors.campaignInKindContributions?.[index]?.inKindUnit
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={
                      touched.campaignInKindContributions?.[index]?.targetQuantity &&
                      !!errors.campaignInKindContributions?.[index]?.targetQuantity
                    }
                  >
                    <TextField
                      variant="standard"
                      fullWidth
                      label={
                        <>
                          Required Number{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`campaignInKindContributions[${index}].targetQuantity`}
                      value={values.campaignInKindContributions[index].targetQuantity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.campaignInKindContributions?.[index]?.targetQuantity &&
                        !!errors.campaignInKindContributions?.[index]?.targetQuantity
                      }
                      helperText={
                        touched.campaignInKindContributions?.[index]?.targetQuantity &&
                        errors.campaignInKindContributions?.[index]?.targetQuantity
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={
                      touched.campaignInKindContributions?.[index]?.inKindType &&
                      !!errors.campaignInKindContributions?.[index]?.inKindType
                    }
                  >
                    <TextFieldSelect
                      id={`campaignInKindContributions[${index}].inKindType`}
                      label={
                        <>
                          Type
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`campaignInKindContributions[${index}].inKindType`}
                      value={values.campaignInKindContributions[index].inKindType}
                      itemsData={typeData?.values || []}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        touched.campaignInKindContributions?.[index]?.inKindType &&
                        !!errors.campaignInKindContributions?.[index]?.inKindType
                      }
                      helperText={
                        touched.campaignInKindContributions?.[index]?.inKindType &&
                        errors.campaignInKindContributions?.[index]?.inKindType
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={
                      touched.campaignInKindContributions?.[index]?.inKindItemDescription &&
                      !!errors.campaignInKindContributions?.[index]?.inKindItemDescription
                    }
                  >
                    <TextField
                      variant="standard"
                      fullWidth
                      label={
                        <>
                          Item Description{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`campaignInKindContributions[${index}].inKindItemDescription`}
                      value={values.campaignInKindContributions[index].inKindItemDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.campaignInKindContributions?.[index]?.inKindItemDescription &&
                        !!errors.campaignInKindContributions?.[index]?.inKindItemDescription
                      }
                      helperText={
                        touched.campaignInKindContributions?.[index]?.inKindItemDescription &&
                        errors.campaignInKindContributions?.[index]?.inKindItemDescription
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={1}>
                  <Box sx={styles.deleteIcon}>
                    {values.campaignInKindContributions.length > 1 && isEdit && (
                      <IconButton onClick={() => remove(index)}>
                        <DeleteIconRed />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </>
      )}
    </FieldArray>
  );
}
