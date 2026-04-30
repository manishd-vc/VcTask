'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';
// Importing the toast message action to dispatch success/error messages
import { setToastMessage } from 'src/redux/slices/common';
// Importing Yup for validation schema
import * as Yup from 'yup';
// Importing Formik for form handling
import { Form, FormikProvider, useFormik } from 'formik';
// Importing MUI components
import { LoadingButton } from '@mui/lab';
import { Box, Stack, TextField, Typography } from '@mui/material';
// Importing icons (not used in this specific file)
// Importing custom hook and API functions
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import * as api from 'src/services';
import { emailRegex } from 'src/utils/util';
import { NextWhiteArrow } from '../icons';

/**
 * ForgetPasswordForm component is used for allowing users to reset their password
 * by entering their registered email address and getting an OTP.
 *
 * @param {Object} props - The props passed to this component.
 * @param {Function} props.onSent - Callback function to handle success response after sending OTP.
 * @param {Function} props.onGetEmail - Callback function to handle the email entered by the user.
 */
export default function ForgetPasswordForm({ ...props }) {
  const { onSent, onGetEmail } = props;
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const [loading, setLoading] = useState(false);

  // Mutation for handling forget password API request
  const { mutate } = useMutation(api.forgetPassword, {
    /**
     * onSuccess callback is triggered when the forget password API call is successful.
     * It dispatches a success toast message and triggers the onSent callback.
     *
     * @param {Object} response - The API response containing the success message.
     */
    onSuccess: (response) => {
      onSent(); // Callback after success
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      setLoading(false);
    },
    /**
     * onError callback is triggered when the forget password API call fails.
     * It dispatches an error toast message with the error message.
     *
     * @param {Object} err - The error object from the API call.
     */
    onError: (err) => {
      setLoading(false);
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  // Yup validation schema for the form
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().matches(emailRegex, 'Enter a valid email').required('Email is required.')
  });

  // Formik setup for handling form state and validation
  const formik = useFormik({
    initialValues: {
      email: '' // Initial email value is empty
    },
    validationSchema: ResetPasswordSchema, // Applying Yup validation schema
    /**
     * onSubmit function is called when the form is submitted.
     * It sends the email to the backend and triggers the mutation.
     *
     * @param {Object} values - The form values containing email.
     */
    onSubmit: async (values) => {
      try {
        setLoading(true); // Set loading state before sending request
        onGetEmail(values.email); // Callback with email entered by the user
        await mutate({ email: values.email, origin: window.location.origin }); // API call to send OTP
      } catch (error) {
        if (isMountedRef.current) {
          toast.error(error.message); // Display error message if the request fails
        }
      }
    }
  });

  // Destructuring formik helpers for field validation and submission
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <>
      {/* Title for the forgot password form */}
      <Stack>
        <Typography textAlign="center" variant="h5" color={'primary.main'} sx={AuthThemeStyles.authTitle}>
          Forgot Password
        </Typography>
      </Stack>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Email input field with validation and error handling */}
            <TextField
              id="email"
              variant="standard"
              fullWidth
              type={'text'}
              label={
                <>
                  Enter your Registered Email ID{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              {...getFieldProps('email')} // Field props from Formik
              error={Boolean(touched.email && errors.email)} // Display error if touched and invalid
              helperText={touched.email && errors.email} // Helper text for validation error message
            />
          </Stack>
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            {/* Submit button for sending OTP */}
            <LoadingButton
              textAlign="center"
              size="large"
              type="submit" // Submits the form
              variant="contained" // Button styling
              loading={loading} // Displays loading spinner when loading state is true
              endIcon={<NextWhiteArrow />} // Icon to display at the end of the button
            >
              Get OTP
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}

/**
 * Prop Types for ForgetPasswordForm to enforce correct data types and validation.
 */
ForgetPasswordForm.propTypes = {
  onSent: PropTypes.func.isRequired, // Callback when OTP is successfully sent
  onGetEmail: PropTypes.func.isRequired // Callback when email is entered
};
