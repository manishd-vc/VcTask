import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React from 'react';

// mui
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemText,
  styled,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

// icons
import { IoSettingsOutline } from 'react-icons/io5';
import { DropDownArrow, UpArrow } from 'src/components/icons.jsx';
import SidebarLogo from 'src/components/sidebarLogo';
// components

import Link from 'next/link.js';
import { useSelector } from 'react-redux';
import Scrollbar from 'src/components/Scrollbar';
import { default as SidebarStyles } from './sidebar.styles.jsx';

// Dashboard Side NevLinks
export const navLinks = [
  {
    id: 1,
    title: 'My Donations',
    slug: 'my-donations',
    icon: <IoSettingsOutline />,
    isSearch: false
  },
  {
    id: 2,
    title: 'My Profile',
    slug: 'settings',
    icon: <IoSettingsOutline />,
    isSearch: false
  },
  {
    id: 3,
    title: 'My Grants',
    slug: 'my-grants',
    icon: <IoSettingsOutline />,
    isSearch: false
  },
  {
    id: 4,
    title: 'My Partnerships',
    slug: 'my-partnerships',
    icon: <IoSettingsOutline />,
    isSearch: false
  },
  {
    id: 5,
    title: 'My Enrolments',
    slug: 'my-enrolments',
    icon: <IoSettingsOutline />,
    isSearch: false
  },
  {
    id: 6,
    title: 'My In-Kind Contributions',
    slug: 'in-kind-contribution',
    icon: <IoSettingsOutline />,
    isSearch: false,
    subMenu: [
      {
        id: 1,
        title: 'In-Kind Contribution Requests',
        slug: 'in-kind-contribution',
        path: '/user/in-kind-contribution'
      },
      {
        id: 2,
        title: 'All Projects',
        slug: 'all-projects',
        path: '/user/all-projects'
      }
    ]
  }
];
const drawerWidth = 272;
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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  zIndex: 11,
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

export default function Sidebar({ handleDrawerClose, open }) {
  const theme = useTheme();
  const style = SidebarStyles(theme);
  const router = useRouter();
  const pathname = usePathname();
  const { profileData } = useSelector((state) => state.profile);
  const [initial, setInitial] = React.useState(false);
  const [openSubmenu, setOpenSubmenu] = React.useState({});
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const contributed = profileData?.contributedAs ?? [];

  React.useEffect(() => {
    setInitial(true);
  }, [pathname]);

  const isActiveRoute = (slug) => {
    const basePath = '/user/' + slug;
    return pathname === basePath || pathname.startsWith(basePath + '/');
  };

  const isMainMenuActive = (item) => {
    return isActiveRoute(item.slug) || item.subMenu?.some((subItem) => pathname.startsWith(subItem.path));
  };

  const handleSubmenuToggle = (id) => {
    setOpenSubmenu((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderListItem = (item) => (
    <React.Fragment key={item.id}>
      <ListItem
        disablePadding
        onClick={() => {
          if (item.subMenu) {
            handleSubmenuToggle(item.id);
          } else {
            router.push('/user/' + item.slug);
            isMobile && handleDrawerClose();
          }
        }}
        sx={{
          cursor: 'pointer',
          ...(isMainMenuActive(item) &&
            initial && {
              '&::after': {
                background: (theme) => theme.palette.secondary.darker
              }
            })
        }}
      >
        <ListItemText
          sx={{
            overflow: 'hidden',
            textTransform: 'uppercase'
          }}
        >
          <Typography
            sx={{
              ...(isMainMenuActive(item) &&
                initial && {
                  fontWeight: 600
                })
            }}
            variant="sidebarmenu"
            color="text.black"
          >
            {item.title}
          </Typography>
        </ListItemText>
        {item.subMenu && <Box sx={{ ml: 1 }}>{openSubmenu[item.id] ? <UpArrow /> : <DropDownArrow />}</Box>}
      </ListItem>
      {item.subMenu && (
        <Collapse in={openSubmenu[item.id]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subMenu.map((subItem) => (
              <ListItem
                key={subItem.id}
                disablePadding
                onClick={() => {
                  router.push(subItem.path);
                  isMobile && handleDrawerClose();
                }}
                sx={{ pl: 4, cursor: 'pointer' }}
              >
                <ListItemText sx={{ overflow: 'hidden', textTransform: 'uppercase' }}>
                  <Typography
                    sx={{
                      ...(pathname.startsWith(subItem.path) &&
                        initial && {
                          fontWeight: 600
                        })
                    }}
                    variant="sidebarmenu"
                    color="text.black"
                  >
                    {subItem.title}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );

  const shouldRenderItem = (item) => {
    if (item?.slug === 'my-donations' && !contributed?.includes('DONOR')) {
      return null;
    }
    if (item?.slug === 'my-grants' && !profileData?.firstGrantAccepted) {
      return null;
    }
    if (item?.slug === 'my-partnerships' && !contributed?.includes('PARTNER')) {
      return null;
    }
    if (item?.slug === 'my-enrolments' && !contributed?.includes('VOLUNTEER')) {
      return null;
    }
    if (item?.slug === 'in-kind-contribution' && !contributed?.includes('BENEFICIARY')) {
      return null;
    }

    return renderListItem(item);
  };

  return (
    <div>
      <Drawer variant="permanent" open={isMobile ? !open : open} sx={style.sideBarDrawer}>
        <Box sx={style.sideBarLogo}>
          {!isMobile && (
            <Link href="/" passHref>
              <SidebarLogo style={{ cursor: 'pointer' }} />
            </Link>
          )}
        </Box>
        <Scrollbar
          sx={{
            height: 1
          }}
        >
          <List>{navLinks?.map((item) => shouldRenderItem(item)).filter(Boolean)}</List>
        </Scrollbar>
      </Drawer>
    </div>
  );
}
Sidebar.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
