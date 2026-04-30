export default function Switch(theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 68,
          padding: 0,
          height: 32,
          marginRight: theme.spacing(2.5)
        },
        thumb: {
          height: 32,
          width: 32,
          '&.Mui-checked': {
            color: theme.palette.success.main
          }
        },
        track: {
          width: 'calc(100% + 12px)',
          opacity: 1,
          borderRadius: 18,
          background: theme.palette.gradients.switchOpposite,
          transition: theme.transitions.create(['background-color'], {
            duration: theme.transitions.duration.short
          })
        },
        switchBase: {
          left: 0,
          right: 'auto',
          padding: 0,
          '& .MuiSwitch-input': {
            width: 68,
            left: 0
          },
          '&.Mui-checked': {
            color: theme.palette.success.main,
            transform: 'translateX(36px)'
          },
          '&.Mui-checked + .MuiSwitch-track': {
            background: theme.palette.gradients.switch
          },
          '&:not(.Mui-checked)': {
            color: theme.palette.error.main
          },
          '&.Mui-checked.Mui-disabled, &.Mui-disabled': {
            color: theme.palette.backgrounds.light,
            boxShadow: theme.shadows[11]
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 1,
            background: theme.palette.gradients.switch
          }
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          verticalAlign: 'middle',
          WebkitTapHighlightColor: 'transparent',
          marginLeft: 0, // Remove left margin
          marginRight: 0 // Remove right margin
        }
      }
    }
  };
}
