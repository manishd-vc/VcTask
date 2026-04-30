import typography from '../typography';

export default function Chip(theme) {
  return {
    MuiChip: {
      variants: [
        {
          props: { variant: 'grey' },
          style: {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.palette.greytheme[700]
          }
        },
        {
          props: { variant: 'dropdown' },
          style: {
            ...typography.subtitle4,
            borderRadius: '19px',
            backgroundColor: theme.palette.backgrounds.light,
            color: theme.palette.secondary.darker
          }
        },
        {
          props: { variant: 'dropdownwhite' },
          style: {
            ...typography.subtitle4,
            borderRadius: '19px',
            backgroundColor: theme.palette.backgrounds.white,
            color: theme.palette.secondary.darker,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.palette.greytheme[100]
          }
        },
        {
          props: { variant: 'white' },
          style: {
            ...typography.chip,
            backgroundColor: theme.palette.backgrounds.white,
            color: theme.palette.secondary.darker,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.palette.secondary.main,
            '& strong': {
              fontWeight: 400,
              display: 'inline-block'
            }
          }
        }
      ],
      styleOverrides: {
        root: {
          borderRadius: 2,
          ...theme.typography.chip,
          height: 'auto',
          minHeight: 28,
          minWidth: 82,
          paddingTop: '3px',
          paddingBottom: '5px',
          lineHeight: '1.3' // or '1.5' if using unitless
        },
        sizeSmall: {
          height: '24',
          minHeight: 16,
          fontSize: '0.75rem',
          padding: '2px 8px 4px'
        },
        colorWarning: {
          color: theme.palette.secondary.darker
        },
        colorInfo: {
          backgroundColor: theme.palette.info.main,
          color: theme.palette.info.contrastText
        }
      }
    }
  };
}
