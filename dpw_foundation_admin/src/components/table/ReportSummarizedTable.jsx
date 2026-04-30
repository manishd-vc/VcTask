'use client';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import Scrollbar from '../Scrollbar';

const ReportSummarizedTable = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Extract column names from the first object (excluding the first key which is typically the row identifier)
  const allKeys = Object.keys(data[0]);
  const firstKey = allKeys[0]; // Row identifier (e.g., "Sector")
  const numericKeys = allKeys.slice(1); // Numeric columns

  // Calculate column totals
  const columnTotals = numericKeys.reduce((totals, key) => {
    totals[key] = data.reduce((sum, row) => sum + (row[key] || 0), 0);
    return totals;
  }, {});

  // Calculate row totals
  const dataWithRowTotals = data.map((row) => ({
    ...row,
    Total: numericKeys.reduce((sum, key) => sum + (row[key] || 0), 0)
  }));

  // Calculate grand total
  const grandTotal = Object.values(columnTotals).reduce((sum, value) => sum + value, 0);

  return (
    <TableContainer component={Paper} sx={{ width: '100%' }}>
      <Scrollbar>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{firstKey}</TableCell>
              {numericKeys.map((key) => (
                <TableCell key={key} align="center">
                  {key}
                </TableCell>
              ))}
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataWithRowTotals.map((row, index) => (
              <TableRow key={row[firstKey]}>
                <TableCell>{row[firstKey]}</TableCell>
                {numericKeys.map((key) => (
                  <TableCell key={key} align="center">
                    {row[key] || 0}
                  </TableCell>
                ))}
                <TableCell align="center">{row.Total}</TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow>
              <TableCell>Total</TableCell>
              {numericKeys.map((key) => (
                <TableCell key={key} align="center">
                  {columnTotals[key]}
                </TableCell>
              ))}
              <TableCell align="center">{grandTotal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
};

ReportSummarizedTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ReportSummarizedTable;
