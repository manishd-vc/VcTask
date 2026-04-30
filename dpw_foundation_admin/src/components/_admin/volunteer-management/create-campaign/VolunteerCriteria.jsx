import { Autocomplete, CircularProgress, FormControl, Grid, Paper, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import CustomCriteria from './CustomCriteria';

export default function VolunteerCriteria() {
  const { setFieldValue, setFieldTouched, values, handleChange, handleBlur } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const volunteerGenderData = getLabelObject(masterData, 'dpwf_volunteer_gender');
  const volunteerAgeData = getLabelObject(masterData, 'dpwf_volunteer_age');
  const sortedVolunteerAgeData = {
    ...volunteerAgeData,
    values: volunteerAgeData?.values
      ? [...volunteerAgeData.values].sort((a, b) => parseInt(a.label) - parseInt(b.label))
      : []
  };

  const languageData = getLabelObject(masterData, 'dpwf_language');

  // Fetching country data
  const { data: country, isLoading: countryLoading } = useQuery(['getCountry'], () => api.getCountry());

  return (
    <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Volunteer selection criteria
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={false}>
            <TextFieldSelect
              id="genderRequired"
              label="Gender Required"
              name="genderRequired"
              value={values?.genderRequired}
              itemsData={volunteerGenderData?.values}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton isLoading={false}>
            <TextField
              id="volunteersRequiredCount"
              variant="standard"
              fullWidth
              label="Volunteers Required"
              name="volunteersRequiredCount"
              value={values?.volunteersRequiredCount || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 255 }}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton isLoading={false}>
            <TextField
              id="minimumHoursRequired"
              variant="standard"
              fullWidth
              label="Minimum Hours Required"
              name="minimumHoursRequired"
              value={values?.minimumHoursRequired || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 255 }}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={false}>
            <TextFieldSelect
              id="fromAge"
              label="From Age"
              name="fromAge"
              value={values?.fromAge}
              itemsData={sortedVolunteerAgeData?.values}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={false}>
            <TextFieldSelect
              id="toAge"
              label="To Age"
              name="toAge"
              value={values?.toAge}
              itemsData={sortedVolunteerAgeData?.values}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FormControl variant="standard" fullWidth>
            <Autocomplete
              multiple
              limitTags={2}
              options={country || []}
              value={(values?.nationalityRequired || []).map(
                (item) => country?.find((c) => c.code === item.code) || null
              )}
              onBlur={() => {
                setFieldTouched('nationalityRequired', true, true);
              }}
              onChange={(event, newValue) => {
                const validValues = newValue
                  .filter((option) => option && option.code)
                  .map((option) => ({ code: option.code }));
                setFieldValue('nationalityRequired', validValues, true); // Third parameter validates immediately
              }}
              getOptionLabel={(option) => option?.label || ''}
              isOptionEqualToValue={(option, value) => option?.code === value?.code}
              sx={{
                '& .MuiInputBase-root': {
                  height: 'auto !important', // let it grow
                  alignItems: 'flex-start', // align tags properly
                  flexWrap: 'wrap', // allow wrapping
                  paddingTop: '6px',
                  paddingBottom: '6px'
                },
                '& .MuiInputBase-input': {
                  height: 'auto !important'
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Nationality Required"
                  name="nationalityRequired"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {countryLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Typography component="li" {...props} key={option.id} color="text.secondarydark">
                  {option.label}
                </Typography>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FormControl variant="standard" fullWidth>
            <Autocomplete
              limitTags={2}
              multiple
              options={languageData?.values || []}
              value={(values?.languageRequired || []).map(
                (item) => languageData?.values?.find((c) => c.code === item.code) || null
              )}
              onBlur={() => {
                setFieldTouched('languageRequired', true, true);
              }}
              onChange={(event, newValue) => {
                const validValues = newValue
                  .filter((option) => option && option.code)
                  .map((option) => ({ code: option.code }));
                setFieldValue('languageRequired', validValues, true);
              }}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              sx={{
                '& .MuiInputBase-root': {
                  height: 'auto !important', // let it grow
                  alignItems: 'flex-start', // align tags properly
                  flexWrap: 'wrap', // allow wrapping
                  paddingTop: '6px',
                  paddingBottom: '6px'
                },
                '& .MuiInputBase-input': {
                  height: 'auto !important'
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Language Required"
                  name="languageRequired"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <>{params.InputProps.endAdornment}</>
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Typography component="li" {...props} key={option.id} color="text.secondarydark">
                  {option.label}
                </Typography>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
      <CustomCriteria />
    </Paper>
  );
}
