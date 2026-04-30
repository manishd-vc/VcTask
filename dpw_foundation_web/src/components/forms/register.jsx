'use client';
import { useRouter } from 'next-nprogress-bar'; // Import useRouter hook from next-nprogress-bar for routing
import RouterLink from 'next/link'; // Import Link from Next.js to enable navigation
import { useState } from 'react'; // Import useState to manage local state in the component
import { setToastMessage } from 'src/redux/slices/common'; // Import Redux action for displaying toast messages

// Import Yup for schema validation
import * as Yup from 'yup';
// Import Formik components for form management
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
// Import React Query's useMutation hook for handling async operations
import { useMutation } from 'react-query';
// Import API services
import * as api from 'src/services';
// Import MUI components for UI
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
// Import icons for password visibility toggle
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// Import custom hooks and components
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'; // Custom phone number input component
import { useDispatch } from 'react-redux'; // Import useDispatch for dispatching actions to Redux
import AuthThemeStyles from 'src/app/auth/auth.theme.styles'; // Import custom theme styles for authentication
import useAesEncryption from 'src/hooks/useAesEncryption'; // Import custom hook for AES encryption
import { gtmEvents } from 'src/lib/gtmEvents';
import { defaultCountry, preferredCountries } from 'src/utils/util';
import ModalStyle from '../dialog/dialog.style';
import { CloseIcon, NextWhiteArrow } from '../icons'; // Import custom icon component
import TextFieldSelect from '../TextFieldSelect';

/**
 * RegisterForm component handles user registration.
 * It manages form state, validation, and submission using Formik and Yup.
 * @returns {JSX.Element} The registration form UI
 */
export default function RegisterForm() {
  const theme = useTheme(); // Use the theme hook to access the theme object (e.g., colors, typography)
  const style = ModalStyle(theme); // Apply the modal-specific styles based on the theme
  const router = useRouter(); // Initialize router for navigation
  const dispatch = useDispatch(); // Initialize dispatch for Redux actions
  const { encrypt } = useAesEncryption(); // Initialize AES encryption
  const [loading, setLoading] = useState(false); // State for managing loading indicator
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [openDisclaimerPopup, setOpenDisclaimerPopup] = useState(false); // Open popup by default

  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Define Yup validation schema for the registration form
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().max(50, 'Too long!').required('First Name is required'),
    lastName: Yup.string().max(50, 'Too long!').required('Second Name is required'),
    email: Yup.string().matches(emailRegex, 'Enter a valid email').required('Email is required.'),
    mobile: Yup.string().required('Phone number is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$)/,
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces'
      )
      .min(8, 'Password should be 8 characters or longer.'),
    disclaimerAccepted: Yup.boolean()
      // .oneOf([true], 'You must certify that the information is correct')
      .required('Required')
  });
  const accountTypeOption = [
    {
      code: 'Individual',
      description: 'Individual',
      label: 'Individual',
      status: 'ACTIVE'
    },
    {
      code: 'Organization',
      description: 'Organization',
      label: 'Organization',
      status: 'ACTIVE'
    }
  ];
  // Initialize Formik with initial values, validation schema, and onSubmit handler
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      mobile: '+971',
      email: '',
      accountType: '',
      password: '',
      disclaimerAccepted: false
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      gtmEvents.signupInitiate();
      setLoading(true); // Set loading state to true during submission
      if (matchIsValidTel(values.mobile)) {
        const encryptedPassword = encrypt(values.password); // Encrypt password before sending
        const payload = {
          ...values,
          password: encryptedPassword // Replace plain password with encrypted password
        };
        await mutate(payload); // Call the mutate function to submit data
      } else {
        setLoading(false);
        formik.setFieldError('mobile', 'Please enter valid mobile'); // Show error if phone number is invalid
      }
    }
  });

  // Use React Query's useMutation hook to handle registration API call
  const { mutate } = useMutation(api.register, {
    onSuccess: async (response) => {
      const gtmUser = {
        id: response.data?.id, // SSO ID
        roles: response.data?.roles, // Array of roles
        accountType: response.data?.accountType, // User type
        organization_id: response.data?.organizationId,
        organization_role: response.data?.organizationRole,
        organization_name: response.data?.organizationName
      };

      gtmEvents.signupSuccess(gtmUser);
      dispatch(setToastMessage({ message: response.message, variant: 'success' })); // Show success message
      setLoading(false); // Reset loading state
      router.push(`/auth/login`); // Redirect to login page
    },
    onError: (err) => {
      const message = err.response?.data?.message ?? 'Signup failed';
      gtmEvents.signupError(message); //  Trigger GTM error event
      dispatch(setToastMessage({ message, variant: 'error' })); // Show error message
      setLoading(false); // Reset loading state
    }
  });
  // Extract Formik's form state and handlers
  const { errors, touched, handleSubmit, values, getFieldProps, setFieldValue } = formik;

  return (
    <>
      <Dialog open={openDisclaimerPopup} maxWidth="md">
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          Terms & Conditions
        </DialogTitle>
        <IconButton
          sx={style.closeModal} // Apply custom style for the close button
          onClick={() => {
            setOpenDisclaimerPopup(false);
            setFieldValue('disclaimerAccepted', false); // Keep unchecked if user closes
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <Typography variant="body1" color="text.secondarydark" component="p">
            By creating an account with the DP World Foundation platform, you agree to the following:
          </Typography>
          <Typography component="ul" my={2} pl={3} color={'text.secondarydark'}>
            <Typography component="li">You will use the platform in a responsible and lawful manner.</Typography>
            <Typography component="li">All information you provide is accurate and kept up to date.</Typography>
            <Typography component="li">
              You consent to the secure handling of your data in accordance with our Privacy Policy.
            </Typography>
            <Typography component="li">
              You understand that your engagement on the platform may include updates about our causes, donation
              opportunities, events and volunteer activities.
            </Typography>
          </Typography>
          <Typography variant="body1" color="text.secondarydark" component="p">
            DP World Foundation is committed to protecting your privacy, promoting transparency, and upholding the
            highest ethical standards in all interactions.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={() => {
              setOpenDisclaimerPopup(false);
              setFieldValue('disclaimerAccepted', true);
            }}
            variant="contained"
          >
            I AGREE
          </Button>
        </DialogActions>
      </Dialog>

      <Typography textAlign="center" variant="h5" color={'primary.main'} sx={AuthThemeStyles.authTitle}>
        Register
      </Typography>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                id="firstName"
                fullWidth
                label={
                  <>
                    First Name{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                type="text"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="lastName"
                fullWidth
                label={
                  <>
                    Second Name{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                type="text"
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="email"
                fullWidth
                label={
                  <>
                    Email ID{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                autoComplete="username"
                type="email"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MuiTelInput
                label={
                  <>
                    Phone Number{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                id="phone"
                preferredCountries={preferredCountries}
                defaultCountry={defaultCountry}
                fullWidth
                value={values.mobile}
                variant="standard"
                onChange={(value) => {
                  setFieldValue('mobile', value); // Update mobile number in Formik's state
                }}
                error={Boolean(touched.mobile && errors.mobile)}
                helperText={touched.mobile && errors.mobile}
                sx={{
                  '& .MuiInputAdornment-root .MuiButtonBase-root': {
                    right: 6
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextFieldSelect
                id="accountType"
                label={
                  <>
                    Register As{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                {...getFieldProps('accountType')}
                itemsData={accountTypeOption}
                error={Boolean(touched.nationalId && errors.nationalId)}
                sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
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
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <VisibilityOffIcon size={24} /> : <VisibilityIcon size={24} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Field
                    as={Checkbox}
                    name="disclaimerAccepted"
                    checked={values.disclaimerAccepted}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOpenDisclaimerPopup(true);
                      } else setFieldValue('disclaimerAccepted', e.target.checked);
                    }}
                  />
                }
                label={
                  <span>
                    I certify that the information given within this form is correct and that I have not omitted or
                    misrepresented any details.{' '}
                    <span
                      style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => setOpenDisclaimerPopup(true)} // Optional: make it clickable to open terms
                    >
                      View Terms & Conditions
                    </span>
                  </span>
                }
                // label="I certify that the information given within this form is correct and that I have not omitted or misrepresented any details"
              />
              <FormHelperText error>
                <ErrorMessage name="disclaimerAccepted" />
              </FormHelperText>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <LoadingButton
              sx={{ textAlign: 'center' }}
              size="large"
              type="submit"
              variant="contained"
              loading={loading} // Show loading indicator while processing
              endIcon={<NextWhiteArrow />}
            >
              Submit
            </LoadingButton>
          </Stack>

          {/* Divider and Login Link */}
          <Divider variant="customGradient" />
          <Typography variant="subtitle1" color="text.secondarydark" align="center">
            Already Registered? &nbsp;
            <Link
              href={`/auth/login${router.query?.redirect ? '?redirect=' + router.query?.redirect : ''}`}
              component={RouterLink}
              variant="muilink"
              color="secondary"
              underline="always"
            >
              Login Here
            </Link>
          </Typography>
        </Form>
      </FormikProvider>
    </>
  );
}
