/**
 * TimeLineView component displays the timeline information for the campaign.
 * It uses data from the Redux store to show the campaign's start and end dates.
 * The dates are formatted using the `fDateWithLocale` function.
 *
 * @returns {JSX.Element} The rendered TimeLineView component displaying campaign timeline details.
 */
'use client';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { fDateWithLocale } from 'src/utils/formatTime';

export default function TimeLineView() {
  // Accessing campaign update data from Redux store
  const { campaignUpdateData } = useSelector((state) => state?.campaign);

  return (
    <Paper sx={{ p: 4, mb: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Timeline
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Campaign Start Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.startDateTime && fDateWithLocale(campaignUpdateData?.startDateTime, true)}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Campaign End Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.endDateTime && fDateWithLocale(campaignUpdateData?.endDateTime, true)}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
