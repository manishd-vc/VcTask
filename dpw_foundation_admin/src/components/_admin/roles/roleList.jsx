'use client';

import { Dialog } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import RestoreRole from 'src/components/dialog/restoreRole';
import RoleDelete from 'src/components/dialog/roleDelete';
import RoleRow from 'src/components/table/rows/roleList';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateShortYear } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';

// Table headers for archived roles

// Status filter options
const STATUS_OPTIONS = [
  { id: 'Active', name: 'Active' },
  { id: 'Inactive', name: 'Inactive' }
];

// Archived status filter options
RoleList.propTypes = {
  // 'tableTitle' is expected to be an array
  tableTitle: PropTypes.string.isRequired
};
/**
 * RoleList Component
 *
 * Renders a table for displaying and managing roles, including active and archived roles.
 * Supports filtering, pagination, and inline actions such as restoring or deleting roles.
 *
 * @param {Object} props - Component props
 * @param {string} props.tableTitle - Title text displayed above the table
 *
 * @returns {JSX.Element} - Rendered RoleList component
 */
export default function RoleList({ tableTitle }) {
  const dispatch = useDispatch(); // Redux dispatch for triggering actions
  const searchParams = useSearchParams(); // Access URL search parameters

  // State for managing dialog visibility and selected role ID
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const hasRoleManageView = checkPermissions(rolesAssign, ['role_manage_view']);
  const hasRoleManageOP = checkPermissions(rolesAssign, ['role_manage_operations']);
  // Table headers for active roles
  const TABLE_HEAD = [
    { id: 'roleId', label: 'Role ID', alignRight: false, sort: true },
    { id: 'roleName', label: 'Role Name', alignRight: false, sort: true },
    { id: 'roleDescription', label: 'Role Description', alignRight: false, sort: true },
    { id: 'associatedUser', label: 'No. of users', alignRight: false, sort: false },
    { id: 'createdDate', label: 'Created date', alignRight: false, sort: false },
    { id: 'status', label: 'Status', alignRight: false, sort: true },
    ...(hasRoleManageView && !hasRoleManageOP ? [] : [{ id: '', label: 'Actions', alignRight: true }])
  ];

  const ARCHIVED_TABLE_HEAD = [
    { id: 'roleId', label: 'Role ID', alignRight: false, sort: true },
    { id: 'roleName', label: 'Role Name', alignRight: false, sort: true },
    { id: 'roleDescription', label: 'Role Description', alignRight: false, sort: true },
    { id: 'associatedUser', label: 'No. of users', alignRight: false, sort: false },
    { id: 'archivedDate', label: 'Archived Date', alignRight: false, sort: false },
    { id: 'status', label: 'Status', alignRight: false, sort: true },
    ...(hasRoleManageView && !hasRoleManageOP ? [] : [{ id: '', label: 'Actions', alignRight: true }])
  ];
  // Extract URL parameters
  const pageParam = searchParams.get('page');
  const rowsParam = searchParams.get('rowsPerPage');
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');
  const initialTab = searchParams.get('tab');
  // Determine if the current tab is for archived roles
  const archivedRoles = initialTab === 'archivedRoles' ? 'Archived' : '';

  /**
   * Fetch role data using react-query.
   * Includes parameters for filtering, pagination, and sorting.
   */
  const { isLoading } = useQuery(
    ['userRoles', pageParam, searchParam, rowsParam, statusParams, fromDate, toDate, archivedRoles],
    () =>
      api.getUserRoles({
        page: +pageParam || 1,
        rows: +rowsParam || 10,
        payload: {
          keyword: searchParam || '',
          statuses: [statusParams || archivedRoles || ''],
          createdDate: {
            fromDate: (fromDate && fDateShortYear(fromDate)) || '',
            toDate: (toDate && fDateShortYear(toDate)) || ''
          },
          datePattern: 'MM/dd/yyyy'
        },
        sort: 'name'
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false, // Prevent unnecessary refetching on window focus
      onSuccess: (data) => {
        const rows = data?.data?.content;
        const count = data?.data?.totalPages;
        const totalElements = data?.data?.totalElements;
        setTableRows({
          count: count,
          data: rows,
          totalElements: totalElements
        });
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  /**
   * Opens the dialog for the selected action (restore or delete role).
   *
   * @param {Object} prop - Role details
   * @returns {Function} - Event handler for opening the dialog
   */
  const handleClickOpen = (prop) => () => {
    setOpen(true);
    setId(prop?.id);
    setRoleName(prop);
  };

  /**
   * Closes the currently open dialog.
   */
  const handleClose = () => {
    setOpen(false);
    setId(null);
  };

  const { mutate } = useMutation('export-roles', api.exportRolesByAdminsByAdmin, {
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
      status: statusParams || archivedRoles,
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      isArchive: archivedRoles === 'Archived'
    };
    mutate(obj);
  };

  return (
    <>
      {/* Dialog for restoring or deleting a role */}
      {archivedRoles ? (
        <Dialog aria-label="restore-role" onClose={handleClose} open={open} maxWidth={'sm'}>
          <RestoreRole id={id} handleClose={handleClose} />
        </Dialog>
      ) : (
        <Dialog
          onClose={handleClose}
          aria-label="delete-role"
          aria-labelledby="delete-role"
          open={open}
          maxWidth={'md'}
        >
          <RoleDelete id={id} handleClose={handleClose} open={open} roleName={roleName} />
        </Dialog>
      )}

      {/* Table component for displaying roles */}
      <Table
        headData={archivedRoles ? ARCHIVED_TABLE_HEAD : TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading}
        row={RoleRow}
        setId={setId}
        id={setId}
        isSearch
        handleClickOpen={handleClickOpen}
        isDatePicker
        filters={archivedRoles ? [] : [{ name: 'Status', param: 'status', data: STATUS_OPTIONS }]}
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        allCount={tableRows?.totalElements}
        totalCountText={tableTitle}
        isExport={true}
        onExport={onExport}
      />
    </>
  );
}
