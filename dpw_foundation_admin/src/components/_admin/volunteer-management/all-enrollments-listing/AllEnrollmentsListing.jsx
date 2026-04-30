'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'src/components/table';
import AllEnrollmentsRow from 'src/components/table/rows/AllEnrollmentsRow';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelObject } from 'src/utils/extractLabelValues';

const TABLE_HEAD = [
  { id: 'id', label: 'Enrollment ID', alignRight: false, sort: true },
  { id: 'firstName', label: 'First Name', alignRight: false, sort: true },
  { id: 'secondName', label: 'Second Name', alignRight: false, sort: true },
  { id: 'campaignId', label: 'Campaign ID', alignRight: false, sort: true },
  { id: 'campaignName', label: 'Campaign Name', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'End Date', alignRight: false, sort: true },
  { id: 'enrollmentOn', label: 'Enrolled On', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Actions', alignRight: true }
];

export default function AllEnrollmentsListing() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');
  const { masterData } = useSelector((state) => state?.common);
  const enrollmentStatus = getLabelObject(masterData, 'dpwf_enrollment_status');
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { isLoading, isFetching, refetch } = useQuery(
    ['volunteerEnrollments', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      volunteerApi.getAllVolunteerEnrollments({
        page: +pageParam,
        rows: +rowsParam,
        search: searchParam || '',
        status: statusParams || '',
        fromDate,
        toDate
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        const totalElements = data?.data?.totalElements || 0;
        setTableRows({ count, data: rows, totalElements });
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response?.data?.message, variant: 'error' }));
      }
    }
  );
  const { mutate: exportMutate } = useMutation(
    'export-volunteer-enrollments',
    volunteerApi.exportVolunteerEnrollments,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );
  const onExport = () => {
    const obj = {
      search: searchParam || '',
      status: statusParams || '',
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      page: +pageParam,
      size: +rowsParam
    };
    exportMutate(obj);
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
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        row={AllEnrollmentsRow}
        totalCountText="All Enrollments"
        allCount={tableRows?.totalElements}
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
