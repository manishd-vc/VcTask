const CampaignStyle = (theme) => ({
  campaignBanner: {
    width: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    minHeight: '600px',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '140px 0 40px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 15, 25, 0.64)', // Dark overlay
      zIndex: 1
    },
    [theme.breakpoints.down('sm')]: {
      padding: '100px 0 20px' // Adjust padding for mobile screens
    }
  },
  bannerContent: { height: '100%', zIndex: '9', position: 'relative' },
  listItem: {
    '& .MuiListItemIcon-root img': {
      height: 32,
      width: 32
    }
  },
  iconContainer: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': { marginTop: 1.5 }
  }
});

export default CampaignStyle;
