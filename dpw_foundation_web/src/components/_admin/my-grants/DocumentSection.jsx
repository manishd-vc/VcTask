import { Box, Button, Grid, IconButton, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
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
export default function DocumentSection() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = {
    ...CommonStyle(theme)
  };
  const documentIndex = useRef(0);
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const { masterData } = useSelector((state) => state?.common);
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);
  const documentTypes = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const { values, getFieldProps, isLoading, setFieldValue } = useFormikContext();

  const { mutate: mutateDocument } = useMutation('uploadFiles', api.uploadCampaignFiles, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const updatedDocuments = [...values.documentDetails];
      updatedDocuments[documentIndex.current] = {
        ...updatedDocuments[documentIndex.current],
        documentImageId: response.data.id,
        fileName: response.data.fileName
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
      mutateDocument({ entityId: grantRequestData?.grantSeekerId, entityType, moduleType, payload: formData });
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
    // Get all selected document types except the one for the current index
    const selectedTypes = values.documentDetails
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);

    // Filter document types to exclude already selected types
    return documentTypes?.values?.filter((opt) => !selectedTypes.includes(opt.code));
  };

  const areAllDocumentsFilled = () => {
    const selectedTypes = values?.documentDetails?.map((doc) => doc.documentType).filter(Boolean);

    const uniqueSelected = new Set(selectedTypes);
    const maxTypes = documentTypes?.values?.length || 0;

    return values.documentDetails.length >= maxTypes || uniqueSelected.size >= maxTypes;
  };

  const remove = (indexToRemove) => {
    const updatedDocuments = values.documentDetails.filter((_, i) => i !== indexToRemove);
    setFieldValue('documentDetails', updatedDocuments);
  };

  const handleDocumentsDeleteFile = (id) => {
    if (id) {
      deleteMediaMutation({
        id: id,
        userId: grantRequestData?.grantSeekerId
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
          sx={{ my: 1 }}
          onClick={() => {
            const maxTypes = documentTypes?.values?.length || 0;
            if (values?.documentDetails?.length < maxTypes) {
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
        <Box key={doc?.id} sx={styles.documentCard}>
          <Box sx={styles.docDeleteIcon}>
            <IconButton onClick={() => remove(index)}>
              <DeleteIconRed />
            </IconButton>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FieldWithSkeleton isLoading={isLoading}>
                <TextFieldSelect
                  key={`documentType-${doc?.id}-${getFilteredDocumentTypes(index)
                    ?.map((d) => d.value)
                    .join(',')}`}
                  id={`documentDetails.${index}.documentType`}
                  label="Select Identity Document Type"
                  getFieldProps={getFieldProps}
                  itemsData={getFilteredDocumentTypes(index)}
                  value={values.documentDetails[index].documentType}
                  onChange={(e) => setFieldValue(`documentDetails.${index}.documentType`, e.target.value)}
                />
              </FieldWithSkeleton>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FieldWithSkeleton isLoading={isLoading}>
                <TextField
                  id={`documentDetails.${index}.documentNumber`}
                  variant="standard"
                  inputProps={{ maxLength: 256 }}
                  label="Enter Document Number"
                  fullWidth
                  value={values.documentDetails[index].documentNumber}
                  onChange={(e) => setFieldValue(`documentDetails.${index}.documentNumber`, e.target.value)}
                />
              </FieldWithSkeleton>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
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
                      // onClick={(e) => downloadMediaFile(e, values?.documentDetails?.[index]?.documentImageId)}
                    >
                      {values?.documentDetails?.[index]?.fileName || ''}
                    </Box>
                    {values?.documentDetails?.[index]?.documentImageId && (
                      <Tooltip title="Remove" arrow>
                        <IconButton aria-label="delete" onClick={() => handleDocumentsDeleteFile(doc?.documentImageId)}>
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
  );
}
