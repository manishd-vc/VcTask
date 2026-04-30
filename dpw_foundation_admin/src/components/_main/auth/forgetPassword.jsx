'use client';
import { useState } from 'react';

// mui
import { Button, Typography } from '@mui/material';
// api
// icons
// components
import { useRouter } from 'next/navigation';
import AuthThemeStyles from 'src/app/(user)/auth.theme.styles';
import ForgetPasswordForm from 'src/components/forms/forgetPassword';
import VerifyOTPForm from 'src/components/forms/otp';
import { BackArrow } from 'src/components/icons';

/**
 * ForgetPasswordMain - A component that handles the flow for a user to reset their password.
 *
 * @returns {JSX.Element} - The component that renders either a password reset form or OTP verification form.
 */
export default function ForgetPasswordMain() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // State to hold the user's email
  const [sent, setSent] = useState(false); // State to track if the reset email has been sent

  return (
    <>
      {/* Conditional rendering based on whether the reset email has been sent */}
      {!sent ? (
        <>
          {/* Back button to navigate to the previous page */}
          <Button
            variant="text"
            startIcon={<BackArrow />}
            onClick={() => router.back()}
            sx={{
              mb: { xs: 3 },
              '&:hover': { textDecoration: 'none' },
              ...AuthThemeStyles.backButton
            }}
          >
            Back
          </Button>
          {/* Title for the Forgot Password page */}
          <Typography textAlign="center" variant="h5" color={'primary.main'} sx={AuthThemeStyles.authTitle}>
            Forgot Password
          </Typography>
          {/* Forgot password form */}
          <ForgetPasswordForm onSent={() => setSent(true)} onGetEmail={(value) => setEmail(value)} />
        </>
      ) : (
        <>
          {/* Back button for navigating to the previous page */}
          <Button sx={AuthThemeStyles.backButton} size="large" startIcon={<BackArrow />} onClick={() => router.back()}>
            Back
          </Button>
          {/* Title for the OTP verification page */}
          <Typography textAlign="center" variant="h5" color={'primary.main'} sx={AuthThemeStyles.authTitle}>
            Enter OTP
          </Typography>
          {/* OTP verification form, passing the email state */}
          <VerifyOTPForm email={email} />
        </>
      )}
    </>
  );
}
