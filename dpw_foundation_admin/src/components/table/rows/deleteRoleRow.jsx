'use client';

import { Chip, FormControl, MenuItem, Select, Skeleton, TableCell, TableRow, useTheme } from '@mui/material';

import PropTypes from 'prop-types';
import TableStyle from '../table.styles';

DeleteRoleRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    employeeId: PropTypes.string.isRequired,
    cover: PropTypes.shape({ url: PropTypes.string.isRequired }),
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    totalOrders: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  setUserRoleMapping: PropTypes.func,
  userRoleMapping: PropTypes.array,
  roleData: PropTypes.array
};

export default function DeleteRoleRow({ isLoading, row, roleData, setUserRoleMapping, userRoleMapping }) {
  const renderSkeleton = (width) => <Skeleton variant="text" width={width} />;

  const handleRoleChange = (rowId, newRole) => {
    const existingMappingIndex = userRoleMapping.findIndex((r) => r.userId === rowId);

    if (existingMappingIndex !== -1) {
      const updatedMapping = [...userRoleMapping];
      updatedMapping[existingMappingIndex].targetRoleId = newRole;
      setUserRoleMapping(updatedMapping);
    } else {
      setUserRoleMapping([...userRoleMapping, { userId: rowId, targetRoleId: newRole }]);
    }
  };

  const selectedRoleId = userRoleMapping?.find((r) => r.userId === row?.id)?.targetRoleId || '';

  const theme = useTheme();
  const style = TableStyle(theme);
  return (
    <TableRow hover key={row?.id}>
      <TableCell>{isLoading ? renderSkeleton() : row?.employeeId || '-'}</TableCell>
      <TableCell>{isLoading ? renderSkeleton() : row?.firstName || '-'}</TableCell>
      <TableCell>{isLoading ? renderSkeleton() : row?.lastName || '-'}</TableCell>
      <TableCell>
        {isLoading ? renderSkeleton() : <Chip color="success" label={row?.status} size="small" /> || '-'}
      </TableCell>
      <TableCell sx={{ ...style.textTurncate, display: 'revert' }}>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <FormControl variant="standard" fullWidth>
            <Select
              value={selectedRoleId}
              onChange={(e) => handleRoleChange(row?.id, e.target.value)}
              displayEmpty
              renderValue={(selected) => (selected ? roleData?.find((r) => r.id === selected)?.name : 'Select Role')}
            >
              {roleData?.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </TableCell>
    </TableRow>
  );
}
