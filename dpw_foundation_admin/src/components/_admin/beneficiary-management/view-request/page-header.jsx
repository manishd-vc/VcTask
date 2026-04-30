'use client';
import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import StatusActions from './StatusActions';
export default function PageHeader({ refetch }) {
  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);
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
        <StatusActions refetch={refetch} />
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 3 }}>
        View In-Kind Contribution Request - {inKindContributionRequestData?.contributionUniqueId}
      </Typography>
    </>
  );
}
