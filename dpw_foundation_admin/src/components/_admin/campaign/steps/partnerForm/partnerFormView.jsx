'use client';
import { Box, Card, CardContent, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import Export from '../export';
import StepperStyle from '../stepper.styles';

/**
 * PartnerFormView component renders a view of the partner information related to the campaign.
 * It displays the campaign's partner details such as the partner's name, description, and other relevant info.
 *
 * @returns {JSX.Element} The rendered PartnerFormView component.
 */
export default function PartnerFormView() {
  // Using Material-UI's theme and creating custom styles
  const theme = useTheme();
  const styles = StepperStyle(theme);
  const { campaignUpdateData } = useSelector((state) => state?.campaign);

  // Component rendering logic goes here
  return (
    <Paper sx={{ p: 3 }}>
      {/* <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
        Partner Requirement
      </Typography> */}
      <Grid container spacing={2} item xs={12} sm={12}>
        {campaignUpdateData?.isPartnerRequired && (
          <Grid item xs={12} sm={6} md={3} display="flex">
            <Stack display="flex" flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' }, mb: 3 }}>
              <Card variant="bordered" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondarydark">
                    Total Partner(s)
                  </Typography>
                  <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                    {campaignUpdateData?.campaignPartners?.length}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP'
                ? 'Partners Required for This Campaign '
                : 'Partners Required for This Project'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.isPartnerRequired ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          {campaignUpdateData?.isPartnerRequired && (
            <Grid container>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
                  Partner Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ py: 2, textAlign: 'right' }}>
                <Export id={campaignUpdateData?.id} type={'CAMPAIGN_PARTNER'} />
              </Grid>
            </Grid>
          )}
          {campaignUpdateData?.campaignPartners?.map((item) => (
            <Box sx={{ ...styles.moreBox }} key={item?.id}>
              <Grid container rowSpacing={2} gap={1}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Stack flexDirection="column">
                        <Typography variant="body3" color="text.secondary">
                          {campaignUpdateData?.campaignType === 'FUNDCAMP'
                            ? 'Campaign Partner Company Name'
                            : 'Campaign Partners Required for This Project'}
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {item?.partnerCompanyName}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack flexDirection="column">
                        <Typography variant="body3" color="text.secondary">
                          Contact Name
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark" textTransform={'capitalize'}>
                          {item?.contactName ? item?.contactName : `${item?.firstName} ${item?.lastName}`}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack flexDirection="column">
                        <Typography variant="body3" color="text.secondary">
                          Contact Number
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {item?.contactNumber}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Stack flexDirection="column">
                    <Typography variant="body3" color="text.secondary">
                      Contact Email ID
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {item?.contactEmail}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
}
