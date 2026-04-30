'use client';

import { Grid, Paper, Stack, Typography } from '@mui/material';
import { fDateWithLocale } from 'src/utils/formatTime';

const FieldDisplay = ({ label, value, textTransform, color, gridProps = { xs: 12, sm: 6, md: 3 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle2"
        color="text.primary"
        textTransform={textTransform}
        sx={color ? { color: (theme) => theme.palette[color]?.main } : {}}
      >
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function FinanceRequestDetails({ data }) {
  if (!data) return null;

  const fields = [
    { label: 'Request Status', value: data.status, color: data.status === 'APPROVED' ? 'success' : 'warning' },
    { label: 'Created Date', value: data.createdDate ? fDateWithLocale(data.createdDate) : '-' },
    { label: 'Requester Name', value: data.requesterName, textTransform: 'capitalize' },
    { label: 'Grant Type', value: data.grantType },
    { label: 'IACAD Permit', value: data.iacadPermit },
    { label: 'Receipt Voucher', value: data.receiptVoucher }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        {fields?.map((field) => (
          <FieldDisplay
            key={`${field.label}`}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            color={field?.color}
          />
        ))}
      </Grid>
    </Paper>
  );
}
