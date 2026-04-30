'use client';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// mui
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
import useAesEncryption from 'src/hooks/useAesEncryption';
import { setToastMessage } from 'src/redux/slices/common';
export default function AccountChangePassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState(false);
  const { encrypt } = useAesEncryption();
  const { profileData } = useSelector((state) => state.profile);

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Short password')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$)/,
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces'
      )
      .required('New password is required'),
    confirmPassword: Yup.string()
      .required('Confirm New password is required')
      .oneOf([Yup.ref('newPassword')], 'Passwords do not match.')
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const oldPassword = encrypt(values.oldPassword);
      const newPassword = encrypt(values.newPassword);
      const data = {
        oldPassword: oldPassword,
        password: newPassword,
        email: profileData?.email
      };
      mutate(data);
    }
  });

  const { mutate } = useMutation(api.changePassword, {
    onSuccess: (res) => {
      setLoading(false);
      formik.resetForm();
      dispatch(setToastMessage({ message: res.message, variant: 'success' }));
      router.back();
    },
    onError: (err) => {
      setLoading(false);
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;
  return (
    <Box>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={4} direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography textAlign="center" variant="h5" color="primary.main" textTransform="uppercase">
              Change Password
            </Typography>
            <Stack spacing={2} direction="row">
              <Button type="button" variant="outlined" size="large" onClick={() => router.back()}>
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
                <Grid item xs={12} md={6}>
                  <TextField
                    id="old-password"
                    {...getFieldProps('oldPassword')}
                    variant="standard"
                    fullWidth
                    required
                    label="Current Password"
                    autoComplete="on"
                    type={oldPassword ? 'text' : 'password'}
                    error={Boolean(touched.oldPassword && errors.oldPassword)}
                    helperText={touched.oldPassword && errors.oldPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setOldPassword((prev) => !prev)}>
                            {oldPassword ? <VisibilityOffIcon size={24} /> : <RemoveRedEyeIcon size={24} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="new-password"
                    {...getFieldProps('newPassword')}
                    fullWidth
                    required
                    autoComplete="on"
                    variant="standard"
                    label="Enter New Password"
                    type={newPassword ? 'text' : 'password'}
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    // helperText={
                    //   (touched.newPassword && errors.newPassword) ||
                    //   'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces'
                    // }
                    helperText={touched.newPassword && errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setNewPassword((prev) => !prev)}>
                            {newPassword ? <VisibilityOffIcon size={24} /> : <RemoveRedEyeIcon size={24} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="confirm-new-password"
                    {...getFieldProps('confirmPassword')}
                    fullWidth
                    autoComplete="on"
                    required
                    label="Confirm New Password"
                    variant="standard"
                    type={confirmPassword ? 'text' : 'password'}
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setConfirmPassword((prev) => !prev)}>
                            {confirmPassword ? <VisibilityOffIcon size={24} /> : <RemoveRedEyeIcon size={24} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
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
