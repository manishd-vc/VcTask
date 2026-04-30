import { merge } from 'lodash';
import PropTypes from 'prop-types';
// chart
import ReactApexChart from 'react-apexcharts';
// mui
import { Box, Card, CardHeader, Skeleton, useTheme } from '@mui/material';
// components
import BaseOptionChart from 'src/components/charts/BaseOptionChart';

/**
 * DonorEnrollments - A component that displays donor enrollment data in a donut chart, with a loading skeleton when data is unavailable.
 *
 * @param {Array} data - The data to be displayed in the donut chart.
 * @param {boolean} isLoading - A flag indicating whether the data is still loading.
 *
 * @returns {JSX.Element} - A card component with a donut chart or loading skeleton.
 */
export default function DonorEnrollments({ data, isLoading }) {
  // Use the MUI theme for consistent styling
  const theme = useTheme();
  const chartData = data?.map((item) => item.countPerGroupBy);
  const chartLabels = data?.map((item) => item.groupByKey);

  const chartOptions = merge(BaseOptionChart('donut'), {
    labels: chartLabels,
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main
    ],
    stroke: { colors: [theme.palette.background.paper] },
    dataLabels: {
      enabled: false,
      dropShadow: { enabled: false },
      formatter: function (val) {
        return val.toFixed(0) + '%'; // Format data labels as percentages
      }
    },
    plotOptions: {
      pie: {
        donut: { labels: { show: true }, size: '85%' },
        expandOnClick: true,
        offsetX: 0
      }
    }
  });

  return (
    <Card
      sx={{
        pb: 2, // Padding bottom
        borderRadius: '0px', // No border radius
        boxShadow: 'unset', // Remove shadow
        '& .apexcharts-canvas': {
          margin: '0 auto' // Center the chart
        }
      }}
    >
      <CardHeader
        title={'Donor Registrations'} // Title of the card
        titleTypographyProps={{
          variant: 'h6',
          sx: { color: 'primary.main', textTransform: 'uppercase' } // Title styling
        }}
      />
      {isLoading ? (
        <Box maxWidth="365px" width="100%" mx="auto">
          {/* Skeleton loader for the donut chart */}
          <Skeleton variant="circular" width={190} height={190} sx={{ mx: 'auto', mb: 2.4 }} />
          {/* Skeletons for labels */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              mt: 1,
              px: 3
            }}
          >
            <Skeleton variant="text" sx={{ width: '30%' }} />
            <Skeleton variant="text" sx={{ width: '30%' }} />
            <Skeleton variant="text" sx={{ width: '30%' }} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              mb: 1.6,
              px: 3
            }}
          >
            <Skeleton variant="text" sx={{ width: '30%' }} />
            <Skeleton variant="text" sx={{ width: '30%' }} />
          </Box>
        </Box>
      ) : (
        <ReactApexChart type="donut" series={chartData} options={chartOptions} width="365px" />
      )}
    </Card>
  );
}

/**
 * Prop validation for the DonorEnrollments component.
 *
 * @param {Array} data - Data for the donut chart (array of numbers).
 * @param {boolean} isLoading - Whether the component is loading data.
 */
DonorEnrollments.propTypes = {
  data: PropTypes.array.isRequired, // Data for the chart
  isLoading: PropTypes.bool.isRequired // Flag indicating loading state
};
