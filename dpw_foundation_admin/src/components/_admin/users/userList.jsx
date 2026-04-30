'use client';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';
// api
import { useMutation, useQuery } from 'react-query';
import * as api from 'src/services';
// component
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import DeleteDialog from 'src/components/dialog/delete';
import ResetPasswordDialog from 'src/components/dialog/resetPassword';
import RestoreUser from 'src/components/dialog/restoreUser';
import SuspendDialog from 'src/components/dialog/suspend';
import ExternalUserList from 'src/components/table/rows/externalUserList';
import UserList from 'src/components/table/rows/usersList';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import { fDateShortYear } from 'src/utils/formatTime';

// Table header configuration for active users
const TABLE_HEAD = [
  { id: 'employeeId', label: 'Employee ID', alignRight: false, sort: true },
  { id: 'firstName', label: 'First Name', alignRight: false, sort: true },
  { id: 'lastName', label: 'Second Name', alignRight: false, sort: true },
  { id: 'role', label: 'Role', alignRight: false, sort: false },
  { id: 'email', label: 'Email ID', alignRight: false, sort: true },
  { id: 'phoneNumber', label: 'Phone', alignRight: false, sort: false },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Action', alignRight: true }
];

// Table header configuration for archived users
const ARCHIVED_TABLE_HEAD = [
  { id: 'employeeId', label: 'Employee ID', alignRight: false, sort: true },
  { id: 'firstName', label: 'First Name', alignRight: false, sort: true },
  { id: 'lastName', label: 'Second Name', alignRight: false, sort: true },
  { id: 'role', label: 'Role', alignRight: false, sort: false },
  { id: 'email', label: 'Email ID', alignRight: false, sort: true },
  { id: 'phoneNumber', label: 'Phone', alignRight: false, sort: false },
  { id: 'archivedDate', label: 'Archived Date', alignRight: false, sort: false },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Action', alignRight: true }
];

const EXTERNAL_TABLE_HEAD = [
  { id: 'firstName', label: 'First Name', alignRight: false, sort: true },
  { id: 'lastName', label: 'Second Name', alignRight: false, sort: true },
  { id: 'accountType', label: 'Registered  as', alignRight: false, sort: true },
  { id: 'email', label: 'Email ID', alignRight: false, sort: true },
  { id: 'phone', label: 'Phone', alignRight: false, sort: false },
  { id: 'contributedAs', label: 'Contributed As', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Action', alignRight: true }
];

// Status options for filtering
const STATUS_OPTIONS = [
  { id: 'Active', name: 'Active' },
  { id: 'Inactive', name: 'Inactive' }
];

const EXTERNAL_STATUS_OPTIONS = [
  { id: 'Active', name: 'Active' },
  { id: 'Suspended', name: 'Suspended' },
  { id: 'Deleted', name: 'Deleted' }
];

AdminUsers.propTypes = {
  // 'tableTitle' is expected to be an array
  tableTitle: PropTypes.string.isRequired
};
/**
 * AdminUsers Component - Displays a table of users with options to manage them.
 *
 * This component fetches and displays active or archived users, allows role management,
 * user deletion, restoration, and password resetting.
 *
 * @param {Object} props - Component props.
 * @param {string} props.tableTitle - Title for the table (e.g., 'Users List').
 * @returns {JSX.Element} - The rendered AdminUsers component.
 */
export default function AdminUsers({ tableTitle }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page'); // Get the 'page' query parameter from the URL
  const rowsParam = searchParams.get('rowsPerPage'); // Get the 'rowsPerPage' query parameter
  const searchParam = searchParams.get('search'); // Get the 'search' query parameter
  const roleParams = searchParams.get('Role'); // Get the 'Role' query parameter
  const statusParams = searchParams.get('status'); // Get the 'status' query parameter
  const initialTab = searchParams.get('tab'); // Get the 'tab' query parameter (archived users or active)
  const dispatch = useDispatch();
  // State for controlling modals and table data
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [tableRows, setTableRows] = useState({ count: 0, data: [], totalElements: 0 });
  const [resetModal, setResetModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const { data: role } = useQuery(['roles'], () => api.getAllRoles('')); // Fetch roles for filtering

  // Determine if the view is for archived users
  const archivedUsers = initialTab === 'archivedUsers' ? 'Archived' : '';
  const isext = initialTab === 'externalUsers' ? 'true' : 'false';
  // Fetch user data based on search, filters, and pagination
  const { isLoading, refetch } = useQuery(
    [
      'user',
      pageParam,
      searchParam,
      count,
      roleParams,
      statusParams,
      rowsParam,
      fromDate,
      toDate,
      archivedUsers,
      initialTab
    ],
    () =>
      api.getUserByAdminsByAdmin({
        page: +pageParam || 1,
        rows: +rowsParam || 10,
        search: searchParam || '',
        role: roleParams,
        status: statusParams || archivedUsers,
        fromDate: (fromDate && fDateShortYear(fromDate)) || '',
        toDate: (toDate && fDateShortYear(toDate)) || '',
        isExternal: initialTab === 'externalUsers' ? true : false
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false, // Avoid fetching when the window refocuses

      onSuccess: (data) => {
        const rows = data?.data?.content;
        const count = data?.data?.totalPages;
        const totalElements = data?.data?.totalElements;
        setTableRows({ count, data: rows, totalElements });
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const [id, setId] = useState(null);

  // Mutation to update user role
  useMutation(api.updateUserRoleByAdmin, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      setCount((prev) => prev + 1);
      setId(null);
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      setId(null);
    }
  });

  // Open modal for delete or restore user
  const handleClickOpen = (prop) => () => {
    setOpen(true);
    setId(prop);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
  };

  // Open password reset modal
  const handleOpenResetModal = (email) => {
    setResetModal(true);
    setUserEmail(email);
  };

  const { mutate } = useMutation('export-users', api.exportUserByAdminsByAdmin, {
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
      rows: +rowsParam || 10,
      search: searchParam || '',
      role: roleParams,
      status: statusParams || archivedUsers,
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      isExtUser: isext,
      isArchive: archivedUsers === 'Archived'
    };
    mutate(obj);
  };

  const renderTableHead = () => {
    switch (initialTab) {
      case 'externalUsers':
        return EXTERNAL_TABLE_HEAD;
      case 'archivedUsers':
        return ARCHIVED_TABLE_HEAD;
      default:
        return TABLE_HEAD;
    }
  };

  const renderStatusOptions = () => {
    switch (initialTab) {
      case 'externalUsers':
        return { name: 'Status', param: 'status', data: EXTERNAL_STATUS_OPTIONS, value: statusParams };
      case 'archivedUsers':
        return { name: 'Role', param: 'role', data: role?.data, value: roleParams };
      default:
        return { name: 'Status', param: 'status', data: STATUS_OPTIONS, value: statusParams };
    }
  };

  const handleClickSuspend = (rowId) => () => {
    setIsSuspended(true);
    setId(rowId);
  };

  const handleCloseSuspend = () => {
    setIsSuspended(false);
    setId(null);
  };

  const handleClickDelete = (rowId) => () => {
    setIsDeleted(true);
    setId(rowId);
  };

  const handleClickActiveExternal = (rowId) => () => {
    setIsActive(true);
    setId(rowId);
  };

  return (
    <>
      {/* Conditional rendering for Delete or Restore dialog */}
      {!archivedUsers ? (
        <Dialog aria-label="Delete-user" onClose={handleClose} open={open} maxWidth={'md'}>
          <DeleteDialog onClose={handleClose} id={id} />
        </Dialog>
      ) : (
        <Dialog aria-label="Restore-user" onClose={handleClose} open={open} maxWidth={'sm'}>
          <RestoreUser onClose={handleClose} id={id} refetch={refetch} />
        </Dialog>
      )}

      {/* Password reset dialog */}
      {resetModal && (
        <Dialog aria-label="Reset-password" onClose={() => setResetModal(false)} open={resetModal} maxWidth={'xs'}>
          <ResetPasswordDialog onClose={() => setResetModal(false)} email={userEmail} />
        </Dialog>
      )}
      {isSuspended && (
        <Dialog aria-label="Suspend-user" onClose={() => setIsSuspended(false)} open={isSuspended} maxWidth={'sm'}>
          <SuspendDialog
            onClose={handleCloseSuspend}
            id={id}
            refetch={refetch}
            confirmText={'Are you sure you want to suspend this user ?'}
          />
        </Dialog>
      )}

      {isDeleted && (
        <Dialog aria-label="Delete-user" onClose={() => setIsDeleted(false)} open={isDeleted} maxWidth={'sm'}>
          <SuspendDialog
            onClose={() => setIsDeleted(false)}
            id={id}
            refetch={refetch}
            confirmText={'Are you sure you want to delete this user ?'}
            isDelete
          />
        </Dialog>
      )}
      {isActive && (
        <Dialog aria-label="Restore-external-user" onClose={() => setIsActive(false)} open={isActive} maxWidth={'sm'}>
          <RestoreUser onClose={() => setIsActive(false)} id={id} isExternalUser refetch={refetch} />
        </Dialog>
      )}

      {/* Table displaying user data with filters and pagination */}
      <Table
        headData={renderTableHead()} // Select the appropriate table header
        data={tableRows} // Table data
        isLoading={isLoading} // Loading state
        row={initialTab === 'externalUsers' ? ExternalUserList : UserList} // Custom row component for user data
        setId={setId} // Set the selected user ID
        id={setId} // Set the selected user ID
        isSearch // Enable search functionality
        handleClickOpen={handleClickOpen} // Handle opening the delete/restore dialog
        handleOpenResetModal={handleOpenResetModal} // Handle opening the password reset dialog
        filters={[renderStatusOptions()]}
        isDatePicker // Enable date picker functionality
        setFromDate={setFromDate} // Set the 'from' date for filtering
        maxDate={new Date()}
        setToDate={setToDate} // Set the 'to' date for filtering
        dateValues={[fromDate, toDate]} // Date range values
        allCount={tableRows?.totalElements} // Total number of users
        totalCountText={tableTitle} // Table title (e.g., 'Users List')
        isExport={true}
        onExport={onExport}
        handleClickSuspend={handleClickSuspend}
        handleClickDelete={handleClickDelete}
        handleClickActiveExternal={handleClickActiveExternal}
      />
    </>
  );
}
