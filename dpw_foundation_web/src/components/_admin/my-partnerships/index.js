'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PartnerRequests from 'src/components/table/rows/myPartners';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import { updateFirstLogin } from 'src/redux/slices/user';
import * as partnerApi from 'src/services/partner';

import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';
const TABLE_HEAD = [
  { id: 'partnershipUniqueId', label: 'ID', alignRight: false, sort: true },
  { id: 'country', label: 'Country', alignRight: false, sort: true },
  { id: 'startDate', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDate', label: 'End Date', alignRight: false, sort: true },
  { id: 'projects', label: 'No. of Project', alignRight: false, sort: true },
  { id: 'agreementType', label: 'Agreement Type', alignRight: false, sort: true },
  { id: 'reports', label: 'No. of Report', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Action', alignRight: true }
];
export default function MyPartners() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams(); // Fetching query parameters from the URL
  const statusParams = searchParams?.get('status') || ''; // Extracting status filter from query params
  const pageParam = searchParams?.get('page' || '1', 10); // Extracting page number
  const rowsPerPage = searchParams?.get('rowsPerPage' || '10', 10); // Extracting rows per page value
  const searchParam = searchParams?.get('search') || ''; // Extracting search query value
  const [fromDate, setFromDate] = useState(null); // State for "From Date" filter
  const [toDate, setToDate] = useState(null); // State for "To Date" filter
  const { user } = useSelector(({ user }) => user);
  const { masterData } = useSelector((state) => state?.common);
  const partnerStatus = getLabelObject(masterData, 'dpwf_partnership_status');
  const [status, setStatus] = useState([]); // State to hold the status list options
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const { isLoading, refetch } = useQuery(
    ['campaign', pageParam, searchParam, statusParams, fromDate, toDate, rowsPerPage],
    () =>
      partnerApi.getPartners(
        +pageParam || 1, // Default to page 1 if no page param is provided
        searchParam || '', // Default to empty string if no search query is provided
        statusParams, // Donor status filter
        (fromDate && fDateShortYear(fromDate)) || '', // From Date filter
        (toDate && fDateShortYear(toDate)) || '', // To Date filter
        rowsPerPage || 10 // Default to 10 rows per page if not specified
      ),
    {
      enabled: true, // Always enabled
      refetchOnWindowFocus: false, // Prevent refetching on window focus
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        const totalElements = data?.data?.totalElements || 0;
        dispatch(updateFirstLogin(false));
        setTableRows({
          count,
          data: rows,
          totalElements
        });
      },
      onError: (err) => {
        setTableRows({
          count: 0,
          data: [],
          totalElements: 0
        });
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
        // Dispatching error message if the API call fails
      }
    }
  );

  const { mutate } = useMutation('export', partnerApi.exportPartner, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });
  const onExport = () => {
    const obj = {
      page: +pageParam || 1,
      rows: +rowsPerPage || 10,
      sort: 'updatedOn',
      type: 'FUNDCAMP',
      search: searchParam || '',
      status: statusParams,
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      curentUserId: user?.userId
    };
    mutate(obj);
  };
  useEffect(() => {
    if (partnerStatus) {
      const statusData = [];
      for (const data of partnerStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [partnerStatus]);

  return (
    <>
      <HeaderBreadcrumbs admin heading="My Partnerships" />
      <Table
        headData={TABLE_HEAD} // Table headers
        data={tableRows} // Data to display in the table
        isLoading={isLoading} // Loading state for the table
        row={PartnerRequests} // Custom row component to render each row
        totalCountText={`Partnership Requests`} // Text to display for total count
        allCount={tableRows?.totalElements} // Total number of donations
        isSearch // Enable search functionality
        filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]} // Filter for status
        isDatePicker // Enable date picker functionality
        setFromDate={setFromDate} // Function to update the "From Date" filter
        setToDate={setToDate} // Function to update the "To Date" filter
        dateValues={[fromDate, toDate]} // Values for the date filters
        isExport={true}
        onExport={onExport}
        refetch={refetch}
      />
    </>
  );
}
