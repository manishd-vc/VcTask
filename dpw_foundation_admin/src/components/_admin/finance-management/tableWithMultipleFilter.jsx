'use client';
import { useRouter } from 'next-nprogress-bar';
import { usePathname, useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import * as api from 'src/services';
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

import { useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import LoadingFallback from 'src/components/loadingFallback';
import Pagination from 'src/components/pagination';
import Scrollbar from 'src/components/Scrollbar';
import Search from 'src/components/search';
import TableHead from 'src/components/table/tableHead';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { getLocaleDateString } from 'src/utils/formatTime';

TableWithMultipleFilter.propTypes = {
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

export default function TableWithMultipleFilter({ ...props }) {
  const {
    headData,
    data,
    className,
    isLoading,
    row,
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

  const [state, setState] = useState({});
  const [extendedFiltersTemp, setExtendedFiltersTemp] = useState({});
  const searchParams = useSearchParams();
  const { masterData } = useSelector((state) => state?.common);
  const showExtendedFilters = useSelector((state) => state?.finance?.showFilter);
  const prevShowExtendedFiltersRef = useRef(showExtendedFilters);

  const { data: countryData } = useQuery(['getCountry'], () => api.getCountry());

  const { data: campaignListingData } = useQuery(['getCampaignListing'], () => api.getCampaignListing());

  const statusData =
    getLabelObject(masterData, 'dpw_foundation_donor_status')?.values?.map((item) => ({
      id: item.code,
      title: item.label
    })) || [];

  const projectData = campaignListingData?.data;

  const donationTypeData =
    getLabelObject(masterData, 'dpw_foundation_donation_type')?.values?.map((item) => ({
      id: item.code,
      title: item.label
    })) || [];

  const donorTypeData =
    getLabelObject(masterData, 'dpw_foundation_donor_type')?.values?.map((item) => ({
      id: item.code,
      title: item.label
    })) || [];

  const handleChange = (param, val) => {
    setState({ ...state, [param]: val });
    push(`${pathname}?` + createQueryString(param, val));
  };

  const handleExtendedFilterChange = (param, val) => {
    setExtendedFiltersTemp({ ...extendedFiltersTemp, [param]: val });
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    const extendedFilterParams = [
      'id',
      'donatedBy',
      'project',
      'donationType',
      'donationAmount',
      'donorType',
      'iacadPermitNumber',
      'receiptVoucher',
      'country'
    ];

    // Apply all extended filter values to URL
    extendedFilterParams.forEach((param) => {
      if (extendedFiltersTemp[param]) {
        params.set(param, extendedFiltersTemp[param]);
      } else {
        params.delete(param);
      }
    });

    // Reset to first page when applying filters
    params.delete('page');

    // Update state and navigate
    setState({ ...state, ...extendedFiltersTemp });
    push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    const extendedFilterParams = [
      'id',
      'donatedBy',
      'project',
      'donationType',
      'donationAmount',
      'donorType',
      'iacadPermitNumber',
      'receiptVoucher',
      'country'
    ];

    // Clear all extended filter params from URL
    extendedFilterParams.forEach((param) => {
      params.delete(param);
    });

    // Reset to first page
    params.delete('page');

    // Clear temp state and main state
    const clearedFilters = {};
    extendedFilterParams.forEach((param) => {
      clearedFilters[param] = '';
    });
    setExtendedFiltersTemp(clearedFilters);

    setState((prevState) => {
      const newState = { ...prevState };
      extendedFilterParams.forEach((param) => {
        delete newState[param];
      });
      return newState;
    });

    // Navigate with cleaned URL
    const newQueryString = params.toString();
    push(`${pathname}${newQueryString ? '?' + newQueryString : ''}`);
  }, [searchParams, pathname, push]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      params.delete('page');
      return params.toString();
    },
    [searchParams]
  );

  // Sync filters from URL on initial mount
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const paramsObject = {};
    const extendedFilterParams = [
      'id',
      'donatedBy',
      'project',
      'donationType',
      'donationAmount',
      'donorType',
      'iacadPermitNumber',
      'receiptVoucher',
      'country'
    ];
    const extendedFiltersObject = {};

    for (const [key, value] of params.entries()) {
      paramsObject[key] = value;
      if (extendedFilterParams.includes(key)) {
        extendedFiltersObject[key] = value;
      }
    }

    setState(paramsObject);
    setExtendedFiltersTemp(extendedFiltersObject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-clear filters when panel is hidden
  useEffect(() => {
    const prevValue = prevShowExtendedFiltersRef.current;

    // Only trigger when transitioning from true to false
    if (prevValue === true && showExtendedFilters === false) {
      handleClearFilters();
    }

    // Update ref for next comparison
    prevShowExtendedFiltersRef.current = showExtendedFilters;
  }, [showExtendedFilters, handleClearFilters]);

  const Component = row;

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container columnSpacing={2} rowSpacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Search />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              id={`textfield-status`}
              label={`Filter by Status`}
              value={state.status ?? ''}
              onChange={(e) => handleChange('status', e.target.value)}
              select
              fullWidth
              variant="standard"
              sx={{ '.MuiSelect-select': { paddingRight: '35px!important' } }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                      overflowY: 'auto'
                    }
                  }
                }
              }}
            >
              <MenuItem value="">None</MenuItem>
              {statusData?.map((v) => (
                <MenuItem value={v?.id} key={v?.id}>
                  {v?.name || v.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
          {showExtendedFilters && (
            <>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`id`}
                  label={`ID`}
                  value={extendedFiltersTemp.id ?? ''}
                  onChange={(e) => handleExtendedFilterChange('id', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`donatedBy`}
                  label={`Donated By`}
                  value={extendedFiltersTemp.donatedBy ?? ''}
                  onChange={(e) => handleExtendedFilterChange('donatedBy', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`textfield-project`}
                  label={`Select Project`}
                  value={extendedFiltersTemp.project ?? ''}
                  onChange={(e) => handleExtendedFilterChange('project', e.target.value)}
                  select
                  fullWidth
                  variant="standard"
                  sx={{ '.MuiSelect-select': { paddingRight: '35px!important' } }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                          overflowY: 'auto'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {projectData?.map((v) => (
                    <MenuItem value={v?.campaignTitle} key={v?.campaignId}>
                      {v?.campaignTitle || ''}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`textfield-donationType`}
                  label={`Donation Type`}
                  value={extendedFiltersTemp.donationType ?? ''}
                  onChange={(e) => handleExtendedFilterChange('donationType', e.target.value)}
                  select
                  fullWidth
                  variant="standard"
                  sx={{ '.MuiSelect-select': { paddingRight: '35px!important' } }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                          overflowY: 'auto'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {donationTypeData?.map((v) => (
                    <MenuItem value={v?.id} key={v?.id}>
                      {v?.name || v.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`donationAmount`}
                  label={`Donation Amount`}
                  value={extendedFiltersTemp.donationAmount ?? ''}
                  onChange={(e) => handleExtendedFilterChange('donationAmount', e.target.value)}
                  fullWidth
                  variant="standard"
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`textfield-donorType`}
                  label={`Donor Type`}
                  value={extendedFiltersTemp.donorType ?? ''}
                  onChange={(e) => handleExtendedFilterChange('donorType', e.target.value)}
                  select
                  fullWidth
                  variant="standard"
                  sx={{ '.MuiSelect-select': { paddingRight: '35px!important' } }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                          overflowY: 'auto'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {donorTypeData?.map((v) => (
                    <MenuItem value={v?.id} key={v?.id}>
                      {v?.name || v.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`iacadPermitNumber`}
                  label={`IACAD Permit Number`}
                  value={extendedFiltersTemp.iacadPermitNumber ?? ''}
                  onChange={(e) => handleExtendedFilterChange('iacadPermitNumber', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`receiptVoucher`}
                  label={`RV Number`}
                  value={extendedFiltersTemp.receiptVoucher ?? ''}
                  onChange={(e) => handleExtendedFilterChange('receiptVoucher', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id={`textfield-country`}
                  label={`Country`}
                  value={extendedFiltersTemp.country ?? ''}
                  onChange={(e) => handleExtendedFilterChange('country', e.target.value)}
                  select
                  fullWidth
                  variant="standard"
                  sx={{ '.MuiSelect-select': { paddingRight: '35px!important' } }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                          overflowY: 'auto'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {countryData?.map((v) => (
                    <MenuItem value={v?.code} key={v?.id}>
                      {v?.label || ''}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </>
          )}
          {/* Clear Filter and Apply Buttons */}
          {showExtendedFilters && (
            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
              <Button variant="outlined" size="small" onClick={handleClearFilters}>
                Clear Filter
              </Button>
              <Button variant="contained" size="small" onClick={handleApplyFilters}>
                Apply
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
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
                      <Component
                        key={item?.id + item?.donationPledgeId || index}
                        row={item}
                        isLoading={isLoading}
                        index={index}
                        {...rest}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <Pagination data={data} />
        </Paper>
      )}
    </>
  );
}
