'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'src/components/table';
import InKindContributionRow from 'src/components/table/rows/beneficiary/inKindContributionRow';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false, sort: true },
  { id: 'requestTitle', label: 'Request Title', alignRight: false, sort: true },
  { id: 'assistanceRequested', label: 'Assistance Requested', alignRight: false, sort: true },
  { id: 'requestNature', label: 'Request Nature', alignRight: false, sort: true },
  { id: 'dateOfContribution', label: 'Date of Contribution', alignRight: false, sort: true },
  { id: 'valueOfDonation', label: 'Value of Donation', alignRight: false, sort: true },
  { id: 'valueOfInKind', label: 'Value of In-Kind', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Actions', alignRight: true }
];

export default function InKindContributionRequests() {
  const dispatch = useDispatch();

  const { id: beneficiaryId } = useParams();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');
  const { masterData } = useSelector((state) => state?.common);
  const contributionStatus = getLabelObject(masterData, 'dpwf_inkind_contribution_status');

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { mutate: exportMutate } = useMutation(
    'export-in-kind-contributions',
    beneficiaryApi.exportBeneficiaryInKindContributions,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const { isLoading, isFetching, refetch } = useQuery(
    [
      'beneficiaryInKindContributions',
      beneficiaryId,
      pageParam,
      rowsParam,
      searchParam,
      statusParams,
      fromDate,
      toDate
    ],
    () =>
      beneficiaryApi.getBeneficiaryInKindContributions({
        beneficiaryId,
        page: +pageParam - 1,
        pageSize: +rowsParam,
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
      enabled: !!beneficiaryId,
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
      beneficiaryId,
      search: searchParam || '',
      status: statusParams || '',
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      page: +pageParam - 1,
      pageSize: +rowsParam
    };
    exportMutate(obj);
  };

  useEffect(() => {
    if (contributionStatus) {
      const statusData = [];
      for (const data of contributionStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [contributionStatus]);

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
