import LoginBanner from '../../../public/images/auth-page-banner.jpg';
// mui

const AuthStyles = {
  authBg: {
    backgroundImage: `url(${LoginBanner.src})`,
    backgroundPosition: 'center',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    px: 9,
    justifyContent: 'end',
    '@media (max-width:600px)': {
      px: 2,
      justifyContent: 'center'
    }
  },
  Paper: {
    p: 4,
    width: '100%',
    maxWidth: '430px',
    position: 'relative'
  }
};

export default AuthStyles;
