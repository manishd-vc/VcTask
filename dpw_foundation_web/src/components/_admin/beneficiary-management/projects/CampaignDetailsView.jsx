'use client';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { fDateWithLocale } from 'src/utils/formatTime';

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

export default function CampaignDetailsView({ campaignData }) {
  const campaignFields = [
    {
      label: 'Project Start Date',
      value: campaignData?.startDateTime ? fDateWithLocale(campaignData?.startDateTime) : '-'
    },
    { label: 'Project End Date', value: campaignData?.endDateTime ? fDateWithLocale(campaignData?.endDateTime) : '-' },
    { label: 'Project Supervisor', value: campaignData?.campaignCoverage }
  ];

  const locationFields = [
    { label: 'Project Country', value: campaignData?.projectCountryName, gridProps: { xs: 12, sm: 4, md: 4 } },
    { label: 'Project State/Province', value: campaignData?.projectStateName, gridProps: { xs: 12, sm: 4, md: 4 } },
    { label: 'Project City', value: campaignData?.projectCity, gridProps: { xs: 12, sm: 4, md: 4 } },
    { label: 'Project Address Line One', value: campaignData?.addressLineOne, gridProps: { xs: 12, sm: 4, md: 4 } },
    { label: 'Project Address Line Two', value: campaignData?.addressLineTwo, gridProps: { xs: 12, sm: 4, md: 4 } }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={4}>
          <Stack sx={{ backgroundColor: (theme) => theme.palette.grey[50] }}>
            <Image
              src={campaignData?.bannerUrl || '/dpwfadm/images/default.png'}
              alt="Cover Image"
              width={800}
              height={600}
              layout="responsive"
              unoptimized={true}
              style={{ maxHeight: '150px', objectFit: 'contain' }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          <Grid container spacing={3}>
            {campaignFields?.map((field) => (
              <FieldDisplay
                key={field.label}
                label={field?.label}
                value={field?.value}
                textTransform={field?.textTransform}
                gridProps={field?.gridProps}
              />
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Project Description
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignData?.campaignDescription || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
          Project Location
        </Typography>
        <Grid container spacing={3}>
          {locationFields?.map((field) => (
            <FieldDisplay
              key={field.label}
              label={field?.label}
              value={field?.value}
              textTransform={field?.textTransform}
              gridProps={field?.gridProps}
            />
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
