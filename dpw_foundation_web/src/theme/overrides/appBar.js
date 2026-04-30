export default function AppBar(theme) {
  return {
    MuiAppBar: {
      variants: [
        {
          props: { variant: 'main' },
          style: {
            background: 'none',
            top: theme.spacing(3),
            [theme.breakpoints.up('md')]: {
              top: theme.spacing(4)
            }
          }
        }
      ],
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: 0,
          backgroundColor: theme.palette.backgrounds.light,
          display: { md: 'block', xs: 'none' },
          '& .MuiToolbar-root': {
            justifyContent: 'space-between',
            backdropFilter: 'blur(6px)',
            borderRadius: 0,
            minHeight: '50px',
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            paddingTop: theme.spacing(1.25),
            paddingBottom: theme.spacing(1.25),
            [theme.breakpoints.down('md')]: {
              paddingRight: theme.spacing(3),
              paddingLeft: theme.spacing(3),
              paddingTop: theme.spacing(3),
              paddingBottom: theme.spacing(4),
              maxHeight: '80px'
            }
          }
        }
      }
    }
  };
}
