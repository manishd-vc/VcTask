'use client';
// mui
import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import CampaignMilestones from 'src/components/charts/campaign/campaignMilestones';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
Milestone.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function Milestone({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState([]);
  useQuery(
    ['campaign-milestone', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        trendType: 'Monthly',
        type: 'campaign-milestones',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.campaignMilestonesResponse) {
          let milestone = [];
          for (const element of data?.campaignMilestonesResponse.campaignMilestones) {
            milestone.push([element.days, element.amountRaised]);
          }
          setDashboardCardData(milestone);
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
          Campaign Milestones
        </Typography>
        <CampaignMilestones data={dashboardCardData} />
      </CardContent>
    </Card>
  );
}
