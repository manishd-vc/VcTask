'use client';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect, useState } from 'react';

// api imports
// component imports
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import MyDonationRow from 'src/components/table/rows/myDonations';
import Table from 'src/components/table/table';
import useCreateToken from 'src/hooks/useCreateToken';
import { setToastMessage } from 'src/redux/slices/common';
import { updateFirstLogin } from 'src/redux/slices/user';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';
import TermsDialog from './TermsDialog';

const IntentViewer = lazy(() => import('./intentViewer'));

const TABLE_HEAD = [
  { id: 'donationPledgeId', label: 'ID', alignRight: false, sort: true },
  { id: 'createdOn', label: 'Date & Time', alignRight: false, sort: true },
  { id: 'donationType', label: 'Donation Type', alignRight: false, sort: true },
  { id: 'donationProject', label: 'Donation Project', alignRight: false, sort: true },
  { id: 'pledgeAmount', label: 'Pledge Amount', alignRight: false, sort: true },
  { id: 'donationAmount', label: 'Donation Amount', alignRight: false, sort: true },
  { id: 'paymentThrough', label: 'Payment Mode', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Action', alignRight: true }
];

// Main component for handling donations
export default function MyDonation() {
  const searchParams = useSearchParams(); // Fetching query parameters from the URL
  const dispatch = useDispatch(); // Accessing Redux dispatch
  const statusParams = searchParams.get('status'); // Extracting status filter from query params
  const pageParam = searchParams.get('page'); // Extracting page number
  const rowsPerPage = searchParams.get('rowsPerPage'); // Extracting rows per page value
  const searchParam = searchParams.get('search'); // Extracting search query value
  const [row, setRow] = useState(null); // State for selected row data
  const [open, setOpen] = useState(false); // State to handle modal visibility
  const [fromDate, setFromDate] = useState(null); // State for "From Date" filter
  const [toDate, setToDate] = useState(null); // State for "To Date" filter
  const { user } = useSelector(({ user }) => user);
  const { masterData } = useSelector((state) => state?.common);
  const donationSatus = getLabelObject(masterData, 'dpw_foundation_filter_donor_status');

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  }); // State to hold data for table rows
  const [status, setStatus] = useState([]); // State to hold the status list options
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // State to hold payment initiation data

  const createToken = useCreateToken();

  // Query hook to fetch donation data based on various filters
  const { isLoading, refetch } = useQuery(
    ['campaign', pageParam, searchParam, statusParams, fromDate, toDate, rowsPerPage],
    () =>
      api.getMyDonations(
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
        const rows = data?.data?.content; // Extracting donation data rows
        const count = data?.data?.totalPages; // Extracting total pages for pagination
        const totalElements = data?.data?.totalElements; // Extracting total count of elements
        dispatch(updateFirstLogin(false));
        setTableRows({
          count: count,
          data: rows,
          totalElements: totalElements
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

  const { mutate: mutateDonate } = useMutation('donation', api.donateNow, {
    onSuccess: (data) => {
      if (data?.data?.paymentFinalUrl) {
        window.location.href = data?.data?.paymentFinalUrl;
      }
      setIsTermsAccepted(false); // Resetting terms acceptance state
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: mutateToken } = useMutation('validateToken', api.validateTokenPayment, {
    onSuccess: (data, variables) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      mutateDonate({
        token: variables.token,
        platform: 'WEB',
        description: ''
      });
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      setIsTermsAccepted(false); // Resetting terms acceptance state on error
    }
  });

  // Handler for opening the IntentViewer modal with the selected donation row
  const handleClickOpen = (row, type) => {
    if (type === 'view-intent') {
      getDonationDetail(row);
    } else if (type === 'donate') {
      setPaymentData(row);
      setIsTermsAccepted(true); // Set terms accepted state to true
    }
  };

  const handleSubmitAcceptTerms = () => {
    const payload = {
      pledgeId: paymentData?.id,
      amount: paymentData?.donationAmount,
      from: 'WEB',
      donorId: paymentData?.donor?.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 2 // Token expiration set to 2 minutes from now
    };
    const token = createToken(payload);
    mutateToken({ token: token });
  };

  // API call to fetch donation details by donation ID
  const getDonationDetail = async (data) => {
    const result = await api.getDonationDetailById(data.id); // Fetching donation detail
    setRow(result.data); // Set the detailed data for the row
    setOpen(true); // Open the modal to display donation details
  };

  // Handler for closing the modal
  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  const { mutate } = useMutation('export', api.exportCampaignByUser, {
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
      sort: 'donationAmount',
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
      {/* Rendering the page heading */}
      <HeaderBreadcrumbs admin heading="My Donations" />
      <Table
        headData={TABLE_HEAD} // Table headers
        data={tableRows} // Data to display in the table
        isLoading={isLoading} // Loading state for the table
        row={MyDonationRow} // Custom row component to render each row
        totalCountText={`Donation Requests`} // Text to display for total count
        allCount={tableRows?.totalElements} // Total number of donations
        isSearch // Enable search functionality
        handleClickOpen={handleClickOpen} // Function to open the modal when a row is clicked
        filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]} // Filter for status
        isDatePicker // Enable date picker functionality
        setFromDate={setFromDate} // Function to update the "From Date" filter
        setToDate={setToDate} // Function to update the "To Date" filter
        dateValues={[fromDate, toDate]} // Values for the date filters
        isExport={true}
        onExport={onExport}
        refetch={refetch}
      />
      {isTermsAccepted && (
        <TermsDialog
          open={isTermsAccepted}
          onClose={() => setIsTermsAccepted(false)}
          onSubmit={handleSubmitAcceptTerms}
        />
      )}
      {/* IntentViewer modal component to display detailed donation information */}
      <Suspense fallback={<div>Loading...</div>}>
        {open && <IntentViewer open={open} row={row} onClose={handleClose} isLoading={isLoading} />}
      </Suspense>
    </>
  );
}
