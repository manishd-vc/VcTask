'use client';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
// mui
import { Box, Link } from '@mui/material';
// components
import { PATH_PAGE } from 'src/routes/paths';
// redux
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import UserList from 'src/components/lists/user';
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
UserSelectMobile.propTypes = {
  isAdmin: PropTypes.bool.isRequired // isAdmin should be a boolean value
};
export default function UserSelectMobile({ isAdmin }) {
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const pathname = usePathname();
  const isAuthPath = getKeyByValue(PATH_PAGE.auth, pathname);
  const isHomePath = pathname.slice(3) === '';
  const [openUser, setOpenUser] = React.useState(false);
  const redirectPath = isAuthPath || isHomePath ? '' : `?redirect=${pathname}`;
  const loginHref = `/auth/login${redirectPath}`;
  const registerHref = `/auth/register${redirectPath}`;

  return (
    <>
      {!isAuthenticated && !isAdmin ? (
        <>
          <Box sx={{ pb: 1 }}>
            <Link
              variant="sidebarMobileMenu"
              color="sidebarmobilemenu"
              component={RouterLink}
              textTransform="uppercase"
              href={loginHref}
            >
              Login
            </Link>
          </Box>
          <Box sx={{ pb: 1 }}>
            <Link
              variant="sidebarMobileMenu"
              color="sidebarmobilemenu"
              component={RouterLink}
              textTransform="uppercase"
              href={registerHref}
            >
              Register
            </Link>
          </Box>
        </>
      ) : (
        <UserList
          openUser={openUser}
          isAuthenticated={isAuthenticated}
          user={user}
          setOpen={() => setOpenUser(false)}
        />
      )}
    </>
  );
}
