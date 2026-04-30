import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { CloseIcon } from '../icons';
import { Table } from '../table';
import DeleteRoleRow from '../table/rows/deleteRoleRow';
import ModalStyle from './dialog.style';
// Table head structure
const TABLE_HEAD = [
  { id: 'id', label: 'User ID', alignRight: false, sort: true },
  { id: 'firstName', label: 'First Name', alignRight: false, sort: true },
  { id: 'lastName', label: 'Second Name', alignRight: false, sort: false },
  { id: 'status', label: 'Status', alignRight: false, sort: false },
  { id: '', label: 'Select Role', alignRight: true }
];

UserWithRoles.propTypes = {
  // 'id' is either a string or number, representing the user's identifier
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  // 'roleName' is an object that contains a 'name' property
  roleName: PropTypes.shape({
    name: PropTypes.string.isRequired // 'name' inside 'roleName' should be a string
  }).isRequired,

  // 'handleClose' is a function to close the dialog or perform some action
  handleClose: PropTypes.func.isRequired,

  // 'setUserRoleMapping' is a function to update the user-role mapping
  setUserRoleMapping: PropTypes.func.isRequired,

  // 'userRoleMapping' is an array that holds the roles mapping for the user
  userRoleMapping: PropTypes.array.isRequired,

  // 'setStep' is a function to update the step of the form or process
  setStep: PropTypes.func.isRequired
};
/**
 * UserWithRoles - Dialog component to handle role deletion for users currently assigned a role.
 * @param {object} props - The component props.
 * @param {string} props.id - The role ID to manage.
 * @param {string} props.roleName - The name of the role being deleted.
 * @param {function} props.handleClose - Callback to close the modal.
 * @param {function} props.setUserRoleMapping - Sets the mapping of users to roles.
 * @param {array} props.userRoleMapping - Array of current user-role mappings.
 * @param {function} props.setStep - Callback to set the current step for the modal.
 * @returns {JSX.Element} - UserWithRoles component.
 */
export default function UserWithRoles({ id, roleName, handleClose, setUserRoleMapping, userRoleMapping, setStep }) {
  // Redux dispatch to send toast messages
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme); // Custom modal styles
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page'); // Get page parameter from URL
  const rowsParam = searchParams.get('rowsPerPage'); // Get the 'rowsPerPage' query parameter

  // State to manage table rows and pagination
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  // Fetch user data based on role ID with react-query
  const { isLoading } = useQuery(
    ['user', pageParam, rowsParam, id],
    () =>
      api.getUserByAdminsByAdmin({
        page: +pageParam || 1,
        rows: +rowsParam || 10,
        search: '',
        role: id,
        status: '',
        fromDate: '',
        toDate: ''
      }),
    {
      onSuccess: (data) => {
        setTableRows({
          count: data?.data?.totalPages,
          data: data?.data?.content,
          totalElements: data?.data?.totalElements
        });
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  // Fetch role data based on role ID
  const { data: role } = useQuery(['roles', id], () => api.getAllRoles(id), {
    enabled: Boolean(id),
    onError: (error) => {
      console.error('Error fetching roles:', error);
    }
  });

  return (
    <>
      {/* Modal title with role name */}
      <DialogTitle sx={style.modalTitle}>
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="h5" textTransform="uppercase" color="primary.main">
            Delete Role -
          </Typography>
          <Typography variant="h6" textTransform="uppercase" fontWeight={300} color="primary.main">
            {roleName?.name}
          </Typography>
        </Stack>
      </DialogTitle>

      {/* Close button for the modal */}
      <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      {/* Modal content with instructions and table */}
      <DialogContent sx={{ p: 0 }}>
        <Typography variant="body1" color="text.secondarydark" px={2.7}>
          There are users currently associated with this role. Please reassign them to a different role before
          proceeding.
        </Typography>

        {/* Table component displaying users associated with the role */}
        <Table
          headData={TABLE_HEAD}
          data={tableRows}
          isLoading={isLoading}
          row={DeleteRoleRow}
          roleData={role?.data}
          setUserRoleMapping={setUserRoleMapping}
          userRoleMapping={userRoleMapping}
          allCount={tableRows?.totalElements}
          totalCountText="All Users"
        />
      </DialogContent>

      {/* Modal actions - Cancel and Delete buttons */}
      <DialogActions>
        {/* Cancel button to close the modal */}
        <Button variant="outlinedWhite" onClick={handleClose}>
          Cancel
        </Button>

        {/* Delete button to trigger role deletion, enabled when all users are mapped */}
        <Button
          variant="contained"
          disabled={userRoleMapping?.length !== tableRows?.data?.length}
          onClick={() => setStep(1)}
        >
          Delete
        </Button>
      </DialogActions>
    </>
  );
}
