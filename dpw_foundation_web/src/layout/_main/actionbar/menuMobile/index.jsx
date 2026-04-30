import { useRouter } from 'next-nprogress-bar';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material
import { alpha, Box, Button, Link, Stack } from '@mui/material';

// icons
import { FaAngleDown } from 'react-icons/fa6';
import { RxDashboard } from 'react-icons/rx';

// components
import MenuDesktopPopover from 'src/components/popover/menuDesktop';
import UserSelectMobile from 'src/components/select/userSelectMobile';

// api

// ----------------------------------------------------------------------

MenuMobileItem.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isHome: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  isOffset: PropTypes.bool.isRequired,
  scrollPosition: PropTypes.any
};

function MenuMobileItem({ ...props }) {
  const { item, pathname, isHome, isOpen, isOffset, onOpen, scrollPosition, onClose, isLoading, data } = props;
  const { title, path, isDropdown } = item;
  const anchorRef = React.useRef(null);
  const isActive = pathname === path;
  if (isDropdown) {
    return (
      <>
        <Box
          sx={{
            flexGrow: 1
          }}
        >
          <Button
            ref={anchorRef}
            className={` ${isOffset && isHome && 'offset'}`}
            id="composition-button"
            aria-controls={isOpen ? 'composition-menu' : undefined}
            aria-expanded={isOpen ? 'true' : undefined}
            aria-haspopup="true"
            onClick={onOpen}
            variant="contained"
            color="primary"
            size="large"
            sx={{
              boxShadow: 'none',
              borderRadius: 0,
              width: 280,
              bgcolor: (theme) => alpha(theme.palette.common.black, 0.1),
              '&.arrow-icon': {
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }
            }}
            startIcon={<RxDashboard />}
            endIcon={<FaAngleDown size={14} className="arrow-icon" />}
          >
            {title}
          </Button>
        </Box>
        <MenuDesktopPopover
          isOpen={isOpen}
          scrollPosition={scrollPosition}
          onClose={onClose}
          isLoading={isLoading}
          data={data}
        />
      </>
    );
  }

  return (
    <Link
      key={title}
      href={path}
      component={NextLink}
      variant="sidebarMobileMenu"
      color="sidebarmobilemenu"
      underline="none"
      textTransform="uppercase"
      className={` ${isActive && 'active'}`}
    >
      {title}
    </Link>
  );
}

export default function MenuMobile({ ...props }) {
  const { isOffset, navConfig, isLeft } = props;

  const { pathname } = useRouter();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [scrollPosition, setScrollPosition] = useState(0);
  React.useLayoutEffect(() => {
    function updatePosition() {
      setScrollPosition(window.scrollY);
    }
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      sx={{
        width: 1,
        mt: 6,
        ...(isLeft && {
          ml: 0
        })
      }}
    >
      {navConfig.map((links) => (
        <Box key={`links_${links?.title}`} sx={{ pb: 1 }}>
          <MenuMobileItem
            scrollPosition={scrollPosition}
            item={links}
            data={[]}
            isLoading={false}
            pathname={pathname}
            isOpen={open}
            onOpen={handleOpen}
            onClose={handleClose}
            isOffset={isOffset}
            router={router}
          />
        </Box>
      ))}
      <UserSelectMobile />
    </Stack>
  );
}

MenuMobile.propTypes = {
  isLeft: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isOffset: PropTypes.bool.isRequired,
  navConfig: PropTypes.array.isRequired
};
