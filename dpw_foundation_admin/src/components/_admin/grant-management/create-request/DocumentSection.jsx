import { Box, Button, Grid, IconButton, Link, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { useRef } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import FileUpload from 'src/components/fileUpload';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import ProfileStyle from '../../donor/steps/profile.style';

export default function DocumentSection({ entityId }) {
  const dispatch = useDispatch();
  const documentIndex = useRef(0);
  const theme = useTheme();
  const styles = {
    ...ProfileStyle(theme)
  };
  const { masterData } = useSelector((state) => state?.common);
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);
  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const { values, getFieldProps, isLoading, setFieldValue, touched, errors } = useFormikContext();

  const { mutate: mutateDocument } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const updatedDocuments = [...values.documentDetails];
      updatedDocuments[documentIndex.current] = {
        ...updatedDocuments[documentIndex.current],
        documentImageId: response.data.id,
        fileName: response.data.fileName,
        preSignedUrl: response.data.preSignedUrl
      };
      setFieldValue('documentDetails', updatedDocuments);
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
      mutateDocument({ entityId: entityId, entityType, moduleType, payload: formData });
    });
  };

  const { mutate: deleteMediaMutation } = useMutation('deleteMedia', api.deleteDocumentMedia, {
    onSuccess: (response, variables) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const updatedDocuments = values.documentDetails.map((doc) => {
        if (doc.documentImageId === variables.id) {
          return { ...doc, documentImageId: '', fileName: '' };
        }
        return doc;
      });
      setFieldValue('documentDetails', updatedDocuments);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const getFilteredDocumentTypes = (currentIndex) => {
    const currentDocuments = values?.documentDetails || [];
    // Get all selected document types except the one for the current index
    const selectedTypes = currentDocuments
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);

    // Filter document types to exclude already selected types
    return documentTypes?.values?.filter((opt) => !selectedTypes.includes(opt.code));
  };

  const areAllDocumentsFilled = () => {
    const currentDocuments = values?.documentDetails || [];
    const selectedTypes = currentDocuments.map((doc) => doc.documentType).filter(Boolean);

    const uniqueSelected = new Set(selectedTypes);
    const maxTypes = documentTypes?.values?.length || 0;

    return currentDocuments.length >= maxTypes || uniqueSelected.size >= maxTypes;
  };

  const remove = (indexToRemove) => {
    const currentDocuments = values?.documentDetails || [];
    const updatedDocuments = currentDocuments.filter((_, i) => i !== indexToRemove);
    setFieldValue('documentDetails', updatedDocuments);
  };

  const handleDocumentsDeleteFile = (id) => {
    if (id) {
      deleteMediaMutation({
        id: id,
        userId: entityId
      });
    }
  };

  return (
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
          sx={{ mt: 1 }}
          onClick={() => {
            const maxTypes = documentTypes?.values?.length || 0;
            const currentDocuments = values?.documentDetails || [];
            if (currentDocuments.length < maxTypes) {
              setFieldValue('documentDetails', [
                ...currentDocuments,
                {
                  id: '',
                  documentType: '',
                  documentNumber: '',
                  documentValidity: null,
                  documentImageId: '',
                  fileName: '',
                  preSignedUrl: '',
                  sequence: currentDocuments.length + 1
                }
              ]);
            }
          }}
          disabled={areAllDocumentsFilled()}
        >
          Add More Documents
        </Button>
      </Stack>
      {touched.documentDetails && errors.documentDetails && typeof errors.documentDetails === 'string' && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {errors.documentDetails}
        </Typography>
      )}
      {(values?.documentDetails || []).map((doc, index) => (
        <Box key={doc?.sequence} sx={styles.documentCard}>
          <Box sx={styles.deleteIcon}>
            <IconButton onClick={() => remove(index)}>
              <DeleteIconRed />
            </IconButton>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FieldWithSkeleton isLoading={isLoading}>
                <TextFieldSelect
                  key={`${getFilteredDocumentTypes(index)
                    ?.map((d) => d.value)
                    .join(',')}`}
                  id={`documentDetails.${index}.documentType`}
                  label={
                    <>
                      Select Identity Document Type{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  getFieldProps={getFieldProps}
                  itemsData={getFilteredDocumentTypes(index)}
                  value={values.documentDetails[index].documentType}
                  onChange={(e) => setFieldValue(`documentDetails.${index}.documentType`, e.target.value)}
                  error={
                    touched.documentDetails?.[index]?.documentType && errors?.documentDetails?.[index]?.documentType
                  }
                  helperText={
                    touched.documentDetails?.[index]?.documentType && errors?.documentDetails?.[index]?.documentType
                  }
                />
              </FieldWithSkeleton>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FieldWithSkeleton isLoading={isLoading}>
                <TextField
                  id={`documentDetails.${index}.documentNumber`}
                  variant="standard"
                  label={
                    <>
                      Enter Document Number{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  fullWidth
                  value={values.documentDetails[index].documentNumber}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= 255 && /^[a-zA-Z0-9\s]*$/.test(newValue)) {
                      setFieldValue(`documentDetails.${index}.documentNumber`, newValue);
                    }
                  }}
                  error={
                    touched.documentDetails?.[index]?.documentNumber && errors?.documentDetails?.[index]?.documentNumber
                  }
                  helperText={
                    touched.documentDetails?.[index]?.documentNumber && errors?.documentDetails?.[index]?.documentNumber
                  }
                  inputProps={{
                    maxLength: 255,
                    onInput: (e) => {
                      if (e.target.value.length > 255) {
                        e.target.value = e.target.value.slice(0, 255);
                      }
                    }
                  }}
                />
              </FieldWithSkeleton>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FieldWithSkeleton isLoading={isLoading}>
                <DatePickers
                  label={
                    <>
                      Select Document Validity{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  inputFormat={'yyyy-MM-dd'}
                  minDate={new Date()}
                  onChange={(newDate) => setFieldValue(`documentDetails.${index}.documentValidity`, newDate)}
                  value={values.documentDetails[index].documentValidity}
                  handleClear={() => {
                    setFieldValue(`documentDetails.${index}.documentValidity`, null);
                  }}
                  error={
                    touched.documentDetails?.[index]?.documentValidity &&
                    errors?.documentDetails?.[index]?.documentValidity
                  }
                  helperText={
                    touched.documentDetails?.[index]?.documentValidity &&
                    errors?.documentDetails?.[index]?.documentValidity
                  }
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
                  <FileUpload
                    buttonText={<>Upload Document </>}
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
                      <Link
                        sx={{
                          textDecoration: values?.documentDetails?.[index]?.fileName ? 'underline' : 'none',
                          cursor: values?.documentDetails?.[index]?.fileName ? 'pointer' : 'default',
                          color: values?.documentDetails?.[index]?.fileName ? 'text.secondarydark' : 'inherit',
                          fontWeight: 300
                        }}
                        href={values?.documentDetails?.[index]?.preSignedUrl}
                      >
                        {values?.documentDetails?.[index]?.fileName}
                      </Link>
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
                {touched.documentDetails?.[index]?.documentImageId &&
                  errors?.documentDetails?.[index]?.documentImageId && (
                    <Typography variant="caption" color="error">
                      {errors?.documentDetails?.[index]?.documentImageId}
                    </Typography>
                  )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      ))}
      {(values?.documentDetails || []).length === 0 && (
        <Box sx={{ mt: 2, p: 2, border: '1px dashed', borderColor: 'grey.300', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No documents added yet. Please add at least one identity document.
          </Typography>
        </Box>
      )}
    </Grid>
  );
}

// Export the validation function for use in parent components
DocumentSection.validateDocuments = (documentDetails) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return !documentDetails?.some((doc) => {
    if (!doc.documentValidity) return false;

    const validityDate = new Date(doc.documentValidity);
    validityDate.setHours(0, 0, 0, 0);

    return validityDate < currentDate;
  });
};
