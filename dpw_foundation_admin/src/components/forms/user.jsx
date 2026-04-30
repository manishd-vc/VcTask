'use client';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
// mui
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
// api
import * as api from 'src/services';
// yup
import * as Yup from 'yup';
// formik
import { LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import { Form, FormikProvider, useFormik } from 'formik';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { matchIsValidTel, MuiTelInput } from 'mui-tel-input';
import { useRouter } from 'next-nprogress-bar';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import { defaultCountry, preferredCountries } from 'src/utils/constants';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateM, fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import ProfileStyle from '../_admin/donor/steps/profile.style';
import ProfilePicture from '../_admin/users/profilePicture';
import DatePickers from '../datePicker';
import RestoreUser from '../dialog/restoreUser';
import FileUpload from '../fileUpload';
import { BackArrow, DeleteIconRed } from '../icons';
import TextFieldSelect from '../TextFieldSelect';
import FormStyle from './form.styles';
UserForm.propTypes = {
  // 'isView' is a boolean to determine if the form is in view-only mode
  isView: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean to determine if the form is in edit mode
  isEdit: PropTypes.bool.isRequired,
  isProfile: PropTypes.bool.isRequired
};

const getFieldError = (touched, errors, fieldName) => {
  return Boolean(touched[fieldName] && errors[fieldName]);
};

const getFieldHelperText = (touched, errors, fieldName) => {
  return touched[fieldName] && errors[fieldName];
};

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

/**
 * UserForm Component
 *
 * Manages the form for creating, editing, and viewing user details.
 * Handles form validation, submission, and conditional rendering based on `isView` and `isEdit` props.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isView - If true, renders the form in view-only mode.
 * @param {boolean} props.isEdit - If true, renders the form in edit mode.
 * @returns {JSX.Element} - Rendered UserForm component.
 */
export default function UserForm({ isView, isEdit, isProfile }) {
  const theme = useTheme();
  const router = useRouter();
  const styles = {
    ...FormStyle(theme),
    ...ProfileStyle(theme)
  };
  const params = useParams();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const salutations = getLabelObject(masterData, 'dpw_foundation_user_salutation');
  const maritalStatus = getLabelObject(masterData, 'dpw_foundation_user_marital_status');
  const genders = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const preferredCommunications = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');
  const [profileImg, setProfileImg] = React.useState('');
  const [updateImage, setUpdateImage] = React.useState(false);
  const documentIndex = useRef(0);
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);
  const { data: role } = useQuery(['roles'], () => api.getAllRoles(''));
  const {
    data: userData,
    isLoading: userLoading,
    refetch: userRefetch
  } = useQuery(['getUser', params.id], () => api.getUserByAdmin(params.id), {
    enabled: !!params.id,
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  // Utility function to format dates with fallback to '-'
  const formatDateWithFallback = (date) => {
    return date ? fDateWithLocale(date) : '-';
  };

  // Mutation for form submission
  const mutationConfig = {
    retry: false,
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      router.back();
    },
    onError: (error) => dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }))
  };
  const { mutate, isLoading } = useMutation(isEdit ? api.updateUserByAdmin : api.addUserByAdmin, mutationConfig);

  // Form validation schema
  const UserSchema = Yup.object().shape({
    employeeId: Yup.string().required('Employee ID is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Second Name is required'),
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
    emergencyContactNumber: Yup.string().test(
      'is-valid-phone',
      'Please enter a valid emergency contact number',
      function (value) {
        if (!value) {
          return true;
        }
        try {
          const isValid = isValidPhoneNumber(value);

          if (!isValid) {
            return this.createError({
              message: 'The emergency contact number is not valid.'
            });
          }
          return true;
        } catch (error) {
          return this.createError({
            message: 'Invalid phone number format.'
          });
        }
      }
    ),
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter a valid email')
      .required('Email ID is required.'),
    roles: Yup.array().of(Yup.string().required('Role is required')).min(1, 'At least one role is required')
  });

  const getInitialValues = (value, defaultValue) => value ?? defaultValue;
  // Fetching country data
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  useEffect(() => {
    if (userData?.photoFileUrl) {
      setProfileImg(userData?.photoFileUrl);
    }
  }, [userData?.photoFileUrl]);

  const formik = useFormik({
    initialValues: {
      firstName: getInitialValues(userData?.firstName, ''),
      lastName: getInitialValues(userData?.lastName, ''),
      email: getInitialValues(userData?.email, ''),
      mobile: getInitialValues(userData?.mobile, ''),
      currentCountryOfResidence: getInitialValues(userData?.currentCountryOfResidence, ''),
      state: getInitialValues(userData?.state, ''),
      city: getInitialValues(userData?.city, ''),
      roles: getInitialValues(
        userData?.roles.map((role) => role.name),
        []
      ),
      status: getInitialValues(userData?.status, 'Active'),
      employeeId: getInitialValues(userData?.employeeId, ''),
      maritalStatus: getInitialValues(userData?.maritalStatus, ''),
      dob: getInitialValues(userData?.dob, ''),
      joinDate: getInitialValues(userData?.joinDate, ''),
      documentType: getInitialValues(userData?.documentType, ''),
      documentNumber: getInitialValues(userData?.documentNumber, ''),
      documentValidity: getInitialValues(userData?.documentValidity, ''),
      gender: getInitialValues(userData?.gender, ''),
      homeAddress: getInitialValues(userData?.homeAddress, ''),
      mailingAddress: getInitialValues(userData?.mailingAddress, ''),
      preferredCommunication: getInitialValues(userData?.preferredCommunication, ''),
      salutation: getInitialValues(userData?.salutation, ''),
      emergencyContactName: getInitialValues(userData?.emergencyContactName, ''),
      emergencyContactNumber: getInitialValues(userData?.emergencyContactNumber, ''),
      documentDetails:
        Array.isArray(userData?.documentDetails) && userData.documentDetails.length > 0
          ? userData.documentDetails.map((doc) => ({
              id: doc?.id || '',
              documentType: doc?.documentType || '',
              documentNumber: doc?.documentNumber || '',
              documentValidity: doc?.documentValidity ? new Date(doc.documentValidity) : null,
              documentImageId: doc?.documentImageId || '',
              fileName: doc?.fileName || '',
              preSignedUrl: doc?.preSignedUrl || ''
            }))
          : []
    },
    enableReinitialize: true,
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      if (matchIsValidTel(values.mobile)) {
        const data = { ...values };
        if (data['dob']) {
          data['dob'] = format(new Date(data['dob']), "yyyy-MM-dd'T'HH:mm:ss");
        }
        if (data['documentValidity']) {
          data['documentValidity'] = format(new Date(data['documentValidity']), "yyyy-MM-dd'T'HH:mm:ss");
        }
        if (data['joinDate']) {
          data['joinDate'] = format(new Date(data['joinDate']), 'yyyy-MM-dd');
        }
        if (data['mobile']) {
          data['mobile'] = data['mobile'].replace(/\s/g, '');
        }

        mutate(isEdit ? { ...data, id: userData.id } : { ...data });
      } else {
        formik.setFieldError('mobile', 'Please enter valid mobile'); // Show error if phone number is invalid
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps, setFieldValue, handleBlur } = formik;

  const { data: projectStateData } = useQuery(
    ['getStates', values?.currentCountryOfResidence],
    () => api.getStates(values?.currentCountryOfResidence),
    {
      enabled: !!values?.currentCountryOfResidence, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching city data based on selected state
  const { data: citiesData } = useQuery(
    ['getCities', values?.state],
    () => api.getCities(values?.currentCountryOfResidence, values?.state),
    {
      enabled: !!values?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );
  const countryLabel = country?.find((item) => item?.code === userData?.currentCountryOfResidence)?.label;
  const stateLabel = projectStateData?.find((item) => item?.code === userData?.state)?.label;
  const cityLabel = citiesData?.find((item) => item?.code === userData?.city)?.label;

  const getUserStatusText = (isView, id) => {
    if (isView) {
      return 'View USER';
    } else if (id) {
      return 'Edit USER';
    } else {
      return 'Create New User';
    }
  };

  const { mutate: uploadProfileMutate } = useMutation('uploadProfile', api.uploadProfilePhoto, {
    onSuccess: (response) => {
      setProfileImg(response?.data?.data);
      setUpdateImage(!updateImage);
      userRefetch();
      dispatch(setToastMessage({ message: response?.message, title: 'Success' }));
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error.response.data.message || error.response.data.detail,
          variant: 'error',
          title: 'Error'
        })
      );
    }
  });
  const handleSelectProfile = (files) => {
    handleFileUploadValidation(files, {
      mutate: uploadProfileMutate,
      entityId: userData?.id,
      setToastMessage,
      dispatch
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const { mutate: mutateDocument } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const updatedDocuments = [...values.documentDetails];
      updatedDocuments[documentIndex.current] = {
        ...updatedDocuments[documentIndex.current],
        documentImageId: response.data.id,
        fileName: response.data.fileName
      };
      setFieldValue('documentDetails', updatedDocuments);
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
    }
  });
  const { mutate: deleteMediaMutation } = useMutation('deleteMedia', api.deleteDocumentMedia, {
    onSuccess: (response, variables) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const updatedDocuments = values.documentDetails.map((doc) => {
        if (doc.documentImageId === variables.id) {
          return { ...doc, documentImageId: '', fileName: '' };
        }
        return doc;
      });
      setFieldValue('documentDetails', updatedDocuments);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });
  const handleDocumentsDeleteFile = (id) => {
    if (id) {
      deleteMediaMutation({
        id: id,
        userId: userData?.id
      });
    }
  };
  const handleDocumentFileUpload = (files, index, fieldName, entityType, moduleType) => {
    documentIndex.current = index;
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);
    if (files?.length + values[fieldName]?.length > uploadCount) {
      dispatch(
        setToastMessage({
          message: `You can only upload ${uploadCount} files in the ${fieldName}.`,
          variant: 'warning'
        })
      );
      return;
    }
    validFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      mutateDocument({ entityId: userData?.id, entityType, moduleType, payload: formData });
    });
  };
  const remove = (indexToRemove) => {
    const updatedDocuments = values.documentDetails.filter((_, i) => i !== indexToRemove);
    setFieldValue('documentDetails', updatedDocuments);
  };
  const getFilteredDocumentTypes = (currentIndex) => {
    // Get all selected document types except the one for the current index
    const selectedTypes = values.documentDetails
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);

    // Filter document types to exclude already selected types
    return documentTypes?.values?.filter((opt) => !selectedTypes.includes(opt.code));
  };
  const areAllDocumentsFilled = () => {
    const selectedTypes = values.documentDetails.map((doc) => doc.documentType).filter(Boolean);

    const uniqueSelected = new Set(selectedTypes);
    const maxTypes = documentTypes?.values?.length || 0;

    return values.documentDetails.length >= maxTypes || uniqueSelected.size >= maxTypes;
  };
  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });
  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };
  return (
    <Box position="relative">
      <Dialog aria-label="Restore-user" onClose={handleClose} open={open} maxWidth={'sm'}>
        <RestoreUser onClose={handleClose} id={params.id} refetch={userRefetch} />
      </Dialog>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Stack
            spacing={3}
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mb={3}
          >
            {!isProfile && (
              <Button
                variant="text"
                startIcon={<BackArrow />}
                onClick={() => router.back()}
                sx={{
                  mb: { xs: 3 },
                  '&:hover': { textDecoration: 'none' }
                }}
              >
                Back
              </Button>
            )}
            {isProfile && (
              <Typography textAlign="center" variant="h5" color="primary.main" textTransform="uppercase">
                My Profile
              </Typography>
            )}
            <Stack direction="row" spacing={2}>
              {!isView && (
                <>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.back()}
                    sx={{
                      width: { xs: '48%', sm: 'auto' }
                    }}
                  >
                    Cancel
                  </Button>
                  {!userLoading && (
                    <LoadingButton
                      width={'100%'}
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isLoading}
                      sx={styles.createBtn}
                    >
                      {isEdit ? 'Save' : 'Submit'}
                    </LoadingButton>
                  )}
                </>
              )}
              {isView && (
                <>
                  {userData?.status === 'Archived' && checkPermissions(rolesAssign, ['user_manage_operations']) && (
                    <Button
                      variant="outlined"
                      onClick={handleOpen}
                      sx={{
                        width: { xs: '48%', sm: 'auto' }
                      }}
                    >
                      Restore
                    </Button>
                  )}
                  {userData?.status !== 'Archived' && checkPermissions(rolesAssign, ['user_manage_operations']) && (
                    <Button
                      variant="outlined"
                      onClick={() => router.push(`/admin/user-management/users/${params.id}`)}
                      sx={{
                        width: { xs: '48%', sm: 'auto' }
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => router.push(`/admin/user-management/users/log-history/${params.id}`)}
                    sx={{
                      ...styles.createBtn,
                      width: { xs: '48%', sm: 'auto' }
                    }}
                  >
                    View Log
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
          {!isProfile && (
            <Stack direction="row" spacing={4} mb={4}>
              <Typography textAlign="center" variant="h5" color="primary.main" textTransform="uppercase">
                {getUserStatusText(isView, params.id)}
              </Typography>
            </Stack>
          )}
          {isView && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values.status || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Record Created By
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {userData?.createdByName || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Record Created On
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {formatDateWithFallback(userData?.createdAt)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Record Updated By
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {userData?.updatedByName || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Record Updated On
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {formatDateWithFallback(userData?.updatedAt)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Role(s)
                    </Typography>
                    <Typography variant="subtitle4" component="p" color="text.secondarydark">
                      {values.roles[0] || '-'}&nbsp;
                      {values.roles.length > 1 && (
                        <Tooltip title={values.roles.join(', ')} arrow>
                          <Typography
                            variant="blueLink"
                            color="text.blue"
                            textTransform="capitalize"
                          >{`+${values.roles.length - 1} more`}</Typography>
                        </Tooltip>
                      )}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          )}

          {isView && (
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item md={12}>
                  <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
                    basic details
                  </Typography>
                </Grid>
                {/* User profile component */}
                <Grid item xs={12} md={12}>
                  <ProfilePicture imageUrl={userData?.photoFileUrl} isView />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Employee ID
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.employeeId || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Email ID
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.email || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      First Name
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.firstName || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Second Name
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.lastName || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.mobile || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Assigned Role(s)
                    </Typography>
                    <Typography variant="subtitle4" component="p" color="text.secondarydark">
                      {values.roles[0] || '-'}&nbsp;
                      {values.roles.length > 1 && (
                        <Tooltip title={values.roles.join(', ')} arrow>
                          <Typography variant="blueLink" color="text.blue" textTransform="capitalize">
                            {`+${values.roles.length - 1} more`}
                          </Typography>
                        </Tooltip>
                      )}
                    </Typography>

                    {/* <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.roles?.join(', ') || '-'}
                    </Typography> */}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Salutation
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.salutation || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {formatDateWithFallback(values.dob)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Date of Joining
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {formatDateWithFallback(values.joinDate)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Marital Status
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {values?.maritalStatus || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {values?.gender || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {countryLabel || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      State/Province
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {stateLabel || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {cityLabel || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Mailing Address
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.mailingAddress || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Preferred Communication Mode
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', values?.preferredCommunication)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Emergency Contact Name
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.emergencyContactName || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Emergency Contact Number
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.emergencyContactNumber || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Emergency Residential Address
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.homeAddress || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                {values?.documentDetails.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
                      Identity Documents Details
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  {values?.documentDetails?.map((doc, index) => (
                    <Box
                      key={doc?.documentImageId}
                      sx={{
                        backgroundColor: (theme) => theme.palette.grey[100],
                        padding: 2,
                        mb: 2
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Stack direction="column" gap={0.5}>
                            <Typography variant="body3" color="text.secondary">
                              Identity Document Type
                            </Typography>
                            <Typography variant="subtitle4" color="text.secondarydark">
                              {getLabelByCode(masterData, 'dpw_foundation_user_identity', doc?.documentType) || '-'}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Stack direction="column" gap={0.5}>
                            <Typography variant="body3" color="text.secondary">
                              Document Number
                            </Typography>
                            <Typography variant="subtitle4" color="text.secondarydark" sx={{ wordWrap: 'break-word' }}>
                              {doc?.documentNumber || '-'}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Stack direction="column" gap={0.5}>
                            <Typography variant="body3" color="text.secondary">
                              Document Validity
                            </Typography>
                            <Typography variant="subtitle4" color="text.secondarydark">
                              {doc?.documentValidity ? fDateM(doc?.documentValidity, false) : '-'}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack direction="column" gap={0.5}>
                            <Typography variant="body3" color="text.secondary">
                              Document Attachment
                            </Typography>
                            <Typography variant="subtitle4" color="text.secondarydark">
                              {doc?.fileName ? (
                                <Box
                                  component="span"
                                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                                  onClick={(e) => downloadMediaFile(e, doc?.documentImageId)}
                                >
                                  {doc.fileName}
                                </Box>
                              ) : (
                                '-'
                              )}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          )}

          {!isView && (
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item md={12}>
                  <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
                    basic details
                  </Typography>
                </Grid>
                {isEdit && (
                  <Grid item xs={12}>
                    <ProfilePicture
                      imageUrl={profileImg}
                      onChange={(event) => handleSelectProfile(Array.from(event.target.files))}
                      name="photoFileId"
                      updateImage={updateImage}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading} error={getFieldHelperText(touched, errors, 'employeeId')}>
                    {isView || isEdit ? (
                      <Stack direction="column" gap={0.5}>
                        <Typography variant="body3" color="text.secondary">
                          Employee ID
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {values?.employeeId || '-'}
                        </Typography>
                      </Stack>
                    ) : (
                      <TextField
                        id="employeeId"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        required
                        label="Enter Employee ID"
                        fullWidth
                        {...getFieldProps('employeeId')}
                        error={getFieldError(touched, errors, 'employeeId')}
                      />
                    )}
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading} error={getFieldHelperText(touched, errors, 'email')}>
                    {isView || isEdit ? (
                      <Stack direction="column" gap={0.5}>
                        <Typography variant="body3" color="text.secondary">
                          Email ID
                        </Typography>
                        <Typography variant="subtitle4" color="text.secondarydark">
                          {values?.email || '-'}
                        </Typography>
                      </Stack>
                    ) : (
                      <TextField
                        id="Email"
                        variant="standard"
                        label="Enter Email ID"
                        inputProps={{ maxLength: 256 }}
                        required
                        fullWidth
                        {...getFieldProps('email')}
                        error={getFieldError(touched, errors, 'email')}
                      />
                    )}
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading} error={getFieldHelperText(touched, errors, 'firstName')}>
                    <TextField
                      id="firstName"
                      variant="standard"
                      label="Enter First Name"
                      inputProps={{ maxLength: 256 }}
                      required
                      fullWidth
                      {...getFieldProps('firstName')}
                      error={getFieldError(touched, errors, 'firstName')}
                      disabled={isView}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading} error={getFieldHelperText(touched, errors, 'lastName')}>
                    <TextField
                      id="last-name"
                      variant="standard"
                      label="Enter Second Name"
                      inputProps={{ maxLength: 256 }}
                      required
                      fullWidth
                      {...getFieldProps('lastName')}
                      error={getFieldError(touched, errors, 'lastName')}
                      disabled={isView}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading} error={getFieldHelperText(touched, errors, 'mobile')}>
                    <MuiTelInput
                      label="Enter Phone Number"
                      id="mobile"
                      required
                      name="mobile"
                      preferredCountries={preferredCountries}
                      defaultCountry={defaultCountry}
                      fullWidth
                      value={values.mobile}
                      onChange={(value) => {
                        const cleanedValue = value ? value.replace(/\s/g, '') : '';
                        setFieldValue('mobile', cleanedValue);
                      }}
                      onBlur={handleBlur('mobile')} // Make sure this is present
                      variant="standard"
                      error={touched.mobile && Boolean(errors.mobile)}
                      sx={{
                        '& .MuiInputAdornment-root .MuiButtonBase-root': {
                          right: 6
                        }
                      }}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading} error={getFieldHelperText(touched, errors, 'roles')}>
                    <FormControl variant="standard" fullWidth required>
                      <InputLabel id="demo-simple-select-standard-label">Select Assigned Role(s)</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        multiple
                        value={values.roles}
                        label="Select Assigned Role(s)"
                        onChange={(event) => setFieldValue('roles', event.target.value)}
                        renderValue={(selected) => selected.join(', ')}
                        sx={{ width: '100%' }}
                        disabled={isView}
                        error={getFieldError(touched, errors, 'roles')}
                      >
                        {role?.data.map((r) => (
                          <MenuItem key={r.id} value={r.name}>
                            <Checkbox checked={values.roles.includes(r.name)} />
                            {r.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextFieldSelect
                      id="salutation"
                      label="Select Salutation "
                      getFieldProps={getFieldProps}
                      itemsData={salutations?.values}
                      value={values?.salutation}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <DatePickers
                      label={'Select Date of Birth'}
                      onChange={(newDate) => {
                        if (newDate instanceof Date && !isNaN(newDate.getTime())) {
                          setFieldValue('dob', newDate);
                        } else {
                          setFieldValue('dob', null);
                        }
                      }}
                      value={values.dob}
                      handleClear={() => {
                        setFieldValue('dob', null);
                      }}
                      maxDate={new Date()}
                      error={touched.dob && Boolean(errors.dob)}
                      helperText={getFieldHelperText(touched, errors, 'dob')}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <DatePickers
                      label={'Select Date of Joining'}
                      onChange={(newDate) => {
                        setFieldValue('joinDate', newDate);
                      }}
                      value={values.joinDate}
                      handleClear={() => {
                        setFieldValue('joinDate', null);
                      }}
                      maxDate={new Date()}
                      error={touched.joinDate && Boolean(errors.joinDate)}
                      helperText={getFieldHelperText(touched, errors, 'joinDate')}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextFieldSelect
                      id="maritalStatus"
                      label="Select Marital Status"
                      getFieldProps={getFieldProps}
                      itemsData={maritalStatus?.values}
                      value={values?.maritalStatus}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextFieldSelect
                      id="gender"
                      label="Select Gender"
                      getFieldProps={getFieldProps}
                      itemsData={genders?.values}
                      value={values?.gender}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextFieldSelect
                      id="currentCountryOfResidence"
                      label="Select Country"
                      getFieldProps={getFieldProps}
                      itemsData={country}
                    />
                  </FieldWithSkeleton>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextFieldSelect
                      id="state"
                      label="Select State/Province"
                      getFieldProps={getFieldProps}
                      itemsData={projectStateData}
                      disabled={!values?.currentCountryOfResidence}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextFieldSelect
                      id="city"
                      label="Select City"
                      getFieldProps={getFieldProps}
                      itemsData={citiesData}
                      disabled={!values?.state}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextField
                      id="mailingAddress"
                      variant="standard"
                      label="Enter Mailing Address"
                      inputProps={{ maxLength: 256 }}
                      fullWidth
                      {...getFieldProps('mailingAddress')}
                      error={getFieldError(touched, errors, 'mailingAddress')}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextFieldSelect
                      id="preferredCommunication"
                      label="Select Preferred Communication Mode"
                      getFieldProps={getFieldProps}
                      itemsData={preferredCommunications?.values}
                      value={values?.preferredCommunication}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextField
                      id="emergencyContactName"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label="Enter Emergency Contact Name"
                      fullWidth
                      {...getFieldProps('emergencyContactName')}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <MuiTelInput
                      label="Enter Emergency Contact Number"
                      id="emergencyContactNumber"
                      name="emergencyContactNumber"
                      preferredCountries={preferredCountries}
                      defaultCountry={defaultCountry}
                      fullWidth
                      value={values.emergencyContactNumber}
                      onChange={(value) => {
                        const cleanedValue = value ? value.replace(/\s/g, '') : '';
                        setFieldValue('emergencyContactNumber', cleanedValue);
                      }}
                      onBlur={handleBlur('emergencyContactNumber')} // Make sure this is present
                      variant="standard"
                      error={touched.emergencyContactNumber && Boolean(errors.emergencyContactNumber)}
                      helperText={getFieldHelperText(touched, errors, 'emergencyContactNumber')}
                      sx={{
                        '& .MuiInputAdornment-root .MuiButtonBase-root': {
                          right: 6
                        }
                      }}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextField
                      id="homeAddress"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label="Enter Emergency Residential Address"
                      fullWidth
                      {...getFieldProps('homeAddress')}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item md={6}>
                  <Stack flexDirection="row" alignItems="center" gap={2} mt={2}>
                    <Typography variant="body1">Status</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.status === 'Active'}
                          onChange={(event) => setFieldValue('status', event.target.checked ? 'Active' : 'Inactive')}
                          inputProps={{ 'aria-label': 'controlled' }}
                          disabled={isView}
                        />
                      }
                      label={values.status === 'Active' ? 'Active' : 'Inactive'}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: values.status === 'Active' ? theme.palette.success.main : theme.palette.error.main
                        }
                      }}
                    />
                  </Stack>
                </Grid>
                {isEdit && (
                  <Grid item xs={12}>
                    <Stack
                      gap={3}
                      justifyContent="space-between"
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'flex-start', sm: 'center', md: 'center' }}
                    >
                      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
                        Identity Documents Details
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          const maxTypes = documentTypes?.values?.length || 0;
                          if (values.documentDetails.length < maxTypes) {
                            setFieldValue('documentDetails', [
                              ...values.documentDetails,
                              {
                                documentType: '',
                                documentNumber: '',
                                documentValidity: null,
                                documentImageId: '',
                                fileName: ''
                              }
                            ]);
                          }
                        }}
                        disabled={areAllDocumentsFilled()}
                      >
                        Add More Documents
                      </Button>
                    </Stack>
                    {values?.documentDetails?.map((doc, index) => (
                      <Box key={doc?.documentImageId} sx={styles.documentCard}>
                        <Box sx={styles.deleteIcon}>
                          <IconButton onClick={() => remove(index)}>
                            <DeleteIconRed />
                          </IconButton>
                        </Box>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={4}>
                            <FieldWithSkeleton isLoading={isLoading}>
                              <TextFieldSelect
                                key={`${getFilteredDocumentTypes(index)
                                  ?.map((d) => d.value)
                                  .join(',')}`}
                                id={`documentDetails.${index}.documentType`}
                                label="Select Identity Document Type"
                                getFieldProps={getFieldProps}
                                itemsData={getFilteredDocumentTypes(index)}
                                value={values.documentDetails[index].documentType}
                                onChange={(e) => setFieldValue(`documentDetails.${index}.documentType`, e.target.value)}
                              />
                            </FieldWithSkeleton>
                          </Grid>

                          <Grid item xs={12} sm={6} md={4}>
                            <FieldWithSkeleton isLoading={isLoading}>
                              <TextField
                                id={`documentDetails.${index}.documentNumber`}
                                variant="standard"
                                inputProps={{ maxLength: 256 }}
                                label="Enter Document Number"
                                fullWidth
                                value={values.documentDetails[index].documentNumber}
                                onChange={(e) =>
                                  setFieldValue(`documentDetails.${index}.documentNumber`, e.target.value)
                                }
                              />
                            </FieldWithSkeleton>
                          </Grid>

                          <Grid item xs={12} sm={6} md={4}>
                            <FieldWithSkeleton isLoading={isLoading}>
                              <DatePickers
                                label={'Select Document Validity'}
                                inputFormat={'yyyy-MM-dd'}
                                minDate={new Date()}
                                onChange={(newDate) =>
                                  setFieldValue(`documentDetails.${index}.documentValidity`, newDate)
                                }
                                value={values.documentDetails[index].documentValidity}
                                handleClear={() => {
                                  setFieldValue(`documentDetails.${index}.documentValidity`, null);
                                }}
                              />
                            </FieldWithSkeleton>
                          </Grid>
                          <Grid item xs={12}>
                            <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
                              <FileUpload
                                buttonText="Upload Document "
                                name="documentImageId"
                                size="small"
                                disabled={values?.documentDetails?.[index]?.documentImageId}
                                onChange={(event) => {
                                  handleDocumentFileUpload(
                                    Array.from(event.target.files),
                                    index,
                                    'documentImageId',
                                    'DONOR',
                                    'DONOR_IDENTITY_PROOF_ATTACHEMENT'
                                  );
                                }}
                              />
                              <Box key={`steps_${values?.documentDetails?.[index]?.documentImageId}`}>
                                <Typography component="div" variant="body2" color="text.secondarydark">
                                  <Box
                                    component="span"
                                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={(e) =>
                                      downloadMediaFile(e, values?.documentDetails?.[index]?.documentImageId)
                                    }
                                  >
                                    {values?.documentDetails?.[index]?.fileName || ''}
                                  </Box>
                                  {values?.documentDetails?.[index]?.documentImageId && (
                                    <Tooltip title="Remove" arrow>
                                      <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDocumentsDeleteFile(doc?.documentImageId)}
                                      >
                                        <DeleteIconRed />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          {/* {donorType === 'Individual' && ( */}

                          {/* )} */}
                        </Grid>
                      </Box>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
        </Form>
      </FormikProvider>
    </Box>
  );
}

UserForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};
