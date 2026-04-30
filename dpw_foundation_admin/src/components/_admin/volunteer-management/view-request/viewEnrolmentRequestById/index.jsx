'use client';
import { Paper, Stack, Typography } from '@mui/material';
import { fDateWithLocale } from 'src/utils/formatTime';
import ActivityLogDetails from './ActivityLogDetails';
import RequestDetails from './request-details';
import VolunteerCampaignDetails from './volunteer-campaign-details';
import VolunteerInformation from './volunteer-information-index';

export default function ViewEnrollmentRequestById({ enrollmentData }) {
  const { status, regretReason, updatedOn } = enrollmentData || {};
  const rejectStatus = ['REGRETTED'];
  const showRejectionBox = rejectStatus.includes(status);

  const rejectStatusDate = (date) => {
    return date ? fDateWithLocale(date) : '-';
  };

  return (
    <>
      <Stack spacing={3}>
        <RequestDetails enrollmentData={enrollmentData} />
        {showRejectionBox && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.main' }}>
            <Typography variant="subtitle4" color="text.white">
              Rejection Reason | Rejection Date : {rejectStatusDate(updatedOn)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} color="text.white">
              {regretReason || '-'}
            </Typography>
          </Paper>
        )}
        <Paper sx={{ p: 3, mb: 3 }}>
          <VolunteerInformation enrollmentData={enrollmentData} />
          {/* <Box>
            <AvailabilitySection availability={enrollmentData?.availability || []} />
          </Box> */}
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <VolunteerCampaignDetails enrollmentData={enrollmentData} />
        </Paper>
        <ActivityLogDetails enrollmentData={enrollmentData} />
      </Stack>
    </>
  );
}
