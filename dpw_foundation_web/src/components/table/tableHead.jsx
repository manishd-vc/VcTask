import PropTypes from 'prop-types';

// mui
import { TableCell, TableHead, TableRow } from '@mui/material';

/**
 * TableHeadMain component - A table header component that dynamically renders the header row
 * based on the provided `headData` prop. It generates `TableCell` elements for each header.
 *
 * @param {object} props - The properties passed to the component.
 * @param {Array} props.headData - An array of objects representing the table header cells.
 * Each object should have a `label` (the text to display) and an optional `width` (to set the column width).
 *
 * @returns {JSX.Element} The rendered table head with dynamic columns.
 */
TableHeadMain.propTypes = {
  headData: PropTypes.array
};

export default function TableHeadMain({ ...props }) {
  const { headData } = props;
  return (
    <TableHead>
      <TableRow>
        {headData.map((headCell) => (
          <TableCell
            key={`data-key_${headCell.label}`}
            sx={{
              maxWidth: headCell.width
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
