import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { FieldArray, Form, Formik } from 'formik';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon, DeleteIconRed, DropDownArrow } from 'src/components/icons';
import { setSubmittedAssessment, setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as Yup from 'yup';
import StepperStyle from '../campaign/steps/stepper.styles';

const style = {
  closeModal: {
    position: 'absolute',
    right: 8,
    top: 8,
    color: (theme) => theme.palette.grey[500]
  },
  deleteIcon: {
    display: 'flex',
    alignItems: 'center',
    height: '100%'
  },
  moreBox: {
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16
  }
};

export default function AssessmentDialog({ open, handleClose, QuestionData, donorDataRefetch }) {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = StepperStyle(theme);
  const questionDetails = useSelector((state) => state.common.submittedAssessment);
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const { masterData } = useSelector((state) => state?.common);
  const qType = getLabelObject(masterData, 'dpw_foundation_question_type');
  const validTypes = qType?.values?.map((v) => v.code.toUpperCase()) || [];

  const validationSchema = Yup.object().shape({
    assessmentQuestions: Yup.array().of(
      Yup.object().shape({
        questionText: Yup.string().required('Question text is required'),
        questionType: Yup.string().oneOf(validTypes, 'Invalid question type').required('Question type is required'),
        options: Yup.mixed().when('questionType', {
          is: (val) => ['RADIO', 'MULTISELECT', 'DROPDOWN', 'CHECKBOX'].includes((val || '').toUpperCase()),
          then: () =>
            Yup.array()
              .of(
                Yup.object().shape({
                  optionText: Yup.string().required('Option text is required')
                })
              )
              .min(1, 'At least one option is required'),
          otherwise: () =>
            Yup.array().of(
              Yup.object().shape({
                optionText: Yup.string()
              })
            )
        })
      })
    ),
    selectedQuestions: Yup.array().of(Yup.number()).nullable()
  });
  const hasExistingQuestions =
    getDonorAdminData?.questionDetailsListResponse?.questions?.length > 0 || questionDetails?.questions?.length > 0;

  const accordionHandler = (event, isExpanded) => {
    setExpanded(isExpanded);
  };
  const { mutate } = useMutation('submitQuestions', api.submitQuestions, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      dispatch(setSubmittedAssessment(data?.data));
      handleClose();
      donorDataRefetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const handleCreate = (values) => {
    const payload = {
      entityId: getDonorAdminData?.donorPledgeResponse?.id, // Replace with actual entity ID
      questions: [
        ...values.selectedQuestions.map((index, i) => {
          const question = QuestionData[index];

          return {
            questionText: question.questionText,
            questionType: question.questionType.toUpperCase(), // Ensure it's MULTISELECT, RADIO etc.
            queReference: question.queReference,
            sequence: i,
            options:
              question.options?.map((opt) => ({
                optionText: opt.optionText
              })) || [],
            response: null
          };
        }),

        ...values.assessmentQuestions.map((assessmentQuestions, i) => ({
          questionText: assessmentQuestions.questionText,
          questionType: assessmentQuestions.questionType.toUpperCase(),
          sequence: values.assessmentQuestions.length + i, // continue sequence
          queReference: null,
          options:
            assessmentQuestions.options?.map((opt) => ({
              optionText: opt.optionText
            })) || [],
          response: null
        }))
      ]
    };
    mutate({ payload });
  };
  const selectedQuestionsFromStore = [];
  const assessmentQuestionsFromStore = [];

  const sourceQuestions =
    getDonorAdminData?.questionDetailsListResponse?.questions?.length > 0
      ? getDonorAdminData.questionDetailsListResponse.questions
      : questionDetails?.questions || [];

  sourceQuestions.forEach((q) => {
    let index = -1;

    if (getDonorAdminData?.questionDetailsListResponse?.questions?.length > 0) {
      // Match by id if questions exist in getDonorAdminData
      index = QuestionData.findIndex((item) => item.queReference === q.queReference);
    } else {
      // Otherwise match by questionText + questionType (case insensitive)
      index = QuestionData.findIndex(
        (item) =>
          item.questionText === q.questionText && item.questionType.toLowerCase() === q.questionType.toLowerCase()
      );
    }

    if (index !== -1) {
      selectedQuestionsFromStore.push(index);
    } else {
      assessmentQuestionsFromStore.push({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options || []
      });
    }
  });
  const handleOptions = (newValue, values, index, setFieldValue) => {
    const formatted = (newValue || []).map((opt) => (typeof opt === 'string' ? opt : opt.optionText));

    const cleanedFormatted = formatted.map((opt) => opt.trim());

    // Check for badly formatted values (trailing or extra spaces)
    const hasInvalidSpace = cleanedFormatted.some((opt) => /\s{2,}/.test(opt) || opt !== opt.trim());

    if (hasInvalidSpace) {
      dispatch(
        setToastMessage({
          message: 'Options should not contain trailing or extra spaces (e.g., "dog  " is invalid)',
          variant: 'error'
        })
      );
      return;
    }

    const lowerFormatted = cleanedFormatted.map((opt) => opt.toLowerCase());

    // Check internal duplicates
    const hasInternalConflict = lowerFormatted.some(
      (opt, i) => lowerFormatted.findIndex((o, j) => o === opt && i !== j) !== -1
    );

    if (hasInternalConflict) {
      dispatch(
        setToastMessage({
          message: 'Duplicate options are not allowed.',
          variant: 'error'
        })
      );
      return;
    }

    const structuredOptions = cleanedFormatted.map((opt) => ({ optionText: opt }));
    setFieldValue(`assessmentQuestions[${index}].options`, structuredOptions);
  };

  const initialValues = {
    customQuestions: [],
    assessmentQuestions: assessmentQuestionsFromStore || [],
    selectedQuestions: selectedQuestionsFromStore || []
  };

  const handleQuestionTypeChange = (e, index, setFieldValue) => {
    const selectedType = e.target.value;
    setFieldValue(`assessmentQuestions[${index}].questionType`, selectedType);
    setFieldValue(`assessmentQuestions[${index}].options`, []);
  };
  const handleQuestionToggle = (index, selectedQuestions, setFieldValue) => {
    const isSelected = selectedQuestions.includes(index);
    const updated = isSelected ? selectedQuestions.filter((i) => i !== index) : [...selectedQuestions, index];
    setFieldValue('selectedQuestions', updated);
  };

  const submitButtonLabel = hasExistingQuestions ? 'Update' : 'Create';
  const formatQuestionType = (type) => {
    if (type === 'radio') return 'Radio Button';
    if (type === 'textArea') return 'Text Box';
    return type;
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={(values) => {
          handleCreate(values);
        }}
      >
        {({ values, dirty, setFieldValue, handleChange, handleBlur, touched, errors }) => (
          <Form>
            <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main" mb={0}>
              Assessment Questions
            </DialogTitle>
            <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <Accordion expanded={expanded} onChange={accordionHandler}>
                <AccordionSummary expandIcon={<DropDownArrow />} sx={{ px: 0 }}>
                  <Typography variant="subtitle5" color="primary.main" textTransform="uppercase">
                    Choose Questions to add in assessment
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <FormGroup sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column', gap: 2 }}>
                    {QuestionData.map((question, index) => (
                      <FormControlLabel
                        key={question.queReference}
                        control={
                          <Checkbox
                            checked={values.selectedQuestions.includes(index)}
                            onChange={() => handleQuestionToggle(index, values.selectedQuestions, setFieldValue)}
                          />
                        }
                        label={
                          <Typography component="div" variant="body1" color="text.secondarydark">
                            {question.questionText} &nbsp;
                            <Typography component="span" variant="subtitle1" mb={3}>
                              Answer Type:&nbsp;
                            </Typography>
                            {question.options?.length > 0 && (
                              <>
                                {question.options.map((opt, index) => (
                                  <Typography key={opt.optionText} variant="subtitle1" component="span">
                                    {opt.optionText} {index !== question.options.length - 1 && ' / '}
                                  </Typography>
                                ))}
                              </>
                            )}
                            <Typography component="span" variant="subtitle1" mb={3} textTransform="capitalize">
                              {`(${formatQuestionType(question.questionType)})`}
                            </Typography>
                          </Typography>
                        }
                      />
                    ))}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              <Typography variant="subtitle5" color="primary.main" textTransform="uppercase" component="h6" py={1.5}>
                Selected Questions
              </Typography>
              <Divider />

              {values.selectedQuestions.length === 0 ? (
                <Typography variant="body1" color="text.secondary" my={2}>
                  No questions selected
                </Typography>
              ) : (
                values.selectedQuestions.map((index, selectedIndex) => {
                  const question = QuestionData[index];
                  return (
                    <Typography key={index} variant="body1" component="div" color="text.secondarydark" my={2}>
                      {selectedIndex + 1}. {question.questionText}{' '}
                      <Typography component="span" variant="subtitle1">
                        Answer Type: {formatQuestionType(question.questionType)}
                      </Typography>
                      {question.options?.length > 0 && (
                        <>
                          {question.options.map((opt, index) => (
                            <Typography key={opt.optionText} variant="subtitle1" component="span">
                              {opt.optionText} {index !== question.options.length - 1 && ' / '}
                            </Typography>
                          ))}
                        </>
                      )}
                      <Typography component="span" variant="subtitle1" mb={3} textTransform="capitalize">
                        {`(${formatQuestionType(question.questionType)})`}
                      </Typography>
                    </Typography>
                  );
                })
              )}

              <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle5" color="primary.main" textTransform="uppercase" component="h6" mb={1}>
                  Other Questions
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setFieldValue('assessmentQuestions', [
                      ...values.assessmentQuestions,
                      {
                        questionText: '',
                        questionType: '',
                        options: []
                      }
                    ]);
                  }}
                  sx={{ mb: 1 }}
                  size="small"
                >
                  Add Question
                </Button>
              </Stack>

              <Divider />

              <FieldArray name="assessmentQuestions">
                {({ remove }) => (
                  <>
                    {values.assessmentQuestions.map((question, index) => (
                      <Box sx={{ ...styles.moreBox, pb: 2 }} key={question.questionTextx}>
                        {/* <Grid sx={{ ...styles.moreBox, mt: 2 }} container rowSpacing={2} gap={1}> */}
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              select
                              fullWidth
                              variant="standard"
                              name={`assessmentQuestions[${index}].questionType`}
                              value={question.questionType}
                              onChange={(e) => handleQuestionTypeChange(e, index, setFieldValue)}
                              onBlur={handleBlur}
                              error={
                                touched.assessmentQuestions?.[index]?.questionType &&
                                !!errors.assessmentQuestions?.[index]?.questionType
                              }
                              helperText={
                                touched.assessmentQuestions?.[index]?.questionType &&
                                errors.assessmentQuestions?.[index]?.questionType
                              }
                              label={
                                <>
                                  Question Type{' '}
                                  <Box component="span" sx={{ color: 'error.main' }}>
                                    *
                                  </Box>
                                </>
                              }
                            >
                              {qType?.values?.map((item) => (
                                <MenuItem key={item.code.toUpperCase()} value={item.code.toUpperCase()}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={12} md={8}>
                            <TextField
                              fullWidth
                              variant="standard"
                              name={`assessmentQuestions[${index}].questionText`}
                              value={question.questionText}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.assessmentQuestions?.[index]?.questionText &&
                                !!errors.assessmentQuestions?.[index]?.questionText
                              }
                              helperText={
                                touched.assessmentQuestions?.[index]?.questionText &&
                                errors.assessmentQuestions?.[index]?.questionText
                              }
                              label={
                                <>
                                  Question Text{' '}
                                  <Box component="span" sx={{ color: 'error.main' }}>
                                    *
                                  </Box>
                                </>
                              }
                            />
                          </Grid>
                          {question.questionType &&
                            ['RADIO', 'DROPDOWN', 'MULTISELECT', 'CHECKBOX'].includes(question.questionType) && (
                              <Grid item xs={12} md={12}>
                                <Autocomplete
                                  multiple
                                  freeSolo
                                  fullWidth
                                  options={[]}
                                  value={question.options?.map((opt) => opt.optionText) || []}
                                  onChange={(event, newValue) => handleOptions(newValue, values, index, setFieldValue)}
                                  renderTags={(value, getTagProps) =>
                                    value.map(
                                      (option, index) =>
                                        option && (
                                          <Chip
                                            variant="dropdownwhite"
                                            label={option}
                                            {...getTagProps({ index })}
                                            size="small"
                                            key={`${option}`}
                                          />
                                        )
                                    )
                                  }
                                  renderInput={(params) => {
                                    const error =
                                      errors?.assessmentQuestions?.[index]?.options &&
                                      touched?.assessmentQuestions?.[index]?.options;
                                    const helperText = error ? errors.assessmentQuestions[index].options : '';
                                    return (
                                      <TextField
                                        {...params}
                                        variant="standard"
                                        label="Options *"
                                        error={!!error}
                                        helperText={helperText}
                                      />
                                    );
                                  }}
                                />
                              </Grid>
                            )}
                        </Grid>
                        <Box sx={{ ...styles.deleteIcon }}>
                          <IconButton onClick={() => remove(index)} sx={style.deleteIcon}>
                            <DeleteIconRed />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </FieldArray>
              <Stack flexDirection="row" justifyContent="flex-end" alignItems="center" mt={3} gap={2}>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleCreate(values);
                  }}
                  disabled={
                    hasExistingQuestions
                      ? !dirty
                      : !values.selectedQuestions.length && !values.assessmentQuestions.length
                  }
                >
                  {submitButtonLabel}
                </Button>
              </Stack>
            </DialogContent>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
