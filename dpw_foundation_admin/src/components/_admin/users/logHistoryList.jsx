'use client';
import { Button, Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import LogHistoryListRow from 'src/components/table/rows/logHistoryList';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
// api
import * as api from 'src/services';
import { fDateTime } from 'src/utils/formatTime';

// Table header configuration
const TABLE_HEAD = [
  { id: 'ipAddress  ', label: 'IP Address', alignRight: false, sort: true },
  { id: 'deviceUsed', label: 'Device Used', alignRight: false, sort: false },
  { id: 'browserInfo', label: 'Browser Info', alignRight: false, sort: false },
  { id: 'actionType', label: 'Action Type', alignRight: false, sort: false },
  { id: 'activityTime', label: 'Activity Time', alignRight: false, sort: true }
];

/**
 * LogHistoryList Component - Displays a table of user log history with pagination and a back button.
 *
 * This component fetches log history data for a user and displays it in a table format.
 * It also provides the ability to navigate back to the previous page.
 *
 * @returns {JSX.Element} - The rendered LogHistoryList component.
 */
const InfoItem = ({ question, answer, colSize, showMoreButton, tooltipTitle }) => (
  <Grid item xs={12} md={colSize}>
    <Stack direction="column" gap={1}>
      <Typography variant="body3" color="text.secondary">
        {question}
      </Typography>
      <Typography
        variant="subtitle4"
        component="p"
        display="flex"
        flexWrap="wrap"
        color="text.secondarydark"
        sx={{ wordBreak: 'break-word' }}
      >
        {answer || '-'}&nbsp;
        {showMoreButton && (
          <Tooltip title={tooltipTitle || ''} arrow>
            <Typography variant="blueLink" color="text.blue">
              {`+${showMoreButton} more`}
            </Typography>
          </Tooltip>
        )}
      </Typography>
    </Stack>
  </Grid>
);
export default function LogHistoryList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const pageParam = searchParams.get('page'); // Get the 'page' query parameter from the URL
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const dispatch = useDispatch();
  const [showAllRegistrations] = useState(false);

  // State to store the log history data and total count
  const [tableRows, setTableRows] = useState({ count: 0, data: [], totalElements: 0 });
  const { data: userData } = useQuery(['getUser', params.id], () => api.getUserByAdmin(params.id), {
    enabled: !!params.id,
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const registrationTypes = userData?.roles?.map((role) => role?.name) || [];
  const displayedRegistrations = showAllRegistrations ? registrationTypes : registrationTypes.slice(0, 1);
  // Fetch log history data using react-query
  const { isLoading } = useQuery(
    ['logHistory', pageParam, rowsParam, params],
    () => api.getIntUserLogHistory({ id: params?.id, page: +pageParam || 1, rows: +rowsParam || 10, sort: '' }), // API call to fetch log history
    {
      // On success, update the table rows state with the fetched data
      onSuccess: (data) => {
        setTableRows({
          count: data?.data?.totalPages,
          data: data?.data?.content,
          totalElements: data?.data?.totalElements
        });
      },
      // On error, display an error message in a toast
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    },
    {
      refetchOnWindowFocus: true, // Refetch when the window is focused
      refetchOnReconnect: true // Refetch when the user reconnects to the internet
    }
  );

  const { mutate } = useMutation('export-logs', api.exportLoginAuditByAdmins, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      page: +pageParam || 1,
      rows: 10,
      search: '',
      status: '',
      fromDate: '',
      toDate: '',
      curentUserId: params?.id
    };
    mutate(obj);
  };

  return (
    <>
      {/* Back button with icon */}
      <Button
        variant="text"
        startIcon={<BackArrow />}
        onClick={() => router.back()} // Navigate back to the previous page
        sx={{
          mb: { xs: 3 },
          '&:hover': { textDecoration: 'none' }
        }}
      >
        Back
      </Button>

      {/* Log history title */}
      <Typography variant="h5" textTransform={'uppercase'} color="primary.main" mb={3}>
        View Log
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <InfoItem colSize={3} question="Status" answer={userData?.status} />
          <InfoItem colSize={3} question="Record Created By" answer={userData?.createdByName} />
          <InfoItem
            colSize={3}
            question="Record Created On"
            answer={userData?.createdAt && fDateTime(userData?.createdAt)}
          />
          <InfoItem colSize={3} question="Record Updated By" answer={userData?.updatedByName} />
          <InfoItem
            colSize={3}
            question="Record Updated On"
            answer={userData?.updatedAt && fDateTime(userData?.updatedAt)}
          />
          <InfoItem
            colSize={3}
            question="Registered As"
            answer={displayedRegistrations.join(', ')}
            tooltipTitle={registrationTypes.join(', ')}
            showMoreButton={!showAllRegistrations && registrationTypes.length > 1 ? registrationTypes.length - 1 : null}
          />
        </Grid>
      </Paper>
      {/* Table displaying log history data */}
      <Table
        headData={TABLE_HEAD} // Table header configuration
        data={tableRows} // Table data
        isLoading={isLoading} // Loading state
        row={LogHistoryListRow} // Custom row component
        allCount={tableRows?.totalElements} // Total number of log records
        totalCountText="Log Records" // Text for total count label
        isExport={true}
        onExport={onExport}
      />
    </>
  );
}
