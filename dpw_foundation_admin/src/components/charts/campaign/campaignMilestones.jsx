import { Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
// chart
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * CampaignMilestones - A component that displays a campaign donation chart with filtering options and loading skeletons.
 *
 * @param {Array} data - The data to be displayed in the chart.
 * @param {boolean} isLoading - A flag indicating whether the data is still loading.
 *
 * @returns {JSX.Element} - A card component that either shows a loading skeleton or the chart with donation data.
 */
export default function CampaignMilestones({ data }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Amount Raised',
        data: data
      }
    ],
    options: {
      chart: {
        type: 'line',
        height: 350,
        redrawOnParentResize: true,
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: 3, // Line thickness
        colors: [theme.palette.primary.main]
      },
      markers: {
        size: 0 // Hides markers
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: 'datetime',
        title: {
          text: 'Time Left'
        }
      },
      yaxis: {
        title: {
          text: 'Amount Raised'
        }
      },
      annotations: {
        xaxis: [
          {
            x: new Date('2024-02-01').getTime(),
            borderColor: '#000000',
            width: '1px',
            opacity: 1,
            strokeDashArray: 0
          }
        ]
      }
    }
  });

  useEffect(() => {
    setChartData({
      series: [
        {
          name: 'Amount Raised',
          data: data
        }
      ],
      options: {
        chart: {
          type: 'line',
          height: 350,
          redrawOnParentResize: true,
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        stroke: {
          width: 3, // Line thickness
          colors: [theme.palette.primary.main]
        },
        markers: {
          size: 0 // Hides markers
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'datetime',
          title: {
            text: 'Time Left'
          }
        },
        yaxis: {
          title: {
            text: 'Amount Raised'
          }
        },
        annotations: {
          xaxis: [
            {
              x: new Date('2024-02-01').getTime(),
              borderColor: '#000000',
              width: '1px',
              opacity: 1,
              strokeDashArray: 0
            }
          ]
        }
      }
    });
  }, [data]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={220} width="100%" />
    </Box>
  );
}

// Prop validation for the component
CampaignMilestones.propTypes = {
  data: PropTypes.array.isRequired, // The data to be displayed in the chart
  isLoading: PropTypes.bool.isRequired // Flag indicating if data is loading
};
