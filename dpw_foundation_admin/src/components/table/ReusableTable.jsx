import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import Scrollbar from '../Scrollbar';

const ReusableTable = ({ headers, children }) => {
  return (
    <TableContainer component="div" sx={{ width: '100%' }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={header.label}>{header.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
};

ReusableTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ReusableTable;
