import { alpha } from '@mui/material';

export default function LinearProgress(theme) {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 2,
          borderRadius: '100px',
          backgroundColor: theme.palette.grey[400],
          width: '366px',
          margin: 'auto'
        },
        bar: {
          borderRadius: '100px',
          backgroundColor: 'transparent',
          background: `linear-gradient(
                        to right,
                        ${alpha(theme.palette.secondary.darker, 0)} 0%,
                        ${alpha(theme.palette.secondary.darker, 0.2)} 50%,
                        ${alpha(theme.palette.secondary.darker, 1)} 100%
                    )`
        }
      }
    }
  };
}
