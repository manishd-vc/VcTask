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
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import FileUpload from 'src/components/fileUpload';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { CloseIcon, DeleteIconRed } from '../icons';
import ModalStyle from './dialog.style';

export default function AddSupportingDocumentDialog({ open, onClose, onSave, userData, editData = null }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    documentValidity: null,
    type: '',
    documentImageId: '',
    fileName: '',
    newData: false
  });

  // Prefill form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        documentType: editData.documentType || '',
        documentNumber: editData.documentNumber || '',
        documentValidity: editData.documentValidity || null,
        type: editData.type || '',
        documentImageId: editData.documentImageId || '',
        fileName: editData.fileName || '',
        newData: false
      });
    } else {
      setFormData({
        documentType: '',
        documentNumber: '',
        documentValidity: null,
        type: '',
        documentImageId: '',
        fileName: '',
        newData: false
      });
    }
  }, [editData]);

  const { mutate: uploadFile } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: (response) => {
      setFormData((prev) => ({
        ...prev,
        documentImageId: response.data.id,
        fileName: response.data.fileName
      }));
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
    }
  });
  const { mutate: deleteFile } = useMutation(
    'deleteVolunteerSupportDocument',
    (documentId) => volunteerApi.deleteVolunteerSupportDocument(userData?.userId, documentId),
    {
      onSuccess: () => {
        setFormData((prev) => ({
          ...prev,
          documentImageId: '',
          fileName: ''
        }));
        dispatch(setToastMessage({ message: 'File deleted successfully', variant: 'success' }));
      },
      onError: (error) => {
        dispatch(
          setToastMessage({
            message: error.response?.data?.message || 'Failed to delete file',
            variant: 'error'
          })
        );
      }
    }
  );

  const { mutate: createSupportDocument } = useMutation('createSupportDocument', volunteerApi.createSupportDocument, {
    onSuccess: (response) => {
      const message = editData ? 'Support document updated successfully' : 'Support document created successfully';
      dispatch(setToastMessage({ message, variant: 'success' }));
      onSave?.({ ...response?.data, newData: true });
      onClose();
      setFormData({
        documentType: '',
        documentNumber: '',
        documentValidity: null,
        type: '',
        documentImageId: '',
        fileName: '',
        newData: false
      });
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error.response?.data?.message || 'Failed to create support document',
          variant: 'error'
        })
      );
    }
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value, newData: true }));
  };

  const handleFileUpload = (files) => {
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);
    if (validFiles.length > 0) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', validFiles[0]);
      uploadFile({
        entityId: userData?.userId,
        entityType: 'USER',
        moduleType: 'USER_VOLUNTEER_SUPPORT_ATTACHEMENT',
        payload: formDataUpload
      });
    }
  };

  const download = async (fileId, fileName) => {
    try {
      const urls = await api.downloadAllDocuments([fileId]);
      if (urls.length > 0) {
        const link = document.createElement('a');
        link.href = urls[0];
        link.download = fileName || 'document';
        link.click();
      }
    } catch (error) {
      console.log('error', error);
      dispatch(
        setToastMessage({
          message: 'Failed to download file',
          variant: 'error'
        })
      );
    }
  };

  const handleSave = () => {
    if (!formData.documentType.trim()) {
      dispatch(setToastMessage({ message: 'Title is required', variant: 'error' }));
      return;
    }
    const payload = {
      id: editData?.id || '',
      userId: userData?.userId,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      documentValidity: formData.documentValidity,
      type: formData.type,
      documentImageId: formData.documentImageId
    };
    createSupportDocument(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        {editData ? 'Edit Supporting Document' : 'Add Supporting Document'}
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="standard"
              label="Title"
              required
              value={formData.documentType}
              onChange={(e) => handleChange('documentType', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="standard"
              label="Document Number"
              value={formData.documentNumber}
              onChange={(e) => handleChange('documentNumber', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePickers
              label="Valid Till"
              value={formData.documentValidity}
              onChange={(value) => handleChange('documentValidity', value)}
              handleClear={() => handleChange('documentValidity', null)}
            />
          </Grid>
          <Grid item xs={12}>
            <FileUpload
              buttonText="Upload File"
              name="documentFile"
              size="small"
              disabled={!!formData.documentImageId}
              onChange={(event) => {
                handleFileUpload(Array.from(event.target.files));
              }}
            />
            <Stack flexDirection="row" flexWrap="wrap" alignItems="center" sx={{ pt: 2 }} gap={1.2}>
              {formData.fileName && (
                <Box key={formData.documentImageId}>
                  <Typography component="div" variant="body2" color="text.secondarydark">
                    <Box
                      component="span"
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => download(formData.documentImageId, formData.fileName)}
                    >
                      {formData.fileName}
                    </Box>
                    {formData.documentImageId && (
                      <Tooltip title="Remove" arrow>
                        <IconButton aria-label="delete" onClick={() => deleteFile(formData.documentImageId)}>
                          <DeleteIconRed />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          {editData ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
