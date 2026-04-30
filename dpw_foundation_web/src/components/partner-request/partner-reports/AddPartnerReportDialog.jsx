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
  Typography,
  useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import DatePickers from 'src/components/datePicker';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon, DeleteIconRed } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerApi from 'src/services/partner';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  reportPeriodFrom: Yup.date().required('Report period from is required'),
  reportPeriodTo: Yup.date()
    .required('Report period to is required')
    .min(Yup.ref('reportPeriodFrom'), 'End date must be after start date'),
  reportType: Yup.string().required('Report type is required'),
  reportTitle: Yup.string().required('Report title is required'),
  submissionDate: Yup.date().required('Submission date is required'),
  reportSummary: Yup.string().required('Report summary is required')
});

export default function AddPartnerReportDialog({ open, onClose, onSave, partnershipId, editingReport }) {
  const dispatch = useDispatch();
  const isEditing = !!editingReport;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [documentIds, setDocumentIds] = useState(editingReport?.documentIds || []);
  const theme = useTheme(); // Use the theme hook to access the theme object (e.g., colors, typography)
  const style = ModalStyle(theme); // Apply the modal-specific styles based on the theme
  const { data: existingAttachments } = useQuery(
    ['partnerReportDocuments', partnershipId, editingReport?.id],
    () => partnerApi.getPartnerReportDocuments(partnershipId, editingReport?.id),
    {
      enabled: isEditing && !!partnershipId && !!editingReport?.id
    }
  );

  useEffect(() => {
    if (existingAttachments && isEditing) {
      setExistingDocuments(existingAttachments);
      setDocumentIds(existingAttachments.map((doc) => doc.id));
    }
  }, [existingAttachments, isEditing]);

  const { mutate: uploadDocument, isLoading: isUploading } = useMutation(partnerApi.uploadPartnerReportDocument, {
    onSuccess: (response) => {
      const newDocumentId = response?.data?.id;
      if (newDocumentId) {
        setDocumentIds((prev) => [...prev, newDocumentId]);
        dispatch(setToastMessage({ message: 'Document uploaded successfully', variant: 'success' }));
      }
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: 'Failed to upload document', variant: 'error' }));
    }
  });

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (file.size > maxSize) {
        dispatch(
          setToastMessage({ message: `File ${file.name} is too large. Maximum size is 10MB.`, variant: 'error' })
        );
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        dispatch(setToastMessage({ message: `File ${file.name} has unsupported format.`, variant: 'error' }));
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      console.log('validFiles', validFiles);
      validFiles.forEach((file) => {
        const formData = new FormData();
        formData.append('file', file);
        uploadDocument({ partnershipId, payload: formData });
      });
    }
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setDocumentIds((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingDocument = (documentId) => {
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    setDocumentIds((prev) => prev.filter((id) => id !== documentId));
  };

  const { mutate: saveReport, isLoading } = useMutation(
    isEditing ? partnerApi.updatePartnerReport : partnerApi.createPartnerReport,
    {
      onSuccess: (response) => {
        dispatch(
          setToastMessage({
            message: `Partner Report has been ${isEditing ? 'updated' : 'saved'} successfully`,
            variant: 'success'
          })
        );
        onSave();
      },
      onError: (error) => {
        dispatch(
          setToastMessage({
            message: error.response?.data?.message || 'Something went wrong',
            variant: 'error'
          })
        );
      }
    }
  );

  const formik = useFormik({
    initialValues: {
      reportPeriodFrom: editingReport?.reportPeriodFrom || null,
      reportPeriodTo: editingReport?.reportPeriodTo || null,
      reportType: editingReport?.reportType || '',
      reportTitle: editingReport?.reportTitle || '',
      submissionDate: editingReport?.submissionDate || null,
      reportSummary: editingReport?.reportSummary || ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
      console.log('Partnership ID:', partnershipId);
      console.log('Document IDs:', documentIds);

      const payload = {
        ...values,
        documentIds
      };

      console.log('Final payload:', payload);

      if (isEditing) {
        console.log('Updating report...');
        saveReport({ partnershipId, id: editingReport.id, ...payload });
      } else {
        console.log('Creating new report...');
        saveReport({ partnershipId, ...payload });
      }
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main" mb={0}>
          Add Partnership Report
        </DialogTitle>
        {/* Icon button to close the dialog */}
        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePickers
                  label={
                    <>
                      Report Period From{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  value={formik.values.reportPeriodFrom}
                  handleClear={() => formik.setFieldValue('reportPeriodFrom', null)}
                  onChange={(value) => formik.setFieldValue('reportPeriodFrom', value)}
                  placeholder="Report Period From"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        sx: { height: 40 }
                      }}
                      error={formik.touched.reportPeriodFrom && Boolean(formik.errors.reportPeriodFrom)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePickers
                  label={
                    <>
                      Report Period From{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  value={formik.values.reportPeriodTo}
                  minDate={formik.values.reportPeriodFrom}
                  handleClear={() => formik.setFieldValue('reportPeriodTo', null)}
                  onChange={(value) => formik.setFieldValue('reportPeriodTo', value)}
                  placeholder="Report Period To"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        sx: { height: 40 }
                      }}
                      error={formik.touched.reportPeriodTo && Boolean(formik.errors.reportPeriodTo)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="reportType"
                  value={formik.values.reportType}
                  onChange={formik.handleChange}
                  variant="standard"
                  label={
                    <>
                      Report Type{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  InputProps={{
                    sx: { height: 40 }
                  }}
                  error={formik.touched.reportType && Boolean(formik.errors.reportType)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="reportTitle"
                  value={formik.values.reportTitle}
                  onChange={formik.handleChange}
                  label={
                    <>
                      Report Title{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  variant="standard"
                  InputProps={{
                    sx: { height: 40 }
                  }}
                  error={formik.touched.reportTitle && Boolean(formik.errors.reportTitle)}
                  helperText={formik.touched.reportTitle && formik.errors.reportTitle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePickers
                  label={
                    <>
                      Submission Date{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  value={formik.values.submissionDate}
                  onChange={(value) => formik.setFieldValue('submissionDate', value)}
                  handleClear={() => formik.setFieldValue('submissionDate', null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        sx: { height: 40 }
                      }}
                      error={formik.touched.submissionDate && Boolean(formik.errors.submissionDate)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="reportSummary"
                  value={formik.values.reportSummary}
                  onChange={formik.handleChange}
                  label="Report Summary"
                  variant="standard"
                  error={formik.touched.reportSummary && Boolean(formik.errors.reportSummary)}
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" component="label" size="small" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Add Attachment'}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </Button>
                <Stack mt={2} flexDirection={'row'} flexWrap={'wrap'} gap={1}>
                  {existingDocuments.map((document) => (
                    <Stack flexDirection={'row'} alignItems={'center'} gap={1} key={document.id}>
                      <Typography variant="body2" color="primary.main">
                        {document.fileName}
                      </Typography>
                      <HtmlTooltip title="Delete" arrow>
                        <IconButton onClick={() => removeExistingDocument(document.id)}>
                          <DeleteIconRed />
                        </IconButton>
                      </HtmlTooltip>
                    </Stack>
                  ))}
                  {uploadedFiles.map((file, index) => (
                    <Stack
                      flexDirection={'row'}
                      alignItems={'center'}
                      gap={1}
                      key={`${file.name}-${file.lastModified}`}
                    >
                      <Typography component="div" variant="body2" color="text.secondarydark">
                        <Box component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                          {file.name}
                        </Box>
                      </Typography>
                      <HtmlTooltip title="Delete" arrow>
                        <IconButton onClick={() => removeFile(index)}>
                          <DeleteIconRed />
                        </IconButton>
                      </HtmlTooltip>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={isLoading} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isEditing ? 'Update' : 'Submit'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
