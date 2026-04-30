// Importing required libraries and components
'use client';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// mui components
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { alpha, styled } from '@mui/material/styles';

// PropTypes validation for the ButtonAppBar component
ButtonAppBar.propTypes = {
  children: PropTypes.node.isRequired // The children passed into ButtonAppBar must be React nodes
};

// Drawer width for AppBar when sidebar is open
const drawerWidth = 240;

// Styled AppBar component using MUI's styled utility
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' // Ensures that the 'open' prop is not forwarded to the DOM element
})(({ theme, open }) => ({
  // Basic styles for AppBar
  boxShadow: 'none', // Removes the default shadow
  backdropFilter: 'blur(6px)', // Applies a blur effect to the background
  WebkitBackdropFilter: 'blur(6px)', // Fix for Mobile browsers that don't support backdropFilter
  background: alpha(theme.palette.background.default, 0.72), // Semi-transparent background color using theme colors
  borderBottom: '1px solid ' + theme.palette.divider, // Border at the bottom of the AppBar
  borderRadius: 0, // No border-radius
  top: 65, // Setting top margin to push the AppBar down
  width: `calc(100% - ${65}px)`, // Dynamic width to account for left offset
  zIndex: theme.zIndex.drawer + 1, // Ensures AppBar stays on top of the drawer
  transition: theme.transitions.create(['width', 'margin'], {
    // Smooth transition for width and margin changes
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),

  // If the sidebar is open, adjust the AppBar's width and margin
  ...(open && {
    marginLeft: drawerWidth, // Moves AppBar when sidebar is open
    width: `calc(100% - ${drawerWidth}px)`, // Adjusts width when sidebar is open
    transition: theme.transitions.create(['width', 'margin'], {
      // Smooth transition when opening the sidebar
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }),

  // Responsive behavior for medium screens and below
  [theme.breakpoints.down('md')]: {
    width: '100%', // AppBar takes full width on smaller screens
    left: 0 // Aligns the AppBar to the left on small screens
  }
}));

// ButtonAppBar component that accepts children to be rendered inside the AppBar
export default function ButtonAppBar({ children }) {
  // Fetching the 'openSidebar' state from Redux store
  const { openSidebar } = useSelector((state) => state.settings);

  return (
    <>
      {/* Box container for larger screens */}
      <Box
        sx={{
          flexGrow: 1, // Ensures the Box takes up available space
          width: 1, // Full width
          mb: 2, // Margin-bottom to separate from other content
          display: { sm: 'block', xs: 'none' } // Display Box only on screens larger than 'sm'
        }}
      >
        {/* AppBar component with custom styles */}
        <AppBar
          open={openSidebar} // Passes the openSidebar state to AppBar for dynamic styling
          sx={{
            zIndex: 997 + '!important', // Ensure AppBar stays on top with high priority
            pl: 1.2 // Padding-left for AppBar content
          }}
        >
          <Toolbar sx={{ minHeight: 48 }}>{children}</Toolbar> {/* Toolbar holds the children (content) */}
        </AppBar>
        {/* Extra Box to maintain spacing between AppBar and next content */}
        <Box sx={{ height: 48 }} />
      </Box>

      {/* Box container for smaller screens */}
      <Box
        sx={{
          display: { sm: 'none', xs: 'block' } // Show Box only on small screens
        }}
      >
        {children} {/* Render the children directly for small screens */}
      </Box>
    </>
  );
}
