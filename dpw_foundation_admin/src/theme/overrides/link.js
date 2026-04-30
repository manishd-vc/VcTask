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
        }
      ]
    }
  };
}
