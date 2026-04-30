'use client';
import { AppBar, Box, Container, Drawer, IconButton, Skeleton, Stack, useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { CloseIconWhite, HamburgerMenu, HamburgerWhiteMenu } from 'src/components/icons';
import Logo from 'src/components/logo';
import config from 'src/layout/_main/config.json';
import MenuDesktop from '../actionbar/menuDesktop';
import MenuMobile from '../actionbar/menuMobile';
// components

// dynamic import components
const UserSelect = dynamic(() => import('src/components/select/userSelect'), {
  ssr: false,
  loading: () => (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Skeleton variant="circular" width={40} height={40} />
    </Stack>
  )
});
const { menu } = config;

const drawerWidth = '100%';
// ----------------------------------------------------------------------
export default function Navbar() {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  React.useEffect(() => {
    const simpleBarContainer = document.querySelector('.simplebar-content-wrapper');

    const handleScroll = () => {
      if (simpleBarContainer.scrollTop > 50) {
        setTrigger(true);
      } else {
        setTrigger(false);
      }
    };

    if (simpleBarContainer) {
      simpleBarContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (simpleBarContainer) {
        simpleBarContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  const drawer = (
    <Box>
      <Stack
        flexDirection="row"
        gap={2}
        sx={{ px: '0px!important' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Logo logoType="white" />
        </Box>
        <Box>
          <IconButton
            color="inherit"
            aria-label="close drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'block', md: 'none' } }}
          >
            <CloseIconWhite />
          </IconButton>
        </Box>
      </Stack>
      <MenuMobile navConfig={menu} />
    </Box>
  );
  return (
    <>
      <AppBar
        position="fixed"
        variant="main"
        sx={(theme) => ({
          top: '0!important',
          background: trigger
            ? theme.palette.grey[500]
            : 'linear-gradient(90deg, rgba(0, 0, 0, 0) 75.13%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 71.03%)',
          padding: theme.spacing(1),
          color: trigger ? theme.palette.common.black : theme.palette.common.white,
          backdropFilter: 'blur(40px)'
        })}
      >
        <Container maxWidth="xl">
          <Stack
            flexDirection="row"
            gap={2}
            sx={{ paddingLeft: { xs: 0, md: '2.5rem' }, paddingRight: { xs: 0, md: '2.5rem' } }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              sx={{
                maxWidth: trigger ? '136px ' : '100%'
              }}
            >
              <Logo logoType={trigger ? 'black' : 'white'} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {!isMobile && (
                <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                  <MenuDesktop navConfig={menu} trigger={trigger} />
                </Box>
              )}
              <Box sx={{ marginLeft: 'auto' }}>
                <Stack flexDirection="row" gap={4} alignItems="center">
                  {!isMobile && <UserSelect trigger={trigger} />}
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                  >
                    {trigger ? <HamburgerMenu /> : <HamburgerWhiteMenu />}
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Container>
      </AppBar>
      <Drawer
        variant="sideBar"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        slotProps={{
          paper: { component: 'div' } // Replace Paper with a div
        }}
        sx={{
          display: { sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
