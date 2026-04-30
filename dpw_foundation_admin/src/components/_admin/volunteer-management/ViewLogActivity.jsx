'use client';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { BackArrow, CalendarIcon } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import * as volunteerApi from 'src/services/volunteer';
import { fDateShort } from 'src/utils/formatTime';
import ViewLogActivityById from './view-request/viewLogActivityById';
import AddLogActivity from './view-request/viewLogActivityById/AddLogActivity';

const GridDate = ({ volunteerCampaign }) => {
  const safeDateFormat = (date) => {
    if (!date) return '-';
    try {
      return fDateShort(date); // This returns "07 July 2025" (full month name)
    } catch {
      return '-';
    }
  };
  return (
    <>
      <Stack direction="row" spacing={1} sx={{ minWidth: '150px' }}>
        <CalendarIcon />
        <Typography variant="body2" color="primary.main" sx={{ mb: 3 }}>
          {safeDateFormat(volunteerCampaign?.startDateTime)} TO {safeDateFormat(volunteerCampaign?.endDateTime)}
        </Typography>
      </Stack>
    </>
  );
};

export default function ViewLogActivity() {
  const router = useRouter();
  const { id } = useParams();
  const [refetchTable, setRefetchTable] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  const { isLoading: isLoadingEnrollment, data: enrollmentData } = useQuery(
    ['getVolunteerEnrollmentById', id],
    () => volunteerApi.getVolunteerEnrollmentById(id),
    {
      enabled: !!id
    }
  );

  const { volunteerCampaign } = enrollmentData || {};

  if (isLoadingEnrollment) {
    return <LoadingFallback />;
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={() => {
            router.back();
          }}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="start" sx={{ mb: 3 }}>
        <Typography variant="h5" color="primary.main" textTransform={'uppercase'}>
          Log Activity
        </Typography>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary.main" sx={{ textTransform: 'uppercase' }}>
            {volunteerCampaign?.volunteerCampaignTitle ? volunteerCampaign?.volunteerCampaignTitle : ''}
          </Typography>
          <GridDate volunteerCampaign={volunteerCampaign} />
        </Stack>
        <AddLogActivity
          id={id}
          enrollmentData={enrollmentData}
          setRefetchTable={setRefetchTable}
          totalHours={totalHours}
        />
      </Paper>
      <ViewLogActivityById enrollmentData={enrollmentData} refetchTable={refetchTable} setTotalHours={setTotalHours} />
    </>
  );
}
