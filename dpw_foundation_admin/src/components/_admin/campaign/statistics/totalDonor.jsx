'use client';
// mui
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { DonorManagementIcon } from 'src/components/icons';

import * as api from 'src/services';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
TotalDonor.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function TotalDonor({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState({
    totalDonors: 0,
    individual: 0,
    organization: 0
  });
  useQuery(
    ['campaign-total-donor', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'donor-segment',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.topDonorSegment) {
          setDashboardCardData({
            ...dashboardCardData,
            totalDonors: Number(data.topDonorSegment.totalDonors),
            individual: Number(data.topDonorSegment.individual),
            organization: Number(data.topDonorSegment.organization)
          });
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
          Total Number of Donors
        </Typography>
        <Stack sx={{ pt: 2 }}>
          <DonorManagementIcon width={90} height={50} />
          <Typography variant="chartValue" color="primary.light" component="p" sx={{ fontWeight: 600 }} py={2}>
            {dashboardCardData?.totalDonors}
          </Typography>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle5" color="primary.main" component="h2">
                {dashboardCardData?.individual}
              </Typography>
              <Typography variant="body3" component="p" sx={{ pt: 0.5 }}>
                Individual
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle5" color="primary.main" component="h2">
                {dashboardCardData?.organization}
              </Typography>
              <Typography variant="body3" component="p" sx={{ pt: 0.5 }}>
                Organization
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
