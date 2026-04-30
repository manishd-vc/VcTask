import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { addDays, format } from 'date-fns';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from 'react-query';
import DatePickers from 'src/components/datePicker';
import * as api from 'src/services';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
/**
 * CampaignDetails component handles the form view for campaign details.
 * It fetches master data, retrieves the campaign category and coverage,
 * and queries the supervisor roles. It also utilizes Formik for form handling.
 *
 * @param {boolean} isLoading - Indicates if the data is still loading.
 * @param {boolean} isEdit - Indicates whether the form is in edit mode.
 */

CampaignDetails.propTypes = {
  // 'isLoading' is a boolean indicating whether the data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating whether the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};
export default function CampaignDetails({ isLoading, isEdit }) {
  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();
  const { data: roleSupervisor } = useQuery(['role-supervisor'], () =>
    api.getRoleSuperVisorList('fund_manage_supervisor')
  );
  const theme = useTheme();
  function getCampaignTitle(campaignType) {
    if (campaignType === 'FUNDCAMP') {
      return 'Campaign Basic Details';
    } else if (campaignType === 'CHARITY') {
      return 'Project Basic Details';
    } else {
      return 'Campaign Details';
    }
  }

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        {getCampaignTitle(values?.campaignType)}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.campaignTitle && errors.campaignTitle}>
            <TextField
              id="campaignTitle"
              {...getFieldProps('campaignTitle')}
              variant="standard"
              label={
                <>
                  {values?.campaignType === 'CHARITY' ? 'Project Title ' : 'Campaign Title '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              error={touched.campaignTitle && Boolean(errors.campaignTitle)}
              fullWidth
              disabled={!isEdit} // Disable if not in edit mode
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <DatePickers
            label={
              <>
                {values?.campaignType === 'CHARITY' ? 'Project Start Date ' : 'Campaign Start Date '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            onChange={(value) => {
              if (value) {
                // Ensure the value is a valid date before formatting
                try {
                  const formattedValue = format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss");
                  setFieldValue('startDateTime', formattedValue);
                } catch (error) {
                  console.error('Invalid date value:', error);
                  setFieldValue('startDateTime', null);
                }
              } else {
                setFieldValue('startDateTime', null);
              }
            }}
            value={values?.startDateTime ? new Date(values.startDateTime) : null}
            type="date"
            fullWidth
            readOnly={true}
            disabled={!isEdit}
            error={touched.startDateTime && Boolean(errors.startDateTime)}
            helperText={touched.startDateTime && errors.startDateTime}
            minDate={new Date()}
            handleClear={() => {
              setFieldValue('startDateTime', null);
              setFieldValue('endDateTime', null);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <DatePickers
            label={
              <>
                {values?.campaignType === 'CHARITY' ? 'Project End Date ' : 'Campaign End Date '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            onChange={(value) => {
              if (value) {
                // Ensure the value is a valid date before formatting
                try {
                  const formattedValue = format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss");
                  setFieldValue('endDateTime', formattedValue);
                } catch (error) {
                  console.error('Invalid date value:', error);
                  setFieldValue('endDateTime', null);
                }
              } else {
                setFieldValue('endDateTime', null);
              }
            }}
            value={values?.endDateTime || null}
            type="date"
            fullWidth
            minDate={values.startDateTime ? addDays(new Date(values.startDateTime), 1) : new Date()}
            disabled={!isEdit}
            error={touched.endDateTime && Boolean(errors.endDateTime)}
            helperText={touched.endDateTime && errors.endDateTime}
            handleClear={() => setFieldValue('endDateTime', null)}
          />
        </Grid>
        {values?.campaignType === 'FUNDCAMP' && (
          <Grid item xs={12}>
            <FieldWithSkeleton
              isLoading={isLoading}
              label="Applied Methods *"
              error={touched.appliedMethod && errors.appliedMethod}
            >
              <TextField
                id="appliedMethod"
                label={
                  <>
                    Applied Methods
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                {...getFieldProps('appliedMethod')}
                error={touched.appliedMethod && Boolean(errors.appliedMethod)}
                fullWidth
                variant="standard"
                disabled={!isEdit}
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        <Grid item xs={12}>
          <FieldWithSkeleton
            isLoading={isLoading}
            label="Campaign Description *"
            error={touched.campaignDescription && errors.campaignDescription}
          >
            <TextField
              id="campaignDescription"
              label={
                <>
                  {values?.campaignType === 'CHARITY' ? 'Project Description ' : 'Campaign Description '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              {...getFieldProps('campaignDescription')}
              error={touched.campaignDescription && Boolean(errors.campaignDescription)}
              fullWidth
              multiline
              rows={2}
              variant="standard"
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.projectManagerId && errors.projectManagerId}>
            <FormControl variant="standard" fullWidth>
              <Autocomplete
                options={roleSupervisor?.content || []}
                value={roleSupervisor?.content?.filter((user) => user.id === values?.projectManagerId)[0] || null}
                onChange={(event, newValue) => {
                  setFieldValue('projectManagerName', `${newValue?.firstName} ${newValue?.lastName}` || '');
                  // Get user objects, not just IDs, and update temporary selection
                  setFieldValue('projectManagerId', newValue?.id || '');
                }}
                disabled={!isEdit}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName || ''}`}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <>
                        {values?.campaignType === 'CHARITY' ? 'Project Supervisor ' : 'Campaign Supervisor '}
                        <Box component="span" sx={{ color: 'error.main' }}>
                          *
                        </Box>
                      </>
                    }
                    variant="standard"
                    error={touched.projectManagerId && Boolean(errors.projectManagerId)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                renderOption={(props, item) => {
                  return (
                    <li
                      {...props}
                      key={item.id}
                      style={{
                        color: theme.palette.text.secondarydark
                      }}
                    >
                      {`${item.firstName} ${item.lastName}`}
                    </li>
                  );
                }}
              />
            </FormControl>
          </FieldWithSkeleton>
        </Grid>
      </Grid>
    </Paper>
  );
}
