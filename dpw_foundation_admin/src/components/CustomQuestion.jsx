import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useDebounce from 'src/hooks/useDebounce';
import { setToastMessage } from 'src/redux/slices/common';
import StepperStyle from './_admin/campaign/steps/stepper.styles';
import { DeleteIconRed } from './icons';

// Component for individual question with debounced input
function QuestionTextInput({ index }) {
  const { values, setFieldValue, handleBlur, touched, errors } = useFormikContext();
  const [localValue, setLocalValue] = useState(values.questions?.[index]?.questionText || '');
  const debouncedValue = useDebounce(localValue, 200);

  // Update Formik when debounced value changes
  useEffect(() => {
    setFieldValue(`questions[${index}].questionText`, debouncedValue);
  }, [debouncedValue, setFieldValue, index]);

  // Update local state when Formik values change externally
  useEffect(() => {
    setLocalValue(values.questions?.[index]?.questionText || '');
  }, [values.questions, index]);

  const handleChangeQuestionText = (event) => {
    setLocalValue(event.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="standard"
      name={`questions[${index}].questionText`}
      value={localValue}
      onChange={handleChangeQuestionText}
      onBlur={handleBlur}
      error={touched.questions?.[index]?.questionText && !!errors.questions?.[index]?.questionText}
      helperText={touched.questions?.[index]?.questionText && errors.questions?.[index]?.questionText}
      label={
        <>
          Question Text{' '}
          <Box component="span" sx={{ color: 'error.main' }}>
            *
          </Box>
        </>
      }
    />
  );
}

const getContextType = (module) => {
  if (module === 'partner') {
    return 'Partnership';
  } else if (module === 'volunteer') {
    return 'Volunteer';
  } else if (module === 'contributions') {
    return 'contributions';
  }
};

export default function CustomQuestion({ qType, predefinedQuestionLength = 0, module = 'partner' }) {
  const theme = useTheme();
  const styles = StepperStyle(theme);
  const { values, setFieldValue, handleBlur, touched, errors } = useFormikContext();
  const dispatch = useDispatch();

  const handleQuestionTypeChange = (e, index, setFieldValue) => {
    const selectedType = e.target.value;
    setFieldValue(`questions[${index}].questionType`, selectedType);
    setFieldValue(`questions[${index}].options`, []);
  };

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
    setFieldValue(`questions[${index}].options`, structuredOptions);
  };

  return (
    <>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
        <Typography variant="subtitle6" color="primary.main" textTransform="uppercase">
          {module === 'contributions' ? 'Questions' : 'Other Questions'}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setFieldValue('questions', [
              ...values.questions,
              {
                questionText: '',
                contextType: getContextType(module),
                questionType: '',
                secondAnswerType: '',
                thirdAnswerType: '',
                sequence: predefinedQuestionLength + values.questions.length + 1,
                options: []
              }
            ]);
          }}
        >
          Add Question
        </Button>
      </Stack>
      <FieldArray name="questions">
        {({ remove }) => (
          <>
            {values.questions.length === 0 ? (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No questions added yet
                </Typography>
              </>
            ) : (
              values.questions.map((question, index) => (
                <Box sx={{ ...styles.moreBox, pb: 2 }} key={question?.sequence}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        variant="standard"
                        name={`questions[${index}].questionType`}
                        value={question.questionType}
                        onChange={(e) => handleQuestionTypeChange(e, index, setFieldValue)}
                        onBlur={handleBlur}
                        error={touched.questions?.[index]?.questionType && !!errors.questions?.[index]?.questionType}
                        helperText={touched.questions?.[index]?.questionType && errors.questions?.[index]?.questionType}
                        label={
                          <>
                            Question Type{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                      >
                        {qType?.values?.length > 0 &&
                          qType?.values?.map((item) => (
                            <MenuItem key={item.code.toUpperCase()} value={item.code.toUpperCase()}>
                              {item.label}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <QuestionTextInput index={index} />
                    </Grid>
                    {question.questionType && ['RADIO', 'CHECKBOX'].includes(question.questionType) && (
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
                            const error = errors?.questions?.[index]?.options && touched?.questions?.[index]?.options;
                            const helperText = error ? errors.questions[index].options : '';
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
                    <IconButton onClick={() => remove(index)}>
                      <DeleteIconRed />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </>
        )}
      </FieldArray>
    </>
  );
}
