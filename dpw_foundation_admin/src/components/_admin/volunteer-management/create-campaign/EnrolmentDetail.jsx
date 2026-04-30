import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import DatePickers from 'src/components/datePicker';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';

export default function EnrolmentDetail() {
  const { touched, errors, getFieldProps, setFieldValue, values, handleChange } = useFormikContext();
  return (
    <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Enrolment Detail
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton isLoading={false} error={touched.noOfVolunteersRequired && errors.noOfVolunteersRequired}>
            <TextField
              id="noOfVolunteersRequired"
              variant="standard"
              fullWidth
              label={
                <>
                  No of Volunteers Required{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputProps={{ maxLength: 255, type: 'number' }}
              {...getFieldProps('noOfVolunteersRequired')}
              error={Boolean(touched.noOfVolunteersRequired && errors.noOfVolunteersRequired)}
              value={values?.noOfVolunteersRequired}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              onBlur={(e) => {
                const val = e.target.value;
                setFieldValue('noOfVolunteersRequired', val === '' ? '' : Number(val));
              }}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <DatePickers
            label={
              <>
                Enrolment Start Date{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            inputFormat="yyyy-MM-dd HH:mm"
            handleClear={() => {
              setFieldValue('enrollmentStartDateTime', null);
              setFieldValue('enrollmentEndDateTime', null);
            }}
            onChange={(value) =>
              setFieldValue('enrollmentStartDateTime', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)
            }
            value={values.enrollmentStartDateTime}
            error={touched.enrollmentStartDateTime && Boolean(errors.enrollmentStartDateTime)}
            helperText={touched.enrollmentStartDateTime && errors.enrollmentStartDateTime}
            type="date"
            maxDate={values.enrollmentEndDateTime}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DatePickers
            label={
              <>
                Enrolment End Date{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            inputFormat="yyyy-MM-dd HH:mm"
            handleClear={() => {
              setFieldValue('enrollmentEndDateTime', null);
              setFieldValue('enrollmentStartDateTime', null);
            }}
            onChange={(value) =>
              setFieldValue('enrollmentEndDateTime', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)
            }
            value={values.enrollmentEndDateTime}
            error={touched.enrollmentEndDateTime && Boolean(errors.enrollmentEndDateTime)}
            helperText={touched.enrollmentEndDateTime && errors.enrollmentEndDateTime}
            type="date"
            minDate={values.enrollmentStartDateTime}
            maxDate={values.endDateTime || null}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton isLoading={false}>
            <TextField
              id="targetVolunteeringHrs"
              variant="standard"
              fullWidth
              label="Target Volunteering Hours"
              inputProps={{ maxLength: 255, type: 'number' }}
              {...getFieldProps('targetVolunteeringHrs')}
              value={values?.targetVolunteeringHrs}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              onBlur={(e) => {
                const val = e.target.value;
                setFieldValue('targetVolunteeringHrs', val === '' ? '' : Number(val));
              }}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
    </Paper>
  );
}
