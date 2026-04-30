'use client';
// mui
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

/**
 * RootStyles - A styled component using MUI's Box to apply custom styles to various elements.
 *
 * This component defines custom styles for elements like the gradient background, card, and password card.
 *
 * @param {object} theme - The MUI theme object used to define various spacing and color properties.
 *
 * @returns {JSX.Element} - The styled Box component.
 */
const RootStyles = styled(Box)(({ theme }) => ({
  // Gradient background section with styling for company name
  '& .gradient': {
    background: theme.palette.primary.main, // Primary color background
    width: '100%',
    borderRadius: '0 0 40px 40px', // Rounded bottom corners
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(16),
    '& .company-name': {
      fontWeight: 800, // Bold font weight
      textTransform: 'uppercase', // Uppercase text
      marginTop: theme.spacing(0), // No margin at the top
      marginBottom: theme.spacing(0) // No margin at the bottom
    }
  },
  // Styles for general card component
  '& .card': {
    maxWidth: 560, // Max width of card
    margin: 'auto', // Center the card
    marginTop: '80px', // Margin from the top
    marginBottom: '80px', // Margin from the bottom
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'center', // Center items vertically
    padding: theme.spacing(3, 3) // Padding inside the card
  },
  // Styles for password card with additional button styling
  '& .password-card': {
    maxWidth: 560, // Max width of password card
    margin: 'auto', // Center the card
    marginTop: '80px', // Margin from the top
    marginBottom: '80px', // Margin from the bottom
    padding: theme.spacing(4), // Padding inside the card
    '& .full-width-btn': {
      marginTop: theme.spacing(1) // Margin for buttons inside password card
    }
  }
}));

export default RootStyles;
