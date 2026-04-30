'use client';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { BackArrow, PrintIcon } from 'src/components/icons';
import StatusActions from './status-action';

export default function PageHeader({ refetch }) {
  const router = useRouter();
  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);

  const { volunteerCampaignTitle, volunteerCampaignNumericId } = volunteerCampaignData || {};
  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 6
        }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
        <Stack
          justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          flexDirection="row"
          gap={2}
          flexWrap="wrap"
          alignItems={'center'}
        >
          <IconButton width="40px" height="40px">
            <PrintIcon />
          </IconButton>
          <StatusActions refetch={refetch} />
        </Stack>
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 5 }}>
        {volunteerCampaignTitle}- {volunteerCampaignNumericId}
      </Typography>
    </>
  );
}
