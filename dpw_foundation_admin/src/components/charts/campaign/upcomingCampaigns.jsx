import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// chart

/**
 * UpcomingCampaigns - A component that displays a campaign donation chart with filtering options and loading skeletons.
 *
 * @param {Array} data - The data to be displayed in the chart.
 * @param {boolean} isLoading - A flag indicating whether the data is still loading.
 *
 * @returns {JSX.Element} - A card component that either shows a loading skeleton or the chart with donation data.
 */
export default function UpcomingCampaigns() {
  const theme = useTheme();
  const achieved = 40;
  const target = 100;
  const pending = target - achieved;
  const [chartData] = useState({
    series: [
      {
        name: 'Achieved',
        data: [achieved] // Blue bar
      },
      {
        name: 'Pending',
        data: [pending] // Grey bar
      }
    ],
    options: {
      chart: {
        type: 'bar',
        stacked: true,
        redrawOnParentResize: true,
        sparkline: { enabled: true }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      tooltip: { enabled: false },
      xaxis: {
        min: 0,
        max: target,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { labels: { show: false } },
      grid: { show: false },
      fill: {
        colors: [theme.palette.primary.light, theme.palette.grey[200]]
      },
      dataLabels: { enabled: false }
    }
  });
  return (
    <>
      <Box>
        <Typography variant="subtitle4" color="secondary.darker" mb={2} component="h5">
          Support Tanzania
        </Typography>
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={'20px'} />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle4" color="secondary.darker" mb={2} component="h5">
          Help for Nigeria
        </Typography>
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={'20px'} />
      </Box>
    </>
  );
}

// Prop validation for the component
UpcomingCampaigns.propTypes = {
  data: PropTypes.array.isRequired, // The data to be displayed in the chart
  isLoading: PropTypes.bool.isRequired // Flag indicating if data is loading
};
