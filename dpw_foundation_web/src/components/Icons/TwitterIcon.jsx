// Redux imports can be added here if state management is required for the component

// Importing IoLogoTwitter icon from react-icons for Twitter
import PropTypes from 'prop-types';
import { IoLogoTwitter } from 'react-icons/io5';
// Material UI components
import { IconButton } from '@mui/material'; // Importing IconButton from MUI for clickable icons

// Functional component to render a Twitter icon with conditional styling based on 'isAdmin' prop
export default function TwitterIcon({ isAdmin }) {
  return (
    // IconButton component from MUI, which provides a clickable icon button
    <IconButton
      name="setting-mode" // Name attribute for the button (useful for testing or identifying)
      size="medium" // Set the size of the button to medium
      color={isAdmin ? 'default' : 'primary'} // Change button color based on isAdmin prop
    >
      {/* Render the Twitter logo icon with a size of 16 */}
      <IoLogoTwitter size={16} />
    </IconButton>
  );
}

TwitterIcon.propTypes = {
  // 'isAdmin' is a boolean indicating if the user is an admin
  isAdmin: PropTypes.bool.isRequired
};
