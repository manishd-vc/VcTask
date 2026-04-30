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
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as beneficiaryApi from 'src/services/beneficiary';
import * as grantManagementApi from 'src/services/grantManagement';
import * as partnershipApi from 'src/services/partner';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { dateWithTime } from 'src/utils/formatTime';
import * as Yup from 'yup';
import DatePickers from '../datePicker';
import FieldWithSkeleton from '../FieldWithSkeleton';
import FileUpload from '../fileUpload';
import { CloseIcon, DeleteIconRed } from '../icons';
import TextFieldSelect from '../TextFieldSelect';
import ModalStyle from './dialog.style';

UploadDocuments.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  targetEntityId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default function UploadDocuments({ onClose, open, targetEntityId, updateData, type }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const documentTypes = getLabelObject(masterData, 'dpwf_contribution_type_of_document');

  // Get validation data from master data
  const validationFiles = getLabelObject(masterData, 'dpw_foundation_configuration');
  const maxFileSize = parseInt(validationFiles?.values?.find((item) => item.code === 'fileSize')?.label || '10485760');
  const allowedFileTypes = validationFiles?.values?.find((item) => item.code === 'fileType')?.label?.split(',') || [];

  const validationSchema = Yup.object().shape({
    documentName: Yup.string()
      .required('Document Name is required')
      .matches(/^[a-zA-Z0-9\s]*$/, 'Document Name must contain only alphanumeric characters')
      .max(255, 'Document Name must not exceed 255 characters'),
    documentPurpose:
      type === 'inKindAgreement'
        ? Yup.string()
            .matches(/^[a-zA-Z0-9\s]*$/, 'Purpose of the Document must contain only alphanumeric characters')
            .max(255, 'Purpose of the Document must not exceed 255 characters')
        : Yup.string()
            .required('Purpose of the Document is required')
            .matches(/^[a-zA-Z0-9\s]*$/, 'Purpose of the Document must contain only alphanumeric characters')
            .max(255, 'Purpose of the Document must not exceed 255 characters'),
    documentNumber:
      type === 'partnership'
        ? Yup.string()
            .required('Document Number is required')
            .max(255, 'Document Number must not exceed 255 characters')
        : Yup.string().notRequired(),
    documentValidity:
      type === 'partnership'
        ? Yup.date().nullable().required('Document Validity is required')
        : Yup.date().nullable().notRequired(),
    file: Yup.mixed()
      .required('File is required')
      .test('fileSize', `File too large. Maximum size is ${Math.round(maxFileSize / (1024 * 1024))}MB`, (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= maxFileSize;
      })
      .test('fileType', 'Unsupported File Format', (value) => {
        if (!value || typeof value === 'string') return true;
        return allowedFileTypes.includes(value.type);
      }),
    validFrom: Yup.date()
      .nullable()
      .when('type', {
        is: 'inKindAgreement',
        then: (schema) => schema.required('Valid From Date is required'),
        otherwise: (schema) => schema.notRequired()
      }),

    validTill: Yup.date()
      .nullable()
      .when('type', {
        is: 'inKindAgreement',
        then: (schema) => schema.required('Valid To Date is required'),
        otherwise: (schema) => schema.notRequired()
      })
  });

  const getHelperText = (fieldName, limit, touched, errors, values) => {
    const fieldValue = values?.[fieldName] || '';
    if (fieldValue.length > limit) {
      return `Character limit exceeded (${limit} characters maximum)`;
    }
    return (touched[fieldName] && errors[fieldName]) || '';
  };

  const apiUrl = () => {
    switch (type) {
      case 'grant':
        return grantManagementApi.uploadGrantDocuments;
      case 'partnership':
        return partnershipApi.uploadPartnershipDocuments;
      case 'beneficiary':
      case 'inKindAgreement':
        return beneficiaryApi.uploadInKindBeneficiaryDocuments;
      default:
        return api.uploadNewDocuments;
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
          documentNumber: updateData?.documentNumber || '',
          documentValidity: updateData?.documentValidity || null,
          file: updateData?.fileName || null,
          id: updateData?.id || null,
          validFrom: updateData?.validFrom || null,
          validTill: updateData?.validTill || null
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append('documentName', values.documentName);
          if (type !== 'inKindAgreement') {
            formData.append('documentPurpose', values.documentPurpose);
          }
          if (type === 'inKindAgreement') {
            formData.append('validFrom', values.validFrom);
            formData.append('validTill', values.validTill);
            formData.append('type', 'AGREEMENT');
          }
          if (type === 'partnership') {
            console.log(values.documentValidity);
            formData.append('documentNumber', values.documentNumber);
            formData.append('documentValidity', values.documentValidity);
          }
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
                  {type === 'inKindAgreement' ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                          <TextFieldSelect
                            id="documentName"
                            label={
                              <>
                                Type of Document{' '}
                                <Box component="span" sx={{ color: 'error.main' }}>
                                  *
                                </Box>
                              </>
                            }
                            getFieldProps={getFieldProps}
                            itemsData={documentTypes?.values}
                            value={values?.documentName}
                            onChange={(e) => setFieldValue('documentName', e.target.value)}
                            error={touched.documentName && !!errors.documentName}
                            helperText={touched.documentName && errors.documentName}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                          <DatePickers
                            label={
                              <>
                                Valid From Date{' '}
                                <Box component="span" sx={{ color: 'error.main' }}>
                                  *
                                </Box>
                              </>
                            }
                            inputFormat="yyyy-MM-dd HH:mm"
                            handleClear={() => setFieldValue('validFrom', null)}
                            onChange={(value) => setFieldValue('validFrom', value ? format(value, 'yyyy-MM-dd') : null)}
                            value={values.validFrom}
                            type="date"
                            minDate={new Date()}
                            error={touched.validFrom && !!errors.validFrom}
                            helperText={touched.validFrom && errors.validFrom}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                          <DatePickers
                            label={
                              <>
                                Valid To Date{' '}
                                <Box component="span" sx={{ color: 'error.main' }}>
                                  *
                                </Box>
                              </>
                            }
                            inputFormat={'yyyy-MM-dd'}
                            onChange={(value) => setFieldValue('validTill', value ? format(value, 'yyyy-MM-dd') : null)}
                            value={values.validTill}
                            handleClear={() => {
                              setFieldValue('validTill', null);
                            }}
                            minDate={values.validFrom}
                            error={touched.validTill && !!errors.validTill}
                            helperText={touched.validTill && errors.validTill}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                    </>
                  ) : (
                    <>
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
                            error={
                              (touched.documentName && !!errors.documentName) || values?.documentName?.length > 255
                            }
                            helperText={getHelperText('documentName', 255, touched, errors, values)}
                            onChange={(e) => setFieldValue('documentName', e.target.value)}
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
                            error={
                              (touched.documentPurpose && !!errors.documentPurpose) ||
                              values?.documentPurpose?.length > 255
                            }
                            helperText={getHelperText('documentPurpose', 255, touched, errors, values)}
                            onChange={(e) => setFieldValue('documentPurpose', e.target.value)}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      {type === 'partnership' && (
                        <>
                          <Grid item xs={12} md={6} lg={6}>
                            <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                              <TextField
                                id="documentNumber"
                                variant="standard"
                                label={
                                  <>
                                    Document Number{' '}
                                    <Box component="span" sx={{ color: 'error.main' }}>
                                      *
                                    </Box>
                                  </>
                                }
                                fullWidth
                                value={values.documentNumber || ''}
                                name="documentNumber"
                                error={
                                  (touched.documentNumber && !!errors.documentNumber) ||
                                  values?.documentNumber?.length > 255
                                }
                                helperText={getHelperText('documentNumber', 255, touched, errors, values)}
                                onChange={(e) => setFieldValue('documentNumber', e.target.value)}
                              />
                            </FieldWithSkeleton>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                              <DatePickers
                                label={
                                  <>
                                    Document Validity{' '}
                                    <Box component="span" sx={{ color: 'error.main' }}>
                                      *
                                    </Box>
                                  </>
                                }
                                inputFormat="yyyy-MM-dd HH:mm:ss"
                                handleClear={() => setFieldValue('documentValidity', null)}
                                onChange={(value) => {
                                  setFieldValue(
                                    'documentValidity',
                                    value ? format(dateWithTime(value), "yyyy-MM-dd'T'HH:mm:ss") : null
                                  );
                                }}
                                value={values.documentValidity}
                                type="date"
                                minDate={new Date()}
                                error={touched.documentValidity && !!errors.documentValidity}
                                helperText={touched.documentValidity && errors.documentValidity}
                              />
                            </FieldWithSkeleton>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                  <Grid item xs={12}>
                    <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
                      <FileUpload
                        name={'file'}
                        buttonText={
                          <>
                            Upload File
                            <Box component="span" ml={1}>
                              *
                            </Box>
                          </>
                        }
                        typeOfAllowed="fileType"
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
                            <Tooltip title="Remove" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setFieldValue('file', null);
                                  setFieldTouched('file', true, false);
                                }}
                              >
                                <DeleteIconRed />
                              </IconButton>
                            </Tooltip>
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
                  form="uploadDocumentsForm"
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
