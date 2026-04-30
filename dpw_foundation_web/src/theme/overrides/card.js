export default function Card(theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          zIndex: 0, // Fix Safari overflow: hidden with border radius
          border: 'none',
          transition: 'all ease-in-out 0.3s',
          background: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadiusNo,
          boxShadow: theme.shadows[9]
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: {
          variant: 'body2',
          marginTop: theme.spacing(0.5)
        }
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0)
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3)
        }
      }
    }
  };
}
