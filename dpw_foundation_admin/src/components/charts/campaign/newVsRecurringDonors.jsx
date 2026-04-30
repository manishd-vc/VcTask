import { Box, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
// chart
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * NewVsRecurringDonors - A component that displays a campaign donation chart with filtering options and loading skeletons.
 *
 * @param {Array} data - The data to be displayed in the chart.
 * @param {boolean} isLoading - A flag indicating whether the data is still loading.
 *
 * @returns {JSX.Element} - A card component that either shows a loading skeleton or the chart with donation data.
 */
export default function NewVsRecurringDonors({ data }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Current',
        data: [0]
      },
      {
        name: 'Goal',
        data: [0]
      }
    ],
    options: {
      colors: [theme.palette.primary.light, theme.palette.primary.main],
      chart: {
        type: '350',
        redrawOnParentResize: true,
        height: 380,
        maxWidth: '70%'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '85%',
          barHeight: '100%',
          borderRadius: 5,
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 8,
        colors: [theme.palette.grey[0]]
      },
      xaxis: {
        categories: ['Current', 'Goal'],
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        max: 0,
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      grid: {
        show: false
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$ ' + val;
          }
        }
      },
      legend: {
        show: true,
        position: 'right',
        floating: false,
        itemMargin: {
          vertical: 20
        },
        markers: {
          width: 8,
          height: 8,
          radius: 0
        },
        onItemClick: {
          toggleDataSeries: false
        }
      }
    }
  });

  useEffect(() => {
    setChartData({
      series: [
        {
          name: 'New',
          data: [data?.newDonors]
        },
        {
          name: 'Recurring Donors',
          data: [data?.recurringDonors]
        }
      ],
      options: {
        colors: [theme.palette.primary.mainLight, theme.palette.primary.main],
        chart: {
          type: '350',
          height: 380,
          maxWidth: '70%'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '85%',
            barHeight: '100%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 8,
          colors: [theme.palette.grey[0]]
        },
        xaxis: {
          categories: ['New', 'Recurring Donors'],
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          min: 0,
          max: data?.newDonors,
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          }
        },
        grid: {
          show: false
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            }
          }
        },
        legend: {
          show: true,
          position: 'right',
          floating: false,
          itemMargin: {
            vertical: 20
          },
          markers: {
            width: 8,
            height: 8,
            radius: 0
          },
          onItemClick: {
            toggleDataSeries: false
          }
        }
      }
    });
  }, [data]);
  return (
    <Stack direction="column" alignItems="center" justifyContent="space-evenly" spacing={3} sx={{ width: '100%' }}>
      <Stack
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <Box>
          <Typography variant="subtitle2" color="primary.main">
            Total Donors
          </Typography>
          <Typography variant="chartValue" color="secondary.darker">
            {data?.totalDonors}
          </Typography>
        </Box>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          width={'100%'}
          height={'180px'}
        />
      </Stack>
    </Stack>
  );
}

// Prop validation for the component
NewVsRecurringDonors.propTypes = {
  data: PropTypes.array.isRequired, // The data to be displayed in the chart
  isLoading: PropTypes.bool.isRequired // Flag indicating if data is loading
};
