import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
// mui
import { Avatar, useTheme } from '@mui/material';

/**
 * MAvatar component - A customizable Avatar component that uses Material UI's Avatar.
 * Allows for different colors and styling options.
 *
 * @param {Object} props The props for the MAvatar component.
 * @param {string} [props.color='default'] The color variant for the Avatar (e.g., 'primary', 'secondary').
 * @param {Object} [props.sx] The custom styles to override the default Avatar styles.
 * @param {React.ReactNode} [props.children] The content to be displayed inside the Avatar (e.g., initials, icon).
 * @param {React.Ref} ref The forwarded ref for the Avatar component.
 *
 * @returns {JSX.Element} The rendered MAvatar component.
 */
const MAvatar = forwardRef(function MAvatar({ color = 'default', sx, children, ...other }, ref) {
  // Get the theme from Material UI's useTheme hook
  const theme = useTheme();

  // Return the default Avatar if the color is 'default'
  if (color === 'default') {
    return (
      <Avatar ref={ref} sx={sx} {...other}>
        {children}
      </Avatar>
    );
  }

  // Return a custom Avatar with the specified color if not 'default'
  return (
    <Avatar
      ref={ref}
      sx={{
        fontWeight: theme.typography.fontWeightMedium, // Set font weight from theme
        color: theme.palette[color].contrastText, // Use contrast text color from theme
        backgroundColor: theme.palette[color].main, // Use main color from theme
        ...sx // Apply custom styles passed via sx prop
      }}
      {...other}
    >
      {children}
    </Avatar>
  );
});

// Set the display name for the component
MAvatar.displayName = 'MAvatar';

/**
 * PropTypes for MAvatar component.
 * Ensures that the correct types are passed as props.
 */
MAvatar.propTypes = {
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'error', 'warning', 'info', 'success']),
  sx: PropTypes.object,
  children: PropTypes.node
};

export default MAvatar;
