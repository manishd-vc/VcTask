import {
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import Scrollbar from 'src/components/Scrollbar';
import { setAccessControl } from 'src/redux/slices/roles';
import * as api from 'src/services';

/**
 * AccessControl Component
 *
 * This component renders a table to manage access control permissions for different modules.
 * It allows toggling permissions such as "View", "Edit", "Delete", "Add", and "Approve/Reject/Need more info".
 *
 * @param {Object} props - Component props
 * @param {Array} props.updateData - Data used when editing an existing role
 * @param {boolean} props.isEdit - Flag to indicate if the component is in edit mode
 * @returns {JSX.Element} - Rendered AccessControl component
 */
const AccessControl = ({ updateData, isEdit }) => {
  const { data: moduleNames = [] } = useQuery(['modules'], api.getUserModule); // Fetch module names from API
  const dispatch = useDispatch();

  // Permissions configuration
  const accessData = [
    { name: 'View', type: 'toggle' },
    { name: 'Edit', type: 'toggle' },
    { name: 'Delete', type: 'toggle' },
    { name: 'Add', type: 'toggle' },
    { name: 'Approve/Reject/Need more info', type: 'toggle' }
  ];

  // State for tracking permissions
  const [permissions, setPermissions] = useState([]);

  // Initialize permissions based on module data and edit mode
  useEffect(() => {
    if (moduleNames.length > 0) {
      const newPermissions = moduleNames.map((module) => {
        if (isEdit) {
          const existingModule = updateData?.find((data) => data?.moduleId === module?.id);
          return existingModule
            ? [
                existingModule?.view || false,
                existingModule?.edit || false,
                existingModule?.delete || false,
                existingModule?.add || false,
                existingModule?.approve || false
              ]
            : Array(module?.defaultConfig?.length).fill(false);
        }
        return Array(module?.defaultConfig?.length).fill(false);
      });

      setPermissions(newPermissions);
    }
  }, [moduleNames, updateData?.length, isEdit]);

  /**
   * Handles toggling permissions for a specific module and permission type.
   *
   * @param {number} moduleIndex - Index of the module in the permissions array
   * @param {number} permissionIndex - Index of the permission type
   */
  const handleToggle = (moduleIndex, permissionIndex) => {
    if (
      moduleIndex >= 0 &&
      moduleIndex < permissions.length &&
      permissionIndex >= 0 &&
      permissionIndex < accessData.length
    ) {
      const updatedPermissions = [...permissions];

      // Manage dependencies between permissions
      if (permissionIndex !== 0) {
        if (!updatedPermissions[moduleIndex][permissionIndex]) {
          updatedPermissions[moduleIndex][0] = true; // Enable "View" if other permissions are toggled
        }
        updatedPermissions[moduleIndex][permissionIndex] = !updatedPermissions[moduleIndex][permissionIndex];
      } else {
        const otherPermissionsActive = updatedPermissions[moduleIndex].slice(1).some((p) => p);
        if (!otherPermissionsActive) {
          updatedPermissions[moduleIndex][0] = !updatedPermissions[moduleIndex][0];
        }
      }

      setPermissions(updatedPermissions);
    } else {
      console.error(`Invalid indices: moduleIndex=${moduleIndex}, permissionIndex=${permissionIndex}`);
    }
  };

  // Dispatch updated permissions to the Redux store
  useEffect(() => {
    if (moduleNames.length > 0) {
      const payload = {
        roleModule: moduleNames.map((module, moduleIndex) => ({
          moduleId: module.id,
          view: permissions[moduleIndex]?.[0] || false,
          edit: permissions[moduleIndex]?.[1] || false,
          delete: permissions[moduleIndex]?.[2] || false,
          add: permissions[moduleIndex]?.[3] || false,
          approve: permissions[moduleIndex]?.[4] || false
        }))
      };
      dispatch(setAccessControl(payload));
    }
  }, [permissions, moduleNames]);

  return (
    <TableContainer component="div" sx={{ width: '100%' }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ maxWidth: '30%', width: '30%' }}>Module Name</TableCell>
              {accessData.map((permission) => (
                <TableCell key={permission.name}>{permission.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          {moduleNames.map((module, moduleIndex) => (
            <TableBody key={`module_${module?.name}`}>
              <TableRow>
                <TableCell>{module.name}</TableCell>
                {module?.defaultConfig.map((permission, permissionIndex) => (
                  <TableCell key={`permission_${permission?.applicable}`}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions[moduleIndex]?.[permissionIndex] || false}
                          onChange={() => handleToggle(moduleIndex, permissionIndex)}
                          disabled={
                            !permission?.applicable ||
                            (permissionIndex === 0 && permissions[moduleIndex]?.slice(1).some((p) => p))
                          }
                        />
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </Scrollbar>
    </TableContainer>
  );
};

AccessControl.propTypes = {
  // 'updateData' is expected to be an object, possibly with a specific shape.
  // You can define the shape if you know the structure of the object.
  updateData: PropTypes.array.isRequired,

  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};

export default AccessControl;
