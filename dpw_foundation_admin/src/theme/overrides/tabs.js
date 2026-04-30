// ----------------------------------------------------------------------

export default function Tabs(theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiButtonBase-root': {
            ...theme.typography.body3,
            padding: `${theme.spacing(0.7)} ${theme.spacing(2.5)}`,
            borderRadius: 0,
            color: theme.palette.secondary.darker,
            borderBottom: `1px solid ${theme.palette.divider}`,
            minHeight: 36
          },
          '& .Mui-selected': {
            fontWeight: 400,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            color: `${theme.palette.secondary.darker} !important`
          }
        }
      }
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    }
  };
}
