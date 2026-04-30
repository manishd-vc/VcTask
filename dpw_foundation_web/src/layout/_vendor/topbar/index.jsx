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
// dynamic imports
const UserSelect = dynamic(() => import('src/components/select/userSelect'), {
  ssr: false,
  loading: () => <Skeleton variant="circular" width={50} height={50} />
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  // backdropFilter: 'blur(6px)',
  // WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 1),
  borderBottom: '1px solid ' + theme.palette.divider
}));
export default function Topbar({ open, handleDrawerOpen, handleDrawerClose }) {
  const theme = useTheme();
  const style = SidebarStyles(theme);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const handleHamburgerClick = () => {
    open ? handleDrawerClose() : handleDrawerOpen();
  };
  return (
    <AppBar position="sticky" open={open}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" gap={2}>
          <IconButton
            aria-label="open drawer"
            onClick={handleHamburgerClick}
            edge="start"
            sx={{
              display: { xs: 'flex', md: 'none' }
            }}
            size="small"
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
          <NotificationsPopover isAdmin />
          <UserSelect isAdmin />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
Topbar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};
