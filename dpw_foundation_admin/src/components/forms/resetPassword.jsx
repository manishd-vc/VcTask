'use client';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// yup
import * as Yup from 'yup';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// mui
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import { Box, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
// api
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import LoginStyle from 'src/app/(user)/login.styles';
import useAesEncryption from 'src/hooks/useAesEncryption';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { NextWhiteArrow } from '../icons';

// ----------------------------------------------------------------------

/**
 * ResetPasswordForm Component
 * Handles resetting a user's password securely.
 *
 * @param {Object} props - Component properties
 * @param {string} props.token - Reset token for the user
 */
export default function ResetPasswordForm({ ...props }) {
  const { token } = props;

  // Router for navigation
  const { push } = useRouter();

  // AES encryption hook
  const { encrypt } = useAesEncryption();

  // Redux dispatch for global state updates
  const dispatch = useDispatch();

  // State variables for password visibility and button state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Fetch user profile data for the reset form
  const { data } = useQuery(['reset-profile'], () => api.resetProfileData(token), {
    onError: (err) => {
      // Show error message if profile data fetch fails
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  // Mutation for submitting the reset password form
  const { mutate, isLoading } = useMutation(api.resetPassword, {
    onSuccess: (response) => {
      // Redirect to login on successful password reset
      push('/auth/login');
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
    },
    onError: (err) => {
      // Show error message if password reset fails
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  // Validation schema for the reset password form
  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$)/,
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces'
      )
      .required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Password is not matched')
  });

  // Formik setup for managing form state and submission
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      // Encrypt the new password before submission
      const encryptedPassword = encrypt(values.password);
      const payload = {
        token,
        password: encryptedPassword
      };
      await mutate(payload);
    }
  });

  // Destructure Formik helpers for easier usage
  const { errors, touched, handleSubmit, getFieldProps, setFieldValue, values, isValid } = formik;

  // Populate form fields with fetched user data if available
  useEffect(() => {
    if (data?.status == 200) {
      setFieldValue('name', `${data?.data?.firstName} ${data?.data?.lastName}`);
      setFieldValue('email', data?.data?.email);
      setFieldValue('phone', data?.data?.mobile);
    }
  }, [data]);

  // Enable or disable the submit button based on form validity and input values
  useEffect(() => {
    setIsButtonDisabled(!isValid || !values.password || !values.confirmPassword);
  }, [isValid, values.password, values.confirmPassword]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            id="password"
            fullWidth
            variant="standard"
            label="Enter New Password"
            required
            autoComplete="new-password"
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
          <TextField
            id="password"
            fullWidth
            variant="standard"
            label="Confirm New Password"
            required
            autoComplete="current-password"
            type={showConfirmPassword ? 'text' : 'password'}
            {...getFieldProps('confirmPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    {showConfirmPassword ? <VisibilityOffIcon size={24} /> : <VisibilityIcon size={24} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />
          <Box sx={LoginStyle.cardBottomBtn}>
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={isLoading}
              endIcon={<NextWhiteArrow />}
              disabled={isButtonDisabled}
            >
              Submit
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
ResetPasswordForm.propTypes = {
  token: PropTypes.string.isRequired
};
