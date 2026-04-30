'use client';
import { Grid, Paper, Typography } from '@mui/material';
import BankingInformation from './banking-information';
import IdentityDocuments from './identity-documents';
import ProfileDetails from './profile-details';

export default function BeneficiaryInformation() {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            Beneficiary Information Form
          </Typography>
        </Grid>
        <ProfileDetails />
        <IdentityDocuments />
        <BankingInformation />
      </Grid>
    </Paper>
  );
}
