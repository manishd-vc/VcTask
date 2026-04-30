import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import * as Yup from 'yup';

/**
 * Renders form control based on question type
 * @param {Object} props - Component props
 * @param {Object} props.question - Question object containing type and options
 * @param {Object} props.formik - Formik instance
 * @returns {JSX.Element} Rendered form control
 */
const renderQuestionByType = ({ question: q, formik }) => {
  switch (q.questionType.toUpperCase()) {
    case 'MULTISELECT':
    case 'CHECKBOX':
      return (
        <FormGroup>
          {q.options.map((option) => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  value={option.optionText}
                  checked={formik.values[q.id]?.includes(option.optionText)}
                  onChange={(e) => {
                    const { checked, value } = e.target;
                    const current = formik.values[q.id] || [];
                    formik.setFieldValue(q.id, checked ? [...current, value] : current.filter((v) => v !== value));
                  }}
                />
              }
              label={
                <Typography variant="body2" color={'text.secondarydark'}>
                  {option.optionText}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      );

    case 'RADIO':
      return (
        <RadioGroup
          name={q.id}
          value={formik.values[q.id]}
          onChange={formik.handleChange}
          error={Boolean(formik.touched[q.id] && formik.errors[q.id])}
        >
          {q.options.length > 0
            ? q.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.optionText}
                  control={<Radio />}
                  label={
                    <Typography variant="body2" color={'text.secondarydark'}>
                      {option.optionText}
                    </Typography>
                  }
                />
              ))
            : ['Yes', 'No'].map((option) => (
                <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
              ))}
        </RadioGroup>
      );

    case 'SELECT':
    case 'DROPDOWN':
      return (
        <TextField
          fullWidth
          select
          variant="standard"
          name={q.id}
          value={formik.values[q.id]}
          onChange={formik.handleChange}
          label="Select an option"
          error={Boolean(formik.touched[q.id] && formik.errors[q.id])}
        >
          {q.options.map((option) => (
            <MenuItem key={option.id} value={option.optionText}>
              {option.optionText}
            </MenuItem>
          ))}
        </TextField>
      );

    case 'TEXT':
    case 'TEXTAREA':
    case 'FREETEXT':
      return (
        <TextField
          fullWidth
          variant="standard"
          name={q.id}
          value={formik.values[q.id]}
          onChange={formik.handleChange}
          label="Enter Your Answer"
          error={Boolean(formik.touched[q.id] && formik.errors[q.id])}
        />
      );

    default:
      return (
        <Typography variant="body2" color="error">
          Unknown question type
        </Typography>
      );
  }
};

/**
 * Dynamic QuestionsAnswer component
 *
 * @component
 * @param {boolean} open - Whether the modal is open.
 * @param {function} onClose - Callback for closing the modal.
 * @param {function} onSubmit - Callback for submitting form data.
 * @param {boolean} isLoading - Whether the form is in loading state.
 * @param {object} questionSet - Object containing entityId and questions.
 */
const QuestionsAnswer = ({ open, onClose, onSubmit, isLoading, questionSet }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { entityId, questions } = questionSet;
  const isUpdate = questionSet?.responseReceived === true;

  const initialValues = React.useMemo(() => {
    const values = questions.reduce((acc, q) => {
      if (q.questionType === 'MULTISELECT') {
        acc[q.id] = q.response ? q.response.split(',').map((r) => r.trim()) : [];
      } else {
        acc[q.id] = q.response || '';
      }
      return acc;
    }, {});
    values.assessmentFinding = questionSet?.assessmentFinding || '';
    return values;
  }, [questionSet]);

  const questionsValidation = questions.reduce((acc, q) => {
    const type = q.questionType.toUpperCase();

    if (['MULTISELECT', 'CHECKBOX'].includes(type)) {
      acc[q.id] = Yup.array()
        .of(Yup.string())
        .min(1, 'At least one option must be selected')
        .required('Answer is required');
    } else if (type === 'RADIO' || type === 'SELECT' || type === 'DROPDOWN') {
      acc[q.id] = Yup.string().required('Answer is required');
    } else {
      acc[q.id] = Yup.string().trim().required('Answer is required');
    }

    return acc;
  }, {});

  const validationSchema = Yup.object({
    ...questionsValidation,
    assessmentFinding: Yup.string().required('Assessors findings is required')
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        entityId,
        assessmentFinding: values?.assessmentFinding,
        questions: Object.entries(values)
          .filter(([id]) => id !== 'assessmentFinding')
          .map(([id, response]) => ({
            id,
            response: Array.isArray(response) ? response.join(', ') : response
          }))
      };
      onSubmit(payload);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle
          sx={{ textTransform: 'uppercase', paddingRight: { sm: 'auto', md: '60px' } }}
          color="primary.main"
          mb={0}
        >
          {isUpdate ? 'Update Assessment Question Answers' : 'Answer Assessment Questions'}
        </DialogTitle>

        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>

        <DialogContent>
          {questions.map((q, index) => (
            <React.Fragment key={q.id}>
              <Typography variant="body2" color="text.secondarydark" my={3}>
                {index + 1}. {q.questionText}{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </Typography>

              {renderQuestionByType({ question: q, formik })}

              {formik.touched[q.id] && formik.errors[q.id] && (
                <Typography variant="caption" color="error">
                  {formik.touched[q.id] && formik.errors[q.id] && (
                    <FormHelperText>{formik.errors[q.id]}</FormHelperText>
                  )}{' '}
                </Typography>
              )}
            </React.Fragment>
          ))}

          <Typography textTransform="uppercase" variant="subtitle5" color="primary.main" component="h5" my={3}>
            Assessors findings
          </Typography>

          <Grid item xs={12} sm={6}>
            <TextField
              id="assessmentFinding"
              variant="standard"
              label={
                <>
                  Enter Your Answer{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              fullWidth
              {...formik.getFieldProps('assessmentFinding')}
              error={Boolean(formik.touched.assessmentFinding && formik.errors.assessmentFinding)}
              helperText={formik.touched.assessmentFinding && formik.errors.assessmentFinding}
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlinedWhite">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} disabled={!formik.dirty}>
            {isUpdate ? 'Update Answers' : 'Save Answers'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

QuestionsAnswer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  questionSet: PropTypes.shape({
    entityId: PropTypes.string.isRequired,
    assessmentFinding: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        questionText: PropTypes.string.isRequired,
        questionType: PropTypes.string.isRequired,
        response: PropTypes.string,
        options: PropTypes.array
      })
    )
  }).isRequired
};

export default QuestionsAnswer;
