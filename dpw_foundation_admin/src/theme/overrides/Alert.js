import typography from '../typography';

export default function Alert(theme) {
  return {
    MuiAlert: {
      styleOverrides: {
        root: {
          padding: theme.spacing(4),
          background: theme.palette.primary.light,
          color: theme.palette.white,
          ...typography.body2
        },

        message: {
          fontWeight: '300'
        },
        action: {
          display: 'none'
        }
      }
    }
  };
}
