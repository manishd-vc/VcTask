'use client';
// mui
import { Box, Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import OngoingCampaigns from 'src/components/charts/campaign/ongoingCampaigns';
import Scrollbar from 'src/components/Scrollbar';
import * as api from 'src/services';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
Ongoing.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function Ongoing({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState([]);
  useQuery(
    ['campaign-ongoing', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'ongoing-campaigns-fundraising',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.ongoingFundraising) {
          setDashboardCardData(data?.ongoingFundraising || []);
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
        <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={3} component="h4">
          Ongoing Campaigns
        </Typography>
        <Box sx={{ height: '280px' }}>
          <Scrollbar>
            {dashboardCardData.map((item) => (
              <OngoingCampaigns key={item.titleOfProject} data={item} />
            ))}
          </Scrollbar>
        </Box>
      </CardContent>
    </Card>
  );
}
