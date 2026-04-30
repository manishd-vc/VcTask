'use client';
import { LoadingButton } from '@mui/lab';
import { Grid, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { MuiTelInput } from 'mui-tel-input';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { RightArrowIcon } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { gtmEvents } from 'src/lib/gtmEvents';
import { setToastMessage } from 'src/redux/slices/common';
import {
  resetUserByEmailFormState,
  setDisableArrow,
  setIsExistingUser,
  setShowConfirmEmail,
  setUserData
} from 'src/redux/slices/user-by-email';
import * as api from 'src/services';
import { defaultCountry, preferredCountries } from 'src/utils/constants';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as Yup from 'yup';

export default function GetUserByEmail({
  type,
  onEmailChange = () => {},
  intentGrantRequest,
  isResetForm,
  onSuccess,
  onCreateSuccess,
  onFail
}) {
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const { showConfirmEmail, disableArrow, isExistingUser, userData } = useSelector((state) => state.userByEmail);

  const registeredAs = getLabelObject(masterData, 'dpw_foundation_campaign_register_as');

  const validationSchema = Yup.object().shape({
    ...(!isExistingUser && {
      email: Yup.string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter a valid email')
        .required('Email is required.'),
      accountType:
        type !== 'PARTNER_ADMIN' && type !== 'VOLUNTEER_ADMIN'
          ? Yup.string().required('Registered As is required.')
          : Yup.string().notRequired(),
      firstName: Yup.string()
        .required('First Name is required.')
        .matches(/^[a-zA-Z\s]*$/, 'Second Name must contain only alphabets and spaces')
        .max(255, 'First Name must not exceed 255 characters'),
      lastName: Yup.string()
        .required('Second Name is required.')
        .matches(/^[a-zA-Z\s]*$/, 'Second Name must contain only alphabets and spaces')
        .max(255, 'Second Name must not exceed 255 characters'),
      mobile: Yup.string()
        .required('Phone number is required')
        .test('is-valid-phone', 'Please enter a valid Phone number', function (value) {
          if (!value) {
            return true;
          }
          try {
            const isValid = isValidPhoneNumber(value);

            if (!isValid) {
              return this.createError({
                message: 'The Phone number is not valid.'
              });
            }
            return true;
          } catch (error) {
            return this.createError({
              message: 'Invalid phone number format.'
            });
          }
        }),
      confirmEmail: Yup.string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter a valid email')
        .required('Confirm Email is required.')
        .oneOf([Yup.ref('email')], 'Emails must match')
    })
  });

  const formInitialValues = {
    email: userData?.email || '',
    accountType: userData?.accountType || '',
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    mobile: userData?.mobile || '',
    confirmEmail: ''
  };

  const accountTypePayload = (values) => {
    switch (type) {
      case 'PARTNER_ADMIN':
        return 'Organization';
      case 'VOLUNTEER_ADMIN':
        return 'Individual';
      default:
        return values?.accountType;
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formInitialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const createUserPayload = {
        from: type,
        email: values?.email?.trim(),
        firstName: values?.firstName,
        lastName: values?.lastName,
        mobile: values?.mobile,
        accountType: accountTypePayload(values)
      };
      createUser(createUserPayload);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });
  const { handleSubmit, setValues, values, errors, touched, getFieldProps, handleBlur, setFieldValue, resetForm } =
    formik;

  const getHelperText = (fieldName, limit) => {
    const fieldValue = values?.[fieldName] || '';
    if (fieldValue.length > limit) {
      return `Character limit exceeded (${limit} characters maximum)`;
    }
    return (touched[fieldName] && errors[fieldName]) || '';
  };
  const resetPledgeForm = (email = '') => {
    setValues({
      email: email,
      accountType: '',
      firstName: '',
      lastName: '',
      mobile: '',
      confirmEmail: ''
    });
  };
  useEffect(() => {
    resetPledgeForm('');
    dispatch(resetUserByEmailFormState());
  }, [isResetForm]);

  const { mutate, isLoading } = useMutation(api.fetchDonorByEmailId, {
    onSuccess: (response) => {
      const { data, message, status } = response;
      if (!data) {
        if (status === 400) {
          dispatch(setToastMessage({ message: message, variant: 'error' }));
          return;
        }
        dispatch(setShowConfirmEmail(true));
        dispatch(setIsExistingUser(false));
        dispatch(setToastMessage({ message: message, variant: 'error' }));
        resetPledgeForm(values?.email);
        onFail?.(values?.email);
        return;
      }
      dispatch(setShowConfirmEmail(false));
      dispatch(setIsExistingUser(true));
      dispatch(setUserData(data));
      intentGrantRequest && intentGrantRequest({ userId: data?.id });
      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsExistingUser(false));
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
      resetPledgeForm(values?.email);
      onFail?.(values?.email);
    }
  });

  const { mutate: createUser, isLoading: isCreateUserLoading } = useMutation(api.createNewPledge, {
    onSuccess: (response) => {
      const { data, message } = response;
      dispatch(setToastMessage({ message: message, variant: 'success' }));
      dispatch(setShowConfirmEmail(false));
      dispatch(setIsExistingUser(true));
      dispatch(setUserData(data));
      intentGrantRequest && intentGrantRequest({ userId: data?.id });
      onCreateSuccess?.(data);
      // Trigger GTM signup success event here
      const gtmUser = {
        id: data?.id, // SSO ID or internal user ID
        roles: data?.roles, // roles array from backend
        accountType: data?.accountType, // user type
        organization_id: data?.organizationId || '',
        organization_role: data?.organizationRole || '',
        organization_name: data?.organizationName || ''
      };
      gtmEvents.signupSuccess(gtmUser);
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
    }
  });

  const handleOnChangeEmail = (event) => {
    resetForm();
    resetPledgeForm(event?.target?.value?.toLowerCase());
    dispatch(setDisableArrow(false));
    dispatch(setShowConfirmEmail(false));
    dispatch(setIsExistingUser(false));
    onEmailChange?.(event?.target?.value?.toLowerCase());
  };

  const handleCheckEmail = () => {
    mutate(values?.email?.trim());
    dispatch(setDisableArrow(true));
  };

  const renderUserType = () => {
    switch (type) {
      case 'PARTNER_ADMIN':
        return (
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              Organization
            </Typography>
          </Stack>
        );
      case 'VOLUNTEER_ADMIN':
        return (
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              Individual
            </Typography>
          </Stack>
        );
      default:
        return (
          <FieldWithSkeleton isLoading={isCreateUserLoading} error={touched.accountType && errors.accountType}>
            <TextFieldSelect
              id="accountType"
              label="Select Registered As"
              value={values?.accountType}
              getFieldProps={getFieldProps}
              itemsData={registeredAs?.values}
              required
              error={Boolean(touched.accountType && errors.accountType)}
            />
          </FieldWithSkeleton>
        );
    }
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton isLoading={isLoading || isCreateUserLoading} error={touched.email && errors.email}>
                <TextField
                  id="email"
                  variant="standard"
                  label="Enter Email ID"
                  required
                  {...getFieldProps('email')}
                  fullWidth
                  onChange={handleOnChangeEmail}
                  onBlur={handleBlur('email')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={handleCheckEmail}
                          disabled={disableArrow || !values.email?.trim() || (touched.email && errors.email)}
                          sx={{
                            '&:disabled': {
                              opacity: 0.4
                            }
                          }}
                        >
                          <RightArrowIcon height={35} width={35} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    type: 'email',
                    readOnly: false
                  }}
                  error={Boolean(touched.email && errors.email)}
                />
              </FieldWithSkeleton>
            </Grid>
            {showConfirmEmail && (
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton
                  isLoading={isLoading || isCreateUserLoading}
                  error={touched.confirmEmail && errors.confirmEmail}
                >
                  <TextField
                    id="confirmEmail"
                    variant="standard"
                    label="Enter Confirm Email ID"
                    required
                    {...getFieldProps('confirmEmail')}
                    fullWidth
                    onChange={(e) => {
                      setFieldValue('confirmEmail', e.target.value.toLowerCase());
                    }}
                    onBlur={handleBlur('confirmEmail')}
                    error={touched.confirmEmail && errors.confirmEmail}
                  />
                </FieldWithSkeleton>
              </Grid>
            )}

            {showConfirmEmail && (
              <Grid container item spacing={3}>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={isCreateUserLoading}>
                    <TextField
                      id="firstName"
                      variant="standard"
                      label="Enter First Name"
                      required
                      {...getFieldProps('firstName')}
                      fullWidth
                      onBlur={handleBlur('firstName')}
                      error={Boolean(touched.firstName && errors.firstName) || values?.firstName?.length > 255}
                      helperText={getHelperText('firstName', 255)}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(newValue)) {
                          setFieldValue('firstName', newValue);
                        }
                      }}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={isCreateUserLoading}>
                    <TextField
                      id="lastName"
                      variant="standard"
                      label="Enter Second Name"
                      required
                      {...getFieldProps('lastName')}
                      fullWidth
                      onBlur={handleBlur('lastName')}
                      error={Boolean(touched.lastName && errors.lastName) || values?.lastName?.length > 255}
                      helperText={getHelperText('lastName', 255)}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(newValue)) {
                          setFieldValue('lastName', newValue);
                        }
                      }}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={isCreateUserLoading}>
                    <MuiTelInput
                      label="Enter Phone Number"
                      id="mobile"
                      preferredCountries={preferredCountries}
                      defaultCountry={defaultCountry}
                      fullWidth
                      value={values.mobile}
                      onChange={(value) => {
                        const cleanedValue = value ? value.replace(/\s/g, '') : '';
                        setFieldValue('mobile', cleanedValue);
                      }}
                      onBlur={handleBlur('mobile')}
                      variant="standard"
                      error={touched.mobile && Boolean(errors.mobile)}
                      helperText={touched.mobile && errors.mobile}
                      sx={{
                        '& .MuiInputAdornment-root .MuiButtonBase-root': {
                          right: 6
                        }
                      }}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderUserType()}
                </Grid>
              </Grid>
            )}
            {!isExistingUser && showConfirmEmail && (
              <Grid item xs={12}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={isCreateUserLoading}
                  disabled={isCreateUserLoading}
                  type="submit"
                  size="small"
                >
                  Create User
                </LoadingButton>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Form>
    </FormikProvider>
  );
}

GetUserByEmail.propTypes = {
  type: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func,
  intentGrantRequest: PropTypes.func,
  isResetForm: PropTypes.bool,
  onSuccess: PropTypes.func,
  onCreateSuccess: PropTypes.func,
  onFail: PropTypes.func
};
