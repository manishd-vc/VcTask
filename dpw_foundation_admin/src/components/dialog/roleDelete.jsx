import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import UserWithRoles from './userWithRoles';
import WithOutUserRole from './withOutUserRole';

RoleDelete.propTypes = {
  // 'id' is either a string or number, representing the role's identifier
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  // 'handleClose' is a function to close the dialog or perform some action
  handleClose: PropTypes.func.isRequired,

  // 'roleName' is an object that contains 'userCount' and should be validated
  roleName: PropTypes.shape({
    // 'userCount' is a number representing the number of users in the role
    userCount: PropTypes.number.isRequired
  }).isRequired
};

/**
 * RoleDelete - Component for handling role deletion with user reassignment or archiving.
 * @param {object} props - The component props.
 * @param {string} props.id - The role ID to delete.
 * @param {function} props.handleClose - Callback to close the modal.
 * @param {object} props.roleName - Role name and user count data.
 * @returns {JSX.Element} - RoleDelete component.
 */
export default function RoleDelete({ id, handleClose, roleName }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); // Initialize query client

  // State to track confirmation and user-role mappings
  const [isConfirm, setIsConfirm] = useState('');
  const [userRoleMapping, setUserRoleMapping] = useState([]);
  const [step, setStep] = useState(0);

  // Mutation hook for deleting roles
  const { mutate, isLoading: deleteLoading } = useMutation(api.deleteRoles, {
    onSuccess: (response) => {
      // On successful deletion, show a success message and close the modal
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      handleClose();
      queryClient.invalidateQueries('userRoles'); // Invalidate query to refresh data
    },
    onError: (error) => {
      // On error, show an error message
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  /**
   * handleDeleteRole - Prepares the payload and triggers the delete mutation.
   */
  const handleDeleteRole = () => {
    const payload = {
      userRoleMapping: userRoleMapping, // Users to reassign or delete
      isArchivedNotDeleted: isConfirm === 'yes' // Archiving or deletion
    };
    mutate({ id, payload });
  };

  return (
    <>
      {/* Conditional rendering based on user count or step */}
      {(roleName?.userCount === 0 || step === 1) && (
        <WithOutUserRole
          handleClose={handleClose}
          setIsConfirm={setIsConfirm}
          handleDeleteRole={handleDeleteRole}
          deleteLoading={deleteLoading}
          isConfirm={isConfirm}
          setStep={setStep}
          step={step}
        />
      )}
      {roleName?.userCount > 0 && step === 0 && (
        <UserWithRoles
          id={id}
          setUserRoleMapping={setUserRoleMapping}
          roleName={roleName}
          handleClose={handleClose}
          userRoleMapping={userRoleMapping}
          setStep={setStep}
        />
      )}
    </>
  );
}
