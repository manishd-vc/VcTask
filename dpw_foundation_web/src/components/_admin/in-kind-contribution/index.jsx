'use client';
import { LinearProgress, Stack } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import InKindContributionRequestsRow from 'src/components/table/rows/InKindContributionRequestsRow';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import * as beneficiaryApi from 'src/services/beneficiary';
import * as contributionApi from 'src/services/contribution';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const LoadingFallback = () => (
  <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
    <LinearProgress />
  </Stack>
);

const TABLE_HEAD = [
  { id: 'inKindContributionRequestId', label: 'ID', alignRight: false, sort: true },
  { id: 'inKindContributionRequestTitle', label: 'Request Title', alignRight: false, sort: true },
  { id: 'assistanceRequested', label: 'Assistance Requested', alignRight: false, sort: true },
  { id: 'requestNature', label: 'Request Nature', alignRight: false, sort: true },
  { id: 'dateOfContribution', label: 'Date of Contribution', alignRight: false, sort: true },
  { id: 'valueOfDonation', label: 'Value of Donation', alignRight: false, sort: true },
  { id: 'valueOfInKind', label: 'Value of In-Kind', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Action', alignRight: true }
];

export default function InKindContribution() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 0;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const { masterData } = useSelector((state) => state?.common);
  const { profileData } = useSelector((state) => state.profile);
  const inKindContributionStatus = getLabelObject(masterData, 'dpwf_inkind_contribution_status');
  const [id, setId] = useState(null);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { isLoading, refetch } = useQuery(
    ['inKindContributionRequests', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      beneficiaryApi.inKindContributionPagination({
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
  const { mutate: exportMutate } = useMutation(
    'export-in-kind-contribution-admin',
    beneficiaryApi.exportInKindContribution,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const { mutate: intentContributionRequest } = useMutation(contributionApi.intentContributionRequest, {
    onSuccess: (response) => {
      router.push(`/user/in-kind-contribution/${response?.id}/create`);
      dispatch(resetStep());
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
    }
  });

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

  const handleCreateContribution = () => {
    intentContributionRequest({ userId: profileData?.id });
  };

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="In-Kind Contribution Requests"
        action={
          profileData?.firstContributionAccepted && profileData?.allowContributionCreation
            ? {
                title: 'Create New Request',
                type: 'click',
                onClick: handleCreateContribution
              }
            : null
        }
      />
      <Suspense fallback={<LoadingFallback />}>
        <Table
          headData={TABLE_HEAD}
          data={tableRows}
          setId={setId}
          id={id}
          row={InKindContributionRequestsRow}
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
          isLoading={isLoading}
          rowProps={{ refetch }}
        />
      </Suspense>
    </>
  );
}
