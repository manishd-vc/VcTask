'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

import { Table } from 'src/components/table';
import { getLabelObject } from 'src/utils/extractLabelValues';
import InKindContributionRow from './inKindContributionRow';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false, sort: true },
  { id: 'createdDate', label: 'Created Date', alignRight: false, sort: true },
  { id: 'requesterName', label: 'Requester Name', alignRight: false, sort: true },
  { id: 'grantType', label: 'Grant Type', alignRight: false, sort: true },
  { id: 'amountRequested', label: 'Amount Requested', alignRight: false, sort: true },
  { id: 'amountGranted', label: 'Amount Granted', alignRight: false, sort: true },
  { id: 'amountDisbursed', label: 'Amount Disbursed', alignRight: false, sort: true },
  { id: 'balanceFund', label: 'Balance Fund', alignRight: false, sort: true },
  { id: 'iacadPermit', label: 'IACAD Permit', alignRight: false, sort: true },
  { id: 'receiptVoucher', label: 'Receipt Voucher', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Actions', alignRight: true }
];

export default function InKindContribution() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const { masterData } = useSelector((state) => state?.common);

  const inKindContributionStatus = getLabelObject(masterData, 'dpwf_inkind_contribution_status');

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { isLoading, isFetching } = useQuery(
    ['inKindContribution', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      api.inKindContributionPagination({
        page: +pageParam,
        rows: +rowsParam,
        sort: '',
        payload: {
          keyword: searchParam || '',
          statuses: statusParams ? [statusParams] : ['APPROVED'],
          createdDate: {
            fromDate: fromDate ? fDateShortYear(fromDate) : '',
            toDate: toDate ? fDateShortYear(toDate) : ''
          },
          datePattern: getLocaleDateString()
        }
      }),
    {
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

  const { mutate: exportMutate } = useMutation('export-in-kind-contribution', api.exportInKindContribution, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response?.data?.message || 'Export failed', variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      keyword: searchParam || '',
      statuses: statusParams ? [statusParams] : ['APPROVED'],
      createdDate: {
        fromDate: fromDate ? fDateShortYear(fromDate) : '',
        toDate: toDate ? fDateShortYear(toDate) : ''
      },
      datePattern: getLocaleDateString()
    };
    exportMutate(obj);
  };
  useEffect(() => {
    if (inKindContributionStatus) {
      const statusData = [];
      for (const data of inKindContributionStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [inKindContributionStatus]);
  return (
    <Table
      headData={TABLE_HEAD}
      data={tableRows}
      isLoading={isLoading || isFetching}
      row={InKindContributionRow}
      totalCountText="All In-Kind Contribution Requests"
      allCount={tableRows?.totalElements}
      isSearch
      filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
      fromDate={fromDate}
      toDate={toDate}
      isDatePicker
      dateValues={[fromDate, toDate]}
      setFromDate={setFromDate}
      setToDate={setToDate}
      isExport={true}
      onExport={onExport}
    />
  );
}
