export default function Accordion(theme) {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid transparent',
          borderImage: `linear-gradient(to right, transparent, ${theme.palette.common.black}) 1`,
          backgroundColor: 'transparent',
          margin: 0,
          '&:before': {
            display: 'none'
          },
          '&&.Mui-expanded': {
            margin: '0 !important'
          }
        }
      }
    }
  };
}
