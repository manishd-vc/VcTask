export default function Lists(theme) {
  return {
    MuiListItem: {
      styleOverrides: {
        root: {
          minHeight: '85px',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            background: theme.palette.gradients.black,
            height: '1.5px',
            width: '100%'
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.secondary.darker,
            '&:hover': {
              backgroundColor: theme.palette.action.selected // Background for selected item on hover
            }
          }
        },
        gutters: {
          padding: `${theme.spacing(1.5)} ${theme.spacing(2)} ${theme.spacing(1.5)} ${theme.spacing(2)}`
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(2)
        }
      }
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: theme.spacing(2)
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          ...theme.typography.sidebarmenu,
          marginTop: 0,
          marginBottom: 0
        },
        multiline: {
          marginTop: 0,
          marginBottom: 0
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          ...theme.typography.body1,
          padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
          color: theme.palette.secondary.darker,
          transition: theme.transitions.create('all'),
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            fontWeight: '400'
          }
        }
      }
    }
  };
}
