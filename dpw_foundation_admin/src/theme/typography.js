/**
 * Converts pixel values to rem units.
 * @param {number} value - The value in pixels to convert.
 * @returns {string} The corresponding value in rem units.
 */
function pxToRem(value) {
  return `${value / 16}rem`;
}

/**
 * Generates responsive font sizes for different breakpoints.
 * @param {Object} params - The font size values for different breakpoints.
 * @param {number} params.sm - The font size for small screens (max-width: 600px).
 * @param {number} params.md - The font size for medium screens (min-width: 900px).
 * @param {number} params.lg - The font size for large screens (min-width: 1200px).
 * @returns {Object} The CSS rules for the responsive font sizes.
 */
function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (max-width:600px)': {
      fontSize: pxToRem(sm)
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md)
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg)
    }
  };
}

// Typography object for defining font styles
const typography = {
  fontFamily: 'var(--font-pilat)',

  /**
   * Heading 1 typography style.
   */
  h1: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.3,
    fontSize: pxToRem(92),
    ...responsiveFontSizes({ sm: 44, md: 76, lg: 92 })
  },

  /**
   * Heading 2 typography style.
   */
  h2: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.3,
    fontSize: pxToRem(76),
    ...responsiveFontSizes({ sm: 36, md: 64, lg: 76 })
  },

  /**
   * Heading 3 typography style.
   */
  h3: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(64),
    ...responsiveFontSizes({ sm: 32, md: 52, lg: 64 })
  },

  /**
   * Heading 4 typography style.
   */
  h4: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(44),
    ...responsiveFontSizes({ sm: 28, md: 32, lg: 44 })
  },

  /**
   * Heading 5 typography style.
   */
  h5: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.25,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 24, md: 28, lg: 32 })
  },

  /**
   * Heading 6 typography style.
   */
  h6: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 24 / 18,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 14, md: 18, lg: 24 })
  },

  /**
   * Heading 7 typography style.
   */
  h7: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 })
  },

  /**
   * Heading 8 typography style.
   */
  h8: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 12, md: 14, lg: 16 })
  },

  /**
   * Heading 9 typography style.
   */
  h9: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.25,
    fontSize: pxToRem(36),
    ...responsiveFontSizes({ sm: 24, md: 28, lg: 32 })
  },

  /**
   * Subtitle 1 typography style.
   */
  subtitle1: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(16)
  },

  /**
   * Subtitle 2 typography style.
   */
  subtitle2: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14)
  },

  /**
   * Subtitle 3 typography style.
   */
  subtitle3: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: pxToRem(24)
  },

  /**
   * Subtitle 4 typography style.
   */
  subtitle4: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 }),
    wordWrap: 'break-word'
  },
  subtitle5: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(18)
  },
  subtitle6: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 20 }),
    wordWrap: 'break-word'
  },
  /**
   * Body 1 typography style.
   */
  body1: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 1.5,
    fontSize: pxToRem(18)
  },

  /**
   * Body 2 typography style.
   */
  body2: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 22 / 14,
    fontSize: pxToRem(16)
  },

  /**
   * Body 3 typography style.
   */
  body3: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14)
  },

  /**
   * Caption typography style.
   */
  caption: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 1.5,
    fontSize: pxToRem(10)
  },

  /**
   * Overline typography style.
   */
  overline: {
    fontFamily: 'var(--font-pilat)',
    lineHeight: 1.5,
    fontWeight: 600,
    fontSize: pxToRem(12),
    letterSpacing: 1.1,
    textTransform: 'uppercase'
  },

  /**
   * Button typography style.
   */
  button: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'capitalize'
  },

  /**
   * Menu link typography style.
   */
  menulink: {
    fontWeight: 300,
    fontSize: pxToRem(15)
  },

  /**
   * Mui link typography style.
   */
  muilink: {
    fontWeight: 300,
    fontSize: pxToRem(16)
  },

  /**
   * Sidebar menu typography style.
   */
  sidebarmenu: {
    fontWeight: 400,
    fontSize: pxToRem(14)
  },

  /**
   * Input label typography style.
   */
  MuiInputLabel: {
    fontWeight: 300,
    fontSize: pxToRem(18)
  },

  /**
   * Subheader typography style.
   */
  subHeader: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 600,
    fontSize: pxToRem(20),
    textTransform: 'uppercase'
  },

  /**
   * Chip typography style.
   */
  chip: {
    fontWeight: 300,
    fontSize: pxToRem(12),
    lineHeight: 1
  },
  chartValue: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 300,
    lineHeight: 1.5,
    fontSize: pxToRem(44),
    ...responsiveFontSizes({ sm: 28, md: 32, lg: 44 })
  },
  subHeaderLight: {
    fontFamily: 'var(--font-pilat)',
    fontWeight: 400,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 20 }),
    textTransform: 'uppercase'
  }
};

export default typography;
