'use client';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import React, { Suspense } from 'react';
import { FilterIcon } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import { useDispatch, useSelector } from 'src/redux';
import { setShowFilter } from 'src/redux/slices/finance';
const FinanceDonations = React.lazy(() => import('./financeDonations'));

export default function FinanceDonationsList() {
  const dispatch = useDispatch();
  const showFilter = useSelector((state) => state?.finance?.showFilter);
  const handleFilter = () => {
    dispatch(setShowFilter(!showFilter));
  };
  return (
    <>
      <Stack
        mb={{ xs: 2, sm: 3, md: 4 }}
        flexDirection={{ xs: 'row', sm: 'row', md: 'row' }}
        sx={{ width: '100%' }}
        justifyContent="space-between"
      >
        <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase' }}>
          Donations
        </Typography>
        <Box>
          <IconButton onClick={() => handleFilter()}>
            <FilterIcon />
          </IconButton>
        </Box>
      </Stack>

      <Suspense fallback={<LoadingFallback />}>
        <FinanceDonations />
      </Suspense>
    </>
  );
}
