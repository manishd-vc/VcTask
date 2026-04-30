'use client';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as Yup from 'yup';

import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import * as api from 'src/services';
import { emailRegex } from 'src/utils/util';
import { NextWhiteArrow } from '../icons';

export default function ActivateAccountForm({ onSent }) {
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation(api.resendActivationEmail, {
    onSuccess: (response) => {
      onSent();
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string().matches(emailRegex, 'Please enter a valid Email ID').required('Email ID is required.')
  });

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await mutate({ email: values.email });
      } catch (error) {
        if (isMountedRef.current) {
          dispatch(setToastMessage({ message: error.message, variant: 'error' }));
        }
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <Stack>
        <Typography textAlign="center" variant="h5" color="primary.main" sx={AuthThemeStyles.authTitle}>
          Resend Activation Email
        </Typography>
      </Stack>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              id="email"
              variant="standard"
              fullWidth
              type="text"
              label={
                <>
                  Enter Your Email ID{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>

          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              endIcon={<NextWhiteArrow />}
            >
              Resend Email
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}

ActivateAccountForm.propTypes = {
  onSent: PropTypes.func.isRequired
};
