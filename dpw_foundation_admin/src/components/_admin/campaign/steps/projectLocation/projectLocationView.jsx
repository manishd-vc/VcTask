'use client';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as api from 'src/services';

/**
 * ProjectLocationView component displays the location details of the campaign project,
 * including the country, state, and city. It fetches this data using queries to the API
 * based on the current campaign's location.
 *
 * @param {Object} props - Component properties
 *
 * @returns {JSX.Element} The rendered ProjectLocationView component.
 */
export default function ProjectLocationView() {
  // Accessing the current campaign update data from Redux store
  const { campaignUpdateData } = useSelector((state) => state?.campaign);

  // Fetching country data using a query
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  // Fetching state data based on the selected country
  const { data: projectStateData } = useQuery(
    ['getStates', campaignUpdateData?.projectCountry],
    () => api.getStates(campaignUpdateData?.projectCountry),
    {
      enabled: !!campaignUpdateData?.projectCountry, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching city data based on the selected state
  const { data: citiesData } = useQuery(
    ['getCities', campaignUpdateData?.projectState],
    () => api.getCities(campaignUpdateData?.projectCountry, campaignUpdateData?.projectState),
    {
      enabled: !!campaignUpdateData?.projectState, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching the label for the selected country, state, and city
  const countryLabel = country?.find((item) => item?.code === campaignUpdateData?.projectCountry)?.label;
  const stateLabel = projectStateData?.find((item) => item?.code === campaignUpdateData?.projectState)?.label;
  const cityLabel = citiesData?.find((item) => item?.code === campaignUpdateData?.projectCity)?.label;

  // Component rendering logic goes here

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
        {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Location' : 'Project Location'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Country' : 'Project Country'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {countryLabel || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign State/Province' : 'Project State/Province'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {stateLabel || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign City' : 'Project City'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {cityLabel || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Address Line 1' : 'Project Address Line 1'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.addressLineOne || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Address Line 2' : 'Project Address Line 2'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.addressLineTwo || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
