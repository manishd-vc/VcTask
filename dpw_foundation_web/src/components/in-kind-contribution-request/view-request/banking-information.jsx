import { Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const FieldDisplay = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark">
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function BankingInformation() {
  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);

  const { bankBeneficiaryName, bankName, bankAccount, bankIban, bankSwiftCode } = inKindContributionRequestData || {};

  const bankFields = [
    { label: 'Beneficiary Name', value: bankBeneficiaryName },
    { label: 'Bank Name', value: bankName },
    { label: 'Account Number', value: bankAccount },
    { label: 'IBAN', value: bankIban },
    { label: 'SWIFT Code', value: bankSwiftCode }
  ];

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Banking Information
        </Typography>
      </Grid>
      {bankFields?.map((field) => (
        <FieldDisplay key={field?.label} label={field?.label} value={field?.value} />
      ))}
    </>
  );
}
