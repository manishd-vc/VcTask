'use client';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
// mui
import { Box, Button, Dialog, Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
// api
import * as api from 'src/services';
// yup
import * as Yup from 'yup';
// formik
import { format } from 'date-fns';
import { Form, FormikProvider, useFormik } from 'formik';
import { matchIsValidTel } from 'mui-tel-input';
import { useRouter } from 'next-nprogress-bar';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfilePicture from 'src/components/_admin/users/profilePicture';
import RestoreUser from 'src/components/dialog/restoreUser';
import { setToastMessage } from 'src/redux/slices/common';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM, fDateWithLocale } from 'src/utils/formatTime';
EditProfile.propTypes = {
  // 'isView' is a boolean to determine if the form is in view-only mode
  isView: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean to determine if the form is in edit mode
  isEdit: PropTypes.bool.isRequired
};
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

/**
 * EditProfile Component
 *
 * Manages the form for creating, editing, and viewing user details.
 * Handles form validation, submission, and conditional rendering based on `isView` and `isEdit` props.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isView - If true, renders the form in view-only mode.
 * @param {boolean} props.isEdit - If true, renders the form in edit mode.
 * @returns {JSX.Element} - Rendered EditProfile component.
 */

export default function EditProfile({ user, setEdit, refetch, isEdit, isView }) {
  const router = useRouter();
  const [open] = useState(false);
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const [, setProfileImg] = React.useState('');
  const { data: userData, refetch: userRefetch } = useQuery(['getUser', user?.id], () => api.getUserByAdmin(user?.id), {
    enabled: !!user?.id,
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });
  // Mutation for form submission
  const mutationConfig = {
    retry: false,
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      refetch();
      setEdit(false);
    },
    onError: (error) => dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }))
  };
  const { mutate } = useMutation(isEdit ? api.updateUserByAdmin : api.addUserByAdmin, mutationConfig);

  // Form validation schema
  const UserSchema = Yup.object().shape({
    employeeId: Yup.string().required('Employee ID is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Second name is required'),
    mobile: Yup.string().required('Phone number is required'),
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter a valid email')
      .required('Email is required.'),
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
      currentCountryOfResidence: userData?.currentCountryOfResidence || '',
      state: userData?.state || '',
      city: userData?.city || '',
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

  const { values, handleSubmit } = formik;

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
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box position="relative">
      <Dialog aria-label="Restore-user" onClose={handleClose} open={open} maxWidth={'sm'}>
        <RestoreUser onClose={handleClose} id={user?.id} refetch={userRefetch} />
      </Dialog>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={4} direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography textAlign="center" variant="h5" color="primary.main" textTransform="uppercase">
              My Profile
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => router.push(`/admin/my-profile/${user?.id}`)}
                sx={{
                  width: { xs: '48%', sm: 'auto' }
                }}
              >
                Edit
              </Button>
            </Stack>
          </Stack>
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
                      {userData?.createdAt ? fDateWithLocale(userData?.createdAt) : '-'}
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
                      {userData?.updatedAt ? fDateWithLocale(userData?.updatedAt) : '-'}
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
                      {values?.dob ? fDateWithLocale(values.dob) : '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Date of Joining
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {values?.joinDate ? fDateWithLocale(values.joinDate) : '-'}
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
                    {values?.documentDetails?.map((doc, index) => (
                      <Box
                        key={doc?.documentImageId}
                        sx={{
                          backgroundColor: (theme) => theme.palette.grey[100],
                          padding: 2,
                          mt: 2
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
                              <Typography
                                variant="subtitle4"
                                color="text.secondarydark"
                                sx={{ wordWrap: 'break-word' }}
                              >
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
                )}
              </Grid>
            </Paper>
          )}
        </Form>
      </FormikProvider>
    </Box>
  );
}
