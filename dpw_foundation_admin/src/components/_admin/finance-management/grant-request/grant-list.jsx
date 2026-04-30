'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import FinanceGrantRequestsRow from 'src/components/table/rows/finance/grantRequestRow';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as financeApi from 'src/services/finance';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'grantId', label: 'ID', alignRight: false, sort: true },
  { id: 'grantCreatedDate', label: 'Created Date', alignRight: false, sort: true },
  { id: 'grantRequesterName', label: 'Requester Name', alignRight: false, sort: true },
  { id: 'grantType', label: 'Grant Type', alignRight: false, sort: true },
  { id: 'grantAmountRequested', label: 'Amount Requested', alignRight: false, sort: true },
  { id: 'grantAmountGranted', label: 'Amount Granted', alignRight: false, sort: true },
  { id: 'grantAmountDisbursed', label: 'Amount Disbursed', alignRight: false, sort: true },
  { id: 'grantBalanceFund', label: 'Balance Fund', alignRight: false, sort: true },
  { id: 'grantRegisteredAs', label: 'Registered As', alignRight: false, sort: true },
  { id: 'grantRecieptVoucher', label: 'Reciept Voucher', alignRight: false, sort: true },
  { id: 'grantStatus', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

export default function GrantList() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { id: userId } = useParams();
  // Query parameters
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const { masterData } = useSelector((state) => state?.common);
  const grantStatus = getLabelObject(masterData, 'dpwf_grant_status');
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { isLoading, isFetching, refetch } = useQuery(
    ['beneficiaryGrantRequests', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      financeApi.grantPagination({
        userId: userId,
        page: +pageParam,
        rows: +rowsParam,
        sort: '',
        payload: {
          keyword: searchParam || '',
          statuses: statusParams ? [statusParams] : [],
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
  const { mutate: exportMutate } = useMutation('export-beneficiary-grant-admin', financeApi.exportGrant, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });
  const onExport = () => {
    const obj = {
      userId: userId,
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
    if (grantStatus) {
      const statusData = [];
      for (const data of grantStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [grantStatus]);

  return (
    <Table
      headData={TABLE_HEAD}
      data={tableRows}
      isLoading={isLoading || isFetching}
      row={FinanceGrantRequestsRow}
      totalCountText="All Grant Requests"
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
  );
}
