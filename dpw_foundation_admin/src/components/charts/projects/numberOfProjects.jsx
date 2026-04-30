import { Box, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
// chart
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * NumberOfProjects - A component that displays a campaign donation chart with filtering options and loading skeletons.
 *
 * @param {Array} data - The data to be displayed in the chart.
 * @param {boolean} isLoading - A flag indicating whether the data is still loading.
 *
 * @returns {JSX.Element} - A card component that either shows a loading skeleton or the chart with donation data.
 */
export default function NumberOfProjects() {
  const theme = useTheme();
  const totalDonors = 3667;
  const [chartData] = useState({
    series: [
      {
        name: 'Number of Donations',
        data: [0, 120, 210, 90, 340, 400, 210, 540, 600]
      }
    ],
    options: {
      chart: {
        type: 'area',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: true,
          tools: {
            download: false
          }
        }
      },

      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisBorder: {
          show: true
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        }
      },
      stroke: {
        show: true,
        curve: 'smooth',
        width: 2,
        colors: [theme.palette.primary.main]
      },
      fill: {
        type: 'gradient',
        gradient: {
          enabled: true,
          shadeIntensity: 1,
          type: 'vertical'
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$ ' + val + ' thousands';
          }
        }
      }
    }
  });

  return (
    <>
      <Box>
        <Typography variant="chartValue" color="secondary.darker">
          {totalDonors}
        </Typography>
      </Box>
      <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={'200px'} />
    </>
  );
}

// Prop validation for the component
NumberOfProjects.propTypes = {
  data: PropTypes.array.isRequired, // The data to be displayed in the chart
  isLoading: PropTypes.bool.isRequired // Flag indicating if data is loading
};
