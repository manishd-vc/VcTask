'use client';
// mui
import { GlobalStyles as GlobalThemeStyles } from '@mui/material';
// ----------------------------------------------------------------------

/**
 * GlobalStyles component that applies global CSS resets and custom styles.
 * @returns {JSX.Element} The GlobalStyles component that applies global styles.
 */
export default function GlobalStyles() {
  return (
    <GlobalThemeStyles
      styles={{
        // Reset all elements' margin, padding, and box-sizing to ensure a consistent layout.
        '*': {
          textDecoration: 'none', // Remove text decoration (links, etc.)
          margin: 0, // Remove default margin
          padding: 0, // Remove default padding
          boxSizing: 'border-box' // Use border-box box model for all elements
        },

        // Ensure the HTML element takes up the full height and width of the viewport.
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch' // Enable smooth scrolling on iOS
        },

        // Ensure the body element takes up the full height and width of the viewport.
        body: {
          width: '100%',
          height: '100%'
        },

        // Ensure the #__next element (Next.js root container) takes up the full height and width.
        '#__next': {
          width: '100%',
          height: '100%'
        },

        // Remove the default box-shadow and border-radius for MuiPaper components.
        '.MuiPaper-elevation': {
          borderRadius: '0px', // No border-radius on Paper components
          boxShadow: 'unset' // Remove box-shadow from Paper components
        },

        // Custom styles for number inputs to remove spin buttons.
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield', // Remove the default number input spinner in Firefox
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none' // Remove outer spinner button in Webkit browsers
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none' // Remove inner spinner button in Webkit browsers
            }
          }
        },

        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' }
        }

        // Placeholder styling can be added here, but it's currently commented out.
        // textarea: {
        //   '&::-webkit-input-placeholder': {
        //     color: theme.palette.text.disabled
        //   },
        //   '&::-moz-placeholder': {
        //     opacity: 1,
        //     color: theme.palette.text.disabled
        //   },
        //   '&:-ms-input-placeholder': {
        //     color: theme.palette.text.disabled
        //   },
        //   '&::placeholder': {
        //     color: theme.palette.text.disabled
        //   }
        // },
      }}
    />
  );
}
