'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'src/components/table';
import AllVolunteerRow from 'src/components/table/rows/allVolunteerRow';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'id', label: 'Volunteer ID', alignRight: false, sort: true },
  { id: 'firstName', label: 'First Name', alignRight: false, sort: true },
  { id: 'secondName', label: 'Second Name', alignRight: false, sort: true },
  { id: 'email', label: 'Email ID', alignRight: false, sort: true },
  { id: 'phone', label: 'Phone', alignRight: false, sort: true },
  { id: 'totalEnrollments', label: 'Total Enrollments', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Actions', alignRight: true }
];

export default function AllVolunteerListing() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');

  const { masterData } = useSelector((state) => state?.common);
  const volunteerStatus = getLabelObject(masterData, 'dpwf_user_status');
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { mutate: exportMutate } = useMutation('export-volunteer-campaigns', volunteerApi.exportAllVolunteer, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { isLoading, isFetching, refetch } = useQuery(
    ['volunteerCampaigns', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      volunteerApi.getAllVolunteer({
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
    if (volunteerStatus) {
      const statusData = [];
      for (const data of volunteerStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [volunteerStatus]);

  return (
    <>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        row={AllVolunteerRow}
        totalCountText="all Volunteers"
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
