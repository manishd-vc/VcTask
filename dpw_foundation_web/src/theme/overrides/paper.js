export default function Paper(theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadiusNo,
          boxShadow: theme.shadows[4],
          backgroundImage: 'none'
        }
      },
      variants: [
        {
          props: { variant: 'innerTable' },
          style: {
            background: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadiusNo,
            boxShadow: 'none',
            backgroundImage: 'none',
            padding: '0 !important'
          }
        },
        {
          props: { variant: 'plainPaper' },
          style: {
            background: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadiusNo,
            boxShadow: 'none',
            backgroundImage: 'none'
          }
        }
      ]
    }
  };
}
