'use client';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';

// mui
import { Box, Button } from '@mui/material';
// api
import { useMutation } from 'react-query';
import * as api from 'src/services';
// icons
// components
import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
import ForgetPasswordForm from 'src/components/forms/forgetPassword';
import VerifyOTPForm from 'src/components/forms/otp';
import { BackArrow } from 'src/components/icons';

export default function ForgetPasswordMain() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  useMutation(api.forgetPassword, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  return (
    <>
      {!sent ? (
        <>
          <Button
            sx={AuthThemeStyles.backButton}
            size="large"
            startIcon={<BackArrow />}
            onClick={() => router.push('/auth/login')}
          >
            Back
          </Button>
          <ForgetPasswordForm onSent={() => setSent(true)} onGetEmail={(value) => setEmail(value)} />
        </>
      ) : (
        <>
          <Button sx={AuthThemeStyles.backButton} size="large" startIcon={<BackArrow />} onClick={() => setSent(false)}>
            Back
          </Button>
          <Box textAlign="center">
            <VerifyOTPForm email={email} />
          </Box>
        </>
      )}
    </>
  );
}
