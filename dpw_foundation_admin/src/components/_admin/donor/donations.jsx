'use client';

import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// API services
import * as api from 'src/services';
// Components
import Table from 'src/components/table/table';
// Redux actions
import { setDonorAdminData } from 'src/redux/slices/donor';
// Utility functions
import DonationsRow from 'src/components/table/rows/donations';
import { setSubmittedAssessment, setToastMessage } from 'src/redux/slices/common';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'donorNumericId', label: 'ID', alignRight: false, sort: true },
  { id: 'donorTitle', label: 'Date & Time', alignRight: false, sort: true },
  { id: 'donationType', label: 'Donation Type', alignRight: false, sort: true },
  { id: 'donationProject', label: 'Donation Project', alignRight: false, sort: true },
  { id: 'pledgeAmount', label: 'Pledge Amount', alignRight: false, sort: true },
  { id: 'donationAmount', label: 'Donation Amount', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Action', alignRight: true }
];
Donations.propTypes = {
  donorType: PropTypes.string
};

/**
 * Donations Component
 *
 * Displays a table of donation pledges with filtering, pagination, and actions for
 * viewing intents or assigning donations.
 *
 * @param {Object} props - Component props
 * @param {string} props.donorType - The type of donor to filter the data
 * @returns {JSX.Element} - Rendered DonationPledges component
 */
export default function Donations({ donorType }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Query parameters
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');

  // Local states
  const [, setSingleRow] = useState(null);
  const [, setIcadOpen] = useState(false);
  const [, setId] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { masterData } = useSelector((state) => state?.common);
  const donationSatus = getLabelObject(masterData, 'dpw_foundation_filter_donor_status');

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [, setStatus] = useState([]);
  // Fetch donation pledges data
  const { isLoading, isFetching } = useQuery(
    ['donationPledges', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      api.donorPagination({
        type: 'admin',
        page: +pageParam,
        rows: +rowsParam,
        sort: '',
        payload: {
          keyword: searchParam || '',
          statuses: ['DONATED'],
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

  // Handle donor admin data mutation
  const { mutate } = useMutation('getDonorAdminData', api.getDonorAdminData, {
    onSuccess: (data) => {
      dispatch(setSubmittedAssessment(null));
      dispatch(setDonorAdminData(data));
    }
  });

  // Event handlers
  const handleClickOpen = (rowId, type) => {
    mutate(rowId);
    setId(rowId);
  };

  const handleIcadOpen = (rowData) => {
    mutate(rowData?.id);
    setSingleRow(rowData);
    setIcadOpen(true);
  };

  const { mutate: exportMutate } = useMutation('export-donor-admin', api.exportDonorAdminAuditByAdmins, {
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
      status: 'DONATED',
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || ''
    };
    exportMutate(obj);
  };
  useEffect(() => {
    if (donationSatus) {
      const statusData = [];
      for (const data of donationSatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [donationSatus]);
  return (
    <Table
      headData={TABLE_HEAD}
      data={tableRows}
      isLoading={isLoading || isFetching}
      row={DonationsRow}
      totalCountText="Donations"
      allCount={tableRows?.totalElements}
      isSearch
      handleClickOpen={handleClickOpen}
      filters={[]}
      isDatePicker
      setFromDate={setFromDate}
      setToDate={setToDate}
      dateValues={[fromDate, toDate]}
      donorType={donorType || ''}
      isExport={true}
      onExport={onExport}
      handleIcadOpen={handleIcadOpen}
    />
  );
}
