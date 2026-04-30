import { Grid, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { defaultCountry, preferredCountries } from 'src/utils/constants';

export default function DpWorldInfo() {
  const { values, getFieldProps, isLoading, setFieldValue } = useFormikContext();

  return (
    <>
      <Typography
        variant="subtitle6"
        component="h4"
        textTransform={'uppercase'}
        color="primary.main"
        sx={{ pt: 3, pb: 2 }}
      >
        DP World Contact
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={isLoading}>
            <TextField
              id="dpWorldEmployeeId"
              variant="standard"
              fullWidth
              label="Employee ID"
              inputProps={{ maxLength: 255 }}
              {...getFieldProps('dpWorldEmployeeId')}
              value={values?.dpWorldEmployeeId}
              onChange={(e) => setFieldValue('dpWorldEmployeeId', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={isLoading}>
            <TextField
              id="dpWorldContactName"
              variant="standard"
              fullWidth
              label="Name"
              inputProps={{ maxLength: 255 }}
              {...getFieldProps('dpWorldContactName')}
              value={values?.dpWorldContactName}
              onChange={(e) => setFieldValue('dpWorldContactName', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={isLoading}>
            <TextField
              id="dpWorldDesignation"
              variant="standard"
              fullWidth
              label="Designation"
              inputProps={{ maxLength: 255 }}
              {...getFieldProps('dpWorldDesignation')}
              value={values?.dpWorldDesignation}
              onChange={(e) => setFieldValue('dpWorldDesignation', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={isLoading}>
            <TextField
              id="dpWorldEmail"
              variant="standard"
              fullWidth
              label="Email ID"
              inputProps={{ maxLength: 255 }}
              {...getFieldProps('dpWorldEmail')}
              value={values?.dpWorldEmail}
              onChange={(e) => setFieldValue('dpWorldEmail', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={isLoading}>
            <MuiTelInput
              label="Phone Number"
              id="dpWorldMobile"
              preferredCountries={preferredCountries}
              defaultCountry={defaultCountry}
              fullWidth
              value={values?.dpWorldMobile}
              onChange={(value) => {
                const cleanedValue = value ? value.replace(/\s/g, '') : '';
                setFieldValue('dpWorldMobile', cleanedValue);
              }}
              variant="standard"
              sx={{
                '& .MuiInputAdornment-root .MuiButtonBase-root': {
                  right: 6
                }
              }}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
    </>
  );
}
