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
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { CloseIcon, DeleteIconRed } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as partnerManagementApi from 'src/services/partner';
import * as Yup from 'yup';
import FieldWithSkeleton from '../FieldWithSkeleton';
import FileUpload from '../fileUpload';
import ModalStyle from './dialog.style';

const validationSchema = Yup.object().shape({
  content: Yup.string().required('More Information Description is required')
});

export default function PartnerNeedMoreInfo({ open, onClose, stageType, data, backTo }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const [fileID, setFileID] = useState(null);
  const router = useRouter();
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

  const { mutate: deleteMediaMutation, isLoading: isDeleteLoading } = useMutation(
    'deleteMedia',
    partnerManagementApi.deletePartnerNeedMoreInfoDocuments,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        setFileID(null);
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const { mutate, isLoading, isSuccess } = useMutation(partnerManagementApi.uploadPartnerNeedMoreInfoDocuments, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'warning' }));
      setFileID(response?.data);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const downloadMediaFile = (event) => {
    event?.preventDefault();
    const payload = {
      ids: [fileID]
    };
    downloadAllDocuments(payload);
  };

  const { mutate: partnershipCommonStatusUpdate, isLoading: isPartnershipCommonStatusUpdateLoading } = useMutation(
    partnerManagementApi.partnershipCommonStatusUpdate,
    {
      onSuccess: async (response) => {
        router.push(backTo);
        onClose();
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  return (
    <Dialog aria-label="Upload-documents" onClose={onClose} open={open} maxWidth={'md'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Need More Information
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={{
          content: '',
          file: null
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const payload = {
            statusName: data?.status,
            status: 'need_more_info',
            content: values?.content
          };
          partnershipCommonStatusUpdate({ id: data?.id, payload });
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, values, setFieldValue, dirty }) => {
          return (
            <Form id="needMoreInfoForm">
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FieldWithSkeleton isLoading={false} error={touched && !!errors}>
                      <TextField
                        id="content"
                        variant="standard"
                        label={
                          <>
                            More Information Description{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        multiline
                        rows={3}
                        fullWidth
                        {...getFieldProps('content')}
                        error={touched.content && !!errors.content}
                        helperText={touched.content && errors.content}
                      />
                    </FieldWithSkeleton>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
                      <FileUpload
                        name={'file'}
                        buttonText={'Add Attachment'}
                        onChange={(event) => {
                          const file = event.target.files[0];
                          setFieldValue('file', file);
                          const formData = new FormData();
                          if (file instanceof File) {
                            formData.append('file', file);
                            formData.append('type', stageType);
                          }
                          mutate({ payload: formData, entityId: data?.id });
                        }}
                        disabled={isLoading}
                        size="small"
                      />
                      {values?.file && isSuccess && fileID && (
                        <Box>
                          <Typography component="div" variant="body2" color="text.secondarydark">
                            <Box
                              component="span"
                              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                              onClick={() => downloadMediaFile()}
                            >
                              {typeof values.file === 'string' ? values.file : values.file?.name}
                            </Box>
                            <Tooltip title="Remove" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (fileID) {
                                    deleteMediaMutation({ entityId: data?.id, docType: stageType });
                                  }
                                }}
                                disabled={isDeleteLoading}
                              >
                                <DeleteIconRed />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </Box>
                      )}
                    </Stack>
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
                  form="needMoreInfoForm"
                  onClick={handleSubmit}
                  loading={isPartnershipCommonStatusUpdateLoading}
                  disabled={!dirty}
                >
                  Send
                </LoadingButton>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
