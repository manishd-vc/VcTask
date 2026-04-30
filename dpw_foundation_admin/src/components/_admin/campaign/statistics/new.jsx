'use client';
// mui
import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
New.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string
};

export default function New({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState({
    totalDonors: 0,
    newDonors: 0,
    recurringDonors: 0,
    other: 0
  });
  useQuery(
    ['campaign-new-recurring-donors-', fromDate, toDate, type],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'new-recurring-donors',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.donorsResponse) {
          setDashboardCardData({
            ...dashboardCardData,
            totalDonors: data?.donorsResponse?.totalDonors || 0,
            newDonors: data?.donorsResponse?.newDonors || 0,
            recurringDonors: data?.donorsResponse?.recurringDonors || 0,
            other: data?.donorsResponse?.other || 0
          });
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );
  return (
    // <Card sx={{ height: '100%' }}>
    //   <CardContent>
    //     <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
    //       New vs. Recurring Donors
    //     </Typography>
    //     <NewVsRecurringDonors data={dashboardCardData} />
    //   </CardContent>
    // </Card>
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
          new donors
        </Typography>
        <Typography variant="chartValue" color="secondary.darker" component="p" mb={3}>
          {dashboardCardData?.newDonors}
        </Typography>
        <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
          recurring donors
        </Typography>
        <Typography variant="chartValue" color="secondary.darker" component="p">
          {dashboardCardData?.recurringDonors}
        </Typography>
      </CardContent>
    </Card>
  );
}
