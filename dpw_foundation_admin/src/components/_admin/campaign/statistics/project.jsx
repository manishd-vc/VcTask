'use client';
// mui
import { Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import DashboardCard from 'src/components/_admin/dashboard/dashboardCard';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
Project.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string
};

export default function Project({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState({
    upcoming: 0,
    inprogress: 0,
    completed: 0
  });
  const { isLoading } = useQuery(
    ['campaign-project-status', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        trendType: 'Monthly',
        type: 'project-status',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.statusResponse) {
          setDashboardCardData(data?.statusResponse);
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} display="flex">
          <Stack display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <DashboardCard title="Upcoming" value={dashboardCardData?.upcoming || 0} isLoading={isLoading} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4} display="flex">
          <Stack display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <DashboardCard
              title="In Progress"
              valueColor="warning.dark"
              value={dashboardCardData?.inprogress || 0}
              isLoading={isLoading}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4} display="flex">
          <Stack display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <DashboardCard
              valueColor="success.main"
              title="Completed"
              value={dashboardCardData?.completed || 0}
              isLoading={isLoading}
            />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
