// Import required Material-UI components
import { MenuItem, TextField } from '@mui/material';
import PropTypes from 'prop-types';
/**
 * TextFieldSelect Component
 * A reusable component that renders a Material-UI TextField with dropdown menu functionality.
 * It dynamically populates dropdown options from the provided `itemsData` array.
 *
 * @param {object} props - Component properties.
 * @param {string} props.id - The unique identifier for the TextField.
 * @param {string} props.label - The label text for the TextField.
 * @param {function} props.getFieldProps - A function to handle field properties (default: empty function).
 * @param {boolean} props.errors - Indicates if there are validation errors for the field.
 * @param {Array} props.itemsData - Array of objects representing dropdown options (default: empty array).
 * @param {string|number} props.value - The selected value for the dropdown (default: empty string).
 * @param {boolean} props.isObject - Flag to determine whether the dropdown values are objects or strings.
 * @param {boolean} props.disabled - Determines if the TextField should be disabled.
 * @param {object} props.other - Additional properties passed to the TextField component.
 *
 * @returns {JSX.Element} A Material-UI TextField with dropdown options.
 */
export default function TextFieldSelect({
  id,
  label,
  getFieldProps = () => {}, // Default handler for field properties
  errors,
  itemsData = [], // Default to an empty array if no items are provided
  value = '', // Default value is an empty string
  isObject = false, // Default to assume dropdown values are not objects
  disabled,
  ...other // Spread operator to capture any additional props
}) {
  // Ensure itemsData is a valid array; default to an empty array if not
  const newItemsData = Array.isArray(itemsData) ? itemsData : [];

  // Render the TextField component with dropdown options
  return (
    <TextField
      id={id} // Set the unique identifier for the TextField
      select // Enables dropdown functionality for the TextField
      label={label} // Display the label for the TextField
      value={value || ''} // Use the provided value or default to an empty string
      variant="standard" // Set the TextField variant to 'standard'
      {...getFieldProps(id)} // Apply field-specific props from the parent component
      error={errors} // Highlight the field in error state if errors are true
      disabled={disabled} // Disable the TextField if the `disabled` prop is true
      fullWidth // Make the TextField take the full width of its container
      {...other} // Pass any additional props to the TextField
    >
      {newItemsData?.length === 0 ? ( // Check if itemsData is empty
        <MenuItem value="" disabled>
          {/* Render a disabled option when no data is available */}
          No option available
        </MenuItem>
      ) : (
        // Map through the newItemsData array to render each option
        newItemsData?.map((type) => (
          <MenuItem
            value={isObject ? type : type?.code} // Use the entire object or the 'code' as the value
            key={type?.code} // Use 'code' as the unique key for each option
          >
            {type?.label} {/* Display the label text for each option */}
          </MenuItem>
        ))
      )}
    </TextField>
  );
}
TextFieldSelect.propTypes = {
  // 'id' is a required string
  id: PropTypes.string.isRequired,

  // 'label' is a required string
  label: PropTypes.string.isRequired,

  // 'getFieldProps' is a function with a default empty handler
  getFieldProps: PropTypes.func,

  // 'errors' is an optional object
  errors: PropTypes.object,

  // 'itemsData' is an array, defaulting to an empty array
  itemsData: PropTypes.array,

  // 'value' is a string, defaulting to an empty string
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),

  // 'isObject' is a boolean indicating if dropdown values are objects
  isObject: PropTypes.bool,

  // 'disabled' is an optional boolean
  disabled: PropTypes.bool,

  // 'other' is to capture additional props
  other: PropTypes.object
};
