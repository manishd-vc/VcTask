import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as api from 'src/services';
import BankingInformation from '../../grant-management/create-request/BankingInformation';
import DocumentSection from '../../grant-management/create-request/DocumentSection';

const donorLabels = {
  email: {
    individual: 'Email ID',
    organization: 'Organization Contact Person Email ID'
  },
  firstName: {
    individual: 'First Name',
    organization: 'Organization Contact Person First Name'
  },
  secondName: {
    individual: 'Second Name',
    organization: 'Organization Contact Person Second Name'
  },
  phoneNumber: {
    individual: 'Phone Number',
    organization: 'Enter Organization Contact Person Phone Number'
  },
  country: {
    individual: 'Country',
    organization: 'Select Organization Country Where Registered'
  },
  state: {
    individual: 'State/Province',
    organization: 'Select Organization State/Province Where Registered'
  },
  city: {
    individual: 'City',
    organization: 'Select Organization City Where Registered'
  }
};
const getFieldError = (touched, errors, fieldName) => {
  return Boolean(touched[fieldName] && errors[fieldName]);
};

export default function ProfileDetails() {
  const { inKindContributionRequestData, inKindContributionRequestLoading } = useSelector(
    (state) => state?.beneficiary
  );
  const { touched, errors, values, setFieldValue, getFieldProps } = useFormikContext();

  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
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

  const getLabel = (fieldKey) => {
    const isIndividual = inKindContributionRequestData?.accountType === 'Individual';
    return donorLabels[fieldKey]?.[isIndividual ? 'individual' : 'organization'] || '';
  };
  const isOrganization = useMemo(
    () => inKindContributionRequestData?.accountType === 'Organization',
    [inKindContributionRequestData?.accountType]
  );

  const isOrganizationName = useMemo(
    () => inKindContributionRequestData?.organizationName,
    [inKindContributionRequestData?.organizationName]
  );
  const isOrganizationRegistrationNumber = useMemo(
    () => inKindContributionRequestData?.organizationRegistrationNumber,
    [inKindContributionRequestData?.organizationRegistrationNumber]
  );
  const getHelperText = (fieldName, limit) => {
    const fieldValue = values?.[fieldName] || '';
    if (fieldValue.length > limit) {
      return `Character limit exceeded (${limit} characters maximum)`;
    }
    return (touched[fieldName] && errors[fieldName]) || '';
  };

  return (
    <>
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
              {inKindContributionRequestData?.accountType || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              {getLabel('email')}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {inKindContributionRequestData?.email || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              {getLabel('firstName')}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {inKindContributionRequestData?.firstName || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              {getLabel('secondName')}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {inKindContributionRequestData?.lastName || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              {getLabel('phoneNumber')}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {inKindContributionRequestData?.mobile || ''}
            </Typography>
          </Stack>
        </Grid>
        {isOrganization && (
          <>
            <Grid item xs={12} sm={6}>
              {isOrganizationName ? (
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Organization Name
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {isOrganizationName}
                  </Typography>
                </Stack>
              ) : (
                <FieldWithSkeleton
                  isLoading={inKindContributionRequestLoading}
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
              {isOrganizationRegistrationNumber ? (
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Organization Registration Number
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {isOrganizationRegistrationNumber}
                  </Typography>
                </Stack>
              ) : (
                <FieldWithSkeleton
                  isLoading={inKindContributionRequestLoading}
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
          </>
        )}
        <Grid item xs={12} sm={6}>
          {inKindContributionRequestData?.countryName ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getLabel('country')}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {inKindContributionRequestData?.countryName}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton
              isLoading={inKindContributionRequestLoading}
              error={touched.currentCountryOfResidence && errors.currentCountryOfResidence}
            >
              <TextFieldSelect
                id="currentCountryOfResidence"
                label={
                  <>
                    Select {getLabel('country')}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      {' '}
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
          {inKindContributionRequestData?.stateName ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getLabel('state')}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {inKindContributionRequestData?.stateName}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={inKindContributionRequestLoading} error={touched.state && errors.state}>
              <TextFieldSelect
                id="state"
                label={
                  <>
                    Select {getLabel('state')}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      {' '}
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
          {inKindContributionRequestData?.city ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getLabel('city')}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {inKindContributionRequestData?.city}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={inKindContributionRequestLoading} error={touched.city && errors.city}>
              <TextFieldSelect
                id="city"
                label={
                  <>
                    Select {getLabel('city')}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      {' '}
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
          {inKindContributionRequestData?.mailingAddress ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Mailing Address
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {inKindContributionRequestData?.mailingAddress}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={inKindContributionRequestLoading}>
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
                helperText={getHelperText('mailingAddress', 255)}
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
        <DocumentSection entityId={inKindContributionRequestData?.userId} />
      </Box>
      <BankingInformation data={inKindContributionRequestData} dataLoading={inKindContributionRequestLoading} />
    </>
  );
}
