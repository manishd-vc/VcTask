'use client';

import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

ReportPieChart.propTypes = {
  data: PropTypes.array
};

export default function ReportPieChart({ data }) {
  // Transform data to get total projects per sector
  const transformedData = data?.map(item => {
    const total = item['Not yet Started'] + item['On-going'] + item['Completed'];
    return {
      sector: item.Sector,
      total,
      details: {
        notStarted: item['Not yet Started'],
        ongoing: item['On-going'],
        completed: item['Completed']
      }
    };
  }) || [];

  const chartData = {
    series: transformedData.map(item => item.total),
    options: {
      chart: {
        type: 'pie',
        height: 280
      },
      labels: transformedData.map(item => item.sector),
      legend: {
        show: true
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        custom: function ({ series, seriesIndex }) {
          const item = transformedData[seriesIndex];
          if (!item) return '';
          return `
            <div style="padding: 8px 12px; font-size: 13px;">
              <div><strong>Sector:</strong> ${item.sector}</div>
              <div><strong>Total Projects:</strong> ${item.total}</div>
              <div><strong>Not Started:</strong> ${item.details.notStarted}</div>
              <div><strong>On-going:</strong> ${item.details.ongoing}</div>
              <div><strong>Completed:</strong> ${item.details.completed}</div>
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
          Projects Per Sector
        </Typography>

        {transformedData?.length > 0 ? (
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
