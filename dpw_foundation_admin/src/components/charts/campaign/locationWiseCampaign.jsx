import { Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
// chart
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * LocationWiseCampaign - A component that displays a campaign donation chart with filtering options and loading skeletons.
 *
 * @param {Array} data - The data to be displayed in the chart.
 * @param {boolean} isLoading - A flag indicating whether the data is still loading.
 *
 * @returns {JSX.Element} - A card component that either shows a loading skeleton or the chart with donation data.
 */
export default function LocationWiseCampaign({ data }) {
  console.log('datadatadata', data);
  const theme = useTheme();

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      labels: [],
      chart: {
        type: 'pie',
        redrawOnParentResize: true
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      colors: [
        theme.palette.primary.main,
        theme.palette.primary.light,
        theme.palette.primary.mainLight,
        theme.palette.secondary.darker,
        theme.palette.secondary.darker_60
      ],
      responsive: [
        {
          breakpoint: 768, // Tablets
          options: {
            chart: {
              width: '100%'
            }
          }
        },
        {
          breakpoint: 480, // Mobile devices
          options: {
            chart: {
              width: '100%'
            }
          }
        }
      ]
    }
  });

  useEffect(() => {
    setChartData({
      series: data.data,
      options: {
        labels: data.labels,
        chart: {
          type: 'pie',
          redrawOnParentResize: true
        },
        legend: {
          show: false
        },
        colors: [
          theme.palette.primary.main,
          theme.palette.primary.light,
          theme.palette.primary.mainLight,
          theme.palette.secondary.darker,
          theme.palette.secondary.darker_60
        ],
        responsive: [
          {
            breakpoint: 768, // Tablets
            options: {
              chart: {
                width: '100%'
              }
            }
          },
          {
            breakpoint: 480, // Mobile devices
            options: {
              chart: {
                width: '100%'
              }
            }
          }
        ]
      }
    });
  }, [data]);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 'auto'
      }}
    >
      <ReactApexChart options={chartData.options} series={chartData.series} type="pie" width="100%" />
    </Box>
  );
}

// Prop validation for the component
LocationWiseCampaign.propTypes = {
  data: PropTypes.array.isRequired, // The data to be displayed in the chart
  isLoading: PropTypes.bool.isRequired // Flag indicating if data is loading
};
