'use client';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useQuery } from 'react-query';
import * as api from 'src/services';
import { fDateShortMonth } from 'src/utils/formatTime';

export default function CampaignDetailsView({ campaignData }) {
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  // Fetching state data based on the selected country
  const { data: projectStateData } = useQuery(
    ['getStates', campaignData?.projectCountry],
    () => api.getStates(campaignData?.projectCountry),
    {
      enabled: !!campaignData?.projectCountry, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching city data based on the selected state
  const { data: citiesData } = useQuery(
    ['getCities', campaignData?.projectState],
    () => api.getCities(campaignData?.projectCountry, campaignData?.projectState),
    {
      enabled: !!campaignData?.projectState, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching the label for the selected country, state, and city
  const countryLabel = country?.find((item) => item?.code === campaignData?.projectCountry)?.label;
  const stateLabel = projectStateData?.find((item) => item?.code === campaignData?.projectState)?.label;
  const cityLabel = citiesData?.find((item) => item?.code === campaignData?.projectCity)?.label;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={4}>
          <Stack sx={{ backgroundColor: (theme) => theme.palette.grey[50] }}>
            <Image
              src={campaignData?.bannerUrl || '/dpwfadm/images/default.png'}
              alt="Cover Image"
              width={800}
              height={600}
              layout="responsive"
              unoptimized={true}
              style={{ maxHeight: '150px', objectFit: 'contain' }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Project Start Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignData?.startDateTime ? fDateShortMonth(campaignData.startDateTime) : '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Project End Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignData?.endDateTime ? fDateShortMonth(campaignData.endDateTime) : '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Project Supervisor
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignData?.projectManagerName || '-'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Project Description
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignData?.campaignDescription || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
          Project Location
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Project Country
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {countryLabel || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Project State/Province
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {stateLabel || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Project City
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {cityLabel || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Project Address Line 1
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignData?.addressLineOne || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Project Address Line 2
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignData?.addressLineTwo || '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
