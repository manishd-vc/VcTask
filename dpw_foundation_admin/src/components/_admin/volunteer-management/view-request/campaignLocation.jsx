'use client';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as api from 'src/services';

export default function CampaignLocation() {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);

  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const { data: projectStateData } = useQuery(
    ['getStates', volunteerCampaignData?.country],
    () => api.getStates(volunteerCampaignData?.country),
    {
      enabled: !!volunteerCampaignData?.country,
      refetchOnWindowFocus: false
    }
  );

  const { data: citiesData } = useQuery(
    ['getCities', volunteerCampaignData?.state],
    () => api.getCities(volunteerCampaignData?.country, volunteerCampaignData?.state),
    {
      enabled: !!volunteerCampaignData?.state,
      refetchOnWindowFocus: false
    }
  );

  const countryLabel = country?.find((item) => item?.code === volunteerCampaignData?.country)?.label;
  const stateLabel = projectStateData?.find((item) => item?.code === volunteerCampaignData?.state)?.label;
  const cityLabel = citiesData?.find((item) => item?.code === volunteerCampaignData?.city)?.label;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
        Campaign Location
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign Country
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {countryLabel || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign State/Province
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {stateLabel || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign City
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {cityLabel || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign Address Line 1
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {volunteerCampaignData?.addressLineOne || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign Address Line 2
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {volunteerCampaignData?.addressLineTwo || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
