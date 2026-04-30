import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { Form, Formik } from 'formik';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import ModalStyle from 'src/components/dialog/dialog.style';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import FileUpload from 'src/components/fileUpload';
import { CloseIcon, DeleteIconRed } from 'src/components/icons';
import { getDefaultFileValidation, handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import * as Yup from 'yup';
import MediaPreview from '../../campaign/steps/emailCampaign/mediaPreview';
import PreviewEmail from '../../campaign/steps/emailCampaign/previewEmail';
export default function CreateEmailerModal({ open, onClose, setOpen, refetchEmailer, emailerData, emailPreDraft }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [isError, setIsError] = useState('');
  const { id } = useParams();
  const dispatch = useDispatch();
  const [attachments, setAttachments] = useState([]);
  const { masterData } = useSelector((state) => state?.common);
  const { maxPhotoSizeKB, uploadCount } = getDefaultFileValidation(masterData);
  const [openPreview, setOpenPreview] = useState(false);
  const initialValues = {
    subject: emailerData?.subject || '',
    emailRecipients: emailerData?.emailRecipients || [],
    body: emailerData?.body || '',
    bannerFileId: emailerData?.bannerFile || null,
    sendAutomatically: emailerData?.sendAutomatically || false,
    sendOn: emailerData?.sendOn || null
  };

  useEffect(() => {
    if (emailerData) {
      setAttachments(emailerData?.attachments || []);
    }
  }, [emailerData]);

  const validationSchema = Yup.object().shape({
    subject: Yup.string()
      .required('Email subject is required')
      .max(255, 'Email subject must not exceed 255 characters')
      .matches(/^[a-zA-Z0-9\s]*$/, 'Email subject must contain only alphanumeric characters and spaces'),
    body: Yup.string()
      .required('Email body is required')
      .max(1024, 'Email details must not exceed 1024 characters')
      .matches(/^[a-zA-Z0-9\s]*$/, 'Email details must contain only alphanumeric characters and spaces'),
    emailRecipients: Yup.array()
      .min(1, 'At least one email recipient is required')
      .of(
        Yup.object().shape({
          emailId: Yup.string().nullable(),
          emailGroupId: Yup.string().nullable()
        })
      )
      .test('has-valid-recipient', 'At least one valid email recipient is required', function (value) {
        if (!value || value.length === 0) return false;
        return value.some(
          (item) => (item.emailId && item.emailId.trim()) || (item.emailGroupId && item.emailGroupId.trim())
        );
      }),
    bannerFileId: Yup.mixed().required('Banner image is required'),
    sendOn: Yup.string().when('sendAutomatically', {
      is: true,
      then: (schema) => schema.required('Send on is required when sending automatically'),
      otherwise: (schema) => schema.nullable()
    })
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

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  const { mutate: createEmailerVolunteers, isLoading: isLoadingCreateEmailer } = useMutation(
    'createEmailerVolunteers',
    volunteerApi.createEmailerVolunteers,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        onClose();
        refetchEmailer();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const handleSubmit = (values) => {
    const payload = {
      id: emailPreDraft?.id,
      subject: values?.subject,
      body: values?.body,
      emailRecipients: values?.emailRecipients,
      sendAutomatically: values?.sendAutomatically,
      sendOn: values?.sendOn,
      bannerFileId: {
        id: values?.bannerFileId?.id
      },
      entityType: 'VOLUNTEER_CAMPAIGN',
      entityId: id
    };
    createEmailerVolunteers({ entityId: id, payload });
  };

  const handleOnChange = (event, newValue, setFieldValue) => {
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

  const { mutate, isLoading: isLoadingBanner } = useMutation(
    'addEmailerVolunteersBanner',
    volunteerApi.addEmailerVolunteersBanner,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );
  const { mutate: deleteBanner } = useMutation(
    'deleteEmailerVolunteersBanner',
    volunteerApi.deleteEmailerVolunteersBanner,
    {}
  );

  const deleteBannerFile = (id, setFieldValue) => {
    if (id) {
      deleteBanner(id, {
        onSuccess: (response) => {
          dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
          setFieldValue('bannerFileId', null); // Clear banner image field
        },
        onError: (error) => {
          dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
        }
      });
    } else {
      setFieldValue('bannerFileId', null); // Clear banner image field for local files
    }
  };

  const { mutate: addEmailerVolunteersAttachments } = useMutation(
    'addEmailerVolunteersAttachments',
    volunteerApi.addEmailerVolunteersAttachments,
    {
      onSuccess: (response) => {
        setAttachments((prev) => [...prev, response?.data]);
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const { mutate: deleteEmailerVolunteersAttachments } = useMutation(
    'deleteEmailerVolunteersAttachments',
    volunteerApi.deleteEmailerVolunteersAttachments,
    {
      onSuccess: (response, variables) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        setAttachments((prev) => prev.filter((file) => file.id !== variables?.fileId));
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const handleFileUpload = (files, currentFileCount) => {
    handleFileUploadValidation(files, {
      currentFileCount,
      mutate: addEmailerVolunteersAttachments,
      setToastMessage,
      dispatch,
      maxPhotoSizeKB,
      uploadCount,
      entityId: id
    });
  };

  const handleDeleteFile = (fileID) => {
    if (fileID) {
      deleteEmailerVolunteersAttachments({ entityId: id, fileId: fileID });
    }
  };

  const handlePreviewEmail = () => {
    setOpenPreview(true);
  };
  const handleBackOpen = () => {
    setOpenPreview(false);
    setOpen(true);
  };
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
          Create Emailer for Volunteers
        </DialogTitle>
        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, setFieldValue, dirty, touched, errors, getFieldProps }) => (
            <Form id="createEmailerForms">
              <DialogContent>
                <Grid container rowSpacing={3}>
                  <Grid item xs={12}>
                    <FieldWithSkeleton isLoading={isLoadingCreateEmailer} error={touched.subject && errors.subject}>
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
                        error={touched.subject && Boolean(errors.subject)}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <FieldWithSkeleton
                      isLoading={isLoadingCreateEmailer}
                      error={touched.emailRecipients && errors.emailRecipients}
                    >
                      <Autocomplete
                        multiple
                        sx={{ '.MuiAutocomplete-inputRoot .MuiInputBase-input': { marginRight: 2 } }}
                        freeSolo
                        options={[]} // No predefined options
                        value={values.emailRecipients}
                        onChange={(event, newValue) => handleOnChange(event, newValue, setFieldValue)}
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
                            error={(touched.emailRecipients && Boolean(errors.emailRecipients)) || !!isError}
                          />
                        )}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FieldWithSkeleton isLoading={isLoadingCreateEmailer} error={touched.body && errors.body}>
                      <TextField
                        variant="standard"
                        multiline
                        fullWidth
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
                    <FieldWithSkeleton
                      isLoading={isLoadingCreateEmailer}
                      error={touched.bannerFileId && errors.bannerFileId}
                    >
                      <Stack alignItems="center" flexDirection="row" gap={2} flexWrap="wrap">
                        <Box>
                          <FileUpload
                            name={'file'}
                            buttonText={'Upload Banner Image '}
                            onChange={(event) => {
                              const file = event.target.files[0];
                              const formData = new FormData();
                              if (file instanceof File) {
                                formData.append('file', file);
                              }
                              mutate(
                                { payload: formData, entityId: id },
                                {
                                  onSuccess: (response) => {
                                    setFieldValue('bannerFileId', response?.data);
                                  }
                                }
                              );
                            }}
                            disabled={isLoadingBanner}
                            size="small"
                            typeOfAllowed="photoAlbumAllowed"
                            error={touched.bannerFileId && Boolean(errors.bannerFileId)}
                          />
                        </Box>
                        <Box>
                          {values.bannerFileId && (
                            <MediaPreview
                              src={values?.bannerFileId?.preSignedUrl}
                              name={'preview'}
                              onRemove={() => deleteBannerFile(id, setFieldValue)}
                              width={177}
                              height={80}
                              layout="intrinsic"
                              isOverlay={true}
                              style={{ objectFit: 'contain' }}
                            />
                          )}
                        </Box>
                      </Stack>
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Stack alignItems="center" flexDirection="row" gap={2} flexWrap="wrap">
                      <Box>
                        <FileUpload
                          size="small"
                          name={'attachments'}
                          buttonText={'Attach Files'}
                          typeOfAllowed="frontendFileType"
                          onChange={(event) =>
                            handleFileUpload(Array.from(event?.currentTarget?.files), attachments?.length)
                          }
                          multiple
                        />
                      </Box>
                      <Box>
                        <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={0.5}>
                          {attachments &&
                            Array.from(attachments || [])?.map((file) => (
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
                                    <IconButton onClick={() => handleDeleteFile(file?.id)}>
                                      <DeleteIconRed />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                              </Box>
                            ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack
                      gap={3}
                      justifyContent="space-between"
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'flex-start', md: 'center' }}
                      sx={{ pb: 2, pt: 1 }}
                    >
                      <Typography variant="subtitle1" color="text.black" textTransform="uppercase">
                        When to send
                      </Typography>
                      <Button variant="contained" size="small" onClick={handlePreviewEmail}>
                        Preview Emailer
                      </Button>
                    </Stack>
                    <FieldWithSkeleton
                      isLoading={isLoadingCreateEmailer}
                      error={touched.sendAutomatically && errors.sendAutomatically}
                    >
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
                              control={<Radio />}
                              label="Send Automatically"
                              sx={{ color: 'text.secondarydark' }}
                              mb={2}
                            />
                            {values?.sendAutomatically && (
                              <Grid container sx={{ pb: 2.5, pt: 2 }}>
                                <Grid item xs={12} md={4}>
                                  <FieldWithSkeleton
                                    isLoading={isLoadingCreateEmailer}
                                    error={touched.sendOn && errors.sendOn}
                                  >
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
                                            setFieldValue('sendOn', null);
                                          }
                                        } else {
                                          setFieldValue('sendOn', null);
                                        }
                                      }}
                                      handleClear={() => setFieldValue('sendOn', null)}
                                      value={values?.sendOn || null}
                                      type="time"
                                      error={touched.sendOn && errors.sendOn}
                                      minDate={new Date()}
                                      maxDate={values.endDateTime}
                                    />
                                  </FieldWithSkeleton>
                                </Grid>
                              </Grid>
                            )}
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
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
              </DialogContent>
              <DialogActions>
                <Button variant="outlinedWhite" color="primary" onClick={onClose}>
                  Cancel
                </Button>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  form="createEmailerForms"
                  loading={isLoadingCreateEmailer}
                >
                  Save
                </LoadingButton>
              </DialogActions>
              {openPreview && (
                <PreviewEmail
                  open={openPreview}
                  handleClose={() => setOpenPreview(false)}
                  backOpen={handleBackOpen}
                  attachments={attachments}
                  isVolunteer={true}
                />
              )}
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
