/**
 * FormStyle - A function that returns a set of styles for form components, using the Material-UI theme.
 * @param {object} theme - The Material-UI theme object to access theme-specific properties.
 * @returns {object} - Style definitions for specific form elements.
 */
const FormStyle = (theme) => ({
  // Styles for the create button
  createBtn: {
    width: { xs: '48%', sm: 'auto' }, // Responsive width: 48% for extra small screens, auto for small screens and above
    mt: '0!important' // Overrides default margin-top with zero, ensuring no additional spacing
  },

  // Styles for a disabled OTP link/button
  disabledOTP: {
    textDecoration: 'underline', // Underlines the text
    fontWeight: 300, // Thin font weight
    m: 0, // Zero margin
    p: 0, // Zero padding
    '&:hover': {
      textDecoration: 'none', // Removes underline on hover
      backgroundColor: 'transparent' // Keeps background transparent on hover
    },
    '&.Mui-disabled': {
      backgroundColor: 'transparent', // Transparent background when disabled
      padding: 0, // Zero padding
      margin: '0 0 0 0.313rem', // Adds left margin of 0.313rem
      color: theme.palette.grey[500] // Sets text color to a light grey from the theme
    }
  },

  // Styles for text formatting
  textFormate: {
    textTransform: 'uppercase', // Converts text to uppercase
    textDecoration: 'underline' // Adds underline to the text
  }
});

export default FormStyle;
