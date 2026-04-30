import { Skeleton, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { fDateTimeStandard } from 'src/utils/formatTime';

/**
 * LogHistoryListRow Component displays a row of log history data in a table.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isLoading - Indicates if the data is loading.
 * @param {Object} props.row - The row data to be displayed.
 * @returns {JSX.Element} The LogHistoryListRow component.
 */
LogHistoryListRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ipAddress: PropTypes.string.isRequired,
    loginTime: PropTypes.string.isRequired,
    logoutTime: PropTypes.string.isRequired,
    device: PropTypes.string.isRequired
  }).isRequired
};

export default function LogHistoryListRow({ isLoading, row }) {
  const renderSkeleton = (width) => <Skeleton variant="text" width={width} />;

  const renderIpAddress = isLoading ? renderSkeleton(120) : row?.ipAddress || '-';
  let activityTime;

  if (isLoading) {
    activityTime = renderSkeleton();
  } else if (row?.activityTime) {
    activityTime = fDateTimeStandard(row?.activityTime);
  } else {
    activityTime = '-';
  }

  const renderDevice = isLoading ? renderSkeleton() : row?.deviceUsed || '-';
  const browserInfo = isLoading ? renderSkeleton() : row?.browserInfo || '-';
  const actionType = isLoading ? renderSkeleton() : row?.actionType || '-';

  return (
    <TableRow hover key={row?.id}>
      <TableCell component="th" scope="row">
        <Typography variant="body1" noWrap sx={{ textTransform: 'capitalize' }}>
          {renderIpAddress}
        </Typography>
      </TableCell>
      <TableCell>{renderDevice}</TableCell>
      <TableCell>{browserInfo}</TableCell>

      <TableCell style={{ minWidth: 80 }}>{actionType}</TableCell>
      <TableCell style={{ minWidth: 160 }}>{activityTime}</TableCell>
    </TableRow>
  );
}
