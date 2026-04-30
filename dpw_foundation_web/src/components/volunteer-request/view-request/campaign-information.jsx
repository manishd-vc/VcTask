import { Box, Checkbox, FormControlLabel, Grid, Link, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import WaiverDialog from 'src/components/dialogs/WaiverDialog';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as myEnrolmentApi from 'src/services/myEnrolment';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import ActivityTable from '../track-activity/ActivityTable';

const FieldDisplay = ({ label, value, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function CampaignInformation({ data, enrollmentData, enrollmentId }) {
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const theme = useTheme();
  const styles = {
    ...CommonStyle(theme)
  };
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loggedHoursData, setLoggedHoursData] = useState({});
  const [openWaiverDialog, setOpenWaiverDialog] = useState(false);

  const handleOpenWaiver = () => {
    setOpenWaiverDialog(true);
  };

  const handleCloseWaiver = () => {
    setOpenWaiverDialog(false);
  };

  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const { isLoading, refetch } = useQuery(
    ['viewLoggedHours', enrollmentId, searchKeyword, status, fromDate, toDate, page, size],
    () =>
      myEnrolmentApi.getLogActivityHoursPagination(enrollmentId, {
        keyword: searchKeyword,
        statuses: status ? [status] : [],
        createdDate: { fromDate, toDate },
        datePattern: 'M/d/yyyy',
        page,
        size
      }),
    {
      enabled: !!enrollmentId,
      onSuccess: (data) => setLoggedHoursData(data?.data || {})
    }
  );

  const { mutate: exportLoggedHours } = useMutation(
    'exportLoggedHours',
    () =>
      myEnrolmentApi.exportLogActivityHours(enrollmentId, {
        keyword: searchKeyword,
        statuses: status ? [status] : [],
        createdDate: { fromDate, toDate },
        datePattern: 'M/d/yyyy'
      }),
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response?.data?.message || 'Export failed', variant: 'error' }));
      }
    }
  );

  const { data: statisticsData } = useQuery(
    ['statistics-approved-hours', enrollmentData?.userId, enrollmentData?.id],
    () => myEnrolmentApi.getStatistics(enrollmentData?.userId, enrollmentData?.id, 'approved-log-hours'),
    { enabled: !!enrollmentData?.userId && !!enrollmentData?.id }
  );

  const {
    volunteerCampaignTitle,
    volunteerCampaignDescription,
    startDateTime,
    endDateTime,
    region,
    organizationName,
    addressLineOne,
    addressLineTwo,
    countryName,
    stateName,
    city,
    eventType,
    enrollmentStartDateTime,
    enrollmentEndDateTime,
    genderRequired,
    noOfVolunteersRequired,
    minimumHoursRequired,
    fromAge,
    toAge,
    nationalityRequired,
    languageRequired,
    customCriteria
  } = data || {};

  const getNationalityLabels = (nationalities) => {
    if (!nationalities?.length) return '-';
    return nationalities.map((n) => country?.find((c) => c.code === n.code)?.label || n.code).join(', ');
  };

  const getLanguageLabels = (languages) => {
    if (!languages?.length) return '-';
    return languages.map((l) => getLabelByCode(masterData, 'dpwf_language', l.code) || l.code).join(', ');
  };

  const campaignDetails = [
    { label: 'Volunteer Campaign Title', value: volunteerCampaignTitle },
    { label: 'Volunteer Campaign Description', value: volunteerCampaignDescription },
    { label: 'Campaign Start Date', value: startDateTime ? fDateWithLocale(startDateTime) : '-' },
    { label: 'End Date', value: endDateTime ? fDateWithLocale(endDateTime) : '-' },
    { label: 'Region', value: region },
    { label: 'Organization Name', value: organizationName },
    { label: 'Address Line 1', value: addressLineOne },
    { label: 'Address Line 2', value: addressLineTwo },
    { label: 'Country', value: countryName },
    { label: 'State/Province', value: stateName },
    { label: 'City', value: city },
    { label: 'Event Type', value: eventType }
  ];

  const enrolmentCriteria = [
    { label: 'Enrolment Start Date', value: enrollmentStartDateTime ? fDateWithLocale(enrollmentStartDateTime) : '-' },
    { label: 'Enrolment End Date', value: enrollmentEndDateTime ? fDateWithLocale(enrollmentEndDateTime) : '-' },
    { label: 'Gender Required', value: genderRequired },
    { label: 'Volunteers Required', value: noOfVolunteersRequired },
    { label: 'Minimum Hours Required', value: minimumHoursRequired },
    { label: 'From Age', value: fromAge },
    { label: 'To Age', value: toAge },
    { label: 'Nationality Required', value: getNationalityLabels(nationalityRequired) },
    { label: 'Language Required', value: getLanguageLabels(languageRequired) }
  ];

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary.main" textTransform="uppercase">
              Volunteer Campaign Details
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle6" component="h4" textTransform="uppercase" color="primary.main">
              Campaign Details
            </Typography>
          </Grid>
          {campaignDetails.map((field) => (
            <FieldDisplay key={field.label} label={field.label} value={field.value} gridProps={field.gridProps} />
          ))}

          <Grid item xs={12}>
            <Typography variant="subtitle6" component="h4" textTransform="uppercase" color="primary.main">
              Volunteer Enrolment and Selection Criteria
            </Typography>
          </Grid>
          {enrolmentCriteria.map((field) => (
            <FieldDisplay key={field.label} label={field.label} value={field.value} />
          ))}

          <Grid item xs={12}>
            <Typography variant="subtitle4" color="text.black">
              Custom Criteria
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {customCriteria?.length > 0 ? (
              <Stack spacing={2}>
                {customCriteria.map((criteria) => (
                  <Box
                    key={criteria?.id}
                    sx={{
                      ...styles.documentCard
                    }}
                  >
                    <Grid container spacing={2}>
                      <FieldDisplay label="Criteria" value={criteria?.criteria} />
                      <FieldDisplay label="Criteria Requirement" value={criteria?.criteriaRequirement} />
                    </Grid>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  ...styles.documentCard
                }}
              >
                <Typography color="secondary.darker">No Custom Criteria</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={enrollmentData?.termsAndConditionsWaiverAccepted || false} disabled />}
              label={
                <span>
                  I accept and agree to the terms of this waiver.{' '}
                  <Link
                    component="button"
                    variant="blue"
                    size="small"
                    onClick={handleOpenWaiver}
                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    View Waiver
                  </Link>
                </span>
              }
            />
          </Grid>
        </Grid>
      </Paper>
      <ActivityTable
        loggedHours={loggedHoursData?.content || []}
        paginationData={loggedHoursData}
        page={page}
        setPage={setPage}
        size={size}
        setSize={setSize}
        isLoading={isLoading}
        totalApprovedHours={statisticsData?.data?.totalApprovedHours || 0}
        status={status}
        setStatus={setStatus}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        handleExport={() => exportLoggedHours()}
        refetch={refetch}
        showMilestoneId={false}
        showSearch={false}
        showFilters={false}
        showDatePicker={false}
      />

      {/* Waiver Dialog */}
      <WaiverDialog
        open={openWaiverDialog}
        onClose={handleCloseWaiver}
        templateData={enrollmentData?.waiverFormContent || 'No waiver content available'}
        agreeButtonText="Close"
        onAgree={handleCloseWaiver}
      />
    </>
  );
}
