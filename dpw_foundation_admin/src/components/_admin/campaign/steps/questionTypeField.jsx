import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box } from '@mui/material';
import TextFieldSelect from 'src/components/TextFieldSelect';

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
/**
 * QuestionTypeField Component
 *
 * This component renders a select input for choosing the question type with a loading skeleton
 * and error handling. It is part of a form that supports dynamic question types.
 *
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the current question in the questions array.
 * @param {Object} props.values - Form values for the question.
 * @param {Object} props.touched - Touched status for form validation.
 * @param {Object} props.errors - Errors object for form validation.
 * @param {boolean} props.isLoading - Indicates if the data is being loaded.
 * @param {boolean} props.isEdit - Determines if the field is in edit mode.
 * @param {Function} props.handleBlur - Form blur handler.
 * @param {Function} props.handleChange - Form change handler.
 * @param {Function} props.setFieldValue - Function to set a field value.
 * @param {Function} props.setFieldError - Function to set a field error.
 * @param {Array} props.questionTypeData - Array of question types to populate the select input.
 * @param {Function} props.handleQuestionTypeChange - Function to handle changes to the question type.
 *
 * @returns {JSX.Element} The rendered QuestionTypeField component.
 */
const QuestionTypeField = ({
  index,
  values,
  touched,
  errors,
  isLoading,
  isEdit,
  handleBlur,
  setFieldValue,
  setFieldError,
  questionTypeData,
  handleQuestionTypeChange
}) => {
  return (
    <Grid item xs={12} md={6}>
      <FieldWithSkeleton
        isLoading={isLoading}
        error={touched.questions?.[index]?.questionType && !!errors.questions?.[index]?.questionType}
      >
        <TextFieldSelect
          id={`questions[${index}].questionType`}
          label={
            <>
              Select Question Type
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          name={`questions[${index}].questionType`}
          value={values.questions[index].questionType}
          itemsData={questionTypeData?.values}
          onBlur={handleBlur}
          errors={touched.questions?.[index]?.questionType && !!errors.questions?.[index]?.questionType}
          disabled={!isEdit}
          onChange={(event) => handleQuestionTypeChange(index, event, setFieldValue, setFieldError, values)}
        />
      </FieldWithSkeleton>
    </Grid>
  );
};

// Prop types validation
QuestionTypeField.propTypes = {
  index: PropTypes.number.isRequired,
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldError: PropTypes.func.isRequired,
  questionTypeData: PropTypes.object.isRequired,
  handleQuestionTypeChange: PropTypes.func.isRequired
};

export default QuestionTypeField;
