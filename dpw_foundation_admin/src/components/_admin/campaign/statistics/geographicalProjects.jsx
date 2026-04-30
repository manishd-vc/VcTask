'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

GeograhicalProject.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function GeograhicalProject({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [locationData, setLocationData] = useState([]);

  useQuery(
    ['campaign-geographical-project', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        type: 'location-wise-projects',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const list = data?.locationWiseResponse || [];
        const transformed = list.map((item) => ({
          location: item.location,
          noOfCampaigns: item.numberOfCampaigns || 0,
          fundsSpent: item.fundsSpent || 0
        }));
        setLocationData(transformed);
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err?.response?.data?.message || 'Error fetching data', variant: 'error' }));
      }
    }
  );

  const chartData = {
    series: locationData.map((item) => item.noOfCampaigns),
    options: {
      chart: {
        type: 'pie',
        height: 280
      },
      labels: locationData.map((item) => item.location),
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        custom: function ({ series, seriesIndex, w }) {
          const data = locationData[seriesIndex];
          return `
            <div style="padding: 8px 12px; font-size: 13px;">
              <div><strong>Location:</strong> ${data.location}</div>
              <div><strong>Projects:</strong> ${data.noOfCampaigns}</div>
              <div><strong>Fund Spent:</strong> ${Number(data.fundsSpent || 0).toLocaleString()}</div>
            </div>
          `;
        }
      },
      colors: ['#2C2C85', '#6C63FF', '#A2A2D0', '#D4D4F7', '#E6E6FA']
    }
  };

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
            Location wise projects
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {locationData.length > 0 ? (
            <ReactApexChart options={chartData.options} series={chartData.series} type="pie" height={200} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No data available
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
