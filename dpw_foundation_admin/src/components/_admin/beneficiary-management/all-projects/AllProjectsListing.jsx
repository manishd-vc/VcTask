'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'src/components/table';
import AllProjectsRow from 'src/components/table/rows/beneficiary/allProjectsRow';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false, sort: true },
  { id: 'projectName', label: 'Project Name', alignRight: false, sort: true },
  { id: 'startDate', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDate', label: 'End Date', alignRight: false, sort: true },
  { id: 'campaignTargetRequired', label: 'Target Amount', alignRight: false, sort: true },
  { id: 'campaignTargetAchieved', label: 'Target Achieved', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Actions', alignRight: true }
];

export default function AllProjectsListing() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');
  const { masterData } = useSelector((state) => state?.common);
  const chritableProjectStatus = getLabelObject(masterData, 'dpwf_contribution_project_status');
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { mutate: exportMutate } = useMutation(
    'export-beneficiary-all-projects',
    beneficiaryApi.exportAllCharitableProjects,
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
    ['charitableProjects', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      beneficiaryApi.getAllCharitableProjects({
        page: +pageParam,
        rows: +rowsParam,
        search: searchParam || '',
        status: statusParams || '',
        fromDate: fromDate ? fDateShortYear(fromDate) : '',
        toDate: toDate ? fDateShortYear(toDate) : ''
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
    if (chritableProjectStatus) {
      const statusData = [];
      for (const data of chritableProjectStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [chritableProjectStatus]);

  return (
    <Table
      headData={TABLE_HEAD}
      data={tableRows}
      isLoading={isLoading || isFetching}
      row={AllProjectsRow}
      totalCountText="All Projects"
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
