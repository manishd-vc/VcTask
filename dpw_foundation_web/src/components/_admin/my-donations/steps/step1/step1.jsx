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
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import TextFieldSelect from 'src/components/TextFieldSelect';
import CommonStyle from 'src/components/common.styles';
import DatePickers from 'src/components/datePicker';
import FileUpload from 'src/components/fileUpload';
import { DeleteIconRed } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import ProfileDetails from './profileDetails';

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

const Step1 = ({ isLoading, data, donorType = 'Individual', setIsDpwEmployee, profileImg, setProfileImg }) => {
  const dispatch = useDispatch();
  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const { profileData } = useSelector((state) => state.profile);

  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);

  const documentIndex = useRef(0);
  const theme = useTheme();
  const style = CommonStyle(theme);

  const { mutate: deleteMediaMutation } = useMutation('deleteMedia', api.deleteCampaignMedia, {
    onSuccess: (response, fileId) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const filterOrgAttachArray = [...values.orgAttachments].filter((item) => item.id !== fileId);
      values.orgAttachments = filterOrgAttachArray;
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: deleteProfileMutation } = useMutation('deleteMedia', api.deleteDocumentMedia, {
    onSuccess: (response, payload) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const filterDocAttachArray = [...values.documentDetails].map((item) => {
        return item.documentImageId === payload.id ? { ...item, documentImageId: '', fileName: '' } : item;
      });
      values.documentDetails = filterDocAttachArray;
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const { mutate } = useMutation('uploadCampaignFiles', api.uploadCampaignFiles, {
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

  const { mutate: mutateDocument } = useMutation('uploadFiles', api.uploadCampaignFiles, {
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

  const handleDeleteFile = (file) => {
    if (file?.id) {
      deleteMediaMutation(file?.id);
    }
  };

  const handleDocumentsDeleteFile = (index, id) => {
    if (id) {
      deleteProfileMutation({
        id: id,
        userId: profileData?.id
      });
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
      mutate({ entityId: profileData?.id, entityType, moduleType, payload: formData });
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
      mutateDocument({ entityId: profileData?.id, entityType, moduleType, payload: formData });
    });
  };

  const remove = (indexToRemove) => {
    const updatedDocuments = values.documentDetails.filter((_, i) => i !== indexToRemove);
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

  const download = (fileId) => {
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  useEffect(() => {
    if (profileData?.photoFileUrl) {
      setProfileImg(profileData?.photoFileUrl);
    }
  }, [profileData?.photoFileUrl]);

  const getFilteredDocumentTypes = (currentIndex) => {
    // Get all selected document types except the one for the current index
    const selectedTypes = values?.documentDetails
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);

    // Filter document types to exclude already selected types
    return documentTypes?.values?.filter((opt) => !selectedTypes.includes(opt.code));
  };
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Donor Information Form
      </Typography>
      <Grid container spacing={3}>
        <ProfileDetails
          isLoading={isLoading}
          data={data}
          donorType={donorType}
          profileImg={profileImg}
          setProfileImg={setProfileImg}
        />

        <Grid item md={12}>
          {/* {donorType === 'Individual' && ( */}
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
              sx={{ my: 1 }}
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

          {values.documentDetails?.map((doc, index) => (
            <Box key={doc?.id} sx={style.documentCard}>
              <Box sx={style.docDeleteIcon}>
                <Tooltip title="Remove" arrow>
                  <IconButton aria-label="delete" onClick={() => remove(index)}>
                    <DeleteIconRed />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FieldWithSkeleton isLoading={isLoading}>
                    <TextFieldSelect
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
                    <Stack flexDirection="row" flexWrap="wrap" alignItems="Center" gap={1.2}>
                      <Box key={`steps_${values?.documentDetails?.[index]?.documentImageId}`}>
                        <Typography component="div" variant="body2" color="text.secondarydark">
                          <Box
                            component="span"
                            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => download(values?.documentDetails?.[index]?.documentImageId)}
                          >
                            {values.documentDetails[index].fileName}
                          </Box>
                          {values?.documentDetails?.[index]?.documentImageId && (
                            <Tooltip title="Remove" arrow>
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  handleDocumentsDeleteFile(index, values?.documentDetails?.[index]?.documentImageId)
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
              </Grid>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle4" color="primary.main" textTransform={'uppercase'} sx={{ pb: 3 }}>
            Additional Details
          </Typography>
        </Grid>
        {donorType !== 'Individual' && (
          <Grid item xs={12}>
            <Typography variant="body3" color="text.secondary" component="p" sx={{ mb: 1 }}>
              Organization Related Documents Attachments *
            </Typography>
            <FileUpload
              buttonText="Attach Documents"
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
            <Stack flexDirection="row" flexWrap="wrap" alignItems="Center" sx={{ pt: 2 }} gap={1.2}>
              {values.orgAttachments &&
                Array.from(values.orgAttachments)?.map((file) => (
                  <Box key={`steps_${file?.id}`}>
                    <Typography component="div" variant="body2" color="text.secondarydark">
                      <Box
                        component="span"
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => download(file?.id)}
                      >
                        {file?.fileName}
                      </Box>
                      {file?.id && (
                        <Tooltip title="Remove" arrow>
                          <IconButton aria-label="delete" onClick={() => handleDeleteFile(file)}>
                            <DeleteIconRed />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Typography>
                  </Box>
                ))}
            </Stack>
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
              value={values.acknowledgementPreference}
              onChange={(e) => setFieldValue('acknowledgementPreference', e.target.value)}
            >
              <FormControlLabel value="Email" control={<Radio />} label="Email" sx={{ mr: 3 }} />
              <FormControlLabel value="Postal" control={<Radio />} label="Postal" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body3" component="p" color="text.secondary">
            Subscribe to newsletter?
          </Typography>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              row
              aria-label="donation-interest"
              name="communicationSubscription"
              value={values.communicationSubscription}
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
              value={values.isDpwEmployee}
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
        {(values.isDpwEmployee === 'true' || values.isDpwEmployee === true) && (
          <Grid item container spacing={3} md={12}>
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton>
                <TextField
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
              value={values.isGovAffiliate}
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

Step1.propTypes = {
  setIsAdvanced: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    donor: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
export default Step1;
