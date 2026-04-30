function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (min-width:0)': {
      fontSize: pxToRem(sm)
    },
    '@media (min-width:600px)': {
      fontSize: pxToRem(md)
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg)
    }
  };
}
// typography
const typography = {
  fontFamily: 'var(--font-pilat)',
  h1: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.3,
    fontSize: pxToRem(92),
    ...responsiveFontSizes({ sm: 44, md: 76, lg: 92 })
  },
  h2: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.3,
    fontSize: pxToRem(76),
    ...responsiveFontSizes({ sm: 36, md: 64, lg: 76 })
  },
  h3: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(64),
    ...responsiveFontSizes({ sm: 32, md: 52, lg: 64 })
  },
  h4: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(44),
    ...responsiveFontSizes({ sm: 28, md: 32, lg: 44 })
  },
  h5: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.25,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 24, md: 28, lg: 32 })
  },
  h6: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 24 / 18,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 14, md: 18, lg: 24 })
  },
  h7: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 })
  } /**
   * Heading 9 typography style.
   */,
  h9: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.25,
    fontSize: pxToRem(36),
    ...responsiveFontSizes({ sm: 24, md: 28, lg: 32 })
  },
  sectionHeader: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(36),
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 36 })
  },
  sectionHeaderSmall: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: pxToRem(28),
    ...responsiveFontSizes({ sm: 16, md: 20, lg: 28 })
  },
  bannerHeader: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(60),
    ...responsiveFontSizes({ sm: 30, md: 50, lg: 60 })
  },
  subtitle1: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 12, md: 14, lg: 16 })
  },
  subtitle2: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 14 })
  },
  subtitle2Bold: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 14 })
  },
  subtitle3: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 24 / 18,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 14, md: 18, lg: 24 })
  },
  cardTitle: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 24 / 18,
    fontSize: pxToRem(28),
    ...responsiveFontSizes({ sm: 16, md: 20, lg: 28 })
  },
  subtitle4: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 }),
    wordWrap: 'break-word'
  },
  subtitle6: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 20 }),
    wordWrap: 'break-word'
  },
  bodyLarge: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 1.5,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 14, md: 18, lg: 24 })
  },
  body1Banner: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 1.8,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 })
  },
  body1: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 })
  },
  body2: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 22 / 14,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 12, md: 14, lg: 16 })
  },
  body3: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 14 })
  },
  caption: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 1.5,
    fontSize: pxToRem(10)
  },
  overline: {
    fontFamily: 'var(--font-pilat)',
    lineHeight: 1.5,
    fontWeight: 600,
    fontSize: pxToRem(12),
    letterSpacing: 1.1,
    textTransform: 'uppercase'
  },
  button: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 24 / 14,
    fontSize: pxToRem(18),
    textTransform: 'capitalize',
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 })
  },
  menulink: {
    fontWeight: 300,
    fontSize: pxToRem(15),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 15 })
  },
  muilink: {
    fontWeight: 300,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 12, md: 14, lg: 16 })
  },
  sidebarmenu: {
    fontWeight: 400,
    fontSize: pxToRem(14),
    whiteSpace: 'normal',
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 14 })
  },
  sidebarMobileMenu: {
    fontWeight: 300,
    fontSize: pxToRem(32)
  },
  MuiInputLabel: {
    fontWeight: 300,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 })
  },
  subHeader: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 20 }),
    textTransform: 'uppercase'
  },
  subHeaderLight: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 20 }),
    textTransform: 'uppercase'
  },
  chip: {
    fontWeight: 300,
    fontSize: pxToRem(12),
    lineHeight: 1
  },
  footerRights: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 14 })
  }
};

export default typography;
