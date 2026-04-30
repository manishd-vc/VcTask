import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import Scrollbar from 'src/components/Scrollbar';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';

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
const AccessControlNew = ({ selectedPermissions, setSelectedPermissions }) => {
  const { masterData } = useSelector((state) => state?.common);
  const moduleLabels = getLabelObject(masterData, 'dpw_foundation_module_label');

  const { data: rolePermissionList = [] } = useQuery(['rolePermissionList'], api.rolePermissionList); // Fetch module names from API

  const combinedData = rolePermissionList?.map((module) => {
    const matchedModule = moduleLabels?.values?.find((label) => label?.code === module?.moduleCode);
    return {
      ...module,
      moduleName: matchedModule?.label
    };
  });

  const handleChange = (moduleId, permissionId) => {
    setSelectedPermissions((prev) => {
      const existingIndex = prev.findIndex((perm) => perm.moduleId === moduleId && perm.permissionId === permissionId);
      if (existingIndex >= 0) {
        // Remove if already selected
        return prev.filter((perm) => !(perm.moduleId === moduleId && perm.permissionId === permissionId));
      } else {
        // Add if not selected
        return [...prev, { moduleId, permissionId }];
      }
    });
  };

  return (
    <TableContainer component="div" sx={{ width: '100%' }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ maxWidth: { xs: '120px', sm: '140px', md: '190px', lg: '205px' } }}>
                Module Name
              </TableCell>
              <TableCell>
                <Grid container>
                  <Grid item xs={12} sm={3} sx={{ px: 1 }} textAlign="left">
                    Permissions
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          {combinedData.map((module) => (
            <TableBody key={module?.moduleCode}>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'inherit' }}>{module.moduleName}</TableCell>
                <TableCell>
                  <Grid container>
                    {module?.permissions.map((permission) => (
                      <Grid item xs={12} sm={12} md={6} xl={4} key={permission?.id} sx={{ p: 1 }} textAlign="left">
                        <FormControlLabel
                          control={
                            <Tooltip
                              title={
                                <Box
                                  sx={{
                                    '& ul': { paddingLeft: (theme) => theme.spacing(2.5) }
                                  }}
                                  dangerouslySetInnerHTML={{ __html: permission?.description || '' }}
                                />
                              }
                              arrow
                            >
                              <Checkbox
                                checked={selectedPermissions.some(
                                  (perm) => perm.moduleId === permission.moduleId && perm.permissionId === permission.id
                                )}
                                onChange={() => handleChange(permission?.moduleId, permission?.id)}
                              />
                            </Tooltip>
                          }
                          label={permission?.label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </Scrollbar>
    </TableContainer>
  );
};

AccessControlNew.propTypes = {
  // 'updateData' is expected to be an object, possibly with a specific shape.
  // You can define the shape if you know the structure of the object.
  updateData: PropTypes.array.isRequired,

  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};

export default AccessControlNew;
