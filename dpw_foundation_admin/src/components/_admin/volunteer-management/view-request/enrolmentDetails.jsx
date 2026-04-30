'use client';
import { Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { fDateShortMonth } from 'src/utils/formatTime';

export default function EnrolmentDetails() {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            No of Volunteers Required
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.noOfVolunteersRequired}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Enrolment Start Date
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.enrollmentStartDateTime
              ? fDateShortMonth(volunteerCampaignData.enrollmentStartDateTime)
              : '-'}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Enrolment End Date
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.enrollmentEndDateTime
              ? fDateShortMonth(volunteerCampaignData.enrollmentEndDateTime)
              : '-'}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Target Volunteering Hours
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.targetVolunteeringHrs}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
