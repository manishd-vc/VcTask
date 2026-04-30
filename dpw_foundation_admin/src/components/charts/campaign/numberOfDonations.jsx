import { Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function NumberOfDonations({ isLoading, data }) {
  console.log('data', data);
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    series: [],
    options: {}
  });

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      const xCategories = data.category || [];
      const yValues = data.data || [];

      setChartData({
        series: [
          {
            name: 'Number of Donations',
            data: yValues
          }
        ],
        options: {
          chart: {
            type: 'bar',
            height: 220,
            zoom: { enabled: false },
            toolbar: {
              show: true,
              tools: { download: false }
            }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            }
          },
          dataLabels: { enabled: false },
          xaxis: {
            categories: xCategories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false }
          },
          yaxis: { show: false },
          grid: { show: false },
          fill: {
            opacity: 1,
            colors: [theme.palette.primary.main]
          },
          tooltip: {
            y: {
              formatter: (val) => `${val} donations`
            }
          }
        }
      });
    }
  }, [data, theme]);

  // Calculate total from y-values
  const totalDonations = chartData.series[0]?.data?.reduce((sum, val) => sum + val, 0) || 0;
  return (
    <>
      <Typography variant="chartValue" color="secondary.darker" sx={{ mb: 2 }}>
        {isLoading ? <Skeleton width={100} /> : totalDonations}
      </Typography>

      {isLoading ? (
        <Skeleton variant="rectangular" height={200} />
      ) : (
        <Stack sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={220} />
        </Stack>
      )}
    </>
  );
}
