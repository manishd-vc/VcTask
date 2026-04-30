'use client';

import { Grid, Paper, TableCell, TableRow, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import ReusableTable from 'src/components/table/ReusableTable';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import * as api from 'src/services';
import Export from './export';

export default function PaymentHistory() {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const campaignId = campaignUpdateData?.id;
  const fCurrency = useCurrencyFormatter('AED');
  const { data: donationHistory = [] } = useQuery(
    ['donationHistory', campaignId],
    () => api.getPaymentHistory(campaignId),
    {
      enabled: !!campaignId,
      retry: 1,
      refetchOnWindowFocus: false
    }
  );
  const tableHeaders = [
    { label: 'Donor ID', key: 'donorId' },
    { label: 'Payment Ref #', key: 'paymentRef' },
    { label: 'Amount', key: 'amount' },
    { label: 'Payment Date', key: 'paymentDate' }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" color="primary.main" mb={3} component="p">
            {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'DONATION HISTORY' : 'PAYMENT HISTORY'}
          </Typography>
        </Grid>
        {donationHistory.length > 0 && (
          <Grid item xs={12} md={4} sx={{ py: 2, textAlign: 'right' }}>
            <Export id={campaignUpdateData?.id} type={'DONATION_HISTORY'} />
          </Grid>
        )}
      </Grid>
      <ReusableTable headers={tableHeaders}>
        {donationHistory.length > 0 ? (
          donationHistory.map((row) => (
            <TableRow key={row.donorId}>
              <TableCell>{row.donorId || '-'}</TableCell>
              <TableCell>{row.paymentRef || '-'}</TableCell>
              <TableCell>{fCurrency(row.amount) || '-'}</TableCell>
              <TableCell>{row.paymentDate || '-'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} align="center">
              No donations available.
            </TableCell>
          </TableRow>
        )}
      </ReusableTable>
    </Paper>
  );
}
