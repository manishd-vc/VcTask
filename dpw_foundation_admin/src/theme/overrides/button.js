import typography from '../typography';
export default function Button(theme) {
  return {
    MuiButton: {
      variants: [
        {
          props: { variant: 'muilink' },
          style: {
            textTransform: 'none',
            padding: '0',
            minWidth: 'auto',
            height: 'auto !important',
            color: theme.palette.primary.main,
            '&:hover': {
              textDecoration: 'none',
              backgroundColor: 'transparent'
            },
            '&.Mui-disabled': {
              color: `${theme.palette.grey[500_16]}`,
              backgroundColor: 'transparent'
            }
          }
        },
        {
          props: { variant: 'blueLink' },
          style: {
            textDecoration: 'underline',
            padding: '0',
            minWidth: 'auto',
            height: 'auto !important',
            color: theme.palette.primary.light,
            textDecorationColor: theme.palette.primary.light,
            ...typography.MuiInputLabel,
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline'
            }
          }
        }
      ],
      styleOverrides: {
        endIcon: {
          marginLeft: theme.spacing(2),
          marginRight: 0
        },
        root: {
          fontSize: '1.125rem',
          fontWeight: 400,
          lineHeight: '1.6',
          padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
          letterSpacing: '0.2',
          '&:hover': {
            boxShadow: 'none'
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled
          }
        },
        sizeSmall: {
          fontSize: '1rem',
          fontWeight: 300,
          padding: `${theme.spacing(1)} ${theme.spacing(2)}`
        },
        textBack: {
          '&.MuiButton-sizeMedium': {
            height: 24
          },
          '&:hover': { backgroundColor: 'transparent' }
        },

        contained: {
          color: theme.palette.common.white,
          background: theme.palette.gradients.primary,
          borderRadius: '37px',
          transition: 'all ease-in-out 0.3s',
          '&.Mui-disabled': {
            color: `${theme.palette.grey[500_16]}`,
            background: `${theme.palette.grey[500_12]}`
          },
          '&:hover': {
            background: theme.palette.gradients.primaryOpposite
          }
        },
        containedInherit: {
          color: theme.palette.grey[900],
          '&:hover': {
            backgroundColor: theme.palette.grey[400]
          }
        },
        containedSuccess: {
          color: theme.palette.common.white,
          background: theme.palette.success.main,
          '&:hover': { background: theme.palette.success.main }
        },
        containedError: {
          color: theme.palette.common.white,
          background: theme.palette.error.main,
          '&:hover': { background: theme.palette.error.main }
        },
        containedWarning: {
          color: theme.palette.warning.contrastText,
          background: theme.palette.warning.main,
          '&:hover': { background: theme.palette.warning.main }
        },
        outlinedWhite: {
          color: theme.palette.common.black,
          borderRadius: '50em',
          fontWeight: 400,
          background: `
            linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box,
            linear-gradient(to right, ${theme.palette.common.black}, ${theme.palette.common.white}) border-box
          `,
          borderWidth: '0.0625rem',
          borderStyle: 'solid',
          borderColor: 'transparent',
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.action.disabledBackground
          },
          '&:hover': {
            background: `
            linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box,
            linear-gradient(to left, ${theme.palette.common.black}, ${theme.palette.common.white}) border-box
          `,
            borderWidth: '0.0625rem',
            borderStyle: 'solid',
            borderColor: 'transparent'
          }
        },
        outlined: {
          color: theme.palette.common.black,
          borderRadius: '50em',
          fontWeight: 400,
          background: `
            linear-gradient(${theme.palette.grey[100]}, ${theme.palette.grey[100]}) padding-box,
            linear-gradient(to right, ${theme.palette.common.black}, ${theme.palette.common.white}) border-box
          `,
          borderWidth: '0.0625rem',
          borderStyle: 'solid',
          borderColor: 'transparent',
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.action.disabledBackground
          },
          '&:hover': {
            background: `
            linear-gradient(${theme.palette.grey[100]}, ${theme.palette.grey[100]}) padding-box,
            linear-gradient(to left, ${theme.palette.common.black}, ${theme.palette.common.white}) border-box
          `,
            borderWidth: '0.0625rem',
            borderStyle: 'solid',
            borderColor: 'transparent'
          }
        },
        outlinedInherit: {
          border: `0.0625rem solid ${theme.palette.grey[500_32]}`,
          '&:hover': {
            background: `
            linear-gradient(${theme.palette.grey[100]}, ${theme.palette.grey[100]}) padding-box,
            linear-gradient(to left, ${theme.palette.common.black}, ${theme.palette.common.white}) border-box
          `,
            borderWidth: '0.0625rem',
            borderStyle: 'solid',
            borderColor: 'transparent'
          },
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.action.disabledBackground
          }
        },
        text: {
          color: theme.palette.secondary.darker,
          textDecorationColor: theme.palette.secondary.darker,
          paddingLeft: 2,
          paddingRight: 2,
          fontWeight: 400,
          ...theme.typography.subtitle2,
          '&.Mui-disabled': {
            backgroundColor: 'transparent',
            color: theme.palette.greytheme[400]
          },
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'none'
          }
        }
      }
    }
  };
}
