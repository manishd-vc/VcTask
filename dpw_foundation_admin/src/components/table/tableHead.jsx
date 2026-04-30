import PropTypes from 'prop-types';

// mui
import { TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import TableStyle from './table.styles';

TableHeadMain.propTypes = {
  headData: PropTypes.array
};

export default function TableHeadMain({ ...props }) {
  const { headData } = props;
  const theme = useTheme();
  const style = TableStyle(theme);

  return (
    <TableHead>
      <TableRow>
        {headData.map((headCell) => (
          <TableCell key={headCell.label} sx={{ maxWidth: headCell.width, ...style.tableHeadSticky }}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
