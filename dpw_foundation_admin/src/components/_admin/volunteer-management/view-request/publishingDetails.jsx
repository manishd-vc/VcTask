'use client';
import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';

export default function PublishingDetails() {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);
  const theme = useTheme();
  const style = CommonStyle(theme);
  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={2} item xs={12} sm={12}>
        <Grid item xs={12}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              You want to start publish this campaign on public website ?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {volunteerCampaignData?.publishOnPublicWebsite ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {volunteerCampaignData?.publishOnPublicWebsite && (
          <Stack spacing={2} mt={2}>
            <Box
              sx={{
                ...style.documentCard
              }}
            >
              <Typography color={'text.secondarydark'} fontWeight={400} variant="body2" pb={2}>
                Select Start Date-time and End Date-time to Publish Campaign on DPWF Public Website
              </Typography>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={6} md={4}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Start Date & Time
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {volunteerCampaignData?.publishStartDateTime}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Start Date & Time
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {volunteerCampaignData?.publishEndDateTime}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        )}
      </Grid>
    </Paper>
  );
}
