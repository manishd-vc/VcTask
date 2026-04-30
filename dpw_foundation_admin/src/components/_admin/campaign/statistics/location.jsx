'use client';

import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

Location.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function Location({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState([]);

  const { isLoading } = useQuery(
    ['campaign-location-wise-fundcamp-', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate,
        toDate,
        campaignType: type,
        type: 'location-wise-fundcamp',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.locationwiseFund) {
          setDashboardCardData(data.locationwiseFund);
        }
      },
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Something went wrong',
            variant: 'error'
          })
        );
      }
    }
  );

  const activeData = useMemo(() => {
    return dashboardCardData
      .filter((item) => item.noOfDonations > 0)
      .map((item) => ({
        location: item.location,
        noOfDonors: item.noOfDonations
      }));
  }, [dashboardCardData]);

  const chartData = useMemo(() => {
    return {
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
  }, [activeData]);

  const shouldRenderChart = chartData.series.length > 0;
  let renderChartContent;

  if (isLoading) {
    renderChartContent = <Skeleton variant="circular" width={200} height={200} />;
  } else if (shouldRenderChart) {
    renderChartContent = (
      <ReactApexChart options={chartData.options} series={chartData.series} type="pie" height={200} />
    );
  } else {
    renderChartContent = (
      <Typography variant="body2" color="textSecondary">
        No data available
      </Typography>
    );
  }

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
            Location wise Campaigns
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
          {renderChartContent}
        </Box>
      </CardContent>
    </Card>
  );
}
