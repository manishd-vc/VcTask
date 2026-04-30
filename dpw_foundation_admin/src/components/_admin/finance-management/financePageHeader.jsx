'use client';

import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { BackArrow } from 'src/components/icons';

export default function FinancePageHeader({ data }) {
  const router = useRouter();

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
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 3 }}>
        View In-Kind Contribution Request - {data?.contributionUniqueId || 'Loading...'}
      </Typography>
    </>
  );
}
