'use client';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next-nprogress-bar';
import RouterLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
import { createCookies } from 'src/hooks/cookies';
import useAesEncryption from 'src/hooks/useAesEncryption';
import { setToastMessage } from 'src/redux/slices/common';
import { setLogin } from 'src/redux/slices/user';
import * as api from 'src/services';
import { emailRegex } from 'src/utils/util';
import * as Yup from 'yup';
import { NextWhiteArrow } from '../icons';

// Import GTM helper
import { gtmEvents } from 'src/lib/gtmEvents';

export default function LoginForm() {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const { encrypt } = useAesEncryption();
  const searchParam = useSearchParams();
  const redirect = searchParam.get('redirect');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fire GTM login initiated event when user clicks "Login"
  const handleLoginInitiated = () => {
    gtmEvents.loginInitiated();
  };

  const { mutate } = useMutation(api.login, {
    onSuccess: async (data) => {
      setLoading(false);
      const userData = data?.data;
      dispatch(setLogin(userData));
      await createCookies('userToken', userData?.token);
      await createCookies('refreshToken', userData?.refreshToken);
      // Fire GTM login success event
      gtmEvents.loginSuccess({
        userId: userData?.userId,
        roles: userData?.roles,
        type: userData?.type,
        organization_id: userData?.organizationId,
        organization_role: userData?.organizationRole,
        organization_name: userData?.organizationName
      });

      if (userData?.firstLogin) {
        push('/user/settings');
      } else {
        push(redirect || '/');
      }
    },
    onError: (err) => {
      setLoading(false);
      const message = err?.response?.data?.message || 'Login failed';
      gtmEvents.loginError(message); // Fire GTM login error event

      if (message === 'ACCOUNT SUSPENDED') {
        dispatch(setToastMessage({ message: err.response?.data?.data, variant: 'warning', title: message }));
      } else if (message === 'ACCOUNT DELETED') {
        dispatch(setToastMessage({ message: err.response?.data?.data, variant: 'error', title: message }));
      } else if (message === 'ACCOUNT NOT VERIFIED') {
        dispatch(setToastMessage({ message: err.response?.data?.data, variant: 'warning', title: message }));
        push('/auth/activate-account');
      } else {
        dispatch(setToastMessage({ message, variant: 'error' }));
      }
    }
  });

  const LoginSchema = Yup.object().shape({
    email: Yup.string().matches(emailRegex, 'Enter a valid email').required('Email is required.'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$)/,
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces'
      )
      .required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      setLoading(true);
      const encryptedPassword = encrypt(password);

      const payload = {
        email,
        password: encryptedPassword
      };

      mutate(payload);
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <Stack>
        <Typography textAlign="center" color={'primary.main'} variant="h5" sx={AuthThemeStyles.authTitle}>
          Login
        </Typography>
      </Stack>

      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          noValidate
          onSubmit={(e) => {
            handleLoginInitiated(); // Fire event before actual submit
            handleSubmit(e);
          }}
        >
          <Stack spacing={3}>
            {/* Email Field */}
            <TextField
              id="email"
              fullWidth
              autoComplete="username"
              label={
                <>
                  Username{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              type="email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              variant="standard"
            />

            {/* Password Field */}
            <TextField
              variant="standard"
              id="password"
              fullWidth
              label={
                <>
                  Password{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <VisibilityOffIcon size={24} /> : <VisibilityIcon size={24} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <Stack direction="row" sx={{ mt: 3 }}>
            <Link
              component={RouterLink}
              variant="muilink"
              color="secondary"
              href="/auth/forget-password"
              underline="always"
            >
              Forgot password?
            </Link>
          </Stack>

          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <LoadingButton
              sx={{ textAlign: 'center' }}
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              endIcon={<NextWhiteArrow />}
            >
              Login
            </LoadingButton>
          </Stack>

          <Divider variant="customGradient" />
          <Typography variant="subtitle1" color="text.secondarydark">
            Not Sign up? &nbsp;
            <Link
              href={`/auth/register${redirect ? '?redirect=' + redirect : ''}`}
              component={RouterLink}
              variant="muilink"
              color="secondary"
              underline="always"
            >
              Register Here
            </Link>
          </Typography>
        </Form>
      </FormikProvider>
    </>
  );
}
