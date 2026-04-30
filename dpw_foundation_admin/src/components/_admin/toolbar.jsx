'use client';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// mui
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { alpha, styled } from '@mui/material/styles';

/**
 * ButtonAppBar - A styled AppBar component that adjusts its width based on the sidebar's state.
 *
 * @param {object} props - The props for the component.
 * @param {ReactNode} props.children - The children elements to render inside the AppBar.
 *
 * @returns {JSX.Element} - The ButtonAppBar component.
 */
ButtonAppBar.propTypes = {
  children: PropTypes.node.isRequired
};

// Drawer width for side navigation
const drawerWidth = 240;

/**
 * AppBar - A styled version of the MuiAppBar component to apply custom styles based on the sidebar state.
 *
 * @param {object} theme - The MUI theme object used for styling.
 * @param {boolean} open - Whether the sidebar is open or closed.
 *
 * @returns {JSX.Element} - The styled AppBar component.
 */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  boxShadow: 'none', // No shadow effect on AppBar
  backdropFilter: 'blur(6px)', // Apply blur to the background for the AppBar
  WebkitBackdropFilter: 'blur(6px)', // Fix for mobile browsers (Safari)
  background: alpha(theme.palette.background.default, 0.72), // Semi-transparent background
  borderBottom: '1px solid ' + theme.palette.divider, // Divider line at the bottom of the AppBar
  borderRadius: 0, // No rounded corners
  top: 65, // Fixed position for the AppBar from the top
  width: `calc(100% - ${65}px)`, // Width calculation considering the left sidebar
  zIndex: theme.zIndex.drawer + 1, // Ensure the AppBar is above the drawer
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth, // Adjust AppBar position when sidebar is open
    width: `calc(100% - ${drawerWidth}px)`, // Adjust the width of the AppBar when sidebar is open
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }),
  // Adjust AppBar style for smaller screens (mobile)
  [theme.breakpoints.down('md')]: {
    width: '100%', // Full width for mobile screens
    left: 0 // No offset for mobile screens
  }
}));

/**
 * ButtonAppBar Component that renders the AppBar with conditional sidebar styles.
 *
 * @param {object} props - The props for the component.
 * @param {ReactNode} props.children - The content inside the AppBar.
 *
 * @returns {JSX.Element} - The ButtonAppBar component.
 */
export default function ButtonAppBar({ children }) {
  // Get the state of the sidebar from Redux
  const { openSidebar } = useSelector((state) => state.settings);

  return (
    <>
      {/* Desktop version of the AppBar */}
      <Box
        sx={{
          flexGrow: 1,
          width: 1,
          mb: 2,
          display: { sm: 'block', xs: 'none' } // Show only on larger screens (sm and up)
        }}
      >
        <AppBar
          open={openSidebar} // Pass the openSidebar state to the AppBar component
          sx={{
            zIndex: 997 + '!important', // Ensure the AppBar has a higher z-index
            pl: 1.2 // Padding for the AppBar content
          }}
        >
          <Toolbar sx={{ minHeight: 98 }}>{children}</Toolbar> {/* Wrap the children in the Toolbar */}
        </AppBar>
        <Box sx={{ height: 98 }} /> {/* Space to align content */}
      </Box>

      {/* Mobile version of the AppBar */}
      <Box
        sx={{
          display: { sm: 'none', xs: 'block' } // Show only on mobile screens (xs)
        }}
      >
        {children} {/* Render children directly for mobile */}
      </Box>
    </>
  );
}
