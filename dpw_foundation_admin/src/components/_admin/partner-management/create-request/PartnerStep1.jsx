import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as api from 'src/services';
import BankingInformation from '../../grant-management/create-request/BankingInformation';
import DocumentSection from '../../grant-management/create-request/DocumentSection';

const getFieldError = (touched, errors, fieldName) => {
  return Boolean(touched[fieldName] && errors[fieldName]);
};
const getHelperText = (fieldName, limit, touched, errors, values) => {
  const fieldValue = values?.[fieldName] || '';
  if (fieldValue.length > limit) {
    return `Character limit exceeded (${limit} characters maximum)`;
  }
  return (touched[fieldName] && errors[fieldName]) || '';
};

export default function PartnerStep1() {
  const { partnershipRequestData, partnershipRequestLoading } = useSelector((state) => state?.partner);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const {
    accountType,
    email,
    firstName,
    lastName,
    mobile,
    countryName,
    stateName,
    city,
    mailingAddress,
    organizationName,
    organizationRegistrationNumber
  } = partnershipRequestData || {};
  const { values, getFieldProps, errors, touched, setFieldValue } = useFormikContext();

  const { data: projectStateData } = useQuery(
    ['getStates', values?.currentCountryOfResidence],
    () => api.getStates(values?.currentCountryOfResidence),
    {
      enabled: !!values?.currentCountryOfResidence, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );
  // Fetching city data based on selected state
  const { data: citiesData } = useQuery(
    ['getCities', values?.state],
    () => api.getCities(values?.currentCountryOfResidence, values?.state),
    {
      enabled: !!values?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        PArtner information form
      </Typography>
      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" sx={{ mb: 2 }}>
        Profile details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {accountType || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Organization Contact Person Email ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {email || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Organization Contact Person First Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {firstName || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Organization Contact Person Second Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {lastName || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Organization Contact Person Phone Number
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {mobile || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          {organizationName ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {organizationName}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton
              isLoading={partnershipRequestLoading}
              error={touched.organizationName && errors.organizationName}
            >
              <TextField
                id="organizationName"
                variant="standard"
                fullWidth
                label={
                  <>
                    Enter Organization Name{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputProps={{ maxLength: 255 }}
                {...getFieldProps('organizationName')}
                error={getFieldError(touched, errors, 'organizationName')}
                value={values?.organizationName}
                onChange={(e) => setFieldValue('organizationName', e.target.value)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {organizationRegistrationNumber ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Registration Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {organizationRegistrationNumber}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton
              isLoading={partnershipRequestLoading}
              error={touched.organizationRegistrationNumber && errors.organizationRegistrationNumber}
            >
              <TextField
                id="organizationRegistrationNumber"
                variant="standard"
                fullWidth
                label={
                  <>
                    Enter Organization Registration Number{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputProps={{ maxLength: 255 }}
                {...getFieldProps('organizationRegistrationNumber')}
                error={getFieldError(touched, errors, 'organizationRegistrationNumber')}
                value={values?.organizationRegistrationNumber}
                onChange={(e) => setFieldValue('organizationRegistrationNumber', e.target.value)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {countryName ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Country Where Registered
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {countryName}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton
              isLoading={partnershipRequestLoading}
              error={touched.currentCountryOfResidence && errors.currentCountryOfResidence}
            >
              <TextFieldSelect
                id="currentCountryOfResidence"
                label={
                  <>
                    Select Organization Country Where Registered{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={country}
                error={getFieldError(touched, errors, 'currentCountryOfResidence')}
                disabled={false}
                value={values?.currentCountryOfResidence || ''}
                onChange={(e) => setFieldValue('currentCountryOfResidence', e.target.value)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {stateName ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization State Where Registered
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {stateName}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={partnershipRequestLoading} error={touched.state && errors.state}>
              <TextFieldSelect
                id="state"
                label={
                  <>
                    Select Organization State Where Registered{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={projectStateData}
                value={values?.state}
                onChange={(e) => setFieldValue('state', e.target.value)}
                error={getFieldError(touched, errors, 'state')}
                disabled={!values?.currentCountryOfResidence}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {city ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization City Where Registered
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {city}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={partnershipRequestLoading} error={touched.city && errors.city}>
              <TextFieldSelect
                id="city"
                label={
                  <>
                    Select Organization City Where Registered{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={citiesData}
                error={getFieldError(touched, errors, 'city')}
                disabled={!values?.state}
                value={values?.city}
                onChange={(e) => setFieldValue('city', e.target.value)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {mailingAddress ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Mailing Address
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {mailingAddress}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={partnershipRequestLoading}>
              <TextField
                id="mailingAddress"
                variant="standard"
                fullWidth
                label={
                  <>
                    Enter Mailing Address{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                {...getFieldProps('mailingAddress')}
                error={Boolean(touched.mailingAddress && errors.mailingAddress) || values?.mailingAddress?.length > 255}
                helperText={getHelperText('mailingAddress', 255, touched, errors, values)}
                value={values?.mailingAddress}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
                    setFieldValue('mailingAddress', newValue);
                  }
                }}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
      </Grid>
      <Box sx={{ my: 3 }}>
        <DocumentSection entityId={partnershipRequestData?.partnerUserId} />
      </Box>
      <BankingInformation data={partnershipRequestData} dataLoading={partnershipRequestLoading} />
    </>
  );
}
