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
AverageDonation.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function AverageDonation({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState({
    largestSpent: 0,
    averageDonation: 0,
    largestDonation: 0,
    totalBeneficiary: 0
  });

  useQuery(
    ['campaign-largest-donation', fromDate, toDate, type],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        myOnly: !checked,
        type: 'average-largest-donation'
      }),
    {
      enabled: type === 'FUNDCAMP',
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.largestDonation) {
          setDashboardCardData({
            ...dashboardCardData,
            largestDonation: data?.largestDonation || 0,
            averageDonation: data?.averageDonation || 0
          });
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  useQuery(
    ['campaign-total-beneficiaries-', fromDate, toDate, type],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'total-beneficiaries',
        myOnly: !checked
      }),
    {
      enabled: type === 'CHARITY',
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.totalBeneficiary) {
          setDashboardCardData({
            ...dashboardCardData,
            totalBeneficiary: data?.totalBeneficiary || 0
          });
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );
  useQuery(
    ['campaign-largest-spent-', fromDate, toDate, type],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'largest-spent',
        myOnly: !checked
      }),
    {
      enabled: type === 'CHARITY',
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.largestSpent) {
          setDashboardCardData({
            ...dashboardCardData,
            largestSpent: data?.largestSpent?.current ? data?.largestSpent?.current : 0
          });
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  return (
    <>
      {type === 'FUNDCAMP' ? (
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
              Average Donation Amount
            </Typography>
            <Typography variant="chartValue" color="secondary.darker" component="p" mb={3}>
              {dashboardCardData?.averageDonation}
            </Typography>
            <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
              Largest Single Donation
            </Typography>
            <Typography variant="chartValue" color="secondary.darker" component="p">
              {dashboardCardData?.largestDonation}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
              Total number of beneficiaries
            </Typography>
            <Typography variant="chartValue" color="secondary.darker" component="p">
              {dashboardCardData?.totalBeneficiary}
            </Typography>
            <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
              Largest Single spent
            </Typography>
            <Typography variant="chartValue" color="secondary.darker" component="p">
              {dashboardCardData?.largestSpent}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
