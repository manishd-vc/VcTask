'use client';
import { useRouter } from 'next-nprogress-bar';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
// mui
import { IconButton, Link, Stack, Typography } from '@mui/material';
// components
import { UserList } from 'src/components/lists';
import MenuPopover from 'src/components/popover/popover';
import { PATH_PAGE } from 'src/routes/paths';
// redux
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { DropDownArrow, DropDownArrowWhite, UserIcon } from 'src/components/icons';
UserSelect.propTypes = {
  isAdmin: PropTypes.bool.isRequired, // isAdmin should be a boolean value
  trigger: PropTypes.bool
};
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function UserSelect({ isAdmin, trigger }) {
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = getKeyByValue(PATH_PAGE.auth, pathname);
  const isHomePath = pathname.slice(3) === '';
  const anchorRef = React.useRef(null);
  const [openUser, setOpenUser] = React.useState(false);
  const handleOpenUser = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setOpenUser(true);
    }
  };
  const handleCloseUser = () => {
    setOpenUser(false);
  };
  const redirectPath = isAuthPath || isHomePath ? '' : `?redirect=${pathname}`;
  const loginHref = `/auth/login${redirectPath}`;
  const registerHref = `/auth/register${redirectPath}`;
  const getTypographyVariant = (isAdmin) => (isAdmin ? 'body2' : 'body3');

  const getTypographySx = (isAdmin, trigger) => {
    if (isAdmin) return { color: 'black', fontWeight: 300 };
    return { color: trigger ? 'black' : 'white', fontWeight: 400 };
  };
  return (
    <>
      {!isAuthenticated && !isAdmin ? (
        <Stack direction="row" gap={3}>
          <Link
            component={RouterLink}
            href={loginHref}
            variant="body3"
            color="toplink"
            underline="none"
            sx={{
              fontWeight: 400,
              fontSize: '0.875rem',
              color: (theme) => (trigger ? theme.palette.common.black : theme.palette.common.white),
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Login
          </Link>
          <Link
            component={RouterLink}
            href={registerHref}
            variant="body3"
            color="toplink"
            underline="none"
            sx={{
              fontWeight: 400,
              fontSize: '0.875rem',
              color: (theme) => (trigger ? theme.palette.common.black : theme.palette.common.white),
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Register
          </Link>
        </Stack>
      ) : (
        <>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            flexWrap="nowrap"
            ref={anchorRef}
            onClick={handleOpenUser}
            name="user-select"
            sx={{ cursor: 'pointer' }}
          >
            <IconButton
              size="large"
              sx={
                isAdmin
                  ? { width: 40, height: 40, '& img': { filter: 'none' } }
                  : { width: 40, height: 40, '& img': { filter: trigger ? 'none' : 'invert(1)' } }
              }
            >
              <UserIcon />
            </IconButton>
            <Typography
              variant={getTypographyVariant(isAdmin)}
              noWrap
              sx={getTypographySx(isAdmin, trigger)}
              textTransform={'capitalize'}
            >
              Welcome,&nbsp;{user?.firstName}
            </Typography>
            {(() => {
              const DropdownComponent = isAdmin || trigger ? DropDownArrow : DropDownArrowWhite;
              return <DropdownComponent />;
            })()}
          </Stack>
          <MenuPopover
            open={openUser}
            onClose={handleCloseUser}
            anchorEl={anchorRef.current}
            sx={{
              minWidth: 300
            }}
          >
            <UserList
              openUser={openUser}
              isAuthenticated={isAuthenticated}
              user={user}
              setOpen={() => setOpenUser(false)}
            />
          </MenuPopover>
        </>
      )}
    </>
  );
}
