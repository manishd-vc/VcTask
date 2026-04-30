import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelObject } from 'src/utils/extractLabelValues';

export default function VolunteerCampaignDetails() {
  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const volunteerRegionData = getLabelObject(masterData, 'dpwf_volunteer_region');

  const { data: organizationList } = useQuery(
    ['getVolunteerOrganizationList'],
    volunteerApi.getVolunteerOrganizationList
  );

  const newOrganizationList = organizationList?.data?.map((organization) => ({
    code: organization.organizationName,
    label: organization.organizationName
  }));

  return (
    <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Volunteer Campaign Basic Details
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton isLoading={false} error={touched.volunteerCampaignTitle && errors.volunteerCampaignTitle}>
            <TextField
              id="volunteerCampaignTitle"
              variant="standard"
              fullWidth
              label={
                <>
                  Volunteer Campaign Title{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputProps={{ maxLength: 255 }}
              {...getFieldProps('volunteerCampaignTitle')}
              error={Boolean(touched.volunteerCampaignTitle && errors.volunteerCampaignTitle)}
              value={values?.volunteerCampaignTitle}
              onChange={(e) => setFieldValue('volunteerCampaignTitle', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <DatePickers
            label={
              <>
                Campaign Start Date{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            inputFormat="yyyy-MM-dd HH:mm"
            handleClear={() => {
              setFieldValue('startDateTime', null);
              setFieldValue('endDateTime', null);
            }}
            onChange={(value) => setFieldValue('startDateTime', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
            value={values.startDateTime}
            error={touched.startDateTime && Boolean(errors.startDateTime)}
            helperText={touched.startDateTime && errors.startDateTime}
            type="date"
            maxDate={values.endDateTime}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DatePickers
            label={
              <>
                Campaign End Date{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            inputFormat="yyyy-MM-dd HH:mm"
            handleClear={() => {
              setFieldValue('endDateTime', null);
            }}
            onChange={(value) => setFieldValue('endDateTime', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
            value={values.endDateTime}
            error={touched.endDateTime && Boolean(errors.endDateTime)}
            helperText={touched.endDateTime && errors.endDateTime}
            type="date"
            minDate={values.startDateTime}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldWithSkeleton
            isLoading={false}
            error={touched.volunteerCampaignDescription && errors.volunteerCampaignDescription}
          >
            <TextField
              id="volunteerCampaignDescription"
              variant="standard"
              fullWidth
              label={
                <>
                  Volunteer Campaign Description{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputProps={{ maxLength: 255 }}
              {...getFieldProps('volunteerCampaignDescription')}
              error={Boolean(touched.volunteerCampaignDescription && errors.volunteerCampaignDescription)}
              value={values?.volunteerCampaignDescription}
              onChange={(e) => setFieldValue('volunteerCampaignDescription', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton isLoading={false} error={touched.region && errors.region}>
            <TextFieldSelect
              id="region"
              label={
                <>
                  Region{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={volunteerRegionData?.values}
              error={Boolean(touched.region && errors.region)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton isLoading={false} error={touched.organizationName && errors.organizationName}>
            <TextFieldSelect
              id="organizationName"
              label={
                <>
                  Organization Name{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={newOrganizationList || []}
              error={Boolean(touched.organizationName && errors.organizationName)}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
    </Paper>
  );
}
