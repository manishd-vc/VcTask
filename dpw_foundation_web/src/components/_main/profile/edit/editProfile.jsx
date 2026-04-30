'use client';
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
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { Form, FormikProvider, useFormik } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import VolunteerReleaseDialog from 'src/components/dialogs/VolunteerReleaseDialog';
import SkillCertificationsTable from 'src/components/tables/SkillCertificationsTable';
import VolunteeringSupportDocumentsTable from 'src/components/tables/VolunteeringSupportDocumentsTable';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { defaultCountry, preferredCountries } from 'src/utils/util';
import * as Yup from 'yup';
import AddCertificationDialog from './AddCertificationDialog';
import AddSupportingDocumentDialog from './AddSupportingDocumentDialog';
import AvailabilityTable from './availabilityTable';
import Individual from './individual';
import Organization from './organization';
import ProfilePicture from './ProfilePicture';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

export default function EditProfile({ user: userData, setEdit, userLoading, refetch }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [profileImg, setProfileImg] = React.useState('');
  const [selectedProfileFile, setSelectedProfileFile] = React.useState(null);
  const [updateImage, setUpdateImage] = React.useState(false);
  const [openCertificationDialog, setOpenCertificationDialog] = React.useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = React.useState(false);
  const [openVolunteerReleaseDialog, setOpenVolunteerReleaseDialog] = React.useState(false);

  const { masterData } = useSelector((state) => state?.common);

  const userVolunteering = getLabelObject(masterData, 'dpw_foundation_user_volunteering');
  const languages = getLabelObject(masterData, 'dpwf_language');

  const { mutate: updateExternalMutate, isLoading: updateLoading } = useMutation(
    'updateExternalUser',
    api.updateExternalUser,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        setEdit(false);
        refetch();
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const { mutate: deleteSkillCertification } = useMutation(
    'deleteSkillCertification',
    (id) => volunteerApi.deleteSkillCertification(id),
    {
      onSuccess: (response, deletedId) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        // Remove from local state instead of refetching
        const updatedCertifications = values.skillCertifications.filter((cert) => cert && cert.id !== deletedId);
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
        const updatedDocuments = values.volunteeringSupportDocuments.filter((doc) => doc && doc.id !== deletedId);
        setFieldValue('volunteeringSupportDocuments', updatedDocuments);
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );
  useEffect(() => {
    if (userData?.photoFileUrl) {
      setProfileImg(userData?.photoFileUrl);
    }
  }, [userData?.photoFileUrl]);

  const getBasicDetails = (userData) => ({
    photoFileId: userData?.photoFileId || '',
    photoFileUrl: userData?.photoFileUrl || '',
    label: userData?.firstName || '',
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    salutation: userData?.salutation || '',
    mobile: userData?.mobile || '',
    landlineNumber: userData?.landlineNumber || '',
    dob: userData?.dob || null
  });

  const getEmploymentDetails = (userData) => ({
    isEmployed: userData?.isEmployed ?? false,
    employer: userData?.employer || '',
    isDpwEmployee: userData?.isDpwEmployee ?? false,
    isGovAffiliate: userData?.isGovAffiliate ?? false,
    employeeId: userData?.employeeId || '',
    companyName: userData?.companyName || '',
    department: userData?.department || ''
  });

  const getPersonalDetails = (userData) => ({
    maritalStatus: userData?.maritalStatus || '',
    gender: userData?.gender || '',
    nationality: userData?.nationality || '',
    currentCountryOfResidence: userData?.currentCountryOfResidence || '',
    state: userData?.state || '',
    city: userData?.city || '',
    homeAddress: userData?.homeAddress || '',
    mailingAddress: userData?.mailingAddress || '',
    relationWithEmergencyContact: userData?.relationWithEmergencyContact || ''
  });

  const getVolunteeringDetails = (userData) => ({
    isVolunteer: userData?.isVolunteer ?? false,
    volunteeringArea:
      userData?.volunteeringArea?.length > 0 ? userData?.volunteeringArea?.map((item) => item.code) : [],
    nativeLanguage: userData?.nativeLanguage || '',
    otherLanguage: userData?.otherLanguage?.length > 0 ? userData?.otherLanguage?.map((item) => item.code) : [],
    skillCertification: userData?.skillCertification || '',
    dlAvailability: userData?.dlAvailability ?? false,
    carAvailability: userData?.carAvailability ?? false,
    homePhoneNumber: userData?.homePhoneNumber || '',
    otherVolunteeringArea: userData?.otherVolunteeringArea || '',
    availability: userData?.availability || [],
    skillCertifications: userData?.skillCertifications || [],
    volunteeringSupportDocuments: userData?.volunteeringSupportDocuments || [],
    volunteerReleaseAccepted: userData?.volunteerReleaseAccepted ?? false
  });

  const getDonationDetails = (userData) => ({
    donationInterested: userData?.donationInterested ?? false,
    contributionType: userData?.contributionType || '',
    acknowledgementPreference: userData?.acknowledgementPreference || '',
    communicationSubscription: userData?.communicationSubscription ?? false
  });

  const getOrganizationDetails = (userData) => ({
    organizationDetails: {
      id: userData?.organizationDetails?.id || '',
      organizationName: userData?.organizationDetails?.organizationName || '',
      organizationInfo: userData?.organizationDetails?.organizationInfo || '',
      organizationRegistrationNumber: userData?.organizationDetails?.organizationRegistrationNumber || '',
      designation: userData?.organizationDetails?.designation || ''
    },
    orgAttachments: userData?.orgAttachments || []
  });

  const getDocumentDetails = (userData) => ({
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
  });
  const getBankDetail = (userData) => ({
    id: userData?.bankDetail?.id || '',
    bankBeneficiaryName: userData?.bankDetail?.bankBeneficiaryName || '',
    bankName: userData?.bankDetail?.bankName || '',
    bankAccount: userData?.bankDetail?.bankAccount || '',
    bankIban: userData?.bankDetail?.bankIban || '',
    bankSwiftCode: userData?.bankDetail?.bankSwiftCode || ''
  });
  const getInitialValues = (userData) => ({
    ...getBasicDetails(userData),
    ...getEmploymentDetails(userData),
    ...getPersonalDetails(userData),
    ...getVolunteeringDetails(userData),
    ...getDonationDetails(userData),
    ...getOrganizationDetails(userData),
    ...getDocumentDetails(userData),
    bankDetail: getBankDetail(userData),
    accountType: userData?.accountType || '',
    preferredCommunication: userData?.preferredCommunication || '',
    emergencyContactName: userData?.emergencyContactName || '',
    emergencyContactNumber: userData?.emergencyContactNumber || '',
    relationWithEmergencyContact: userData?.relationWithEmergencyContact || '',
    assistanceRequested: userData?.assistanceRequested || '',
    updatedBy: userData?.updatedBy || ''
  });
  const getValidationSchema = () =>
    Yup.object().shape({
      bankDetail: Yup.object().shape({
        bankBeneficiaryName: Yup.string()
          .matches(/^[A-Za-z ]+$/, 'Only alphabets allowed')
          .max(255, 'Max 255 characters allowed')
          .when([], () =>
            isBankDetailRequired ? Yup.string().required('Beneficiary Name is required') : Yup.string()
          ),

        bankName: Yup.string()
          .matches(/^[A-Za-z ]+$/, 'Only alphabets allowed')
          .max(255, 'Max 255 characters allowed')
          .when([], () => (isBankDetailRequired ? Yup.string().required('Bank is required') : Yup.string())),

        bankAccount: Yup.string()
          .matches(/^\d+$/, 'Only numeric values allowed')
          .max(22, 'Max 22 digits allowed')
          .when([], () => (isBankDetailRequired ? Yup.string().required('Account is required') : Yup.string())),

        bankIban: Yup.string()
          .matches(/^[A-Za-z0-9]+$/, 'Only alphanumeric values allowed')
          .max(255, 'Max 255 characters allowed')
          .when([], () => (isBankDetailRequired ? Yup.string().required('IBAN is required') : Yup.string())),

        bankSwiftCode: Yup.string()
          .matches(/^[A-Za-z0-9]+$/, 'Only alphanumeric values allowed')
          .max(255, 'Max 255 characters allowed')
          .when([], () => (isBankDetailRequired ? Yup.string().required('SWIFT Code is required') : Yup.string()))
      }),
      documentDetails: Yup.array().of(
        Yup.object().shape({
          documentImageId: Yup.string().when(['documentType', 'documentNumber', 'documentValidity'], {
            is: (documentType, documentNumber, documentValidity) => documentType || documentNumber || documentValidity,
            then: (schema) => schema.required('Document upload is required when other fields are filled'),
            otherwise: (schema) => schema
          })
        })
      )
    });
  const formik = useFormik({
    initialValues: getInitialValues(userData),
    validationSchema: getValidationSchema(),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const data = {
        organizationDetails: {
          id: values.organizationId,
          organizationName: values.organizationName,
          organizationInfo: values.organizationInfo,
          organizationRegistrationNumber: values.organizationRegistrationNumber,
          designation: values.designation
        },
        ...values
      };

      if (data['accountType'] && data['accountType'] !== 'Organization') {
        data['emergencyContactNumber'] = data['emergencyContactNumber'].replace(/\s+/g, '');
      }
      if (data['volunteeringArea']) {
        data['volunteeringArea'] = data['volunteeringArea']?.map((code) => ({ code }));
      }
      if (data['otherLanguage']) {
        data['otherLanguage'] = data['otherLanguage']?.map((code) => ({ code }));
      }
      if (data['dob']) {
        data['dob'] = format(new Date(data['dob']), "yyyy-MM-dd'T'HH:mm:ss");
      }
      if (data['documentValidity']) {
        data['documentValidity'] = format(new Date(data['documentValidity']), 'yyyy-MM-dd');
      }
      // Upload profile image if a new file is selected
      if (selectedProfileFile) {
        try {
          const formData = new FormData();
          formData.append('file', selectedProfileFile);
          const uploadResponse = await new Promise((resolve, reject) => {
            uploadProfile(
              { payload: formData, entityId: userData?.id },
              {
                onSuccess: resolve,
                onError: reject
              }
            );
          });
          if (uploadResponse?.photoFileId) {
            data['photoFileId'] = uploadResponse.photoFileId;
          }
        } catch (error) {
          console.error('Profile image upload failed:', error);
          return; // Stop form submission if image upload fails
        }
      } else if (profileImg && typeof profileImg === 'string') {
        data['photoFileId'] = profileImg;
      }
      if (data['accountType'] && data['accountType'] == 'Organization') {
        data['emergencyContactNumber'] = '+971999999999';
      }
      updateExternalMutate({ id: userData.id, payload: data });
    }
  });
  const { values, handleSubmit, getFieldProps, setFieldValue, touched, errors } = formik;

  const { mutate: uploadProfile } = useMutation('uploadProfile', api.uploadProfilePhoto);

  const isBankDetailRequired = userData?.contributedAs?.some((role) => role === 'GRANT' || role === 'PARTNER');

  const handleSelectProfile = (files) => {
    const file = files[0];
    if (file) {
      // Validate file size (assuming 5MB limit)
      const maxSizeKB = 5120; // 5MB in KB
      if (file.size > maxSizeKB * 1024) {
        dispatch(
          setToastMessage({
            message: `File size exceeds the limit of ${maxSizeKB} KB.`,
            variant: 'error'
          })
        );
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        dispatch(
          setToastMessage({
            message: 'Please select a valid image file (JPEG, JPG, PNG, GIF).',
            variant: 'error'
          })
        );
        return;
      }

      setSelectedProfileFile(file);
      setProfileImg(file);
    }
  };
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={4} direction="row" justifyContent="space-between" alignItems="center">
          <Typography textAlign="center" variant="h5" color="primary.main" textTransform="uppercase">
            My Profile
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              type="button"
              size="large"
              variant="outlined"
              onClick={() => setEdit(false)}
              sx={{ marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button type="submit" size="large" variant="contained" loading={updateLoading}>
              Save
            </Button>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondarydark" component="p" my={2}>
          Complete Your Profile to Get the Most Out of Your Experience!
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={4} mb={4}>
            <Typography textAlign="center" variant="h6" color="primary.main" textTransform="uppercase">
              Basic details
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ProfilePicture
                imageUrl={profileImg && typeof profileImg === 'object' ? URL.createObjectURL(profileImg) : profileImg}
                onChange={(event) => {
                  const file = Array.from(event.target.files || []);
                  handleSelectProfile(file);
                }}
                name="photoFileId"
                updateImage={updateImage}
              />
            </Grid>
            {userData?.accountType === 'Individual' ? (
              <Individual userLoading={userLoading} userData={userData} refetch={refetch} />
            ) : (
              <Organization userLoading={userLoading} userData={userData} refetch={refetch} />
            )}
          </Grid>
          <Typography variant="h6" component={'h6'} color="primary.main" textTransform="uppercase" my={3}>
            Banking Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton isLoading={userLoading}>
                <TextField
                  variant="standard"
                  label="Beneficiary Name"
                  fullWidth
                  required={isBankDetailRequired}
                  {...getFieldProps('bankDetail.bankBeneficiaryName')}
                  error={Boolean(touched?.bankDetail?.bankBeneficiaryName && errors?.bankDetail?.bankBeneficiaryName)}
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
                  required={isBankDetailRequired}
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
                  required={isBankDetailRequired}
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
                  required={isBankDetailRequired}
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
                  required={isBankDetailRequired}
                  {...getFieldProps('bankDetail.bankSwiftCode')}
                  error={Boolean(touched?.bankDetail?.bankSwiftCode && errors?.bankDetail?.bankSwiftCode)}
                  helperText={touched?.bankDetail?.bankSwiftCode && errors?.bankDetail?.bankSwiftCode}
                />
              </FieldWithSkeleton>
            </Grid>
          </Grid>

          <Typography variant="h6" color="primary.main" textTransform="uppercase" my={3}>
            Donor Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondarydark">
                Are you interested in Donation with DPW Foundation?
              </Typography>
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <RadioGroup
                  row
                  aria-label="donation-interest"
                  name="donationInterested"
                  value={values.donationInterested === true ? 'true' : 'false'}
                  onChange={(e) => {
                    setFieldValue('donationInterested', e.target.value === 'true');
                    if (e.target.value === 'false') {
                      setFieldValue('contributionType', '');
                      setFieldValue('acknowledgementPreference', '');
                      setFieldValue('communicationSubscription', false);
                    }
                  }}
                  sx={{ gap: 5 }}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="Not for now" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {values.donationInterested === true && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondarydark">
                    What type of donations would you like to contribute?
                  </Typography>
                  <FormControl component="fieldset" sx={{ mt: 1 }}>
                    <RadioGroup
                      row
                      aria-label="donation-interest"
                      name="contributionType"
                      value={values.contributionType}
                      onChange={(e) => setFieldValue('contributionType', e.target.value)}
                      sx={{ gap: 5 }}
                    >
                      <FormControlLabel value="Financial" control={<Radio />} label="Financial" />
                      <FormControlLabel value="In Kind" control={<Radio />} label="In Kind" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondarydark">
                    Select donation acknowledgement preferences
                  </Typography>
                  <FormControl component="fieldset" sx={{ mt: 1 }}>
                    <RadioGroup
                      row
                      aria-label="donation-interest"
                      name="acknowledgementPreference"
                      value={values.acknowledgementPreference}
                      onChange={(e) => setFieldValue('acknowledgementPreference', e.target.value)}
                    >
                      <FormControlLabel value="Email" control={<Radio />} label="Email" sx={{ mr: 3 }} />
                      <FormControlLabel value="Postal" control={<Radio />} label="Postal" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondarydark">
                    Subscribe to Newsletter?
                  </Typography>
                  <FormControl component="fieldset" sx={{ mt: 1 }}>
                    <RadioGroup
                      row
                      aria-label="donation-interest"
                      name="communicationSubscription"
                      value={values.communicationSubscription === true ? 'true' : 'false'}
                      onChange={(e) => setFieldValue('communicationSubscription', e.target.value === 'true')}
                      sx={{ gap: 5 }}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="Not for now" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
          {values?.accountType === 'Individual' && (
            <>
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
                      aria-label="donation-interest"
                      name="isVolunteer"
                      value={values.isVolunteer === true ? 'true' : 'false'}
                      onChange={(e) => {
                        setFieldValue('isVolunteer', e.target.value === 'true');
                        if (e.target.value === 'false') {
                          setFieldValue('dlAvailability', false);
                          setFieldValue('carAvailability', false);
                        }
                      }}
                      sx={{ gap: 5 }}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {values.isVolunteer === true && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondarydark">
                        Is DPW Group Employee?
                      </Typography>
                      <FormControl component="fieldset" sx={{ mt: 1 }}>
                        <RadioGroup
                          row
                          aria-label="dpw-employee"
                          name="isDpwEmployee"
                          value={values.isDpwEmployee === true ? 'true' : 'false'}
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
                            <FieldWithSkeleton isLoading={userLoading}>
                              <TextField
                                id="employeeId"
                                variant="standard"
                                inputProps={{ maxLength: 256 }}
                                label="Enter Employee ID"
                                fullWidth
                                {...getFieldProps('employeeId')}
                              />
                            </FieldWithSkeleton>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FieldWithSkeleton isLoading={userLoading}>
                              <TextField
                                id="companyName"
                                variant="standard"
                                inputProps={{ maxLength: 256 }}
                                label="Enter Company"
                                fullWidth
                                {...getFieldProps('companyName')}
                              />
                            </FieldWithSkeleton>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FieldWithSkeleton isLoading={userLoading}>
                              <TextField
                                id="department"
                                variant="standard"
                                inputProps={{ maxLength: 256 }}
                                label="Enter Department"
                                fullWidth
                                {...getFieldProps('department')}
                              />
                            </FieldWithSkeleton>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondarydark">
                        Have Driving Licence ?
                      </Typography>
                      <FormControl component="fieldset" sx={{ mt: 1 }}>
                        <RadioGroup
                          row
                          aria-label="donation-interest"
                          name="dlAvailability"
                          value={values.dlAvailability === true ? 'true' : 'false'}
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
                        Has Own Car?
                      </Typography>
                      <FormControl component="fieldset" sx={{ mt: 1 }}>
                        <RadioGroup
                          row
                          aria-label="donation-interest"
                          name="carAvailability"
                          value={values.carAvailability === true ? 'true' : 'false'}
                          onChange={(e) => setFieldValue('carAvailability', e.target.value === 'true')}
                          sx={{ gap: 5 }}
                        >
                          <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                          <FormControlLabel value="false" control={<Radio />} label="No" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FieldWithSkeleton isLoading={userLoading}>
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
                          itemsData={languages?.values || []}
                          value={values?.nativeLanguage}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item container spacing={3} md={12}>
                      <Grid item xs={12} md={6}>
                        <FieldWithSkeleton isLoading={userLoading}>
                          <Autocomplete
                            multiple
                            limitTags={2}
                            options={languages?.values || []}
                            value={
                              languages?.values?.filter((lang) => values?.otherLanguage?.includes(lang.code)) || []
                            }
                            onChange={(event, newValue) => {
                              setFieldValue(
                                'otherLanguage',
                                newValue.map((lang) => lang.code)
                              );
                            }}
                            getOptionLabel={(option) => (option && option?.label) || ''}
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  size="small"
                                  label={option.label}
                                  {...getTagProps({ index })}
                                  key={option.code || index}
                                />
                              ))
                            }
                            isOptionEqualToValue={(option, value) => option?.code === value?.code}
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
                                {item.label}
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
                            value={userVolunteering?.values.filter((user) =>
                              values?.volunteeringArea.includes(user.code)
                            )}
                            onChange={(event, newValue) => {
                              setFieldValue(
                                'volunteeringArea',
                                newValue.map((user) => user.code)
                              );
                            }}
                            getOptionLabel={(option) => (option && option?.label) || ''}
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  size="small"
                                  label={option.label}
                                  {...getTagProps({ index })}
                                  key={option.code || index}
                                />
                              ))
                            }
                            isOptionEqualToValue={(option, value) => option?.code === value?.code}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={<>Select Volunteering Areas of Interests</>}
                                variant="standard"
                                error={touched.volunteeringArea && Boolean(errors.volunteeringArea)}
                                InputProps={{
                                  ...params.InputProps
                                }}
                              />
                            )}
                            renderOption={(props, item) => (
                              <li {...props} key={item.code}>
                                {item.label}
                              </li>
                            )}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      {values?.volunteeringArea?.includes('other') && (
                        <Grid item xs={12} md={6}>
                          <FieldWithSkeleton isLoading={userLoading}>
                            <TextField
                              id="otherVolunteeringArea"
                              variant="standard"
                              inputProps={{ maxLength: 256 }}
                              label="Add area of Interest"
                              fullWidth
                              // {...getFieldProps('otherVolunteeringArea')}
                            />
                          </FieldWithSkeleton>
                        </Grid>
                      )}
                    </Grid>

                    {/* Skills Certifications Section */}
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
                        userData={userData}
                      />
                    </Grid>
                    {/* Volunteering Supporting Documents Section */}
                    <Grid item xs={12}>
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
                        userData={userData}
                      />
                    </Grid>
                    {/* Volunteer Release Checkbox */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.volunteerReleaseAccepted === true}
                            onChange={(e) => {
                              if (values.volunteerReleaseAccepted !== true && e.target.checked) {
                                setOpenVolunteerReleaseDialog(true);
                              } else {
                                setFieldValue('volunteerReleaseAccepted', e.target.checked);
                              }
                            }}
                          />
                        }
                        label="Volunteer Release and Undertaking"
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              {values.isVolunteer === true && (
                <>
                  <Grid item md={12} mt={3}>
                    <Typography textAlign="left" variant="h7" color="primary.main" textTransform="uppercase" mb={1}>
                      Available for Volunteering?
                    </Typography>
                    <Typography textAlign="left" variant="body2" color="text.secondarydark">
                      Select the days you are available for volunteering
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={3}>
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
                  <Stack mb={4} mt={4}>
                    <AvailabilityTable />
                  </Stack>
                </>
              )}
            </>
          )}
        </Paper>

        <AddCertificationDialog
          open={openCertificationDialog}
          onClose={() => setOpenCertificationDialog(false)}
          userData={userData}
          onSave={(certData) => {
            setFieldValue('skillCertifications', [...(values.skillCertifications || []), certData]);
          }}
        />

        <AddSupportingDocumentDialog
          open={openDocumentDialog}
          onClose={() => setOpenDocumentDialog(false)}
          userData={userData}
          onSave={(docData) => {
            setFieldValue('volunteeringSupportDocuments', [...(values.volunteeringSupportDocuments || []), docData]);
          }}
        />

        <VolunteerReleaseDialog
          open={openVolunteerReleaseDialog}
          onClose={() => setOpenVolunteerReleaseDialog(false)}
          onAgree={() => {
            setFieldValue('volunteerReleaseAccepted', true);
            setOpenVolunteerReleaseDialog(false);
          }}
        />
      </Form>
    </FormikProvider>
  );
}
