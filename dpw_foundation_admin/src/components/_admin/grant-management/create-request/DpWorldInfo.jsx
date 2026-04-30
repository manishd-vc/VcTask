import { Grid, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { defaultCountry, preferredCountries } from 'src/utils/constants';

export default function DpWorldInfo() {
  const { values, getFieldProps, isLoading, setFieldValue, touched, errors } = useFormikContext();

  const getHelperText = (fieldName, limit) => {
    const fieldValue = values?.[fieldName] || '';
    if (fieldValue.length > limit) {
      return `Character limit exceeded (${limit} characters maximum)`;
    }
    const error = touched[fieldName] && errors[fieldName];
    return typeof error === 'string' ? error : '';
  };

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
              {...getFieldProps('dpWorldEmployeeId')}
              value={values?.dpWorldEmployeeId}
              error={
                Boolean(touched.dpWorldEmployeeId && errors.dpWorldEmployeeId) ||
                values?.dpWorldEmployeeId?.length > 255
              }
              helperText={getHelperText('dpWorldEmployeeId', 255)}
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
              {...getFieldProps('dpWorldContactName')}
              value={values?.dpWorldContactName}
              error={
                Boolean(touched.dpWorldContactName && errors.dpWorldContactName) ||
                values?.dpWorldContactName?.length > 255
              }
              helperText={getHelperText('dpWorldContactName', 255)}
              onChange={(e) => {
                const newValue = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(newValue)) {
                  setFieldValue('dpWorldContactName', newValue);
                }
              }}
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
              {...getFieldProps('dpWorldDesignation')}
              value={values?.dpWorldDesignation}
              error={
                Boolean(touched.dpWorldDesignation && errors.dpWorldDesignation) ||
                values?.dpWorldDesignation?.length > 255
              }
              helperText={getHelperText('dpWorldDesignation', 255)}
              onChange={(e) => {
                const newValue = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(newValue)) {
                  setFieldValue('dpWorldDesignation', newValue);
                }
              }}
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
              type="text"
              {...getFieldProps('dpWorldEmail')}
              value={values?.dpWorldEmail}
              error={Boolean(touched.dpWorldEmail && errors.dpWorldEmail) || values?.dpWorldEmail?.length > 255}
              helperText={getHelperText('dpWorldEmail', 255)}
              onChange={(e) => setFieldValue('dpWorldEmail', e.target.value.toLowerCase())}
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
