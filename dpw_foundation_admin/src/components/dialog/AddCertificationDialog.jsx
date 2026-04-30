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
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import FileUpload from 'src/components/fileUpload';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { CloseIcon, DeleteIconRed } from '../icons';
import ModalStyle from './dialog.style';

export default function AddCertificationDialog({ open, onClose, onSave, userData, editData = null }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [formData, setFormData] = useState({
    skillTitle: '',
    docNumber: '',
    issuedDate: null,
    validTill: null,
    issuingInstitute: '',
    country: '',
    state: '',
    city: '',
    type: '',
    documentImageId: '',
    fileName: '',
    newData: false
  });

  // Prefill form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        skillTitle: editData.skillTitle || '',
        docNumber: editData.docNumber || '',
        issuedDate: editData.issuedDate || null,
        validTill: editData.validTill || null,
        issuingInstitute: editData.issuingInstitute || '',
        country: editData.country || '',
        state: editData.state || '',
        city: editData.city || '',
        type: editData.type || '',
        documentImageId: editData.documentImageId || '',
        fileName: editData.fileName || '',
        newData: false
      });
    } else {
      setFormData({
        skillTitle: '',
        docNumber: '',
        issuedDate: null,
        validTill: null,
        issuingInstitute: '',
        country: '',
        state: '',
        city: '',
        type: '',
        documentImageId: '',
        fileName: '',
        newData: false
      });
    }
  }, [editData]);

  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const { data: stateData } = useQuery(['getStates', formData.country], () => api.getStates(formData.country), {
    enabled: !!formData.country,
    refetchOnWindowFocus: false
  });

  const { data: citiesData } = useQuery(
    ['getCities', formData.state],
    () => api.getCities(formData.country, formData.state),
    {
      enabled: !!formData.state,
      refetchOnWindowFocus: false
    }
  );

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
    'deleteSkillCertificationDocument',
    (documentId) => volunteerApi.deleteSkillCertificationDocument(userData?.userId, documentId),
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

  const { mutate: createCertification } = useMutation(
    'createSkillCertification',
    volunteerApi.createSkillCertification,
    {
      onSuccess: (response) => {
        const message = editData ? 'Certification updated successfully' : 'Certification created successfully';
        dispatch(setToastMessage({ message, variant: 'success' }));
        onSave?.({ ...response?.data, newData: true });
        onClose();
        setFormData({
          skillTitle: '',
          docNumber: '',
          issuedDate: null,
          validTill: null,
          issuingInstitute: '',
          country: '',
          state: '',
          city: '',
          type: '',
          documentImageId: '',
          fileName: '',
          newData: false
        });
      },
      onError: (error) => {
        dispatch(
          setToastMessage({
            message: error.response?.data?.message || 'Failed to create certification',
            variant: 'error'
          })
        );
      }
    }
  );

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value, newData: true };

      // Clear validTill if it becomes invalid when issuedDate changes
      if (field === 'issuedDate' && value && prev.validTill) {
        const issuedDate = new Date(value);
        const validTill = new Date(prev.validTill);
        if (validTill < issuedDate) {
          newData.validTill = null;
        }
      }

      return newData;
    });
  };

  const handleFileUpload = (files) => {
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);
    if (validFiles.length > 0) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', validFiles[0]);
      uploadFile({
        entityId: userData?.userId,
        entityType: 'USER',
        moduleType: 'USER_SKILL_CERTIFICATE_ATTACHEMENT',
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
    if (!formData.skillTitle.trim()) {
      dispatch(setToastMessage({ message: 'Title is required', variant: 'error' }));
      return;
    }
    const payload = {
      id: editData?.id || '',
      userId: userData?.userId,
      skillTitle: formData.skillTitle,
      docNumber: formData.docNumber,
      issuedDate: formData.issuedDate,
      validTill: formData.validTill,
      issuingInstitute: formData.issuingInstitute,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      type: formData.type,
      documentImageId: formData.documentImageId
    };
    createCertification(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        {editData ? 'Edit Certification' : 'Add Certification'}
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
              value={formData.skillTitle}
              onChange={(e) => handleChange('skillTitle', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="standard"
              label="Document Number"
              value={formData.docNumber}
              onChange={(e) => handleChange('docNumber', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePickers
              label="Issued Date"
              value={formData.issuedDate}
              onChange={(value) => handleChange('issuedDate', value)}
              handleClear={() => handleChange('issuedDate', null)}
              maxDate={new Date()}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePickers
              label="Valid Till"
              value={formData.validTill}
              onChange={(value) => handleChange('validTill', value)}
              handleClear={() => handleChange('validTill', null)}
              minDate={formData.issuedDate ? new Date(formData.issuedDate) : null}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="standard"
              label="Issuing Institute"
              value={formData.issuingInstitute}
              onChange={(e) => handleChange('issuingInstitute', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextFieldSelect
              id="country"
              label="Country"
              value={formData.country}
              onChange={(e) => {
                handleChange('country', e.target.value);
                handleChange('state', '');
                handleChange('city', '');
              }}
              itemsData={country}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextFieldSelect
              id="state"
              label="State/Province"
              value={formData.state}
              onChange={(e) => {
                handleChange('state', e.target.value);
                handleChange('city', '');
              }}
              itemsData={stateData}
              disabled={!formData.country}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextFieldSelect
              id="city"
              label="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              itemsData={citiesData}
              disabled={!formData.state}
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
