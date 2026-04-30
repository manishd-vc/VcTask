import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import DatePickers from 'src/components/datePicker';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';

export default function PublishVolunteerCampaign() {
  const { values, setFieldValue, touched, errors } = useFormikContext();
  return (
    <Paper sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Publish Campaign
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel id="waiver-radio-buttons-group-label" sx={{ mb: 1 }}>
              <Typography variant="body3" component="p" color="text.secondary">
                You want to start publish this campaign on public website ?
              </Typography>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={values.publishOnPublicWebsite ? 'true' : 'false'}
              onChange={(e) => {
                setFieldValue('publishOnPublicWebsite', e.target.value === 'true');
              }}
            >
              <FormControlLabel value="true" control={<Radio />} sx={{ mr: 3 }} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {values.publishOnPublicWebsite && (
          <>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: (theme) => theme.palette.backgrounds.light, p: 4, mt: 1 }}>
                <Typography color={'text.secondarydark'} fontWeight={400} variant="body2" pb={2}>
                  Select Start Date-time and End Date-time to Publish Campaign on DPWF Public Website
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FieldWithSkeleton
                      isLoading={false}
                      error={touched.publishStartDateTime && errors.publishStartDateTime}
                    >
                      <DatePickers
                        label={'Start Date & Time'}
                        inputFormat={'yyyy-MM-dd HH:mm'}
                        onChange={(value) => {
                          setFieldValue('publishStartDateTime', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null);
                        }}
                        value={values.publishStartDateTime}
                        type="time"
                        readOnly={true}
                        minDate={new Date()}
                        maxDate={values.endDateTime}
                        handleClear={() => {
                          setFieldValue('publishStartDateTime', null);
                          setFieldValue('publishEndDateTime', null);
                        }}
                        error={touched.publishStartDateTime && errors.publishStartDateTime}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FieldWithSkeleton
                      isLoading={false}
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
                        disabled={!values.publishStartDateTime}
                        minDate={values.publishStartDateTime && values.startDateTime}
                        maxDate={values.endDateTime}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}
