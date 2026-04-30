'use client';
// mui
import { GlobalStyles as GlobalThemeStyles } from '@mui/material'; // Import GlobalStyles component from MUI

// ----------------------------------------------------------------------

export default function GlobalStyles() {
  return (
    // Apply global styles using MUI's GlobalThemeStyles
    <GlobalThemeStyles
      styles={{
        // Reset styles for all elements
        '*': {
          textDecoration: 'none', // Remove text decoration
          margin: 0, // Remove margin
          padding: 0, // Remove padding
          boxSizing: 'border-box' // Box sizing to border-box for all elements
        },

        // Set global styles for HTML element
        html: {
          width: '100%', // Set width to 100%
          height: '100%', // Set height to 100%
          WebkitOverflowScrolling: 'touch' // Enable smooth scrolling on touch devices
        },

        // Set global styles for body element
        body: {
          width: '100%', // Set width to 100%
          height: '100%' // Set height to 100%
        },

        // Set global styles for Next.js container
        '#__next': {
          width: '100%', // Set width to 100%
          height: '100%' // Set height to 100%
        },

        // Customize MUI Paper component elevation
        '.MuiPaper-elevation': {
          borderRadius: '0px', // Remove border radius
          boxShadow: 'unset' // Remove box shadow
        },
        // remove the cookies button
        '#rcc-confirm-button': {
          display: 'none !important'
        },
        //add this style to keep left and right 52px space
        '.MuiContainer-maxWidthXl': {
          maxWidth: '1380px !important'
          // paddingLeft: '8px !important',
          // paddingRight: '8px !important'
        },
        // Customize number input styles
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield', // Remove default number field appearance in Firefox
            '&::-webkit-outer-spin-button': {
              margin: 0, // Remove outer spin button margin
              WebkitAppearance: 'none' // Remove inner spin button appearance
            },
            '&::-webkit-inner-spin-button': {
              margin: 0, // Remove inner spin button margin
              WebkitAppearance: 'none' // Remove inner spin button appearance
            }
          }
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' }
        }
      }}
    />
  );
}
