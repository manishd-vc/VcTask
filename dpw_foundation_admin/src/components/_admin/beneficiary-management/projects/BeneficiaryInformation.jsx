'use client';
import { Grid, Paper, Stack, Typography } from '@mui/material';

const FieldDisplay = ({ label, value, textTransform, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform={textTransform}>
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function BeneficiaryInformation({ campaignData }) {
  const fields = [
    { label: 'Registered As', value: campaignData?.registeredAs },
    { label: 'Email ID', value: campaignData?.emailId },
    { label: 'First Name', value: campaignData?.firstName, textTransform: 'capitalize' },
    { label: 'Second Name', value: campaignData?.secondName, textTransform: 'capitalize' },
    { label: 'Phone Number', value: campaignData?.phoneNumber },
    { label: 'Country', value: campaignData?.countryName },
    { label: 'State/Province', value: campaignData?.stateName },
    { label: 'City', value: campaignData?.city },
    { label: 'Mailing Address', value: campaignData?.mailingAddress }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" color="primary.main" textTransform="uppercase" sx={{ mb: 3 }}>
        Beneficiary Information
      </Typography>
      <Grid container spacing={3}>
        {fields?.map((field) => (
          <FieldDisplay
            key={field.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}
      </Grid>
    </Paper>
  );
}
