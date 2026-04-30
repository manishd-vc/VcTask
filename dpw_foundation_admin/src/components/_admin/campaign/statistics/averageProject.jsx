'use client';

import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';

AverageProject.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function AverageProject({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();

  // Hold an array of objects like { category, percentage, totalFundsSpent }
  const [dashboardCardData, setDashboardCardData] = useState([]);
  const { masterData } = useSelector((state) => state?.common);
  const moduleLabel = getLabelObject(masterData, 'dpw_foundation_campaign_category');
  useQuery(
    ['campaign-sector-average', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        type: 'sector-average',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        const spendingData = res?.averageSpending;
        if (Array.isArray(spendingData)) {
          const chartData = spendingData.map((item) => ({
            category: item.category,
            percentage: item.percentage ?? 0,
            totalFundsSpent: item.totalFundsSpent ?? 0
          }));
          setDashboardCardData(chartData);
        }
      },
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Something went wrong!',
            variant: 'error'
          })
        );
      }
    }
  );

  const chartData = {
    series: dashboardCardData.map((item) => item.percentage),
    options: {
      chart: {
        type: 'pie',
        height: 280
      },
      labels: dashboardCardData.map(
        (item) => moduleLabel?.values?.find((val) => val.code === item.category)?.label || item.category
      ),
      legend: {
        show: true
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        custom: function ({ series, seriesIndex }) {
          const data = dashboardCardData?.[seriesIndex];
          if (!data) return '';
          return `
            <div style="padding: 8px 12px; font-size: 13px;">
<div><strong>Sector:</strong> ${moduleLabel?.values?.find((val) => val.code === data.category)?.label || data.category}</div>
              <div><strong>Fund Spent:</strong> ${data.percentage.toFixed(0)}% (${Number(data.totalFundsSpent).toLocaleString()})</div>
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
        <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4" mb={3}>
          Percentage Per Sector Spent
        </Typography>

        {dashboardCardData?.length > 0 ? (
          <ReactApexChart options={chartData.options} series={chartData.series} type="pie" height={350} width="100%" />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
