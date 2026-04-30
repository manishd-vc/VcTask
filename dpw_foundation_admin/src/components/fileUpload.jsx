import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getLabelObject } from 'src/utils/extractLabelValues';

FileUpload.propTypes = {
  // 'name' is a string representing the name of the file input
  name: PropTypes.string.isRequired,

  // 'buttonText' is a string used for the button label (defaults to 'Attach Files')
  buttonText: PropTypes.string,

  // 'icon' can be any valid React component or element to display as an icon
  icon: PropTypes.node,

  // 'onChange' is a function that handles the file input change event
  onChange: PropTypes.func.isRequired,

  // 'multiple' is a boolean indicating whether multiple files can be uploaded
  multiple: PropTypes.bool,

  // 'size' is a number representing the maximum file size allowed (in KB)
  size: PropTypes.number,

  // 'disabled' is a boolean that disables the file upload input if true (defaults to false)
  disabled: PropTypes.bool,

  // 'typeOfAllowed' is a string that specifies the accepted file types
  typeOfAllowed: PropTypes.string
};
/**
 * FileUpload Component
 *
 * This component renders a file upload button with customizable text, icon, and file type validation.
 * It utilizes Redux to access master data and provides functionality to upload multiple files.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - The name of the file input field (for form handling).
 * @param {string} [props.buttonText='Attach Files'] - The text displayed on the button.
 * @param {React.ReactNode} [props.icon] - Optional icon displayed next to the button text.
 * @param {function} props.onChange - The callback function triggered when the file is selected.
 * @param {boolean} [props.multiple=false] - Determines whether multiple files can be uploaded.
 * @param {string} [props.accept] - The accepted file types (e.g., 'image/*').
 * @param {string} [props.size] - The size of the button ('small', 'medium', 'large').
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 *
 * @returns {JSX.Element} The rendered FileUpload component.
 */
export default function FileUpload({
  name,
  buttonText = 'Attach Files',
  icon,
  onChange,
  multiple,
  size,
  disabled = false,
  typeOfAllowed
}) {
  // Extracting master data from the Redux store
  const { masterData } = useSelector((state) => state?.common);

  // Extracting file type validation from the master data
  const validationFiles = getLabelObject(masterData, 'dpw_foundation_configuration');
  const configCode = typeOfAllowed || 'fileType';
  // Extracting accepted file types from the master data if not provided via props
  const acceptTypes = validationFiles?.values?.find((item) => item.code === configCode)?.label || '';

  return (
    <Button type="button" variant="contained" size={size} component="label" startIcon={icon} disabled={disabled}>
      {buttonText}
      <input
        type="file"
        multiple={multiple}
        hidden
        name={name}
        onClick={(event) => (event.target.value = '')} // Clears the input field on click to allow re-uploading the same file
        onChange={onChange}
        accept={acceptTypes} // Uses either the passed `typeOfAllowed` prop or the one derived from the master data
      />
    </Button>
  );
}
