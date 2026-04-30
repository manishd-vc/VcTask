'use client';
import { alpha } from '@mui/material/styles';

// Utility function to create linear gradient
/**
 * Creates a linear gradient from two colors.
 * @param {string} color1 - The first color in the gradient.
 * @param {string} color2 - The second color in the gradient.
 * @returns {string} The linear gradient CSS string.
 */
export function createGradient(color1, color2) {
  return `linear-gradient(to right, ${color1}, ${color2})`;
}

/**
 * Creates a vertical linear gradient from two colors (without direction).
 * @param {string} color1 - The first color in the gradient.
 * @param {string} color2 - The second color in the gradient.
 * @returns {string} The linear gradient CSS string.
 */
export function whiteGradient(color1, color2) {
  return `linear-gradient(${color1}, ${color2})`;
}

// SETUP COLORS

/**
 * Grey color palette with different shades for UI components.
 * @type {Object}
 */
const GREY = {
  0: '#FFFFFF',
  100: '#F5F3F5', // Admin background
  200: '#ECECFF', // Top textfield
  300: '#C2C2C2', // Icons
  400: '#D5D5DD', // Divider
  500: '#D9D9D9', // Disabled
  600: '#A9A9AC', // Textfield filled label
  700: '#454F5B',
  800: '#212B36',
  900: '#0F0F19',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#89898E', 0.24), // Textfield label filled
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#D5D5DD', 0.56), // Textfield border bottom
  500_80: alpha('#0F0F19', 0.8)
};

/**
 * Background color palette for light and dark themes.
 * @type {Object}
 */
const BACKGROUNDS = {
  white: '#ffffff',
  light: '#f5f3f5'
};

/**
 * Grey theme color palette for styling.
 * @type {Object}
 */
const GREYTHEME = {
  0: '#3a3a42',
  100: '#d5d5dd',
  200: '#ECECFF',
  300: '#1976d2',
  400: '#D5D5DD',
  500: '#89898e',
  600: '#6E6E72',
  700: '#3E3C90'
};

/**
 * Primary color palette for the theme.
 * @type {Object}
 */
const PRIMARY = {
  light: '#3230be',
  main: '#1e1450',
  mainLight: '#827C9D',
  contrastText: '#ffffff'
};

/**
 * Secondary color palette for the theme.
 * @type {Object}
 */
const SECONDARY = {
  main: '#f5f3f5',
  darker: '#0f0f19',
  darker_60: alpha('#0f0f19', 0.6),
  contrastText: '#ffffff'
};

/**
 * Info color palette for the theme.
 * @type {Object}
 */
const INFO = {
  main: '#3230be',
  contrastText: '#ffffff'
};

/**
 * Success color palette for the theme.
 * @type {Object}
 */
const SUCCESS = {
  main: '#4aa359',
  contrastText: '#ffffff'
};

/**
 * Warning color palette for the theme.
 * @type {Object}
 */
const WARNING = {
  main: '#ffd300',
  dark: '#ff800b',
  contrastText: '#0f0f19'
};

/**
 * Error color palette for the theme.
 * @type {Object}
 */
const ERROR = {
  main: '#b72015',
  contrastText: '#ffffff'
};

/**
 * Gradient color combinations for different UI components.
 * @type {Object}
 */
const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  primaryOpposite: createGradient(PRIMARY.main, PRIMARY.main),
  black: createGradient(SECONDARY.darker, BACKGROUNDS.white),
  blackOpposite: createGradient(BACKGROUNDS.white, SECONDARY.darker),
  switch: createGradient(GREYTHEME[400], BACKGROUNDS.white),
  switchOpposite: createGradient(BACKGROUNDS.white, GREYTHEME[400]),
  info: createGradient(INFO.light, INFO.main),
  background: 'radial-gradient( #DBEAFF, #F3DFE0,#DBCFF3,#DBEAFF)',
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main)
};

/**
 * Chart color palettes for different types of data visualization.
 * @type {Object}
 */
const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4']
};

/**
 * Common colors and gradients used throughout the theme.
 * @type {Object}
 */
const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  grey: GREY,
  greytheme: GREYTHEME,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[400],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  },
  backgrounds: BACKGROUNDS
};

/**
 * Light theme color palette.
 * @type {Object}
 */
const palette = {
  light: {
    ...COMMON,
    divider: GREYTHEME[100],
    text: {
      primary: SECONDARY['darker_60'],
      secondary: PRIMARY.darker,
      secondarydark: SECONDARY.darker,
      blue: PRIMARY.light,
      black: PRIMARY.main,
      white: PRIMARY.contrastText,
      disabled: GREYTHEME[600]
    },
    background: { paper: GREY[0], default: GREY[100] },
    action: { active: GREY[600], ...COMMON.action }
  },
  dark: {
    ...COMMON,
    divider: GREY[700],
    text: { primary: GREY[0], secondary: GREY[500], disabled: GREY[600] },
    background: { paper: GREY[800], default: GREY[900] },
    action: { active: GREY[500], ...COMMON.action }
  }
};

export default palette;
