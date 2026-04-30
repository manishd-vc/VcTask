import { Box, Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
/**
 * QuestionTextField Component
 *
 * This component renders a text input field for entering a question, with a loading skeleton
 * and error handling. It is part of a form for dynamic question entry.
 *
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the current question in the questions array.
 * @param {Object} props.values - Form values for the question.
 * @param {Object} props.touched - Touched status for form validation.
 * @param {Object} props.errors - Errors object for form validation.
 * @param {boolean} props.isLoading - Indicates if the data is being loaded.
 * @param {Function} props.handleBlur - Form blur handler.
 * @param {Function} props.handleChange - Form change handler.
 *
 * @returns {JSX.Element} The rendered QuestionTextField component.
 */
const QuestionTextField = ({
  values,
  touched,
  errors,
  isLoading,
  handleChange,
  handleBlur,
  label,
  name,
  isNumberOnly = false,
  readOnly = false
}) => {
  return (
    <Grid item xs={12} md={12}>
      <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
        <TextField
          variant="standard"
          fullWidth
          name={name}
          value={values || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched && !!errors}
          helperText={touched && errors}
          label={
            <>
              {label}
              <Box component="span" sx={{ color: 'error.main' }}>
                {' '}
                *
              </Box>
            </>
          }
          inputProps={
            isNumberOnly
              ? {
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }
              : {}
          }
          InputProps={{
            readOnly: readOnly
          }}
          type={isNumberOnly ? 'number' : 'text'}
        />
      </FieldWithSkeleton>
    </Grid>
  );
};

// Prop types validation
QuestionTextField.propTypes = {
  index: PropTypes.number.isRequired,
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default QuestionTextField;
