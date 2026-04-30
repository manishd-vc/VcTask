import LoginBanner from '../../../public/images/auth-page-banner.jpg';

const LoginStyle = {
  wrapper: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${LoginBanner.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden'
  },
  main: {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: { xs: 2, sm: '0 2rem', md: '0 4.5rem 0 0' }
  },
  card: {
    padding: { xs: '1rem', md: '2rem' },
    maxWidth: { xs: '100%', sm: '100%', md: '430px' },
    minWidth: { xs: '100%', sm: '300px', md: '430px' }
  },
  inner: { width: '100%', textAlign: 'center' },
  logoStyle: {
    cursor: 'pointer',
    textAlign: 'center',
    img: {
      width: 135,
      height: 'auto'
    }
  },
  sidebarLogo: {
    cursor: 'pointer',
    textAlign: 'center',
    py: '44px',
    pl: '10px',
    width: '210px',
    img: {
      width: '100%',
      height: 'auto'
    }
  },
  cardBottomBtn: {
    display: 'flex',
    justifyContent: 'center',
    mt: 3
  },
  optDisabled: {
    textDecoration: 'underline',
    fontWeight: 300,
    m: 0,
    p: 0,
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: 'transparent'
    },
    '&.Mui-disabled': {
      backgroundColor: 'transparent',
      padding: 0,
      margin: '0 0 0 5px',
      color: (theme) => theme.palette.grey[500]
    }
  }
};

export default LoginStyle;
