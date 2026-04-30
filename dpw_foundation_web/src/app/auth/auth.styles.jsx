import LoginBanner from '../../../public/images/login-banner.jpg';
// mui

/**
 * AuthStyles Object
 *
 * This object contains the styles used for the authentication-related pages.
 * It applies a background image, adjusts layout, and provides responsive styling using MUI's system.
 */
const AuthStyles = {
  // Styles for the authentication background
  authBg: {
    backgroundImage: `url(${LoginBanner.src})`, // Set the background image
    backgroundPosition: 'center', // Center the background image
    width: '100%', // Ensure the background covers the full width
    minHeight: '100vh', // Ensure the background takes up at least the full viewport height
    display: 'flex', // Use Flexbox for layout
    alignItems: 'center', // Vertically center the content
    backgroundRepeat: 'no-repeat', // Prevent repeating of the background image
    backgroundAttachment: 'fixed', // Make the background fixed while scrolling
    backgroundSize: 'cover', // Ensure the background image covers the entire area
    px: 9, // Padding on the x-axis
    py: 1,
    justifyContent: 'end', // Align content to the right by default
    // Media query for small screens
    '@media (max-width:600px)': {
      px: 2, // Reduce padding on the x-axis for small screens
      justifyContent: 'center' // Center content horizontally for small screens
    }
  },
  // Styles for the paper (content area)
  Paper: {
    p: 4, // Padding inside the paper
    width: '100%', // Ensure it takes up the full width
    maxWidth: '430px', // Set a maximum width for the paper
    position: 'relative', // Ensure the paper is positioned relative for any absolute positioning inside
    '&.register-page': {
      maxWidth: '748px'
    }
  }
};

export default AuthStyles;
