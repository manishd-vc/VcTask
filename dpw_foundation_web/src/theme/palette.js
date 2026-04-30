'use client';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// Utility functions for creating gradients

// Creates a linear gradient from left to right between two colors
export function createGradient(color1, color2) {
  return `linear-gradient(to right, ${color1}, ${color2})`;
}

// Creates a linear gradient for white-themed gradients between two colors
export function whiteGradient(color1, color2) {
  return `linear-gradient(${color1}, ${color2})`;
}

// Creates a linear gradient from top to bottom, typically used for footer
export function footerGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS: These are various color schemes and gradients that will be used across the application

// Grey shades for different UI elements
const GREY = {
  0: '#FFFFFF', // White
  100: '#F5F3F5', // Light grey background (admin background)
  200: '#ECECFF', // Lighter grey for input fields
  300: '#C2C2C2', // Grey for icons
  400: '#D5D5DD', // Divider color
  500: '#D9D9D9', // Disabled color
  600: '#A9A9AC', // Textfield filled label
  700: '#454F5B', // Darker grey
  800: '#212B36', // Dark grey
  900: '#0F0F19', // Very dark grey (almost black)
  500_8: alpha('#919EAB', 0.08), // Transparent grey (8% opacity)
  500_12: alpha('#919EAB', 0.12), // Transparent grey (12% opacity)
  500_16: alpha('#919EAB', 0.16), // Transparent grey (16% opacity)
  500_24: alpha('#89898E', 0.24), // Lighter transparent grey
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#D5D5DD', 0.56), // Border color for textfields
  500_80: alpha('#0F0F19', 0.8) // Darker transparent grey (80% opacity)
};

// Background color options
const BACKGROUNDS = {
  white: '#ffffff', // White background
  light: '#f5f3f5' // Light background color
};

// Grey theme colors for different UI elements
const GREYTHEME = {
  0: '#3a3a42', // Dark grey
  100: '#d5d5dd', // Lighter grey
  200: '#ECECFF', // Light grey
  300: '#1976d2', // Blueish grey
  400: '#D5D5DD', // Divider or light grey
  500: '#89898e', // Mid grey
  600: '#6E6E72', // Darker grey
  700: '#3E3C90' // Very dark grey
};

// Primary color palette
const PRIMARY = {
  light: '#3230be', // Light primary color
  main: '#1e1450', // Main primary color
  mainLight: '#827C9D', // Lighter version of primary
  contrastText: '#ffffff' // Contrast text color (white)
};

// Secondary color palette
const SECONDARY = {
  main: '#f5f3f5', // Main secondary color (light)
  darker: '#0f0f19', // Darker version of secondary
  darker_60: alpha('#0f0f19', 0.6), // Semi-transparent dark secondary
  contrastText: '#ffffff' // Contrast text for secondary (white)
};

// Info color palette
const INFO = {
  main: '#3230be', // Info main color (same as primary light)
  contrastText: '#ffffff' // Contrast text color for info (white)
};

// Success color palette
const SUCCESS = {
  main: '#4aa359', // Success main color (green)
  contrastText: '#ffffff' // Contrast text color for success (white)
};

// Warning color palette
const WARNING = {
  main: '#ffd300', // Warning main color (yellow)
  dark: '#ff800b', // Darker warning color
  contrastText: '#0f0f19' // Contrast text color for warning (dark)
};

// Error color palette
const ERROR = {
  main: '#b72015', // Error main color (red)
  contrastText: '#ffffff' // Contrast text color for error (white)
};

// Gradient color setups for different UI components
const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main), // Primary gradient
  primaryOpposite: createGradient(PRIMARY.main, PRIMARY.main), // Reverse primary gradient
  secondaryMain: createGradient(PRIMARY.main, PRIMARY.mainLight), // Secondary gradient
  secondary: footerGradient(PRIMARY.main, PRIMARY.mainLight), // Footer gradient
  black: createGradient(SECONDARY.darker, BACKGROUNDS.white), // Black gradient
  blackOpposite: createGradient(BACKGROUNDS.white, SECONDARY.darker), // Reverse black gradient
  switch: createGradient(GREYTHEME[400], BACKGROUNDS.white), // Switch component gradient
  switchOpposite: createGradient(BACKGROUNDS.white, GREYTHEME[400]), // Reverse switch gradient
  info: createGradient(INFO.main, INFO.main), // Info gradient
  background: 'radial-gradient( #DBEAFF, #F3DFE0, #DBCFF3, #DBEAFF)', // Radial gradient for backgrounds
  success: createGradient(SUCCESS.main, SUCCESS.main), // Success gradient
  warning: createGradient(WARNING.main, WARNING.main), // Warning gradient
  error: createGradient(ERROR.main, ERROR.main) // Error gradient
};

// Chart color palettes for different types of charts
const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4']
};

// Common colors used throughout the app
const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: {
    ...PRIMARY
  },
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
    hover: GREY[500_8], // Hover state color
    selected: GREY[500_16], // Selected state color
    disabled: GREY[500_80], // Disabled state color
    disabledBackground: GREY[400], // Disabled background color
    focus: GREY[500_24], // Focus state color
    hoverOpacity: 0.08, // Hover opacity level
    disabledOpacity: 0.48 // Disabled opacity level
  },
  backgrounds: BACKGROUNDS // Background color schemes
};

// Palette setup for light and dark modes
const palette = {
  light: {
    ...COMMON,
    divider: GREYTHEME[100], // Divider color for light mode
    text: {
      primary: SECONDARY['darker_60'], // Primary text color in light mode
      secondary: PRIMARY.darker, // Secondary text color in light mode
      secondarydark: SECONDARY.darker, // Darker secondary text color
      blue: PRIMARY.light, // Blue text color
      black: PRIMARY.main, // Black text color
      white: PRIMARY.contrastText, // White text color
      disabled: GREYTHEME[600] // Disabled text color
    },
    background: { paper: GREY[0], default: GREY[100] }, // Paper and default background colors
    action: { active: GREY[600], ...COMMON.action } // Active action colors
  },
  dark: {
    ...COMMON,
    divider: GREY[700], // Divider color for dark mode
    text: { primary: GREY[0], secondary: GREY[500], disabled: GREY[600] }, // Text colors for dark mode
    background: { paper: GREY[800], default: GREY[900] }, // Background colors for dark mode
    action: { active: GREY[500], ...COMMON.action } // Active action colors for dark mode
  }
};

// Exporting the palette for use in the theme
export default palette;
