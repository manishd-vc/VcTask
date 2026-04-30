'use client'; // Indicates this is a client-side component in Next.js
import { useRouter } from 'next-nprogress-bar'; // For navigation within the app
import PropTypes from 'prop-types'; // For prop type validation
import React from 'react'; // Importing React and useEffect for lifecycle methods
import { setToastMessage } from 'src/redux/slices/common'; // Redux action to set toast notifications

// yup - For schema-based validation
import * as Yup from 'yup';
// formik - For handling form state, validation, and submission
import { Form, FormikProvider, useFormik } from 'formik';
// mui - Material-UI components for styling and UI
import { LoadingButton } from '@mui/lab';
import { Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
// icons - Icons used for password visibility toggle
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMutation } from 'react-query'; // React Query for API interaction
import { useDispatch } from 'react-redux'; // Redux hook to dispatch actions
import AuthThemeStyles from 'src/app/auth/auth.theme.styles'; // Custom styles for the auth components
import useAesEncryption from 'src/hooks/useAesEncryption'; // Custom hook for AES encryption
import * as api from 'src/services'; // API service functions
import { BackArrow, NextWhiteArrow } from '../icons'; // Custom icons for navigation

// ----------------------------------------------------------------------
// ResetPasswordForm component definition
export default function ResetPasswordForm({ ...props }) {
  const { token } = props; // Extract the reset password token passed as a prop
  const router = useRouter(); // Next.js router for navigation
  const dispatch = useDispatch(); // Redux dispatch for state management
  const { encrypt } = useAesEncryption(); // AES encryption function for password
  const [loading, setLoading] = React.useState(false); // State to manage the loading state
  const [showPassword, setShowPassword] = React.useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false); // State for confirming password visibility

  // React Query mutation for resetting the password via the API
  const { mutate } = useMutation(api.resetPassword, {
    onSuccess: (data) => {
      setLoading(false); // Stop loading state on success
      dispatch(setToastMessage({ message: data.message, variant: 'success' })); // Dispatch success toast
      router.push('/auth/login'); // Redirect to the login page after successful reset
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Dispatch error toast
    }
  });

  // Yup validation schema for password fields
  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Short password') // Minimum password length
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$)/, // Regex for strong password validation
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces'
      )
      .required('Password is required'), // Password is required
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Password is not matched') // Confirm password must match the original
  });

  // Formik hook to manage form state and validation
  const formik = useFormik({
    initialValues: {
      password: '', // Initial password value
      confirmPassword: '' // Initial confirmPassword value
    },
    validationSchema: ResetPasswordSchema, // Validation schema
    onSubmit: async (values) => {
      setLoading(true); // Set loading state on submit
      const encryptedPassword = encrypt(values.password); // Encrypt the password
      const payload = {
        token, // Token passed in as a prop
        password: encryptedPassword // The encrypted password
      };
      await mutate(payload); // Call the mutate function to trigger the password reset
    }
  });

  // Extracting formik helper methods and validation error messages
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <>
      {/* Back Button to navigate to the Forget Password page */}
      <Button
        sx={AuthThemeStyles.backButton} // Custom style for back button
        size="large"
        startIcon={<BackArrow />} // Icon for the back button
        onClick={() => router.push('/auth/forget-password')} // Navigate back on click
      >
        Back
      </Button>

      {/* Title for the form */}
      <Stack>
        <Typography textAlign="center" variant="h5" color={'primary.main'} sx={AuthThemeStyles.authTitle}>
          Set New Password
        </Typography>
      </Stack>

      {/* Formik Form */}
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Password Input */}
            <Stack gap={0.5} width={1}>
              <TextField
                id="password"
                fullWidth
                label="Enter New Password"
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                {...getFieldProps('password')} // Formik field binding
                error={Boolean(touched.password && errors.password)} // Error handling
                helperText={touched.password && errors.password} // Error message display
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <RemoveRedEyeIcon size={24} /> : <VisibilityOffIcon size={24} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

            {/* Confirm Password Input */}
            <Stack gap={0.5} width={1}>
              <TextField
                id="confirmPassword"
                fullWidth
                label="Confirm New Password"
                autoComplete="current-password"
                type={showConfirmPassword ? 'text' : 'password'} // Toggle confirm password visibility
                {...getFieldProps('confirmPassword')} // Formik field binding
                error={Boolean(touched.confirmPassword && errors.confirmPassword)} // Error handling
                helperText={touched.confirmPassword && errors.confirmPassword} // Error message display
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                        {showConfirmPassword ? <RemoveRedEyeIcon size={24} /> : <VisibilityOffIcon size={24} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

            {/* Submit Button */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
              <LoadingButton
                sx={{ textAlign: 'center' }}
                size="large"
                type="submit" // Trigger form submission
                variant="contained"
                loading={loading} // Show loading indicator while submitting
                endIcon={<NextWhiteArrow />} // Icon for the submit button
              >
                Submit
              </LoadingButton>
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}

// PropTypes validation for the ResetPasswordForm component
ResetPasswordForm.propTypes = {
  token: PropTypes.string.isRequired // Token is required as a prop
};
