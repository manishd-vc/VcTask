'use client';

import PropTypes from 'prop-types';

// MUI components

// Custom components
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import OnSpotDonationRow from 'src/components/table/rows/OnSpotDonationRow';
import Table from 'src/components/table/table';
// Redux actions

import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from 'react-query';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';
import OnSpotIntentViewer from './OnSpotIntentViewer';

const TABLE_HEAD = [
  { id: 'donationPledgeId', label: 'ID', alignRight: false, sort: true },
  { id: 'createdOn', label: 'Date & Time', alignRight: false, sort: true },
  { id: 'name', label: 'Donor Name', alignRight: false, sort: true },
  { id: 'registeredAs', label: 'Registered As', alignRight: false, sort: true },
  { id: 'donationType', label: 'Donation Type', alignRight: false, sort: true },
  { id: 'eventTitle', label: 'Event Name', alignRight: false, sort: true },
  { id: 'paymentMethod', label: 'Payment Method', alignRight: false, sort: true },
  { id: 'donationAmount', label: 'Donation Amount', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Action', alignRight: false }
];
/**
 * OnTheSpotDonation Component
 *
 * A main container for donor-related management, offering tabs for donation pledges,
 * donors, email groups, and SMS groups. Implements lazy loading for performance optimization.
 *
 * @param {object} props - Component props
 * @param {string} props.donorType - The type of donors to display
 * @returns {JSX.Element} - Rendered OnTheSpotDonation component
 */
export default function OnTheSpotDonation({ donorType }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Query parameters
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');

  // Local states
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  // Fetch on the spot donation pledges data
  const { isLoading, isFetching } = useQuery(
    ['donationPledges', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      api.onSpotDonorPagination({
        type: donorType,
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

  const handleClose = () => setOpen(false);
  const { masterData } = useSelector((state) => state?.common);
  let filterData = getLabelObject(masterData, 'dpw_foundation_filter_donor_status');
  const ALLOWED_STATUSES = ['DONATED', 'FAILED', 'DONATION_PENDING'];
  filterData = filterData?.values
    .filter((item) => ALLOWED_STATUSES.includes(item.code))
    .map((item) => ({ id: item.code, name: item.label }));
  const filters = [
    {
      name: 'Status',
      param: 'status',
      data: filterData
    }
  ];

  const { mutate: exportFile } = useMutation('export', api.exportOnSpotDonation, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      type: donorType,
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
    };
    exportFile(obj);
  };

  return (
    <>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        row={OnSpotDonationRow}
        totalCountText="Donation Pledges"
        allCount={tableRows?.totalElements}
        isSearch={true}
        isDatePicker={true}
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        filters={filters}
        isExport={true}
        onExport={onExport}
      />

      {open && <OnSpotIntentViewer open={open} onClose={handleClose} isLoading={false} refetch={() => {}} />}
    </>
  );
}

OnTheSpotDonation.propTypes = {
  donorType: PropTypes.string
};
