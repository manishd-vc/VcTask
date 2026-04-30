import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as api from 'src/services';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
ProjectLocation.propTypes = {
  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};
/**
 * ProjectLocation component handles the selection and display of the project's location,
 * including the country, state, and city. It fetches the available states and cities based
 * on the selected country and state, respectively, and updates the form values accordingly.
 *
 * @param {Object} props - Component properties
 * @param {boolean} props.isEdit - A flag indicating whether the form is in edit mode.
 *
 * @returns {JSX.Element} The rendered ProjectLocation component with location selection fields.
 */
export default function ProjectLocation({ isEdit }) {
  // Accessing form context values and loading state using Formik
  const { values, getFieldProps, errors, touched, isLoading } = useFormikContext();
  // Query client for managing cache and refetching
  const queryClient = useQueryClient();

  // Fetching state data based on selected country
  const { data: projectStateData } = useQuery(
    ['getStates', values?.projectCountry],
    () => api.getStates(values?.projectCountry),
    {
      enabled: !!values?.projectCountry, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching city data based on selected state
  const { data: citiesData } = useQuery(
    ['getCities', values?.projectState],
    () => api.getCities(values?.projectCountry, values?.projectState),
    {
      enabled: !!values?.projectState, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching country data
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  // Component rendering logic goes here
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        {values?.campaignType === 'CHARITY' ? 'Project Location ' : 'Campaign Location '}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.addressLineOne && errors.addressLineOne}>
            <TextField
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
              id="addressLineOne"
              {...getFieldProps('addressLineOne')}
              error={touched.addressLineOne && !!errors.addressLineOne}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.addressLineTwo && errors.addressLineTwo}>
            <TextField
              variant="standard"
              fullWidth
              label={<>Address Line 2</>}
              id="addressLineTwo"
              {...getFieldProps('addressLineTwo')}
              error={touched.addressLineTwo && !!errors.addressLineTwo}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.projectCountry && errors.projectCountry}>
            <TextFieldSelect
              id="projectCountry"
              label={
                <>
                  Select Country{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              onBlur={() => {
                queryClient.setQueryData(['getCities', values?.projectState], []);
              }}
              getFieldProps={getFieldProps}
              itemsData={country}
              error={Boolean(touched.projectCountry && errors.projectCountry)}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.projectState && errors.projectState}>
            <TextFieldSelect
              id="projectState"
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
              error={Boolean(touched.projectState && errors.projectState)}
              disabled={!isEdit || !values?.projectCountry}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          {citiesData && citiesData.length > 0 ? (
            <FieldWithSkeleton isLoading={isLoading} error={touched.projectCity && errors.projectCity}>
              <TextFieldSelect
                id="projectCity"
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
                error={Boolean(touched.projectCity && errors.projectCity)}
                disabled={!isEdit || !values?.projectState}
              />
            </FieldWithSkeleton>
          ) : (
            <FieldWithSkeleton isLoading={isLoading} error={touched.projectCity && errors.projectCity}>
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
                id="projectCity"
                name={`projectCity`}
                getFieldProps={getFieldProps}
                error={touched.projectCity && !!errors.projectCity}
                disabled={!isEdit || !values?.projectState}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
