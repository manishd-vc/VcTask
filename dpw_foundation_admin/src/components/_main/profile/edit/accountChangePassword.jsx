'use client';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
// api
import * as api from 'src/services';
import * as Yup from 'yup';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useAesEncryption from 'src/hooks/useAesEncryption';
import { setToastMessage } from 'src/redux/slices/common';

/**
 * AccountChangePassword - A component for managing the change of user password.
 *
 * @returns {JSX.Element} - The form for changing the password, including validation and form submission.
 */
export default function AccountChangePassword() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false); // State for loading indicator
  const [oldPassword, setOldPassword] = React.useState(false); // State to toggle visibility of old password
  const [newPassword, setNewPassword] = React.useState(false); // State to toggle visibility of new password
  const [confirmPassword, setConfirmPassword] = React.useState(false); // State to toggle visibility of confirm password
  const { encrypt } = useAesEncryption(); // Custom hook for AES encryption

  const { user } = useSelector(({ user }) => user); // Access user data from Redux store
  const router = useRouter();

  // Yup validation schema for the password change form
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$)/,
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces'
      )
      .required('New password is required')
      .test('not-same-as-old', 'New password cannot be the same as current password', function (value) {
        return value !== parent.oldPassword;
      }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm New password is required')
  });

  // Formik hook to handle form state and validation
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values) => {
      setLoading(true); // Set loading to true during form submission
      const data = {
        email: user?.email,
        oldPassword: encrypt(values.oldPassword), // Encrypt old password before submission
        password: encrypt(values.newPassword) // Encrypt new password before submission
      };
      mutate(data); // Call the mutate function to trigger API request
    }
  });

  // Mutation for API call to change password
  const { mutate } = useMutation(api.changePassword, {
    onSuccess: (data) => {
      setLoading(false); // Disable loading on success
      formik.resetForm(); // Reset form after successful submission
      dispatch(setToastMessage({ message: data.message, variant: 'success' })); // Show success message
      setOldPassword(false); // Reset password visibility states
      setNewPassword(false);
      setConfirmPassword(false);
      router.push('/admin/dashboard');
    },
    onError: (err) => {
      setLoading(false); // Disable loading on error
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error message
    }
  });

  // Redirect admins to the admin change password page if they try to access this page
  React.useEffect(() => {
    if (!pathname.includes('admin') && user?.role.includes('admin')) {
      router.push('/admin/change-password');
      dispatch(setToastMessage({ message: "Admin can't access this page.", variant: 'error' }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Destructure formik hooks
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <Box>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={4} mb={4}>
            <Typography variant="h5" gutterBottom color="primary.main" textTransform="uppercase">
              Change Password
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" size="large" onClick={() => router.back()}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" size="large" loading={loading}>
                Save
              </LoadingButton>
            </Stack>
          </Stack>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <TextField
                    id="old-password"
                    fullWidth
                    required
                    variant="standard"
                    label="Current Password"
                    autoComplete="on"
                    type={oldPassword ? 'text' : 'password'}
                    {...getFieldProps('oldPassword')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                          <IconButton edge="end" onClick={() => setOldPassword((prev) => !prev)}>
                            {oldPassword ? <VisibilityOffIcon size={24} /> : <VisibilityIcon size={24} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.oldPassword && errors.oldPassword)}
                    helperText={touched.oldPassword && errors.oldPassword}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    id="new-password"
                    fullWidth
                    required
                    variant="standard"
                    label="Enter New Password"
                    autoComplete="on"
                    type={newPassword ? 'text' : 'password'}
                    {...getFieldProps('newPassword')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                          <IconButton edge="end" onClick={() => setNewPassword((prev) => !prev)}>
                            {newPassword ? <VisibilityOffIcon size={24} /> : <VisibilityIcon size={24} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    id="confirm-new-password"
                    fullWidth
                    required
                    variant="standard"
                    label="Confirm New Password"
                    autoComplete="on"
                    type={confirmPassword ? 'text' : 'password'}
                    {...getFieldProps('confirmPassword')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                          <IconButton edge="end" onClick={() => setConfirmPassword((prev) => !prev)}>
                            {confirmPassword ? <VisibilityOffIcon size={24} /> : <VisibilityIcon size={24} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Form>
      </FormikProvider>
    </Box>
  );
}
