'use client';
// Import necessary hooks and components from React, Next.js, and third-party libraries
import { useRouter } from 'next-nprogress-bar';
import React from 'react';
import Countdown from 'react-countdown';
import OtpInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
// Import API functions for OTP verification and resend
import { useMutation } from 'react-query';
import * as api from 'src/services';
// Import MUI components and icons for the UI
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
import { setToastMessage } from 'src/redux/slices/common';
import { NextDisabledArrow, NextWhiteArrow, TimerIcon } from '../icons';
VerifyOTPForm.propTypes = {
  // 'email' is a string representing the user's email, and it is required
  email: PropTypes.string.isRequired
};
// Renderer callback for displaying the countdown timer
const renderer = ({ minutes, seconds }) => {
  return (
    <>
      {minutes}:{seconds} {/* Format the countdown as MM:SS */}
    </>
  );
};

export default function VerifyOTPForm({ email }) {
  // Initialize hooks for routing, theming, and Redux state management
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();

  // Local state management for OTP, loading states, and countdown
  const [loading, setLoading] = React.useState(false);
  const [setResendLoading] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [complete, setComplete] = React.useState(false);
  const [countdownDate, setCountdownDate] = React.useState(Date.now() + 60000); // 60-second countdown timer

  // Function to handle OTP input change and reset completion state
  const onOtpChange = (value) => {
    const numericValue = value.replace(/\D/g, ''); // Only keep numeric characters
    setOtp(numericValue);
    setComplete(false); // Reset completion state on input change
  };

  // Mutation hook for OTP verification API
  const { mutate } = useMutation(api.verifyOTP, {
    retry: false,
    onSuccess: async (data) => {
      setLoading(false); // Stop loading spinner
      dispatch(setToastMessage({ message: data.message, variant: 'success' })); // Show success message
      router.push('/auth/reset-password/' + data?.data); // Redirect to reset password page
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error message
      setLoading(false); // Stop loading spinner
    }
  });

  // Mutation hook for resending OTP
  const { mutate: ResendOTPMutate } = useMutation(api.resendOTP, {
    retry: false,
    onSuccess: async (response) => {
      setComplete(false); // Reset completion state
      dispatch(setToastMessage({ message: response.message, variant: 'success' })); // Show success message
      setResendLoading(false); // Stop resend loading spinner
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error message
      setResendLoading(false); // Stop resend loading spinner
    }
  });

  // Function to handle OTP resend, reset countdown, and trigger resend mutation
  const onResend = () => {
    setResendLoading(true);
    ResendOTPMutate({ email: email, origin: window.location.origin });
    setCountdownDate(Date.now() + 60000); // Reset countdown date on OTP resend
  };

  return (
    <>
      {/* OTP form header */}
      <Stack>
        <Typography textAlign="center" variant="h5" color={'primary.main'} sx={AuthThemeStyles.authTitle}>
          Enter OTP
        </Typography>
      </Stack>

      {/* OTP description text */}
      <Stack>
        <Typography textAlign="center" variant="body2" mb={3} color="text.primary">
          Please enter 4 digit code that was sent to your Email address/Phone Number.
        </Typography>

        {/* OTP input field */}
        <Box sx={AuthThemeStyles.otpInput}>
          <Stack direction="row" justifyContent="center">
            <OtpInput
              value={otp} // Set OTP value from state
              onChange={onOtpChange} // Handle OTP input change
              numInputs={4} // Define 4 input fields for OTP
              renderSeparator={<span style={{ margin: `0 ${theme.spacing(1)}` }}></span>} // Define separator between input fields
              renderInput={(props) => <input {...props} />} // Render input fields with default properties
              shouldAutoFocus // Autofocus the first input field on page load
            />
          </Stack>

          {/* Resend OTP and countdown display */}
          <Stack direction="row" alignItems="center" justifyContent="center" mt={3}>
            <Typography variant="body2" color="text.secondarydark">
              If you don’t receive the code!
            </Typography>
            <Button size="small" onClick={onResend} disabled={!complete} sx={{ textDecoration: 'underline' }}>
              Resend
            </Button>
            {/* Timer and countdown */}
            {!complete && (
              <Stack direction="row" alignItems="center">
                <Stack sx={{ mr: 1, ml: 2 }}>
                  <TimerIcon />
                </Stack>
                <Countdown date={countdownDate} renderer={renderer} onComplete={() => setComplete(true)} />
              </Stack>
            )}
          </Stack>

          {/* OTP submission button */}
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <LoadingButton
              variant="contained"
              sx={{ textAlign: 'center' }}
              size="large"
              type="submit"
              loading={loading} // Show loading spinner while submitting
              disabled={otp.length < 4 || (complete && loading)} // Disable button if OTP length is less than 4 or if the timer is complete
              onClick={() => {
                setLoading(true); // Start loading when submitting OTP
                mutate({ otp, email: email }); // Call OTP verification API
              }}
              endIcon={otp.length < 4 || (complete && loading) ? <NextDisabledArrow /> : <NextWhiteArrow />}
            >
              Submit OTP
            </LoadingButton>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
