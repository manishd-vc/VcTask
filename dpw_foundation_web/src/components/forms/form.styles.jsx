/**
 * FormStyle function returns a set of custom styles used in the form.
 * The styles are designed to be used with the MUI theme system, ensuring
 * responsiveness and consistency across different screen sizes.
 *
 * @param {Object} theme - The MUI theme object, used to access theme-specific values.
 * @returns {Object} - A collection of style rules for different form elements.
 */
const FormStyle = (theme) => ({
  /**
   * Style for the 'Create' button.
   * - The width of the button adjusts based on the screen size: 48% for xs and 'auto' for sm and larger screens.
   * - Margin-top is set to '0!important' to prevent any default margin-top styling.
   */
  createBtn: {
    width: { xs: '48%', sm: 'auto' }, // Responsive width
    mt: '0!important' // Ensures no margin-top
  },

  /**
   * Style for the OTP input field when it is disabled.
   * - The text is underlined and has a lighter font weight (300).
   * - For hover, it removes the underline and keeps the background transparent.
   * - When the field is disabled, the background becomes transparent, padding is reset,
   *   margin is adjusted, and the text color changes to a grey tone based on the theme.
   */
  disabledOTP: {
    textDecoration: 'underline', // Underline text by default
    fontWeight: 300, // Lighter font weight
    m: 0, // No margin
    p: 0, // No padding
    '&:hover': {
      textDecoration: 'none', // Remove underline on hover
      backgroundColor: 'transparent' // Keep background transparent on hover
    },
    '&.Mui-disabled': {
      backgroundColor: 'transparent', // Transparent background when disabled
      padding: 0, // Reset padding
      margin: '0 0 0 0.313rem', // Adjust margin when disabled
      color: theme.palette.grey[500] // Set color to grey based on the theme
    }
  },

  /**
   * Style for the text formatting, where text is converted to uppercase and underlined.
   * - This is useful for headers or labels that need specific text formatting.
   */
  textFormate: {
    textTransform: 'uppercase', // Converts text to uppercase
    textDecoration: 'underline' // Underlines the text
  }
});

export default FormStyle;
