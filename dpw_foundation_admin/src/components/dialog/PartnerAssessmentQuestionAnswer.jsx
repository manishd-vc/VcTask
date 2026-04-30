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
import { useFormik } from 'formik';
import { useParams } from 'next/navigation';
import React from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerApi from 'src/services/partner';
import * as Yup from 'yup';
import FileUpload from '../fileUpload';
import { CloseIcon, DeleteIconRed } from '../icons';
import RenderQuestionTypes from '../RenderQuestionTypes';
import ModalStyle from './dialog.style';

export default function PartnerAssessmentQuestionAnswer({ open, onClose, refetch }) {
  const theme = useTheme();
  const { id } = useParams();
  const style = ModalStyle(theme);
  const { partnerAssessmentQuestions } = useSelector((state) => state?.partner);
  const dispatch = useDispatch();
  const [uploadingFiles, setUploadingFiles] = React.useState(new Set());
  const { mutate } = useMutation('uploadPartnerAssessmentQuestions', partnerApi.uploadPartnerAssessmentQuestions, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: deleteFile } = useMutation(
    'deletePartnerAssessmentQuestions',
    partnerApi.deletePartnerAssessmentQuestions,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const { mutate: answerPartnerAssessmentQuestions, isLoading: isAnswerPartnerAssessmentQuestionsLoading } =
    useMutation('answerPartnerAssessmentQuestions', partnerApi.answerPartnerAssessmentQuestions, {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        onClose();
        refetch();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    });

  const handleUploadFile = (file, questionId) => {
    const formData = new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    // Add to uploading set
    setUploadingFiles((prev) => new Set([...prev, questionId]));

    mutate(
      { entityId: id, payload: formData },
      {
        onSuccess: (response) => {
          formik.setFieldValue(questionId, response.data);
          formik.setFieldTouched(questionId, true, false);
          // Remove from uploading set
          setUploadingFiles((prev) => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
          });
        },
        onError: (error) => {
          dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
          // Remove from uploading set on error
          setUploadingFiles((prev) => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
          });
        }
      }
    );
  };

  const handleDeleteFile = (fileId, questionId) => {
    deleteFile(
      { entityId: id, fileId },
      {
        onSuccess: (response) => {
          dispatch(setToastMessage({ message: response.message, variant: 'success' }));
          formik.setFieldValue(questionId, null);
          formik.setFieldTouched(questionId, true, false);
          refetch();
        }
      }
    );
  };

  const initialValues = React.useMemo(() => {
    const values = partnerAssessmentQuestions?.questions?.reduce((acc, q) => {
      if (q.questionType.toUpperCase() === 'RADIO') {
        acc[q.id] = q.response || 'No'; // Default to "No"
      } else if (q.questionType.toUpperCase() === 'CHECKBOX') {
        acc[q.id] = q.response || []; // Default to empty array
      } else {
        acc[q.id] = q.response || '';
      }
      if (q?.secondAnswerType) {
        acc[`${q.id}_second`] = q.secondResponse || '';
      }
      return acc;
    }, {});

    values.assessmentFinding = partnerAssessmentQuestions?.assessmentFinding || '';
    values.assessmentConclusion = partnerAssessmentQuestions?.assessmentConclusion || '';

    return values;
  }, [partnerAssessmentQuestions]);

  const questionsValidation = partnerAssessmentQuestions?.questions?.reduce((acc, q) => {
    const type = q.questionType.toUpperCase();
    if (type === 'CHECKBOX') {
      acc[q.id] = Yup.array()
        .transform((value, originalValue) => {
          // Ensure it's always treated as an array
          if (typeof originalValue === 'string') {
            return originalValue
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean);
          }
          return Array.isArray(originalValue) ? originalValue : [];
        })
        .of(Yup.string())
        .min(1, 'At least one option must be selected')
        .required('Answer is required');
    } else if (q.questionType === 'freeText') {
      acc[q.id] = Yup.string().required('Answer is required');
    }

    // Validation for second response - conditional for RADIO type

    return acc;
  }, {});

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      ...questionsValidation,
      assessmentFinding: Yup.string().when([], {
        is: () => {
          const hasRadioNotNo = partnerAssessmentQuestions?.questions?.some(
            (q) => q.questionType.toUpperCase() === 'RADIO' && formik.values?.[q.id] !== 'No'
          );
          return hasRadioNotNo;
        },
        then: (schema) => schema.required('Assessment Finding is required'),
        otherwise: (schema) => schema
      }),
      assessmentConclusion: Yup.string().when([], {
        is: () => {
          const hasRadioNotNo = partnerAssessmentQuestions?.questions?.some(
            (q) => q.questionType.toUpperCase() === 'RADIO' && formik.values?.[q.id] !== 'No'
          );
          return hasRadioNotNo;
        },
        then: (schema) => schema.required('Assessment Conclusion is required'),
        otherwise: (schema) => schema
      })
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        entityId: id,
        assessmentFinding: values.assessmentFinding,
        assessmentConclusion: values.assessmentConclusion,
        questions: partnerAssessmentQuestions?.questions?.map((q) => {
          let responseValue = values[q.id];
          // For checkboxes, convert array to comma-separated string
          if (q.questionType.toUpperCase() === 'CHECKBOX' && Array.isArray(responseValue)) {
            responseValue = responseValue.join(',');
          }

          return {
            id: q.id,
            response: responseValue?.id || responseValue || responseValue,
            secondResponse: values[`${q.id}_second`]?.id || values[`${q.id}_second`] || q?.secondResponse,
            thirdResponse: values[`${q.id}_third`]?.id || values[`${q.id}_third`] || q?.thirdResponse
          };
        })
      };

      answerPartnerAssessmentQuestions({ entityId: id, payload });
    }
  });
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        Answer Assessment Questions
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            {partnerAssessmentQuestions?.questions?.map((q) => (
              <React.Fragment key={q.id}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Typography variant="body3" color="text.secondary" sx={{ mb: 1 }}>
                      {q.questionText}{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </Typography>
                    <RenderQuestionTypes
                      question={q}
                      formik={formik}
                      handleUploadFile={handleUploadFile}
                      handleDeleteFile={handleDeleteFile}
                      uploadingFiles={uploadingFiles}
                    />
                  </Stack>
                </Grid>

                {q?.secondAnswerType === 'freeText' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="standard"
                      name={`${q.id}_second`}
                      value={formik.values[`${q.id}_second`]}
                      onChange={formik.handleChange}
                      label={<>Second Response</>}
                      error={Boolean(formik.touched[`${q.id}_second`] && formik.errors[`${q.id}_second`])}
                      helperText={formik.touched[`${q.id}_second`] && formik.errors[`${q.id}_second`]}
                    />
                  </Grid>
                )}
                {(q?.thirdAnswerType === 'FILE' || q?.secondAnswerType === 'FILE') && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'inline-flex', gap: 2 }}>
                      <FileUpload
                        name={'file'}
                        buttonText={'Upload File'}
                        onChange={(event) => {
                          const file = event.target.files[0];
                          formik.setFieldValue(`${q.id}_second`, file);
                          handleUploadFile(file, `${q.id}_second`);
                        }}
                        disabled={uploadingFiles?.has(`${q.id}_second`) || false}
                        size="small"
                      />

                      {(q?.secondAnswerFileName ||
                        q?.thirdAnswerFileName ||
                        formik.values[`${q.id}_second`]?.fileName) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondarydark">
                            {q?.secondAnswerFileName ||
                              q?.thirdAnswerFileName ||
                              formik.values[`${q.id}_second`]?.fileName}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleDeleteFile(
                                q?.secondResponse || q?.thirdResponse || formik.values[`${q.id}_second`]?.id,
                                `${q.id}_second`
                              )
                            }
                          >
                            <DeleteIconRed />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                )}
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="standard"
                name="assessmentFinding"
                value={formik.values.assessmentFinding}
                onChange={formik.handleChange}
                label={
                  <>
                    Assessor's Finding{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                error={Boolean(formik.touched.assessmentFinding && formik.errors.assessmentFinding)}
                helperText={formik.touched.assessmentFinding && formik.errors.assessmentFinding}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="standard"
                name="assessmentConclusion"
                value={formik.values.assessmentConclusion}
                onChange={formik.handleChange}
                label={
                  <>
                    Assessor's Conclusion{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                error={Boolean(formik.touched.assessmentConclusion && formik.errors.assessmentConclusion)}
                helperText={formik.touched.assessmentConclusion && formik.errors.assessmentConclusion}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlinedWhite">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isAnswerPartnerAssessmentQuestionsLoading}>
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
