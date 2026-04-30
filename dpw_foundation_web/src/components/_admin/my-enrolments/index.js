'use client';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { Table } from 'src/components/table';
import EnrolmentRows from 'src/components/table/rows/myEnrolments';
import { setToastMessage } from 'src/redux/slices/common';
import { updateFirstLogin } from 'src/redux/slices/user';
import * as myEnrolmentApi from 'src/services/myEnrolment';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'enrollmentNumericId', label: 'Enrollment ID', alignRight: false, sort: true },
  { id: 'campaignTitle', label: 'Campaign Name', alignRight: false, sort: true },
  { id: 'eventType', label: 'Event Type', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'End Date', alignRight: false, sort: true },
  { id: 'enrolledOn', label: 'Enrolled On', alignRight: false, sort: true },
  { id: 'city', label: 'Location', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Actions', alignRight: true }
];

export default function MyEnrolments() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const statusParams = searchParams?.get('status') || '';
  const pageParam = searchParams?.get('page') || '1';
  const rowsPerPage = searchParams?.get('rowsPerPage') || '10';
  const searchParam = searchParams?.get('search') || '';
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { user } = useSelector(({ user }) => user);
  const { masterData } = useSelector((state) => state?.common);
  const enrollmentStatus = getLabelObject(masterData, 'dpwf_enrollment_status');
  const [status, setStatus] = useState([]);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const { data: statisticsData } = useQuery(
    ['statistics-enrollment', user?.userId],
    () => myEnrolmentApi.getStatistics(user?.userId, null, 'enrollment'),

    {
      enabled: !!user?.userId,
      onError: (err) => {
        console.error('Statistics API error:', err);
      }
    }
  );

  // Enrollments query
  const { isLoading, refetch } = useQuery(
    ['enrollments', pageParam, searchParam, statusParams, fromDate, toDate, rowsPerPage],
    () =>
      myEnrolmentApi.getEnrolments(
        +pageParam || 1,
        searchParam || '',
        statusParams,
        (fromDate && fDateShortYear(fromDate)) || '',
        (toDate && fDateShortYear(toDate)) || '',
        +rowsPerPage || 10
      ),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        const totalElements = data?.data?.totalElements || 0;
        dispatch(updateFirstLogin(false));
        setTableRows({
          count,
          data: rows,
          totalElements
        });
      },
      onError: (err) => {
        setTableRows({
          count: 0,
          data: [],
          totalElements: 0
        });
        dispatch(
          setToastMessage({ message: err.response?.data?.message || 'Error loading enrollments', variant: 'error' })
        );
      }
    }
  );

  // Export mutation
  const { mutate } = useMutation('exportEnrolments', myEnrolmentApi.exportEnrolments, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response?.data?.message || 'Export failed', variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      search: searchParam || '',
      status: statusParams,
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || ''
    };
    mutate(obj);
  };

  useEffect(() => {
    if (enrollmentStatus) {
      const statusData = [];
      for (const data of enrollmentStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [enrollmentStatus]);

  return (
    <>
      <HeaderBreadcrumbs admin heading="My Enrolments" />
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack display="flex" flexDirection="column" sx={{ height: '100%' }}>
              <Card
                sx={{
                  height: '100%'
                }}
              >
                <CardContent>
                  <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
                    Events Participated In
                  </Typography>
                  <Typography variant="h9" sx={{ color: '#1976d2' }} component="h5">
                    {statisticsData?.data?.eventsParticipatedIn || '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack display="flex" flexDirection="column" sx={{ height: '100%' }}>
              <Card
                sx={{
                  height: '100%'
                }}
              >
                <CardContent>
                  <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
                    Total Volunteer Hours
                  </Typography>
                  <Typography variant="h9" sx={{ color: '#2e7d32' }} component="h5">
                    {statisticsData?.data?.totalVolunteerHours || '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack display="flex" flexDirection="column" sx={{ height: '100%' }}>
              <Card
                sx={{
                  height: '100%'
                }}
              >
                <CardContent>
                  <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
                    Total Training Hours
                  </Typography>
                  <Typography variant="h9" sx={{ color: '#ed6c02' }} component="h5">
                    {statisticsData?.data?.totalTrainingHours || '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading}
        row={EnrolmentRows}
        totalCountText={`All Enrollments (${tableRows?.totalElements || 0})`}
        isSearch
        filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
        isDatePicker
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        isExport={true}
        onExport={onExport}
        refetch={refetch}
      />
    </>
  );
}
