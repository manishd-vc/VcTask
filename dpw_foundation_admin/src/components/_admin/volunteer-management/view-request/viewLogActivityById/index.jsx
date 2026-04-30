'use client';
import { Stack } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TableSearchFilterBar from 'src/components/table/tableSearchFilterBar';
import { getLabelObject } from 'src/utils/extractLabelValues';
import ActivityLogDetails from './ActivityLogDetails';
import VolunteerDetails from './VolunteerDetails';

export default function ViewLogActivityById({ enrollmentData, refetchTable, setTotalHours }) {
  const { masterData } = useSelector((state) => state.common);

  // Extract query parameters for pagination and filtering
  const searchParams = useSearchParams();
  const statusParams = searchParams.get('status');

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState([]);

  // Initialize the status list from the Masterdata
  useEffect(() => {
    const filterOption = getLabelObject(masterData, 'dpwf_log_activity_status');
    const statusOptions =
      filterOption?.values.map((item) => ({
        id: item.code,
        name: item.description
      })) || [];
    setStatus(statusOptions);
  }, [masterData]);

  return (
    <>
      <Stack spacing={3}>
        <TableSearchFilterBar
          isSearch
          filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
          isDatePicker
          setFromDate={setFromDate}
          setToDate={setToDate}
          dateValues={[fromDate, toDate]}
        />
        <VolunteerDetails enrollmentData={enrollmentData} />
        <ActivityLogDetails
          enrollmentData={enrollmentData}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          refetchTable={refetchTable}
          setTotalHours={setTotalHours}
        />
      </Stack>
    </>
  );
}
