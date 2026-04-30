'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { Table } from 'src/components/table';
import AllReportsRow from 'src/components/table/rows/allReportsRow';
import { setToastMessage } from 'src/redux/slices/common';
import { exportAllReportData, getAllReports, getModules } from 'src/services/moduleService';
import { fDateShortYear } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false, sort: true },
  { id: 'firstName', label: 'Report Name', alignRight: false, sort: true },
  { id: 'secondName', label: 'Module Name', alignRight: false, sort: true },
  { id: 'email', label: 'Created Date', alignRight: false, sort: true },
  { id: 'phone', label: 'Created By', alignRight: false, sort: true },
  { id: 'action', label: 'Actions', alignRight: true }
];

export default function AllReportListing() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [modules, setModules] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { mutate: exportMutate } = useMutation('export-report-list', exportAllReportData, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const moduleParams = searchParams.get('module');

  const { isLoading, refetch } = useQuery(
    ['getAllReports', pageParam, rowsParam, searchParam, statusParams, moduleParams, fromDate, toDate],
    () =>
      getAllReports({
        userId: user?.userId,
        page: +pageParam - 1,
        size: +rowsParam,
        moduleId: moduleParams || '',
        keyword: searchParam || '',
        fromDate: fromDate ? fDateShortYear(fromDate) : '',
        toDate: toDate ? fDateShortYear(toDate) : ''
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

  useQuery(['getModules'], getModules, {
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const updatedData = data.map((item) => ({ ...item, name: item.label }));
      setModules(updatedData);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response?.data?.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      userId: user?.userId,
      moduleId: moduleParams || '',
      keyword: searchParam || '',
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      page: +pageParam,
      size: +rowsParam
    };
    exportMutate(obj);
  };

  return (
    <>
      <HeaderBreadcrumbs
        heading="Dynamic Report Management"
        action={{
          title: 'Create New Report',
          type: 'link',
          href: '/admin/report-management/add'
        }}
      />
      {console.log(modules)}
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading}
        row={AllReportsRow}
        totalCountText="all dynamic reports"
        allCount={tableRows?.totalElements}
        isSearch
        filters={[
          {
            name: 'Module',
            param: 'module',
            data: modules,
            value: moduleParams
          }
        ]}
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
