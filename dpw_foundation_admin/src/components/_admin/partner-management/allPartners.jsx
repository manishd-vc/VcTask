'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import AllPartnersRow from 'src/components/table/rows/allPartnersRow';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnershipApi from 'src/services/partner';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const STATUS_OPTIONS = [
  { id: 'Active', name: 'Active' },
  { id: 'Inactive', name: 'Inactive' }
];

const TABLE_HEAD = [
  { id: 'firstName', label: 'First Name', alignRight: false, sort: true },
  { id: 'secondName', label: 'Second Name', alignRight: false, sort: true },
  { id: 'emailId', label: 'Email ID', alignRight: false, sort: true },
  { id: 'organizationName', label: 'Organization Name', alignRight: false, sort: true },
  { id: 'country', label: 'Country', alignRight: false, sort: true },
  { id: 'phoneNumber', label: 'Phone Number', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'actions', label: 'Actions', alignRight: true }
];

export default function AllPartners() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Query parameters
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { isLoading, isFetching, refetch } = useQuery(
    ['approvedPartners', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      partnershipApi.approvedPartnersPagination({
        page: +pageParam,
        rows: +rowsParam,
        sort: '',
        payload: {
          keyword: searchParam || '',
          statuses: statusParams ? [statusParams] : [], // Only show approved/active partners
          createdDate: {
            fromDate: fromDate ? fDateShortYear(fromDate) : '',
            toDate: toDate ? fDateShortYear(toDate) : ''
          },
          datePattern: getLocaleDateString()
        }
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

  const { mutate: exportMutate } = useMutation('export-partner-all', partnershipApi.exportAllPartners, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

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

  return (
    <Table
      headData={TABLE_HEAD}
      data={tableRows}
      isLoading={isLoading || isFetching}
      row={AllPartnersRow}
      totalCountText="All Partners"
      allCount={tableRows?.totalElements}
      isSearch
      filters={[{ name: 'Status', param: 'status', data: STATUS_OPTIONS, value: statusParams }]}
      isDatePicker={false}
      setFromDate={setFromDate}
      setToDate={setToDate}
      dateValues={[fromDate, toDate]}
      isExport={true}
      onExport={onExport}
      refetch={refetch}
    />
  );
}
