export default function Popover(theme) {
  return {
    MuiPopover: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            opacity: '0!important'
          }
        },
        paper: {
          borderRadius: theme.spacing(2),
          border: 'none',
          padding: `${theme.spacing(0)} ${theme.spacing(0)}`,

          '& .MuiMenuItem-root:first-of-type:hover, & .MuiMenuItem-root:first-of-type': {
            borderTopLeftRadius: theme.spacing(2),
            borderTopRightRadius: theme.spacing(2)
          },
          '& .MuiMenuItem-root:last-of-type:hover, & .MuiMenuItem-root:last-of-type': {
            borderBottomLeftRadius: theme.spacing(2),
            borderBottomRightRadius: theme.spacing(2)
          }
        }
      }
    }
  };
}
