'use client';

import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import GuestGuard from 'src/guards/guest';

import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
import { ArrowGreenIcon, CancelRedIcon, NextWhiteArrow } from 'src/components/icons';

export default function WebPaymentStatus({ isLoading, paymentStatus, soTransactionID, state }) {
  const router = useRouter();

  const handleclick = () => {
    if (state === 'EMAIL') {
      router.push('/auth/login');
    } else {
      router.push('/user/my-donations');
    }
  };

  const renderPaymentContent = () => {
    if (isLoading) {
      return (
        <Stack alignItems="center" mt={10}>
          <CircularProgress />
        </Stack>
      );
    }

    if (paymentStatus === 'SUCCESS') {
      return (
        <>
          <Stack alignItems="center" mt={3}>
            <ArrowGreenIcon height="80px" width="80px" />
          </Stack>
          <Stack flexDirection="column">
            <Typography textAlign="center" variant="h5" color="success.main" sx={AuthThemeStyles.authTitle}>
              Donation Successful
            </Typography>
          </Stack>
          <Typography textAlign="center" variant="body1" mb={2} color="text.primary">
            Transaction ID: {soTransactionID}
          </Typography>
          <Typography textAlign="center" variant="subtitle3" my={2} color="text.primary">
            Thank you! Your donation has been successfully received.
          </Typography>
          <Typography textAlign="center" variant="body2" mb={3} color="text.primary">
            Your support enables us to deliver meaningful impact and improve lives across the communities we serve. You
            will receive a confirmation email shortly with the details of your contribution.
          </Typography>
        </>
      );
    }

    return (
      <>
        <Stack alignItems="center" mt={3}>
          <CancelRedIcon height="80px" width="80px" />
        </Stack>
        <Stack>
          <Typography textAlign="center" variant="h5" color="error.main" sx={AuthThemeStyles.authTitle}>
            Donation Failed
          </Typography>
        </Stack>
        <Typography textAlign="center" variant="body2" my={2} color="text.primary">
          Your donation has failed. Please contact the admin.
        </Typography>
      </>
    );
  };

  return (
    <GuestGuard>
      {renderPaymentContent()}

      <Stack direction="row" justifyContent="center" mt={4} mb={6}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          endIcon={<NextWhiteArrow />}
          onClick={() => handleclick()}
        >
          {state === 'EMAIL' ? 'Login' : 'Back To My Donations'}
        </Button>
      </Stack>
    </GuestGuard>
  );
}
