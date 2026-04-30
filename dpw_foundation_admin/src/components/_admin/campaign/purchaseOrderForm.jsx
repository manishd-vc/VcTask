import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import ModalStyle from 'src/components/dialog/dialog.style';
import FileUpload from 'src/components/fileUpload';
import { CloseIcon, DeleteIconRed } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { downloadFile } from 'src/utils/fileUtils';
import * as Yup from 'yup';
/**
 * PurchaseOrderForm component
 *
 * This form component is used for creating or editing purchase orders. It includes file upload functionality,
 * validation, and handles form submission. It also integrates with API calls for file upload/download and
 * displays success/error messages through a toast notification.
 *
 * @component
 * @param {boolean} open - Flag indicating if the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onSubmit - Function to handle form submission with the purchase order data.
 * @param {boolean} isLoading - Flag indicating if the form is in a loading state.
 * @example
 * return <PurchaseOrderForm open={true} onClose={handleClose} onSubmit={handleSubmit} isLoading={false} />;
 */
const PurchaseOrderForm = ({ open, onClose, onSubmit, isLoading }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);

  // Extract file upload limit configuration from the master data
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);

  // Mutation hook for file upload API call
  const { mutate } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
    }
  });

  // Mutation hook for file download API call
  const { mutate: downloadMedia } = useMutation('downloadMedia', api.downloadMedia, {
    onSuccess: ({ data, headers }, fileId) => {
      const contentDisposition = headers.get('content-disposition');
      if (contentDisposition) {
        let filename = contentDisposition.split('filename=')[1];
        if (filename.startsWith('"') && filename.endsWith('"')) {
          filename = filename.slice(1, -1);
        }
        downloadFile(data, filename, headers);
      } else {
        downloadFile(data, fileId, headers);
      }
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      poNumber: '',
      poDate: '',
      poItem: '',
      poDescription: '',
      poQuantity: '',
      poValue: '',
      fileIds: [] // Initial empty array for file IDs
    },
    validationSchema: Yup.object({
      poNumber: Yup.number().required('PO Number is required').min(1, 'Number must be at least 1'),
      poDate: Yup.string().required('Date is required'),
      poDescription: Yup.string().required('Description is required'),
      poValue: Yup.number().required('PO Value is required').min(0, 'Value must be positive')
    }),
    onSubmit: (values) => {
      // Construct payload for form submission
      const payload = {
        ...values,
        fileIds: values.fileIds.map((file) => file.id) // Extract only the file IDs from uploaded files
      };
      onSubmit(payload); // Pass the payload to the parent onSubmit handler
      formik.resetForm(); // Reset the form after submission
    }
  });

  // Handle modal close and form reset
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  /**
   * Handles file upload functionality, including validation for file count and size.
   *
   * @param {Array} files - Array of files to be uploaded.
   * @param {string} fieldName - The field name where files will be added.
   * @param {string} entityType - The entity type for the file upload request.
   * @param {string} moduleType - The module type for the file upload request.
   *
   * @returns {void}
   */
  const handleFileUpload = async (files, fieldName, entityType, moduleType) => {
    // Check if the total number of files exceeds the allowed upload limit
    if (files?.length + formik?.values[fieldName]?.length > uploadCount) {
      dispatch(
        setToastMessage({
          message: `You can only upload ${uploadCount} files.`,
          variant: 'warning'
        })
      );
      return;
    }

    // Filter valid files (size <= 10MB)
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);

    if (validFiles.length === 0) {
      console.warn('No valid files to upload.');
      return;
    }

    try {
      const uploadedFiles = [];

      // Upload each valid file sequentially
      for await (let file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);

        // Wrap mutate in a Promise to handle asynchronous file uploads
        await new Promise((resolve, reject) => {
          mutate(
            {
              entityId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              entityType,
              moduleType,
              payload: formData
            },
            {
              onSuccess: (response) => {
                uploadedFiles.push(response?.data); // Collect uploaded files
                resolve(response?.data); // Resolve the Promise with the file data
              },
              onError: (error) => {
                console.error('Mutation error:', error);
                reject(error); // Reject the Promise on error
              }
            }
          );
        });
      }

      // Update the form field with the uploaded files
      formik.setFieldValue(fieldName, [...formik.values[fieldName], ...uploadedFiles]);

      // Display success message
      dispatch(setToastMessage({ message: 'Files uploaded successfully!', variant: 'success' }));
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'File upload failed';
      dispatch(setToastMessage({ message: errorMessage, variant: 'error' }));
    }
  };

  /**
   * Handles file deletion from the form field.
   *
   * @param {Object} file - The file object to be deleted.
   * @param {Array} value - The current value of the field (list of files).
   * @param {string} fieldName - The name of the form field holding the list of files.
   *
   * @returns {void}
   */
  const handleDeleteFile = (file, value, fieldName) => {
    formik.setFieldValue(
      fieldName,
      value.filter((item) => item !== file) // Remove the deleted file from the list
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          Enter Purchase Order Details
        </DialogTitle>
        <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="standard"
                id="poNumber"
                name="poNumber"
                placeholder="Enter PO Number"
                label={
                  <>
                    PO Number{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                type="number"
                value={formik.values.poNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.poNumber && Boolean(formik.errors.poNumber)}
                helperText={formik.touched.poNumber && formik.errors.poNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePickers
                id="poDate"
                name="poDate"
                label={
                  <>
                    Date{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputFormat="yyyy-MM-dd HH:mm"
                handleClear={() => formik.setFieldValue('poDate', null)} // Fix the clear handler
                onChange={(value) =>
                  formik.setFieldValue('poDate', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)
                }
                value={formik.values.poDate || null}
                type="date"
                error={formik.touched.poDate && Boolean(formik.errors.poDate)}
                helperText={formik.touched.poDate && formik.errors.poDate}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                variant="standard"
                id="poDescription"
                name="poDescription"
                label={
                  <>
                    PO Description{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                placeholder="Enter Description"
                value={formik.values.poDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.poDescription && Boolean(formik.errors.poDescription)}
                helperText={formik.touched.poDescription && formik.errors.poDescription}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                variant="standard"
                id="poValue"
                name="poValue"
                label={
                  <>
                    PO Value{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                placeholder="Enter PO Value"
                type="number"
                value={formik.values.poValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.poValue && Boolean(formik.errors.poValue)}
                helperText={formik.touched.poValue && formik.errors.poValue}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Stack flexDirection="row" alignItems="flex-start" flexWrap="wrap" sx={{ pt: 3 }} gap={2}>
                <FileUpload
                  buttonText="Upload  Document"
                  name="fileIds"
                  multiple
                  size="small"
                  onChange={(event) =>
                    handleFileUpload(
                      Array.from(event.target.files),
                      'fileIds',
                      'CAMPAIGN_PO',
                      'CAMPAIGN_PO_ATTACHEMENT'
                    )
                  }
                />
                {Boolean(formik.values.fileIds.length) &&
                  Array.from(formik.values.fileIds)?.map((file) => (
                    <Box key={`download_files_po_${file?.id}`}>
                      <Typography component="span" variant="body2" color="text.secondarydark">
                        <Box
                          component="span"
                          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                          onClick={() => downloadMedia(file?.id)}
                        >
                          {file?.fileName}
                        </Box>
                        {file?.id && (
                          <Tooltip title="Remove" arrow>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteFile(file, formik.values.fileIds, 'fileIds')}
                            >
                              <DeleteIconRed />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Typography>
                    </Box>
                  ))}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlinedWhite">
            No
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} sx={{ ml: 'auto' }}>
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
PurchaseOrderForm.propTypes = {
  open: PropTypes.bool.isRequired, // Validates 'open' as a required boolean
  onClose: PropTypes.func.isRequired, // Validates 'onClose' as a required function
  onSubmit: PropTypes.func.isRequired, // Validates 'onSubmit' as a required function
  isLoading: PropTypes.bool // Validates 'isLoading' as an optional boolean
};
export default PurchaseOrderForm;
