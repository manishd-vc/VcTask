import { Box, Grid, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import DatePickers from 'src/components/datePicker';
import { getDurationString } from 'src/utils/getDurationString';

export default function TimeFrame() {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values?.startDate && values?.endDate) {
      const duration = getDurationString(values.startDate, values.endDate);
      setFieldValue('totalDuration', duration);
    }
  }, [values.startDate, values.endDate, setFieldValue]);

  return (
    <>
      <Grid item xs={12} sm={6}>
        <DatePickers
          label={
            <>
              Start Date for Services{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          inputFormat="yyyy-MM-dd HH:mm"
          handleClear={() => {
            setFieldValue('startDate', null);
            setFieldValue('totalDuration', null);
          }}
          onChange={(value) => setFieldValue('startDate', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
          value={values.startDate}
          error={touched.startDate && Boolean(errors.startDate)}
          helperText={touched.startDate && errors.startDate}
          type="date"
          maxDate={values.endDate}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <DatePickers
          label={
            <>
              End Date for Services{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          inputFormat="yyyy-MM-dd HH:mm"
          handleClear={() => {
            setFieldValue('endDate', null);
            setFieldValue('totalDuration', null);
          }}
          onChange={(value) => setFieldValue('endDate', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
          value={values.endDate}
          error={touched.endDate && Boolean(errors.endDate)}
          helperText={touched.endDate && errors.endDate}
          type="date"
          minDate={values.startDate ? new Date(values.startDate) : new Date()}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Stack>
          <Typography variant="body3" color="text.secondary">
            Duration of Commitment
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {values?.totalDuration || '-'}
          </Typography>
        </Stack>
      </Grid>
    </>
  );
}
