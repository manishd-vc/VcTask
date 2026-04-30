'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

DonationChannel.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function DonationChannel({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState({
    website: 0,
    mobile: 0,
    cash: 0,
    other: 0
  });
  const { isLoading } = useQuery(
    ['campaign-donation-channel', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'donation-channel-used',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.donationChannel) {
          setDashboardCardData(data.donationChannel);
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );
  const activeData = Object.keys(dashboardCardData)
    .filter((key) => dashboardCardData[key] > 0)
    .map((key) => ({
      location: key.charAt(0).toUpperCase() + key.slice(1),
      noOfDonors: dashboardCardData[key]
    }));

  const chartData = {
    series: activeData.map((item) => item.noOfDonors),
    options: {
      chart: {
        type: 'pie',
        height: 220
      },
      labels: activeData.map((item) => item.location),
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toLocaleString()}`
        }
      },
      colors: ['#2C2C85', '#6C63FF', '#A2A2D0', '#D4D4F7', '#E6E6FA']
    }
  };
  let renderChartContent;
  if (isLoading) {
    renderChartContent = (
      <Box display="flex" justifyContent="center" alignItems="center" height={180}>
        <Typography>Loading chart data...</Typography>
      </Box>
    );
  } else if (activeData.length > 0) {
    renderChartContent = (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ReactApexChart options={chartData.options} series={chartData.series} type="pie" height={180} />
      </Box>
    );
  } else {
    renderChartContent = (
      <Box display="flex" justifyContent="center" alignItems="center" height={180}>
        <Typography>No donation channel data available for the selected period.</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
            Donation Channels Used
          </Typography>
        </Box>
        {renderChartContent}
      </CardContent>
    </Card>
  );
}
