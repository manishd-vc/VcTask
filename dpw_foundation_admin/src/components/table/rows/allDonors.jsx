import PropTypes from 'prop-types';

// mui
import { Button, Chip, Skeleton, TableCell, TableRow } from '@mui/material';
import { donorStatusColorSchema } from 'src/utils/util';

// component

AllDonors.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired
};

export default function AllDonors({ isLoading, row }) {
  const { masterData } = useSelector((state) => state?.common);
  return (
    <TableRow hover key={row?.id}>
      <TableCell>D-005</TableCell>
      <TableCell>01/10/2024 03:00:00</TableCell>
      <TableCell>Eye Check up Program</TableCell>
      <TableCell>10,000</TableCell>
      <TableCell>-</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            color={donorStatusColorSchema[row?.status]}
            label={getLabelByCode(masterData, 'dpw_foundation_donor_status', row?.status)}
            size="small"
          />
        )}
      </TableCell>
      <TableCell>
        <Button variant="contained">View</Button>
      </TableCell>
    </TableRow>
  );
}
