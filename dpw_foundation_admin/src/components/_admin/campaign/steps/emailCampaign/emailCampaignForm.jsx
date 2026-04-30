'use client';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { useMutation } from 'react-query';
import DatePickers from 'src/components/datePicker';
import FileUpload from 'src/components/fileUpload';
import { DeleteIconRed } from 'src/components/icons';
// api
import { useParams } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDefaultFileValidation, handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import MediaPreview from './mediaPreview';
import MediaPreviewStyle from './mediaPreview.styles';

EmailCampaignForm.propTypes = {
  // 'isLoading' is a boolean indicating whether the form is in a loading state
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating if the form is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'handleClickOpen' is a function that handles opening a dialog or modal
  handleClickOpen: PropTypes.func.isRequired,

  // 'handleOpenPreview' is a function that handles opening the preview of the email
  handleOpenPreview: PropTypes.func.isRequired
};

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
/**
 * EmailCampaignForm component is used for handling the creation and editing of email campaign templates.
 * It manages the form state, handles file uploads (attachments, banner images), deletes files, and manages
 * email recipients, including email validation.
 *
 * The component includes the following functionalities:
 * 1. **File Upload**: Handles file uploads for attachments and banner images. It validates the file size and count before uploading.
 * 2. **File Deletion**: Allows the deletion of uploaded files (attachments and banner images).
 * 3. **Email Validation**: Validates email addresses entered in the recipients list and ensures only unique recipients are saved.
 * 4. **Toast Notifications**: Displays success and error messages based on the result of API calls.
 *
 * @param {boolean} isLoading - Indicates whether the form is in a loading state (e.g., during API calls).
 * @param {boolean} isEdit - Indicates whether the form is in edit mode.
 * @param {function} handleClickOpen - Function to handle opening the modal (e.g., for email preview).
 * @param {function} handleOpenPreview - Function to handle opening the preview modal.
 *
 * @returns {JSX.Element} The rendered EmailCampaignForm component with form fields, file upload options, and email validation.
 */
export default function EmailCampaignForm({ isLoading, isEdit, handleClickOpen, handleOpenPreview }) {
  const params = useParams(); // Get campaign ID from URL params
  const theme = useTheme(); // Access MUI theme for styling
  const styles = MediaPreviewStyle(theme); // Custom styles for media preview
  const dispatch = useDispatch(); // Redux dispatch function for state management
  const [isError, setIsError] = useState(''); // State to hold error message related to email validation

  // Accessing formik context for form state management
  const { values, getFieldProps, setFieldValue, touched, errors } = useFormikContext();
  // Accessing campaign data and master data from Redux store
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const { masterData } = useSelector((state) => state?.common);

  // Setting file validation configurations
  const { maxPhotoSizeKB, uploadCount } = getDefaultFileValidation(masterData);

  // Handling file upload mutations
  const { mutate } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: async (response, variables) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      if (variables?.moduleType === 'CAMPAIGN_EMAIL_ATTACHEMENT') {
        const emailData = await api.emailPreDraft({ entityType: 'CAMPAIGN', entityId: params?.id });
        const newFiles = [...(emailData?.attachments || [])];
        setFieldValue('attachments', newFiles);
      } else {
        setFieldValue('bannerImage', response?.data);
      }
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
    }
  });

  // Handling media download

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

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  // Handling media deletion
  const { mutate: deleteMediaMutation } = useMutation('deleteMedia', api.deleteMedia, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      handleClickOpen();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  // Handle file upload validation and processing
  const handleFileUpload = (files, currentFileCount, moduleType) => {
    handleFileUploadValidation(files, {
      currentFileCount,
      mutate,
      setToastMessage,
      dispatch,
      maxPhotoSizeKB,
      uploadCount,
      entityId: values?.emailId,
      entityType: 'CAMPAIGN_EMAIL',
      moduleType,
      parentEntityId: campaignUpdateData?.id
    });
  };

  // Handle file deletion
  const handleDeleteFile = (file, value, fieldName) => {
    if (file?.id) {
      deleteMediaMutation(file?.id); // Delete file from server
    }
    const updatedAttachments = value?.filter((item) => item !== file);
    setFieldValue(fieldName, updatedAttachments); // Update form state
  };

  // Handle photo album deletion
  const deletePhotoAlbum = (file) => {
    if (file) {
      deleteMediaMutation(file);
    }
    setFieldValue('bannerImage', null); // Clear banner image field
  };

  // Handle email recipient list updates and validation
  const handleOnChange = (event, newValue) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let hasInvalidEmails = false;

    const updatedRecipients = newValue.map((item) => {
      if (typeof item === 'string') {
        const isEmail = emailRegex.test(item);
        if (!isEmail) {
          hasInvalidEmails = true; // Mark as invalid
          setIsError(`Please enter a valid email address.`);
        }
        return {
          emailId: isEmail ? item : null,
          emailGroupId: isEmail ? null : item
        };
      }
      return item; // Already an object
    });
    // If invalid email addresses are detected, prevent updating form state
    if (hasInvalidEmails) {
      return;
    }

    const uniqueRecipients = updatedRecipients.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.emailId === item.emailId && t.emailGroupId === item.emailGroupId)
    );

    setFieldValue('emailRecipients', uniqueRecipients); // Update recipients field
    setIsError('');
  };

  // Other form handling logic...
  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12} md={12}>
        <FieldWithSkeleton isLoading={isLoading} error={touched.subject && errors.subject}>
          <TextField
            variant="standard"
            fullWidth
            label={
              <>
                Enter Subject{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            {...getFieldProps('subject')}
            disabled={!isEdit}
            error={touched.subject && Boolean(errors.subject)}
          />
        </FieldWithSkeleton>
      </Grid>
      <Grid item xs={12} md={7}>
        <Autocomplete
          multiple
          sx={{ '.MuiAutocomplete-inputRoot .MuiInputBase-input': { marginRight: 2 } }}
          freeSolo
          disabled={!isEdit}
          options={[]} // No predefined options
          value={values.emailRecipients}
          onChange={handleOnChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="dropdownwhite"
                size="small"
                label={option.emailId || option.emailGroupId}
                {...getTagProps({ index })}
                key={option.id || index}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              disabled={!isEdit}
              variant="standard"
              label={
                <>
                  Select Email Groups / Enter Email Ids{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              placeholder="Type and hit enter"
              error={!!isError}
              helperText={isError}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <FieldWithSkeleton isLoading={isLoading} error={touched.body && errors.body}>
          <TextField
            variant="standard"
            multiline
            fullWidth
            disabled={!isEdit}
            minRows={1}
            maxRows={3}
            label={
              <>
                Enter Email Details{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            {...getFieldProps('body')}
            error={touched.body && Boolean(errors.body)}
          />
        </FieldWithSkeleton>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack alignItems="center" flexDirection="row" gap={2} flexWrap="wrap">
          <Box>
            <FileUpload
              size="small"
              name={'bannerImage'}
              buttonText={'Upload Banner Image'}
              disabled={!isEdit}
              typeOfAllowed="photoAlbumAllowed"
              onChange={(event) => handleFileUpload([event.currentTarget.files[0]], null, 'CAMPAIGN_EMAIL_BANNER')}
            />
          </Box>
          <Box sx={styles.bannerImgThumbnail}>
            {values.bannerImage?.id && (
              <MediaPreview
                src={values?.bannerImage?.preSignedUrl}
                name={'preview'}
                onRemove={() => deletePhotoAlbum(values?.bannerImage?.id)}
                width={177}
                height={80}
                layout="intrinsic"
                isOverlay={true}
                style={{ objectFit: 'contain' }}
              />
            )}
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack alignItems="center" flexDirection="row" gap={2} flexWrap="wrap" sx={{ pt: 2 }}>
          <FileUpload
            size="small"
            disabled={!isEdit}
            name={'attachments'}
            buttonText={'Attach Files'}
            typeOfAllowed="frontendFileType"
            onChange={(event) =>
              handleFileUpload(
                Array.from(event.currentTarget.files),
                values.attachments.length,
                'CAMPAIGN_EMAIL_ATTACHEMENT'
              )
            }
            multiple
          />
          <Box>
            <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={0.5}>
              {values.attachments &&
                Array.from(values.attachments)?.map((file) => (
                  <Box key={`download_filename_${file?.id}`}>
                    <Typography component="span" variant="body2" color="text.secondarydark">
                      <Box
                        component="span"
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={(event) => downloadMediaFile(event, file?.id)}
                      >
                        {file?.fileName}
                      </Box>
                      <Tooltip title="Remove" arrow>
                        <IconButton onClick={() => handleDeleteFile(file, values.attachments, 'attachments')}>
                          <DeleteIconRed />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Box>
        </Stack>
        <Stack alignItems="center" flexDirection="row" gap={2} flexWrap="wrap" sx={{ pb: 2, pt: 1 }}>
          <Typography variant="body2" component="p" color="text.secondarydark">
            {values.attachments?.length
              ? `These ${values.attachments.length} files are attached with email`
              : `No files are attached with email`}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {/* <Grid item xs={12}>
        <FieldWithSkeleton isLoading={isLoading} error={touched.emailLinkOne && errors.emailLinkOne}>
          <TextField
            variant="standard"
            fullWidth
            disabled={!isEdit}
            label={
              <>
                Donation Link{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            {...getFieldProps('emailLinkOne')}
            error={touched.emailLinkOne && Boolean(errors.emailLinkOne)}
          />
        </FieldWithSkeleton>
      </Grid> */}
      <Grid item xs={12}>
        <Stack
          gap={3}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ pb: 2, pt: 2 }}
        >
          <Typography variant="subtitle1" color="text.black" textTransform="uppercase">
            When to send
          </Typography>
          <Button variant="contained" size="small" onClick={handleOpenPreview}>
            Preview Emailer
          </Button>
        </Stack>
        <FieldWithSkeleton isLoading={isLoading} error={touched.sendAutomatically && errors.sendAutomatically}>
          <Grid container spacing={2} sx={{ pb: 2 }}>
            <Grid item xs={12} md={12}>
              <RadioGroup
                name="sendAutomatically"
                value={values?.sendAutomatically}
                onChange={(event) => {
                  const value = event.target.value;

                  if (value === 'true') {
                    setFieldValue('sendAutomatically', true);
                  } else {
                    setFieldValue('sendAutomatically', false);
                    setFieldValue('sendOn', null);
                  }
                }}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio disabled={!isEdit} />}
                  label="Send Automatically"
                  sx={{ color: 'text.secondarydark' }}
                  mb={2}
                />
                {values?.sendAutomatically && (
                  <Grid container sx={{ pb: 2.5, pt: 2 }}>
                    <Grid item xs={12} md={4}>
                      <FieldWithSkeleton isLoading={isLoading} error={touched.sendOn && errors.sendOn}>
                        <DatePickers
                          label="Select Date to send emaill"
                          inputFormat={'yyyy-MM-dd HH:mm'}
                          TextFieldProps={{
                            InputProps: {
                              readOnly: true
                            }
                          }}
                          onChange={(value) => {
                            if (value) {
                              // Ensure the value is a valid date before formatting
                              try {
                                const formattedValue = format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss");
                                setFieldValue('sendOn', formattedValue);
                              } catch (error) {
                                console.error('Invalid date value:', error);
                                setFieldValue('sendOn', null);
                              }
                            } else {
                              setFieldValue('sendOn', null);
                            }
                          }}
                          handleClear={() => setFieldValue('sendOn', null)}
                          value={values?.sendOn || null}
                          type="time"
                          disabled={!isEdit}
                          error={touched.sendOn && errors.sendOn}
                          helperText={touched.sendOn && errors.sendOn}
                          minDate={new Date()}
                          maxDate={values.endDateTime}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                  </Grid>
                )}
                <FormControlLabel
                  value="false"
                  control={<Radio disabled={!isEdit} />}
                  label="Send once campaign is approved"
                  sx={{ color: 'text.secondarydark' }}
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </FieldWithSkeleton>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
}
