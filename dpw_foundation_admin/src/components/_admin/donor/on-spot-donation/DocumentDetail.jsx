import { Box, Button, Grid, IconButton, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import DatePickers from 'src/components/datePicker';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import FileUpload from 'src/components/fileUpload';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';

export default function DocumentDetail({ setFileDetail, uploadCount }) {
  const { errors, getFieldProps, touched, setFieldValue, values } = useFormikContext();
  const theme = useTheme();
  const { user } = useSelector(({ user }) => user);
  const style = CommonStyle(theme);
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const documentIndex = useRef(0);

  const { mutate: mutateDocument } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: (response) => {
      const updatedDocuments = [...values.documentDetails];
      updatedDocuments[documentIndex.current] = {
        ...updatedDocuments[documentIndex.current],
        documentImageId: response.data.id,
        fileName: response.data.fileName
      };
      setFieldValue('documentDetails', updatedDocuments);
      setFileDetail(updatedDocuments);
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
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
      mutateDocument({ entityId: user?.userId, entityType, moduleType, payload: formData, index });
    });
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

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

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
  const handleDeleteFile = (id) => {
    if (id) {
      deleteMediaMutation({
        id: id,
        userId: user?.userId
      });
    }
  };

  const areAllDocumentsFilled = () => {
    const selectedTypes = values.documentDetails.map((doc) => doc.documentType).filter(Boolean);

    const uniqueSelected = new Set(selectedTypes);
    const maxTypes = documentTypes?.values?.length || 0;

    return values.documentDetails.length >= maxTypes || uniqueSelected.size >= maxTypes;
  };

  const getFilteredDocumentTypes = (currentIndex) => {
    // Get all selected document types except the one for the current index
    const selectedTypes = values.documentDetails
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);

    // Filter document types to exclude already selected types
    return documentTypes?.values?.filter((opt) => !selectedTypes.includes(opt.code));
  };

  const remove = (indexToRemove) => {
    const updatedDocuments = values.documentDetails.filter((_, i) => i !== indexToRemove);
    setFieldValue('documentDetails', updatedDocuments);
  };

  return (
    <Grid item md={12}>
      <Stack
        gap={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center', md: 'center' }}
        sx={{ mb: 2 }}
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
      {values.documentDetails?.map((doc, index) => (
        <Box
          key={doc?.documentImageId}
          sx={{
            ...style.documentCard
          }}
        >
          <Box sx={style.deleteIcon}>
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
                  key={`${getFilteredDocumentTypes(index)
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
                  buttonText="Upload Document *"
                  name="documentImageId"
                  size="small"
                  required={true}
                  disabled={values?.documentDetails?.[index]?.documentImageId}
                  error={
                    touched?.documentDetails?.[index]?.documentImageId &&
                    Boolean(errors?.documentDetails?.[index]?.documentImageId)
                  }
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
                      onClick={(event) => downloadMediaFile(event, values?.documentDetails?.[index]?.id)}
                    >
                      {values.documentDetails[index].fileName}
                    </Box>
                    {values?.documentDetails?.[index]?.documentImageId && (
                      <Tooltip title="Remove" arrow>
                        <IconButton aria-label="delete" onClick={() => handleDeleteFile(doc?.documentImageId)}>
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
          </Grid>
        </Box>
      ))}
    </Grid>
  );
}

DocumentDetail.propTypes = {
  setFileDetail: PropTypes.func.isRequired,
  uploadCount: PropTypes.number.isRequired
};
