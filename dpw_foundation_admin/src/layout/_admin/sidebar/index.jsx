import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
// mui
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
// components
import { useQuery } from 'react-query';
import Scrollbar from 'src/components/Scrollbar';
import SidebarLogo from 'src/components/sidebarLogo';
// api
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon, DropDownArrow, UpArrow } from 'src/components/icons.jsx';
import { createCookies } from 'src/hooks/cookies';
import { setAssignedRoles } from 'src/redux/slices/roles';
import * as api from 'src/services';
import { checkPermissions } from 'src/utils/permissions';
import navLinks from 'src/utils/sidebarLinks.js';
import { default as SidebarStyles } from './sidebar.styles.jsx';

// Drawer width constant
const drawerWidth = 272;

/**
 * Mixin for the opened drawer state.
 *
 * @param {Object} theme - The MUI theme object.
 * @returns {Object} - The styles for the opened drawer.
 */
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  borderRadius: 0,
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});

/**
 * Mixin for the closed drawer state.
 *
 * @param {Object} theme - The MUI theme object.
 * @returns {Object} - The styles for the closed drawer.
 */
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `0px`,
  borderRadius: 0,
  [theme.breakpoints.up('md')]: {
    width: `calc(${theme.spacing(9)} + 1px)`
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});

// Drawer component styled
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  zIndex: 999,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

// Helper function to check if a path is active for dashboard
const isDashboardActive = (pathname) => {
  return pathname === '/admin/dashboard' || pathname === '/admin' || pathname === '/';
};

// Helper function to check if a main menu item is active
const isMainMenuActive = (pathname, item) => {
  return (
    pathname === `/admin/${item.slug}` ||
    pathname.startsWith(`/admin/${item.slug}/`) ||
    item.subMenu?.some((subItem) => pathname.startsWith(`/admin/${subItem.slug}`))
  );
};

// Helper function to check if a submenu item is active
const isSubMenuActive = (pathname, subItem) => {
  return pathname === `/admin/${subItem.slug}` || pathname.startsWith(`/admin/${subItem.slug}/`);
};

// Helper function to get active item styles
const getActiveItemStyles = (isActive) => ({
  cursor: 'pointer',
  ...(isActive && {
    '&::after': {
      background: (theme) => theme.palette.secondary.darker
    }
  })
});

// Helper function to get active text styles
const getActiveTextStyles = (isActive) => ({
  whiteSpace: 'normal',
  ...(isActive && {
    fontWeight: 600
  })
});

/**
 * Sidebar component containing navigation links and submenus.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.handleDrawerClose - Function to handle closing the drawer.
 * @param {boolean} props.open - Flag indicating if the sidebar is open.
 *
 * @returns {JSX.Element} - The Sidebar component.
 */
export default function Sidebar({ handleDrawerClose, open, handleDrawerOpen }) {
  const theme = useTheme();
  const style = SidebarStyles(theme);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const [openSubmenu, setOpenSubmenu] = useState({});
  const tooltipTitle = '';

  // Fetch assigned roles and store them in Redux and cookies
  useQuery('assignRoles', api.assignRoles, {
    enabled: isAuthenticated,
    onSuccess: async (response) => {
      dispatch(setAssignedRoles(response?.data?.assignedFunctions));
      await createCookies('assignRoles', response?.data?.assignedFunctions);
    }
  });
  const handleHamburgerClick = () => {
    if (isMobile) {
      if (open == 'true') {
        handleDrawerClose();
      } else {
        handleDrawerOpen();
      }
    }
  };
  /**
   * Toggles the submenu visibility for a specific item.
   *
   * @param {string} id - The unique identifier of the item.
   */
  const handleSubmenuToggle = (id) => {
    setOpenSubmenu((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {isMobile && !open && <Box onClick={handleHamburgerClick} sx={style.overLappingBg} />}
      <Drawer variant="permanent" open={isMobile ? !open : open} sx={style.sideBarDrawer}>
        <Box sx={style.sideBarLogo}>
          {isMobile && !open && (
            <>
              <IconButton aria-label="open drawer" onClick={handleHamburgerClick} sx={style.CloseIcon}>
                <CloseIcon />
              </IconButton>
              <SidebarLogo style={{ cursor: 'pointer', mt: '2rem' }} onClick={handleHamburgerClick} />
            </>
          )}
          {!isMobile && <SidebarLogo style={{ cursor: 'pointer' }} onClick={handleHamburgerClick} />}
        </Box>

        <Scrollbar sx={{ height: 1 }}>
          <List>
            <ListItem
              sx={getActiveItemStyles(isDashboardActive(pathname))}
              onClick={() => {
                router.push('/admin/dashboard');
                isMobile && handleDrawerOpen();
              }}
            >
              <ListItemText sx={{ overflow: 'hidden', textTransform: 'uppercase' }}>
                <Typography
                  sx={getActiveTextStyles(isDashboardActive(pathname))}
                  variant="sidebarmenu"
                  color="text.black"
                >
                  Dashboard
                </Typography>
              </ListItemText>
            </ListItem>
            {navLinks?.map(
              (item) =>
                checkPermissions(rolesAssign, item?.permission) && (
                  <React.Fragment key={item.id}>
                    <ListItem
                      disablePadding
                      onClick={() => {
                        if (item.subMenu) {
                          handleSubmenuToggle(item.id);
                        } else {
                          router.push('/admin/' + item.slug);
                          isMobile && handleDrawerOpen();
                        }
                      }}
                      sx={getActiveItemStyles(isMainMenuActive(pathname, item))}
                    >
                      <Tooltip title={tooltipTitle} placement="left" arrow leaveDelay={200}>
                        <ListItemText sx={{ overflow: 'hidden', textTransform: 'uppercase' }}>
                          <Typography
                            sx={getActiveTextStyles(isMainMenuActive(pathname, item))}
                            variant="sidebarmenu"
                            color="text.black"
                          >
                            {item.title}
                          </Typography>
                        </ListItemText>
                      </Tooltip>
                      {/* Display arrow icon */}
                      {item.subMenu && (
                        <Box sx={{ ml: 1 }}>{openSubmenu[item?.id] ? <UpArrow /> : <DropDownArrow />}</Box>
                      )}
                    </ListItem>
                    {/* Submenu */}
                    {item.subMenu && (
                      <Collapse in={openSubmenu[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subMenu.map((subItem) => {
                            const hasPermission = checkPermissions(rolesAssign, subItem?.permission);
                            return (
                              hasPermission && (
                                <ListItem
                                  key={subItem.id}
                                  disablePadding
                                  onClick={() => {
                                    router.push('/admin/' + subItem.slug);
                                    isMobile && handleDrawerOpen();
                                  }}
                                  sx={{ pl: 4, cursor: 'pointer' }} // Indentation for submenu
                                >
                                  <Tooltip title={open ? '' : subItem.title} placement="left" arrow leaveDelay={200}>
                                    <ListItemText sx={{ overflow: 'hidden', textTransform: 'uppercase' }}>
                                      <Typography
                                        sx={getActiveTextStyles(isSubMenuActive(pathname, subItem))}
                                        variant="sidebarmenu"
                                        color="text.black"
                                      >
                                        {subItem.title}
                                      </Typography>
                                    </ListItemText>
                                  </Tooltip>
                                </ListItem>
                              )
                            );
                          })}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                )
            )}
          </List>
        </Scrollbar>
      </Drawer>
    </>
  );
}

Sidebar.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  open: PropTypes.oneOf(['open', 'closed']).isRequired
};
