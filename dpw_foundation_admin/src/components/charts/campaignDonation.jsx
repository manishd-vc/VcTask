import { merge } from 'lodash';
import PropTypes from 'prop-types';
// chart
import ReactApexChart from 'react-apexcharts';
// mui
import { Box, Card, CardContent, CardHeader, Grid, Skeleton, Stack, Typography } from '@mui/material';
import BaseOptionChart from 'src/components/charts/BaseOptionChart';
import TextFieldSelect from '../TextFieldSelect';
// components

/**
 * CampaignDonation - A component that displays a campaign donation chart with filtering options and loading skeletons.
 *
 * @param {Array} data - The data to be displayed in the chart.
 * @param {boolean} isLoading - A flag indicating whether the data is still loading.
 *
 * @returns {JSX.Element} - A card component that either shows a loading skeleton or the chart with donation data.
 */
export default function CampaignDonation({ data, isLoading }) {
  const categories = data?.map((item) => item.groupByKey); // x-axis labels
  const seriesData = data?.map((item) => item.countPerGroupBy); // y-axis values

  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: true,
      width: 0
    },
    xaxis: {
      categories
    },
    tooltip: {
      y: {
        formatter: (val) => val
      }
    },
    yaxis: {
      opposite: false,
      labels: {
        formatter: function (val) {
          return val.toFixed(0); // Format the y-axis labels to display no decimals
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader
        title={'Campaign Donations'} // Title of the card
        titleTypographyProps={{
          variant: 'h6',
          sx: { color: 'primary.main', textTransform: 'uppercase' }
        }}
      />
      <CardContent>
        {/* Filtering and campaign details section */}
        <Box sx={{ backgroundColor: (theme) => theme.palette.backgrounds.light, pl: 3, pb: 3, mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={6}>
              <TextFieldSelect label="Filter By Campaign Name" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Publish Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  01/01/2025
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  05/01/2025
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Display chart or skeleton loader based on isLoading flag */}
        {isLoading ? (
          <Box mx={3}>
            {/* Skeleton loader for chart */}
            <Skeleton variant="rectangular" width="100%" height={219} sx={{ borderRadius: 2, mt: 3 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1,
                mb: 3
              }}
            >
              {[...Array(10).keys()].map((i) => (
                <Skeleton key={i} variant="text" sx={{ width: 40 }} />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
            {/* Render chart when data is not loading */}
            <ReactApexChart
              type="bar" // Bar chart type
              series={[
                {
                  name: 'Donations',
                  data: seriesData
                }
              ]}
              options={chartOptions} // Chart options
              height={260} // Chart height
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// Prop validation for the component
CampaignDonation.propTypes = {
  data: PropTypes.array.isRequired, // The data to be displayed in the chart
  isLoading: PropTypes.bool.isRequired // Flag indicating if data is loading
};
