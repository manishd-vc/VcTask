// mui

const AuthThemeStyles = {
  authTitle: {
    my: 3,
    lineHeight: '1.2',
    textTransform: 'uppercase'
  },
  backButton: {
    position: 'absolute',
    left: (theme) => theme.spacing(2.5),
    top: (theme) => theme.spacing(2.5),
    '&:hover': {
      textDecoration: 'none'
    }
  },
  otpInput: {
    input: {
      height: 70,
      minWidth: 74,
      bgcolor: (theme) => theme.palette.greytheme[200],
      color: (theme) => theme.palette.secondary.darker,
      border: 'none',
      fontWeight: (theme) => theme.typography.h5,
      '&:focus': {
        borderColor: '#1976d2',
        outline: 'none',
        border: 'none'
      }
    }
  }
};

export default AuthThemeStyles;
