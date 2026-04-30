import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';

export default function BankingInformation({ data, dataLoading }) {
  const { values, touched, errors, getFieldProps, setFieldValue } = useFormikContext();

  return (
    <>
      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" sx={{ mb: 2 }}>
        Banking information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          {data?.bankBeneficiaryName ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Beneficiary Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {data?.bankBeneficiaryName}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton
              isLoading={dataLoading}
              error={touched.bankBeneficiaryName && errors.bankBeneficiaryName}
            >
              <TextField
                id="bankBeneficiaryName"
                variant="standard"
                fullWidth
                label={
                  <>
                    Beneficiary Name{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputProps={{ maxLength: 255 }}
                {...getFieldProps('bankBeneficiaryName')}
                error={Boolean(touched.bankBeneficiaryName && errors.bankBeneficiaryName)}
                value={values?.bankBeneficiaryName}
                onChange={(e) => setFieldValue('bankBeneficiaryName', e.target.value)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {data?.bankName ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Bank Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {data?.bankName}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={dataLoading} error={touched.bankName && errors.bankName}>
              <TextField
                id="bankName"
                variant="standard"
                fullWidth
                label={
                  <>
                    Bank Name{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputProps={{ maxLength: 255 }}
                {...getFieldProps('bankName')}
                error={Boolean(touched.bankName && errors.bankName)}
                value={values?.bankName}
                onChange={(e) => setFieldValue('bankName', e.target.value)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {data?.bankAccount ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Account Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {data?.bankAccount}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={dataLoading} error={touched.bankAccount && errors.bankAccount}>
              <TextField
                id="bankAccount"
                variant="standard"
                fullWidth
                label={
                  <>
                    Account Number{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 22 }}
                {...getFieldProps('bankAccount')}
                error={Boolean(touched.bankAccount && errors.bankAccount)}
                value={values?.bankAccount}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (/^\d{0,22}$/.test(newValue)) {
                    setFieldValue('bankAccount', newValue);
                  }
                }}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {data?.bankIban ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                IBAN
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {data?.bankIban}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={dataLoading} error={touched.bankIban && errors.bankIban}>
              <TextField
                id="bankIban"
                variant="standard"
                fullWidth
                label={
                  <>
                    IBAN{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                {...getFieldProps('bankIban')}
                error={Boolean(touched.bankIban && errors.bankIban)}
                value={values?.bankIban}
                onChange={(e) => setFieldValue('bankIban', e.target.value)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {data?.bankSwiftCode ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                SWIFT Code
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {data?.bankSwiftCode}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={dataLoading} error={touched.bankSwiftCode && errors.bankSwiftCode}>
              <TextField
                id="bankSwiftCode"
                variant="standard"
                fullWidth
                label={
                  <>
                    SWIFT Code{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                {...getFieldProps('bankSwiftCode')}
                error={Boolean(touched.bankSwiftCode && errors.bankSwiftCode)}
                value={values?.bankSwiftCode}
                onChange={(e) => setFieldValue('bankSwiftCode', e.target.value)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
      </Grid>
    </>
  );
}
