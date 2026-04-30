'use client';

import { useRouter } from 'next-nprogress-bar';
import React from 'react';
import OtpInput from 'react-otp-input';
// api
import { useMutation } from 'react-query';
import * as api from 'src/services';
// mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';
import { useDispatch } from 'react-redux';
import AuthThemeStyles from 'src/app/(user)/auth.theme.styles';
import { setToastMessage } from 'src/redux/slices/common';
import { NextWhiteArrow, TimerIcon } from '../icons';
VerifyOTPForm.propTypes = {
  // 'email' is a string representing the user's email, and it is required
  email: PropTypes.string.isRequired
};
// Countdown renderer function for custom display of time
const renderer = ({ minutes, seconds }) => {
  return (
    <Box sx={{ minWidth: 40 }}>
      {minutes}:{seconds}
    </Box>
  );
};

/**
 * VerifyOTPForm Component
 * Handles OTP verification and provides options to resend OTP.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.email - The email address associated with the OTP.
 */
export default function VerifyOTPForm({ email }) {
  const router = useRouter(); // Router for navigation
  const theme = useTheme(); // Theme object for styling
  const dispatch = useDispatch(); // Redux dispatch for global state updates

  // State variables
  const [otp, setOtp] = React.useState(''); // Stores the entered OTP
  const [complete, setComplete] = React.useState(false); // Tracks OTP completion state
  const [countdownDate, setCountdownDate] = React.useState(Date.now() + 60000); // Timer for OTP resending

  /**
   * Handles OTP value changes.
   *
   * @param {string} value - The updated OTP value.
   */
  const onOtpChange = (value) => {
    const numericValue = value.replace(/\D/g, ''); // Ensures only numeric input
    setOtp(numericValue);
    setComplete(false); // Resets completion state on change
  };

  // Mutation for verifying OTP
  const { mutate, isLoading } = useMutation(api.verifyOTP, {
    retry: false, // Disables retry on failure
    onSuccess: async (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' })); // Show success message
      router.push('/auth/reset-password/' + data?.data); // Navigate to reset password page
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error message
    }
  });

  // Mutation for resending OTP
  const { mutate: ResendOTPMutate } = useMutation(api.resendOTP, {
    retry: false, // Disables retry on failure
    onSuccess: async (response) => {
      setComplete(false); // Reset completion state
      dispatch(setToastMessage({ message: response.message, variant: 'success' })); // Show success message
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error message
    }
  });

  /**
   * Handles OTP resend action and resets the countdown timer.
   */
  const onResend = () => {
    ResendOTPMutate({ email: email, origin: window.location.origin }); // Trigger OTP resend API
    setCountdownDate(Date.now() + 60000); // Reset countdown timer
  };
  return (
    <Stack>
      <Typography textAlign="center" variant="body2" mb={3} color="text.primary">
        Please enter 4 digit code that send to your Email address/Phone Number.
      </Typography>
      <Box sx={AuthThemeStyles.otpInput}>
        <Stack direction="row" justifyContent="center">
          <OtpInput
            value={otp}
            onChange={onOtpChange}
            numInputs={4}
            renderSeparator={<span style={{ margin: `0 ${theme.spacing(1)}` }}></span>}
            renderInput={(props) => <input {...props} />}
            shouldAutoFocus
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center" mt={3}>
          <Typography variant="body2" color="text.secondarydark">
            If you don’t receive code!
          </Typography>
          <Button size="small" onClick={onResend} disabled={!complete} sx={{ textDecoration: 'underline' }}>
            Resend
          </Button>

          {!complete && (
            <Stack direction="row" alignItems="center">
              <Stack sx={{ mr: 1, ml: 2 }}>
                <TimerIcon />
              </Stack>
              <Countdown date={countdownDate} renderer={renderer} onComplete={() => setComplete(true)} />
            </Stack>
          )}
        </Stack>
        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
          <LoadingButton
            variant="contained"
            textAlign="center"
            size="large"
            loading={isLoading}
            disabled={otp.length < 4 || (complete && isLoading)}
            onClick={() => {
              mutate({
                otp,
                email: email
              });
            }}
            endIcon={<NextWhiteArrow />}
          >
            Submit OTP
          </LoadingButton>
        </Stack>
      </Box>
    </Stack>
  );
}
