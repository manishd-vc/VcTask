import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useFormikContext } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import AddCertificationDialog from 'src/components/_main/profile/edit/AddCertificationDialog';
import AddSupportingDocumentDialog from 'src/components/_main/profile/edit/AddSupportingDocumentDialog';
import DatePickers from 'src/components/datePicker';
import VolunteerReleaseDialog from 'src/components/dialogs/VolunteerReleaseDialog';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import FileUpload from 'src/components/fileUpload';
import { DeleteIconRed } from 'src/components/icons';
import SkillCertificationsTable from 'src/components/tables/SkillCertificationsTable';
import VolunteeringSupportDocumentsTable from 'src/components/tables/VolunteeringSupportDocumentsTable';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { defaultCountry, preferredCountries } from 'src/utils/constants';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateM } from 'src/utils/formatTime';

export default function EnrollVolunteerStep1() {
  const { values, getFieldProps, errors, touched, setFieldValue, handleBlur } = useFormikContext();
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [openVolunteerReleaseDialog, setOpenVolunteerReleaseDialog] = useState(false);
  const { volunteerEnrollmentData, volunteerEnrollmentLoading } = useSelector((state) => state?.profile);
  const { profileData } = useSelector((state) => state?.profile);

  // Use volunteerEnrollmentData if available, otherwise fallback to profileData
  const { masterData } = useSelector((state) => state?.common);
  const salutations = getLabelObject(masterData, 'dpw_foundation_user_salutation');
  const maritalStatus = getLabelObject(masterData, 'dpw_foundation_user_marital_status');
  const genders = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const preferredCommunications = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');
  const languageData = getLabelObject(masterData, 'dpwf_language');
  const userVolunteering = getLabelObject(masterData, 'dpw_foundation_user_volunteering');
  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);
  const documentIndex = useRef(0);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const dispatch = useDispatch();
  const { accountType, email, firstName, lastName, phoneNumber } = volunteerEnrollmentData || {};

  // Helper function to convert boolean to Yes/No
  const getYesNo = (value) => (value ? 'Yes' : 'No');

  // Helper function to check if field has prefilled data
  const hasPrefilledData = (fieldName) => {
    if (fieldName === 'otherLanguage' || fieldName === 'volunteeringArea') {
      return Array.isArray(volunteerEnrollmentData?.[fieldName]) && volunteerEnrollmentData[fieldName].length > 0;
    }
    return volunteerEnrollmentData && volunteerEnrollmentData[fieldName] && volunteerEnrollmentData[fieldName] !== '';
  };

  // Helper component to render field in view mode or edit mode
  const renderField = (fieldName, label, component, viewValue = null) => {
    if (hasPrefilledData(fieldName)) {
      return (
        <Stack spacing={0.5} flexDirection="column">
          <Typography variant="body3" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
            {viewValue || volunteerEnrollmentData[fieldName] || ''}
          </Typography>
        </Stack>
      );
    }
    return component;
  };

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

  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

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
      mutateDocument({
        entityId: profileData?.id || profileData?.userId,
        entityType,
        moduleType,
        payload: formData,
        index
      });
    });
  };

  const handleDocumentsDeleteFile = (id) => {
    if (id) {
      deleteMediaMutation({
        id: id,
        userId: profileData?.id || profileData?.userId
      });
    }
  };

  const remove = (indexToRemove) => {
    const updatedDocuments = values.documentDetails.filter((_, i) => i !== indexToRemove);
    setFieldValue('documentDetails', updatedDocuments);
  };

  const download = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  const getFilteredDocumentTypes = (currentIndex) => {
    const selectedTypes = values.documentDetails
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);
    return documentTypes?.values?.filter((opt) => !selectedTypes.includes(opt.code));
  };

  const areAllDocumentsFilled = () => {
    const selectedTypes = values.documentDetails.map((doc) => doc.documentType).filter(Boolean);
    const uniqueSelected = new Set(selectedTypes);
    const maxTypes = documentTypes?.values?.length || 0;
    return values.documentDetails.length >= maxTypes || uniqueSelected.size >= maxTypes;
  };

  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        volunteer information form
      </Typography>
      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" sx={{ mb: 2 }}>
        Profile details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {accountType || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Email ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {email || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              First Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {firstName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Second Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {lastName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {phoneNumber || ''}
            </Typography>
          </Stack>
        </Grid>
        {volunteerEnrollmentData?.salutation ? (
          <Grid item xs={12} sm={6}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Salutation
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_salutation', values?.salutation) || ''}
              </Typography>
            </Stack>
          </Grid>
        ) : (
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.salutation && errors.salutation}>
              <TextFieldSelect
                id="salutation"
                label={
                  <>
                    Select Salutation
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={salutations?.values}
                value={values?.salutation}
                error={touched.salutation && Boolean(errors.salutation)}
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.dob && errors.dob}>
            {volunteerEnrollmentData?.dateOfBirth ? (
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {fDateM(volunteerEnrollmentData.dateOfBirth, false)}
                  </Typography>
                </Stack>
              </Grid>
            ) : (
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.dob && errors.dob}>
                  <DatePickers
                    label={
                      <>
                        Select Date of Birth{' '}
                        <Box component="span" sx={{ color: 'error.main' }}>
                          *
                        </Box>
                      </>
                    }
                    inputFormat={'dd-MM-yyyy'}
                    onChange={(newFromDate) => {
                      setFieldValue('dob', newFromDate);
                    }}
                    maxDate={new Date()}
                    value={values?.dob}
                    handleClear={() => {
                      setFieldValue('dob', null);
                    }}
                    error={touched.dob && Boolean(errors.dob)}
                  />
                </FieldWithSkeleton>
              </Grid>
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
            {renderField(
              'maritalStatus',
              'Marital Status',
              <TextFieldSelect
                id="maritalStatus"
                label="Select Marital Status"
                getFieldProps={getFieldProps}
                itemsData={maritalStatus?.values}
                value={values?.maritalStatus}
              />,
              getLabelByCode(masterData, 'dpw_foundation_user_marital_status', values?.maritalStatus)
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.gender && errors.gender}>
            {renderField(
              'gender',
              'Gender',
              <TextFieldSelect
                id="gender"
                label={
                  <>
                    Select Gender{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={genders?.values}
                value={values?.gender}
                error={touched.gender && Boolean(errors.gender)}
              />,
              getLabelByCode(masterData, 'dpw_foundation_user_gender', values?.gender)
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton
            isLoading={volunteerEnrollmentLoading}
            error={touched.currentCountryOfResidence && errors.currentCountryOfResidence}
          >
            {renderField(
              'currentCountryOfResidence',
              'Country',
              <TextFieldSelect
                id="currentCountryOfResidence"
                label={
                  <>
                    Select Country{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={country}
                error={touched.currentCountryOfResidence && Boolean(errors.currentCountryOfResidence)}
              />,
              country?.find((c) => c.code === values?.currentCountryOfResidence)?.label
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.state && errors.state}>
            {renderField(
              'state',
              'State/Province',
              <TextFieldSelect
                id="state"
                label={
                  <>
                    Select State/Province{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={projectStateData}
                disabled={!values?.currentCountryOfResidence}
                error={touched.state && Boolean(errors.state)}
              />,
              projectStateData?.find((s) => s.code === values?.state)?.label
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.city && errors.city}>
            {renderField(
              'city',
              'City',
              <TextFieldSelect
                id="city"
                label={
                  <>
                    Select City{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={citiesData}
                disabled={!values?.state}
                error={touched.city && Boolean(errors.city)}
              />,
              citiesData?.find((c) => c.code === values?.city)?.label
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton
            isLoading={volunteerEnrollmentLoading}
            error={touched.mailingAddress && errors.mailingAddress}
          >
            {hasPrefilledData('mailingAddress') ? (
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Mailing Address
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {values?.mailingAddress || ''}
                </Typography>
              </Stack>
            ) : (
              <TextField
                id="mailingAddress"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Mailing Address{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('mailingAddress')}
                error={touched.mailingAddress && Boolean(errors.mailingAddress)}
              />
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
            {renderField(
              'preferredCommunication',
              'Preferred Communication Mode',
              <TextFieldSelect
                id="preferredCommunication"
                label="Select Preferred Communication Mode"
                getFieldProps={getFieldProps}
                itemsData={preferredCommunications?.values}
                value={values?.preferredCommunication}
              />,
              getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', values?.preferredCommunication)
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
            {renderField(
              'emergencyContactName',
              'Emergency Contact Name',
              <TextField
                id="emergencyContactName"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label="Enter Emergency Contact Name"
                fullWidth
                {...getFieldProps('emergencyContactName')}
              />
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton
            isLoading={volunteerEnrollmentLoading}
            error={touched.emergencyContactNumber && errors.emergencyContactNumber}
          >
            {renderField(
              'emergencyContactNumber',
              'Emergency Contact Number',
              <MuiTelInput
                label={
                  <>
                    Enter Emergency Contact Number{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
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
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.homeAddress && errors.homeAddress}>
            {renderField(
              'homeAddress',
              'Emergency Residential Address',
              <TextField
                id="homeAddress"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Emergency Residential Address{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('homeAddress')}
                error={touched.homeAddress && Boolean(errors.homeAddress)}
              />
            )}
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
            {renderField(
              'relationWithEmergencyContact',
              'Relation with Emergency Contact',
              <TextField
                id="relationWithEmergencyContact"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label="Enter Relation with Emergency Contact *"
                fullWidth
                {...getFieldProps('relationWithEmergencyContact')}
                onChange={(e) => {
                  const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setFieldValue('relationWithEmergencyContact', alphabeticValue);
                }}
              />
            )}
          </FieldWithSkeleton>
        </Grid>
      </Grid>
      <Grid item md={12}>
        <Stack
          gap={3}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center', md: 'center' }}
        >
          <Typography variant="subtitle6" color="primary.main" my={3} component={'p'}>
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
        {values.documentDetails?.map((doc, index) => (
          <Box
            key={doc?.id}
            sx={{ backgroundColor: (theme) => theme.palette.grey[100], padding: 2, mb: 2, position: 'relative' }}
          >
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <Tooltip title="Remove" arrow>
                <IconButton aria-label="delete" onClick={() => remove(index)}>
                  <DeleteIconRed />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FieldWithSkeleton>
                  <TextFieldSelect
                    key={`documentType-${getFilteredDocumentTypes(index)
                      ?.map((d) => d.value)
                      .join(',')}`}
                    id={`documentDetails.${index}.documentType`}
                    label="Select Identity Document Type"
                    getFieldProps={getFieldProps}
                    itemsData={getFilteredDocumentTypes(index)}
                    value={values.documentDetails[index].documentType}
                    onChange={(e) => setFieldValue(`documentDetails.${index}.documentType`, e.target.value)}
                    error={
                      touched?.documentDetails?.[index]?.documentType &&
                      Boolean(errors?.documentDetails?.[index]?.documentType)
                    }
                    helperText={
                      touched?.documentDetails?.[index]?.documentType && errors?.documentDetails?.[index]?.documentType
                    }
                  />
                </FieldWithSkeleton>
              </Grid>
              <Grid item xs={12} md={4}>
                <FieldWithSkeleton>
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
                <FieldWithSkeleton>
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
                <Stack direction="row" alignItems="center" spacing={2} sx={{ pt: 1.5 }}>
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
                        {values.documentDetails[index].fileName}
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
            </Grid>
          </Box>
        ))}
      </Grid>

      <>
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
          volunteering information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {volunteerEnrollmentData?.isDpwEmployee ? (
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Is DPW Group Employee?
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {getYesNo(values?.isDpwEmployee)}
                </Typography>
              </Stack>
            ) : (
              <FormControl component="fieldset">
                <FormLabel id="isDPWGroupEmployee-radio-buttons-group-label" sx={{ mb: 1 }}>
                  <Typography variant="body3" color="text.secondary">
                    Is DPW Group Employee?
                  </Typography>
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="isDPWGroupEmployee-radio-buttons-group-label"
                  name="isDpwEmployee"
                  value={String(Boolean(values?.isDpwEmployee))}
                  onChange={(e) => {
                    setFieldValue('isDpwEmployee', e.target.value === 'true');
                    if (e.target.value === 'false') {
                      setFieldValue('employeeId', '');
                      setFieldValue('companyName', '');
                      setFieldValue('department', '');
                    }
                  }}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            )}
            {values?.isDpwEmployee && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton
                    isLoading={volunteerEnrollmentLoading}
                    error={touched.employeeId && errors.employeeId}
                  >
                    {renderField(
                      'employeeId',
                      'Employee ID',
                      <TextField
                        id="employeeId"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Enter Employee ID
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('employeeId')}
                        error={touched.employeeId && Boolean(errors.employeeId)}
                      />
                    )}
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton
                    isLoading={volunteerEnrollmentLoading}
                    error={touched.companyName && errors.companyName}
                  >
                    {renderField(
                      'companyName',
                      'Company Name',
                      <TextField
                        id="companyName"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Enter Company
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('companyName')}
                        error={touched.companyName && Boolean(errors.companyName)}
                      />
                    )}
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldWithSkeleton
                    isLoading={volunteerEnrollmentLoading}
                    error={touched.department && errors.department}
                  >
                    {renderField(
                      'department',
                      'Department',
                      <TextField
                        id="department"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Enter Department
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('department')}
                        error={touched.department && Boolean(errors.department)}
                      />
                    )}
                  </FieldWithSkeleton>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {volunteerEnrollmentData?.dlAvailability ? (
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Have Driver License?
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {getYesNo(values?.dlAvailability)}
                </Typography>
              </Stack>
            ) : (
              <FormControl component="fieldset">
                <FormLabel id="dlAvailability-radio-buttons-group-label" sx={{ mb: 1 }}>
                  <Typography variant="body3" color="text.secondary">
                    Have Driver License?
                  </Typography>
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="dlAvailability-radio-buttons-group-label"
                  name="dlAvailability"
                  value={String(Boolean(values?.dlAvailability))}
                  onChange={(e) => {
                    setFieldValue('dlAvailability', e.target.value === 'true');
                  }}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {volunteerEnrollmentData?.carAvailability ? (
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Has Own Car?
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {getYesNo(values?.carAvailability)}
                </Typography>
              </Stack>
            ) : (
              <FormControl component="fieldset">
                <FormLabel id="carAvailability-radio-buttons-group-label" sx={{ mb: 1 }}>
                  <Typography variant="body3" color="text.secondary">
                    Has Own Car?
                  </Typography>
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="carAvailability-radio-buttons-group-label"
                  name="carAvailability"
                  value={String(Boolean(values?.carAvailability))}
                  onChange={(e) => {
                    setFieldValue('carAvailability', e.target.value === 'true');
                  }}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton
              isLoading={volunteerEnrollmentLoading}
              error={touched.homePhoneNumber && errors.homePhoneNumber}
            >
              {renderField(
                'homePhoneNumber',
                'Home Phone',
                <MuiTelInput
                  label={
                    <>
                      Enter Home Phone{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  id="homePhoneNumber"
                  preferredCountries={preferredCountries}
                  defaultCountry={defaultCountry}
                  fullWidth
                  value={values.homePhoneNumber}
                  variant="standard"
                  onChange={(value) => {
                    const cleanedValue = value ? value.replace(/\s/g, '') : '';
                    setFieldValue('homePhoneNumber', cleanedValue);
                  }}
                  onBlur={handleBlur('homePhoneNumber')}
                  error={touched.homePhoneNumber && Boolean(errors.homePhoneNumber)}
                  sx={{
                    '& .MuiInputAdornment-root .MuiButtonBase-root': {
                      right: 6
                    }
                  }}
                />
              )}
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              {renderField(
                'nativeLanguage',
                'Native Language',
                <Autocomplete
                  limitTags={2}
                  options={languageData?.values || []}
                  value={languageData?.values?.find((lang) => lang.code === values?.nativeLanguage) || null}
                  onChange={(event, newValue) => {
                    setFieldValue('nativeLanguage', newValue?.code || '');
                  }}
                  onBlur={handleBlur('nativeLanguage')}
                  getOptionLabel={(option) => (option && option?.label) || ''}
                  isOptionEqualToValue={(option, value) => option?.code === value?.code}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <>
                          Select Native Language{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      variant="standard"
                      error={touched.nativeLanguage && Boolean(errors.nativeLanguage)}
                      helperText={touched.nativeLanguage && errors.nativeLanguage}
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
                />,
                languageData?.values?.find((lang) => lang.code === values?.nativeLanguage)?.label || '-'
              )}
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              {volunteerEnrollmentData?.otherLanguage?.length > 0 ? (
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Other Language Proficiency
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {volunteerEnrollmentData.otherLanguage
                      .map((lang) => getLabelByCode(masterData, 'dpwf_language', lang.code))
                      .filter(Boolean)
                      .join(', ')}
                  </Typography>
                </Stack>
              ) : (
                <Autocomplete
                  multiple
                  limitTags={2}
                  options={languageData?.values || []}
                  value={
                    languageData?.values?.filter(
                      (lang) => Array.isArray(values?.otherLanguage) && values.otherLanguage.includes(lang.code)
                    ) || []
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
                        variant="dropdown"
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
              )}
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              {volunteerEnrollmentData?.volunteeringArea?.length > 0 ? (
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Volunteering Areas of Interest
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {volunteerEnrollmentData.volunteeringArea
                      .map((area) => getLabelByCode(masterData, 'dpw_foundation_user_volunteering', area.code))
                      .filter(Boolean)
                      .join(', ')}
                  </Typography>
                </Stack>
              ) : (
                <Autocomplete
                  multiple
                  limitTags={2}
                  options={userVolunteering?.values}
                  value={
                    userVolunteering?.values?.filter(
                      (user) => Array.isArray(values?.volunteeringArea) && values.volunteeringArea.includes(user.code)
                    ) || []
                  }
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
                        variant="dropdown"
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
              )}
            </FieldWithSkeleton>
          </Grid>
          {volunteerEnrollmentData?.volunteeringArea?.map((item) => item.code === 'other').includes(true) && (
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
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
          <Grid item xs={12}>
            <SkillCertificationsTable
              data={values.skillCertifications}
              isEditable={!values.skillCertifications || values.skillCertifications.length === 0}
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
              userData={profileData}
            />
            {openCertificationDialog && (
              <AddCertificationDialog
                open={openCertificationDialog}
                onClose={() => setOpenCertificationDialog(false)}
                userData={profileData}
                onSave={(certData) => {
                  setFieldValue('skillCertifications', [...(values.skillCertifications || []), certData]);
                }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <VolunteeringSupportDocumentsTable
              data={values.volunteeringSupportDocuments}
              isEditable={!values.volunteeringSupportDocuments || values.volunteeringSupportDocuments.length === 0}
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
              userData={profileData}
            />
            {openDocumentDialog && (
              <AddSupportingDocumentDialog
                open={openDocumentDialog}
                onClose={() => setOpenDocumentDialog(false)}
                userData={profileData}
                onSave={(docData) => {
                  setFieldValue('volunteeringSupportDocuments', [
                    ...(values.volunteeringSupportDocuments || []),
                    docData
                  ]);
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.volunteerReleaseAccepted}
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
        </Grid>
      </>
    </>
  );
}
