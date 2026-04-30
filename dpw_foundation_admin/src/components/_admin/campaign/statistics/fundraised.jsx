'use client';
// mui
import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import TotalFundsRaised from 'src/components/charts/campaign/totalFundsRaised';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
FundRaised.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function FundRaised({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState([]);
  useQuery(
    ['campaign-fund-raised', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'totalFundsRaised',
        myOnly: !checked
      }),
    {
      enabled: type === 'FUNDCAMP',
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.fundsRaisedResponse) {
          setDashboardCardData([...dashboardCardData, ...data?.fundsRaisedResponse]);
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  useQuery(
    ['campaign-totalFundsSpent-' + type, fromDate, toDate, type],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'totalFundsSpent',
        myOnly: !checked
      }),
    {
      enabled: type === 'CHARITY',
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.fundsResponse) {
          setDashboardCardData([...dashboardCardData, ...data?.fundsResponse]);
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
          {type === 'FUNDCAMP' ? 'Total Funds Raised' : 'Total Funds spent'}
        </Typography>
        <TotalFundsRaised data={dashboardCardData} />
      </CardContent>
    </Card>
  );
}
