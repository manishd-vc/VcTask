'use client';
// mui
import { Box, Card, CardContent, FormControl, MenuItem, Select, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import NumberOfCharitableProjects from 'src/components/charts/campaign/numberOfCharitableProjects';
import NumberOfDonations from 'src/components/charts/campaign/numberOfDonations';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
NoOfDonation.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function NoOfDonation({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState({
    total: 0,
    category: [],
    data: []
  });

  const [trendType, setTrendType] = useState('Day');
  useQuery(
    ['campaign-monthly-trend-' + type, fromDate, toDate, type, trendType],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        trendType: trendType,
        type: type === 'FUNDCAMP' ? 'donations-trend' : 'monthly-trend',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.monthlyTrend) {
          let category = [];
          let categoryData = [];
          let total = 0;
          for (const key in data?.monthlyTrend) {
            const element = data?.monthlyTrend[key];
            category.push(key);
            categoryData.push(element);
            total += Number(element || 0);
          }
          setDashboardCardData({
            ...dashboardCardData,
            total: total,
            category: category,
            data: categoryData
          });
        }

        if (data?.donationTrend) {
          let category = [];
          let categoryData = [];
          let total = 0;
          for (const key in data?.donationTrend) {
            const element = data?.donationTrend[key];
            category.push(key);
            categoryData.push(element);
            total += Number(element || 0);
          }
          setDashboardCardData({
            ...dashboardCardData,
            total: total,
            category: category,
            data: categoryData
          });
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const handleTrendChange = (event) => {
    setTrendType(event.target.value);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
            {type === 'FUNDCAMP' ? 'Number of Donations' : 'Number of charitable Projects executed'}
          </Typography>

          {type === 'FUNDCAMP' && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select labelId="trend-type-label" value={trendType} onChange={handleTrendChange}>
                <MenuItem value="Day">Day</MenuItem>
                <MenuItem value="Week">Week</MenuItem>
                <MenuItem value="Month">Month</MenuItem>
                <MenuItem value="Year">Year</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {type === 'FUNDCAMP' ? (
          <NumberOfDonations data={dashboardCardData} />
        ) : (
          <NumberOfCharitableProjects data={dashboardCardData} />
        )}
      </CardContent>
    </Card>
  );
}
