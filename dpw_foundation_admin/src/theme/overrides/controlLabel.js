export default function ControlLabel(theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.body1
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '18px',
          marginTop: theme.spacing(0.5),
          '&.Mui-error': {
            color: theme.palette.secondary.darker
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.disabled
        },
        asterisk: {
          color: `${theme.palette.error.main} !important`
        }
      }
    }
  };
}
