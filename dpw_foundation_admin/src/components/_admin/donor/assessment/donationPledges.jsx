'use client';

import { Dialog } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
// API services
import * as api from 'src/services';
// Components
import GeneralDialog from 'src/components/dialog/approval';
import Table from 'src/components/table/table';
// Redux actions
import { setDonorAdminData } from 'src/redux/slices/donor';
// Utility functions
import DonationPledgesAssessment from 'src/components/table/rows/donationPledgesAssessment';
import { setToastMessage } from 'src/redux/slices/common';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'donorNumericId', label: 'ID', alignRight: false, sort: true },
  { id: 'createdOn', label: 'Date & Time', alignRight: false, sort: true },
  { id: 'donationType', label: 'Donation Type', alignRight: false, sort: true },
  { id: 'eventTitle', label: 'Donation Project', alignRight: false, sort: true },
  { id: 'pledgeAmount', label: 'Pleadge Amount', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Action', alignRight: true }
];
DonationPledges.propTypes = {
  donorType: PropTypes.string
};

/**
 * DonationPledges Component
 *
 * Displays a table of donation pledges with filtering, pagination, and actions for
 * viewing intents or assigning donations.
 *
 * @param {Object} props - Component props
 * @param {string} props.donorType - The type of donor to filter the data
 * @returns {JSX.Element} - Rendered DonationPledges component
 */
export default function DonationPledges({ donorType }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Query parameters
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');

  // Local states
  const [id, setId] = useState(null);
  const [assignSelf, setAssignSelf] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  // Fetch donation pledges data
  const { isLoading, isFetching, refetch } = useQuery(
    ['donationPledges', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      api.donorPagination({
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

  // Handle donor admin data mutation
  const { mutate } = useMutation('getDonorAdminData', api.getDonorAdminData, {
    onSuccess: (data) => {
      dispatch(setDonorAdminData(data));
    }
  });

  // Event handlers
  const handleClickOpen = (rowId, type) => {
    if (type === 'intent') {
      mutate(rowId);
    } else if (type === 'assign') {
      setAssignSelf(true);
      setId(rowId);
    }
  };

  const handleCloseAssignSelf = () => setAssignSelf(false);

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
      status: statusParams || '',
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || ''
    };
    exportMutate(obj);
  };
  return (
    <>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        row={DonationPledgesAssessment}
        totalCountText="Donation Pledges"
        allCount={tableRows?.totalElements}
        isSearch
        handleClickOpen={handleClickOpen}
        filters={[
          {
            name: 'Status',
            param: 'status',
            data: [
              { id: 'AWAITING_DOCUMENT_CREATION', name: 'Approved' },
              { id: 'ASSESSMENT_REJECTED', name: 'Rejected' },
              { id: 'ASSESSMENT_MORE_INFO_REQUIRED', name: 'Need More Info' }
            ]
          }
        ]}
        isDatePicker
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        donorType={donorType || ''}
        isExport={true}
        onExport={onExport}
      />

      {assignSelf && (
        <Dialog onClose={handleCloseAssignSelf} open={assignSelf} maxWidth="sm">
          <GeneralDialog
            onClose={handleCloseAssignSelf}
            id={id}
            refetch={refetch}
            endPoint="assignDonorByAdmin"
            type="Donor assigned"
            deleteMessage={
              'By selecting this request, you are confirming your ownership and responsibility for its follow-up. Once assigned, it will be removed from the view of other approvers and routed exclusively to you for further action.'
            }
            dialogTitle="Donation Ownership"
            btnTitle="Yes"
            payload={{ assignType: 'self' }}
            apiType={donorType}
          />
        </Dialog>
      )}
    </>
  );
}
