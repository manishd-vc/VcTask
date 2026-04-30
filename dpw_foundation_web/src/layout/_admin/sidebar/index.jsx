import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React from 'react';

// mui
import {
  alpha,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

// icons
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { BsBuildings, BsCart3, BsCashCoin, BsShop } from 'react-icons/bs';
import { FaRegBuilding } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuBadgePercent, LuLayoutDashboard, LuUsers } from 'react-icons/lu';
import { RiCoupon5Line } from 'react-icons/ri';
import { SlEnvolopeLetter } from 'react-icons/sl';
import { TbCategory2 } from 'react-icons/tb';
import { default as SidebarStyles } from './sidebar.styles.jsx';
// components
import Scrollbar from 'src/components/Scrollbar';
import { CloseIcon } from 'src/components/icons';

// Dashboard Side NevLinks
export const navlinks = [
  {
    id: 1,
    title: 'Dashboard',
    slug: 'dashboard',
    icon: <LuLayoutDashboard />
  },
  {
    id: 2,
    title: 'Categories',
    slug: 'categories',
    icon: <TbCategory2 />,
    isSearch: true
  },
  {
    id: 3,
    title: 'Sub Categories',
    slug: 'sub-categories',
    icon: <TbCategory2 />,
    isSearch: true
  },
  {
    id: 3,
    title: 'Brands',
    slug: 'brands',
    icon: <FaRegBuilding />,
    isSearch: true
  },
  {
    id: 4,
    title: 'Products',
    slug: 'products',
    icon: <BsShop />,
    isSearch: true
  },

  {
    id: 5,
    title: 'Orders',
    slug: 'orders',
    icon: <BsCart3 />,
    isSearch: true
  },
  {
    id: 6,
    title: 'Shops',
    slug: 'shops',
    icon: <BsBuildings />,
    isSearch: true
  },
  {
    id: 7,
    title: 'Users',
    slug: 'users',
    icon: <LuUsers />,
    isSearch: true
  },
  {
    id: 8,
    title: 'Payouts',
    slug: 'payouts',
    icon: <BsCashCoin />,
    isSearch: false
  },
  {
    id: 9,
    title: 'Coupon codes',
    slug: 'coupon-codes',
    icon: <RiCoupon5Line />,
    isSearch: true
  },
  {
    id: 122,
    title: 'Compaigns',
    slug: 'compaigns',
    icon: <LuBadgePercent />,
    isSearch: true
  },
  {
    id: 11,
    title: 'Currencies',
    slug: 'currencies',
    icon: <AiOutlineDollarCircle />,
    isSearch: true
  },

  {
    id: 12,
    title: 'Newsletter',
    slug: 'newsletter',
    icon: <SlEnvolopeLetter />,
    isSearch: false
  },
  {
    id: 13,
    title: 'Settings',
    slug: 'settings',
    icon: <IoSettingsOutline />,
    isSearch: false
  }
];

const drawerWidth = 240;
const openedMixin = (theme, isMobile) => ({
  width: isMobile ? '100%' : drawerWidth,
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
})(({ theme, open, isMobile }) => ({
  width: drawerWidth,
  zIndex: 11,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme, isMobile),
    '& .MuiDrawer-paper': openedMixin(theme, isMobile)
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
  const [active, setActive] = React.useState('');
  const [initial, setInitial] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  React.useEffect(() => {
    setActive(pathname);
    setInitial(true);
  }, [pathname]);
  return (
    <div>
      <Drawer variant="permanent" open={open} sx={style.sideBarDrawer} isMobile={isMobile}>
        <Box sx={style.sideBarLogo}>
          {isMobile && open ? ( // Show CloseIcon only when on mobile and Drawer is open
            <Box onClick={handleDrawerClose} sx={{ cursor: 'pointer', px: 2, pt: 2, display: 'inline-block' }}>
              <CloseIcon />
            </Box>
          ) : (
            <></>
          )}
        </Box>
        <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': {
              height: 1,
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <List
            sx={{
              px: 1.5,
              gap: 1,
              display: 'flex',
              flexDirection: 'column',
              py: 2
            }}
          >
            {navlinks.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                sx={{
                  display: 'block',
                  borderRadius: '8px',
                  border: `1px solid transparent`,
                  ...(active === '/admin/' + item.slug &&
                    initial && {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                      border: (theme) => `1px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main,
                      '& .MuiTypography-root': {
                        fontWeight: 600
                      }
                    })
                }}
              >
                <Tooltip title={open ? '' : item.title} placement="left" arrow leaveDelay={200}>
                  <ListItemButton
                    onClick={() => {
                      setActive(item.slug);
                      router.push('/admin/' + item.slug);
                      isMobile && handleDrawerClose();
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      borderRadius: '8px'
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.title}
                      sx={{
                        overflow: 'hidden',
                        height: open ? 'auto' : 0,
                        textTransform: 'capitalize'
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </div>
  );
}
Sidebar.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
