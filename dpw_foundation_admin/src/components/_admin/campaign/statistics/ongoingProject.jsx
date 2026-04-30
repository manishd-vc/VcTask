'use client';
// mui
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import Scrollbar from 'src/components/Scrollbar';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDate } from 'src/utils/formatTime';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
OngoingProject.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  type: PropTypes.string,
  checked: PropTypes.bool
};

export default function OngoingProject({ fromDate, toDate, type, checked }) {
  const dispatch = useDispatch();
  const [dashboardCardData, setDashboardCardData] = useState([]);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  useQuery(
    ['campaign-ongoing-project', fromDate, toDate, type, checked],
    () =>
      api.campaignDashboard({
        fromDate: fromDate,
        toDate: toDate,
        campaignType: type,
        // trendType: 'Monthly',
        type: 'ongoing-projects',
        myOnly: !checked
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.ongoingProjects) {
          setDashboardCardData(data?.ongoingProjects || []);
        }
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={3} component="h4">
          Ongoing Projects
        </Typography>
        <Box sx={{ height: '280px' }}>
          <Scrollbar>
            {dashboardCardData.map((item, i) => (
              <Box mb={2} key={item?.titleOfCampaign}>
                <Typography variant="h8" textTransform={'uppercase'} color="primary.main" component="h4">
                  {item.titleOfCampaign}
                </Typography>
                <Stack flexDirection={'row'} alignItems={'start'} gap={0.8}>
                  <Typography component="p" variant="subtitle4" color={'text.secondarydark'}>
                    Date:{' '}
                  </Typography>
                  <Typography component="p" variant="body2" mt={0.5} color={'text.secondarydark'}>
                    {fDate(item?.date)} - {fDate(item?.endDate)}
                  </Typography>
                </Stack>
                <Stack flexDirection={'row'} alignItems={'start'} gap={0.8}>
                  <Typography component="p" variant="subtitle4" color={'text.secondarydark'}>
                    Location:{' '}
                  </Typography>
                  <Typography component="p" variant="body2" mt={0.5} color={'text.secondarydark'}>
                    {[item?.city, country?.find((c) => c.code === item?.country)?.label || item?.country]
                      .filter(Boolean)
                      .join(', ') || '-'}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Scrollbar>
        </Box>
      </CardContent>
    </Card>
  );
}
