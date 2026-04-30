// mui
import { useTheme } from '@mui/material/styles';

/**
 * BaseOptionChart - A function that returns a configuration object for chart options.
 * This function customizes the chart appearance, including colors, grid, axes, markers, etc.,
 * based on the current theme and a passed value that adjusts the color scheme.
 *
 * @param {string} value - A string that determines the color scheme of the chart ('donut' or other).
 *
 * @returns {Object} - The configuration object for the chart.
 */
export default function BaseOptionChart(value) {
  const theme = useTheme();

  // Label configuration for the total value label in pie/donut charts
  const LABEL_TOTAL = {
    show: true,
    label: 'Total',
    color: theme.palette.text.secondary,
    ...theme.typography.subtitle2
  };

  // Label configuration for individual value labels in pie/donut charts
  const LABEL_VALUE = {
    offsetY: 8,
    color: theme.palette.text.primary,
    ...theme.typography.h3
  };

  // Set colors based on the `value` parameter
  const colors =
    value === 'donut'
      ? [
          theme.palette.info.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
          theme.palette.chart.red[0]
        ]
      : [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main
        ];

  return {
    // Colors to be used in the chart
    colors,

    // Chart options including toolbar and zoom settings
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: theme.palette.text.disabled,
      fontFamily: theme.typography.fontFamily
    },

    // States for hover and active chart elements
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.04
        }
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.88
        }
      }
    },

    // Fill properties for chart sections (e.g., pie or donut)
    fill: {
      opacity: 1,
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100]
      }
    },

    // Data label settings (disabled by default)
    dataLabels: { enabled: false },

    // Stroke settings for the chart lines
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round'
    },

    // Grid settings for the chart background and borders
    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider
    },

    // X-axis settings for chart
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false }
    },

    // Markers settings for the chart
    markers: {
      size: 0,
      strokeColors: theme.palette.background.paper
    },

    // Tooltip settings (disabled for x axis)
    tooltip: {
      x: { show: false }
    },

    // Legend settings for the chart
    legend: {
      show: true,
      fontSize: 13,
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        radius: 12
      },
      fontWeight: 500,
      itemMargin: { horizontal: 12 },
      labels: {
        colors: theme.palette.text.primary
      }
    },

    // Plot options for different chart types (bar, pie, donut, etc.)
    plotOptions: {
      // Bar chart settings
      bar: {
        columnWidth: '60%',
        borderRadius: 3,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last'
      },
      // Pie and Donut chart settings
      pie: {
        donut: {
          labels: {
            show: true,
            value: LABEL_VALUE,
            total: LABEL_TOTAL
          }
        }
      },
      // Radial bar chart settings
      radialBar: {
        track: {
          strokeWidth: '100%',
          background: theme.palette.grey[500_16]
        },
        dataLabels: {
          value: LABEL_VALUE,
          total: LABEL_TOTAL
        }
      },
      // Radar chart settings
      radar: {
        polygons: {
          fill: { colors: ['transparent'] },
          strokeColors: theme.palette.divider,
          connectorColors: theme.palette.divider
        }
      },
      // Polar area chart settings
      polarArea: {
        rings: {
          strokeColor: theme.palette.divider
        },
        spokes: {
          connectorColors: theme.palette.divider
        }
      }
    },

    // Responsive settings for different screen sizes
    responsive: [
      {
        // sm breakpoint - applies for small screens
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: { bar: { columnWidth: '40%' } }
        }
      },
      {
        // md breakpoint - applies for medium screens
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: { bar: { columnWidth: '32%' } }
        }
      }
    ]
  };
}
