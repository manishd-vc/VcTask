import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';

// mui
import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

/**
 * RootStyle component
 * A styled container to hold the scrollable content with flex grow and full height.
 *
 * @returns {JSX.Element} A div with styling applied.
 */
const RootStyle = styled('div')({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden' // Prevents the container from overflowing
});

/**
 * SimpleBarStyle component
 * A styled wrapper around SimpleBarReact to customize the scrollbar style.
 *
 * @param {Object} theme - MUI theme object for styling.
 * @returns {JSX.Element} A styled SimpleBarReact component with custom scrollbar appearance.
 */
const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[900], 1), // Dark background color for the scrollbar
      borderRadius: 0 // Removes rounding of the scrollbar
    },
    '&.simplebar-visible:before': {
      opacity: 1 // Make the scrollbar visible when hovered
    }
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10 // Set width of the vertical scrollbar
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 9 // Set height of the horizontal scrollbar
  },
  '& .simplebar-mask': {
    zIndex: 'inherit' // Keeps the masking layer behind the scrollable content
  }
}));

// ----------------------------------------------------------------------

/**
 * Scrollbar component
 * A wrapper for scrollable content with custom scrollbars.
 * - For mobile devices, falls back to default horizontal scrolling.
 * - For desktop, uses a custom styled SimpleBar for smooth scrollbars.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The content inside the scrollbar.
 * @param {Object} [props.sx] - Optional styling overrides.
 *
 * @returns {JSX.Element} A div with custom scrollbars for desktop or default scrolling for mobile.
 */
Scrollbar.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object
};

/**
 * Scrollbar component that conditionally renders based on device type.
 * On mobile devices, it provides horizontal scrolling with default overflow behavior.
 * On desktop, it applies a custom scrollbar using SimpleBarReact.
 */
export default function Scrollbar({ children, sx, ...other }) {
  // Check if the user is on a mobile device using a simple regex for common user agents
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // If mobile, render a Box with default overflow styles
  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  // For non-mobile devices, use the custom SimpleBar scrollbar component
  return (
    <RootStyle>
      <SimpleBarStyle timeout={500} clickOnTrack={false} sx={sx} {...other}>
        {children}
      </SimpleBarStyle>
    </RootStyle>
  );
}
