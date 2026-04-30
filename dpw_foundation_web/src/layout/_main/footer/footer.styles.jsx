// mui

const FooterStyles = (theme) => ({
  footerBg: {
    background: theme.palette.gradients.secondary,
    py: 8,
    mt: 12.5,
    [theme.breakpoints.down('md')]: { py: 6, mt: 6 }
  },
  linkTitle: {
    textTransform: 'uppercase',
    pb: 2
  },
  aboutLinks: {
    maxWidth: '80%'
  }
});

export default FooterStyles;
