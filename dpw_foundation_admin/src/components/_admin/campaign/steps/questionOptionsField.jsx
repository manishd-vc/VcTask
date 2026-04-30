import { Box, Chip, Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import PropTypes from 'prop-types';
import React from 'react';

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
/**
 * QuestionOptionsField Component
 *
 * This component renders the options field for a question, with support for
 * multiple select options, free solo input, and validation. It is shown
 * only for specific question types like 'multipleSelect', 'dropdown', and 'radio'.
 *
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the current question in the questions array.
 * @param {Object} props.values - Form values for the question.
 * @param {Object} props.touched - Touched status for form validation.
 * @param {Object} props.errors - Errors object for form validation.
 * @param {boolean} props.isLoading - Indicates if the data is being loaded.
 * @param {boolean} props.isEdit - Determines if the field is in edit mode.
 * @param {Function} props.handleOptionChange - Function to handle option changes.
 *
 * @returns {JSX.Element} The rendered QuestionOptionsField component or null if not applicable.
 */
const QuestionOptionsField = ({ index, values, touched, errors, isLoading, isEdit, handleOptionChange }) => {
  const questionType = values.questions[index].questionType;

  const renderChip = (option, index, getTagProps) => {
    return (
      <Chip variant="dropdownwhite" size="small" label={option.optionText} {...getTagProps({ index })} key={index} />
    );
  };

  // Check if the question type requires options
  if (!['multipleSelect', 'dropdown', 'radio'].includes(questionType)) {
    return null;
  }

  return (
    <Grid item xs={12} md={12}>
      <FieldWithSkeleton
        isLoading={isLoading}
        error={touched.questions?.[index]?.options && !!errors.questions?.[index]?.options}
      >
        <Autocomplete
          multiple
          freeSolo
          options={[]} // No predefined options
          value={values.questions[index].options}
          onChange={(event, newValue) => handleOptionChange(newValue, index)}
          renderTags={(value, getTagProps) => value.map((option, index) => renderChip(option, index, getTagProps))}
          disabled={!isEdit}
          error={touched.questions?.[index]?.options && errors.questions?.[index]?.options}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              disabled={!isEdit}
              error={touched.questions?.[index]?.options && !!errors.questions?.[index]?.options}
              helperText={touched.questions?.[index]?.options && errors.questions?.[index]?.options}
              label={
                <>
                  Options
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              placeholder="Type and hit enter"
            />
          )}
        />
      </FieldWithSkeleton>
    </Grid>
  );
};

// Prop types validation
QuestionOptionsField.propTypes = {
  index: PropTypes.number.isRequired,
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  handleOptionChange: PropTypes.func.isRequired
};

export default QuestionOptionsField;
