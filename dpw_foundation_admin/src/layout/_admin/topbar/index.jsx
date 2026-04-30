'use client';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

// mui
import { alpha, Box, IconButton, Skeleton, Stack, styled, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';

// icons

// components
import { HamburgerMenu } from 'src/components/icons';
import SidebarLogo from 'src/components/sidebarLogo';
import SidebarStyles from '../sidebar/sidebar.styles';
import NotificationsPopover from './NotificationPopover';

// dynamic import
const UserSelect = dynamic(() => import('src/components/select/userSelect'), {
  ssr: false,
  loading: () => <Skeleton variant="circular" width={50} height={50} />
});

/**
 * Styled AppBar component with custom styles.
 * @param {Object} theme - The theme object used for styling.
 * @returns {JSX.Element} The styled AppBar component.
 */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  backgroundColor: alpha(theme.palette.background.default, 1),
  borderBottom: '1px solid ' + theme.palette.divider
}));

/**
 * Topbar component displays a navigation bar at the top with a hamburger menu, logo, notifications, and user select dropdown.
 *
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.drawerState - Determines if the sidebar is open.
 * @param {Function} props.handleDrawerOpen - Function to open the sidebar.
 * @param {Function} props.handleDrawerClose - Function to close the sidebar.
 * @returns {JSX.Element} The Topbar component rendered.
 */
export default function Topbar({ drawerState, handleDrawerOpen, handleDrawerClose }) {
  const theme = useTheme();
  const style = SidebarStyles(theme);

  // Determine if the screen size is small
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Toggles the sidebar open/close state based on the current state.   */

  const handleHamburgerClick = () => {
    if (isMobile) {
      // For mobile, toggle drawer state
      if (drawerState === 'closed') {
        handleDrawerOpen(); // Open the sidebar
      } else {
        handleDrawerClose(); // Close the sidebar
      }
    }
  };

  return (
    <AppBar position="sticky" open={drawerState === 'open'} sx={{ zIndex: 11 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" gap={2}>
          <IconButton
            aria-label="open drawer"
            onClick={handleHamburgerClick}
            edge="start"
            sx={{
              display: { xs: 'flex', md: 'none' } // Show hamburger only on mobile
            }}
            size="large"
          >
            <HamburgerMenu />
          </IconButton>
          {isMobile && (
            <Box sx={style.topHeaderLogo}>
              <SidebarLogo />
            </Box>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" gap={2}>
          <NotificationsPopover />
          <UserSelect />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

/**
 * Prop types for the Topbar component.
 */
Topbar.propTypes = {
  drawerState: PropTypes.oneOf(['open', 'closed']).isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};
