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

export default function ProjectLocationView({ campaignData }) {
  const fields = [
    { label: 'Project Country', value: campaignData?.projectCountryName },
    { label: 'Project State/Province', value: campaignData?.projectStateName },
    { label: 'Project City', value: campaignData?.projectCity },
    { label: 'Project Address Line One', value: campaignData?.addressLineOne },
    { label: 'Project Address Line Two', value: campaignData?.addressLineTwo }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" color="primary.main" textTransform="uppercase" sx={{ mb: 3 }}>
        Project Location
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
