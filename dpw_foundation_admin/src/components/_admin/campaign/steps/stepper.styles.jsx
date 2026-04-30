/**
 * Returns styles for the stepper component based on the provided theme.
 *
 * @param {object} theme - The Material-UI theme object.
 * @returns {object} The style object.
 */
const StepperStyle = (theme) => ({
  moreBox: {
    backgroundColor: theme.palette.backgrounds.light, // Light background color for the box
    position: 'relative', // Positioned relative to allow absolute positioning of child elements
    marginTop: theme.spacing(2), // Margin at the top of the box
    padding: `${theme.spacing(4)} ${theme.spacing(3.5)}` // Padding for the box
  },
  deleteIcon: {
    position: 'absolute', // Absolute positioning for the delete icon
    right: theme.spacing(2), // Positioned 2 spacing units from the right
    top: theme.spacing(1.5), // Positioned 1.5 spacing units from the top
    zIndex: 9, // Ensure the delete icon is on top of other content
    cursor: 'pointer', // Change cursor to pointer to indicate it's clickable
    '&:hover': {
      opacity: 0.8 // Slight opacity change on hover to indicate interaction
    }
  }
});

export default StepperStyle;
