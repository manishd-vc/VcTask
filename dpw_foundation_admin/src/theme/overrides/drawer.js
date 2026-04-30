import { alpha } from '@mui/material';

export default function Drawer(theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: theme.palette.backgrounds.white, // Set background color
          color: theme.palette.text.primary,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          border: 'none',
          py: theme.spacing(2)
        },
        root: {},
        modal: {
          '&[role="presentation"]': {
            '& .MuiDrawer-paperAnchorLeft': {
              border: `1px solid ${theme.palette.background.neutral}!important`,
              boxShadow: `8px 24px 24px 12px ${alpha(theme.palette.grey[900], isLight ? 0.16 : 0.48)}`
            },
            '& .MuiDrawer-paperAnchorRight': {
              border: `1px solid ${theme.palette.background.neutral}!important`,
              boxShadow: `-8px 24px 24px 12px ${alpha(theme.palette.grey[900], isLight ? 0.16 : 0.48)}`
            }
          }
        }
      }
    }
  };
}
