'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
// yup
import * as Yup from 'yup';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// mui
import { LoadingButton } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
// hooks
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// redux
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
// services
import { useMutation } from 'react-query';
import * as api from 'src/services';
// icons
import { NextWhiteArrow } from '../icons';

/**
 * ForgetPasswordForm - A form component for handling forgotten password requests.
 * @param {object} props - The component props.
 * @param {function} props.onSent - Callback triggered when the password reset email is successfully sent.
 * @param {function} props.onGetEmail - Callback to retrieve the entered email.
 * @returns {JSX.Element} - ForgetPasswordForm component.
 */
export default function ForgetPasswordForm({ ...props }) {
  const { onSent, onGetEmail } = props; // Destructure the callbacks from props
  const dispatch = useDispatch(); // Redux dispatch for triggering actions
  const isMountedRef = useIsMountedRef(); // Custom hook to check if the component is mounted
  const [loading, setLoading] = useState(false); // State for tracking loading status

  // Mutation for sending the password reset email
  const { mutate } = useMutation(api.forgetPassword, {
    onSuccess: (response) => {
      onSent(); // Trigger the onSent callback
      dispatch(setToastMessage({ message: response.message, variant: 'success' })); // Show success toast
      setLoading(false); // Stop loading
    },
    onError: (err) => {
      setLoading(false); // Stop loading
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error toast
    }
  });

  // Regex for validating email addresses
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Yup schema for form validation
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().matches(emailRegex, 'Enter valid email').required('Email is required')
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '' // Initial email value
    },
    validationSchema: ResetPasswordSchema, // Validation schema
    onSubmit: async (values) => {
      try {
        setLoading(true); // Start loading
        onGetEmail(values.email); // Pass the email to the parent callback
        await mutate({ email: values.email, origin: window.location.origin }); // Trigger the API call
      } catch (error) {
        if (isMountedRef.current) {
          // Check if the component is still mounted
          dispatch(setToastMessage({ message: error.message, variant: 'error' })); // Show error toast
        }
      }
    }
  });

  // Destructure Formik methods
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            id="email"
            variant="standard"
            label="Enter your Registered Email ID"
            required
            fullWidth
            autoComplete="username"
            type={'text'}
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <LoadingButton
              sx={{ textAlign: 'center' }}
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              endIcon={<NextWhiteArrow />}
            >
              Get OTP
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
      {/* )} */}
    </FormikProvider>
  );
}
ForgetPasswordForm.propTypes = {
  onSent: PropTypes.func.isRequired,
  onGetEmail: PropTypes.func.isRequired
};
