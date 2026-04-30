import {
  Box,
  Button,
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
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import TextFieldSelect from 'src/components/TextFieldSelect';
import DatePickers from 'src/components/datePicker';
import FileUpload from 'src/components/fileUpload';
import { DeleteIconRed } from 'src/components/icons';
import { handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { defaultCountry, preferredCountries } from 'src/utils/constants';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { downloadFile } from 'src/utils/fileUtils';
import ProfilePicture from '../../users/profilePicture';
import ProfileStyle from './profile.style';

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

const Step1Form = ({
  isLoading,
  data,
  donorType = 'Individual',
  setIsDpwEmployee,
  userData,
  refetch,
  setIsAdvanced,
  profileImg,
  setProfileImg
}) => {
  const dispatch = useDispatch();
  const { touched, errors, getFieldProps, setFieldValue, values, handleBlur } = useFormikContext();

  // Centralized label configuration to reduce cognitive complexity
  const donorLabels = {
    email: {
      individual: 'Email ID',
      organization: 'Organization Contact Person Email ID'
    },
    firstName: {
      individual: 'First Name',
      organization: 'Organization Contact Person First Name'
    },
    secondName: {
      individual: 'Second Name',
      organization: 'Organization Contact Person Second Name'
    },
    phoneNumber: {
      individual: 'Enter Phone Number',
      organization: 'Enter Organization Contact Person Phone Number'
    },
    country: {
      individual: 'Select Country',
      organization: 'Select Organization Country Where Registered'
    },
    state: {
      individual: 'Select State/Province',
      organization: 'Select Organization State/Province Where Registered'
    },
    city: {
      individual: 'Select City',
      organization: 'Select Organization City Where Registered'
    }
  };

  const getLabel = (fieldKey) => {
    const isIndividual = donorType === 'Individual';
    return donorLabels[fieldKey]?.[isIndividual ? 'individual' : 'organization'] || '';
  };
  const { masterData } = useSelector((state) => state?.common);
  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const genders = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const preferredCommunications = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);
  const [updateImage, setUpdateImage] = React.useState(false);
  const documentIndex = useRef(0);
  const theme = useTheme();
  const style = ProfileStyle(theme);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const { data: stateData } = useQuery(
    ['getStates', values?.currentCountryOfResidence],
    () => api.getStates(values?.currentCountryOfResidence),
    {
      enabled: !!values?.currentCountryOfResidence,
      refetchOnWindowFocus: false // Avoid fetching when the window refocuses
    }
  );
  const { data: citiesData } = useQuery(
    ['getCities', values?.state],
    () => api.getCities(values?.currentCountryOfResidence, values?.state),
    {
      enabled: !!values?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

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

  const { mutate: deleteOrgMutation } = useMutation('deleteOrgMutation', api.deleteCampaignMedia, {
    onSuccess: (response, fileId) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const filterOrgAttachArray = [...values.orgAttachments].filter((item) => item.id !== fileId.id);
      setFieldValue('orgAttachments', filterOrgAttachArray);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });
  const { mutate: deleteMediaMutation } = useMutation('deleteMedia', api.deleteCampaignMedia, {
    onSuccess: (response, variables) => {
      const updatedDocuments = values.documentDetails.map((doc) => {
        if (doc.documentImageId === variables?.id) {
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

  const { mutate } = useMutation('uploadCampaignFiles', api.uploadFiles, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const uploadedFile = response.data;
      const newFiles = [...values.orgAttachments, uploadedFile];
      setFieldValue('orgAttachments', newFiles);
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
    }
  });

  const { mutate: mutateDocument } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: (response) => {
      let documentDetails = [...values.documentDetails];

      let updatedDocument = {
        ...documentDetails[documentIndex.current],
        documentImageId: response.data.id,
        fileName: response.data.fileName
      };

      documentDetails[documentIndex.current] = updatedDocument;
      setFieldValue('documentDetails', documentDetails);

      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
    }
  });

  const handleDeleteFile = (file, value, fieldName) => {
    if (file?.id) {
      deleteOrgMutation(file);
    }
  };

  const handleDocumentsDeleteFile = (id) => {
    if (id) {
      deleteMediaMutation({ id, userId: data?.donorPledgeResponse?.createdBy });
    }
  };

  const handleFileUpload = (files, fieldName, entityType, moduleType) => {
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
      mutate({ entityId: data?.createdBy, entityType, moduleType, payload: formData });
    });
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
      mutateDocument({ entityId: data?.donorUserId, entityType, moduleType, payload: formData });
    });
  };

  const getGenderError = (touched, errors) => touched.gender && errors.gender;

  const remove = (indexToRemove) => {
    const updatedDocuments = values.documentDetails.filter((_, i) => i !== indexToRemove);
    setFieldValue('documentDetails', updatedDocuments);
  };

  const { mutate: downloadMedia } = useMutation('downloadMedia', api.downloadMedia, {
    onSuccess: (blob, fileId) => {
      downloadFile(blob, fileId); // Handle file download
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' })); // Show success message
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' })); // Show error message
    }
  });
  useEffect(() => {
    if (data?.photoUrl) {
      setProfileImg(data?.photoUrl);
    }
  }, [data?.photoUrl]);
  const handleSelectProfile = (files) => {
    handleFileUploadValidation(files, {
      mutate: uploadProfile,
      entityId: data?.createdBy,
      setToastMessage,
      dispatch
    });
  };

  const IndividualDonar = donorType === 'Individual';

  const getProfileImageUrl = (img) => {
    if (img && typeof img === 'object') {
      return URL.createObjectURL(img);
    }
    return img;
  };

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black">
        Donor Information Form
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle6" color="primary.main" mt={3} component={'p'} textTransform="uppercase">
            Profile Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ProfilePicture
            imageUrl={getProfileImageUrl(profileImg)}
            onChange={(event) => {
              const file = Array.from(event.target.files || []);
              handleSelectProfile(file);
              setProfileImg(file[0]);
            }}
            name="photoFileId"
            updateImage={updateImage}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              User ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.userId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {donorType ? donorType : 'Individual'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {getLabel('email')}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.email || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {getLabel('firstName')}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {data?.firstName || '-'}{' '}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {getLabel('secondName')}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {data?.lastName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton isLoading={isLoading}>
            <MuiTelInput
              label={
                <>
                  {getLabel('phoneNumber')}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              id="phone"
              preferredCountries={preferredCountries}
              defaultCountry={defaultCountry}
              fullWidth
              value={values?.mobile}
              onChange={(value) => {
                const cleanedValue = value ? value.replace(/\s/g, '') : '';
                setFieldValue('mobile', cleanedValue);
              }}
              onBlur={handleBlur('mobile')} // Make sure this is present
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
        {!IndividualDonar && (
          <Grid item xs={12} sm={6}>
            <FieldWithSkeleton isLoading={isLoading} error={touched.organizationName && errors.organizationName}>
              <TextField
                id="organizationName"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Organization Name
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('organizationName')}
                error={Boolean(touched.organizationName && errors.organizationName)}
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        {!IndividualDonar && (
          <Grid item xs={12} sm={6}>
            <FieldWithSkeleton isLoading={isLoading} error={touched.designation && errors.designation}>
              <TextField
                id="designation"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Organization Contact Person Designation
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('designation')}
                error={Boolean(touched.designation && errors.designation)}
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.currentCountryOfResidence && errors.currentCountryOfResidence}
          >
            <TextFieldSelect
              id="currentCountryOfResidence"
              label={
                <>
                  {getLabel('country')}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={country}
              error={Boolean(touched.currentCountryOfResidence && errors.currentCountryOfResidence)}
              sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.state && errors.state}>
            <TextFieldSelect
              id="state"
              label={
                <>
                  {getLabel('state')}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={stateData}
              error={Boolean(touched.state && errors.state)}
              sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.city && errors.city}>
            <TextFieldSelect
              id="city"
              label={
                <>
                  {getLabel('city')}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={citiesData}
              error={Boolean(touched.city && errors.city)}
              sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.mailingAddress && errors.mailingAddress}>
            <TextField
              id="mailingAddress"
              variant="standard"
              inputProps={{ maxLength: 256 }}
              label={
                <>
                  Enter Mailing Address
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              fullWidth
              {...getFieldProps('mailingAddress')}
              error={Boolean(touched.mailingAddress && errors.mailingAddress)}
            />
          </FieldWithSkeleton>
        </Grid>
        {!IndividualDonar && (
          <Grid item xs={12} sm={6}>
            <FieldWithSkeleton
              isLoading={isLoading}
              error={touched.organizationRegistrationNumber && errors.organizationRegistrationNumber}
            >
              <TextField
                id="organizationRegistrationNumber"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Organization Registration Number
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('organizationRegistrationNumber')}
                error={Boolean(touched.organizationRegistrationNumber && errors.organizationRegistrationNumber)}
              />
            </FieldWithSkeleton>
          </Grid>
        )}

        {IndividualDonar && (
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={isLoading}>
              <DatePickers
                label={'Select Date of Birth'}
                inputFormat={'yyyy-MM-dd'}
                onChange={(newFromDate) => {
                  setFieldValue('dob', newFromDate);
                }}
                value={values?.dob}
                handleClear={() => {
                  setFieldValue('dob', null);
                }}
                maxDate={new Date()} // This disables future dates
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        {IndividualDonar && (
          <Grid item xs={12} sm={6} lg={6}>
            <FieldWithSkeleton isLoading={isLoading} error={touched.gender && errors.gender}>
              <TextFieldSelect
                id="gender"
                label={
                  <>
                    Select Gender
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={genders?.values || []}
                value={values?.gender}
                error={Boolean(getGenderError(touched, errors))}
                sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
              />
            </FieldWithSkeleton>
          </Grid>
        )}

        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.preferredCommunication && errors.preferredCommunication}
          >
            <TextFieldSelect
              id="preferredCommunication"
              label={
                <>
                  Select Preferred Communication Mode
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={preferredCommunications?.values}
              value={values?.preferredCommunication}
              error={Boolean(touched.preferredCommunication && errors.preferredCommunication)}
              sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.emergencyContactName && errors.emergencyContactName}>
            <TextField
              id="emergencyContactName"
              variant="standard"
              inputProps={{ maxLength: 256 }}
              label={<>Enter Emergency Contact Name</>}
              fullWidth
              {...getFieldProps('emergencyContactName')}
              error={Boolean(touched.emergencyContactName && errors.emergencyContactName)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.emergencyContactNumber && errors.emergencyContactNumber}
          >
            <MuiTelInput
              label={
                <>
                  Emergency Contact Number
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              id="phone"
              preferredCountries={preferredCountries}
              defaultCountry={defaultCountry}
              fullWidth
              value={values?.emergencyContactNumber}
              onChange={(value) => {
                const cleanedValue = value ? value.replace(/\s/g, '') : '';
                setFieldValue('emergencyContactNumber', cleanedValue);
              }}
              onBlur={handleBlur('emergencyContactNumber')}
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
        {!IndividualDonar && (
          <Grid item xs={12} sm={12}>
            <FieldWithSkeleton isLoading={isLoading} error={touched.organizationInfo && errors.organizationInfo}>
              <TextField
                id="organizationInfo"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Organization Description (Please describe briefly what activities your organization perform in
                    the field of charity )
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('organizationInfo')}
                error={Boolean(touched.organizationInfo && errors.organizationInfo)}
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        <Grid item md={12}>
          <Stack
            gap={3}
            justifyContent="space-between"
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
              Identity Documents Details
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() =>
                setFieldValue('documentDetails', [
                  ...values.documentDetails,
                  {
                    documentType: '',
                    documentNumber: '',
                    documentValidity: null,
                    documentImageId: null,
                    fileName: ''
                  }
                ])
              }
            >
              Add More Documents
            </Button>
          </Stack>
          {/* )} */}

          {values?.documentDetails?.map((doc, index) => (
            <Box
              key={doc?.documentImageId}
              sx={{
                background: (theme) => theme.palette.grey[100],
                p: 3,
                mt: 2,
                position: 'relative'
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <FieldWithSkeleton isLoading={isLoading}>
                    <TextFieldSelect
                      id={`documentDetails.${index}.documentType`}
                      label="Select Identity Document Type"
                      getFieldProps={getFieldProps}
                      itemsData={documentTypes?.values}
                      value={values.documentDetails[index].documentType}
                      onChange={(e) => setFieldValue(`documentDetails.${index}.documentType`, e.target.value)}
                      error={
                        touched?.documentDetails?.[index]?.documentType &&
                        Boolean(errors?.documentDetails?.[index]?.documentType)
                      }
                      helperText={
                        touched?.documentDetails?.[index]?.documentType &&
                        errors?.documentDetails?.[index]?.documentType
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
                      error={
                        touched?.documentDetails?.[index]?.documentNumber &&
                        Boolean(errors?.documentDetails?.[index]?.documentNumber)
                      }
                      helperText={
                        touched?.documentDetails?.[index]?.documentNumber &&
                        errors?.documentDetails?.[index]?.documentNumber
                      }
                      fullWidth
                      value={values.documentDetails[index].documentNumber}
                      onChange={(e) => setFieldValue(`documentDetails.${index}.documentNumber`, e.target.value)}
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
                      error={
                        touched?.documentDetails?.[index]?.documentValidity &&
                        Boolean(errors?.documentDetails?.[index]?.documentValidity)
                      }
                      helperText={
                        touched?.documentDetails?.[index]?.documentValidity &&
                        errors?.documentDetails?.[index]?.documentValidity
                      }
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                    sx={{ pt: 1.5 }}
                  >
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
                    <Stack flexDirection="row" flexWrap="wrap" alignItems="Center" gap={1.2}>
                      <Box key={`steps_${values?.documentDetails?.[index]?.documentImageId}`}>
                        <Typography component="div" variant="body2" color="text.secondarydark">
                          <Box
                            component="span"
                            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => downloadMedia(values?.documentDetails?.[index]?.documentImageId)}
                          >
                            {values.documentDetails[index].fileName}
                          </Box>
                          {values?.documentDetails?.[index]?.documentImageId && (
                            <Tooltip title="Remove" arrow>
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  handleDocumentsDeleteFile(values?.documentDetails?.[index]?.documentImageId)
                                }
                              >
                                <DeleteIconRed />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid>
                {/* {donorType === 'Individual' && ( */}
                <Box sx={style.deleteIcon}>
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIconRed />
                  </IconButton>
                </Box>
                {/* )} */}
              </Grid>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" textTransform={'uppercase'} color="primary.main">
            Additional Details
          </Typography>
        </Grid>
        {!IndividualDonar && (
          <Grid item xs={12}>
            <Typography variant="body3" component="p" color="text.secondary" sx={{ mb: 1 }}>
              Organization Related Documents Attachments *
            </Typography>
            <FileUpload
              buttonText="Attach Documents "
              name="orgAttachments"
              multiple
              size="small"
              onChange={(event) => {
                handleFileUpload(
                  Array.from(event.target.files),
                  'orgAttachments',
                  'DONOR',
                  'DONOR_ORGANIZATION_DOC_ATTACHMENT'
                );
              }}
            />
            {values?.orgAttachments && values.orgAttachments.length > 0 && (
              <Stack flexDirection="row" flexWrap="wrap" alignItems="Center" sx={{ pt: 3 }} gap={1.2}>
                {Array.from(values?.orgAttachments)?.map((file) => (
                  <Box key={`steps_${file?.id}`}>
                    <Typography component="div" variant="body2" color="text.secondarydark">
                      <Box
                        component="span"
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => downloadMedia(file?.id)}
                      >
                        {file?.fileName}
                      </Box>
                      {file?.id && (
                        <Tooltip title="Remove">
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteFile(file, values.orgAttachments, 'orgAttachments')}
                          >
                            <DeleteIconRed />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Typography variant="body3" component="p" color="text.secondary">
            Select Donation Acknowledgement Preferences *
          </Typography>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              row
              aria-label="donation-interest"
              name="acknowledgementPreference"
              value={values?.acknowledgementPreference}
              onChange={(e) => setFieldValue('acknowledgementPreference', e.target.value)}
            >
              <FormControlLabel value="Email" control={<Radio />} label="Email" sx={{ mr: 3 }} />
              <FormControlLabel value="Postal" control={<Radio />} label="Postal" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body3" component="p" color="text.secondary">
            Subscribe to newsletter? *
          </Typography>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              row
              aria-label="donation-interest"
              name="communicationSubscription"
              value={values?.communicationSubscription}
              onChange={(e) => setFieldValue('communicationSubscription', e.target.value)}
              sx={{ gap: 5 }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="Not for now" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body3" component="p" color="text.secondary">
            Is the donor is an employee of DP World group or its Sister Organizations? *
          </Typography>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              row
              aria-label="donation-interest"
              name="isDpwEmployee"
              value={values?.isDpwEmployee}
              // setIsDpwEmployee
              onChange={(e) => {
                setFieldValue('isDpwEmployee', e.target.value);
                setIsDpwEmployee(e.target.value);
              }}
              sx={{ gap: 5 }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {(values?.isDpwEmployee === 'true' || values?.isDpwEmployee === true) && (
          <Grid item container spacing={3} md={12}>
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton>
                <TextField
                  error={touched?.employeeId && Boolean(errors?.employeeId)}
                  helperText={touched?.employeeId && errors?.employeeId}
                  id="employeeId"
                  variant="standard"
                  inputProps={{ maxLength: 256 }}
                  label="Employee ID *"
                  fullWidth
                  {...getFieldProps('employeeId')}
                />
              </FieldWithSkeleton>
            </Grid>

            <Grid item xs={12} md={6}>
              <FieldWithSkeleton>
                <TextField
                  id="companyName"
                  error={touched?.companyName && Boolean(errors?.companyName)}
                  helperText={touched?.companyName && errors?.companyName}
                  variant="standard"
                  inputProps={{ maxLength: 256 }}
                  label="Company Name *"
                  fullWidth
                  {...getFieldProps('companyName')}
                />
              </FieldWithSkeleton>
            </Grid>

            <Grid item xs={12} md={6}>
              <FieldWithSkeleton>
                <TextField
                  id="department"
                  variant="standard"
                  error={touched?.department && Boolean(errors?.department)}
                  helperText={touched?.department && errors?.department}
                  inputProps={{ maxLength: 256 }}
                  label="Department Name *"
                  fullWidth
                  {...getFieldProps('department')}
                />
              </FieldWithSkeleton>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant="body3" component="p" color="text.secondary">
            Is the donor a Govt. institution or an organization affiliated with Govt. in UAE? *
          </Typography>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              row
              aria-label="donation-interest"
              name="isGovAffiliate"
              value={values?.isGovAffiliate}
              onChange={(e) => setFieldValue('isGovAffiliate', e.target.value)}
              sx={{ gap: 5 }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

Step1Form.propTypes = {
  setIsAdvanced: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    donor: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
export default Step1Form;
