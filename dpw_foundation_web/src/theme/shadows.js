// Importing necessary functions from MUI
import { alpha } from '@mui/material/styles';
import palette from './palette';

// ----------------------------------------------------------------------

// Define colors for light and dark modes
const LIGHT_MODE = palette.light.grey[500]; // Light mode base color for shadows
const DARK_MODE = '#000000'; // Dark mode base color for shadows

// Function to create shadow effects with varying opacity based on the input color
const createShadow = (color) => {
  // Create transparent versions of the color using MUI's alpha function for different levels
  const transparent1 = alpha(color, 0.2); // 20% opacity
  const transparent2 = alpha(color, 0.14); // 14% opacity
  const transparent3 = alpha(color, 0.12); // 12% opacity

  // Return an array of shadow styles with increasing intensity
  return [
    'none', // No shadow for the first level
    `0px 2px 1px -1px ${transparent1},0px 1px 1px 0px ${transparent2},0px 1px 3px 0px ${transparent3}`,
    `0px 3px 1px -2px ${transparent1},0px 2px 2px 0px ${transparent2},0px 1px 5px 0px ${transparent3}`,
    `0px 3px 3px -2px ${transparent1},0px 3px 4px 0px ${transparent2},0px 1px 8px 0px ${transparent3}`,
    `0px 2px 4px -1px ${transparent1},0px 4px 5px 0px ${transparent2},0px 1px 10px 0px ${transparent3}`,
    `0px 3px 5px -1px ${transparent1},0px 5px 8px 0px ${transparent2},0px 1px 14px 0px ${transparent3}`,
    `0px 3px 5px -1px ${transparent1},0px 6px 10px 0px ${transparent2},0px 1px 18px 0px ${transparent3}`,
    `0px 4px 5px -2px ${transparent1},0px 7px 10px 1px ${transparent2},0px 2px 16px 1px ${transparent3}`,
    `0px 5px 5px -3px ${transparent1},0px 8px 10px 1px ${transparent2},0px 3px 14px 2px ${transparent3}`,
    `0px 8px 8px -6px rgba(15, 15, 25, 0.04)`,
    `0px 6px 6px -3px ${transparent1},0px 10px 14px 1px ${transparent2},0px 4px 18px 3px ${transparent3}`,
    `0px 6px 7px -4px ${transparent1},0px 11px 15px 1px ${transparent2},0px 4px 20px 3px ${transparent3}`,
    `0px 7px 8px -4px ${transparent1},0px 12px 17px 2px ${transparent2},0px 5px 22px 4px ${transparent3}`,
    `0px 7px 8px -4px ${transparent1},0px 13px 19px 2px ${transparent2},0px 5px 24px 4px ${transparent3}`,
    `0px 7px 9px -4px ${transparent1},0px 14px 21px 2px ${transparent2},0px 5px 26px 4px ${transparent3}`,
    `0px 8px 9px -5px ${transparent1},0px 15px 22px 2px ${transparent2},0px 6px 28px 5px ${transparent3}`,
    `0px 8px 10px -5px ${transparent1},0px 16px 24px 2px ${transparent2},0px 6px 30px 5px ${transparent3}`,
    `0px 8px 11px -5px ${transparent1},0px 17px 26px 2px ${transparent2},0px 6px 32px 5px ${transparent3}`,
    `0px 9px 11px -5px ${transparent1},0px 18px 28px 2px ${transparent2},0px 7px 34px 6px ${transparent3}`,
    `0px 9px 12px -6px ${transparent1},0px 19px 29px 2px ${transparent2},0px 7px 36px 6px ${transparent3}`,
    `0px 10px 13px -6px ${transparent1},0px 20px 31px 3px ${transparent2},0px 8px 38px 7px ${transparent3}`,
    `0px 10px 13px -6px ${transparent1},0px 21px 33px 3px ${transparent2},0px 8px 40px 7px ${transparent3}`,
    `0px 10px 14px -6px ${transparent1},0px 22px 35px 3px ${transparent2},0px 8px 42px 7px ${transparent3}`,
    `0px 11px 14px -7px ${transparent1},0px 23px 36px 3px ${transparent2},0px 9px 44px 8px ${transparent3}`,
    `0px 11px 15px -7px ${transparent1},0px 24px 38px 3px ${transparent2},0px 9px 46px 8px ${transparent3}`
  ];
};

// Function to create custom shadow effects with a specific color
const createCustomShadow = (color) => {
  // Create a semi-transparent version of the color
  const transparent = alpha(color, 0.24); // 24% opacity

  // Return an object with custom shadow levels using the transparent color
  return {
    z1: `0 3px 6px rgb(48 51 128 / 10%)`, // Basic shadow for z1
    z8: `0 8px 16px 0 ${transparent}`, // Shadow for z8 with a specific transparent color
    z12: `0 0 2px 0 ${transparent}, 0 12px 24px 0 ${transparent}`, // Shadow for z12
    z16: `0 0 2px 0 ${transparent}, 0 16px 32px -4px ${transparent}`, // Shadow for z16
    z20: `0 0 2px 0 ${transparent}, 0 20px 40px -4px ${transparent}`, // Shadow for z20
    z24: `0 0 4px 0 ${transparent}, 0 24px 48px 0 ${transparent}`, // Shadow for z24
    // Specific custom shadows for different color schemes (primary, secondary, etc.)
    primary: `0px 8px 16px ${alpha(palette.light.primary.main, 0.56)}`, // Primary shadow with a custom alpha
    secondary: `-4px -4px 20px ${alpha(palette.light.secondary.main, 0.24)}`, // Secondary shadow
    info: `0px 8px 16px ${alpha(palette.light.info.main, 0.24)}`, // Info shadow
    success: `0px 8px 16px ${alpha(palette.light.success.main, 0.24)}`, // Success shadow
    warning: `0px 8px 16px ${alpha(palette.light.warning.main, 0.24)}`, // Warning shadow
    error: `0px 8px 16px ${alpha(palette.light.error.main, 0.24)}` // Error shadow
  };
};

// Export the custom shadows for both light and dark modes
export const customShadows = {
  light: createCustomShadow(LIGHT_MODE), // Custom shadows for light mode
  dark: createCustomShadow(DARK_MODE) // Custom shadows for dark mode
};

// Export the shadows for elevation levels
const shadows = {
  light: createShadow(LIGHT_MODE), // Shadows for light mode with varying opacity
  dark: createShadow(DARK_MODE) // Shadows for dark mode with varying opacity
};

// Default export of the shadows for use throughout the application
export default shadows;
