import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import DatePickers from 'src/components/datePicker';
import Pagination from 'src/components/pagination';
import Scrollbar from 'src/components/Scrollbar';
import Search from 'src/components/search';
import TableHead from 'src/components/table/tableHead';

export default function CustomTable({
  filters = [],
  headData,
  data,
  isLoading,
  row: Component,
  totalCountText,
  allCount,
  isSearch,
  isDatePicker,
  setFromDate,
  setToDate,
  dateValues,
  isExport,
  onExport,
  ...rest
}) {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState({});
  const queryString = searchParams.toString();

  const handleChange = (param, val) => {
    setState({ ...state, [param]: val });
    push(`${pathname}?` + createQueryString(param, val));
  };

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      params.delete('page');
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const params = new URLSearchParams('?' + queryString);
    const paramsObject = {};
    for (const [key, value] of params.entries()) {
      paramsObject[key] = value;
    }
    setState({ ...state, ...paramsObject });
  }, []);

  return (
    <>
      {(isSearch || filters.length > 0 || isDatePicker) && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container columnSpacing={2} rowSpacing={2} alignItems="flex-end">
            <Grid item xs={12} lg={4}>
              {isSearch ? <Search /> : null}
            </Grid>
            <Grid item xs={12} lg={8}>
              <Grid container columnSpacing={2} rowSpacing={2} alignItems="flex-end">
                {filters.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.param}>
                    <TextField
                      id={`textfield-${item.param}`}
                      label={`Filter by ${item.name}`}
                      value={state[item.param] ?? ''}
                      onChange={(e) => handleChange(item.param, e.target.value)}
                      select
                      fullWidth
                      variant="standard"
                    >
                      <MenuItem value="">None</MenuItem>
                      {item?.data?.map((v) => (
                        <MenuItem value={v?.id} key={v?.id}>
                          {v?.name || v.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                ))}
                {isDatePicker && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <DatePickers
                        label={'Select From Date'}
                        inputFormat={'yyyy-MM-dd'}
                        onChange={(newFromDate) => {
                          setFromDate(newFromDate);
                          if (newFromDate) setToDate(new Date());
                        }}
                        value={dateValues[0]}
                        handleClear={() => {
                          setFromDate(null);
                          setToDate(null);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DatePickers
                        label={'Select To Date'}
                        inputFormat={'yyyy-MM-dd'}
                        onChange={setToDate}
                        value={dateValues[1]}
                        minDate={dateValues[0] || new Date()}
                        disabled={!dateValues[0]}
                        handleClear={() => setToDate(null)}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
      <Paper sx={{ pt: 2, px: 2, pb: 0 }}>
        <TableContainer>
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Box sx={{ minWidth: 150 }}>
              {totalCountText && (
                <Typography variant="subHeader" component="h6" color="primary.main">
                  {totalCountText} {allCount && `(${allCount})`}
                </Typography>
              )}
            </Box>
            {isExport && (
              <Button variant="outlinedWhite" size="small" onClick={onExport}>
                Export
              </Button>
            )}
          </Stack>
          <Scrollbar>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead headData={headData} />
              <TableBody>
                {!isLoading && data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headData.length} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No data found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data?.map((item) => (
                    <Component key={`data-key_${item.id}`} row={item} isLoading={isLoading} {...rest} />
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <Pagination data={data} />
      </Paper>
    </>
  );
}
