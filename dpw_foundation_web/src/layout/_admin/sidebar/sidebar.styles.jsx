// mui

const SidebarStyles = (theme) => ({
  sideBarDrawer: {
    '&.MuiDrawer-root': {
      '.MuiPaper-root': {
        overflow: { xs: 'unset', md: 'unset' },
        px: 0
      }
    }
  },
  sideBarLogo: {
    paddingTop: 5,
    paddingBottom: 3,
    px: 1
  },
  topHeaderLogo: {
    '& img': {
      maxWidth: 'auto',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '165px'
      }
    }
  }
});

export default SidebarStyles;
