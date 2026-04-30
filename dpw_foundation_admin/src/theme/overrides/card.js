export default function Card(theme) {
  return {
    MuiCard: {
      variants: [
        {
          props: { variant: 'bordered' },
          style: {
            border: `1px solid ${theme.palette.common.black}`,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            borderRadius: theme.spacing(1),
            '& .MuiCardContent-root': {
              padding: theme.spacing(2),
              '&:last-child': {
                paddingBottom: theme.spacing(2)
              }
            }
          }
        },
        {
          props: { variant: 'borderednoshadow' },
          style: {
            border: `1px solid ${theme.palette.grey[300]}`,
            '& .MuiCardContent-root': {
              padding: theme.spacing(2),
              '&:last-child': {
                paddingBottom: theme.spacing(2)
              }
            }
          }
        }
      ],
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
