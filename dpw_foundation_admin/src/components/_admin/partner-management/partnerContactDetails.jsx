'use client';
import { Button, LinearProgress, Stack } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import PartnerContactDetailsRow from 'src/components/table/rows/partnerContactDetailsRow';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnershipApi from 'src/services/partner';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';
import AddContactModal from './AddContactModal';
import ViewContactModal from './ViewContactModal';

const LoadingFallback = () => (
  <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
    <LinearProgress />
  </Stack>
);

const TABLE_HEAD = [
  { id: 'contactPersonName', label: 'Contact Person Name', alignRight: false, sort: true },
  { id: 'contactPersonDesignation', label: 'Contact Person Designation', alignRight: false, sort: true },
  { id: 'emailId', label: 'Email ID', alignRight: false, sort: true },
  { id: 'phoneNumber', label: 'Phone Number', alignRight: false, sort: true },
  { id: 'isPrimaryContact', label: 'Is Primary Contact?', alignRight: false, sort: true },
  { id: 'actions', label: 'Actions', alignRight: true }
];

export default function PartnerContactDetails() {
  const dispatch = useDispatch();
  const params = useParams();
  const searchParams = useSearchParams();
  const partnerId = params?.id;
  const router = useRouter();
  // Query parameters
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  const [editContactData, setEditContactData] = useState(null);
  const [viewContactModalOpen, setViewContactModalOpen] = useState(false);
  const [viewContactData, setViewContactData] = useState(null);

  // Fetch partner contact details
  const { isLoading, isFetching, refetch } = useQuery(
    ['partnerContactDetails', partnerId, pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      partnershipApi.getPartnerContactDetails({
        partnerId,
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
      enabled: !!partnerId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        const totalElements = data?.data?.totalElements || 0;
        setTableRows({ count, data: rows, totalElements });
      },
      onError: (error) => {
        dispatch(
          setToastMessage({
            message: error.response?.data?.message || 'Failed to fetch contact details',
            variant: 'error'
          })
        );
      }
    }
  );

  // Export functionality
  const { mutate: exportMutate } = useMutation('export-partner-contacts', partnershipApi.exportPartnerContacts, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response?.data?.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      partnerId,
      search: searchParam || '',
      status: statusParams || '',
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      page: +pageParam,
      size: +rowsParam
    };
    exportMutate(obj);
  };

  const handleAddNewContact = () => {
    setAddContactModalOpen(true);
  };

  const handleContactAdded = () => {
    setEditContactData(null); // Clear edit data
    refetch(); // Refresh the table data
  };

  const handleEditContact = (contactData) => {
    setEditContactData(contactData);
    setAddContactModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditContactData(null);
    setAddContactModalOpen(false);
  };

  const handleViewContact = (contactData) => {
    setViewContactData(contactData);
    setViewContactModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewContactData(null);
    setViewContactModalOpen(false);
  };

  return (
    <>
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
      <HeaderBreadcrumbs
        heading="Partner Contact Details"
        action={{
          onClick: handleAddNewContact,
          title: 'Add New Contact',
          type: 'click'
        }}
      />

      <Suspense fallback={<LoadingFallback />}>
        <Table
          headData={TABLE_HEAD}
          data={tableRows}
          isLoading={isLoading || isFetching}
          row={PartnerContactDetailsRow}
          onEdit={handleEditContact}
          onView={handleViewContact}
          partnerId={partnerId}
          totalCountText="All contact details"
          allCount={tableRows?.totalElements}
          isSearch
          searchPlaceholder="Search here"
          filters={[]}
          isDatePicker={false}
          setFromDate={setFromDate}
          setToDate={setToDate}
          dateValues={[fromDate, toDate]}
          datePickerLabels={['Select From Date', 'Select TO Date']}
          isExport={true}
          onExport={onExport}
          exportButtonText="Export"
          refetch={refetch}
        />
      </Suspense>

      {/* Add/Edit Contact Modal */}
      <AddContactModal
        open={addContactModalOpen}
        onClose={handleCloseEditModal}
        partnerId={partnerId}
        onSuccess={handleContactAdded}
        editData={editContactData}
      />

      {/* View Contact Modal */}
      <ViewContactModal open={viewContactModalOpen} onClose={handleCloseViewModal} contactData={viewContactData} />
    </>
  );
}
