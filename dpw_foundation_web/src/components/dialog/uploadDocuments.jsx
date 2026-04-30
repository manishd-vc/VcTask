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
  Typography,
  useTheme
} from '@mui/material';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as contributionApi from 'src/services/contribution';
import * as grantManagementApi from 'src/services/grantManagement';
import * as Yup from 'yup';
import FieldWithSkeleton from '../FieldWithSkeleton';
import FileUpload from '../fileUpload';
import { CloseIcon, DeleteIconRed } from '../icons';
import ModalStyle from './dialog.style';

UploadDocuments.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  targetEntityId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

const validationSchema = Yup.object().shape({
  documentName: Yup.string().required('Document Name is required'),
  documentPurpose: Yup.string().required('Document Purpose is required'),
  file: Yup.mixed()
    .required('File is required')
    // .test('fileSize', 'File too large', (value) => !value || value.size <= 5 * 1024 * 1024)
    .test(
      'fileType',
      'Unsupported File Format',
      (value) => !value || ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type)
    )
});

export default function UploadDocuments({ onClose, open, targetEntityId, updateData, type }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();

  const apiUrl = () => {
    switch (type) {
      case 'grant':
        return grantManagementApi.uploadGrantDocuments;
      case 'contribution':
        return contributionApi.uploadInKindContributionDocuments;
      default:
        return null;
    }
  };
  const uploadApi = apiUrl();

  const { mutate, isLoading } = useMutation(uploadApi, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      onClose();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  return (
    <Dialog aria-label="Upload-documents" onClose={onClose} open={open} maxWidth={'sm'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Upload Documents
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={{
          documentName: updateData?.documentName || '',
          documentPurpose: updateData?.documentPurpose || '',
          file: updateData?.fileName || null,
          id: updateData?.id || null
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append('documentName', values.documentName);
          formData.append('documentPurpose', values.documentPurpose);
          if (values.file instanceof File) {
            formData.append('file', values.file);
          }
          if (updateData?.id) {
            formData.append('id', updateData?.id);
          }
          mutate({ payload: formData, entityId: targetEntityId });
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, values, setFieldValue, setFieldTouched, dirty }) => {
          return (
            <Form id="uploadDocumentsForm">
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={6}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="documentName"
                        variant="standard"
                        label={
                          <>
                            Document Name{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('documentName')}
                        error={touched.documentName && !!errors.documentName}
                        helperText={touched.documentName && errors.documentName}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="documentPurpose"
                        variant="standard"
                        label={
                          <>
                            Purpose of the document{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('documentPurpose')}
                        error={touched.documentPurpose && !!errors.documentPurpose}
                        helperText={touched.documentPurpose && errors.documentPurpose}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
                      <FileUpload
                        name={'file'}
                        buttonText={values.file ? 'Update File' : 'Upload File *'}
                        onChange={(event) => {
                          const file = event.target.files[0];
                          setFieldValue('file', file);
                          setFieldTouched('file', true, false);
                        }}
                        disabled={isLoading}
                        size="small"
                      />

                      {values?.file && (
                        <Box>
                          <Typography component="div" variant="body2" color="text.secondarydark">
                            <Box component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                              {typeof values.file === 'string' ? values.file : values.file?.name}
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setFieldValue('file', null);
                                setFieldTouched('file', true, false);
                              }}
                            >
                              <DeleteIconRed />
                            </IconButton>
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                    {touched.file && errors.file && (
                      <Box sx={{ color: 'error.main', mt: 1, fontSize: '12px' }}>{errors.file}</Box>
                    )}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button variant="outlinedWhite" onClick={onClose}>
                  Cancel
                </Button>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  form="uploadDocumentsForm" // The form to be submitted
                  onClick={handleSubmit}
                  loading={isLoading}
                  disabled={!dirty}
                >
                  Submit
                </LoadingButton>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
