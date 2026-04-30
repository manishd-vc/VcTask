'use client';
import { Checkbox, FormControlLabel, Grid, Paper, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DocumentsRowView from 'src/components/table/rows/DocumentsRowView';
import { setIsPaymentValidated } from 'src/redux/slices/grant';

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

export default function PaymentInfoForm({ beneficiaryData, documentsList = [] }) {
  const dispatch = useDispatch();
  const isPaymentValidated = useSelector((state) => state?.grant?.isPaymentValidated);
  const { bankBeneficiaryName, bankName, bankAccount, bankIban, bankSwiftCode } = beneficiaryData || {};

  const bankFields = [
    { label: 'Beneficiary Name', value: bankBeneficiaryName },
    { label: 'Bank Name', value: bankName },
    { label: 'Account Number', value: bankAccount },
    { label: 'IBAN', value: bankIban },
    { label: 'SWIFT Code', value: bankSwiftCode }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            Payment Information Form
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Banking Information
          </Typography>
        </Grid>
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
        <Grid item xs={12}>
          <Typography
            variant="subtitle6"
            component="h4"
            textTransform={'uppercase'}
            color="primary.main"
            sx={{ pb: 3 }}
          >
            Document Upload in Support of Request
          </Typography>
          <DocumentsRowView rowData={documentsList} />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPaymentValidated}
                onChange={(e) => dispatch(setIsPaymentValidated(e.target.checked))}
              />
            }
            label="Validate Payment"
            sx={{ mt: 3 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
