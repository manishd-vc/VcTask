'use client';
import { Grid, Stack, Typography } from '@mui/material';
const FieldDisplay = ({ label, value, textTransform, color, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle4"
        color="text.secondarydark"
        textTransform={textTransform}
        sx={color ? { color: (theme) => theme.palette[color]?.main } : {}}
      >
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function BankingDetails({ beneficiaryData }) {
  const { bankBeneficiaryName, bankName, bankAccount, bankIban, bankSwiftCode } = beneficiaryData || {};

  const bankFields = [
    { label: 'Beneficiary Name', value: bankBeneficiaryName },
    { label: 'Bank Name', value: bankName },
    { label: 'Account Number', value: bankAccount },
    { label: 'IBAN', value: bankIban },
    { label: 'SWIFT Code', value: bankSwiftCode }
  ];

  return (
    <>
      <Grid container spacing={3}>
        {bankFields?.map((field, index) => (
          <FieldDisplay
            key={`${field.label}-${field.value}`}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            color={field?.color}
            gridProps={field?.gridProps}
          />
        ))}
      </Grid>
    </>
  );
}
