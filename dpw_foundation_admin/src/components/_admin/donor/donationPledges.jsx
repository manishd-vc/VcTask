'use client';

import { Dialog } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// API services
import * as api from 'src/services';
// Components
import GeneralDialog from 'src/components/dialog/approval';
import DonationPledgesRow from 'src/components/table/rows/donationPledges';
import Table from 'src/components/table/table';
import IntentViewer from './intentViewer';
// Redux actions
import { setDonorAdminData } from 'src/redux/slices/donor';
// Utility functions
import IcadAminModal from 'src/components/dialog/icadAminModal';
import { setSubmittedAssessment, setToastMessage } from 'src/redux/slices/common';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'donorNumericId', label: 'ID', alignRight: false, sort: true },
  { id: 'donorTitle', label: 'Date & Time', alignRight: false, sort: true },
  { id: 'donationType', label: 'Transaction Type', alignRight: false, sort: true },
  { id: 'donationProject', label: 'Campaign Name', alignRight: false, sort: true },
  { id: 'pledgeAmount', label: 'Pledge Amount', alignRight: false, sort: true },
  { id: 'donationAmount', label: 'Donation Amount', alignRight: false, sort: true },
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
  const [singleRow, setSingleRow] = useState(null);
  const [icadOpen, setIcadOpen] = useState(false);
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [assignSelf, setAssignSelf] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { masterData } = useSelector((state) => state?.common);
  const donationSatus = getLabelObject(masterData, 'dpw_foundation_filter_donor_status');

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
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
      dispatch(setSubmittedAssessment(null));
      dispatch(setDonorAdminData(data));
    }
  });

  // Event handlers
  const handleClickOpen = (rowId, type) => {
    if (type === 'intent') {
      setOpen(true);
      mutate(rowId);
    } else if (type === 'assign') {
      setAssignSelf(true);
      setId(rowId);
    }
  };

  const handleClose = () => setOpen(false);
  const handleCloseAssignSelf = () => setAssignSelf(false);
  const handleIcadOpen = (rowData) => {
    mutate(rowData?.id);
    setSingleRow(rowData);
    setIcadOpen(true);
  };
  const handleIcadClose = () => setIcadOpen(false);

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
    <>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        row={DonationPledgesRow}
        totalCountText="Donation Pledges"
        allCount={tableRows?.totalElements}
        isSearch
        handleClickOpen={handleClickOpen}
        filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
        isDatePicker
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        donorType={donorType || ''}
        isExport={true}
        onExport={onExport}
        handleIcadOpen={handleIcadOpen}
      />

      {open && <IntentViewer open={open} onClose={handleClose} isLoading={isLoading} refetch={refetch} />}

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
      {icadOpen && (
        <IcadAminModal open={icadOpen} onClose={handleIcadClose} singleRowData={singleRow} refetch={refetch} />
      )}
    </>
  );
}
