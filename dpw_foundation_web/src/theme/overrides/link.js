import typography from '../typography';

export default function Link(theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover'
      },
      styleOverrides: {
        root: { fontWeight: 600 }
      },
      variants: [
        {
          props: { color: 'primary' },
          style: { color: theme.palette.primary.main }
        },
        {
          props: { color: 'secondary' },
          style: {
            color: theme.palette.secondary.darker,
            textDecorationColor: theme.palette.secondary.darker,
            fontWeight: 600
          }
        },
        {
          props: { variant: 'blue' },
          style: {
            color: theme.palette.primary.light,
            textDecorationColor: theme.palette.primary.light,
            ...typography.MuiInputLabel
          }
        },
        {
          props: { color: 'footerlink' },
          style: {
            color: theme.palette.secondary.main,
            ...typography.subtitle2Bold,
            letterSpacing: '0.2'
          }
        },
        {
          props: { color: 'toplink' },
          style: {
            color: theme.palette.secondary.contrastText,
            letterSpacing: 0.2,
            ...typography.body2
          }
        },
        {
          props: { color: 'sidebarmobilemenu' },
          style: {
            color: theme.palette.secondary.contrastText,
            letterSpacing: 0.2,
            ...typography.sidebarMobileMenu
          }
        }
      ]
    }
  };
}
