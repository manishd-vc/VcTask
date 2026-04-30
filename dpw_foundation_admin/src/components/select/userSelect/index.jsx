'use client';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';
// mui
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

// components
import { UserList } from 'src/components/lists';
import MenuPopover from 'src/components/popover/popover';
// redux
import { useSelector } from 'react-redux';
import { DropDownArrow, UserIcon } from 'src/components/icons';

export default function UserSelect() {
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const router = useRouter();
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up('md'));

  const handleOpenUser = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setOpen(true);
    }
  };
  const handleCloseUser = () => {
    setOpen(false);
  };
  return (
    <>
      <Stack
        ref={anchorRef}
        flexDirection="row"
        gap={1}
        alignItems="center"
        flexWrap="nowrap"
        onClick={handleOpenUser}
        sx={{ cursor: 'pointer' }}
      >
        <UserIcon />
        {isNotMobile && (
          <Typography variant="body2" color="text.secondarydark" noWrap>
            Welcome, {user?.firstName}
          </Typography>
        )}
        <DropDownArrow />
      </Stack>

      <MenuPopover
        open={open}
        onClose={handleCloseUser}
        anchorEl={anchorRef.current}
        sx={{ minWidth: 300 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <UserList openUser={open} isAuthenticated={isAuthenticated} user={user} setOpen={() => setOpen(false)} />
      </MenuPopover>
    </>
  );
}
