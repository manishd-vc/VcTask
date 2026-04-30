import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { fDateWithLocale } from 'src/utils/formatTime';

export default function PublishingDetails() {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
        {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Publish Campaign' : 'Publish Project '}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" component="p" color="text.secondarydark" mb={1}>
            You want to start publish this campaign on public website ?
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {campaignUpdateData?.isToPublicallyPublish ? 'Yes' : 'No'}
          </Typography>
        </Grid>
        {campaignUpdateData?.isToPublicallyPublish && (
          <Grid item xs={12}>
            {campaignUpdateData?.isPublishOnIacadApprove === false ? (
              <Box sx={{ backgroundColor: (theme) => theme.palette.backgrounds.light, p: 4, mt: 1 }}>
                <Typography color={'text.secondarydark'} variant="subtitle1" pb={2}>
                  Select Start Date-time and End Date-time to publish campaign on DPWF Public Website
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection={'column'} gap={0.5}>
                      <Typography variant="body2" component="p" color="text.secondary">
                        Start Date & Time
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {campaignUpdateData?.publishEndDateTime
                          ? fDateWithLocale(campaignUpdateData?.publishStartDateTime, true)
                          : '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection={'column'} gap={0.5}>
                      <Typography variant="body2" component="p" color="text.secondary">
                        End Date & Time
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {campaignUpdateData?.publishEndDateTime
                          ? fDateWithLocale(campaignUpdateData?.publishEndDateTime, true)
                          : '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Grid item xs={12}>
                <Stack flexDirection={'column'} gap={0.5}>
                  <Typography variant="body2" component="p" color="text.secondarydark" mb={1}>
                    Publish Campaign after IACAD Approval ?
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.isPublishOnIacadApprove ? 'Yes' : 'No'}
                  </Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
