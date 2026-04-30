'use client';
import { Grid, Paper, Typography } from '@mui/material';
import FinanceBankingInformation from './finance-banking-information';
import FinanceIdentityDocuments from './finance-identity-documents';
import FinanceProfileDetails from './finance-profile-details';

export default function FinanceInformation() {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            Finance Information Form
          </Typography>
        </Grid>
        <FinanceProfileDetails />
        <FinanceIdentityDocuments />
        <FinanceBankingInformation />
      </Grid>
    </Paper>
  );
}