const HomeStyle = (theme) => ({
  bgGrey: {
    backgroundColor: theme.palette.backgrounds.light
  },
  sectionPadding: {
    paddingTop: theme.spacing(8),
    [theme.breakpoints.down('md')]: { paddingTop: theme.spacing(8) }
  },
  boxRightContent: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    height: '100%',
    right: 0,
    left: 0,
    '& > .MuiBox-root': { width: '50%' },
    '& h5': {
      marginBottom: theme.spacing(3)
    },
    [theme.breakpoints.down('md')]: {
      position: 'relative',
      display: 'block',
      marginTop: theme.spacing(3),
      '& > .MuiBox-root': { width: '100%' }
    }
  },
  boxLeftContent: {
    // width: '50%',
    // display: 'flex',
    // alignItems: 'center',
    // '& > .MuiContainer-root': {
    //   width: '100%'
    // },
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-start',
    height: '100%',
    right: 0,
    left: 0,
    '& > .MuiBox-root': { width: '50%' },
    '& h5': {
      marginBottom: theme.spacing(3)
    },
    [theme.breakpoints.down('md')]: {
      position: 'relative',
      display: 'block',
      marginTop: theme.spacing(3),
      '& > .MuiBox-root': { width: '100%' }
    }
  },
  boxLeftImage: {
    width: '50%',
    maxHeight: '500px',
    pr: '40px',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxHeight: 'fit-content',
      pr: '0',
      '& img': { maxWidth: '70%' }
    }
  },
  boxRightImage: {
    width: '50%',
    maxHeight: '650px',
    right: 0,
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxHeight: 'fit-content',
      pr: '0',
      '& img': { maxWidth: '70%' }
    }
  }
});

export default HomeStyle;
