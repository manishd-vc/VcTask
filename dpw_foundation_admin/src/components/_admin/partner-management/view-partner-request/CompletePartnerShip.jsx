'use client';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow, DeleteIconRed } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import RenderQuestionTypes from 'src/components/RenderQuestionTypes';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerApi from 'src/services/partner';
import CompleteOtherQuestion from './CompleteOtherQuestion';
import formConfig from './partnershipFormConfig.json';
export default function CompletePartnerShip({ isTerminate = false }) {
  const router = useRouter();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const partnerRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const dispatch = useDispatch();
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

  const { mutate: completeTerminatePartnership } = useMutation(
    'completeTerminatePartnership',
    partnerApi.completeTerminatePartnership,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        router.push(`/admin/partnership-request`);
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const {
    isLoading: isLoadingQuestions,
    data: questionsData,
    refetch: refetchQuestionsData
  } = useQuery(
    'getPartnerAssessmentQuestionsList',
    () => partnerApi.getPartnerAssessmentQuestionsList({ entityId: id }),
    {
      enabled: !!id
    }
  );

  const { mutate: partnerAssessmentQuestionCreate } = useMutation(
    'partnerAssessmentQuestionCreate',
    partnerApi.partnerAssessmentQuestionCreate,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        refetchQuestionsData();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  // Initialize form data dynamically from config
  const initializeFormData = () => {
    const initialData = {};
    formConfig.sections.forEach((section) => {
      section.questions.forEach((question) => {
        // Use defaultValue if provided, handle boolean false correctly
        if (question.defaultValue !== undefined && question.defaultValue !== null) {
          initialData[question.id] = question.defaultValue;
        } else {
          // For radio buttons, default to empty string if no default provided
          initialData[question.id] = question.type === 'radio' ? false : '';
        }
      });
    });
    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData());
  const [uploadingButtons, setUploadingButtons] = useState(new Set());

  // Helper function to reset dependent fields based on showWhen conditions
  const resetDependentFields = (formData, triggerField) => {
    const updatedFormData = { ...formData };

    formConfig.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.showWhen?.field === triggerField) {
          // If the new value doesn't match the showWhen condition, reset the dependent field
          if (updatedFormData[triggerField] !== question.showWhen.value) {
            updatedFormData[question.id] = '';
          }
        }
      });
    });

    return updatedFormData;
  };

  // Helper function to clean up attachment fields for buttons with showWhen conditions
  const cleanupAttachmentFields = (formData, triggerField) => {
    const updatedFormData = { ...formData };

    formConfig.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.hasButton?.showWhen?.field === triggerField) {
          // Clean up attachment-related fields if they exist
          if (updatedFormData[`${triggerField}_attachmentId`] !== undefined) {
            delete updatedFormData[`${triggerField}_attachmentId`];
          }
          if (updatedFormData[`${triggerField}_attachment`] !== undefined) {
            delete updatedFormData[`${triggerField}_attachment`];
          }
        }
      });
    });

    return updatedFormData;
  };

  const handleRadioChange = (field) => (event) => {
    const booleanValue = event.target.value === 'true';

    setFormData((prev) => {
      let newFormData = {
        ...prev,
        [field]: booleanValue
      };

      // Reset dependent fields and clean up attachments
      newFormData = resetDependentFields(newFormData, field);
      newFormData = cleanupAttachmentFields(newFormData, field);

      return newFormData;
    });
  };

  const handleTextChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleDeleteFile = (fileId, questionId) => {
    // Set loading state for this specific button during delete
    setUploadingButtons((prev) => new Set(prev).add(questionId));

    deleteFile(
      { entityId: id, fileId },
      {
        onSuccess: (response) => {
          dispatch(setToastMessage({ message: response.message, variant: 'success' }));
          setFormData((prev) => ({
            ...prev,
            [`${questionId}_attachmentId`]: null,
            [`${questionId}_attachment`]: null
          }));

          // Clear loading state
          setUploadingButtons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
          });
        },
        onError: (error) => {
          // Clear loading state on error
          setUploadingButtons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
          });
        }
      }
    );
  };

  // Handle additional questions from CompleteOtherQuestion component
  const handleAdditionalQuestions = (questions) => {
    partnerAssessmentQuestionCreate({ entityId: id, payload: questions });
    setOpen(false); // Close the dialog after adding questions
  };

  // File upload handler for additional questions
  const handleUploadFile = (file, questionId) => {
    const formDataPayload = new FormData();
    formDataPayload.append('file', file);

    const uploadParams = {
      entityId: id,
      payload: formDataPayload
    };

    setUploadingButtons((prev) => new Set(prev).add(questionId));

    mutate(uploadParams, {
      onSuccess: (response) => {
        if (response?.data) {
          setFormData((prev) => ({
            ...prev,
            [questionId]: response.data
          }));
          setFile(file);
        }
        setUploadingButtons((prev) => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
      },
      onError: () => {
        setUploadingButtons((prev) => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
      }
    });
  };

  // File delete handler for additional questions
  const handleDeleteFileForAdditional = (fileId, questionId) => {
    setUploadingButtons((prev) => new Set(prev).add(questionId));

    deleteFile(
      { entityId: id, fileId },
      {
        onSuccess: () => {
          setFormData((prev) => ({
            ...prev,
            [questionId]: null
          }));
          setFile(null);
          setUploadingButtons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
          });
        },
        onError: () => {
          setUploadingButtons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
          });
        }
      }
    );
  };

  const handleSubmit = () => {
    // Extract additional question keys to exclude them from cleanFormData
    const additionalQuestionKeys = (questionsData?.questions || []).map((_, index) => `additional_${index}`);

    // Create clean submission data, excluding attachment objects, internal IDs, and additional question keys
    const {
      // Remove attachment objects
      finalReviewMeetingConducted_attachment,
      performanceReviewConducted_attachment,
      partnerFeedbackCollected_attachment,
      // Remove internal attachment ID fields
      finalReviewMeetingConducted_attachmentId,
      performanceReviewConducted_attachmentId,
      partnerFeedbackCollected_attachmentId,
      // Remove additional question keys
      ...tempFormData
    } = formData;

    // Filter out any additional question keys that might remain
    const cleanFormData = Object.keys(tempFormData).reduce((acc, key) => {
      if (!additionalQuestionKeys.includes(key)) {
        acc[key] = tempFormData[key];
      }
      return acc;
    }, {});

    // Merge additional questions with their responses into single objects
    const questionsWithResponses = questionsData?.questions?.map((question, index) => {
      const answerKey = `additional_${index}`;

      let responseValue = formData[answerKey] || null;
      if (question.questionType === 'CHECKBOX' && Array.isArray(responseValue)) {
        responseValue = responseValue.join(',');
      }

      return {
        ...question,
        response: responseValue?.id || responseValue
      };
    });

    // Prepare clean submission data with only necessary attachment IDs
    const submissionData = {
      ...cleanFormData,
      status: isTerminate ? 'TERMINATE' : 'COMPLETE',
      partnershipId: id,
      momAttachmentId: formData.finalReviewMeetingConducted_attachmentId?.id || null,
      scoringSheetAttachmentId: formData.performanceReviewConducted_attachmentId?.id || null,
      feedbackAttachmentId: formData.partnerFeedbackCollected_attachmentId?.id || null,
      // Include only questions array with responses included
      questions: questionsWithResponses || []
    };
    completeTerminatePartnership({ entityId: id, payload: submissionData });

    // Here you would call your final submission API
    // submitPartnershipCompletion(submissionData);
  };

  // Handle button clicks with button ID for API calls
  const handleButtonClick = (buttonConfig, questionId) => {
    const { id: buttonId } = buttonConfig;

    // Handle different button types
    switch (buttonId) {
      case 'momAttachmentId':
        // Handle MOM attachment
        handleAttachment(buttonId, questionId, 'mom');
        break;
      case 'scoringSheetAttachmentId':
        // Handle performance review attachment
        handleAttachment(buttonId, questionId, 'performance_review');
        break;
      case 'feedbackAttachmentId':
        // Handle feedback attachment
        handleAttachment(buttonId, questionId, 'feedback');
        break;
      default:
        break;
    }
  };

  // Handle attachment upload/selection
  const handleAttachment = (buttonId, questionId, type) => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg';

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Prepare FormData payload for upload
        const formDataPayload = new FormData();
        formDataPayload.append('file', file);

        const uploadParams = {
          entityId: id,
          payload: formDataPayload
        };

        // Set loading state for this specific button
        setUploadingButtons((prev) => new Set(prev).add(questionId));

        // Upload using mutation
        mutate(uploadParams, {
          onSuccess: (response) => {
            // Handle response with document ID
            if (response?.data) {
              // Update form data with document ID
              setFormData((prev) => ({
                ...prev,
                [`${questionId}_attachmentId`]: response.data,
                [`${questionId}_attachment`]: {
                  id: response.data,
                  fileName: file.name,
                  uploadedAt: new Date().toISOString(),
                  buttonId: buttonId,
                  url: response.data
                }
              }));

              // Show success message
              dispatch(
                setToastMessage({
                  message: `${file.name} uploaded successfully!`,
                  variant: 'success'
                })
              );
            }

            // Clear loading state for this button
            setUploadingButtons((prev) => {
              const newSet = new Set(prev);
              newSet.delete(questionId);
              return newSet;
            });
          },
          onError: (error) => {
            // Show error message
            dispatch(
              setToastMessage({
                message: `Failed to upload ${file.name}. Please try again.`,
                variant: 'error'
              })
            );

            // Clear loading state for this button
            setUploadingButtons((prev) => {
              const newSet = new Set(prev);
              newSet.delete(questionId);
              return newSet;
            });
          }
        });
      }
    };

    fileInput.click();
  };

  // Check if question should be visible based on showWhen condition
  const shouldShowQuestion = (question) => {
    if (!question.showWhen) return true;

    const { field, value } = question.showWhen;
    return formData[field] === value;
  };

  // Check if button should be visible based on showWhen condition
  const shouldShowButton = (hasButton) => {
    if (!hasButton?.showWhen) return true;

    const { field, value } = hasButton.showWhen;
    return formData[field] === value;
  };

  // Render question based on type
  const renderQuestion = (question) => {
    const { id, type, question: questionText, options, placeholder, hasButton } = question;

    // Check if question should be visible
    if (!shouldShowQuestion(question)) {
      return null;
    }

    return (
      <Grid item xs={12} key={id}>
        <Typography component="h3" variant="body3" color="text.secondary" sx={{ mb: 1 }}>
          {questionText}
        </Typography>
        {type === 'radio' && (
          <FormControl component="fieldset">
            <RadioGroup row value={String(formData[id] ?? '')} onChange={handleRadioChange(id)}>
              {options.map((option) => (
                <FormControlLabel
                  key={String(option.value)}
                  value={String(option.value)}
                  control={<Radio />}
                  label={option.label}
                  sx={{ mr: 3 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}

        {type === 'textarea' && (
          <TextField
            fullWidth
            multiline
            variant="standard"
            value={formData[id]}
            onChange={handleTextChange(id)}
            label={placeholder || 'Details'}
          />
        )}

        {hasButton && shouldShowButton(hasButton) && (
          <Stack flexDirection="row" alignItems="center" gap={1} sx={{ mt: 2 }}>
            <Button
              variant={hasButton.variant}
              color={hasButton.color}
              size={hasButton.size}
              onClick={() => handleButtonClick(hasButton, id)}
              sx={{ mt: 1 }}
              disabled={uploadingButtons.has(id)}
              startIcon={uploadingButtons.has(id) ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {uploadingButtons.has(id) ? 'Uploading...' : hasButton.text}
            </Button>

            {/* Show uploaded file info */}
            {formData[`${id}_attachment`] && (
              <>
                <Typography component="div" variant="body2" color="text.secondarydark">
                  <Box component="span">{formData[`${id}_attachment`].fileName}</Box>
                </Typography>

                <IconButton
                  onClick={() => handleDeleteFile(formData[`${id}_attachment`].id, id)}
                  disabled={uploadingButtons.has(id)}
                  sx={{
                    opacity: uploadingButtons.has(id) ? 0.6 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  {uploadingButtons.has(id) ? <CircularProgress size={20} color="error" /> : <DeleteIconRed />}
                </IconButton>
              </>
            )}
          </Stack>
        )}
      </Grid>
    );
  };

  // Render section
  const renderSection = (section) => {
    const { id, title, questions, hasAddButton } = section;

    // Filter questions that should be visible
    const visibleQuestions = questions.filter(shouldShowQuestion);

    return (
      <Box key={id}>
        {title && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: 'primary.main',
                textTransform: 'uppercase'
              }}
            >
              {title}
            </Typography>
          </>
        )}

        <Grid container spacing={3}>
          {visibleQuestions.map(renderQuestion)}
          {hasAddButton && (
            <Grid item xs={12}>
              <Button
                variant={hasAddButton.variant}
                color={hasAddButton.color}
                size={hasAddButton.size}
                sx={hasAddButton.sx}
              >
                {hasAddButton.text}
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  // Create formik-like adapter for RenderQuestionTypes
  const createFormikAdapter = (questionIndex) => {
    const fieldId = `additional_${questionIndex}`;

    return {
      values: {
        [fieldId]: formData[fieldId] || (questionsData?.questions[questionIndex]?.questionType === 'CHECKBOX' ? [] : '')
      },
      setFieldValue: (field, value) => {
        setFormData((prev) => ({
          ...prev,
          [field]: value
        }));
      },
      handleChange: (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value
        }));
      },
      touched: {},
      errors: {}
    };
  };

  // Render additional questions section
  const renderAdditionalQuestions = () => {
    if (questionsData?.questions?.length === 0) {
      return null;
    }

    return (
      <Box key="additional-questions" sx={{ mt: '2 !important' }}>
        <Grid container spacing={3}>
          {questionsData?.questions?.map((question, index) => {
            // Create a modified question object with the correct id for form handling
            const modifiedQuestion = {
              ...question,
              id: `additional_${index}`
            };

            const formikAdapter = createFormikAdapter(index);

            return (
              <Grid item xs={12} key={`additional-${question.id}`}>
                <Typography component="h3" variant="body3" color="text.secondary" sx={{ mb: 1 }}>
                  {question.questionText}{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </Typography>
                <RenderQuestionTypes
                  question={modifiedQuestion}
                  formik={formikAdapter}
                  file={file}
                  handleUploadFile={(file, questionId) => handleUploadFile(file, questionId)}
                  handleDeleteFile={(fileId, questionId) => handleDeleteFileForAdditional(fileId, questionId)}
                  uploadingFiles={uploadingButtons}
                  isLoading={uploadingButtons.has(`additional_${index}`)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };
  if (isLoadingQuestions) {
    return <LoadingFallback />;
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
        <Stack
          justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          flexDirection="row"
          gap={2}
          flexWrap="wrap"
          alignItems={'center'}
        >
          <Button variant="outlined" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 5 }}>
        {isTerminate ? 'TERMINATE Partnership Request' : 'Complete Partnership Request' || formConfig.formTitle} -{' '}
        {partnerRequestData?.partnershipUniqueId}
      </Typography>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Stack spacing={4}>
          {formConfig.sections.map(renderSection)}
          {renderAdditionalQuestions()}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
              other questions
            </Typography>
            {questionsData?.questions?.length > 0 && (
              <Typography variant="body2" color="success.main" sx={{ fontStyle: 'italic' }}>
                ({questionsData?.questions?.length} Question Added)
              </Typography>
            )}
          </Box>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} size="small">
            {questionsData?.questions?.length > 0 ? 'Add More Questions' : 'Add Question'}
          </Button>
        </Box>
      </Paper>
      <CompleteOtherQuestion
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAdditionalQuestions}
        existingQuestions={questionsData?.questions || []}
        refetchQuestionsData={refetchQuestionsData}
      />
    </>
  );
}
