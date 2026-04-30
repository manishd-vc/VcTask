// redux: useDispatch and useSelector hooks are used to interact with the Redux store
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from 'src/redux/slices/settings'; // Action to update the theme mode in the Redux store
import PropTypes from 'prop-types';
// icons: Importing icons for sunny (light mode) and moon (dark mode) from react-icons
import { IoMoonOutline, IoSunny } from 'react-icons/io5';

// mui: Importing IconButton from MUI for clickable buttons, and alpha for background transparency
import { IconButton, alpha } from '@mui/material';
SettingMode.propTypes = {
  // 'isAdmin' is a boolean indicating if the user has admin privileges, and it is required
  isAdmin: PropTypes.bool.isRequired
};
// Functional component for toggling between light and dark theme modes
export default function SettingMode({ isAdmin }) {
  // Using the useSelector hook to get the current theme mode from the Redux store
  const { themeMode } = useSelector(({ settings }) => settings);

  // Using the useDispatch hook to dispatch actions to Redux store
  const dispatch = useDispatch();

  return (
    // IconButton component to toggle the theme mode when clicked
    <IconButton
      name="setting-mode" // Name attribute for identifying the button (useful for tests)
      onClick={() => dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'))} // Toggle the theme mode
      size="medium" // Set the size of the button
      color={isAdmin ? 'default' : 'primary'} // Use default color if isAdmin is true, else use primary color
      sx={{
        // Additional styling when not in admin mode
        ...(!isAdmin && {
          borderColor: 'primary', // Set border color to primary color if not admin
          borderWidth: 1, // Set border width
          borderStyle: 'solid', // Apply solid border style
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) // Set a semi-transparent background color
        })
      }}
    >
      {/* Conditionally render the icons based on the current theme */}
      {themeMode === 'dark' ? <IoSunny size={24} /> : <IoMoonOutline size={24} />}
    </IconButton>
  );
}
