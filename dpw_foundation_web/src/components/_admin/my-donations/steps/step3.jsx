// Importing necessary Material UI components for form elements and styling
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';

// Importing useFormikContext from Formik to handle form state and actions
import { useFormikContext } from 'formik';

// Importing custom TextFieldSelect component
import TextFieldSelect from 'src/components/TextFieldSelect';

// Helper function to render a free-text input field
const renderFreeTextField = (question, index, setFieldValue) => (
  <TextField
    name={`questions[${index}].response`} // Setting the field name dynamically based on question index
    variant="standard"
    value={question.response} // Binding value to question's response
    onChange={(e) => setFieldValue(`questions[${index}].response`, e.target.value)} // Handling change to update form state
    inputProps={{ maxLength: 256 }} // Limiting the input length
    label={
      <>
        {question.questionText}{' '}
        <Box component="span" sx={{ color: 'error.main' }}>
          *
        </Box>
      </>
    }
    fullWidth // Ensuring the field takes up full width of container
  />
);

// Helper function to render a text area input field
const renderTextAreaField = (question, index, setFieldValue) => (
  <TextField
    name={`questions[${index}].response`}
    variant="standard"
    multiline
    rows={5} // Configuring the text area with 5 rows
    value={question.response}
    onChange={(e) => setFieldValue(`questions[${index}].response`, e.target.value)}
    inputProps={{ maxLength: 256 }}
    label={
      <>
        {question.questionText}{' '}
        <Box component="span" sx={{ color: 'error.main' }}>
          *
        </Box>
      </>
    }
    fullWidth
  />
);

// Helper function to render a dropdown field
const renderDropdownField = (question, index, setFieldValue) => (
  <TextFieldSelect
    name={`questions[${index}].response`}
    variant="standard"
    value={question.response}
    onChange={(e) => setFieldValue(`questions[${index}].response`, e.target.value)}
    inputProps={{ maxLength: 256 }}
    label={
      <>
        {question.questionText}{' '}
        <Box component="span" sx={{ color: 'error.main' }}>
          *
        </Box>
      </>
    }
    itemsData={question.options.map((option) => ({
      code: option.optionText,
      label: option.optionText
    }))} // Mapping question options to the dropdown items
    fullWidth
  />
);

// Helper function to render a multiple select field
const renderMultipleSelectField = (question, index, setFieldValue) => (
  <FormGroup>
    <FormLabel>
      {question.questionText}{' '}
      <Box component="span" sx={{ color: 'error.main' }}>
        *
      </Box>
    </FormLabel>
    {question.options.map((option) => (
      <FormControlLabel
        key={option.id}
        control={
          <Checkbox
            checked={question.response.split(',').includes(option.optionText)} // Checking if the option is selected
            onChange={(e) => {
              const currentValues = question.response ? question.response.split(',') : [];
              const updatedValues = e.target.checked
                ? [...currentValues, option.optionText] // Adding selected option
                : currentValues.filter((value) => value !== option.optionText); // Removing unselected option
              setFieldValue(`questions[${index}].response`, updatedValues.join(',')); // Updating form state
            }}
          />
        }
        label={option.optionText}
      />
    ))}
  </FormGroup>
);

// Helper function to render a radio button field
const renderRadioField = (question, index, setFieldValue) => (
  <>
    <FormLabel>
      {question.questionText}{' '}
      <Box component="span" sx={{ color: 'error.main' }}>
        *
      </Box>
    </FormLabel>
    <RadioGroup
      name={`questions[${index}].response`}
      value={question.response}
      onChange={(e) => setFieldValue(`questions[${index}].response`, e.target.value)}
    >
      {question.options.map((option) => (
        <FormControlLabel key={option.id} value={option.optionText} control={<Radio />} label={option.optionText} />
      ))}
    </RadioGroup>
  </>
);

// Function to render each question based on its type (free text, dropdown, etc.)
const renderQuestion = (question, index, setFieldValue, touched, errors) => {
  let field;
  // Switch statement to select the appropriate rendering function based on question type
  switch (question.questionType) {
    case 'freeText':
      field = renderFreeTextField(question, index, setFieldValue);
      break;
    case 'textArea':
      field = renderTextAreaField(question, index, setFieldValue);
      break;
    case 'dropdown':
      field = renderDropdownField(question, index, setFieldValue);
      break;
    case 'multipleSelect':
      field = renderMultipleSelectField(question, index, setFieldValue);
      break;
    case 'radio':
      field = renderRadioField(question, index, setFieldValue);
      break;
    default:
      field = null;
  }

  return (
    <Box key={question.id} marginBottom={2}>
      {field}
      {/* Displaying any form validation error messages */}
      {touched.questions?.[index]?.response && errors.questions?.[index]?.response && (
        <FormHelperText>{errors.questions[index].response}</FormHelperText>
      )}
    </Box>
  );
};

// Step3 component which renders a series of questions dynamically based on form values
const Step3 = () => {
  const { touched, errors, setFieldValue, values } = useFormikContext(); // Getting Formik context for form state and actions

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform="uppercase" color="text.black" sx={{ pb: 3 }}>
        Additional Information
      </Typography>
      {/* Rendering each question dynamically based on its data */}
      {values.questions.map((question, index) => renderQuestion(question, index, setFieldValue, touched, errors))}
    </Paper>
  );
};

export default Step3; // Exporting the Step3 component for use elsewhere
