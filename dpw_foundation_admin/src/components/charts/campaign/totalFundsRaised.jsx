import { Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * TotalFundsRaised - A component that displays a stacked bar chart with dummy data for multiple categories.
 */
export default function TotalFundsRaised({ data }) {
  const theme = useTheme();
  const transformedData = useMemo(() => {
    const slicedData = data?.slice(0, 20) || [];

    const processedData = slicedData.map((item) => ({
      category: item.campaignTitle || 'Untitled',
      currentFunds: item.currentFunds !== null && item.currentFunds !== undefined ? Number(item.currentFunds) : 0,
      anticipatedFunds:
        item.anticipatedFunds !== null && item.anticipatedFunds !== undefined ? Number(item.anticipatedFunds) : 0
    }));

    return processedData;
  }, [data]);

  const [chartData, setChartData] = useState({
    series: [],
    options: {}
  });

  useEffect(() => {
    setChartData({
      series: [
        {
          name: 'Current',
          data: transformedData.map((item) => item.anticipatedFunds)
        },
        {
          name: 'Anticipated',
          data: transformedData.map((item) => item.currentFunds)
        }
      ],
      options: {
        colors: ['#5154B6', '#ECECFF'],
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
          }
        },
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
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          show: false
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
          y: { formatter: (val) => `$ ${val}` }
        }
      }
    });
  }, [transformedData, theme]);

  return (
    <Stack sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      {transformedData.length > 0 ? (
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={220} width={'100%'} />
      ) : (
        // <NoDataFoundIllustration />
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          No data found for funds raised.
        </Typography>
      )}
    </Stack>
  );
}
