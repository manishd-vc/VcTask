'use client';
import { Box, Button, Grid, IconButton, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import React, { useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import DatePickers from 'src/components/datePicker';
import FileUpload from 'src/components/fileUpload';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { defaultCountry, preferredCountries } from 'src/utils/util';
import ProfileStyle from '../profile.style';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
export default function Organization({ userLoading, userData }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const style = {
    ...ProfileStyle(theme),
    ...CommonStyle(theme)
  };
  const { masterData } = useSelector((state) => state?.common);
  const { values, getFieldProps, setFieldValue, touched, errors } = useFormikContext();
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);
  const preferredCommunications = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');
  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const documentIndex = useRef(0);
  const { data: projectStateData } = useQuery(
    ['getStates', values?.currentCountryOfResidence],
    () => api.getStates(values?.currentCountryOfResidence),
    {
      enabled: !!values?.currentCountryOfResidence, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

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
      mutateDocument({ entityId: userData?.id, entityType, moduleType, payload: formData, index });
    });
  };

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

  // Fetching city data based on selected state
  const { data: citiesData } = useQuery(
    ['getCities', values?.state],
    () => api.getCities(values?.currentCountryOfResidence, values?.state),
    {
      enabled: !!values?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );
  const remove = (indexToRemove) => {
    const updatedDocuments = values?.documentDetails.filter((_, i) => i !== indexToRemove);
    setFieldValue('documentDetails', updatedDocuments);
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
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
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
  const getFilteredDocumentTypes = (currentIndex) => {
    // Get all selected document types except the one for the current index
    const selectedTypes = values?.documentDetails
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
  return (
    <>
      <Grid item xs={12} md={6}>
        <Stack direction="column" gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Registered As
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {values?.accountType || '-'}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack direction="column" gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Organization Contact Person Email ID
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {values?.email || '-'}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <FieldWithSkeleton isLoading={userLoading} error={touched.firstName && errors.firstName}>
          <TextField
            id="firstName"
            variant="standard"
            label="Enter Organization Contact Person First Name"
            inputProps={{ maxLength: 256 }}
            required
            fullWidth
            {...getFieldProps('firstName')}
            error={Boolean(touched.firstName && errors.firstName)}
          />
        </FieldWithSkeleton>
      </Grid>
      <Grid item xs={12} md={6}>
        <FieldWithSkeleton isLoading={userLoading} error={touched.lastName && errors.lastName}>
          <TextField
            id="last-name"
            variant="standard"
            label="Enter Organization Contact Person Second Name"
            inputProps={{ maxLength: 256 }}
            required
            fullWidth
            {...getFieldProps('lastName')}
            error={Boolean(touched.lastName && errors.lastName)}
          />
        </FieldWithSkeleton>
      </Grid>
      <Grid item xs={12} md={6}>
        <FieldWithSkeleton isLoading={userLoading} error={touched.mobile && errors.mobile}>
          <MuiTelInput
            label="Enter Organization Contact Person Phone Number"
            id="mobile"
            preferredCountries={preferredCountries}
            defaultCountry={defaultCountry}
            fullWidth
            value={values.mobile}
            variant="standard"
            onChange={(value) => {
              setFieldValue('mobile', value); // Update mobile number in Formik's state
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
      <Grid item xs={12} md={6}>
        <FieldWithSkeleton isLoading={userLoading}>
          <TextFieldSelect
            id="currentCountryOfResidence"
            label="Select Organization Country Where Registered"
            getFieldProps={getFieldProps}
            itemsData={country}
          />
        </FieldWithSkeleton>
      </Grid>
      <Grid item xs={12} md={6}>
        <FieldWithSkeleton isLoading={userLoading}>
          <TextFieldSelect
            id="state"
            label="Select Organization State Where Registered"
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
            label="Select Organization City Where Registered"
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
          <Box key={doc?.id} sx={style.documentCard}>
            <Box sx={style.deleteIcon}>
              <Tooltip title="Remove" arrow>
                <IconButton onClick={() => remove(index)}>
                  <DeleteIconRed />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FieldWithSkeleton isLoading={userLoading}>
                  <TextFieldSelect
                    key={`documentType-${getFilteredDocumentTypes(index)
                      ?.map((d) => d.value)
                      .join(',')}`}
                    id={`documentDetails.${index}.documentType`}
                    label="Select Identity Document Type"
                    getFieldProps={getFieldProps}
                    itemsData={getFilteredDocumentTypes(index)}
                    value={values?.documentDetails[index].documentType}
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
                <FieldWithSkeleton isLoading={userLoading}>
                  <TextField
                    id={`documentDetails.${index}.documentNumber`}
                    variant="standard"
                    inputProps={{ maxLength: 256 }}
                    label="Enter Document Number"
                    fullWidth
                    value={values?.documentDetails[index].documentNumber}
                    onChange={(e) => setFieldValue(`documentDetails.${index}.documentNumber`, e.target.value)}
                    error={
                      touched?.documentDetails?.[index]?.documentNumber &&
                      Boolean(errors?.documentDetails?.[index]?.documentNumber)
                    }
                    helperText={
                      touched?.documentDetails?.[index]?.documentNumber &&
                      errors?.documentDetails?.[index]?.documentNumber
                    }
                  />
                </FieldWithSkeleton>
              </Grid>
              <Grid item xs={12} md={4}>
                <FieldWithSkeleton isLoading={userLoading}>
                  <DatePickers
                    label={'Select Document Validity'}
                    inputFormat={'yyyy-MM-dd'}
                    minDate={new Date()}
                    onChange={(newDate) => setFieldValue(`documentDetails.${index}.documentValidity`, newDate)}
                    value={values?.documentDetails[index].documentValidity}
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
                <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1.2} sx={{ pt: 1.5 }}>
                  <FileUpload
                    buttonText="Upload Document"
                    name="documentImageId"
                    size="small"
                    disabled={values?.documentDetails?.[index]?.documentImageId}
                    onChange={(event) => {
                      handleDocumentFileUpload(
                        Array.from(event.target.files),
                        index,
                        'documentDetails', // fieldName for validation limit logic
                        'DONOR', // entityType expected by backend
                        'DONOR_IDENTITY_PROOF_ATTACHEMENT' // moduleType
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
              </Grid>
            </Grid>
          </Box>
        ))}
      </Grid>
    </>
  );
}
