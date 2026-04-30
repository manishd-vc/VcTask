'use client';
import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import Export from '../export';
import StepperStyle from '../stepper.styles';
/**
 * RelatedTasksView component renders the related tasks for the campaign.
 * It uses Redux to fetch the current campaign update data and applies custom styles based on the theme.
 *
 * @returns {JSX.Element} The rendered RelatedTasksView component.
 */
export default function RelatedTasksView() {
  // Accessing the theme and applying custom styles
  const theme = useTheme();
  const styles = StepperStyle(theme);

  // Fetching campaign update data from Redux store
  const { campaignUpdateData } = useSelector((state) => state?.campaign);

  // Component logic and JSX rendering go here

  return (
    <Paper sx={{ p: 3 }}>
      <Grid item xs={12} md={12}>
        <Grid container>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" textTransform={'uppercase'} color="text.black">
              {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign related tasks' : 'Project related tasks'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ py: 2, textAlign: 'right' }}>
            <Export id={campaignUpdateData?.id} type={'CAMPAIGN_TASK'} />
          </Grid>
        </Grid>
        {campaignUpdateData?.campaignTasks?.map((item) => (
          <Box sx={{ ...styles.moreBox }} key={item?.id}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Task Description
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.taskDescription || '-'}
                  </Typography>
                </Stack>
              </Grid>
              {/* <Grid item xs={12} md={3}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Measure
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.taskMeasure || '-'}
                  </Typography>
                </Stack>
              </Grid> */}
              <Grid item xs={12} md={5}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Assign To
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.taskAssigneeId
                      ? `${item.taskAssigneeId.firstName || ''} ${item.taskAssigneeId.lastName || ''}`.trim() || '-'
                      : '-'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Grid>
    </Paper>
  );
}
