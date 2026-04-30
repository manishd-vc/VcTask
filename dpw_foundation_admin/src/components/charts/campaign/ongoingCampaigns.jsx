import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// chart

/**
 * OngoingCampaigns - A component that displays a campaign donation chart with filtering options and loading skeletons.
 *
 * @param {Array} data - The data to be displayed in the chart.
 * @param {boolean} isLoading - A flag indicating whether the data is still loading.
 *
 * @returns {JSX.Element} - A card component that either shows a loading skeleton or the chart with donation data.
 */
export default function OngoingCampaigns({ data }) {
  const theme = useTheme();
  const target = 100;
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Goal',
        data: [] // Blue bar
      },
      {
        name: 'Current',
        data: [] // Grey bar
      }
    ],
    colors: ['#5154B6', '#ECECFF'],
    options: {
      chart: {
        type: 'bar',
        redrawOnParentResize: true,
        sparkline: { enabled: true }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false
      },
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

  useEffect(() => {
    setChartData({
      series: [
        {
          name: 'Goal',
          data: [data?.targetFunds] // Blue bar
        },
        {
          name: 'Current',
          data: [data?.fundsRaised] // Grey bar
        }
      ],
      colors: ['#5154B6', '#ECECFF'],
      options: {
        chart: {
          type: 'bar',
          redrawOnParentResize: true,
          sparkline: { enabled: true }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top'
            }
          }
        },
        tooltip: {
          shared: true,
          intersect: false
        },
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
  }, [data]);
  return (
    <Box>
      <Typography variant="subtitle4" color="secondary.darker" mb={2} component="h5">
        {data?.titleOfProject}
      </Typography>
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={'20px'} />
    </Box>
  );
}

// Prop validation for the component
OngoingCampaigns.propTypes = {
  data: PropTypes.array.isRequired, // The data to be displayed in the chart
  isLoading: PropTypes.bool.isRequired // Flag indicating if data is loading
};
