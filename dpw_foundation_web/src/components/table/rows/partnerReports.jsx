import { IconButton, TableCell, TableRow, Tooltip, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { DeleteIconRed, EditIcon, ViewIcon } from 'src/components/icons';
import { fDateShortMonth } from 'src/utils/formatTime';
import TableStyle from '../table.styles';

PartnerReports.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    reportPeriodFrom: PropTypes.string,
    reportPeriodTo: PropTypes.string,
    reportType: PropTypes.string,
    reportTitle: PropTypes.string,
    submissionDate: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onView: PropTypes.func
};

export default function PartnerReports({ row, onEdit, onDelete, onView }) {
  const theme = useTheme();
  const style = TableStyle(theme);
  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row.reportPeriodFrom ? fDateShortMonth(row.reportPeriodFrom, true) : '-'}</TableCell>
      <TableCell>{row.reportPeriodTo ? fDateShortMonth(row.reportPeriodTo, true) : '-'}</TableCell>
      <TableCell>{row.reportType || '-'}</TableCell>
      <TableCell sx={{ ...style.textTurncate }}>{row.reportTitle || '-'}</TableCell>
      <TableCell>{row.submissionDate ? fDateShortMonth(row.submissionDate, true) : '-'}</TableCell>
      <TableCell>
        <Tooltip title="Edit" arrow>
          <IconButton size="small" onClick={() => onEdit(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="View" arrow>
          <IconButton size="small" onClick={() => onView && onView(row)}>
            <ViewIcon />
          </IconButton>
        </Tooltip>
        {onDelete && (
          <Tooltip title="Delete" arrow>
            <IconButton size="small" onClick={() => onDelete(row)}>
              <DeleteIconRed />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
}
