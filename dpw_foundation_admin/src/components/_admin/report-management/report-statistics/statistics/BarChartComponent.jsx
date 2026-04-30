import { Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function BarChartComponent({ data }) {
  const theme = useTheme();
  const transformedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => ({
      category: item.Sector || 'Unknown',
      notStarted: Number(item['Not yet Started'] || 0),
      ongoing: Number(item['On-going'] || 0),
      completed: Number(item['Completed'] || 0)
    }));
  }, [data]);

  const [chartData, setChartData] = useState({
    series: [],
    options: {}
  });

  useEffect(() => {
    setChartData({
      series: [
        {
          name: 'Not yet Started',
          data: transformedData.map((item) => item.notStarted)
        },
        {
          name: 'On-going',
          data: transformedData.map((item) => item.ongoing)
        },
        {
          name: 'Completed',
          data: transformedData.map((item) => item.completed)
        }
      ],
      options: {
        colors: ['#2C2C85', '#6C63FF', '#A2A2D0', '#D4D4F7', '#E6E6FA'],

        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '15px',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: transformedData.map((item) => item.category),
          axisBorder: {
            show: false
          },
          labels: {
            show: true,
            style: {
              fontSize: '13px',
              fontWeight: '500'
            }
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          show: true,
          labels: {
            style: {
              fontSize: '13px',
              fontWeight: '500'
            }
          }
        },
        grid: {
          show: false
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'left',
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: theme.typography.fontFamily,
          markers: {
            width: 14,
            height: 14,
            radius: 7,
            shape: 'circle',
            offsetX: -5
          },
          itemMargin: {
            vertical: 8,
            horizontal: 8
          }
        },
        tooltip: {
          y: { formatter: (val) => `${val} projects` }
        },
        chart: {
          type: 'bar',
          height: 220,
          zoom: { enabled: false },
          redrawOnParentResize: true,
          toolbar: {
            show: true,
            tools: {
              download: false
            }
          },
          fontFamily: theme.typography.fontFamily,
          foreColor: theme.palette.text.primary
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      }
    });
  }, [transformedData, theme]);

  return (
    <Stack sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      {transformedData.length > 0 ? (
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={220} width={'100%'} />
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          No data available.
        </Typography>
      )}
    </Stack>
  );
}
