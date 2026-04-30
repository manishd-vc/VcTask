'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

SectorWise.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function SectorWise({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [sectorData, setSectorData] = useState([]);

  useQuery(
    ['campaign-sector-wise', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        type: 'sector-wise-projects',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.sectorWiseBeneficiaries) {
          setSectorData(data.sectorWiseBeneficiaries);
        }
      },
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Something went wrong!',
            variant: 'error'
          })
        );
      }
    }
  );

  const chartData = useMemo(() => {
    return {
      series: sectorData.map((item) => item.numberOfBeneficiaries),
      options: {
        chart: {
          type: 'pie',
          height: 280
        },
        labels: sectorData.map((item) => `${item.category} - ${item.numberOfBeneficiaries}`),
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          y: {
            formatter: (val) => `${val.toLocaleString()}`
          },
          custom: function ({ series, seriesIndex, w }) {
            const category = sectorData[seriesIndex]?.category || '';
            const beneficiaries = series[seriesIndex]?.toLocaleString() || '0';
            return `
              <div style="padding: 8px;">
                <strong>Sector:</strong> ${category}<br/>
                <strong>Beneficiaries:</strong> ${beneficiaries}
              </div>
            `;
          }
        },
        colors: ['#2C2C85', '#6C63FF', '#A2A2D0', '#D4D4F7', '#E6E6FA']
      }
    };
  }, [sectorData]);

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
            Sector wise beneficiaries
          </Typography>
        </Box>

        {sectorData.length > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ReactApexChart options={chartData.options} series={chartData.series} type="pie" height={200} />
          </Box>
        ) : (
          <Typography variant="body2" align="center">
            No data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
