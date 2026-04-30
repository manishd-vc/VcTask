// Redux imports can be added if necessary for state management
import PropTypes from 'prop-types';
// Importing IoLogoInstagram icon from react-icons for Instagram
import { IoLogoInstagram } from 'react-icons/io5';

// Material UI components
import { IconButton } from '@mui/material'; // Importing IconButton from MUI for clickable icons

// Functional component to render an Instagram icon with conditional styling based on 'isAdmin' prop
export default function InstagramIcon({ isAdmin }) {
  return (
    // IconButton component from MUI, which provides a clickable icon button
    <IconButton
      name="setting-mode" // Name attribute for the button (useful for testing or identifying)
      size="medium" // Set the size of the button to medium
      color={isAdmin ? 'default' : 'primary'} // Change button color based on isAdmin prop
    >
      {/* Render the Instagram logo icon with a size of 16 */}
      <IoLogoInstagram size={16} />
    </IconButton>
  );
}

InstagramIcon.propTypes = {
  // 'isAdmin' is a boolean indicating if the user is an admin
  isAdmin: PropTypes.bool.isRequired
};
