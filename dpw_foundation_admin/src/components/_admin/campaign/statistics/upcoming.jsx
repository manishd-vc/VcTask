'use client';

// mui
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import Scrollbar from 'src/components/Scrollbar';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';

Upcoming.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function Upcoming({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState([]);
  const { isLoading } = useQuery(
    ['campaign-upcoming', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        type: 'upcoming-campaigns',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.upcomingCampaigns) {
          setDashboardCardData(data?.upcomingCampaigns || []);
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  // ✅ Extracted conditional rendering block
  let renderCardContent;

  if (isLoading) {
    renderCardContent = (
      <Stack gap={1}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="40%" height={30} />
      </Stack>
    );
  } else if (dashboardCardData?.length > 0) {
    renderCardContent = (
      <Scrollbar>
        {dashboardCardData.map((item, index) => {
          const key = item?.campaignId || item?.id || `${item?.titleOfCampaign}-${index}`;
          return (
            <Box
              key={key}
              sx={{
                borderBottom: (theme) =>
                  index !== dashboardCardData.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                mb: 1
              }}
            >
              <Typography variant="subtitle4" color="text.secondarydark" component="h4" mb={0.5}>
                {item?.titleOfCampaign}
              </Typography>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Stack direction="column" rowGap={0.3}>
                  <Typography component="span" variant="subtitle2" color="primary.main">
                    Start Date:{' '}
                  </Typography>
                  <Typography component="span" variant="body3" color="primary.main">
                    {item?.date ? fDateWithLocale(item.date) : '-'}
                  </Typography>
                </Stack>
                <Stack direction="column" rowGap={0.3}>
                  <Typography component="span" variant="subtitle2" color="primary.main">
                    Location:{' '}
                  </Typography>
                  <Typography component="span" variant="body3" color="primary.main">
                    {item?.location ?? '-'}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </Scrollbar>
    );
  } else {
    renderCardContent = (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
        <Typography variant="body2" color="textSecondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={3} component="h4">
          Upcoming Campaigns
        </Typography>
        <Box sx={{ height: '280px' }}>{renderCardContent}</Box>
      </CardContent>
    </Card>
  );
}
