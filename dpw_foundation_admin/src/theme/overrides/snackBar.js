export default function SnackBar(theme) {
  return {
    MuiSnackbar: {
      styleOverrides: {
        root: {
          position: 'fixed',
          width: '100%',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important'
        }
      }
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          ...theme.typography.body3,
          backgroundColor: theme.palette.primary.light,
          borderRadius: 0,
          width: '100%',
          padding: theme.spacing(4),
          boxShadow: 'none',
          '& .MuiSnackbarContent-message': {
            padding: 0
          },
          '& .MuiTypography-root': { textTransform: 'uppercase', display: 'block', marginBottom: theme.spacing(2) }
        }
      }
    }
  };
}
