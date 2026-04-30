import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import Pagination from '../pagination.jsx';
import Scrollbar from '../Scrollbar.jsx';
import TableStyle from './table.styles';

ReportTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  paginationData: PropTypes.shape({
    totalElements: PropTypes.number,
    page: PropTypes.number,
    size: PropTypes.number
  }),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  stickyHeader: PropTypes.bool,
  showPagination: PropTypes.bool,
  title: PropTypes.string,
  totalCount: PropTypes.number,
  autoHeight: PropTypes.bool,
  onExport: PropTypes.func,
  isExporting: PropTypes.bool
};

export default function ReportTable({
  headers,
  data,
  paginationData,
  maxHeight = 400,
  stickyHeader = true,
  showPagination = false,
  title = 'Report Results',
  totalCount,
  autoHeight = false,
  onExport,
  isExporting = false,
  ...other
}) {
  const theme = useTheme();
  const style = TableStyle(theme);

  return (
    <Paper sx={{ pt: 2, px: 2, pb: 0 }}>
      <TableContainer component="div">
        <Stack
          direction="row"
          spacing={3}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Box sx={{ minWidth: 150 }}>
            <Typography variant="subHeader" component="h6" color="primary.main">
              {title} {totalCount !== undefined && `(${totalCount})`}
            </Typography>
          </Box>
          {onExport && (
            <Button variant="outlinedWhite" size="small" onClick={onExport} disabled={isExporting || data.length === 0}>
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          )}
        </Stack>
        <Scrollbar>
          <Table stickyHeader={stickyHeader} size="small" sx={{ minWidth: 650 }} {...other}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header.code}
                    sx={{
                      fontWeight: 500,
                      ...(stickyHeader && style.tableHeadSticky)
                    }}
                  >
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => {
                  const rowId = `row-${index}`;
                  return (
                    <TableRow key={rowId} hover>
                      {headers.map((header) => {
                        const value = row[header.code.replace('.', '_')];
                        const displayValue = value || '-';
                        const shouldTruncate = displayValue.length > 80;
                        const truncatedValue = shouldTruncate ? `${displayValue.substring(0, 80)}...` : displayValue;

                        return (
                          <TableCell key={`${rowId}-${header.code}`}>
                            {shouldTruncate ? (
                              <Tooltip
                                title={displayValue}
                                arrow
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      maxHeight: '200px',
                                      overflow: 'auto'
                                    }
                                  }
                                }}
                              >
                                <span>{truncatedValue}</span>
                              </Tooltip>
                            ) : (
                              displayValue
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} align="center" sx={{ py: 3 }}>
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      {showPagination && paginationData && <Pagination data={paginationData} />}
    </Paper>
  );
}
