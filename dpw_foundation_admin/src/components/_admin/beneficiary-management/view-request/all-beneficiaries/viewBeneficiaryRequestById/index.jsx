'use client';
import { Paper, Stack, Typography } from '@mui/material';
import BankingDetails from './banking-details';
import IdentityDocuments from './identity-documents';
import ProfileDetails from './profile-details';

export default function ViewBeneficiaryRequestById({ beneficiaryData }) {
  return (
    <>
      <Stack spacing={3}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase" mb={3}>
            Basic Details
          </Typography>
          <ProfileDetails beneficiaryData={beneficiaryData} />
          <IdentityDocuments beneficiaryData={beneficiaryData} />
          <Typography variant="h6" color="primary.main" textTransform="uppercase" mt={3} mb={3}>
            Banking Information
          </Typography>
          <BankingDetails beneficiaryData={beneficiaryData} />
        </Paper>
      </Stack>
    </>
  );
}
