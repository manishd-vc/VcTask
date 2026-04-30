export default function Dialog(theme) {
  return {
    MuiDialog: {
      defaultProps: {
        dir: theme.direction
      },
      styleOverrides: {
        root: {
          zIndex: theme.zIndex.modal
        },
        paper: {
          width: 'calc(100% - 32px)',
          [theme.breakpoints.down('sm')]: {
            margin: theme.spacing(3)
          },
          [theme.breakpoints.up('sm')]: {
            margin: theme.spacing(5)
          },
          '&.MuiPaper-rounded': {
            borderRadius: theme.shape.borderRadius
          },
          '&.MuiDialog-paperFullScreen': {
            borderRadius: 0
          },
          '&.MuiDialog-paper .MuiDialogActions-root': {
            padding: theme.spacing(1.5, 4, 4, 4)
          },
          '@media (max-width: 600px)': {
            margin: theme.spacing(2)
          },
          '@media (max-width: 663.95px)': {
            '&.MuiDialog-paperWidthSm.MuiDialog-paperScrollBody': {
              maxWidth: '100%'
            }
          }
        },
        paperFullWidth: {
          width: '100%'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(4, 4, 2)
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderTop: 0,
          borderBottom: 0,
          padding: theme.spacing(2, 4, 4, 4)
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1.5)
          }
        }
      }
    }
  };
}
