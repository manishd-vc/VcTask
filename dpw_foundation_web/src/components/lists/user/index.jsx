import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
// redux
import { useDispatch } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
// mui
import { Link, MenuItem, Stack, useMediaQuery } from '@mui/material';
// icons

// styles
import RootStyled from './styled';
// hooks
import React from 'react';
import { deleteCookies } from 'src/hooks/cookies';
import { setProfileData } from 'src/redux/slices/profile';
import * as api from 'src/services';

UserList.propTypes = {
  openUser: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default function UserList({ ...props }) {
  const { openUser, setOpen } = props;
  const isMobile = useMediaQuery('(max-width:900px)');
  const router = useRouter();
  const dispatch = useDispatch();

  const onLogout = async () => {
    await api.logout();
    deleteCookies('token');
    deleteCookies('userToken');
    deleteCookies('refreshToken');
    localStorage.removeItem('redux-user');
    localStorage.removeItem('redux-settings');
    localStorage.removeItem('redux-profile');
    dispatch(setProfileData(null));
    dispatch(setLogout());
    setOpen(false);
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 1000);
  };

  return (
    <RootStyled autoFocusItem={openUser} id="composition-menu">
      {window.location.pathname.includes('/user/') ? (
        <React.Fragment>
          <MenuItem
            className="menu-item"
            onClick={() => {
              router.push('/');
              setOpen(false);
            }}
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpen(false);
              router.push('/user/settings');
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpen(false);
              router.push('/user/change-password');
            }}
          >
            Change Password
          </MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {!isMobile ? (
            <React.Fragment>
              <MenuItem
                onClick={() => {
                  setOpen(false);
                  router.push('/user/settings');
                }}
              >
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setOpen(false);
                  router.push('/user/change-password');
                }}
              >
                Change Password
              </MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </React.Fragment>
          ) : (
            <Stack flexDirection="column" spacing={1}>
              <Link
                variant="sidebarMobileMenu"
                color="sidebarmobilemenu"
                underline="none"
                textTransform="uppercase"
                onClick={() => {
                  setOpen(false);
                  router.push('/user/settings');
                }}
              >
                My Profile
              </Link>

              <Link
                variant="sidebarMobileMenu"
                color="sidebarmobilemenu"
                underline="none"
                textTransform="uppercase"
                onClick={() => {
                  setOpen(false);
                  router.push('/user/change-password');
                }}
              >
                Change Password
              </Link>
              <Link
                variant="sidebarMobileMenu"
                color="sidebarmobilemenu"
                underline="none"
                textTransform="uppercase"
                onClick={onLogout}
              >
                Logout
              </Link>
            </Stack>
          )}
        </React.Fragment>
      )}
    </RootStyled>
  );
}
