import { Grid, Paper, Stack, Typography } from '@mui/material';

const VolunteerDetails = ({ enrollmentData }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={4} p={2}>
        <Grid item xs={12} sm={3}>
          <Stack spacing={0.4}>
            <Typography variant="body3" color="text.secondary">
              Campaign ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {enrollmentData?.volunteerCampaign?.volunteerCampaignNumericId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Stack spacing={0.4}>
            <Typography variant="body3" color="text.secondary">
              Volunteer Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform={'capitalize'}>
              {enrollmentData?.firstName ? `${enrollmentData?.firstName} ${enrollmentData?.lastName}` : '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Stack spacing={0.4}>
            <Typography variant="body3" color="text.secondary">
              Mobile
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {enrollmentData?.phoneNumber || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Stack spacing={0.4}>
            <Typography variant="body3" color="text.secondary">
              Campaign Location
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {enrollmentData?.volunteerCampaign?.countryName || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default VolunteerDetails;
