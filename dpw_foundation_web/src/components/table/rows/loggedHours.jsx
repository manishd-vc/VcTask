'use client';
import { Chip, Skeleton, TableCell, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale, formatTime } from 'src/utils/formatTime';

LoggedHoursRows.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    milestoneId: PropTypes.string,
    milestoneDescription: PropTypes.string,
    checkInTime: PropTypes.string,
    checkOutTime: PropTypes.string,
    logHours: PropTypes.string,
    lastUpdatedBy: PropTypes.string,
    lastUpdatedOn: PropTypes.string,
    status: PropTypes.string
  }).isRequired
};

export default function LoggedHoursRows({ isLoading, row }) {
  const { masterData } = useSelector((state) => state?.common);

  const getStatusColor = (status) => {
    const statusColors = {
      APPROVED: 'success',
      SUBMITTED: 'warning',
      REJECTED: 'error'
    };
    return statusColors[status] || 'default';
  };

  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row?.milestoneId || '-'}</TableCell>
      <TableCell>{row?.milestoneDescription || '-'}</TableCell>
      <TableCell>{row?.checkInTime ? formatTime(row?.checkInTime) : '-'}</TableCell>
      <TableCell>{row?.checkOutTime ? formatTime(row?.checkOutTime) : '-'}</TableCell>
      <TableCell>{row?.logHours || '-'}</TableCell>
      <TableCell>{row?.lastUpdatedBy || '-'}</TableCell>
      <TableCell>
        {row?.lastUpdatedOn ? `${fDateWithLocale(row?.lastUpdatedOn)} ${formatTime(row?.lastUpdatedOn)}` : '-'}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            color={getStatusColor(row?.status)}
            label={getLabelByCode(masterData, 'dpwf_log_activity_status', row?.status) || row?.status}
            size="small"
          />
        )}
      </TableCell>
    </TableRow>
  );
}
