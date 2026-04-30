'use client';
// mui
import { Box, Checkbox, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography, useTheme } from '@mui/material';
// api

// yup
// formik
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import DatePickers from 'src/components/datePicker';
import StepperStyle from './stepper.styles';
/**
 * PublishCampaign component for handling the publishing process of a campaign.
 * Utilizes lazy loading for the FieldWithSkeleton component to optimize performance.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isLoading - Flag indicating whether the campaign is in a loading state.
 * @param {boolean} props.isEdit - Flag indicating if the component is in edit mode.
 *
 * @returns {JSX.Element} The rendered PublishCampaign component.
 */
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

export default function PublishCampaign({ isLoading, isEdit }) {
  // Retrieve formik context values for managing form state and validation errors
  const { values, setFieldError, touched, errors, setFieldValue } = useFormikContext();

  // Access the Material-UI theme for custom styling
  const theme = useTheme();

  // Define styles using a custom StepperStyle hook
  const styles = StepperStyle(theme);

  // JSX and form logic for the PublishCampaign component
  return (
    <Paper sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} mt={0}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 1.5 }}>
            Publish {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '}
          </Typography>
          <Typography variant="subtitle1" component="p" color="text.secondarydark" sx={{ pb: 3 }}>
            You want to start publish this {values?.campaignType === 'CHARITY' ? 'project ' : 'campaign '}on public
            website ?
          </Typography>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.isToPublicallyPublish && errors.isToPublicallyPublish}
          >
            <RadioGroup
              name="isToPublicallyPublish"
              value={values?.isToPublicallyPublish}
              disabled={!isEdit}
              onChange={(event) => {
                const value = event.target.value === 'true';
                setFieldValue('isToPublicallyPublish', value);
                if (!value) {
                  setFieldError('publishStartDateTime', null);
                  setFieldError('publishEndDateTime', null);
                  setFieldValue('publishStartDateTime', null);
                  setFieldValue('publishEndDateTime', null);
                  setFieldValue('isPublishOnIacadApprove', false);
                } else {
                  setFieldError('publishStartDateTime', 'Start date is required');
                  setFieldError('publishEndDateTime', 'Start date is required');
                }
              }}
              sx={{ flexDirection: 'row', gap: 5, color: 'text.secondarydark' }}
            >
              <FormControlLabel value="true" control={<Radio disabled={!isEdit} />} label="Yes" />
              <FormControlLabel value="false" control={<Radio disabled={!isEdit} />} label="No" />
            </RadioGroup>
          </FieldWithSkeleton>
        </Grid>
        {values.isToPublicallyPublish && (
          <Grid item xs={12} md={12}>
            <Grid item xs={12} md={12}>
              <Box sx={{ ...styles.moreBox }}>
                <Typography color={'text.secondarydark'} fontWeight={400} variant="body2" pb={2}>
                  Select Start Date-time and End Date-time to publish{' '}
                  {values?.campaignType === 'CHARITY' ? 'project ' : 'campaign '}on DPWF Public Website
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FieldWithSkeleton
                      isLoading={isLoading}
                      error={touched.publishStartDateTime && errors.publishStartDateTime}
                    >
                      <DatePickers
                        label={'Start Date & Time'}
                        inputFormat={'yyyy-MM-dd HH:mm'}
                        onChange={(value) => {
                          setFieldValue('publishStartDateTime', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null);
                          setFieldValue('isPublishOnIacadApprove', false);
                        }}
                        value={values.publishStartDateTime}
                        type="time"
                        disabled={!isEdit}
                        readOnly={true}
                        minDate={new Date()}
                        maxDate={values.endDateTime}
                        handleClear={() => setFieldValue('publishStartDateTime', null)}
                        error={touched.publishStartDateTime && errors.publishStartDateTime}
                        helperText={touched.publishStartDateTime && errors.publishStartDateTime}
                      />
                    </FieldWithSkeleton>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FieldWithSkeleton
                      isLoading={isLoading}
                      error={touched.publishEndDateTime && errors.publishEndDateTime}
                    >
                      <DatePickers
                        label={'End Date & Time'}
                        inputFormat={'yyyy-MM-dd'}
                        onChange={(value) => {
                          if (value) {
                            try {
                              const formattedValue = format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss");
                              setFieldValue('publishEndDateTime', formattedValue);
                              setFieldValue('isPublishOnIacadApprove', false);
                            } catch (error) {
                              console.error('Invalid date value:', error);
                              setFieldValue('publishEndDateTime', null);
                            }
                          } else {
                            setFieldValue('publishEndDateTime', null);
                          }
                        }}
                        readOnly={true}
                        handleClear={() => setFieldValue('publishEndDateTime', null)}
                        value={values.publishEndDateTime}
                        type="time"
                        error={touched.publishEndDateTime && errors.publishEndDateTime}
                        helperText={touched.publishEndDateTime && errors.publishEndDateTime}
                        disabled={!values.publishStartDateTime}
                        minDate={values.publishStartDateTime && values.startDateTime}
                        maxDate={values.endDateTime}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                color={'text.secondarydark'}
                fontWeight={400}
                variant="body1"
                backgroundColor="white"
                p={2}
                textAlign="center"
              >
                OR
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box sx={{ ...styles.moreBox, mt: 0 }}>
                <FieldWithSkeleton
                  isLoading={isLoading}
                  label=""
                  error={touched.isPublishOnIacadApprove && errors.isPublishOnIacadApprove}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isPublishOnIacadApprove}
                        onChange={
                          (event) => {
                            setFieldValue('isPublishOnIacadApprove', event.target.checked);
                            setFieldError('publishStartDateTime', null);
                            setFieldError('publishEndDateTime', null);
                            setFieldValue('publishStartDateTime', null);
                            setFieldValue('publishEndDateTime', null);
                          } // Set Formik value on change
                        }
                        name="isPublishOnIacadApprove"
                        disabled={!isEdit}
                      />
                    }
                    label={
                      values?.campaignType === 'CHARITY'
                        ? 'Publish Project after IACAD Approval '
                        : 'Publish Campaign after IACAD Approval '
                    }
                    sx={{
                      '.MuiFormControlLabel-label': {
                        color: 'text.secondarydark',
                        fontWeight: 400,
                        fontSize: '1rem'
                      }
                    }}
                  />
                </FieldWithSkeleton>
              </Box>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

PublishCampaign.propTypes = {
  // 'isLoading' is a boolean indicating whether data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};
