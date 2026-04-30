'use client';

import { Button, Stack, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthThemeStyles from 'src/app/(user)/auth.theme.styles';
import { ArrowGreenIcon, CancelRedIcon, NextWhiteArrow } from 'src/components/icons';

export default function WebPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const soTransactionID = searchParams.get('soTransactionID');
  const status = searchParams.get('status');

  let renderContent;

  if (status === '1') {
    renderContent = (
      <>
        <Stack alignItems="center" mt={3}>
          <ArrowGreenIcon height="80px" width="80px" />
        </Stack>
        <Stack flexDirection="column">
          <Typography textAlign="center" variant="h5" color="success.main" sx={AuthThemeStyles.authTitle}>
            Donation Successful
          </Typography>
        </Stack>
        <Typography component="p" textAlign="center" variant="body1" mb={2} color="text.primary">
          Transaction ID: {soTransactionID}
        </Typography>
        <Typography textAlign="center" variant="subtitle3" my={2} color="text.primary" component="h5">
          Thank you! Your donation has been successfully received.
        </Typography>
        <Typography textAlign="center" variant="body2" mb={3} color="text.primary">
          Your support enables us to deliver meaningful impact and improve lives across the communities we serve. You
          will receive a confirmation email shortly with the details of your contribution.
        </Typography>
      </>
    );
  } else {
    renderContent = (
      <>
        <Stack alignItems="center" mt={3}>
          <CancelRedIcon height={80} width={80} />
        </Stack>
        <Stack>
          <Typography textAlign="center" variant="h5" color="error.main" sx={AuthThemeStyles.authTitle}>
            Donation Failed
          </Typography>
        </Stack>
        <Typography textAlign="center" variant="body2" mb={1} mt={1} color="text.primary">
          Your Donation has been failed. Please Contact Admin.
        </Typography>
      </>
    );
  }

  return (
    <div>
      {renderContent}

      <Stack direction="row" justifyContent="center" mt={4} mb={6}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          endIcon={<NextWhiteArrow />}
          onClick={() => router.push('/admin/on-the-spot-donation')}
        >
          Back to Donations
        </Button>
      </Stack>
    </div>
  );
}
