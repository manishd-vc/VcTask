'use client';
import { Box, Typography } from '@mui/material';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { Table } from 'src/components/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as logActivityApi from 'src/services/logActivity';
import { TimerIcon } from '../icons';
import AllLogActivityRow from './rows/AllLogActivityRows';
export default function LogActivityTable({
  enrollmentData,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  refetchTable,
  setTotalHours = () => {}
}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isViewMode = pathname.includes('/view');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const TABLE_HEAD = [
    { id: 'firstName', label: 'Milestone Description', alignRight: false, sort: true },
    { id: 'secondName', label: 'Check In Time', alignRight: false, sort: true },
    { id: 'campaignId', label: 'Check Out Time', alignRight: false, sort: true },
    { id: 'campaignName', label: 'Logged Hours', alignRight: false, sort: true },
    { id: 'startDateTime', label: 'Log Source', alignRight: false, sort: true },
    { id: 'endDateTime', label: 'Submitted By', alignRight: false, sort: true },
    { id: 'enrollmentOn', label: 'Submitted On', alignRight: false, sort: true },
    { id: 'status', label: 'Status', alignRight: false, sort: true },
    ...(isViewMode ? [] : [{ id: 'action', label: 'Actions', alignRight: true }])
  ];

  const { mutate: exportMutate } = useMutation('export-log-activity', logActivityApi.exportLogActivityHours, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    let status = [];
    if (isViewMode) {
      status = ['APPROVED'];
    } else if (statusParams) {
      status = [statusParams];
    }

    const obj = {
      id: id,
      search: searchParam || '',
      status,
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      page: +pageParam,
      size: +rowsParam
    };
    exportMutate(obj);
  };

  useEffect(() => {
    if (refetchTable) {
      refetch();
    }
  }, [refetchTable]);

  const {
    data: loggedHours,
    isLoading,
    refetch
  } = useQuery(
    ['getLoggedHours', id, searchParam, pageParam, rowsParam, statusParams, fromDate, toDate],
    () => {
      let statuses = [];
      if (isViewMode) {
        statuses = ['APPROVED'];
      } else if (statusParams) {
        statuses = [statusParams];
      }

      return logActivityApi.getLogActivityHoursPagination(id, {
        keyword: searchParam,
        page: +pageParam,
        size: +rowsParam,
        statuses,
        createdDate: {
          fromDate: fromDate || '',
          toDate: toDate || ''
        },
        datePattern: 'M/d/yyyy'
      });
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        const totalElements = data?.data?.totalElements || 0;

        const totalHours = rows?.reduce((acc, curr) => {
          return acc + curr?.logHours;
        }, 0);
        const totalApprovedHours = rows?.reduce((acc, curr) => {
          return curr?.status?.toLowerCase() === 'approved' ? acc + curr?.logHours : acc;
        }, 0);
        const roundedHours = Math.round(totalHours * 100) / 100;
        const roundedApprovedHours = Math.round(totalApprovedHours * 100) / 100;
        setTableRows({ count, data: rows, totalElements, totalApprovedHours: roundedApprovedHours });
        setTotalHours(roundedHours);
      }
    }
  );

  return (
    <>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading}
        row={AllLogActivityRow}
        totalCountText={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 1 }}>
            <Typography variant="h6" color="primary.main" textTransform="uppercase">
              LOGGED HOURS ({tableRows?.totalElements || loggedHours?.length || 0})
            </Typography>
            <TimerIcon />
            <Typography variant="body2" color="primary.main">
              TOTAL APPROVED HOURS:{' '}
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{tableRows?.totalApprovedHours}</span>
            </Typography>
          </Box>
        }
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
