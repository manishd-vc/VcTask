'use client';
import { Button, LinearProgress, Stack } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import BeneficiaryProjectsRow from 'src/components/table/rows/beneficiaryProjectsRow';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const LoadingFallback = () => (
  <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
    <LinearProgress />
  </Stack>
);

const TABLE_HEAD = [
  { id: 'campaignNumericId', label: 'ID', alignRight: false, sort: true },
  { id: 'campaignTitle', label: 'Project Name', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'End Date', alignRight: false, sort: true },
  { id: 'targetQuantity', label: 'Target Amount', alignRight: false, sort: true },
  { id: 'quantityAchieved', label: 'Target Achieved', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

export default function ProjectList() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id: beneficiaryId } = useParams();
  // Query parameters
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const { masterData } = useSelector((state) => state?.common);
  const projectStatus = getLabelObject(masterData, 'dpw_foundation_campaign_status');
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { isLoading, isFetching, refetch } = useQuery(
    ['beneficiaryProjects', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      beneficiaryApi.beneficiaryProjectPagination({
        beneficiaryId: beneficiaryId,
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
  const { mutate: exportMutate } = useMutation('export-beneficiary-project-admin', beneficiaryApi.exportAllProjects, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });
  const onExport = () => {
    const obj = {
      beneficiaryId: beneficiaryId,
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
    if (projectStatus) {
      const statusData = [];
      for (const data of projectStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [projectStatus]);

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
      </Stack>
      <HeaderBreadcrumbs heading="Charitable projects" />
      <Suspense fallback={<LoadingFallback />}>
        <Table
          headData={TABLE_HEAD}
          data={tableRows}
          isLoading={isLoading || isFetching}
          row={BeneficiaryProjectsRow}
          totalCountText="Charitable projects"
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
      </Suspense>
    </>
  );
}
