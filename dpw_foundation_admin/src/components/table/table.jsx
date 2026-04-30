'use client';
import { useRouter } from 'next-nprogress-bar';
import { usePathname, useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

// mui
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography
} from '@mui/material';

// components
import Pagination from 'src/components/pagination';
import Search from 'src/components/search';
import { getLocaleDateString } from 'src/utils/formatTime';
import DatePickers from '../datePicker';
import LoadingFallback from '../loadingFallback';
import Scrollbar from '../Scrollbar';
import TableHead from './tableHead';

CustomTable.propTypes = {
  headData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      alignRight: PropTypes.bool
    })
  ).isRequired,
  data: PropTypes.shape({
    data: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    size: PropTypes.number
  }).isRequired,
  className: PropTypes.string,
  setFromDate: PropTypes.string,
  setToDate: PropTypes.string,
  isDatePicker: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isExport: PropTypes.bool.isRequired,
  mobileRow: PropTypes.elementType,
  dateValues: PropTypes.array,
  allCount: PropTypes.string,
  totalCountText: PropTypes.string,
  row: PropTypes.elementType.isRequired,
  filters: PropTypes.arr,
  isSearch: PropTypes.bool,
  onExport: PropTypes.func
};
export default function CustomTable({ filters = [], isPagination = true, ...props }) {
  const {
    headData,
    data,
    className,
    isLoading,
    isSearch,
    row,
    isDatePicker,
    setFromDate,
    setToDate,
    dateValues,
    allCount,
    totalCountText,
    isExport,
    onExport,
    maxDate,
    ...rest
  } = props;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Component = row;

  return (
    <>
      {(isSearch || filters?.length > 0 || isDatePicker) && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container columnSpacing={2} rowSpacing={2} alignItems="flex-end">
            <Grid item xs={12} lg={4}>
              {isSearch ? <Search /> : null}{' '}
            </Grid>
            <Grid item xs={12} lg={8}>
              <Grid container columnSpacing={2} rowSpacing={2} alignItems="flex-end">
                {filters?.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.param}>
                    <TextField
                      id={`textfield-${item.param}`}
                      label={`Filter by ${item.name}`}
                      value={state[item.param] ?? ''}
                      onChange={(e) => handleChange(item.param, e.target.value)}
                      select
                      fullWidth
                      variant="standard"
                      sx={{ '.MuiSelect-select': { paddingRight: '35px!important' } }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              maxHeight: 400, // Restrict dropdown height to 200px
                              overflowY: 'auto' // Enable vertical scrolling for overflow
                            }
                          }
                        }
                      }}
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
                        inputFormat={getLocaleDateString(false)}
                        maxDate={maxDate}
                        onChange={(newFromDate) => {
                          setFromDate(newFromDate);
                          if (newFromDate) {
                            setToDate(new Date());
                          }
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
                        inputFormat={getLocaleDateString(false)}
                        onChange={setToDate}
                        value={dateValues[1]}
                        minDate={dateValues[0] || new Date()}
                        disabled={!dateValues[0]}
                        handleClear={() => {
                          setToDate(null);
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
      {isLoading && <LoadingFallback />}

      {!isLoading && data?.data?.length === 0 && (
        <>
          <Divider sx={{ mt: 1 }} />
          <Stack sx={{ p: 2 }} textAlign="center">
            No data available
          </Stack>
        </>
      )}
      {!isLoading && data?.data?.length > 0 && (
        <Paper variant={className || undefined} sx={{ pt: 2, px: 2, pb: 2 }}>
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
                {totalCountText && allCount && (
                  <Typography variant="subHeader" component="h6" color="primary.main">
                    {totalCountText} ({allCount})
                  </Typography>
                )}
                {totalCountText && !allCount && (
                  <Typography variant="subHeader" component="h6" color="primary.main">
                    {totalCountText}
                  </Typography>
                )}
              </Box>
              {isExport && (
                <Button variant="outlinedWhite" size="small" onClick={onExport} style={{ marginTop: 0 }}>
                  Export
                </Button>
              )}
            </Stack>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead headData={headData} />

                <TableBody>
                  {(isLoading ? Array.from(new Array(6)) : data?.data)?.map((item, index) => {
                    return (
                      <Component key={item?.id || index} row={item} isLoading={isLoading} index={index} {...rest} />
                    );
                  })}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          {isPagination && <Pagination data={data} />}
        </Paper>
      )}
    </>
  );
}
