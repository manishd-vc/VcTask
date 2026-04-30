import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';
import { CloseIcon } from '../icons';
import UploadMultiFile from '../upload/UploadMultiFile';

/**
 * AttachDocumentDialog Component
 *
 * A dialog component for attaching/uploading campaign documents.
 * Includes form validation and file upload functionality.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback for closing the dialog
 * @param {Function} props.onSubmit - Callback for submitting the form
 * @param {Object} props.initialData - Initial form data for editing
 */
const AttachDocumentDialog = ({ open, onClose, onSubmit, initialData = {} }) => {
  const theme = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const documentTypes = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'doc', label: 'Word Document' },
    { value: 'docx', label: 'Word Document (DOCX)' },
    { value: 'xlsx', label: 'Excel Spreadsheet' },
    { value: 'jpg', label: 'JPEG Image' },
    { value: 'png', label: 'PNG Image' },
    { value: 'other', label: 'Other' }
  ];

  const documentPurposes = [
    { value: 'identification', label: 'Identification Document' },
    { value: 'license', label: 'License/Permit' },
    { value: 'financial', label: 'Financial Document' },
    { value: 'legal', label: 'Legal Document' },
    { value: 'medical', label: 'Medical Certificate' },
    { value: 'proof', label: 'Proof of Address' },
    { value: 'other', label: 'Other' }
  ];

  const validationSchema = Yup.object({
    documentName: Yup.string()
      .required('Document name is required')
      .min(2, 'Document name must be at least 2 characters')
      .max(100, 'Document name must be less than 100 characters'),
    purpose: Yup.string().required('Purpose is required'),
    documentType: Yup.string().required('Document type is required'),
    description: Yup.string().max(500, 'Description must be less than 500 characters'),
    files: Yup.array().min(1, 'At least one file is required')
  });

  const initialValues = {
    documentName: initialData.name || '',
    purpose: initialData.purpose || '',
    documentType: initialData.type || '',
    description: initialData.description || '',
    files: []
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const documentData = {
      ...values,
      files: uploadedFiles,
      uploadDate: new Date(),
      uploadedBy: 'Current User' // Replace with actual user data
    };

    onSubmit(documentData);
    setSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setUploadedFiles([]);
    onClose();
  };

  const handleFileUpload = (files, setFieldValue) => {
    setUploadedFiles(files);
    setFieldValue('files', files);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth aria-labelledby="attach-document-dialog-title">
      <DialogTitle
        id="attach-document-dialog-title"
        sx={{
          textTransform: 'uppercase',
          color: 'primary.main',
          fontWeight: 600,
          fontSize: '18px',
          letterSpacing: '0.5px',
          pb: 1
        }}
      >
        Attach Campaign Document
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'grey.500'
        }}
      >
        <CloseIcon />
      </IconButton>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Document Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="documentName"
                    label={
                      <>
                        Document Name{' '}
                        <Box component="span" sx={{ color: 'error.main' }}>
                          *
                        </Box>
                      </>
                    }
                    value={values.documentName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.documentName && Boolean(errors.documentName)}
                    helperText={touched.documentName && errors.documentName}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                {/* Document Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={touched.documentType && Boolean(errors.documentType)}>
                    <InputLabel>
                      Document Type{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </InputLabel>
                    <Select
                      name="documentType"
                      value={values.documentType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Document Type *"
                    >
                      {documentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.documentType && errors.documentType && (
                      <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 2 }}>
                        {errors.documentType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Purpose */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={touched.purpose && Boolean(errors.purpose)}>
                    <InputLabel>
                      Purpose{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </InputLabel>
                    <Select
                      name="purpose"
                      value={values.purpose}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Purpose *"
                    >
                      {documentPurposes.map((purpose) => (
                        <MenuItem key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.purpose && errors.purpose && (
                      <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 2 }}>
                        {errors.purpose}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Description (Optional)"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Enter a brief description of the document..."
                  />
                </Grid>

                {/* File Upload */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        mb: 1,
                        color: 'text.primary'
                      }}
                    >
                      Upload File{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </Typography>
                    <UploadMultiFile
                      showPreview
                      maxFiles={5}
                      onUpload={(files) => handleFileUpload(files, setFieldValue)}
                      accept={{
                        'application/pdf': ['.pdf'],
                        'application/msword': ['.doc'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                        'application/vnd.ms-excel': ['.xls'],
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['.png']
                      }}
                      helperText="Upload PDF, Word, Excel, or Image files (Max 5 files, 10MB each)"
                    />
                    {touched.files && errors.files && (
                      <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
                        {errors.files}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  mr: 2,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }}
              >
                {isSubmitting ? 'Attaching...' : 'Attach Document'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

AttachDocumentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    purpose: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string
  })
};

export default AttachDocumentDialog;
