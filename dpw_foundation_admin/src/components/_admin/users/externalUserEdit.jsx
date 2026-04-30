'use client';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import { useRouter } from 'next-nprogress-bar';
import { useParams } from 'next/navigation';
import { lazy, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import AddCertificationDialog from 'src/components/dialog/AddCertificationDialog';
import AddSupportingDocumentDialog from 'src/components/dialog/AddSupportingDocumentDialog';
import VolunteerReleaseDialog from 'src/components/dialog/VolunteerReleaseDialog';
import FileUpload from 'src/components/fileUpload';
import FormStyle from 'src/components/forms/form.styles';
import { BackArrow, DeleteIconRed } from 'src/components/icons';
import SkillCertificationsTable from 'src/components/table/SkillCertificationsTable';
import VolunteeringSupportDocumentsTable from 'src/components/table/VolunteeringSupportDocumentsTable';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { defaultCountry, preferredCountries } from 'src/utils/constants';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as Yup from 'yup';
import ProfileStyle from '../donor/steps/profile.style';
import AvailabilityTable from '../volunteer-management/view-request/viewEnrolmentRequestById/AvailabilityTable';
import ProfilePicture from './profilePicture';
const FieldWithSkeleton = lazy(() => import('src/components/FieldWithSkeleton'));
export default function ExternalUserEdit() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const styles = {
    ...FormStyle(theme),
    ...ProfileStyle(theme)
  };
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [openVolunteerReleaseDialog, setOpenVolunteerReleaseDialog] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  const [updateImage, setUpdateImage] = useState(false);
  const { masterData } = useSelector((state) => state?.common);
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const salutations = getLabelObject(masterData, 'dpw_foundation_user_salutation');
  const maritalStatus = getLabelObject(masterData, 'dpw_foundation_user_marital_status');
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const genders = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const preferredCommunications = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');
  const documentIndex = useRef(0);
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);
  const languageData = getLabelObject(masterData, 'dpwf_language');
  const userVolunteering = getLabelObject(masterData, 'dpw_foundation_user_volunteering');
  // Helper functions to reduce cognitive complexity
  const getBasicInitialValues = (userData) => {
    const {
      photoFileId,
      photoFileUrl,
      firstName,
      lastName,
      email,
      accountType,
      mobile,
      salutation,
      dob,
      maritalStatus,
      gender,
      currentCountryOfResidence,
      state,
      city,
      mailingAddress,
      preferredCommunication,
      emergencyContactName,
      emergencyContactNumber,
      homeAddress,
      allowGrantCreation,
      firstGrantAccepted,
      isVolunteer,
      isDpwEmployee,
      employeeId,
      companyName,
      department,
      dlAvailability,
      carAvailability,
      homePhoneNumber,
      nativeLanguage,
      otherLanguage,
      volunteeringArea,
      otherVolunteeringArea,
      skillCertifications,
      volunteeringSupportDocuments,
      volunteerReleaseAccepted,
      availability,
      allowContributionCreation,
      firstContributionAccepted
    } = userData || {};

    const getInitialValues = (value, defaultValue) => value ?? defaultValue;

    const defaultPhone = (val) => val || '+971';

    return {
      photoFileId: getInitialValues(photoFileId, ''),
      photoFileUrl: getInitialValues(photoFileUrl, ''),
      firstName: getInitialValues(firstName, ''),
      lastName: getInitialValues(lastName, ''),
      email: getInitialValues(email, ''),
      accountType: getInitialValues(accountType, ''),
      mobile: defaultPhone(mobile),
      salutation: getInitialValues(salutation, ''),
      dob: dob || null,
      maritalStatus: getInitialValues(maritalStatus, ''),
      gender: getInitialValues(gender, ''),
      currentCountryOfResidence: getInitialValues(currentCountryOfResidence, ''),
      state: getInitialValues(state, ''),
      city: getInitialValues(city, ''),
      mailingAddress: getInitialValues(mailingAddress, ''),
      preferredCommunication: getInitialValues(preferredCommunication, ''),
      emergencyContactName: getInitialValues(emergencyContactName, ''),
      emergencyContactNumber: defaultPhone(emergencyContactNumber),
      homeAddress: getInitialValues(homeAddress, ''),
      allowGrantCreation: Boolean(allowGrantCreation),
      firstGrantAccepted: Boolean(firstGrantAccepted),
      isVolunteer: Boolean(isVolunteer),
      isDpwEmployee: Boolean(isDpwEmployee),
      employeeId: getInitialValues(employeeId, ''),
      companyName: getInitialValues(companyName, ''),
      department: getInitialValues(department, ''),
      dlAvailability: Boolean(dlAvailability),
      carAvailability: Boolean(carAvailability),
      homePhoneNumber: getInitialValues(homePhoneNumber, ''),
      nativeLanguage: getInitialValues(nativeLanguage, ''),
      otherLanguage: getInitialValues(otherLanguage, []),
      volunteeringArea: getInitialValues(volunteeringArea, []),
      otherVolunteeringArea: getInitialValues(otherVolunteeringArea, ''),
      skillCertifications: getInitialValues(skillCertifications, []),
      volunteeringSupportDocuments: getInitialValues(volunteeringSupportDocuments, []),
      volunteerReleaseAccepted: getInitialValues(volunteerReleaseAccepted, false),
      availability: getInitialValues(availability, []),
      allowContributionCreation: Boolean(allowContributionCreation),
      firstContributionAccepted: Boolean(firstContributionAccepted)
    };
  };

  const getOrganizationInitialValues = (userData) => ({
    id: userData?.organizationDetails?.id || '',
    organizationName: userData?.organizationDetails?.organizationName || '',
    organizationInfo: userData?.organizationDetails?.organizationInfo || '',
    organizationRegistrationNumber: userData?.organizationDetails?.organizationRegistrationNumber || '',
    designation: userData?.organizationDetails?.designation || ''
  });

  const getBankDetail = (userData) => ({
    id: userData?.bankDetail?.id || '',
    bankBeneficiaryName: userData?.bankDetail?.bankBeneficiaryName || '',
    bankName: userData?.bankDetail?.bankName || '',
    bankAccount: userData?.bankDetail?.bankAccount || '',
    bankIban: userData?.bankDetail?.bankIban || '',
    bankSwiftCode: userData?.bankDetail?.bankSwiftCode || ''
  });
  const getDocumentInitialValues = (userData) => {
    if (!Array.isArray(userData?.documentDetails) || userData.documentDetails.length === 0) {
      return [];
    }

    return userData.documentDetails.map((doc) => ({
      id: doc?.id || '',
      documentType: doc?.documentType || '',
      documentNumber: doc?.documentNumber || '',
      documentValidity: doc?.documentValidity ? new Date(doc.documentValidity) : null,
      documentImageId: doc?.documentImageId || '',
      fileName: doc?.fileName || '',
      preSignedUrl: doc?.preSignedUrl || ''
    }));
  };
  const getValidationSchema = () =>
    Yup.object().shape({
      bankDetail: Yup.object().shape({
        bankBeneficiaryName: Yup.string()
          .matches(/^[A-Za-z ]+$/, 'Only alphabets allowed')
          .max(255, 'Max 255 characters allowed')
          .required('Beneficiary Name is required'),

        bankName: Yup.string()
          .matches(/^[A-Za-z ]+$/, 'Only alphabets allowed')
          .max(255, 'Max 255 characters allowed')
          .required('Bank is required'),

        bankAccount: Yup.string()
          .matches(/^\d+$/, 'Only numeric values allowed')
          .max(22, 'Max 22 digits allowed')
          .required('Account is required'),

        bankIban: Yup.string()
          .matches(/^[A-Za-z0-9]+$/, 'Only alphanumeric values allowed')
          .max(255, 'Max 255 characters allowed')
          .required('IBAN is required'),

        bankSwiftCode: Yup.string()
          .matches(/^[A-Za-z0-9]+$/, 'Only alphanumeric values allowed')
          .max(255, 'Max 255 characters allowed')
          .required('SWIFT Code is required')
      }),
      documentDetails: Yup.array().of(
        Yup.object().shape({
          documentType: Yup.string().required('Document type is required'),
          documentNumber: Yup.string().required('Document number is required'),
          documentValidity: Yup.date().required('Document validity is required'),
          documentImageId: Yup.string().required('Document upload is required')
        })
      )
    });
  const {
    data: userData,
    isLoading: userLoading,
    refetch
  } = useQuery(['getUser', params.id], () => api.getUserByAdmin(params.id), {
    enabled: !!params.id,
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: updateExternalMutate, isLoading } = useMutation('updateExternalUser', api.updateExternalUser, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      refetch();
      router.back();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  // Fetching country data
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  useEffect(() => {
    if (userData?.photoFileUrl) {
      setProfileImg(userData?.photoFileUrl);
    }
  }, [userData?.photoFileUrl]);

  const formik = useFormik({
    initialValues: {
      ...getBasicInitialValues(userData),
      organizationDetails: getOrganizationInitialValues(userData),
      documentDetails: getDocumentInitialValues(userData),
      bankDetail: getBankDetail(userData)
    },
    validationSchema: getValidationSchema(),
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (profileImg) {
        values['photoFileId'] = profileImg;
      }
      updateExternalMutate({ id: params.id, payload: values });
    }
  });
  const { values, handleSubmit, getFieldProps, setFieldValue, handleBlur, errors, touched } = formik;

  const { mutate: uploadProfile } = useMutation('uploadProfile', api.uploadProfilePhoto, {
    onSuccess: (response) => {
      setUpdateImage(!updateImage);

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

  const { mutate: mutateDocument } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: (response) => {
      const updatedDocuments = [...values.documentDetails];
      updatedDocuments[documentIndex.current] = {
        ...updatedDocuments[documentIndex.current],
        documentImageId: response.data.id,
        fileName: response.data.fileName
      };
      setFieldValue('documentDetails', updatedDocuments);
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
    }
  });
  const handleSelectProfile = (files) => {
    handleFileUploadValidation(files, {
      mutate: uploadProfile,
      entityId: params?.id,
      setToastMessage,
      dispatch
    });
  };
  const { mutate: deleteMediaMutation } = useMutation('deleteMedia', api.deleteDocumentMedia, {
    onSuccess: (response, variables) => {
      const updatedDocuments = values.documentDetails.map((doc) => {
        if (doc.documentImageId === variables.id) {
          return { ...doc, documentImageId: '', fileName: '' };
        }
        return doc;
      });
      setFieldValue('documentDetails', updatedDocuments);
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
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
  const remove = (indexToRemove) => {
    const updatedDocuments = values.documentDetails.filter((_, i) => i !== indexToRemove);
    setFieldValue('documentDetails', updatedDocuments);
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
  const download = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  const { mutate: deleteSkillCertification } = useMutation(
    'deleteSkillCertification',
    (id) => volunteerApi.deleteSkillCertification(id),
    {
      onSuccess: (response, deletedId) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        // Remove from local state instead of refetching
        const updatedCertifications = values.skillCertifications.filter((cert) => cert.id !== deletedId);
        setFieldValue('skillCertifications', updatedCertifications);
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const { mutate: deleteVolunteeringSupportDocument } = useMutation(
    'deleteVolunteeringSupportDocument',
    (id) => volunteerApi.deleteVolunteeringSupportDocument(id),
    {
      onSuccess: (response, deletedId) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        // Remove from local state instead of refetching
        const updatedDocuments = values.volunteeringSupportDocuments.filter((doc) => doc.id !== deletedId);
        setFieldValue('volunteeringSupportDocuments', updatedDocuments);
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const isOrganizationType = userData?.accountType === 'Organization';
  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mb={3}
            spacing={3}
          >
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
            <Stack
              flexDirection="row"
              justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
              spacing={3}
              alignItems="center"
              gap={3}
              sx={{ width: '100%' }}
            >
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
                <LoadingButton
                  loading={isLoading}
                  sx={styles.createBtn}
                  width={'100%'}
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Save
                </LoadingButton>
              </>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={4} mb={4}>
            <Typography textAlign="center" variant="h5" color="primary.main" textTransform="uppercase">
              Edit user profile
            </Typography>
          </Stack>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProfilePicture
                  imageUrl={profileImg && typeof profileImg === 'object' ? URL.createObjectURL(profileImg) : profileImg}
                  onChange={(event) => {
                    const file = Array.from(event.target.files || []);
                    if (file) {
                      handleSelectProfile(file);
                      setProfileImg(file[0]);
                    }
                  }}
                  name="photoFileId"
                  updateImage={updateImage}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={userLoading}>
                  <Stack direction="column" gap={1}>
                    <Typography variant="body3" color="text.secondary">
                      Registered As
                    </Typography>
                    <Typography
                      variant="subtitle4"
                      component="p"
                      display="flex"
                      flexWrap="wrap"
                      color="text.secondarydark"
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {userData?.accountType || '-'}
                    </Typography>
                  </Stack>
                </FieldWithSkeleton>
              </Grid>
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={userLoading}>
                  <Stack direction="column" gap={1}>
                    <Typography variant="body3" color="text.secondary">
                      Email ID
                    </Typography>
                    <Typography
                      variant="subtitle4"
                      component="p"
                      display="flex"
                      flexWrap="wrap"
                      color="text.secondarydark"
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {userData?.email || '-'}
                    </Typography>
                  </Stack>
                </FieldWithSkeleton>
              </Grid>
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={userLoading}>
                  <TextField
                    id="firstName"
                    variant="standard"
                    inputProps={{ maxLength: 256 }}
                    label={isOrganizationType ? 'Enter Organization Contact Person First Name' : 'First Name'}
                    fullWidth
                    required
                    {...getFieldProps('firstName')}
                  />
                </FieldWithSkeleton>
              </Grid>
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={userLoading}>
                  <TextField
                    id="lastName"
                    variant="standard"
                    inputProps={{ maxLength: 256 }}
                    label={isOrganizationType ? 'Enter Organization Contact Person Second Name' : 'Second Name'}
                    fullWidth
                    required
                    {...getFieldProps('lastName')}
                  />
                </FieldWithSkeleton>
              </Grid>
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={userLoading} error={touched.mobile && errors.mobile}>
                  <MuiTelInput
                    label={isOrganizationType ? 'Enter Organization Contact Person Phone Number' : 'Enter Phone Number'}
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
              {isOrganizationType && (
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextField
                      id="organizationName"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label="Enter Organization Name"
                      fullWidth
                      {...getFieldProps('organizationDetails.organizationName')}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}
              {isOrganizationType && (
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextField
                      id="designation"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label="Enter Organization Contact Person Designation"
                      fullWidth
                      {...getFieldProps('organizationDetails.designation')}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}
              {isOrganizationType && (
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextField
                      id="organizationRegistrationNumber"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label="Enter Organization Registration Number"
                      fullWidth
                      {...getFieldProps('organizationDetails.organizationRegistrationNumber')}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}
              {!isOrganizationType && (
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextFieldSelect
                      id="salutation"
                      label="Select Salutation"
                      getFieldProps={getFieldProps}
                      itemsData={salutations?.values}
                      value={values?.salutation}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}
              {!isOrganizationType && (
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <DatePickers
                      label={'Select Date of Birth'}
                      inputFormat={'dd-MM-yyyy'}
                      onChange={(newFromDate) => {
                        setFieldValue('dob', newFromDate);
                      }}
                      maxDate={new Date()}
                      value={values?.dob}
                      handleClear={() => {
                        setFieldValue('dob', null);
                      }}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}
              {!isOrganizationType && (
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
              )}
              {!isOrganizationType && (
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
              )}
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={userLoading}>
                  <TextFieldSelect
                    id="currentCountryOfResidence"
                    label={isOrganizationType ? 'Select Organization Country Where Registered' : 'Select Country'}
                    getFieldProps={getFieldProps}
                    itemsData={country}
                  />
                </FieldWithSkeleton>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={userLoading}>
                  <TextFieldSelect
                    id="state"
                    label={isOrganizationType ? 'Select Organization State Where Registered' : 'Select State/Province'}
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
                    label={isOrganizationType ? 'Select Organization City Where Registered' : 'Select City'}
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
                    inputProps={{ maxLength: 256 }}
                    label="Enter Mailing Address"
                    fullWidth
                    {...getFieldProps('mailingAddress')}
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
              {isOrganizationType && (
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <TextField
                      id="organizationInfo"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label="Enter Organization Description"
                      fullWidth
                      value={values?.organizationDetails.organizationInfo}
                      {...getFieldProps('organizationDetails.organizationInfo')}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}
              {!isOrganizationType && (
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
              )}
              {!isOrganizationType && (
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton isLoading={userLoading}>
                    <MuiTelInput
                      label="Enter Emergency Contact Number"
                      id="emergencyContactNumber"
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
                      helperText={touched.emergencyContactNumber && errors.emergencyContactNumber}
                      sx={{
                        '& .MuiInputAdornment-root .MuiButtonBase-root': {
                          right: 6
                        }
                      }}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}
              {!isOrganizationType && (
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
              )}
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
                    sx={{ my: 1 }}
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
                            key={`documentType-${doc.id}`}
                            id={`documentDetails.${index}.documentType`}
                            label="Select Identity Document Type"
                            getFieldProps={getFieldProps}
                            itemsData={getFilteredDocumentTypes(index)}
                            value={values.documentDetails[index].documentType}
                            onChange={(e) => setFieldValue(`documentDetails.${index}.documentType`, e.target.value)}
                            error={Boolean(
                              errors.documentDetails?.[index]?.documentType &&
                                touched.documentDetails?.[index]?.documentType
                            )}
                            helperText={
                              errors.documentDetails?.[index]?.documentType &&
                              touched.documentDetails?.[index]?.documentType &&
                              errors.documentDetails[index].documentType
                            }
                          />
                        </FieldWithSkeleton>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <FieldWithSkeleton isLoading={isLoading}>
                          <TextField
                            id={`documentDetails.${index}.documentNumber`}
                            variant="standard"
                            inputProps={{ maxLength: 256 }}
                            label="Enter Document Number"
                            fullWidth
                            value={values.documentDetails[index].documentNumber}
                            onChange={(e) => setFieldValue(`documentDetails.${index}.documentNumber`, e.target.value)}
                            error={Boolean(
                              errors.documentDetails?.[index]?.documentNumber &&
                                touched.documentDetails?.[index]?.documentNumber
                            )}
                            helperText={
                              errors.documentDetails?.[index]?.documentNumber &&
                              touched.documentDetails?.[index]?.documentNumber &&
                              errors.documentDetails[index].documentNumber
                            }
                          />
                        </FieldWithSkeleton>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <FieldWithSkeleton isLoading={isLoading}>
                          <DatePickers
                            label={'Select Document Validity'}
                            inputFormat={'yyyy-MM-dd'}
                            minDate={new Date()}
                            onChange={(newDate) => setFieldValue(`documentDetails.${index}.documentValidity`, newDate)}
                            value={values.documentDetails[index].documentValidity}
                            handleClear={() => {
                              setFieldValue(`documentDetails.${index}.documentValidity`, null);
                            }}
                            error={Boolean(
                              errors.documentDetails?.[index]?.documentValidity &&
                                touched.documentDetails?.[index]?.documentValidity
                            )}
                            helperText={
                              errors.documentDetails?.[index]?.documentValidity &&
                              touched.documentDetails?.[index]?.documentValidity &&
                              errors.documentDetails[index].documentValidity
                            }
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
                          <FileUpload
                            buttonText="Upload Document"
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
                                onClick={(e) => download(e, values?.documentDetails?.[index]?.documentImageId)}
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
                        {touched?.documentDetails?.[index]?.documentValidity &&
                          errors?.documentDetails?.[index]?.documentImageId && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                              {errors?.documentDetails?.[index]?.documentImageId}
                            </Typography>
                          )}
                      </Grid>
                      {/* {donorType === 'Individual' && ( */}

                      {/* )} */}
                    </Grid>
                  </Box>
                ))}

                <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main" my={2}>
                  Banking Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FieldWithSkeleton isLoading={userLoading}>
                      <TextField
                        variant="standard"
                        label="Beneficiary Name"
                        fullWidth
                        required
                        {...getFieldProps('bankDetail.bankBeneficiaryName')}
                        error={Boolean(
                          touched?.bankDetail?.bankBeneficiaryName && errors?.bankDetail?.bankBeneficiaryName
                        )}
                        helperText={touched?.bankDetail?.bankBeneficiaryName && errors?.bankDetail?.bankBeneficiaryName}
                      />
                    </FieldWithSkeleton>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FieldWithSkeleton isLoading={userLoading}>
                      <TextField
                        variant="standard"
                        label="Bank Name"
                        fullWidth
                        required
                        {...getFieldProps('bankDetail.bankName')}
                        error={Boolean(touched?.bankDetail?.bankName && errors?.bankDetail?.bankName)}
                        helperText={touched?.bankDetail?.bankName && errors?.bankDetail?.bankName}
                      />
                    </FieldWithSkeleton>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FieldWithSkeleton isLoading={userLoading}>
                      <TextField
                        variant="standard"
                        label="Account Number"
                        fullWidth
                        required
                        {...getFieldProps('bankDetail.bankAccount')}
                        error={Boolean(touched?.bankDetail?.bankAccount && errors?.bankDetail?.bankAccount)}
                        helperText={touched?.bankDetail?.bankAccount && errors?.bankDetail?.bankAccount}
                      />
                    </FieldWithSkeleton>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FieldWithSkeleton isLoading={userLoading}>
                      <TextField
                        variant="standard"
                        label="IBAN"
                        fullWidth
                        required
                        {...getFieldProps('bankDetail.bankIban')}
                        error={Boolean(touched?.bankDetail?.bankIban && errors?.bankDetail?.bankIban)}
                        helperText={touched?.bankDetail?.bankIban && errors?.bankDetail?.bankIban}
                      />
                    </FieldWithSkeleton>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FieldWithSkeleton isLoading={userLoading}>
                      <TextField
                        variant="standard"
                        label="SWIFT Code"
                        fullWidth
                        required
                        {...getFieldProps('bankDetail.bankSwiftCode')}
                        error={Boolean(touched?.bankDetail?.bankSwiftCode && errors?.bankDetail?.bankSwiftCode)}
                        helperText={touched?.bankDetail?.bankSwiftCode && errors?.bankDetail?.bankSwiftCode}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                </Grid>
                <Typography variant="h6" color="primary.main" textTransform="uppercase" my={3}>
                  Grant Request Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondarydark">
                      Is the user allowed to create a Grant Request?
                    </Typography>
                    <FormControl component="fieldset" sx={{ my: 1 }}>
                      <RadioGroup
                        row
                        name="allowGrantCreation"
                        value={values.allowGrantCreation?.toString()}
                        onChange={(e) => setFieldValue('allowGrantCreation', e.target.value === 'true')}
                        sx={{ gap: 5 }}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Typography variant="h6" color="primary.main" textTransform="uppercase" my={3}>
                  Volunteering information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondarydark">
                      Are you interested in Volunteering with DPW Foundation ?
                    </Typography>
                    <FormControl component="fieldset" sx={{ my: 1 }}>
                      <RadioGroup
                        row
                        name="isVolunteer"
                        value={values.isVolunteer?.toString()}
                        onChange={(e) => setFieldValue('isVolunteer', e.target.value === 'true')}
                        sx={{ gap: 5 }}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {values.isVolunteer && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondarydark">
                          Is the user a DPW Group Employee?
                        </Typography>
                        <FormControl component="fieldset" sx={{ my: 1 }}>
                          <RadioGroup
                            row
                            name="isDpwEmployee"
                            value={values.isDpwEmployee?.toString()}
                            onChange={(e) => {
                              setFieldValue('isDpwEmployee', e.target.value === 'true');
                              if (e.target.value === 'false') {
                                setFieldValue('employeeId', '');
                                setFieldValue('companyName', '');
                                setFieldValue('department', '');
                              }
                            }}
                            sx={{ gap: 5 }}
                          >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      {values.isDpwEmployee && (
                        <Grid item xs={12}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                variant="standard"
                                label="Employee ID"
                                fullWidth
                                {...getFieldProps('employeeId')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                variant="standard"
                                label="Company Name"
                                fullWidth
                                {...getFieldProps('companyName')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                variant="standard"
                                label="Department"
                                fullWidth
                                {...getFieldProps('department')}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondarydark">
                          Have a driving Licence ?
                        </Typography>
                        <FormControl component="fieldset" sx={{ my: 1 }}>
                          <RadioGroup
                            row
                            name="dlAvailability"
                            value={values.dlAvailability?.toString()}
                            onChange={(e) => setFieldValue('dlAvailability', e.target.value === 'true')}
                            sx={{ gap: 5 }}
                          >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondarydark">
                          Do you have own car?
                        </Typography>
                        <FormControl component="fieldset" sx={{ my: 1 }}>
                          <RadioGroup
                            row
                            name="carAvailability"
                            value={values.carAvailability?.toString()}
                            onChange={(e) => setFieldValue('carAvailability', e.target.value === 'true')}
                            sx={{ gap: 5 }}
                          >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldWithSkeleton isLoading={userLoading} error={touched.mobile && errors.mobile}>
                          <MuiTelInput
                            label="Enter Home Phone"
                            id="homePhoneNumber"
                            preferredCountries={preferredCountries}
                            defaultCountry={defaultCountry}
                            fullWidth
                            value={values.homePhoneNumber}
                            variant="standard"
                            onChange={(value) => {
                              setFieldValue('homePhoneNumber', value);
                            }}
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
                          <TextFieldSelect
                            id="nativeLanguage"
                            label="Select Native Language"
                            getFieldProps={getFieldProps}
                            itemsData={languageData?.values}
                            value={values?.nativeLanguage}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldWithSkeleton isLoading={userLoading}>
                          <Autocomplete
                            multiple
                            limitTags={2}
                            options={languageData?.values || []}
                            value={(values?.otherLanguage || []).map(
                              (item) => languageData?.values?.find((c) => c.code === item.code) || null
                            )}
                            onChange={(event, newValue) => {
                              setFieldValue(
                                'otherLanguage',
                                newValue.map((option) => ({ code: option?.code }))
                              );
                            }}
                            getOptionLabel={(option) => (option && option?.label) || ''}
                            isOptionEqualToValue={(option, value) => option?.code === value?.code}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  size="small"
                                  label={option?.label}
                                  {...getTagProps({ index })}
                                  key={option?.code || index}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Other Language Proficiency"
                                variant="standard"
                                error={touched.otherLanguage && Boolean(errors.otherLanguage)}
                                InputProps={{
                                  ...params.InputProps
                                }}
                              />
                            )}
                            renderOption={(props, item) => (
                              <li {...props} key={item.code}>
                                {item?.label}
                              </li>
                            )}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldWithSkeleton isLoading={userLoading}>
                          <Autocomplete
                            multiple
                            limitTags={2}
                            options={userVolunteering?.values}
                            value={(values?.volunteeringArea || []).map(
                              (item) => userVolunteering?.values?.find((c) => c.code === item.code) || null
                            )}
                            onChange={(event, newValue) => {
                              setFieldValue(
                                'volunteeringArea',
                                newValue.map((option) => ({ code: option?.code }))
                              );
                            }}
                            getOptionLabel={(option) => (option && option?.label) || ''}
                            isOptionEqualToValue={(option, value) => option?.code === value?.code}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  size="small"
                                  label={option?.label}
                                  {...getTagProps({ index })}
                                  key={option?.code || index}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={<>Select Volunteering Areas of Interests</>}
                                variant="standard"
                                InputProps={{
                                  ...params.InputProps
                                }}
                              />
                            )}
                            renderOption={(props, item) => (
                              <li {...props} key={item.code}>
                                {item?.label}
                              </li>
                            )}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      {values?.volunteeringArea?.map((item) => item.code === 'other').includes(true) && (
                        <Grid item xs={12} md={6}>
                          <FieldWithSkeleton isLoading={userLoading}>
                            <TextField
                              id="otherVolunteeringArea"
                              variant="standard"
                              fullWidth
                              label="Add area of Interest"
                              inputProps={{ maxLength: 255 }}
                              {...getFieldProps('otherVolunteeringArea')}
                              value={values?.otherVolunteeringArea}
                              onChange={(e) => setFieldValue('otherVolunteeringArea', e.target.value)}
                            />
                          </FieldWithSkeleton>
                        </Grid>
                      )}
                      <Grid item xs={12} mt={1}>
                        <SkillCertificationsTable
                          data={values.skillCertifications}
                          isEditable={true}
                          onAdd={(certData) => {
                            setFieldValue('skillCertifications', [...(values.skillCertifications || []), certData]);
                          }}
                          onEdit={(certData) => {
                            const updatedCerts = values.skillCertifications.map((cert) =>
                              cert?.id === certData.id ? certData : cert
                            );
                            setFieldValue('skillCertifications', updatedCerts);
                          }}
                          onDelete={(cert) => {
                            if (cert?.id) {
                              deleteSkillCertification(cert.id);
                            }
                          }}
                          userData={{ ...userData, userId: userData.id }}
                          isUser={true}
                        />
                        {openCertificationDialog && (
                          <AddCertificationDialog
                            open={openCertificationDialog}
                            onClose={() => setOpenCertificationDialog(false)}
                            userData={{ ...userData, userId: userData.id }}
                            onSave={(certData) => {
                              setFieldValue('skillCertifications', [...(values.skillCertifications || []), certData]);
                            }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} mt={1}>
                        <VolunteeringSupportDocumentsTable
                          data={values.volunteeringSupportDocuments}
                          isEditable={true}
                          onAdd={(docData) => {
                            setFieldValue('volunteeringSupportDocuments', [
                              ...(values.volunteeringSupportDocuments || []),
                              docData
                            ]);
                          }}
                          onEdit={(docData) => {
                            const updatedDocs = values.volunteeringSupportDocuments.map((doc) =>
                              doc && doc.id === docData.id ? docData : doc
                            );
                            setFieldValue('volunteeringSupportDocuments', updatedDocs);
                          }}
                          onDelete={(doc) => {
                            if (doc?.id) {
                              deleteVolunteeringSupportDocument(doc.id);
                            }
                          }}
                          userData={{ ...userData, userId: userData.id }}
                          isUser={true}
                        />
                        {openDocumentDialog && (
                          <AddSupportingDocumentDialog
                            open={openDocumentDialog}
                            onClose={() => setOpenDocumentDialog(false)}
                            userData={{ ...userData, userId: userData.id }}
                            onSave={(docData) => {
                              setFieldValue('volunteeringSupportDocuments', [
                                ...(values.volunteeringSupportDocuments || []),
                                docData
                              ]);
                            }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.volunteerReleaseAccepted}
                              onChange={(e) => {
                                if (!values.volunteerReleaseAccepted && e.target.checked) {
                                  // open dialog first
                                  setOpenVolunteerReleaseDialog(true);
                                } else {
                                  // directly store boolean instead of string
                                  setFieldValue('volunteerReleaseAccepted', e.target.checked);
                                }
                              }}
                            />
                          }
                          label="Volunteer Release and Undertaking"
                        />
                        {openVolunteerReleaseDialog && (
                          <VolunteerReleaseDialog
                            open={openVolunteerReleaseDialog}
                            onClose={() => setOpenVolunteerReleaseDialog(false)}
                            onAgree={() => {
                              setFieldValue('volunteerReleaseAccepted', true);
                              setOpenVolunteerReleaseDialog(false);
                            }}
                          />
                        )}
                      </Grid>
                      {values?.isVolunteer && (
                        <>
                          <Grid item md={12}>
                            <Typography
                              textAlign="left"
                              variant="h7"
                              color="primary.main"
                              textTransform="uppercase"
                              mb={1}
                            >
                              Available for Volunteering?
                            </Typography>
                            <Typography textAlign="left" variant="body2" color="text.secondarydark">
                              Select the days you are available for volunteering
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ border: (theme) => `1px solid ${theme.palette.warning.dark}`, py: 3, px: 2 }}>
                              <Stack
                                direction={{ xs: 'column', sm: 'row', md: 'row' }}
                                flexWrap="wrap"
                                divider={isDesktop && <Divider orientation="vertical" flexItem />}
                                spacing={{ xs: 0, md: 3, lg: 5 }}
                                rowGap={3}
                              >
                                <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
                                  <Typography variant="subtitle1" color="text.secondarydark">
                                    Morning:
                                  </Typography>
                                  <Typography variant="body1" color="text.secondarydark" component="p">
                                    5:00 AM - 11:59 AM
                                  </Typography>
                                </Box>
                                <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
                                  <Typography variant="subtitle1" color="text.secondarydark">
                                    Afternoon:
                                  </Typography>
                                  <Typography variant="body1" color="text.secondarydark" component="p">
                                    12:00 PM - 4:59 PM
                                  </Typography>
                                </Box>
                                <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
                                  <Typography variant="subtitle1" color="text.secondarydark">
                                    Evening:
                                  </Typography>
                                  <Typography variant="body1" color="text.secondarydark" component="p">
                                    5:00 PM - 8:59 PM
                                  </Typography>
                                </Box>
                                <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
                                  <Typography variant="subtitle1" color="text.secondarydark">
                                    Night:
                                  </Typography>
                                  <Typography variant="body1" color="text.secondarydark" component="p">
                                    9:00 PM - 4:59 AM
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Stack mb={4} mt={1} width="100%">
                              <AvailabilityTable />
                            </Stack>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </Grid>
                <Typography variant="h6" color="primary.main" textTransform="uppercase" my={3}>
                  Beneficiary Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondarydark">
                      Is the user allowed to create a In-Kind Contribution Request?
                    </Typography>
                    <FormControl component="fieldset" sx={{ my: 1 }}>
                      <RadioGroup
                        row
                        name="allowContributionCreation"
                        value={values.allowContributionCreation?.toString()}
                        onChange={(e) => setFieldValue('allowContributionCreation', e.target.value === 'true')}
                        sx={{ gap: 5 }}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      </FormikProvider>
    </Box>
  );
}
