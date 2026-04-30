// ----------------------------------------------------------------------

export default function Tooltip(theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[isLight ? 900 : 700],
          fontSize: '0.9rem',
          marginTop: 0
        },
        arrow: {
          color: theme.palette.grey[isLight ? 900 : 700]
        },
        popper: {
          '&[data-popper-placement*="bottom"] .MuiTooltip-tooltip': {
            marginTop: '0 !important'
          }
        }
      }
    }
  };
}
