// mui

/**
 * AuthThemeStyles Object
 *
 * This object contains the MUI-based styles used for various elements on authentication-related pages.
 * It handles styling for the title, back button, and OTP input fields, ensuring a consistent theme and appearance.
 */
const AuthThemeStyles = {
  // Styles for the authentication title
  authTitle: {
    my: 3, // Margin on the y-axis (top and bottom)
    lineHeight: '1.2', // Set line height for better spacing
    textTransform: 'uppercase' // Make the text uppercase
  },
  // Styles for the back button
  backButton: {
    position: 'absolute', // Position absolutely relative to the parent
    left: (theme) => theme.spacing(2.5), // Position the button with spacing from the left
    top: (theme) => theme.spacing(2.5) // Position the button with spacing from the top
  },
  // Styles for the OTP input field
  otpInput: {
    input: {
      height: 70, // Set a fixed height for the input
      minWidth: 74, // Set a minimum width for the input field
      bgcolor: (theme) => theme.palette.greytheme[200], // Set background color using the theme palette
      color: (theme) => theme.palette.secondary.darker, // Set text color using the theme palette
      border: 'none', // Remove border by default
      fontWeight: (theme) => theme.typography.h5, // Apply typography styling for font weight
      // Styles for when the input is focused
      '&:focus': {
        borderColor: (theme) => theme.palette.greytheme[300], // Set border color on focus
        outline: 'none', // Remove outline on focus
        border: 'none' // Ensure no border appears on focus
      }
    }
  }
};

export default AuthThemeStyles;
