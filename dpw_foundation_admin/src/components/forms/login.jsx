'use client';

import RouterLink from 'next/link';
import { useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

// formik
import { Form, FormikProvider, useFormik } from 'formik';
// cookies
import { createCookies } from 'src/hooks/cookies';
// redux
import { useDispatch } from 'react-redux';
import { setLogin } from 'src/redux/slices/user';
// api
import * as api from 'src/services';
// mui
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, TextField } from '@mui/material';
// icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import useAesEncryption from 'src/hooks/useAesEncryption';
import { setToastMessage } from 'src/redux/slices/common';
import { setAssignedRoles } from 'src/redux/slices/roles';
import { NextWhiteArrow } from '../icons';

/**
 * LoginForm Component
 * Handles user authentication by validating credentials, managing state, and redirecting users based on roles.
 */
export default function LoginForm() {
  const router = useRouter(); // Router for navigation
  const dispatch = useDispatch(); // Redux dispatch for global state updates

  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  // Destructure the encrypt function from the custom AES encryption hook
  const { encrypt } = useAesEncryption();

  // Mutation for assigning roles to the logged-in user
  const { mutate: assignRolesMutate, isLoading: assignRolesLoading } = useMutation('assignRoles', api.assignRoles, {
    onSuccess: async (response) => {
      const roles = response?.data?.assignedFunctions; // Extract assigned roles
      dispatch(setAssignedRoles(roles)); // Update Redux state with roles
      await createCookies('assignRoles', roles); // Save roles in cookies
      router.push('/admin/dashboard'); // Redirect user to the dashboard
      // Redirect user based on their roles and permissions
      // if (roles.length) {
      //   const redirectPath = navLinks.find((route) =>
      //     route.permission.some((permission) => roles.includes(permission))
      //   );
      //   if (redirectPath?.path) {
      //     router.push(redirectPath.path); // Navigate to the first accessible page
      //   }
      // } else {
      //   router.push('/unauthorized'); // Redirect to unauthorized page
      // }
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' })); // Show error message
    }
  });

  // Mutation for handling login functionality
  const { mutate, isLoading: loginLoading } = useMutation(api.login, {
    onSuccess: async (data) => {
      // Save user details in Redux store
      dispatch(
        setLogin({
          email: data?.data?.email,
          firstName: data?.data?.firstName,
          lastName: data?.data?.lastName,
          phone: data?.data?.phone,
          role: data?.data?.roles,
          userId: data?.data?.userId
        })
      );

      // Save tokens in cookies
      await createCookies('adminToken', data?.data?.token);
      await createCookies('refreshAdminToken', data?.data?.refreshToken);

      // Trigger role assignment after successful login
      assignRolesMutate();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error message
    }
  });

  // Regular expression for validating email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const LoginSchema = Yup.object().shape({
    email: Yup.string().matches(emailRegex, 'Enter a valid username').required('Username is required.'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$)/,
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces'
      )
      .required('Password is required')
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '', // Default email value
      password: '', // Default password value
      remember: true // Default remember me state
    },
    validationSchema: LoginSchema, // Form validation schema
    onSubmit: async (values) => {
      const { email, password } = values;
      const encryptedPassword = encrypt(password); // Encrypt password before sending to the backend
      mutate({ email: email, password: encryptedPassword }); // Trigger login mutation
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            id="email"
            variant="standard"
            label="Username"
            required
            fullWidth
            autoComplete="username"
            type="email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
          <TextField
            id="password"
            fullWidth
            variant="standard"
            label="Password"
            required
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
            loading={loginLoading || assignRolesLoading}
            endIcon={<NextWhiteArrow />}
          >
            login
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
