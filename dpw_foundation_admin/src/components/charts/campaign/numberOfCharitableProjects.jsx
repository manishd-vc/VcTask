'use client';

import { Box, Skeleton, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * NumberOfCharitableProjects - A line chart component displaying monthly project execution data.
 *
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {Object} props.data - The chart data containing category labels and values
 * @returns {JSX.Element}
 */
export default function NumberOfCharitableProjects({ isLoading, data }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    series: [],
    options: {}
  });

  useEffect(() => {
    const formattedCategories = [];
    const formattedValues = [];

    if (data?.category?.length && data?.data?.length) {
      data.data.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          Object.entries(item).forEach(([key, value]) => {
            formattedCategories.push(key);
            formattedValues.push(Number(value));
          });
        }
      });
    }

    setChartData({
      series: [
        {
          name: 'Projects Executed',
          data: formattedValues
        }
      ],
      options: {
        chart: {
          type: 'line',
          height: 200,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        stroke: {
          curve: 'straight',
          width: 2,
          colors: ['#1A1446']
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: formattedCategories,
          title: {
            text: 'Monthly',
            style: {
              fontWeight: 500,
              fontSize: '14px'
            }
          },
          labels: {
            rotate: 0,
            style: {
              colors: theme.palette.text.secondary,
              fontSize: '8px'
            }
          },
          axisBorder: { show: true, color: theme.palette.divider },
          axisTicks: { show: true, color: theme.palette.divider }
        },
        yaxis: {
          min: 0,
          tickAmount: 6,
          title: {
            text: 'Projects Executed',
            style: {
              fontWeight: 500,
              fontSize: '10px'
            }
          },
          labels: {
            style: {
              colors: theme.palette.text.secondary
            },
            formatter: (val) => Math.floor(val)
          },
          axisBorder: { show: true, color: theme.palette.divider },
          axisTicks: { show: true, color: theme.palette.divider }
        },
        grid: {
          borderColor: theme.palette.divider,
          strokeDashArray: 3,
          yaxis: { lines: { show: true } },
          xaxis: { lines: { show: false } }
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} projects`
          }
        }
      }
    });
  }, [data, theme]);

  return (
    <Box sx={{ p: 2 }}>
      {isLoading ? (
        <Skeleton variant="rectangular" height={200} />
      ) : (
        <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={200} />
      )}
    </Box>
  );
}

NumberOfCharitableProjects.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.shape({
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    category: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.array
  })
};
