import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useQuery } from 'react-query';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as api from 'src/services';

export default function VolunteerCampaignLocation() {
  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();

  // Fetching country data
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const { data: projectStateData } = useQuery(['getStates', values?.country], () => api.getStates(values?.country), {
    enabled: !!values?.country, // Only fetch if country is selected
    refetchOnWindowFocus: false // Avoid refetching on window focus
  });

  // Fetching city data based on selected state
  const { data: citiesData } = useQuery(
    ['getCities', values?.state],
    () => api.getCities(values?.country, values?.state),
    {
      enabled: !!values?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  return (
    <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Volunteer Campaign Location
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={false} error={touched.addressLineOne && errors.addressLineOne}>
            <TextField
              id="addressLineOne"
              variant="standard"
              fullWidth
              label={
                <>
                  Address Line 1{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputProps={{ maxLength: 255 }}
              {...getFieldProps('addressLineOne')}
              error={Boolean(touched.addressLineOne && errors.addressLineOne)}
              value={values?.addressLineOne}
              onChange={(e) => setFieldValue('addressLineOne', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={false}>
            <TextField
              id="addressLineTwo"
              variant="standard"
              fullWidth
              label={<>Address Line 2 </>}
              inputProps={{ maxLength: 255 }}
              {...getFieldProps('addressLineTwo')}
              value={values?.addressLineTwo}
              onChange={(e) => setFieldValue('addressLineTwo', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={false} error={touched.country && errors.country}>
            <TextFieldSelect
              id="country"
              label={
                <>
                  Select Country{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={values?.country}
              getFieldProps={getFieldProps}
              itemsData={country}
              error={Boolean(touched.country && errors.country)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={false} error={touched.state && errors.state}>
            <TextFieldSelect
              id="state"
              label={
                <>
                  Select State/Province{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={projectStateData}
              error={Boolean(touched.state && errors.state)}
              disabled={!values?.country}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          {citiesData && citiesData.length > 0 ? (
            <FieldWithSkeleton isLoading={false} error={touched.city && errors.city}>
              <TextFieldSelect
                id="city"
                label={
                  <>
                    Select City{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={citiesData}
                error={Boolean(touched.city && errors.city)}
                disabled={!values?.state}
              />
            </FieldWithSkeleton>
          ) : (
            <FieldWithSkeleton isLoading={false} error={touched.city && errors.city}>
              <TextField
                variant="standard"
                fullWidth
                label={
                  <>
                    Enter City{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                id="city"
                name={`city`}
                {...getFieldProps('city')}
                error={Boolean(touched.city && errors.city)}
                disabled={!values?.state}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
