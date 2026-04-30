'use client';
import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import StepperStyle from '../stepper.styles';
/**
 * RiskAssessmentView component renders the related tasks for the campaign.
 * It uses Redux to fetch the current campaign update data and applies custom styles based on the theme.
 *
 * @returns {JSX.Element} The rendered RiskAssessmentView component.
 */
export default function RiskAssessmentView() {
  // Accessing the theme and applying custom styles
  const theme = useTheme();
  const styles = StepperStyle(theme);

  // Fetching campaign update data from Redux store
  const { campaignUpdateData } = useSelector((state) => state?.campaign);

  // Component logic and JSX rendering go here

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Grid item xs={12} md={12}>
        <Stack gap={2} justifyContent="space-between" flexDirection="row" alignItems="center" sx={{ pb: 3 }}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign related tasks' : 'Project related tasks'}
          </Typography>
        </Stack>
        {campaignUpdateData?.campaignTasks?.map((item) => (
          <Box sx={{ ...styles.moreBox }} key={item?.id}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Task Description
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.taskDescription}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Measure
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.taskMeasure}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Assign To
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.taskAssigneeId?.firstName + ' ' + item?.taskAssigneeId?.lastName}
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
