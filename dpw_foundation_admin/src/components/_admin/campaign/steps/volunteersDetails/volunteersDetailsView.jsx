/**
 * VolunteersDetailsView component to display volunteering requirements in a campaign.
 * It shows whether volunteers are required, the number of target volunteers,
 * and a description of the volunteer requirements.
 *
 * @param {Object} props - The props for the component.
 *
 * @returns {JSX.Element} The rendered VolunteersDetailsView component.
 */
'use client';
import { Card, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

export default function VolunteersDetailsView() {
  // Accessing the campaign update data from the Redux store
  const { campaignUpdateData } = useSelector((state) => state?.campaign);

  return (
    <Paper sx={{ p: 3 }}>
      {/* <Typography variant="h6" component="p" textTransform={'uppercase'} color="text.black" mb={3}>
        Volunteering Requirement
      </Typography> */}
      {campaignUpdateData?.isVolunteersRequired && (
        <Grid container spacing={2} item xs={12} sm={12}>
          <Grid item xs={12} sm={6} md={3} display="flex">
            <Stack display="flex" flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
              <Card variant="bordered" sx={{ height: '100%', mb: 3 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondarydark">
                    Total Target Volunteers
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {campaignUpdateData?.noVolunteersRequired || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Volunteers Required?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.isVolunteersRequired ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>
        {campaignUpdateData?.isVolunteersRequired && (
          <>
            <Grid item xs={12} md={4}>
              <Stack flexDirection="column">
                <Typography variant="body3" color="text.secondary">
                  No. of Target Volunteers
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.noVolunteersRequired}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
              <Stack flexDirection="column">
                <Typography variant="body3" color="text.secondary">
                  Volunteers Description
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.volunteersRequiredDescriptions}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}
