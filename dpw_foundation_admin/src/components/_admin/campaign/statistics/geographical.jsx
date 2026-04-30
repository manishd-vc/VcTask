'use client';

import { Box, Card, CardContent, Skeleton, Stack, Switch, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

Geograhical.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function Geograhical({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [, setSelected] = useState(null);
  const [dashboardCardData, setDashboardCardData] = useState([]);

  const [currentTrendType, setCurrentTrendType] = useState('region');
  const isContinentWiseSelected = currentTrendType === 'region';

  const { isLoading, isFetching } = useQuery(
    ['campaign-geographical', fromDate, toDate, type, checked, currentTrendType],
    async () => {
      const response = await api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        trendType: currentTrendType,
        type: 'donors-distribution',
        myOnly: !checked
      });
      return response;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.graphicalDistribution) {
          setDashboardCardData(data.graphicalDistribution);
          if (data.graphicalDistribution.length > 0) {
            setSelected(data.graphicalDistribution[0]);
          } else {
            setSelected(null);
          }
        } else {
          setDashboardCardData([]);
          setSelected(null);
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
        setDashboardCardData([]);
        setSelected(null);
      },
      keepPreviousData: true
    }
  );

  const activeData = dashboardCardData;

  const chartData = {
    series: activeData.length > 0 ? activeData.map((item) => item.noOfDonors) : [],
    options: {
      chart: {
        type: 'pie',
        height: 280
      },
      labels: activeData.length > 0 ? activeData.map((item) => item.location) : [],
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
      colors: ['#2C2C85', '#6C63FF', '#A2A2D0', '#D4D4F7', '#E6E6FA', '#8B0000', '#FFD700', '#008000', '#4B0082']
    }
  };

  const handleSwitchChange = () => {
    setCurrentTrendType((prevType) => (prevType === 'region' ? '' : 'region'));
  };
  let renderChartContent;

  if (isFetching || (isLoading && activeData.length === 0)) {
    renderChartContent = <Skeleton variant="circular" width={180} height={180} />;
  } else if (activeData.length === 0) {
    renderChartContent = (
      <Typography>
        No {isContinentWiseSelected ? 'continent/region' : 'country'} data available for the selected period.
      </Typography>
    );
  } else {
    renderChartContent = (
      <ReactApexChart options={chartData?.options} series={chartData?.series} type="pie" height={200} />
    );
  }

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'self-start'}>
          <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
            Geographical Dist. of Donors
          </Typography>
          <Stack flexDirection="row" alignItems={'self-start'}>
            <Tooltip
              title={isContinentWiseSelected ? 'Continent Wise' : 'Country Wise'}
              arrow
              placement={isContinentWiseSelected ? 'right' : 'left'}
            >
              <Box>
                <Switch checked={!isContinentWiseSelected} onChange={handleSwitchChange} disabled={isFetching} />
              </Box>
            </Tooltip>
          </Stack>
        </Stack>
        <Box
          sx={{
            position: 'relative',
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pb: 2
          }}
        >
          {renderChartContent}
        </Box>
      </CardContent>
    </Card>
  );
}
