'use client';
import { Box, Grid, IconButton, TextField, useTheme } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { DeleteIconRed } from 'src/components/icons';
import StepperStyle from './stepper.styles';
/**
 * CampaignObjectivesForm component for managing and displaying the campaign objectives form.
 * Utilizes lazy loading for the FieldWithSkeleton component to optimize performance.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isLoading - Flag indicating if the form is in a loading state.
 * @param {boolean} props.isEdit - Flag indicating if the component is in edit mode.
 *
 * @returns {JSX.Element} The rendered CampaignObjectivesForm component.
 */
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
CampaignObjectivesForm.propTypes = {
  // 'isLoading' is a boolean indicating whether data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating whether the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};
export default function CampaignObjectivesForm({ isLoading, isEdit }) {
  // Access the Material-UI theme for custom styling
  const theme = useTheme();

  // Define styles using a custom StepperStyle hook
  const styles = StepperStyle(theme);

  // Retrieve formik context values for managing form state and validation errors
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();

  // JSX and form logic for the CampaignObjectivesForm component
  return (
    <FieldArray name="campaignObjectives">
      {({ remove }) => (
        <>
          {values.campaignObjectives.map((_, index) => (
            <Grid
              sx={{ ...styles.moreBox, mt: 2 }}
              container
              rowSpacing={2}
              gap={1}
              key={values.campaignObjectives[index].objectiveTitle}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={
                      touched.campaignObjectives?.[index]?.objectiveTitle &&
                      !!errors.campaignObjectives?.[index]?.objectiveTitle
                    }
                  >
                    <TextField
                      variant="standard"
                      fullWidth
                      label={
                        <>
                          Task{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`campaignObjectives[${index}].objectiveTitle`}
                      value={values.campaignObjectives[index].objectiveTitle}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.campaignObjectives?.[index]?.objectiveTitle &&
                        !!errors.campaignObjectives?.[index]?.objectiveTitle
                      }
                      helperText={
                        touched.campaignObjectives?.[index]?.objectiveTitle &&
                        errors.campaignObjectives?.[index]?.objectiveTitle
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={5}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={
                      touched.campaignObjectives?.[index]?.objectiveTarget &&
                      !!errors.campaignObjectives?.[index]?.objectiveTarget
                    }
                  >
                    <TextField
                      variant="standard"
                      fullWidth
                      label={
                        <>
                          Target{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      name={`campaignObjectives[${index}].objectiveTarget`}
                      value={values.campaignObjectives[index].objectiveTarget}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.campaignObjectives?.[index]?.objectiveTarget &&
                        !!errors.campaignObjectives?.[index]?.objectiveTarget
                      }
                      helperText={
                        touched.campaignObjectives?.[index]?.objectiveTarget &&
                        errors.campaignObjectives?.[index]?.objectiveTarget
                      }
                      disabled={!isEdit}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={1}>
                  <Box sx={styles.deleteIcon}>
                    {values.campaignObjectives.length > 1 && isEdit && (
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
