import { Box, Grid, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import QuestionDeleteButton from './questionDeleteButton';
import QuestionTextField from './questionTextField';
import StepperStyle from './stepper.styles';

/**
 * QuestionForm Component
 *
 * This component renders a form with multiple question fields. Each question has
 * fields for selecting the question type, entering the question text, and setting options.
 * It also includes a delete button for each question.
 *
 * @param {Object} props - Component props
 * @param {Object} props.values - Form values.
 * @param {Object} props.touched - Touched fields in the form.
 * @param {Object} props.errors - Validation errors.
 * @param {boolean} props.isLoading - Whether the form is in loading state.
 * @param {boolean} props.isEdit - Whether the form is in edit mode.
 * @param {Function} props.handleBlur - Function to handle blur events.
 * @param {Function} props.handleChange - Function to handle change events.
 * @param {Function} props.setFieldValue - Function to set field values.
 * @param {Function} props.setFieldError - Function to set field errors.
 * @param {Function} props.remove - Function to remove a question.
 * @param {Function} props.handleOptionChange - Function to handle changes in options.
 * @param {Object} props.questionTypeData - Data for question types.
 * @returns {JSX.Element} The rendered QuestionForm component.
 */
const QuestionForm = ({ values, touched, errors, isLoading, handleBlur, handleChange, remove, isSuperior }) => {
  const theme = useTheme();
  const styles = StepperStyle(theme);

  return (
    <>
      {values.questions.map((task, index) => (
        <Box sx={{ ...styles.moreBox, pb: 2 }} key={values?.questions[index]?.id ?? `q-${index}`}>
          <Grid container rowSpacing={2} spacing={2}>
            <QuestionTextField
              index={index}
              name={`questions[${index}].questionText`}
              values={values?.questions[index]?.questionText}
              touched={touched?.questions?.[index]?.questionText}
              errors={errors?.questions?.[index]?.questionText}
              isLoading={isLoading}
              handleChange={handleChange}
              handleBlur={handleBlur}
              label="Enter Question"
              readOnly={isSuperior}
            />
            <QuestionTextField
              index={index}
              name={`questions[${index}].targetUnit`}
              values={values?.questions[index]?.targetUnit}
              touched={touched?.questions?.[index]?.targetUnit}
              errors={errors?.questions?.[index]?.targetUnit}
              isLoading={isLoading}
              handleChange={handleChange}
              handleBlur={handleBlur}
              label="Enter Target Unit"
              readOnly={isSuperior}
            />
            <QuestionTextField
              index={index}
              name={`questions[${index}].targetValue`}
              values={values?.questions[index]?.targetValue}
              touched={touched?.questions?.[index]?.targetValue}
              errors={errors?.questions?.[index]?.targetValue}
              isLoading={isLoading}
              handleChange={handleChange}
              handleBlur={handleBlur}
              label="Enter Target Value"
              readOnly={isSuperior}
            />

            {isSuperior && (
              <QuestionTextField
                index={index}
                name={`questions[${index}].achieveValue`}
                values={values?.questions[index]?.achieveValue}
                touched={touched?.questions?.[index]?.achieveValue}
                errors={errors?.questions?.[index]?.achieveValue}
                isLoading={isLoading}
                handleChange={handleChange}
                handleBlur={handleBlur}
                label="Enter Achieved Value"
              />
            )}
            {!isSuperior && <QuestionDeleteButton index={index} remove={remove} />}
          </Grid>
        </Box>
      ))}
    </>
  );
};

// Prop types validation
QuestionForm.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldError: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  handleOptionChange: PropTypes.func.isRequired,
  handleQuestionTypeChange: PropTypes.func.isRequired,
  questionTypeData: PropTypes.object.isRequired,
  isSuperior: PropTypes.bool.isRequired
};

export default QuestionForm;
