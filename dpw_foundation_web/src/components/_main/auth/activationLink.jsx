'use client';
import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
import * as api from 'src/services';

const isAndroid = () => {
  if (typeof window !== 'undefined') {
    return /android/i.test(navigator.userAgent);
  }
  return false;
};

const isIOS = () => {
  if (typeof window !== 'undefined') {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  return false;
};

export default function ActivationLink({ id }) {
  const router = useRouter();
  const [message, setMessage] = useState('You have successfully verified your email account.');

  useEffect(() => {
    getLinkDetail(id);
  }, [id]);

  const getLinkDetail = async (id) => {
    try {
      await api.activationLink(id);
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }
  };

  const handleLoginClick = () => {
    if (isAndroid()) {
      const redirectUrl = `intent://activation/${id}#Intent;scheme=dpwfoundation;package=com.dpw.foundation.app;end`;
      window.location.href = redirectUrl;
    } else if (isIOS()) {
      const redirectUrl = `dpwfoundation://activation/${id}`;
      window.location.href = redirectUrl;
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <>
      <Stack>
        <Typography textAlign="center" color={'primary.main'} variant="h5" sx={AuthThemeStyles.authTitle}>
          Account activation
        </Typography>
        <Typography textAlign="center" color="text.secondary" variant="body1">
          {message}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
        <LoadingButton textAlign="center" size="large" type="submit" variant="contained" onClick={handleLoginClick}>
          login
        </LoadingButton>
      </Stack>
    </>
  );
}
